"use client"

import { memo, useMemo } from "react"
import type { PrayerLog } from "@/lib/db"
import { daysAgo } from "@/lib/utils"

interface HeatmapProps {
  logs: PrayerLog[]
  range?: 'week' | 'month' | 'year'
}

function getIntensity(count: number): string {
  if (count === 0) return 'var(--border)'
  if (count <= 1) return 'oklch(0.85 0.08 85)'
  if (count <= 2) return 'oklch(0.75 0.10 85)'
  if (count <= 3) return 'oklch(0.65 0.12 85)'
  if (count <= 4) return 'oklch(0.55 0.14 85)'
  return 'var(--dd-lantern-gold)'
}

function getTooltip(count: number, date: string): string {
  return `${count} prayer${count !== 1 ? 's' : ''} on ${date}`
}

export const Heatmap = memo(function Heatmap({ logs, range = 'year' }: HeatmapProps) {
  const cells = useMemo(() => {
    let days: number

    switch (range) {
      case 'week':
        days = 7
        break
      case 'month':
        days = 30
        break
      case 'year':
      default:
        days = 52 * 7
        break
    }

    const result: { date: string; count: number; intensity: string; tooltip: string }[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = daysAgo(i)
      const dayLogs = logs.filter((l) => l.date === date)
      const count = dayLogs.filter((l) => l.completed).length
      result.push({
        date,
        count,
        intensity: getIntensity(count),
        tooltip: getTooltip(count, date),
      })
    }

    return result
  }, [logs, range])

  if (range === 'week') {
    return (
      <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
        <h3
          className="text-foreground"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            marginBottom: 'var(--space-3)',
          }}
        >
          This Week
        </h3>
        <div className="flex gap-1">
          {cells.map((cell, i) => (
            <div
              key={i}
              title={cell.tooltip}
              className="flex-1 rounded-sm"
              style={{
                height: '32px',
                backgroundColor: cell.intensity,
              }}
              aria-label={cell.tooltip}
            />
          ))}
        </div>
      </div>
    )
  }

  if (range === 'month') {
    return (
      <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
        <h3
          className="text-foreground"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            marginBottom: 'var(--space-3)',
          }}
        >
          Last 30 Days
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '3px',
          }}
        >
          {cells.map((cell, i) => (
            <div
              key={i}
              title={cell.tooltip}
              className="rounded-sm"
              style={{
                aspectRatio: '1',
                backgroundColor: cell.intensity,
              }}
              aria-label={cell.tooltip}
            />
          ))}
        </div>
      </div>
    )
  }

  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  return (
    <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
      <h3
        className="text-foreground"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          marginBottom: 'var(--space-3)',
        }}
      >
        Activity
      </h3>
      <div style={{ display: 'flex', gap: '3px' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {week.map((cell, di) => (
              <div
                key={di}
                title={cell.tooltip}
                className="rounded-sm"
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: cell.intensity,
                }}
                aria-label={cell.tooltip}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2" style={{ marginTop: 'var(--space-2)' }}>
        <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Less</span>
        {[0, 1, 2, 3, 4, 5].map((c) => (
          <div
            key={c}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: getIntensity(c),
            }}
          />
        ))}
        <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>More</span>
      </div>
    </div>
  )
})
