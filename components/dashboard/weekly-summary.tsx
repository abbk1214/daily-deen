"use client"

import { memo, useEffect, useState } from "react"
import { DashboardCard } from "./dashboard-card"
import { getToday, daysAgo } from "@/lib/utils"
import { getWeek } from "@/lib/prayer/history-service"
import db from "@/lib/db"

interface WeeklyStats {
  prayersCompleted: number
  prayersTotal: number
  habitsCompleted: number
  habitsTotal: number
  quranPages: number
  journalEntries: number
  avgMood: number | null
  avgWater: number
  totalExerciseMin: number
  avgSleepHours: number | null
}

export const WeeklySummary = memo(function WeeklySummary() {
  const [stats, setStats] = useState<WeeklyStats | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const today = getToday()
        const weekStart = daysAgo(6)

        // Prayer data from prayerLogs (single source of truth)
        const weekLogs = await getWeek(weekStart)
        const todayLogs = weekLogs.filter(l => l.date <= today)

        let prayersCompleted = 0
        prayersCompleted = todayLogs.filter(l => l.completed).length
        const prayersTotal = todayLogs.length || 5 * 7 // fallback if no logs yet

        // Habit data
        const habitLogs = await db.habitLogs
          .where("date")
          .between(weekStart, today, true, true)
          .toArray()

        const habits = await db.habits.toArray()
        let habitsCompleted = 0
        let habitsTotal = 0
        for (const h of habits) {
          const dayLogs = habitLogs.filter((l) => l.habitId === h.id)
          const totalValue = dayLogs.reduce((sum, l) => sum + l.value, 0)
          if (totalValue >= h.target) habitsCompleted++
          habitsTotal++
        }

        // Quran data
        const khatmah = await db.khatmahProgress
          .where("date")
          .between(weekStart, today, true, true)
          .toArray()
        const quranPages = khatmah.reduce((sum, k) => sum + k.pagesRead, 0)

        // Journal data
        const journal = await db.journal
          .where("date")
          .between(weekStart, today, true, true)
          .toArray()

        // Health data
        const [moodEntries, waterEntries, sleepEntries, exerciseEntries] = await Promise.all([
          db.moodEntries.where("date").between(weekStart, today, true, true).toArray(),
          db.waterEntries.where("date").between(weekStart, today, true, true).toArray(),
          db.sleepEntries.where("date").between(weekStart, today, true, true).toArray(),
          db.exerciseEntries.where("date").between(weekStart, today, true, true).toArray(),
        ])

        // Mood: map text to number for averaging
        const moodValues: Record<string, number> = { Great: 5, Good: 4, Okay: 3, Low: 2, Bad: 1 }
        const moodNums = moodEntries.map((e) => moodValues[e.mood]).filter((n) => n !== undefined)
        const avgMood = moodNums.length > 0
          ? moodNums.reduce((a, b) => a + b, 0) / moodNums.length
          : null

        // Water
        const totalWaterMl = waterEntries.reduce((sum, e) => sum + e.amount, 0)
        const avgWater = Math.round(totalWaterMl / 7 / 100) / 10 // liters per day

        // Exercise
        const totalExerciseMin = exerciseEntries.reduce((sum, e) => sum + e.duration, 0)

        // Sleep
        const sleepDurations = sleepEntries.map((e) => e.duration)
        const avgSleepHours = sleepDurations.length > 0
          ? Math.round(sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length / 60 * 10) / 10
          : null

        setStats({
          prayersCompleted,
          prayersTotal,
          habitsCompleted,
          habitsTotal,
          quranPages,
          journalEntries: journal.length,
          avgMood,
          avgWater,
          totalExerciseMin,
          avgSleepHours,
        })
      } catch {
        // Silently degrade
      }
    }
    load()
  }, [])

  if (!stats) return null

  const prayerPercent = stats.prayersTotal > 0
    ? Math.round((stats.prayersCompleted / stats.prayersTotal) * 100)
    : 0

  const items = [
    {
      label: "Prayers",
      value: `${stats.prayersCompleted}/${stats.prayersTotal}`,
      percent: prayerPercent,
    },
    {
      label: "Habits",
      value: `${stats.habitsCompleted}/${stats.habitsTotal}`,
      percent: stats.habitsTotal > 0
        ? Math.round((stats.habitsCompleted / stats.habitsTotal) * 100)
        : 0,
    },
    {
      label: "Quran",
      value: `${stats.quranPages} pages`,
      percent: Math.min(100, Math.round((stats.quranPages / 21) * 100)),
    },
    {
      label: "Journal",
      value: `${stats.journalEntries}/7`,
      percent: Math.round((stats.journalEntries / 7) * 100),
    },
    {
      label: "Water",
      value: `${stats.avgWater}L/day`,
      percent: Math.min(100, Math.round((stats.avgWater / 2) * 100)),
    },
    {
      label: "Exercise",
      value: `${stats.totalExerciseMin}min`,
      percent: Math.min(100, Math.round((stats.totalExerciseMin / 210) * 100)), // 30min/day target
    },
    ...(stats.avgMood !== null ? [{
      label: "Mood",
      value: `${stats.avgMood.toFixed(1)}/5`,
      percent: Math.round((stats.avgMood / 5) * 100),
    }] : []),
    ...(stats.avgSleepHours !== null ? [{
      label: "Sleep",
      value: `${stats.avgSleepHours}h`,
      percent: Math.min(100, Math.round((stats.avgSleepHours / 8) * 100)),
    }] : []),
  ]

  return (
    <DashboardCard title="This Week" ariaLabel="Weekly summary">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            <div className="flex items-center justify-between">
              <span
                className="text-muted-foreground"
                style={{ fontSize: "var(--text-caption)" }}
              >
                {item.label}
              </span>
              <span
                className="text-foreground"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono-sm)",
                  fontWeight: 500,
                }}
              >
                {item.value}
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={item.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full rounded-full"
              style={{
                height: 3,
                background: "var(--muted)",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.percent}%`,
                  background: item.percent >= 80
                    ? "var(--dd-quiet-sage)"
                    : item.percent >= 50
                      ? "var(--dd-lantern-gold)"
                      : "var(--muted-foreground)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
})
