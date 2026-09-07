"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  type Habit,
  type HabitLog,
} from "@/lib/db";
import { getTodaysPrayerStatus } from "@/lib/prayer-actions";
import { useHabits } from "@/hooks/use-habits";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { getToday } from "@/lib/utils";
import type { PrayerTimes } from "@/lib/prayer";

type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

interface DashboardData {
  prayerStatus: Record<PrayerName, boolean>;
  computedTimes: PrayerTimes | null;
  habits: Habit[];
  habitLogs: HabitLog[];
  loading: boolean;
  nextPrayer: { name: string; minutesUntil: number } | null;
}

export function useDashboardData(): DashboardData & {
  incrementHabit: (habitId: number, step: number) => Promise<void>;
  decrementHabit: (habitId: number, step: number) => Promise<void>;
  refreshPrayers: () => void;
} {
  const [currentDate, setCurrentDate] = useState(getToday);

  const {
    habits,
    habitLogs,
    increment,
    decrement,
  } = useHabits(currentDate);

  const {
    times: computedTimes,
    loading: prayerLoading,
    nextPrayer,
    refresh: refreshPrayers,
  } = usePrayerTimes();

  const [prayerStatus, setPrayerStatus] = useState<Record<PrayerName, boolean>>({
    fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    getTodaysPrayerStatus()
      .then((data) => {
        if (mountedRef.current) {
          setPrayerStatus(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load prayer data:", error);
      });

    return () => {
      mountedRef.current = false;
    };
  }, [currentDate]);

  // Refresh when date changes (e.g., past midnight)
  useEffect(() => {
    const checkDate = () => {
      const today = getToday();
      if (today !== currentDate) {
        setCurrentDate(today);
      }
    };

    const interval = setInterval(checkDate, 60_000);
    return () => clearInterval(interval);
  }, [currentDate]);

  // Merge scheduled times from computed times into status (for display)
  const mergedStatus = useMemo(() => {
    return prayerStatus;
  }, [prayerStatus]);

  return {
    prayerStatus: mergedStatus,
    computedTimes,
    habits,
    habitLogs,
    loading: prayerLoading && Object.values(prayerStatus).every(v => !v),
    nextPrayer,
    incrementHabit: increment,
    decrementHabit: decrement,
    refreshPrayers,
  };
}
