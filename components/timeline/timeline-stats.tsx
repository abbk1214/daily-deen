"use client"

import { memo } from "react"
import { Flame, BookOpen, PenLine, Trophy, BookCheck, CheckCircle } from "lucide-react"
import type { TimelineStats } from "@/lib/timeline/types"

interface TimelineStatsBarProps {
  stats: TimelineStats
}

export const TimelineStatsBar = memo(function TimelineStatsBar({
  stats,
}: TimelineStatsBarProps) {
  const items = [
    { icon: Flame, value: stats.totalPrayerDays, label: "Prayer days", color: "var(--dd-lantern-gold)" },
    { icon: BookOpen, value: stats.totalQuranPages, label: "Quran pages", color: "var(--dd-dusk-teal)" },
    { icon: PenLine, value: stats.totalJournalEntries, label: "Journal entries", color: "var(--dd-quiet-sage)" },
    { icon: Trophy, value: stats.longestStreak, label: "Best streak", color: "var(--dd-lantern-gold)" },
    { icon: CheckCircle, value: stats.totalHabitDays, label: "Habit days", color: "var(--dd-dusk-teal)" },
    { icon: BookCheck, value: stats.totalKhatmah, label: "Khatmah", color: "var(--dd-quiet-sage)" },
  ]

  return (
    <div
      className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-5"
      role="region"
      aria-label="Timeline statistics"
    >
      {items.map(({ icon: Icon, value, label, color }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 36,
              height: 36,
              backgroundColor: color,
              color: 'white',
            }}
          >
            <Icon size={16} strokeWidth={1.5} />
          </div>
          <span
            className="font-mono text-foreground"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-body)',
              fontWeight: 600,
              lineHeight: 'var(--leading-tight)',
            }}
          >
            {value.toLocaleString()}
          </span>
          <span
            className="text-muted-foreground"
            style={{ fontSize: 'var(--text-caption)' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
})
