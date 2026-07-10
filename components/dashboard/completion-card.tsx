"use client"

import { memo, useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { DashboardCard } from "./dashboard-card"
import type { PrayerTimes } from "@/lib/prayer"

interface CompletionCardProps {
  computedTimes: PrayerTimes | null
  loading: boolean
}

export const CompletionCard = memo(function CompletionCard({
  computedTimes,
  loading,
}: CompletionCardProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(5)

  useEffect(() => {
    const loadCompletion = async () => {
      try {
        const { getHistory } = await import("@/lib/prayer/history-service")
        const today = new Date().toISOString().split("T")[0]
        const logs = await getHistory(today, today)
        const completed = logs.filter((l) => l.completed).length
        setCompletedCount(completed)
        setTotalCount(5)
      } catch {
        // Silently degrade
      }
    }
    loadCompletion()
  }, [computedTimes])

  if (loading && completedCount === 0) {
    return (
      <DashboardCard title="Today" ariaLabel="Today's completion loading">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
          <div className="flex flex-col gap-1.5">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </DashboardCard>
    )
  }

  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const circumference = 2 * Math.PI * 26
  const dashOffset = circumference - (percent / 100) * circumference

  return (
    <DashboardCard title="Today" ariaLabel={`Today's progress: ${completedCount} of ${totalCount} prayers completed, ${percent}%`}>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
          <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
            <circle
              cx="30" cy="30" r="26"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="4"
            />
            <circle
              cx="30" cy="30" r="26"
              fill="none"
              stroke={percent === 100 ? "var(--dd-quiet-sage)" : "var(--dd-lantern-gold)"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transition: "stroke-dashoffset 600ms var(--ease-out)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {percent === 100 ? (
              <CheckCircle2 size={24} strokeWidth={1.5} className="text-quiet-sage" />
            ) : (
              <span
                className="font-mono text-foreground"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 600,
                }}
              >
                {percent}%
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <span
            className="font-display text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-body)",
              fontWeight: 600,
              lineHeight: "var(--leading-tight)",
            }}
          >
            {completedCount} of {totalCount} prayers
          </span>
          <span
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            {percent === 100
              ? "Mashallah — all prayers completed!"
              : `${percent}% completed today`}
          </span>
        </div>
      </div>
    </DashboardCard>
  )
})
