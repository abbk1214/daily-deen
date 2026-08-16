"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Minus } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"
import type { PrayerAdjustments } from "@/lib/db"

const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const
const PRAYER_LABELS: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
}

export default function PrayerSettingsPage() {
  const { settings, update } = useSettings()
  const [adjustments, setAdjustments] = useState<PrayerAdjustments>(
    settings.prayerAdjustments
  )

  const handleAdjustment = (prayer: keyof PrayerAdjustments, delta: number) => {
    const current = adjustments[prayer] ?? 0
    const next = current + delta
    // Clamp between -60 and +60 minutes
    const clamped = Math.min(60, Math.max(-60, next))
    const nextAdjustments = { ...adjustments, [prayer]: clamped }
    setAdjustments(nextAdjustments)
    update({ prayerAdjustments: nextAdjustments })
  }

  const formatAdjustment = (minutes: number): string => {
    if (minutes === 0) return "No adjustment"
    const sign = minutes > 0 ? "+" : ""
    return `${sign}${minutes} min`
  }

  return (
    <div className="min-h-dvh bg-background">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <Link
          href="/settings"
          className="flex items-center gap-2 text-foreground transition-colors hover:text-muted-foreground"
          aria-label="Back to settings"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
          <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Settings</span>
        </Link>
      </header>

      <main
        id="main"
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          paddingInline: "var(--space-6)",
          paddingTop: "var(--space-6)",
          paddingBottom: "calc(var(--space-16) + env(safe-area-inset-bottom, 0px) + var(--space-6))",
          maxWidth: "var(--content-narrow)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          gap: "var(--space-6)",
        }}
      >
        <section>
          <h1
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h2)",
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            Prayer time adjustments
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", marginTop: "var(--space-2)" }}>
            Fine-tune prayer times if your local schedule differs from the calculated times.
          </p>
        </section>

        <section>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {PRAYER_KEYS.map((prayer, i) => {
              const value = adjustments[prayer] ?? 0
              return (
                <div
                  key={prayer}
                  className="flex items-center justify-between"
                  style={{
                    padding: "var(--space-4)",
                    borderBottom: i < PRAYER_KEYS.length - 1 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <div>
                    <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                      {PRAYER_LABELS[prayer]}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", marginTop: "2px" }}>
                      {formatAdjustment(value)}
                    </p>
                  </div>
                  <div className="flex items-center" style={{ gap: "var(--space-2)" }}>
                    <button
                      onClick={() => handleAdjustment(prayer, -5)}
                      disabled={value <= -60}
                      aria-label={`Decrease ${PRAYER_LABELS[prayer]} by 5 minutes`}
                      className="flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-secondary disabled:opacity-30"
                      style={{ width: 36, height: 36 }}
                    >
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span
                      className="text-foreground"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-body-sm)",
                        minWidth: "48px",
                        textAlign: "center",
                      }}
                    >
                      {value === 0 ? "—" : `${value > 0 ? "+" : ""}${value}m`}
                    </span>
                    <button
                      onClick={() => handleAdjustment(prayer, 5)}
                      disabled={value >= 60}
                      aria-label={`Increase ${PRAYER_LABELS[prayer]} by 5 minutes`}
                      className="flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-secondary disabled:opacity-30"
                      style={{ width: 36, height: 36 }}
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
