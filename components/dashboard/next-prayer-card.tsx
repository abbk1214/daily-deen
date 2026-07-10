"use client"

import { memo } from "react"
import { Clock, Check } from "lucide-react"
import { DashboardCard } from "./dashboard-card"
import type { PrayerTimes } from "@/lib/prayer"
import type { Prayer } from "@/lib/db"

interface NextPrayerCardProps {
  nextPrayer: { name: string; minutesUntil: number } | null
  computedTimes: PrayerTimes | null
  prayers: Prayer | undefined
  loading: boolean
}

function formatCountdown(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const
const PRAYER_DISPLAY: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  Sunrise: "Sunrise",
}

export const NextPrayerCard = memo(function NextPrayerCard({
  nextPrayer,
  computedTimes,
  prayers,
  loading,
}: NextPrayerCardProps) {
  if (loading) {
    return (
      <DashboardCard title="Next Prayer" ariaLabel="Next prayer loading">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
          <div className="flex flex-col gap-1.5">
            <div className="h-7 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </DashboardCard>
    )
  }

  if (!nextPrayer || !computedTimes) return null

  return (
    <DashboardCard title="Next Prayer" ariaLabel={`Next prayer: ${nextPrayer.name} in ${formatCountdown(nextPrayer.minutesUntil)}`}>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 48,
            height: 48,
            backgroundColor: "var(--dd-lantern-gold)",
            color: "var(--primary-foreground)",
          }}
        >
          <Clock size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span
            className="font-display text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h3)",
              fontWeight: 600,
              lineHeight: "var(--leading-tight)",
            }}
          >
            {nextPrayer.name}
          </span>
          <span
            className="text-muted-foreground font-mono"
            style={{
              fontSize: "var(--text-body-sm)",
              fontFamily: "var(--font-mono)",
            }}
          >
            in {formatCountdown(nextPrayer.minutesUntil)}
          </span>
        </div>
      </div>

      {computedTimes && (
        <div
          className="mt-4 flex gap-2 overflow-x-auto"
          role="list"
          aria-label="Prayer schedule"
          style={{ scrollbarWidth: "none" }}
        >
          {PRAYER_KEYS.map((key) => {
            const timeMinutes = computedTimes[key]
            const h = Math.floor(timeMinutes / 60)
            const m = timeMinutes % 60
            const displayH = h % 12 || 12
            const timeStr = `${displayH}:${String(m).padStart(2, "0")}`
            const isNext = nextPrayer.name.toLowerCase() === key
            const isCompleted = prayers?.completed[key] ?? false

            return (
              <div
                key={key}
                role="listitem"
                className="flex flex-col items-center gap-1 rounded-md px-2.5 py-1.5 shrink-0"
                style={{
                  minWidth: 56,
                  backgroundColor: isNext ? "var(--dd-lantern-gold)" : isCompleted ? "var(--dd-quiet-sage)" : "var(--muted)",
                  color: isNext || isCompleted ? "var(--primary-foreground)" : "var(--foreground)",
                }}
              >
                <span style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                  {PRAYER_DISPLAY[key] ?? key}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-caption)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  {isCompleted ? <Check size={12} strokeWidth={2.5} /> : timeStr}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </DashboardCard>
  )
})
