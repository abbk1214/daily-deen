import type { PrayerLog } from '../db'
import { PRAYER_NAMES } from './history-service'
import { getToday, daysAgo } from '../utils'

function fmtLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const ALL_PRAYERS = [...PRAYER_NAMES]

export interface StreakInfo {
  current: number
  longest: number
  weeklyStreak: number
  monthlyStreak: number
  perfectWeeks: number
  perfectMonths: number
  lastBrokenDate: string | null
}

function getUniqueDates(logs: PrayerLog[]): string[] {
  const dates = new Set(logs.map((l) => l.date))
  return Array.from(dates).sort()
}

function isDayComplete(date: string, logs: PrayerLog[]): boolean {
  const dayLogs = logs.filter((l) => l.date === date)
  if (dayLogs.length === 0) return false
  return ALL_PRAYERS.every((p) => dayLogs.some((l) => l.prayer === p && l.completed))
}

export function computeStreaks(logs: PrayerLog[]): StreakInfo {
  const today = getToday()
  const dates = getUniqueDates(logs)

  let current = 0
  let checkDate = today

  while (current <= 365) {
    if (checkDate !== today) {
      const dayLogs = logs.filter((l) => l.date === checkDate)
      if (dayLogs.length === 0) break
      if (!isDayComplete(checkDate, logs)) break
    }
    if (isDayComplete(checkDate, logs)) {
      current++
      checkDate = daysAgo(current)
    } else {
      break
    }
  }

  let longest = 0
  let streak = 0
  for (let i = 0; i < dates.length; i++) {
    if (isDayComplete(dates[i], logs)) {
      if (i === 0) {
        streak++
      } else {
        const prevDate = new Date(dates[i] + 'T00:00:00')
        prevDate.setDate(prevDate.getDate() - 1)
        const prevStr = fmtLocal(prevDate)
        if (isDayComplete(prevStr, logs)) {
          streak++
        } else {
          streak = 1
        }
      }
      longest = Math.max(longest, streak)
    } else {
      streak = 0
    }
  }

  let weeklyStreak = 0
  let weekCheck = today
  while (true) {
    const weekLogs = logs.filter((l) => {
      const d = new Date(l.date + 'T00:00:00')
      const start = new Date(weekCheck + 'T00:00:00')
      start.setDate(start.getDate() - start.getDay())
      const end = new Date(start)
      end.setDate(end.getDate() + 7)
      return d >= start && d < end
    })
    const weekDates = new Set(weekLogs.map((l) => l.date))
    const allComplete = Array.from(weekDates).every((d) => isDayComplete(d, weekLogs))
    if (allComplete && weekDates.size === 7) {
      weeklyStreak++
      const d = new Date(weekCheck + 'T00:00:00')
      d.setDate(d.getDate() - 7)
      weekCheck = fmtLocal(d)
    } else {
      break
    }
  }

  let monthlyStreak = 0
  let monthCheck = today
  while (true) {
    const d = new Date(monthCheck + 'T00:00:00')
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const monthLogs = logs.filter((l) => {
      const ld = new Date(l.date + 'T00:00:00')
      return ld.getFullYear() === year && ld.getMonth() + 1 === month
    })
    const daysInMonth = new Date(year, month, 0).getDate()
    const monthDates = new Set(monthLogs.map((l) => l.date))
    const allComplete = Array.from(monthDates).every((dd) => isDayComplete(dd, monthLogs))
    if (allComplete && monthDates.size === daysInMonth) {
      monthlyStreak++
      d.setMonth(d.getMonth() - 1)
      monthCheck = fmtLocal(d)
    } else {
      break
    }
  }

  let perfectWeeks = 0
  for (let i = 0; i < 52; i++) {
    const d = new Date(today + 'T00:00:00')
    d.setDate(d.getDate() - i * 7)
    const weekStart = fmtLocal(d)
    const weekLogs = logs.filter((l) => {
      const ld = new Date(l.date + 'T00:00:00')
      const start = new Date(weekStart + 'T00:00:00')
      start.setDate(start.getDate() - start.getDay())
      const end = new Date(start)
      end.setDate(end.getDate() + 7)
      return ld >= start && ld < end
    })
    const weekDates = new Set(weekLogs.map((l) => l.date))
    if (weekDates.size === 7 && Array.from(weekDates).every((dd) => isDayComplete(dd, weekLogs))) {
      perfectWeeks++
    }
  }

  let perfectMonths = 0
  for (let i = 0; i < 12; i++) {
    const d = new Date(today + 'T00:00:00')
    d.setMonth(d.getMonth() - i)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const monthLogs = logs.filter((l) => {
      const ld = new Date(l.date + 'T00:00:00')
      return ld.getFullYear() === year && ld.getMonth() + 1 === month
    })
    const daysInMonth = new Date(year, month, 0).getDate()
    const monthDates = new Set(monthLogs.map((l) => l.date))
    if (monthDates.size === daysInMonth && Array.from(monthDates).every((dd) => isDayComplete(dd, monthLogs))) {
      perfectMonths++
    }
  }

  let lastBrokenDate: string | null = null
  for (let i = 1; i <= 365; i++) {
    const d = daysAgo(i)
    if (logs.some((l) => l.date === d) && !isDayComplete(d, logs)) {
      lastBrokenDate = d
      break
    }
  }

  return {
    current,
    longest,
    weeklyStreak,
    monthlyStreak,
    perfectWeeks,
    perfectMonths,
    lastBrokenDate,
  }
}

export function getDayStatus(date: string, logs: PrayerLog[]): 'complete' | 'partial' | 'missed' | 'none' {
  const dayLogs = logs.filter((l) => l.date === date)
  if (dayLogs.length === 0) return 'none'
  if (isDayComplete(date, logs)) return 'complete'
  const hasCompleted = dayLogs.some((l) => l.completed)
  if (hasCompleted) return 'partial'
  return 'missed'
}

export function getWeeklyProgress(logs: PrayerLog[]): { completed: number; total: number; percent: number } {
  const today = getToday()
  const start = new Date(today + 'T00:00:00')
  start.setDate(start.getDate() - start.getDay())

  let completed = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const dateStr = fmtLocal(d)
    if (dateStr > today) break
    const dayLogs = logs.filter((l) => l.date === dateStr)
    completed += dayLogs.filter((l) => l.completed).length
  }

  const daysPassed = Math.min(7, new Date(today + 'T00:00:00').getDay() + 1)
  const total = ALL_PRAYERS.length * daysPassed

  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}
