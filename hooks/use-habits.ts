"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import db, {
  type Habit,
  type HabitLog,
} from "@/lib/db";

/* ─── Types ─── */

export interface UseHabitsReturn {
  habits: Habit[];
  habitLogs: HabitLog[];
  loading: boolean;
  error: boolean;
  increment: (habitId: number, step: number) => Promise<void>;
  decrement: (habitId: number, step: number) => Promise<void>;
  addHabit: (habit: {
    name: string;
    type: "exercise" | "walk" | "hydration" | "custom";
    target: number;
    unit: string;
    increment: number;
  }) => Promise<void>;
  deleteHabit: (habitId: number) => Promise<void>;
  updateHabit: (habitId: number, patch: Partial<Omit<Habit, "id">>) => Promise<void>;
  refresh: () => Promise<void>;
  /** O(1) log lookup by habitId for the current date */
  logFor: (habitId: number) => HabitLog | undefined;
}

/* ─── Helpers ─── */

function buildLogMap(logs: HabitLog[], date: string): Map<number, HabitLog> {
  const map = new Map<number, HabitLog>();
  for (const log of logs) {
    if (log.date === date) {
      map.set(log.habitId, log);
    }
  }
  return map;
}

/* ─── Hook ─── */

export function useHabits(date: string): UseHabitsReturn {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const mountedRef = useRef(true);
  const dateRef = useRef(date);

  /* ── Load habits + logs ── */
  const load = useCallback(async () => {
    mountedRef.current = true;
    dateRef.current = date;
    try {
      const [habitsData, logsData] = await Promise.all([
        db.habits.toArray(),
        db.habitLogs.where("date").equals(dateRef.current).toArray(),
      ]);
      if (!mountedRef.current) return;
      setHabits(habitsData);
      setHabitLogs(logsData);
      setError(false);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load habits:", err);
      if (mountedRef.current) {
        setLoading(false);
        setError(true);
      }
    }
  }, [date]);

  useEffect(() => {
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  /* ── O(1) log lookup ── */
  const logMap = useMemo(() => buildLogMap(habitLogs, date), [habitLogs, date]);

  const logFor = useCallback(
    (habitId: number) => logMap.get(habitId),
    [logMap],
  );

  /* ── Optimistic increment ── */
  const increment = useCallback(
    async (habitId: number, step: number) => {
      const currentDate = dateRef.current;

      // Snapshot for rollback
      const prevLogs = habitLogs;

      // Optimistic: compute new log locally
      const existing = prevLogs.find(
        (l) => l.habitId === habitId && l.date === currentDate,
      );
      const newValue = (existing?.value ?? 0) + step;
      const now = Date.now();

      const optimisticLog: HabitLog = existing?.id != null
        ? { ...existing, value: newValue, timestamp: now }
        : { id: 0, habitId, date: currentDate, value: newValue, timestamp: now };

      // Apply optimistic update
      setHabitLogs((prev) => {
        const idx = prev.findIndex(
          (l) => l.habitId === habitId && l.date === currentDate,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = optimisticLog;
          return next;
        }
        return [...prev, optimisticLog];
      });

      // Persist to DB
      try {
        if (existing?.id != null) {
          await db.habitLogs.update(existing.id, {
            value: newValue,
            timestamp: now,
          });
          // Patch with real id
          if (optimisticLog.id === 0) {
            optimisticLog.id = existing.id;
          }
        } else {
          const id = await db.habitLogs.add({
            habitId,
            date: currentDate,
            value: newValue,
            timestamp: now,
          });
          optimisticLog.id = id;
          // Update state with real id
          setHabitLogs((prev) =>
            prev.map((l) =>
              l === optimisticLog ? { ...l, id } : l,
            ),
          );
        }
      } catch (err) {
        console.error("Failed to save habit log:", err);
        // Rollback
        setHabitLogs(prevLogs);
      }
    },
    [habitLogs],
  );

  /* ── Optimistic decrement ── */
  const decrement = useCallback(
    async (habitId: number, step: number) => {
      const currentDate = dateRef.current;

      // Snapshot for rollback
      const prevLogs = habitLogs;

      // Optimistic: compute new value
      const existing = prevLogs.find(
        (l) => l.habitId === habitId && l.date === currentDate,
      );
      if (!existing) return;

      const newValue = Math.max(0, existing.value - step);
      const now = Date.now();

      // Apply optimistic update
      if (newValue <= 0) {
        // Remove log entry
        setHabitLogs((prev) =>
          prev.filter(
            (l) => !(l.habitId === habitId && l.date === currentDate),
          ),
        );
      } else {
        const optimisticLog = { ...existing, value: newValue, timestamp: now };
        setHabitLogs((prev) =>
          prev.map((l) =>
            l.habitId === habitId && l.date === currentDate
              ? optimisticLog
              : l,
          ),
        );
      }

      // Persist to DB
      try {
        if (newValue <= 0) {
          if (existing.id != null) {
            await db.habitLogs.delete(existing.id);
          }
        } else if (existing.id != null) {
          await db.habitLogs.update(existing.id, {
            value: newValue,
            timestamp: now,
          });
        }
      } catch (err) {
        console.error("Failed to save habit log:", err);
        // Rollback
        setHabitLogs(prevLogs);
      }
    },
    [habitLogs],
  );

  /* ── Optimistic add habit ── */
  const addHabit = useCallback(
    async (habit: {
      name: string;
      type: "exercise" | "walk" | "hydration" | "custom";
      target: number;
      unit: string;
      increment: number;
    }) => {
      const prevHabits = habits;

      // Optimistic: add with temp id
      const tempId = -(Date.now());
      const optimistic: Habit = { ...habit, id: tempId };
      setHabits((prev) => [...prev, optimistic]);

      try {
        const id = await db.habits.add(habit as Habit);
        // Replace temp id with real id
        setHabits((prev) =>
          prev.map((h) => (h.id === tempId ? { ...h, id } : h)),
        );
      } catch (err) {
        console.error("Failed to add habit:", err);
        // Rollback
        setHabits(prevHabits);
      }
    },
    [habits],
  );

  /* ── Optimistic delete habit ── */
  const deleteHabit = useCallback(
    async (habitId: number) => {
      const prevHabits = habits;
      const prevLogs = habitLogs;

      // Optimistic: remove
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      setHabitLogs((prev) => prev.filter((l) => l.habitId !== habitId));

      try {
        await db.habits.delete(habitId);
        // Also delete all logs for this habit
        await db.habitLogs.where("habitId").equals(habitId).delete();
      } catch (err) {
        console.error("Failed to delete habit:", err);
        // Rollback
        setHabits(prevHabits);
        setHabitLogs(prevLogs);
      }
    },
    [habits, habitLogs],
  );

  /* ── Optimistic update habit ── */
  const updateHabit = useCallback(
    async (habitId: number, patch: Partial<Omit<Habit, "id">>) => {
      const prevHabits = habits;

      // Optimistic: merge patch
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, ...patch } : h)),
      );

      try {
        await db.habits.update(habitId, patch);
      } catch (err) {
        console.error("Failed to update habit:", err);
        // Rollback
        setHabits(prevHabits);
      }
    },
    [habits],
  );

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    habits,
    habitLogs,
    loading,
    error,
    increment,
    decrement,
    addHabit,
    deleteHabit,
    updateHabit,
    refresh: load,
    logFor,
  };
}
