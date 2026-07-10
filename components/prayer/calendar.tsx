"use client"

import { memo, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { PrayerLog } from "@/lib/db"
import { getDayStatus } from "@/lib/prayer/streaks"

interface CalendarProps {
  logs: PrayerLog[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function StatusDot({ status }: { status: 'complete' | 'partial' | 'missed' | 'none' }) {
  const color =
    status === 'complete' ? 'var(--dd-lantern-gold)' :
    status === 'partial' ? 'oklch(0.75 0.12 85)' :
    status === 'missed' ? 'oklch(0.55 0.15 25)' :
    'var(--border)'

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: color,
      }}
    />
  )
}

export const PrayerCalendar = memo(function PrayerCalendar({ logs, selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const cells = useMemo(() => {
    const result: { day: number; date: string; status: 'complete' | 'partial' | 'missed' | 'none'; isToday: boolean }[] = []

    for (let i = 0; i < firstDay; i++) {
      result.push({ day: 0, date: '', status: 'none', isToday: false })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDate(viewYear, viewMonth, d)
      result.push({
        day: d,
        date: dateStr,
        status: getDayStatus(dateStr, logs),
        isToday: dateStr === todayStr,
      })
    }

    return result
  }, [viewYear, viewMonth, daysInMonth, firstDay, logs, todayStr])

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <h3
          className="text-foreground"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-body)',
            fontWeight: 600,
          }}
        >
          {monthLabel}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          textAlign: 'center',
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-muted-foreground"
            style={{
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              padding: 'var(--space-1) 0',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            {d}
          </div>
        ))}

        {cells.map((cell, i) => (
          <button
            key={i}
            type="button"
            disabled={cell.day === 0}
            onClick={() => cell.day > 0 && onSelectDate(cell.date)}
            aria-label={cell.day > 0 ? `${cell.day}, ${cell.status}` : undefined}
            className="flex flex-col items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{
              aspectRatio: '1',
              padding: '2px',
              backgroundColor: cell.date === selectedDate ? 'var(--dd-dusk-teal)' : 'transparent',
              color: cell.date === selectedDate ? 'var(--primary-foreground)' : 'var(--foreground)',
              opacity: cell.day === 0 ? 0 : 1,
              cursor: cell.day > 0 ? 'pointer' : 'default',
              border: cell.isToday ? '1px solid var(--dd-lantern-gold)' : '1px solid transparent',
              fontSize: 'var(--text-body-sm)',
              fontWeight: cell.isToday ? 600 : 400,
            }}
          >
            {cell.day > 0 && (
              <>
                <span>{cell.day}</span>
                <StatusDot status={cell.status} />
              </>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4" style={{ marginTop: 'var(--space-3)' }}>
        <div className="flex items-center gap-1">
          <StatusDot status="complete" />
          <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>All done</span>
        </div>
        <div className="flex items-center gap-1">
          <StatusDot status="partial" />
          <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Partial</span>
        </div>
        <div className="flex items-center gap-1">
          <StatusDot status="missed" />
          <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Missed</span>
        </div>
      </div>
    </div>
  )
})
