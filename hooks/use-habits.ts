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
      const now = Date.now();

      try {
        // Query DB directly to avoid stale closure issues
        const existing = await db.habitLogs
          .where('[habitId+date]')
          .equals([habitId, currentDate])
          .first();

        if (existing?.id != null) {
          const newValue = existing.value + step;
          await db.habitLogs.update(existing.id, {
            value: newValue,
            timestamp: now,
          });
        } else {
          await db.habitLogs.add({
            habitId,
            date: currentDate,
            value: step,
            timestamp: now,
          });
        }

        // Sync state from DB
        const logsData = await db.habitLogs.where("date").equals(currentDate).toArray();
        if (mountedRef.current) {
          setHabitLogs(logsData);
        }
      } catch (err) {
        console.error("Failed to save habit log:", err);
      }
    },
    [],
  );

  /* ── Optimistic decrement ── */
  const decrement = useCallback(
    async (habitId: number, step: number) => {
      const currentDate = dateRef.current;
      const now = Date.now();

      try {
        const existing = await db.habitLogs
          .where('[habitId+date]')
          .equals([habitId, currentDate])
          .first();

        if (!existing?.id) return;

        const newValue = existing.value - step;
        if (newValue <= 0) {
          await db.habitLogs.delete(existing.id);
        } else {
          await db.habitLogs.update(existing.id, {
            value: newValue,
            timestamp: now,
          });
        }

        // Sync state from DB
        const logsData = await db.habitLogs.where("date").equals(currentDate).toArray();
        if (mountedRef.current) {
          setHabitLogs(logsData);
        }
      } catch (err) {
        console.error("Failed to save habit log:", err);
      }
    },
    [],
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
