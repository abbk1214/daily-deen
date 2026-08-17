import Dexie, { type Table } from 'dexie'
import type {
  Prayer, Habit, HabitLog, JournalEntry, AppSettings,
  PrayerLog, QuranBookmark, QuranProgress, KhatmahGoal,
  KhatmahProgress, ReadingSessionLog, Goal, GoalCheckIn,
  MoodEntry, WaterEntry, SleepEntry, ExerciseEntry,
  DailyQuote, TaraweehLog, QuranSettings, TasbeehCount,
} from './types'

class DailyDeenDB extends Dexie {
  prayers!: Table<Prayer, number>
  habits!: Table<Habit, number>
  habitLogs!: Table<HabitLog, number>
  journal!: Table<JournalEntry, number>
  settings!: Table<AppSettings, number>
  prayerLogs!: Table<PrayerLog, number>
  quranBookmarks!: Table<QuranBookmark, number>
  quranProgress!: Table<QuranProgress, number>
  khatmahGoals!: Table<KhatmahGoal, number>
  khatmahProgress!: Table<KhatmahProgress, number>
  readingSessionLogs!: Table<ReadingSessionLog, number>
  goals!: Table<Goal, number>
  goalCheckIns!: Table<GoalCheckIn, number>
  moodEntries!: Table<MoodEntry, number>
  waterEntries!: Table<WaterEntry, number>
  sleepEntries!: Table<SleepEntry, number>
  exerciseEntries!: Table<ExerciseEntry, number>
  dailyQuotes!: Table<DailyQuote, number>
  taraweeh!: Table<TaraweehLog, number>
  quranSettings!: Table<QuranSettings, number>
  tasbeehCounts!: Table<TasbeehCount, number>

  constructor() {
    super('DailyDeenDB')

    this.version(1).stores({
      prayers: '++id, date',
      habits: '++id, name, type',
      habitLogs: '++id, habitId, date',
      journal: '++id, date',
      settings: '++id',
    })

    this.version(2).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
    })

    this.version(3).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
    })

    this.version(4).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
    })

    this.version(5).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
    })

    this.version(6).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
      khatmahGoals: '++id, isActive, type, createdAt',
      khatmahProgress: '++id, &date, lastPage, lastJuz',
      readingSessionLogs: '++id, date, startPage, endPage',
    })

    this.version(7).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
      khatmahGoals: '++id, isActive, type, createdAt',
      khatmahProgress: '++id, &date, lastPage, lastJuz',
      readingSessionLogs: '++id, date, startPage, endPage',
      goals: '++id, type, category, startDate, endDate, isCompleted, createdAt',
      goalCheckIns: '++id, &[goalId+date], goalId, date',
    })

    this.version(8).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
      khatmahGoals: '++id, isActive, type, createdAt',
      khatmahProgress: '++id, &date, lastPage, lastJuz',
      readingSessionLogs: '++id, date, startPage, endPage',
      goals: '++id, type, category, startDate, endDate, isCompleted, createdAt',
      goalCheckIns: '++id, &[goalId+date], goalId, date',
      moodEntries: '++id, date, &[date+time], createdAt',
      waterEntries: '++id, date, timestamp',
      sleepEntries: '++id, &date, createdAt',
      exerciseEntries: '++id, date, type, createdAt',
      dailyQuotes: '++id, &date, createdAt',
    })

    this.version(9).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
      khatmahGoals: '++id, isActive, type, createdAt',
      khatmahProgress: '++id, &date, lastPage, lastJuz',
      readingSessionLogs: '++id, date, startPage, endPage',
      goals: '++id, type, category, startDate, endDate, isCompleted, createdAt',
      goalCheckIns: '++id, &[goalId+date], goalId, date',
      moodEntries: '++id, date, &[date+time], createdAt',
      waterEntries: '++id, date, timestamp',
      sleepEntries: '++id, &date, createdAt',
      exerciseEntries: '++id, date, type, createdAt',
      dailyQuotes: '++id, &date, createdAt',
      taraweeh: '++id, &date',
    })

    this.version(10).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
      khatmahGoals: '++id, isActive, type, createdAt',
      khatmahProgress: '++id, &date, lastPage, lastJuz',
      readingSessionLogs: '++id, date, startPage, endPage',
      goals: '++id, type, category, startDate, endDate, isCompleted, createdAt',
      goalCheckIns: '++id, &[goalId+date], goalId, date',
      moodEntries: '++id, date, &[date+time], createdAt',
      waterEntries: '++id, date, timestamp',
      sleepEntries: '++id, &date, createdAt',
      exerciseEntries: '++id, date, type, createdAt',
      dailyQuotes: '++id, &date, createdAt',
      taraweeh: '++id, &date',
      quranSettings: '++id',
    })

    // Version 11: Migrate old prayers table data into prayerLogs + add tasbeehCounts
    this.version(11).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
      khatmahGoals: '++id, isActive, type, createdAt',
      khatmahProgress: '++id, &date, lastPage, lastJuz',
      readingSessionLogs: '++id, date, startPage, endPage',
      goals: '++id, type, category, startDate, endDate, isCompleted, createdAt',
      goalCheckIns: '++id, &[goalId+date], goalId, date',
      moodEntries: '++id, date, &[date+time], createdAt',
      waterEntries: '++id, date, timestamp',
      sleepEntries: '++id, &date, createdAt',
      exerciseEntries: '++id, date, type, createdAt',
      dailyQuotes: '++id, &date, createdAt',
      taraweeh: '++id, &date',
      quranSettings: '++id',
      tasbeehCounts: '++id, &[dhikrId+date], dhikrId, date',
    }).upgrade(async (tx) => {
      // Migrate old prayers table records into prayerLogs
      const prayers = await (tx.table('prayers') as any).toArray()
      const existingLogs = await (tx.table('prayerLogs') as any).toArray()
      const existingKeys = new Set(existingLogs.map((l: any) => `${l.date}+${l.prayer}`))

      const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
      const toAdd: any[] = []

      for (const p of prayers) {
        for (const prayer of PRAYERS) {
          const key = `${p.date}+${prayer}`
          if (existingKeys.has(key)) continue

          toAdd.push({
            date: p.date,
            prayer,
            scheduledTime: p[prayer] || '',
            completedAt: p.completed?.[prayer] ? new Date(p.date + 'T12:00:00').toISOString() : null,
            status: p.completed?.[prayer] ? 'completed' : 'pending',
            completed: !!p.completed?.[prayer],
            late: false,
            missed: false,
            jamaah: false,
            qaza: false,
            notes: '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
        }
      }

      if (toAdd.length > 0) {
        await (tx.table('prayerLogs') as any).bulkAdd(toAdd)
      }
    })
  }
}

/* ──────────────────────────────────────────────
   Lazy database singleton (SSG-safe)
   ────────────────────────────────────────────── */

let _db: DailyDeenDB | null = null

export function getDb(): DailyDeenDB {
  if (!_db) {
    _db = new DailyDeenDB()
  }
  return _db
}

export type { DailyDeenDB }
