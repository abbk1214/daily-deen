"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import db, {
  type Prayer,
  type Habit,
  type HabitLog,
} from "@/lib/db";
import { getTodaysPrayers } from "@/lib/prayer-actions";
import { getToday } from "@/lib/utils";
import { incrementHabitLog, decrementHabitLog } from "@/lib/habit-actions";

interface DashboardData {
  prayers: Prayer | undefined;
  habits: Habit[];
  habitLogs: HabitLog[];
  loading: boolean;
}

async function fetchDashboardData() {
  const today = getToday();
  const [prayerData, habitsData, logsData] = await Promise.all([
    getTodaysPrayers(),
    db.habits.toArray(),
    db.habitLogs.where("date").equals(today).toArray(),
  ]);
  return { prayers: prayerData, habits: habitsData, habitLogs: logsData };
}

export function useDashboardData(): DashboardData & {
  incrementHabit: (habitId: number, step: number) => Promise<void>;
  decrementHabit: (habitId: number, step: number) => Promise<void>;
} {
  const [prayers, setPrayers] = useState<Prayer | undefined>(undefined);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    fetchDashboardData()
      .then((data) => {
        if (!cancelled && mountedRef.current) {
          setPrayers(data.prayers);
          setHabits(data.habits);
          setHabitLogs(data.habitLogs);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to load dashboard data:", error);
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, []);

  const incrementHabit = useCallback(
    async (habitId: number, step: number) => {
      const today = getToday();
      const updatedLog = await incrementHabitLog(habitId, today, step);

      setHabitLogs((prev) => {
        const idx = prev.findIndex((l) => l.habitId === habitId && l.date === today);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedLog;
          return next;
        }
        return [...prev, updatedLog];
      });
    },
    [],
  );

  const decrementHabit = useCallback(
    async (habitId: number, step: number) => {
      const today = getToday();
      const updatedLog = await decrementHabitLog(habitId, today, step);

      setHabitLogs((prev) => {
        const idx = prev.findIndex((l) => l.habitId === habitId && l.date === today);
        if (idx >= 0) {
          if (!updatedLog) {
            const next = [...prev];
            next.splice(idx, 1);
            return next;
          }
          const next = [...prev];
          next[idx] = updatedLog;
          return next;
        }
        return prev;
      });
    },
    [],
  );

  return {
    prayers,
    habits,
    habitLogs,
    loading,
    incrementHabit,
    decrementHabit,
  };
}
