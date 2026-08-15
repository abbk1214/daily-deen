"use client"

import { memo, useEffect, useState } from "react"
import Link from "next/link"
import { Droplets, Moon, Activity, Smile, ChevronRight } from "lucide-react"
import db from "@/lib/db"
import { getToday, formatDuration } from "@/lib/utils"

interface TodayHealth {
  mood: { emoji: string; label: string } | null
  water: { current: number; target: number } | null
  sleep: { duration: number; quality: number } | null
  exercise: { count: number; totalMinutes: number } | null
}

const MOOD_MAP: Record<string, { emoji: string; label: string }> = {
  Great: { emoji: "\u{1F60A}", label: "Great" },
  Good: { emoji: "\u{1F642}", label: "Good" },
  Okay: { emoji: "\u{1F610}", label: "Okay" },
  Low: { emoji: "\u{1F61E}", label: "Low" },
  Bad: { emoji: "\u{1F622}", label: "Bad" },
}

export const HealthSummary = memo(function HealthSummary() {
  const [health, setHealth] = useState<TodayHealth | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const today = getToday()

        const [moodEntries, waterEntries, sleepEntries, exerciseEntries] = await Promise.all([
          db.moodEntries.where("date").equals(today).toArray(),
          db.waterEntries.where("date").equals(today).toArray(),
          db.sleepEntries.where("date").equals(today).toArray(),
          db.exerciseEntries.where("date").equals(today).toArray(),
        ])

        const latestMood = moodEntries.length > 0
          ? MOOD_MAP[moodEntries[moodEntries.length - 1].mood] ?? null
          : null

        const totalWater = waterEntries.reduce((sum, e) => sum + e.amount, 0)

        const todaySleep = sleepEntries.length > 0 ? sleepEntries[0] : null

        const totalExerciseMin = exerciseEntries.reduce((sum, e) => sum + e.duration, 0)

        setHealth({
          mood: latestMood,
          water: totalWater > 0 ? { current: totalWater, target: 2000 } : null,
          sleep: todaySleep ? { duration: todaySleep.duration, quality: todaySleep.quality } : null,
          exercise: exerciseEntries.length > 0
            ? { count: exerciseEntries.length, totalMinutes: totalExerciseMin }
            : null,
        })
      } catch {
        // Silently degrade
      }
    }
    load()
  }, [])

  if (!health) return null

  const hasData = health.mood || health.water || health.sleep || health.exercise
  if (!hasData) return null

  const metrics: {
    key: string
    icon: typeof Droplets
    label: string
    value: string
    sub?: string
  }[] = []

  if (health.mood) {
    metrics.push({
      key: "mood",
      icon: Smile,
      label: "Mood",
      value: health.mood.emoji,
      sub: health.mood.label,
    })
  }

  if (health.water) {
    const pct = Math.round((health.water.current / health.water.target) * 100)
    metrics.push({
      key: "water",
      icon: Droplets,
      label: "Water",
      value: `${Math.round(health.water.current / 1000 * 10) / 10}L`,
      sub: `${pct}%`,
    })
  }

  if (health.sleep) {
    metrics.push({
      key: "sleep",
      icon: Moon,
      label: "Sleep",
      value: formatDuration(health.sleep.duration),
      sub: `${health.sleep.quality}/5`,
    })
  }

  if (health.exercise) {
    metrics.push({
      key: "exercise",
      icon: Activity,
      label: "Exercise",
      value: formatDuration(health.exercise.totalMinutes),
      sub: `${health.exercise.count} session${health.exercise.count > 1 ? "s" : ""}`,
    })
  }

  return (
    <Link
      href="/wellness"
      aria-label="Today's health summary — open wellness trackers"
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground mb-2" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
          Today&apos;s Health
        </p>
        <div className="flex items-center gap-4">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.key} className="flex items-center gap-1.5">
                <Icon size={14} className="text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  {m.value}
                </span>
                {m.sub && (
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>
                    {m.sub}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
    </Link>
  )
})
