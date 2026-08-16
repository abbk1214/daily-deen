"use client"

import { memo, useEffect, useRef, useState } from "react"
import { Flame, Trophy, Target } from "lucide-react"
import { DashboardCard } from "./dashboard-card"
import { computeStreaks, getWeeklyProgress } from "@/lib/prayer/streaks"
import { getToday } from "@/lib/utils"

interface StreakCardProps {
  loading: boolean
  refreshKey?: number
}

export const StreakCard = memo(function StreakCard({ loading, refreshKey }: StreakCardProps) {
  const [streaks, setStreaks] = useState<{
    current: number
    longest: number
    weeklyPercent: number
  } | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const load = async () => {
      try {
        const { getHistory } = await import("@/lib/prayer/history-service")
        const year = new Date().getFullYear()
        const start = `${year}-01-01`
        const end = getToday()
        const logs = await getHistory(start, end)
        if (!mountedRef.current) return
        const s = computeStreaks(logs)
        const w = getWeeklyProgress(logs)
        setStreaks({
          current: s.current,
          longest: s.longest,
          weeklyPercent: w.percent,
        })
      } catch {
        // Silently degrade
      }
    }
    load()
    return () => { mountedRef.current = false }
  }, [refreshKey])

  if (loading && !streaks) {
    return (
      <DashboardCard title="Streak" ariaLabel="Streak loading">
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </DashboardCard>
    )
  }

  if (!streaks) return null

  const stats = [
    { icon: Flame, value: streaks.current, label: "Day streak", color: "var(--dd-lantern-gold)" },
    { icon: Trophy, value: streaks.longest, label: "Best streak", color: "var(--dd-dusk-teal)" },
    { icon: Target, value: `${streaks.weeklyPercent}%`, label: "This week", color: "var(--dd-quiet-sage)" },
  ]

  return (
    <DashboardCard title="Streak" ariaLabel={`Streak: ${streaks.current} day streak`}>
      <div className="flex gap-4">
        {stats.map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 36,
                height: 36,
                backgroundColor: color,
                color: "var(--primary-foreground)",
              }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <span
              className="text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h3)",
                fontWeight: 600,
                lineHeight: "var(--leading-tight)",
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </span>
            <span
              className="text-muted-foreground"
              style={{ fontSize: "var(--text-caption)", letterSpacing: "0.01em" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
})
