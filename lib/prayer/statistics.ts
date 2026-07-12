import type { PrayerLog } from '../db'
import { PRAYER_NAMES } from './history-service'

const ALL_PRAYERS = [...PRAYER_NAMES]

function fmtLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export interface PrayerStatistics {
  totalPrayers: number
  completedCount: number
  missedCount: number
  qazaCount: number
  jamaahCount: number
  pendingCount: number
  completionPercent: number
  jamaahPercent: number
  avgPrayersPerDay: number
  daysWithLogs: number
}

export interface DailyStats {
  date: string
  total: number
  completed: number
  missed: number
  qaza: number
  jamaah: number
  percent: number
}

export interface WeeklyStats {
  weekStart: string
  weekEnd: string
  days: DailyStats[]
  totalCompleted: number
  totalPossible: number
  percent: number
}

export interface MonthlyStats {
  year: number
  month: number
  weeks: WeeklyStats[]
  totalCompleted: number
  totalPossible: number
  percent: number
}

export interface YearlyStats {
  year: number
  months: MonthlyStats[]
  totalCompleted: number
  totalPossible: number
  percent: number
}

export function computeStatistics(logs: PrayerLog[]): PrayerStatistics {
  const total = logs.length
  const completed = logs.filter((l) => l.completed).length
  const missed = logs.filter((l) => l.missed).length
  const qaza = logs.filter((l) => l.qaza).length
  const jamaah = logs.filter((l) => l.jamaah).length
  const pending = logs.filter((l) => l.status === 'pending').length

  const uniqueDays = new Set(logs.map((l) => l.date)).size

  return {
    totalPrayers: total,
    completedCount: completed,
    missedCount: missed,
    qazaCount: qaza,
    jamaahCount: jamaah,
    pendingCount: pending,
    completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    jamaahPercent: completed > 0 ? Math.round((jamaah / completed) * 100) : 0,
    avgPrayersPerDay: uniqueDays > 0 ? Math.round((completed / uniqueDays) * 10) / 10 : 0,
    daysWithLogs: uniqueDays,
  }
}

export function computeDailyStats(date: string, logs: PrayerLog[]): DailyStats {
  const dayLogs = logs.filter((l) => l.date === date)
  const total = ALL_PRAYERS.length
  const completed = dayLogs.filter((l) => l.completed).length
  const missed = dayLogs.filter((l) => l.missed).length
  const qaza = dayLogs.filter((l) => l.qaza).length
  const jamaah = dayLogs.filter((l) => l.jamaah).length

  return {
    date,
    total: dayLogs.length || total,
    completed,
    missed,
    qaza,
    jamaah,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

export function computeWeeklyStats(logs: PrayerLog[], weekStart: string): WeeklyStats {
  const d = new Date(weekStart + 'T00:00:00')
  const days: DailyStats[] = []

  for (let i = 0; i < 7; i++) {
    const dateStr = fmtLocal(d)
    days.push(computeDailyStats(dateStr, logs))
    d.setDate(d.getDate() + 1)
  }

  const weekEnd = days[6].date
  const totalCompleted = days.reduce((sum, d) => sum + d.completed, 0)
  const totalPossible = ALL_PRAYERS.length * 7

  return {
    weekStart,
    weekEnd,
    days,
    totalCompleted,
    totalPossible,
    percent: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
  }
}

export function computeMonthlyStats(logs: PrayerLog[], year: number, month: number): MonthlyStats {
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDayNum = new Date(year, month, 0).getDate()
  const lastDay = `${year}-${String(month).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`

  const weeks: WeeklyStats[] = []
  const d = new Date(firstDay + 'T00:00:00')
  const endD = new Date(lastDay + 'T00:00:00')

  while (d <= endD) {
    const weekStart = fmtLocal(d)
    weeks.push(computeWeeklyStats(logs, weekStart))
    d.setDate(d.getDate() + 7)
  }

  const totalCompleted = weeks.reduce((sum, w) => sum + w.totalCompleted, 0)
  const daysInMonth = lastDayNum
  const totalPossible = ALL_PRAYERS.length * daysInMonth

  return {
    year,
    month,
    weeks,
    totalCompleted,
    totalPossible,
    percent: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
  }
}

export function computeYearlyStats(logs: PrayerLog[], year: number): YearlyStats {
  const months: MonthlyStats[] = []
  for (let m = 1; m <= 12; m++) {
    months.push(computeMonthlyStats(logs, year, m))
  }

  const totalCompleted = months.reduce((sum, m) => sum + m.totalCompleted, 0)
  const totalPossible = ALL_PRAYERS.length * 365

  return {
    year,
    months,
    totalCompleted,
    totalPossible,
    percent: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
  }
}

export function computeWeeklyTrend(logs: PrayerLog[], weeksBack: number = 12): DailyStats[] {
  const today = new Date()
  const result: DailyStats[] = []

  for (let w = weeksBack - 1; w >= 0; w--) {
    const weekDate = new Date(today)
    weekDate.setDate(weekDate.getDate() - w * 7)
    const weekStart = fmtLocal(weekDate)
    const weekLogs = logs.filter((l) => {
      const d = new Date(l.date + 'T00:00:00')
      const start = new Date(weekStart + 'T00:00:00')
      const end = new Date(start)
      end.setDate(end.getDate() + 7)
      return d >= start && d < end
    })

    const completed = weekLogs.filter((l) => l.completed).length
    result.push({
      date: weekStart,
      total: ALL_PRAYERS.length * 7,
      completed,
      missed: weekLogs.filter((l) => l.missed).length,
      qaza: weekLogs.filter((l) => l.qaza).length,
      jamaah: weekLogs.filter((l) => l.jamaah).length,
      percent: Math.round((completed / (ALL_PRAYERS.length * 7)) * 100),
    })
  }

  return result
}
