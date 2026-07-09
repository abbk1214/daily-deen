"use client";

import { useEffect, useState, useRef } from "react";
import {
  type Prayer,
  type Habit,
  type HabitLog,
} from "@/lib/db";
import { getTodaysPrayers } from "@/lib/prayer-actions";
import { useHabits } from "@/hooks/use-habits";
import { getToday } from "@/lib/utils";

interface DashboardData {
  prayers: Prayer | undefined;
  habits: Habit[];
  habitLogs: HabitLog[];
  loading: boolean;
}

export function useDashboardData(): DashboardData & {
  incrementHabit: (habitId: number, step: number) => Promise<void>;
  decrementHabit: (habitId: number, step: number) => Promise<void>;
} {
  const today = getToday();

  const {
    habits,
    habitLogs,
    increment,
    decrement,
  } = useHabits(today);

  const [prayers, setPrayers] = useState<Prayer | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    getTodaysPrayers()
      .then((data) => {
        if (mountedRef.current) {
          setPrayers(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to load prayer data:", error);
        if (mountedRef.current) {
          setLoading(false);
        }
      });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    prayers,
    habits,
    habitLogs,
    loading,
    incrementHabit: increment,
    decrementHabit: decrement,
  };
}
