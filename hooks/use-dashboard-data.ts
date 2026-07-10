"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Prayer,
  type Habit,
  type HabitLog,
} from "@/lib/db";
import { getTodaysPrayers, seedTodaysPrayers } from "@/lib/prayer-actions";
import { useHabits } from "@/hooks/use-habits";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { getToday, formatTimeFromMinutes } from "@/lib/utils";
import type { PrayerTimes } from "@/lib/prayer";

interface DashboardData {
  prayers: Prayer | undefined;
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
  const today = getToday();

  const {
    habits,
    habitLogs,
    increment,
    decrement,
  } = useHabits(today);

  const {
    times: computedTimes,
    loading: prayerLoading,
    nextPrayer,
    refresh: refreshPrayers,
  } = usePrayerTimes();

  const [prayers, setPrayers] = useState<Prayer | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    getTodaysPrayers()
      .then((data) => {
        if (mountedRef.current) {
          setPrayers(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load prayer data:", error);
      });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mergedPrayers = prayers && computedTimes
    ? {
        ...prayers,
        fajr: formatTimeFromMinutes(computedTimes.fajr),
        dhuhr: formatTimeFromMinutes(computedTimes.dhuhr),
        asr: formatTimeFromMinutes(computedTimes.asr),
        maghrib: formatTimeFromMinutes(computedTimes.maghrib),
        isha: formatTimeFromMinutes(computedTimes.isha),
      }
    : prayers;

  // Seed computed prayer times to IndexedDB for offline persistence
  useEffect(() => {
    if (!computedTimes) return;
    seedTodaysPrayers({
      fajr: formatTimeFromMinutes(computedTimes.fajr),
      dhuhr: formatTimeFromMinutes(computedTimes.dhuhr),
      asr: formatTimeFromMinutes(computedTimes.asr),
      maghrib: formatTimeFromMinutes(computedTimes.maghrib),
      isha: formatTimeFromMinutes(computedTimes.isha),
    }).catch(() => {});
  }, [computedTimes]);

  return {
    prayers: mergedPrayers,
    computedTimes,
    habits,
    habitLogs,
    loading: prayerLoading && !prayers,
    nextPrayer,
    incrementHabit: increment,
    decrementHabit: decrement,
    refreshPrayers,
  };
}
