"use client"

import { memo } from "react"
import { Clock, Check } from "lucide-react"
import type { PrayerTimes } from "@/lib/prayer"

type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

interface NextPrayerCardProps {
  nextPrayer: { name: string; minutesUntil: number } | null
  computedTimes: PrayerTimes | null
  prayerStatus: Record<PrayerName, boolean>
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
}

export const NextPrayerCard = memo(function NextPrayerCard({
  nextPrayer,
  computedTimes,
  prayerStatus,
  loading,
}: NextPrayerCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
          <div className="flex flex-col gap-1.5">
            <div className="h-7 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!nextPrayer || !computedTimes) return null

  return (
    <div
      className="rounded-2xl border border-border bg-card"
      style={{ padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}
    >
      {/* Main info */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 44,
            height: 44,
            background: "var(--muted)",
            color: "var(--foreground)",
          }}
        >
          <Clock size={20} strokeWidth={1.5} />
        </div>
        <div>
          <span
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h3)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {nextPrayer.name}
          </span>
          <span
            className="text-muted-foreground block"
            style={{
              fontSize: "var(--text-body-sm)",
              marginTop: "2px",
            }}
          >
            in {formatCountdown(nextPrayer.minutesUntil)}
          </span>
        </div>
      </div>

      {/* Prayer schedule — compact chips */}
      <div
        className="flex gap-2 overflow-x-auto"
        role="list"
        aria-label="Prayer schedule"
        style={{ marginTop: "var(--space-4)", scrollbarWidth: "none" }}
      >
        {PRAYER_KEYS.map((key) => {
          const timeMinutes = computedTimes[key]
          const h = Math.floor(timeMinutes / 60)
          const m = timeMinutes % 60
          const displayH = h % 12 || 12
          const timeStr = `${displayH}:${String(m).padStart(2, "0")}`
          const isNext = nextPrayer.name.toLowerCase() === key
          const isCompleted = prayerStatus[key] ?? false

          return (
            <div
              key={key}
              role="listitem"
              className="flex flex-col items-center rounded-xl px-3 py-2 shrink-0"
              style={{
                minWidth: 56,
                background: isNext ? "var(--foreground)" : "var(--muted)",
                color: isNext ? "var(--background)" : isCompleted ? "var(--dd-dusk-teal)" : "var(--foreground)",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.02em" }}>
                {PRAYER_DISPLAY[key]}
              </span>
              <span
                style={{
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  marginTop: "2px",
                }}
              >
                {isCompleted ? <Check size={12} strokeWidth={2.5} /> : timeStr}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
