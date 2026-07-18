"use client";

import { useEffect, useState } from "react";
import db from "@/lib/db";
import type { Prayer } from "@/lib/db";
import { getToday, daysAgo } from "@/lib/utils";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: number;
  todayTotal: number;
  freezesRemaining: number;
  lastCompletedDate: string | null;
  weeklyCompletion: number[];
}

const MAX_FREEZES = 2;

export function useStreaks(): { data: StreakData | null; loading: boolean } {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function computeStreaks() {
      try {
        const today = getToday();
        const prayers = await db.prayers.where('date').aboveOrEqual(daysAgo(90)).toArray();

        if (prayers.length === 0) {
          if (!cancelled) {
            setData({
              currentStreak: 0,
              longestStreak: 0,
              todayCompleted: 0,
              todayTotal: 5,
              freezesRemaining: MAX_FREEZES,
              lastCompletedDate: null,
              weeklyCompletion: [0, 0, 0, 0, 0, 0, 0],
            });
            setLoading(false);
          }
          return;
        }

        // Build completion map for last 90 days
        const completionMap = new Map<string, number>();
        const todayPrayer = prayers.find((p: Prayer) => p.date === today);
        const todayCompleted = todayPrayer
          ? Object.values(todayPrayer.completed).filter(Boolean).length
          : 0;

        for (let i = 0; i < 90; i++) {
          const date = daysAgo(i);
          const dayPrayer = prayers.find((p: Prayer) => p.date === date);
          if (dayPrayer) {
            const count = Object.values(dayPrayer.completed).filter(Boolean).length;
            completionMap.set(date, count);
          }
        }

        // Compute current streak (backwards from today)
        let currentStreak = 0;
        let lastCompletedDate: string | null = null;

        // Start from yesterday if today isn't complete yet
        const startDay = todayCompleted === 5 ? 0 : 1;

        for (let i = startDay; i < 90; i++) {
          const date = daysAgo(i);
          const count = completionMap.get(date) ?? 0;

          if (count === 5) {
            currentStreak++;
            if (!lastCompletedDate) lastCompletedDate = date;
          } else if (i === startDay && count > 0) {
            // Today is partial — don't break streak yet
            continue;
          } else {
            // Allow one missed day if yesterday was complete (freeze recovery)
            if (i === startDay && currentStreak === 0) {
              continue;
            }
            break;
          }
        }

        // Compute longest streak
        let longestStreak = 0;
        let tempStreak = 0;
        for (let i = 89; i >= 0; i--) {
          const date = daysAgo(i);
          const count = completionMap.get(date) ?? 0;
          if (count === 5) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
        longestStreak = Math.max(longestStreak, currentStreak);

        // Weekly completion
        const weeklyCompletion: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = daysAgo(i);
          const count = completionMap.get(date) ?? 0;
          weeklyCompletion.push(Math.round((count / 5) * 100));
        }

        if (!cancelled) {
          setData({
            currentStreak,
            longestStreak,
            todayCompleted,
            todayTotal: 5,
            freezesRemaining: MAX_FREEZES,
            lastCompletedDate,
            weeklyCompletion,
          });
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    computeStreaks();

    // Refresh every minute
    const interval = setInterval(computeStreaks, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, loading };
}
