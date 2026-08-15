import Dexie, { type Table } from 'dexie'
import type {
  Prayer, Habit, HabitLog, JournalEntry, AppSettings,
  PrayerLog, QuranBookmark, QuranProgress, KhatmahGoal,
  KhatmahProgress, ReadingSessionLog, Goal, GoalCheckIn,
  MoodEntry, WaterEntry, SleepEntry, ExerciseEntry,
  DailyQuote, TaraweehLog, QuranSettings,
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
