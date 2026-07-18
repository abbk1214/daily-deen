import db from '@/lib/db'
import { getToday, daysAgo } from '@/lib/utils'
import type {
  Insight,
  ReportInsight,
  InsightsData,
} from './types'

function dayOfWeek(date: string): number {
  return new Date(date + 'T00:00:00').getDay()
}

async function detectPrayerPatterns(): Promise<Insight[]> {
  const insights: Insight[] = []
  const prayers = await db.prayers.orderBy('date').toArray()
  if (prayers.length < 14) return insights

  const dayCounts = new Array(7).fill(0)
  const dayComplete = new Array(7).fill(0)

  for (const p of prayers) {
    const dow = dayOfWeek(p.date)
    dayCounts[dow]++
    if (Object.values(p.completed).every(Boolean)) {
      dayComplete[dow]++
    }
  }

  let bestDay = 0
  let bestRate = 0
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  for (let i = 0; i < 7; i++) {
    const rate = dayCounts[i] > 0 ? dayComplete[i] / dayCounts[i] : 0
    if (rate > bestRate) {
      bestRate = rate
      bestDay = i
    }
  }

  if (bestRate > 0.8) {
    insights.push({
      id: `prayer-pattern-${bestDay}`,
      type: 'pattern',
      title: `You pray best on ${dayNames[bestDay]}s`,
      description: `Your all-5-prayers completion rate on ${dayNames[bestDay]}s is ${Math.round(bestRate * 100)}%.`,
      icon: 'flame',
      color: 'lantern-gold',
      priority: 'medium',
      metadata: {
        pattern: `Best prayer day: ${dayNames[bestDay]}`,
        frequency: 'weekly',
        confidence: bestRate,
      },
    })
  }

  return insights
}

async function detectMoodExerciseCorrelation(): Promise<Insight[]> {
  const insights: Insight[] = []

  const [moods, exercises] = await Promise.all([
    db.moodEntries.orderBy('date').toArray(),
    db.exerciseEntries.orderBy('date').toArray(),
  ])

  if (moods.length < 7 || exercises.length < 3) return insights

  const exerciseDays = new Set(exercises.map((e) => e.date))
  const moodOnExercise: number[] = []
  const moodWithout: number[] = []

  for (const m of moods) {
    const moodValue = m.energy || 3
    if (exerciseDays.has(m.date)) {
      moodOnExercise.push(moodValue)
    } else {
      moodWithout.push(moodValue)
    }
  }

  if (moodOnExercise.length < 3 || moodWithout.length < 3) return insights

  const avgExercise = moodOnExercise.reduce((a, b) => a + b, 0) / moodOnExercise.length
  const avgNoExercise = moodWithout.reduce((a, b) => a + b, 0) / moodWithout.length

  if (avgExercise > avgNoExercise + 0.3) {
    insights.push({
      id: 'mood-exercise-correlation',
      type: 'correlation',
      title: 'Exercise improves your mood',
      description: `Your mood averages ${avgExercise.toFixed(1)}/5 on exercise days vs ${avgNoExercise.toFixed(1)}/5 on non-exercise days.`,
      icon: 'dumbbell',
      color: 'lantern-gold',
      priority: 'high',
      metadata: {
        factor1: 'exercise',
        factor2: 'mood',
        strength: Math.abs(avgExercise - avgNoExercise),
        direction: 'positive',
        sampleSize: moodOnExercise.length + moodWithout.length,
      },
    })
  }

  return insights
}

async function detectQuranTimingPattern(): Promise<Insight[]> {
  const insights: Insight[] = []
  const sessions = await db.readingSessionLogs.orderBy('date').toArray()
  if (sessions.length < 10) return insights

  const hourCounts = new Array(24).fill(0)
  for (const s of sessions) {
    const hour = new Date(s.startTime).getHours()
    hourCounts[hour]++
  }

  let peakHour = 0
  let peakCount = 0
  for (let i = 0; i < 24; i++) {
    if (hourCounts[i] > peakCount) {
      peakCount = hourCounts[i]
      peakHour = i
    }
  }

  if (peakCount > 3) {
    const timeLabel = peakHour < 12 ? `${peakHour} AM` : peakHour === 12 ? '12 PM' : `${peakHour - 12} PM`
    insights.push({
      id: 'quran-timing',
      type: 'pattern',
      title: `You read Quran most at ${timeLabel}`,
      description: `Most of your reading sessions happen around ${timeLabel}. This is your natural Quran time.`,
      icon: 'book-open',
      color: 'dusk-teal',
      priority: 'medium',
      metadata: {
        pattern: `Peak Quran reading: ${timeLabel}`,
        frequency: 'daily',
        confidence: peakCount / sessions.length,
      },
    })
  }

  return insights
}

async function detectWaterPattern(): Promise<Insight[]> {
  const insights: Insight[] = []
  const logs = await db.waterEntries.orderBy('date').toArray()
  if (logs.length < 14) return insights

  const byDate = new Map<string, number>()
  for (const log of logs) {
    byDate.set(log.date, (byDate.get(log.date) ?? 0) + log.amount)
  }

  const dayAvgs = new Array(7).fill(0)
  const dayCounts = new Array(7).fill(0)

  for (const [date, amount] of byDate) {
    const dow = dayOfWeek(date)
    dayAvgs[dow] += amount
    dayCounts[dow]++
  }

  let worstDay = 0
  let worstAvg = Infinity
  for (let i = 0; i < 7; i++) {
    if (dayCounts[i] > 0) {
      const avg = dayAvgs[i] / dayCounts[i]
      if (avg < worstAvg) {
        worstAvg = avg
        worstDay = i
      }
    }
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (worstAvg < 6) {
    insights.push({
      id: 'water-pattern',
      type: 'anomaly',
      title: `Water intake drops on ${dayNames[worstDay]}s`,
      description: `You average ${worstAvg.toFixed(1)} glasses on ${dayNames[worstDay]}s. Try setting a reminder.`,
      icon: 'droplets',
      color: 'dusk-teal',
      priority: 'medium',
      metadata: {
        pattern: `Low water day: ${dayNames[worstDay]}`,
        frequency: 'weekly',
        confidence: 0.7,
      },
    })
  }

  return insights
}

async function detectJournalPrayerCorrelation(): Promise<Insight[]> {
  const insights: Insight[] = []

  const [journal, prayers] = await Promise.all([
    db.journal.orderBy('date').toArray(),
    db.prayers.orderBy('date').toArray(),
  ])

  if (journal.length < 7 || prayers.length < 14) return insights

  const journalDates = new Set(journal.map((j) => j.date))
  let prayerRateOnJournalDays = 0
  let prayerRateOnNonJournalDays = 0
  let journalDayCount = 0
  let nonJournalDayCount = 0

  for (const p of prayers) {
    const completed = Object.values(p.completed).filter(Boolean).length
    const rate = completed / 5

    if (journalDates.has(p.date)) {
      prayerRateOnJournalDays += rate
      journalDayCount++
    } else {
      prayerRateOnNonJournalDays += rate
      nonJournalDayCount++
    }
  }

  if (journalDayCount < 3 || nonJournalDayCount < 3) return insights

  const avgJournal = prayerRateOnJournalDays / journalDayCount
  const avgNonJournal = prayerRateOnNonJournalDays / nonJournalDayCount

  if (avgJournal > avgNonJournal + 0.1) {
    insights.push({
      id: 'journal-prayer-correlation',
      type: 'correlation',
      title: 'Journaling improves prayer consistency',
      description: `On journaling days, you complete ${Math.round(avgJournal * 100)}% of prayers vs ${Math.round(avgNonJournal * 100)}% on non-journaling days.`,
      icon: 'pen-line',
      color: 'quiet-sage',
      priority: 'high',
      metadata: {
        factor1: 'journaling',
        factor2: 'prayer completion',
        strength: Math.abs(avgJournal - avgNonJournal),
        direction: 'positive',
        sampleSize: journalDayCount + nonJournalDayCount,
      },
    })
  }

  return insights
}

async function detectStreakInsights(): Promise<Insight[]> {
  const insights: Insight[] = []
  const prayers = await db.prayers.orderBy('date').toArray()
  if (prayers.length < 7) return insights

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  for (const p of prayers) {
    if (Object.values(p.completed).every(Boolean)) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }

  currentStreak = tempStreak

  if (currentStreak >= 7 && currentStreak >= longestStreak * 0.8) {
    insights.push({
      id: 'streak-current',
      type: 'streak',
      title: `You're on a ${currentStreak}-day streak`,
      description: 'Keep going! You\'re building a powerful habit.',
      icon: 'flame',
      color: 'lantern-gold',
      priority: 'high',
      metadata: { streak: currentStreak, longest: longestStreak },
    })
  }

  if (longestStreak >= 30) {
    insights.push({
      id: 'streak-record',
      type: 'milestone',
      title: `Your record: ${longestStreak}-day streak`,
      description: 'This is a remarkable achievement. MashaAllah!',
      icon: 'trophy',
      color: 'lantern-gold',
      priority: 'medium',
      metadata: { streak: longestStreak },
    })
  }

  return insights
}

async function generateWeeklyReport(): Promise<ReportInsight | null> {
  const today = getToday()
  const weekStart = daysAgo(6)

  const [prayers, habits, journal, khatmah, water] = await Promise.all([
    db.prayers.where('date').between(weekStart, today, true, true).toArray(),
    db.habitLogs.where('date').between(weekStart, today, true, true).toArray(),
    db.journal.where('date').between(weekStart, today, true, true).toArray(),
    db.khatmahProgress.where('date').between(weekStart, today, true, true).toArray(),
    db.waterEntries.where('date').between(weekStart, today, true, true).toArray(),
  ])

  let prayersCompleted = 0
  let prayersTotal = 0
  for (const p of prayers) {
    prayersCompleted += Object.values(p.completed).filter(Boolean).length
    prayersTotal += 5
  }

  const habitDefinitions = await db.habits.toArray()
  let habitsCompleted = 0
  for (const h of habitDefinitions) {
    const logs = habits.filter((l) => l.habitId === h.id)
    const total = logs.reduce((sum, l) => sum + l.value, 0)
    if (total >= h.target) habitsCompleted++
  }

  return {
    id: `weekly-${weekStart}`,
    type: 'report',
    title: 'Weekly Report',
    description: `Week of ${new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    icon: 'calendar',
    color: 'dusk-teal',
    priority: 'high',
    metadata: {
      period: 'weekly',
      startDate: weekStart,
      endDate: today,
      stats: {
        prayersCompleted,
        prayersTotal,
        prayerPercent: prayersTotal > 0 ? Math.round((prayersCompleted / prayersTotal) * 100) : 0,
        habitsCompleted,
        journalEntries: journal.length,
        quranPages: khatmah.reduce((sum, k) => sum + k.pagesRead, 0),
        waterGlasses: water.reduce((sum, w) => sum + w.amount, 0),
      },
    },
  }
}

async function generateMonthlyReport(): Promise<ReportInsight | null> {
  const today = getToday()
  const monthStart = daysAgo(29)

  const [prayers, journal, khatmah] = await Promise.all([
    db.prayers.where('date').between(monthStart, today, true, true).toArray(),
    db.journal.where('date').between(monthStart, today, true, true).toArray(),
    db.khatmahProgress.where('date').between(monthStart, today, true, true).toArray(),
  ])

  let prayersCompleted = 0
  let prayersTotal = 0
  let perfectDays = 0
  for (const p of prayers) {
    const completed = Object.values(p.completed).filter(Boolean).length
    prayersCompleted += completed
    prayersTotal += 5
    if (completed === 5) perfectDays++
  }

  return {
    id: `monthly-${monthStart}`,
    type: 'report',
    title: 'Monthly Report',
    description: `Last 30 days`,
    icon: 'calendar',
    color: 'dusk-teal',
    priority: 'high',
    metadata: {
      period: 'monthly',
      startDate: monthStart,
      endDate: today,
      stats: {
        prayersCompleted,
        prayersTotal,
        prayerPercent: prayersTotal > 0 ? Math.round((prayersCompleted / prayersTotal) * 100) : 0,
        perfectDays,
        journalEntries: journal.length,
        quranPages: khatmah.reduce((sum, k) => sum + k.pagesRead, 0),
      },
    },
  }
}

function prioritizeInsights(insights: Insight[]): Insight[] {
  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

export async function getInsights(): Promise<InsightsData> {
  const [
    prayerPatterns,
    moodExercise,
    quranTiming,
    waterPattern,
    journalPrayer,
    streaks,
    weeklyReport,
    monthlyReport,
  ] = await Promise.all([
    detectPrayerPatterns(),
    detectMoodExerciseCorrelation(),
    detectQuranTimingPattern(),
    detectWaterPattern(),
    detectJournalPrayerCorrelation(),
    detectStreakInsights(),
    generateWeeklyReport(),
    generateMonthlyReport(),
  ])

  const allInsights: Insight[] = [
    ...prayerPatterns,
    ...moodExercise,
    ...quranTiming,
    ...waterPattern,
    ...journalPrayer,
    ...streaks,
  ]

  return {
    insights: prioritizeInsights(allInsights),
    weeklyReport,
    monthlyReport,
    hasMore: false,
  }
}

export async function searchInsights(query: string): Promise<Insight[]> {
  const data = await getInsights()
  const lower = query.toLowerCase()

  return data.insights.filter(
    (i) =>
      i.title.toLowerCase().includes(lower) ||
      i.description.toLowerCase().includes(lower),
  )
}
