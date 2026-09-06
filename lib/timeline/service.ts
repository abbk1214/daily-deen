import db from '@/lib/db'
import { getToday } from '@/lib/utils'
import type {
  TimelineEvent,
  TimelineMonth,
  TimelineData,
  TimelineFilters,
  TimelineStats,
} from './types'

/* ──────────────────────────────────────────────
   Simple TTL cache (60 seconds)
   ────────────────────────────────────────────── */

let timelineCache: { data: TimelineData; ts: number } | null = null
let statsCache: { data: TimelineStats; ts: number } | null = null
const CACHE_TTL = 60_000

function _invalidateTimelineCache(): void {
  timelineCache = null
  statsCache = null
}

// Invalidate cache when data changes
if (typeof window !== "undefined") {
  window.addEventListener("focus", () => {
    timelineCache = null
    statsCache = null
  })
}

function getMonthLabel(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function monthKey(date: string): string {
  return date.slice(0, 7)
}

async function detectPrayerStreaks(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  const prayers = await db.prayers.orderBy('date').toArray()
  if (prayers.length === 0) return events

  let currentStreak = 0
  let streakStart = ''
  let streakEnd = ''

  for (const prayer of prayers) {
    const completed = Object.values(prayer.completed).filter(Boolean).length
    if (completed === 5) {
      if (currentStreak === 0) streakStart = prayer.date
      currentStreak++
      streakEnd = prayer.date
    } else {
      if (currentStreak >= 7) {
        events.push({
          id: `streak-${streakStart}`,
          date: streakEnd,
          type: 'prayer_streak',
          title: `${currentStreak}-day prayer streak`,
          subtitle: `${streakStart} to ${streakEnd}`,
          description: `You completed all 5 prayers for ${currentStreak} consecutive days.`,
          icon: 'flame',
          color: 'lantern-gold',
          metadata: { streak: currentStreak, start: streakStart, end: streakEnd },
        })
      }
      if (currentStreak >= 30 && currentStreak % 30 === 0) {
        events.push({
          id: `record-streak-${currentStreak}`,
          date: streakEnd,
          type: 'personal_record',
          title: `New record: ${currentStreak}-day streak`,
          description: `Your longest prayer streak reached ${currentStreak} days.`,
          icon: 'trophy',
          color: 'lantern-gold',
          metadata: { streak: currentStreak },
        })
      }
      currentStreak = 0
    }
  }

  if (currentStreak >= 7) {
    events.push({
      id: `streak-${streakStart}`,
      date: streakEnd,
      type: 'prayer_streak',
      title: `${currentStreak}-day prayer streak`,
      subtitle: `${streakStart} to ${streakEnd}`,
      description: `You completed all 5 prayers for ${currentStreak} consecutive days.`,
      icon: 'flame',
      color: 'lantern-gold',
      metadata: { streak: currentStreak, start: streakStart, end: streakEnd },
    })
  }

  return events
}

async function detectQuranMilestones(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  const progress = await db.khatmahProgress.orderBy('date').toArray()
  if (progress.length === 0) return events

  let totalPages = 0
  for (const p of progress) {
    totalPages += p.pagesRead
    const milestones = [100, 250, 500, 1000, 1500, 3000, 604]
    for (const m of milestones) {
      if (totalPages >= m && totalPages - p.pagesRead < m) {
        events.push({
          id: `quran-${m}-${p.date}`,
          date: p.date,
          type: 'quran_milestone',
          title: `${m === 604 ? 'Full Quran completed' : `${m} pages read`}`,
          description: m === 604
            ? 'You have read the entire Quran. MashaAllah!'
            : `You have read ${m} pages of Quran so far.`,
          icon: 'book-open',
          color: 'dusk-teal',
          metadata: { pages: totalPages },
        })
      }
    }
  }

  const khatmah = await db.khatmahGoals.where('isActive').equals(1).first()
  if (khatmah) {
    const latestProgress = progress[progress.length - 1]
    if (latestProgress && latestProgress.pagesRead > 0) {
      events.push({
        id: `khatmah-progress-${latestProgress.date}`,
        date: latestProgress.date,
        type: 'quran_milestone',
        title: 'Khatmah in progress',
        subtitle: `${khatmah.type.replace(/_/g, ' ')}`,
        description: `Target: ${khatmah.target} ${khatmah.type.includes('page') ? 'pages/day' : khatmah.type.includes('juz') ? 'juz/week' : 'surah/month'}`,
        icon: 'book-open',
        color: 'dusk-teal',
      })
    }
  }

  return events
}

async function detectJournalMemories(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  const entries = await db.journal.orderBy('date').toArray()
  if (entries.length === 0) return events

  if (entries.length === 1) {
    events.push({
      id: `journal-first-${entries[0].date}`,
      date: entries[0].date,
      type: 'first_time',
      title: 'First journal entry',
      description: 'Your journey of reflection begins.',
      icon: 'pen-line',
      color: 'quiet-sage',
    })
  }

  let consecutiveDays = 0
  let lastDate = ''
  for (const entry of entries) {
    if (lastDate) {
      const prev = new Date(lastDate + 'T00:00:00')
      const curr = new Date(entry.date + 'T00:00:00')
      const diff = (curr.getTime() - prev.getTime()) / 86400000
      if (diff === 1) {
        consecutiveDays++
      } else {
        if (consecutiveDays >= 7) {
          events.push({
            id: `journal-week-${lastDate}`,
            date: lastDate,
            type: 'habit_consistency',
            title: `${consecutiveDays}-day journaling streak`,
            description: 'You journaled every day this week.',
            icon: 'pen-line',
            color: 'quiet-sage',
            metadata: { streak: consecutiveDays },
          })
        }
        consecutiveDays = 1
      }
    } else {
      consecutiveDays = 1
    }
    lastDate = entry.date
  }

  if (consecutiveDays >= 7) {
    events.push({
      id: `journal-week-${lastDate}`,
      date: lastDate,
      type: 'habit_consistency',
      title: `${consecutiveDays}-day journaling streak`,
      description: 'You journaled every day this week.',
      icon: 'pen-line',
      color: 'quiet-sage',
      metadata: { streak: consecutiveDays },
    })
  }

  const weeklyEntries = entries.length
  if (weeklyEntries >= 7) {
    events.push({
      id: `journal-weekly-${entries[entries.length - 1].date}`,
      date: entries[entries.length - 1].date,
      type: 'weekly_report',
      title: `${weeklyEntries} journal entries total`,
      description: 'Your reflections tell a story.',
      icon: 'pen-line',
      color: 'quiet-sage',
      metadata: { total: weeklyEntries },
    })
  }

  return events
}

async function detectHabitMilestones(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  const habits = await db.habits.toArray()
  const logs = await db.habitLogs.orderBy('date').toArray()
  if (habits.length === 0 || logs.length === 0) return events

  for (const habit of habits) {
    const habitLogs = logs.filter((l) => l.habitId === habit.id)
    let completedDays = 0
    let currentStreak = 0
    let longestStreak = 0
    let lastDate = ''

    for (const log of habitLogs) {
      if (log.value >= habit.target) {
        completedDays++
        if (lastDate) {
          const prev = new Date(lastDate + 'T00:00:00')
          const curr = new Date(log.date + 'T00:00:00')
          const diff = (curr.getTime() - prev.getTime()) / 86400000
          if (diff === 1) {
            currentStreak++
          } else {
            longestStreak = Math.max(longestStreak, currentStreak)
            currentStreak = 1
          }
        } else {
          currentStreak = 1
        }
        lastDate = log.date
      } else {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 0
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak)

    if (completedDays >= 30) {
      events.push({
        id: `habit-30-${habit.id}`,
        date: habitLogs[habitLogs.length - 1]?.date ?? getToday(),
        type: 'habit_milestone',
        title: `${habit.name}: 30 days completed`,
        description: `You completed "${habit.name}" ${completedDays} times.`,
        icon: 'check-circle',
        color: 'quiet-sage',
        metadata: { habitId: habit.id, completedDays },
      })
    }

    if (longestStreak >= 7) {
      events.push({
        id: `habit-streak-${habit.id}`,
        date: habitLogs[habitLogs.length - 1]?.date ?? getToday(),
        type: 'personal_record',
        title: `${habit.name}: ${longestStreak}-day streak`,
        description: `Your longest streak for "${habit.name}".`,
        icon: 'trophy',
        color: 'lantern-gold',
        metadata: { habitId: habit.id, streak: longestStreak },
      })
    }
  }

  return events
}

async function detectKhatmahCompletions(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  const goals = await db.khatmahGoals.where('isActive').equals(1).toArray()

  for (const goal of goals) {
    events.push({
      id: `khatmah-done-${goal.id}`,
      date: goal.endDate ?? getToday(),
      type: 'khatmah_completion',
      title: 'Khatmah completed!',
      subtitle: goal.type.replace(/_/g, ' '),
      description: `You completed your ${goal.type.replace(/_/g, ' ')} goal.`,
      icon: 'book-check',
      color: 'lantern-gold',
      metadata: { goalId: goal.id },
    })
  }

  return events
}

function deduplicateEvents(events: TimelineEvent[]): TimelineEvent[] {
  const seen = new Set<string>()
  return events.filter((e) => {
    const key = `${e.type}-${e.date}-${e.title}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function sortEventsByDate(events: TimelineEvent[]): TimelineEvent[] {
  return events.sort((a, b) => b.date.localeCompare(a.date))
}

function groupByMonth(events: TimelineEvent[]): TimelineMonth[] {
  const groups = new Map<string, TimelineEvent[]>()

  for (const event of events) {
    const key = monthKey(event.date)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(event)
  }

  const months: TimelineMonth[] = []
  for (const [key, monthEvents] of groups) {
    const [year, month] = key.split('-').map(Number)
    months.push({
      year,
      month,
      label: getMonthLabel(year, month),
      events: monthEvents,
    })
  }

  months.sort((a, b) => b.year - a.year || b.month - a.month)
  return months
}

export async function getTimeline(
  offset = 0,
  limit = 3,
): Promise<TimelineData> {
  if (timelineCache && Date.now() - timelineCache.ts < CACHE_TTL) {
    const { months, totalEvents, hasMore } = timelineCache.data
    return {
      months: months.slice(offset, offset + limit),
      totalEvents,
      hasMore,
    }
  }

  const allEvents: TimelineEvent[] = []

  const results = await Promise.all([
    detectPrayerStreaks(),
    detectQuranMilestones(),
    detectJournalMemories(),
    detectHabitMilestones(),
    detectKhatmahCompletions(),
  ])

  for (const events of results) {
    allEvents.push(...events)
  }

  const deduped = sortEventsByDate(deduplicateEvents(allEvents))
  const months = groupByMonth(deduped)

  const hasMore = offset + limit < months.length
  const result: TimelineData = {
    months: months.slice(offset, offset + limit),
    totalEvents: deduped.length,
    hasMore,
  }

  timelineCache = { data: { months, totalEvents: deduped.length, hasMore: months.length > offset + limit }, ts: Date.now() }
  return result
}

export async function searchTimeline(
  query: string,
): Promise<TimelineEvent[]> {
  const data = await getTimeline(0, 100)
  const lower = query.toLowerCase()
  const allEvents = data.months.flatMap((m) => m.events)

  return allEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(lower) ||
      e.description?.toLowerCase().includes(lower) ||
      e.subtitle?.toLowerCase().includes(lower),
  )
}

export async function filterTimeline(
  filters: TimelineFilters,
): Promise<TimelineData> {
  const data = await getTimeline(0, 100)
  const allEvents = data.months.flatMap((m) => m.events)

  let filtered = allEvents

  if (filters.types.length > 0) {
    filtered = filtered.filter((e) => filters.types.includes(e.type))
  }

  if (filters.searchQuery) {
    const lower = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        e.description?.toLowerCase().includes(lower),
    )
  }

  if (filters.dateRange) {
    filtered = filtered.filter(
      (e) => e.date >= filters.dateRange!.start && e.date <= filters.dateRange!.end,
    )
  }

  const months = groupByMonth(filtered)
  return {
    months,
    totalEvents: filtered.length,
    hasMore: false,
  }
}

export async function getTimelineStats(): Promise<TimelineStats> {
  if (statsCache && Date.now() - statsCache.ts < CACHE_TTL) {
    return statsCache.data
  }

  const [prayers, quran, journal, habits, khatmah] = await Promise.all([
    db.prayers.toArray(),
    db.khatmahProgress.toArray(),
    db.journal.toArray(),
    db.habitLogs.toArray(),
    db.khatmahGoals.where('isActive').equals(1).toArray(),
  ])

  let totalPrayerDays = 0
  let longestStreak = 0
  let currentStreak = 0

  for (const p of prayers) {
    const completed = Object.values(p.completed).filter(Boolean).length
    if (completed === 5) {
      totalPrayerDays++
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  const result: TimelineStats = {
    totalPrayerDays,
    totalQuranPages: quran.reduce((sum, q) => sum + q.pagesRead, 0),
    totalJournalEntries: journal.length,
    totalHabitDays: new Set(habits.map((h) => h.date)).size,
    longestStreak,
    totalKhatmah: khatmah.length,
  }

  statsCache = { data: result, ts: Date.now() }
  return result
}
