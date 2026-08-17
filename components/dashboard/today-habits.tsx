"use client"

import { memo } from "react"
import Link from "next/link"
import { ChevronRight, Check, Plus } from "lucide-react"
import { DashboardCard } from "./dashboard-card"
import { formatValue } from "@/lib/utils"
import type { Habit, HabitLog } from "@/lib/db"

interface TodayHabitsProps {
  habits: Habit[]
  habitLogs: HabitLog[]
  onIncrement: (habitId: number, step: number) => Promise<void>
}

export const TodayHabits = memo(function TodayHabits({
  habits,
  habitLogs,
  onIncrement,
}: TodayHabitsProps) {
  if (habits.length === 0) {
    return (
      <DashboardCard
        title="Today's Habits"
        ariaLabel="No habits yet"
      >
        <Link
          href="/habits"
          className="flex items-center gap-3 rounded-xl border border-dashed border-border transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{ padding: "var(--space-4)" }}
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 36,
              height: 36,
              background: "color-mix(in srgb, var(--dd-dusk-teal) 8%, transparent)",
            }}
          >
            <Plus size={16} className="text-dusk-teal" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Create your first habit
            </p>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
              Track daily routines like water, exercise, or dhikr
            </p>
          </div>
          <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
        </Link>
      </DashboardCard>
    )
  }

  const logMap = new Map<number, HabitLog>()
  for (const log of habitLogs) {
    if (log.date === new Date().toISOString().split("T")[0]) {
      logMap.set(log.habitId, log)
    }
  }

  const displayHabits = habits.slice(0, 4)
  const completedCount = displayHabits.filter((h) => {
    const log = logMap.get(h.id!)
    return (log?.value ?? 0) >= h.target
  }).length

  return (
    <DashboardCard
      title="Today's Habits"
      ariaLabel={`Habits: ${completedCount} of ${displayHabits.length} completed`}
      action={
        <Link
          href="/habits"
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="View all habits"
        >
          <span style={{ fontSize: "var(--text-caption)" }}>All</span>
          <ChevronRight size={14} />
        </Link>
      }
    >
      <ul className="flex flex-col" style={{ gap: "var(--space-3)" }}>
        {displayHabits.map((habit) => {
          const log = logMap.get(habit.id!)
          const currentValue = log?.value ?? 0
          const isComplete = currentValue >= habit.target
          const percentage = Math.min(100, (currentValue / habit.target) * 100)

          return (
            <li key={habit.id} className="flex flex-col" style={{ gap: "var(--space-2)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-foreground"
                    style={{
                      fontSize: "var(--text-body-sm)",
                      fontWeight: 500,
                    }}
                  >
                    {habit.name}
                  </span>
                  {isComplete && (
                    <Check size={14} strokeWidth={2} className="text-quiet-sage" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={isComplete ? "text-quiet-sage" : "text-muted-foreground"}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-mono-sm)",
                    }}
                  >
                    {formatValue(currentValue, habit.unit)} / {formatValue(habit.target, habit.unit)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onIncrement(habit.id!, habit.increment)}
                    disabled={isComplete}
                    aria-label={`Increment ${habit.name}`}
                    className="flex items-center justify-center rounded-md transition-colors hover:bg-secondary disabled:opacity-30"
                    style={{
                      width: 28,
                      height: 28,
                      fontSize: "14px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--muted-foreground)",
                      background: "none",
                      border: "none",
                      cursor: isComplete ? "default" : "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div
                role="progressbar"
                aria-valuenow={currentValue}
                aria-valuemin={0}
                aria-valuemax={habit.target}
                className="w-full rounded-full"
                style={{
                  height: 3,
                  background: "var(--muted)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${percentage}%`,
                    background: isComplete ? "var(--dd-quiet-sage)" : "var(--muted-foreground)",
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </DashboardCard>
  )
})
