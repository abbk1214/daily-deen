"use client"

import { memo } from "react"
import { Droplets, Dumbbell, Footprints } from "lucide-react"
import { DashboardCard } from "./dashboard-card"
import type { Habit, HabitLog } from "@/lib/db"
import { formatValue } from "@/lib/utils"

interface HabitSummaryCardProps {
  habits: Habit[]
  habitLogs: HabitLog[]
  loading: boolean
}

function getIcon(type: Habit["type"]) {
  switch (type) {
    case "hydration": return Droplets
    case "exercise": return Dumbbell
    case "walk": return Footprints
    default: return Droplets
  }
}

function getAccentColor(type: Habit["type"]): string {
  switch (type) {
    case "hydration": return "var(--dd-dusk-teal)"
    case "exercise": return "var(--dd-lantern-gold)"
    case "walk": return "var(--dd-quiet-sage)"
    default: return "var(--muted-foreground)"
  }
}

export const HabitSummaryCard = memo(function HabitSummaryCard({
  habits,
  habitLogs,
  loading,
}: HabitSummaryCardProps) {
  if (loading && habits.length === 0) {
    return (
      <DashboardCard title="Habits" ariaLabel="Habits loading">
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              <div className="flex-1">
                <div className="h-3 w-20 animate-pulse rounded bg-muted mb-1.5" />
                <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </DashboardCard>
    )
  }

  if (habits.length === 0) return null

  const logMap = new Map(habitLogs.map((l) => [l.habitId, l]))

  return (
    <DashboardCard title="Habits" ariaLabel="Habit summary">
      <div className="flex flex-col gap-3">
        {habits.map((habit) => {
          const log = habit.id != null ? logMap.get(habit.id) : undefined
          const value = log?.value ?? 0
          const progress = Math.min(100, (value / habit.target) * 100)
          const isComplete = value >= habit.target
          const Icon = getIcon(habit.type)
          const accent = getAccentColor(habit.type)

          return (
            <div key={habit.id} className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-md shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: isComplete ? accent : "var(--muted)",
                  color: isComplete ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-foreground truncate"
                    style={{
                      fontSize: "var(--text-caption)",
                      fontWeight: 500,
                    }}
                  >
                    {habit.name}
                  </span>
                  <span
                    className="font-mono text-muted-foreground shrink-0 ml-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                    }}
                  >
                    {formatValue(value, habit.unit)}/{formatValue(habit.target, habit.unit)}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={habit.target}
                  aria-label={`${habit.name}: ${value} of ${habit.target} ${habit.unit}`}
                  className="h-[3px] w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: accent,
                      transition: "width var(--duration-normal) var(--ease-out)",
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardCard>
  )
})
