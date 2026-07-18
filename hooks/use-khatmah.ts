"use client";

import { useState, useCallback, useEffect } from "react";
import {
  addKhatmahGoal,
  getActiveKhatmahGoal,
  getAllKhatmahGoals,
  deactivateKhatmahGoal,
  logKhatmahProgress,
  getKhatmahProgress,
  logReadingSession,
  getReadingSessions,
} from "@/lib/db";
import type {
  KhatmahGoal,
  KhatmahProgress,
  ReadingSessionLog,
} from "@/lib/db";

const TOTAL_PAGES = 604;
const TOTAL_JUZ = 30;
const TOTAL_AYAHS = 6236;

export function useKhatmah() {
  const [goal, setGoal] = useState<KhatmahGoal | null>(null);
  const [allGoals, setAllGoals] = useState<KhatmahGoal[]>([]);
  const [progress, setProgress] = useState<KhatmahProgress[]>([]);
  const [sessions, setSessions] = useState<ReadingSessionLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [activeGoal, goals, prog, sess] = await Promise.all([
        getActiveKhatmahGoal(),
        getAllKhatmahGoals(),
        getKhatmahProgress(),
        getReadingSessions(),
      ]);
      setGoal(activeGoal);
      setAllGoals(goals);
      setProgress(prog);
      setSessions(sess);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createGoal = useCallback(
    async (type: KhatmahGoal["type"], target: number) => {
      if (goal?.id) await deactivateKhatmahGoal(goal.id);
      const newGoal = await addKhatmahGoal(type, target, new Date().toISOString().split("T")[0]);
      await refresh();
      return newGoal;
    },
    [goal, refresh],
  );

  const addProgress = useCallback(
    async (entry: {
      pagesRead: number;
      juzRead: number;
      ayahsRead: number;
      duration: number;
      lastPage: number;
      lastJuz: number;
    }) => {
      await logKhatmahProgress(entry);
      await refresh();
    },
    [refresh],
  );

  const addSession = useCallback(
    async (session: {
      startTime: number;
      endTime: number;
      duration: number;
      pagesRead: number;
      ayahsRead: number;
      startPage: number;
      endPage: number;
    }) => {
      await logReadingSession(session);
      await refresh();
    },
    [refresh],
  );

  const stats = useCallback(() => {
    const totalPages = progress.reduce((sum, p) => sum + p.pagesRead, 0);
    const totalAyahs = progress.reduce((sum, p) => sum + p.ayahsRead, 0);
    const totalMinutes = progress.reduce((sum, p) => sum + p.duration, 0);
    const totalDays = progress.length;

    const pagesPerDay = totalDays > 0 ? totalPages / totalDays : 0;
    const ayahsPerDay = totalDays > 0 ? totalAyahs / totalDays : 0;

    const remainingPages = Math.max(0, TOTAL_PAGES - totalPages);
    const estimatedDays = pagesPerDay > 0 ? Math.ceil(remainingPages / pagesPerDay) : 0;

    const percentComplete = Math.min(100, (totalPages / TOTAL_PAGES) * 100);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const sorted = [...progress].sort((a, b) => b.date.localeCompare(a.date));

    if (sorted.length > 0 && sorted[0].date === today) {
      tempStreak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1].date);
        const curr = new Date(sorted[i].date);
        const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.abs(diff - 1) < 0.5) {
          tempStreak++;
        } else {
          break;
        }
      }
      currentStreak = tempStreak;
    }

    tempStreak = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sorted[i - 1].date);
        const curr = new Date(sorted[i].date);
        const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.abs(diff - 1) < 0.5) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      totalPagesRead: totalPages,
      totalAyahsRead: totalAyahs,
      totalMinutes,
      totalDays,
      currentStreak,
      longestStreak,
      completedKhatmahs: Math.floor(totalPages / TOTAL_PAGES),
      pagesPerDay: Math.round(pagesPerDay * 10) / 10,
      ayahsPerDay: Math.round(ayahsPerDay * 10) / 10,
      estimatedDaysToComplete: estimatedDays,
      percentComplete: Math.round(percentComplete * 10) / 10,
      totalPages: TOTAL_PAGES,
      totalJuz: TOTAL_JUZ,
      totalAyahs: TOTAL_AYAHS,
    };
  }, [progress]);

  return {
    goal,
    allGoals,
    progress,
    sessions,
    loading,
    stats,
    createGoal,
    addProgress,
    addSession,
    refresh,
  };
}
