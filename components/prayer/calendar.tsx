"use client"

import { memo, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import type { PrayerLog } from "@/lib/db"
import { getDayStatus } from "@/lib/prayer/streaks"
import {
  getHijriDate,
  hijriToIsoDate,
  getDaysInHijriMonth,
  HIJRI_MONTHS,
} from "@/lib/hijri-date"
import { getHolidayBadge } from "@/lib/hijri-holidays"

interface CalendarProps {
  logs: PrayerLog[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  calendarType?: "gregorian" | "hijri"
  onCalendarTypeChange?: (type: "gregorian" | "hijri") => void
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getDaysInGregorianMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfGregorianMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

function formatGregorianDate(
  year: number,
  month: number,
  day: number,
): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function StatusDot({ status }: { status: "complete" | "partial" | "missed" | "none" }) {
  const color =
    status === "complete"
      ? "var(--dd-lantern-gold)"
      : status === "partial"
        ? "oklch(0.75 0.12 85)"
        : status === "missed"
          ? "oklch(0.55 0.15 25)"
          : "var(--border)"

  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
  )
}

function HolidayBadge({ color, name }: { color: string; name: string }) {
  return (
    <span
      title={name}
      aria-label={name}
      style={{
        display: "block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
  )
}

export const PrayerCalendar = memo(function PrayerCalendar({
  logs,
  selectedDate,
  onSelectDate,
  calendarType = "gregorian",
  onCalendarTypeChange,
}: CalendarProps) {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const todayHijri = getHijriDate(today)

  const [gregorianMonth, setGregorianMonth] = useState(today.getMonth() + 1)
  const [gregorianYear, setGregorianYear] = useState(today.getFullYear())
  const [hijriMonth, setHijriMonth] = useState(todayHijri.month)
  const [hijriYear, setHijriYear] = useState(todayHijri.year)

  const isHijri = calendarType === "hijri"

  const monthLabel = useMemo(() => {
    if (isHijri) {
      return `${HIJRI_MONTHS[hijriMonth - 1]} ${hijriYear}`
    }
    return new Date(gregorianYear, gregorianMonth - 1).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" },
    )
  }, [isHijri, hijriMonth, hijriYear, gregorianMonth, gregorianYear])

  const cells = useMemo(() => {
    if (isHijri) {
      const days = getDaysInHijriMonth(hijriYear, hijriMonth)
      const firstIso = hijriToIsoDate(hijriYear, hijriMonth, 1)
      const firstDate = new Date(firstIso + "T00:00:00")
      const firstDay = firstDate.getDay()

      const result: {
        day: number
        date: string
        status: "complete" | "partial" | "missed" | "none"
        isToday: boolean
        holiday: { name: string; color: string } | null
      }[] = []

      for (let i = 0; i < firstDay; i++) {
        result.push({
          day: 0,
          date: "",
          status: "none",
          isToday: false,
          holiday: null,
        })
      }

      for (let d = 1; d <= days; d++) {
        const dateStr = hijriToIsoDate(hijriYear, hijriMonth, d)
        result.push({
          day: d,
          date: dateStr,
          status: getDayStatus(dateStr, logs),
          isToday: dateStr === todayStr,
          holiday: getHolidayBadge(dateStr),
        })
      }

      return result
    }

    const days = getDaysInGregorianMonth(gregorianYear, gregorianMonth)
    const firstDay = getFirstDayOfGregorianMonth(gregorianYear, gregorianMonth)

    const result: {
      day: number
      date: string
      status: "complete" | "partial" | "missed" | "none"
      isToday: boolean
      holiday: { name: string; color: string } | null
    }[] = []

    for (let i = 0; i < firstDay; i++) {
      result.push({
        day: 0,
        date: "",
        status: "none",
        isToday: false,
        holiday: null,
      })
    }

    for (let d = 1; d <= days; d++) {
      const dateStr = formatGregorianDate(gregorianYear, gregorianMonth, d)
      result.push({
        day: d,
        date: dateStr,
        status: getDayStatus(dateStr, logs),
        isToday: dateStr === todayStr,
        holiday: getHolidayBadge(dateStr),
      })
    }

    return result
  }, [
    isHijri,
    hijriYear,
    hijriMonth,
    gregorianYear,
    gregorianMonth,
    logs,
    todayStr,
  ])

  const prevMonth = () => {
    if (isHijri) {
      setHijriMonth((m) => {
        if (m === 1) {
          setHijriYear((y) => y - 1)
          return 12
        }
        return m - 1
      })
    } else {
      setGregorianMonth((m) => {
        if (m === 1) {
          setGregorianYear((y) => y - 1)
          return 12
        }
        return m - 1
      })
    }
  }

  const nextMonth = () => {
    if (isHijri) {
      setHijriMonth((m) => {
        if (m === 12) {
          setHijriYear((y) => y + 1)
          return 1
        }
        return m + 1
      })
    } else {
      setGregorianMonth((m) => {
        if (m === 12) {
          setGregorianYear((y) => y + 1)
          return 1
        }
        return m + 1
      })
    }
  }

  const goToToday = () => {
    const now = new Date()
    const h = getHijriDate(now)
    setGregorianMonth(now.getMonth() + 1)
    setGregorianYear(now.getFullYear())
    setHijriMonth(h.month)
    setHijriYear(h.year)
  }

  return (
    <div
      className="rounded-lg border border-border bg-card"
      style={{ padding: "var(--space-4)" }}
    >
      {/* Calendar type toggle */}
      {onCalendarTypeChange && (
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: "var(--space-3)" }}
        >
          <button
            type="button"
            onClick={() => onCalendarTypeChange("gregorian")}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{
              borderColor: !isHijri ? "var(--dd-dusk-teal)" : "var(--border)",
              backgroundColor: !isHijri
                ? "var(--dd-dusk-teal)"
                : "transparent",
              color: !isHijri
                ? "var(--primary-foreground)"
                : "var(--foreground)",
              border: "1px solid",
            }}
          >
            Gregorian
          </button>
          <button
            type="button"
            onClick={() => onCalendarTypeChange("hijri")}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{
              borderColor: isHijri ? "var(--dd-dusk-teal)" : "var(--border)",
              backgroundColor: isHijri
                ? "var(--dd-dusk-teal)"
                : "transparent",
              color: isHijri
                ? "var(--primary-foreground)"
                : "var(--foreground)",
              border: "1px solid",
            }}
          >
            Hijri
          </button>
          <button
            type="button"
            onClick={goToToday}
            aria-label="Go to today"
            className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <CalendarDays size={12} strokeWidth={1.5} />
            Today
          </button>
        </div>
      )}

      {/* Month navigation */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--space-3)" }}
      >
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
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-body)",
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

      {/* Day grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
          textAlign: "center",
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-muted-foreground"
            style={{
              fontSize: "var(--text-caption)",
              fontWeight: 500,
              padding: "var(--space-1) 0",
              letterSpacing: "var(--tracking-wide)",
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
            aria-label={
              cell.day > 0
                ? `${cell.day}, ${cell.status}${cell.holiday ? `, ${cell.holiday.name}` : ""}`
                : undefined
            }
            className="flex flex-col items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{
              aspectRatio: "1",
              padding: "2px",
              backgroundColor:
                cell.date === selectedDate
                  ? "var(--dd-dusk-teal)"
                  : "transparent",
              color:
                cell.date === selectedDate
                  ? "var(--primary-foreground)"
                  : "var(--foreground)",
              opacity: cell.day === 0 ? 0 : 1,
              cursor: cell.day > 0 ? "pointer" : "default",
              border: cell.isToday
                ? "1px solid var(--dd-lantern-gold)"
                : "1px solid transparent",
              fontSize: "var(--text-body-sm)",
              fontWeight: cell.isToday ? 600 : 400,
            }}
          >
            {cell.day > 0 && (
              <>
                <span>{cell.day}</span>
                {cell.holiday ? (
                  <HolidayBadge color={cell.holiday.color} name={cell.holiday.name} />
                ) : (
                  <StatusDot status={cell.status} />
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-center gap-4"
        style={{ marginTop: "var(--space-3)" }}
      >
        <div className="flex items-center gap-1">
          <StatusDot status="complete" />
          <span
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            All done
          </span>
        </div>
        <div className="flex items-center gap-1">
          <StatusDot status="partial" />
          <span
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            Partial
          </span>
        </div>
        <div className="flex items-center gap-1">
          <StatusDot status="missed" />
          <span
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            Missed
          </span>
        </div>
      </div>
    </div>
  )
})
