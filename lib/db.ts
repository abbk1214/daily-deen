import Dexie, { type Table } from 'dexie'

/* ──────────────────────────────────────────────
   Schema types
   ────────────────────────────────────────────── */

export interface Prayer {
  id?: number
  date: string
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  completed: {
    fajr: boolean
    dhuhr: boolean
    asr: boolean
    maghrib: boolean
    isha: boolean
  }
}

export interface Habit {
  id?: number
  name: string
  type: 'exercise' | 'walk' | 'hydration' | 'custom'
  target: number
  unit: string
  increment: number
}

export interface HabitLog {
  id?: number
  habitId: number
  date: string
  value: number
  timestamp: number
}

export interface JournalEntry {
  id?: number
  date: string
  mood: string
  text: string
  tags: string[]
}

export type PrayerStatus = 'completed' | 'missed' | 'qaza' | 'jamaah' | 'pending'

export interface PrayerLog {
  id?: number
  date: string
  prayer: string
  scheduledTime: string
  completedAt: string | null
  status: PrayerStatus
  completed: boolean
  late: boolean
  missed: boolean
  jamaah: boolean
  qaza: boolean
  notes: string
  createdAt: number
  updatedAt: number
}

export interface QuranBookmark {
  id?: number
  surahNumber: number
  ayahNumber: number
  surahName: string
  ayahText: string
  note?: string
  createdAt: number
}

export interface QuranProgress {
  id?: number
  surahNumber: number
  ayahNumber: number
  lastReadAt: number
}

export interface KhatmahGoal {
  id?: number
  type: 'pages_per_day' | 'juz_per_week' | 'surah_per_month' | 'full_quran_per_year'
  target: number
  startDate: string
  endDate?: string
  isActive: boolean
  createdAt: number
}

export interface KhatmahProgress {
  id?: number
  date: string
  pagesRead: number
  juzRead: number
  ayahsRead: number
  duration: number
  lastPage: number
  lastJuz: number
}

export interface ReadingSessionLog {
  id?: number
  date: string
  startTime: number
  endTime: number
  duration: number
  pagesRead: number
  ayahsRead: number
  startPage: number
  endPage: number
}

export interface Goal {
  id?: number
  title: string
  description: string
  type: 'quarterly' | 'monthly' | 'weekly' | 'daily'
  category: 'spiritual' | 'health' | 'knowledge' | 'character' | 'work'
  startDate: string
  endDate: string
  target: number
  progress: number
  unit: string
  isCompleted: boolean
  createdAt: number
}

export interface GoalCheckIn {
  id?: number
  goalId: number
  date: string
  value: number
  note: string
  createdAt: number
}

/* ──────────────────────────────────────────────
   Life Tracking types
   ────────────────────────────────────────────── */

export interface MoodEntry {
  id?: number
  date: string
  time: string
  mood: string
  emoji: string
  energy: number
  tags: string[]
  note: string
  createdAt: number
}

export interface WaterEntry {
  id?: number
  date: string
  amount: number
  timestamp: number
}

export interface SleepEntry {
  id?: number
  date: string
  bedtime: string
  wakeTime: string
  duration: number
  quality: number
  notes: string
  tags: string[]
  createdAt: number
}

export interface ExerciseEntry {
  id?: number
  date: string
  type: string
  name: string
  duration: number
  sets?: number
  reps?: number
  weight?: number
  distance?: number
  calories?: number
  notes: string
  createdAt: number
}

export interface DailyQuote {
  id?: number
  text: string
  author: string
  date: string
  createdAt: number
}

export interface TaraweehLog {
  id?: number
  date: string
  rakat: number
  completed: boolean
}

export interface QuranSettings {
  id?: number
  selectedReciter: string
  selectedTranslation: string
  fontSize: number
  showTranslation: boolean
  showTransliteration: boolean
  lastReadSurah: number
  lastReadAyah: number
}

export const DEFAULT_QURAN_SETTINGS: Omit<QuranSettings, 'id'> = {
  selectedReciter: 'ar.alafasy',
  selectedTranslation: 'en.sahih',
  fontSize: 28,
  showTranslation: true,
  showTransliteration: false,
  lastReadSurah: 1,
  lastReadAyah: 1,
}

export interface PrayerAdjustments {
  fajr: number
  sunrise: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}

export interface AppSettings {
  id: number
  latitude: number
  longitude: number
  city: string
  country: string
  timezone: string
  locationUpdatedAt: number
  accuracy: number
  locationManualOverride: boolean
  calculationMethod: string
  notificationsEnabled: boolean
  onboardingComplete: boolean
  name: string
  language: string
  school: string
  reminderOffset: number
  adhanSound: boolean
  vibrate: boolean
  silentMode: boolean
  theme: string
  paperTexture: boolean
  textSize: string
  waterTarget: number
  exerciseTarget: number
  walkingTarget: number
  prayerAdjustments: PrayerAdjustments
  compassShowDegrees: boolean
  compassAutoCalibration: boolean
  compassSmoothing: number
  calendarType: 'gregorian' | 'hijri'
  dashboardCardOrder: string[]
  dashboardHiddenCards: string[]
}

export const DEFAULT_ADJUSTMENTS: PrayerAdjustments = {
  fajr: 0,
  sunrise: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: 1,
  latitude: 0,
  longitude: 0,
  city: '',
  country: '',
  timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
  locationUpdatedAt: 0,
  accuracy: 0,
  locationManualOverride: false,
  calculationMethod: "MuslimWorldLeague",
  notificationsEnabled: true,
  onboardingComplete: true,
  name: "",
  language: "English",
  school: "Shafi'i",
  reminderOffset: 10,
  adhanSound: false,
  vibrate: true,
  silentMode: false,
  theme: "system",
  paperTexture: false,
  textSize: "default",
  waterTarget: 8,
  exerciseTarget: 30,
  walkingTarget: 8000,
  prayerAdjustments: { ...DEFAULT_ADJUSTMENTS },
  compassShowDegrees: true,
  compassAutoCalibration: true,
  compassSmoothing: 0.3,
  calendarType: 'gregorian',
  dashboardCardOrder: [
    'greeting',
    'dayArc',
    'nextPrayer',
    'weather',
    'streak',
    'completion',
    'habits',
    'qibla',
    'progress',
    'prayerStatus',
    'journal',
    'quran',
    'quickActions',
    'affirmation',
  ],
  dashboardHiddenCards: [],
}

/* ──────────────────────────────────────────────
   Database class
   ────────────────────────────────────────────── */

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
    });

    this.version(4).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
    });

    this.version(5).stores({
      prayers: '++id, &date',
      habits: '++id, &name, type',
      habitLogs: '++id, date, &[habitId+date]',
      journal: '++id, &date',
      settings: '++id',
      prayerLogs: '++id, &[date+prayer], date, prayer, status',
      quranBookmarks: '++id, &[surahNumber+ayahNumber], surahNumber, createdAt',
      quranProgress: '++id, surahNumber, lastReadAt',
    });

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
    });

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
    });

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
    });

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
    });

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
    });
  }
}

/* ──────────────────────────────────────────────
   Lazy database singleton (SSG-safe)
   ────────────────────────────────────────────── */

let _db: DailyDeenDB | null = null

function getDb(): DailyDeenDB {
  if (!_db) {
    _db = new DailyDeenDB()
  }
  return _db
}

// Proxy so `db.table` calls work directly (e.g. db.prayers.toArray())
const dbProxy = new Proxy({} as DailyDeenDB, {
  get(_target, prop, _receiver) {
    const dbInstance = getDb()
    const value = Reflect.get(dbInstance, prop, dbInstance)
    if (typeof value === 'function') {
      return value.bind(dbInstance)
    }
    return value
  },
})

export default dbProxy

/* ──────────────────────────────────────────────
   Settings CRUD — single row, id = 1
   ────────────────────────────────────────────── */

function mergeWithDefaults(saved: AppSettings): AppSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    id: 1,
    locationManualOverride: saved.locationManualOverride ?? false,
    calendarType: saved.calendarType ?? 'gregorian',
    silentMode: saved.silentMode ?? false,
    prayerAdjustments: {
      ...DEFAULT_ADJUSTMENTS,
      ...(saved.prayerAdjustments ?? {}),
    },
    dashboardCardOrder: saved.dashboardCardOrder ?? DEFAULT_SETTINGS.dashboardCardOrder,
    dashboardHiddenCards: saved.dashboardHiddenCards ?? DEFAULT_SETTINGS.dashboardHiddenCards,
  }
}

export async function getSettings(): Promise<AppSettings> {
  const dbInstance = getDb()
  const existing = await dbInstance.settings.get(1)
  if (existing) return mergeWithDefaults(existing)
  await dbInstance.settings.put({ ...DEFAULT_SETTINGS, id: 1 })
  return { ...DEFAULT_SETTINGS, id: 1 }
}

export async function saveSettings(
  partial: Partial<Omit<AppSettings, 'id'>>,
): Promise<AppSettings> {
  const dbInstance = getDb()
  const current = await getSettings()
  const next: AppSettings = {
    ...current,
    ...partial,
    id: 1,
    prayerAdjustments: {
      ...current.prayerAdjustments,
      ...(partial.prayerAdjustments ?? {}),
    },
  }
  await dbInstance.settings.put(next)
  return next
}

export async function resetSettings(): Promise<AppSettings> {
  const dbInstance = getDb()
  const reset = { ...DEFAULT_SETTINGS, id: 1 }
  await dbInstance.settings.put(reset)
  return reset
}

/* ──────────────────────────────────────────────
   Quran Settings CRUD — single row, id = 1
   ────────────────────────────────────────────── */

export async function getQuranSettings(): Promise<QuranSettings> {
  const dbInstance = getDb()
  const existing = await dbInstance.quranSettings.get(1)
  if (existing) return { ...DEFAULT_QURAN_SETTINGS, ...existing, id: 1 }
  await dbInstance.quranSettings.put({ ...DEFAULT_QURAN_SETTINGS, id: 1 })
  return { ...DEFAULT_QURAN_SETTINGS, id: 1 }
}

export async function saveQuranSettings(
  partial: Partial<Omit<QuranSettings, 'id'>>,
): Promise<QuranSettings> {
  const dbInstance = getDb()
  const current = await getQuranSettings()
  const next: QuranSettings = { ...current, ...partial, id: 1 }
  await dbInstance.quranSettings.put(next)
  return next
}

/* ──────────────────────────────────────────────
   Full database export / import / clear
   ────────────────────────────────────────────── */

export interface DatabaseExport {
  version: 8
  exportedAt: string
  prayers: Prayer[]
  habits: Habit[]
  habitLogs: HabitLog[]
  journal: JournalEntry[]
  settings: AppSettings
  prayerLogs: PrayerLog[]
  quranBookmarks?: QuranBookmark[]
  quranProgress?: QuranProgress[]
  khatmahGoals?: KhatmahGoal[]
  khatmahProgress?: KhatmahProgress[]
  readingSessionLogs?: ReadingSessionLog[]
  goals?: Goal[]
  goalCheckIns?: GoalCheckIn[]
  moodEntries?: MoodEntry[]
  waterEntries?: WaterEntry[]
  sleepEntries?: SleepEntry[]
  exerciseEntries?: ExerciseEntry[]
  dailyQuotes?: DailyQuote[]
}

export async function exportDatabase(): Promise<DatabaseExport> {
  const dbInstance = getDb()
  const [prayers, habits, habitLogs, journal, settings, prayerLogs, quranBookmarks, quranProgress, khatmahGoals, khatmahProgress, readingSessionLogs, goals, goalCheckIns, moodEntries, waterEntries, sleepEntries, exerciseEntries, dailyQuotes] = await Promise.all([
    dbInstance.prayers.toArray(),
    dbInstance.habits.toArray(),
    dbInstance.habitLogs.toArray(),
    dbInstance.journal.toArray(),
    getSettings(),
    dbInstance.prayerLogs.toArray(),
    dbInstance.quranBookmarks.toArray(),
    dbInstance.quranProgress.toArray(),
    dbInstance.khatmahGoals.toArray(),
    dbInstance.khatmahProgress.toArray(),
    dbInstance.readingSessionLogs.toArray(),
    dbInstance.goals.toArray(),
    dbInstance.goalCheckIns.toArray(),
    dbInstance.moodEntries.toArray(),
    dbInstance.waterEntries.toArray(),
    dbInstance.sleepEntries.toArray(),
    dbInstance.exerciseEntries.toArray(),
    dbInstance.dailyQuotes.toArray(),
  ])
  return {
    version: 8,
    exportedAt: new Date().toISOString(),
    prayers,
    habits,
    habitLogs,
    journal,
    settings,
    prayerLogs,
    quranBookmarks,
    quranProgress,
    khatmahGoals,
    khatmahProgress,
    readingSessionLogs,
    goals,
    goalCheckIns,
    moodEntries,
    waterEntries,
    sleepEntries,
    exerciseEntries,
    dailyQuotes,
  }
}

export async function importDatabase(data: DatabaseExport): Promise<void> {
  const dbInstance = getDb()
  await dbInstance.transaction(
    'rw',
    [dbInstance.prayers, dbInstance.habits, dbInstance.habitLogs, dbInstance.journal, dbInstance.settings, dbInstance.prayerLogs, dbInstance.quranBookmarks, dbInstance.quranProgress, dbInstance.khatmahGoals, dbInstance.khatmahProgress, dbInstance.readingSessionLogs, dbInstance.goals, dbInstance.goalCheckIns, dbInstance.moodEntries, dbInstance.waterEntries, dbInstance.sleepEntries, dbInstance.exerciseEntries, dbInstance.dailyQuotes],
    async () => {
      await Promise.all([
        dbInstance.prayers.clear(),
        dbInstance.habits.clear(),
        dbInstance.habitLogs.clear(),
        dbInstance.journal.clear(),
        dbInstance.settings.clear(),
        dbInstance.prayerLogs.clear(),
        dbInstance.quranBookmarks.clear(),
        dbInstance.quranProgress.clear(),
        dbInstance.khatmahGoals.clear(),
        dbInstance.khatmahProgress.clear(),
        dbInstance.readingSessionLogs.clear(),
        dbInstance.goals.clear(),
        dbInstance.goalCheckIns.clear(),
        dbInstance.moodEntries.clear(),
        dbInstance.waterEntries.clear(),
        dbInstance.sleepEntries.clear(),
        dbInstance.exerciseEntries.clear(),
        dbInstance.dailyQuotes.clear(),
      ])
      await Promise.all([
        dbInstance.prayers.bulkAdd(data.prayers),
        dbInstance.habits.bulkAdd(data.habits),
        dbInstance.habitLogs.bulkAdd(data.habitLogs),
        dbInstance.journal.bulkAdd(data.journal),
        dbInstance.settings.put({ ...data.settings, id: 1 }),
        data.prayerLogs.length > 0 ? dbInstance.prayerLogs.bulkAdd(data.prayerLogs) : Promise.resolve(),
        data.quranBookmarks?.length ? dbInstance.quranBookmarks.bulkAdd(data.quranBookmarks) : Promise.resolve(),
        data.quranProgress?.length ? dbInstance.quranProgress.bulkAdd(data.quranProgress) : Promise.resolve(),
        data.khatmahGoals?.length ? dbInstance.khatmahGoals.bulkAdd(data.khatmahGoals) : Promise.resolve(),
        data.khatmahProgress?.length ? dbInstance.khatmahProgress.bulkAdd(data.khatmahProgress) : Promise.resolve(),
        data.readingSessionLogs?.length ? dbInstance.readingSessionLogs.bulkAdd(data.readingSessionLogs) : Promise.resolve(),
        data.goals?.length ? dbInstance.goals.bulkAdd(data.goals) : Promise.resolve(),
        data.goalCheckIns?.length ? dbInstance.goalCheckIns.bulkAdd(data.goalCheckIns) : Promise.resolve(),
        data.moodEntries?.length ? dbInstance.moodEntries.bulkAdd(data.moodEntries) : Promise.resolve(),
        data.waterEntries?.length ? dbInstance.waterEntries.bulkAdd(data.waterEntries) : Promise.resolve(),
        data.sleepEntries?.length ? dbInstance.sleepEntries.bulkAdd(data.sleepEntries) : Promise.resolve(),
        data.exerciseEntries?.length ? dbInstance.exerciseEntries.bulkAdd(data.exerciseEntries) : Promise.resolve(),
        data.dailyQuotes?.length ? dbInstance.dailyQuotes.bulkAdd(data.dailyQuotes) : Promise.resolve(),
      ])
    },
  )
}

export async function clearAllData(): Promise<void> {
  const dbInstance = getDb()
  await dbInstance.transaction(
    'rw',
    [dbInstance.prayers, dbInstance.habits, dbInstance.habitLogs, dbInstance.journal, dbInstance.settings, dbInstance.prayerLogs],
    async () => {
      await Promise.all([
        dbInstance.prayers.clear(),
        dbInstance.habits.clear(),
        dbInstance.habitLogs.clear(),
        dbInstance.journal.clear(),
        dbInstance.settings.clear(),
        dbInstance.prayerLogs.clear(),
      ])
      await dbInstance.settings.put({ ...DEFAULT_SETTINGS, id: 1 })
    },
  )
}

/* ──────────────────────────────────────────────
   Quran CRUD — bookmarks and reading progress
   ────────────────────────────────────────────── */

export async function addQuranBookmark(
  surahNumber: number,
  ayahNumber: number,
  surahName: string,
  ayahText: string,
  note?: string,
): Promise<QuranBookmark> {
  const dbInstance = getDb()
  const existing = await dbInstance.quranBookmarks
    .where('[surahNumber+ayahNumber]')
    .equals([surahNumber, ayahNumber])
    .first()
  if (existing) return existing
  const bookmark: QuranBookmark = {
    surahNumber,
    ayahNumber,
    surahName,
    ayahText,
    note,
    createdAt: Date.now(),
  }
  const id = await dbInstance.quranBookmarks.add(bookmark)
  return { ...bookmark, id }
}

export async function removeQuranBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
  const dbInstance = getDb()
  const existing = await dbInstance.quranBookmarks
    .where('[surahNumber+ayahNumber]')
    .equals([surahNumber, ayahNumber])
    .first()
  if (existing?.id) await dbInstance.quranBookmarks.delete(existing.id)
}

export async function isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
  const dbInstance = getDb()
  const existing = await dbInstance.quranBookmarks
    .where('[surahNumber+ayahNumber]')
    .equals([surahNumber, ayahNumber])
    .first()
  return !!existing
}

export async function getBookmarks(): Promise<QuranBookmark[]> {
  const dbInstance = getDb()
  return dbInstance.quranBookmarks.orderBy('createdAt').reverse().toArray()
}

export async function updateReadingProgress(surahNumber: number, ayahNumber: number): Promise<void> {
  const dbInstance = getDb()
  const existing = await dbInstance.quranProgress
    .where('surahNumber')
    .equals(surahNumber)
    .first()
  if (existing?.id) {
    await dbInstance.quranProgress.update(existing.id, {
      ayahNumber,
      lastReadAt: Date.now(),
    })
  } else {
    await dbInstance.quranProgress.add({
      surahNumber,
      ayahNumber,
      lastReadAt: Date.now(),
    })
  }
}

export async function getReadingProgress(): Promise<QuranProgress[]> {
  const dbInstance = getDb()
  return dbInstance.quranProgress.toArray()
}

export async function getLastReadSurah(): Promise<{ surahNumber: number; ayahNumber: number } | null> {
  const dbInstance = getDb()
  const all = await dbInstance.quranProgress.toArray()
  if (all.length === 0) return null
  all.sort((a, b) => b.lastReadAt - a.lastReadAt)
  const latest = all[0]
  return { surahNumber: latest.surahNumber, ayahNumber: latest.ayahNumber }
}

/* ──────────────────────────────────────────────
   Khatmah CRUD — goals, daily progress, sessions
   ────────────────────────────────────────────── */

export async function addKhatmahGoal(
  type: KhatmahGoal['type'],
  target: number,
  startDate: string,
): Promise<KhatmahGoal> {
  const dbInstance = getDb()
  const goal: KhatmahGoal = {
    type,
    target,
    startDate,
    isActive: true,
    createdAt: Date.now(),
  }
  const id = await dbInstance.khatmahGoals.add(goal)
  return { ...goal, id }
}

export async function getActiveKhatmahGoal(): Promise<KhatmahGoal | null> {
  const dbInstance = getDb()
  const result = await dbInstance.khatmahGoals.where('isActive').equals(1).first()
  return result ?? null
}

export async function getAllKhatmahGoals(): Promise<KhatmahGoal[]> {
  const dbInstance = getDb()
  return dbInstance.khatmahGoals.orderBy('createdAt').reverse().toArray()
}

export async function deactivateKhatmahGoal(id: number): Promise<void> {
  const dbInstance = getDb()
  await dbInstance.khatmahGoals.update(id, { isActive: false })
}

export async function logKhatmahProgress(entry: {
  pagesRead: number
  juzRead: number
  ayahsRead: number
  duration: number
  lastPage: number
  lastJuz: number
}): Promise<KhatmahProgress> {
  const dbInstance = getDb()
  const today = new Date().toISOString().split('T')[0]
  const existing = await dbInstance.khatmahProgress.where('date').equals(today).first()
  if (existing?.id) {
    await dbInstance.khatmahProgress.update(existing.id, {
      pagesRead: existing.pagesRead + entry.pagesRead,
      juzRead: existing.juzRead + entry.juzRead,
      ayahsRead: existing.ayahsRead + entry.ayahsRead,
      duration: existing.duration + entry.duration,
      lastPage: entry.lastPage,
      lastJuz: entry.lastJuz,
    })
    return { ...existing, ...entry }
  }
  const progress: KhatmahProgress = { date: today, ...entry }
  const id = await dbInstance.khatmahProgress.add(progress)
  return { ...progress, id }
}

export async function getKhatmahProgress(): Promise<KhatmahProgress[]> {
  const dbInstance = getDb()
  return dbInstance.khatmahProgress.orderBy('date').reverse().toArray()
}

export async function getKhatmahProgressRange(
  startDate: string,
  endDate: string,
): Promise<KhatmahProgress[]> {
  const dbInstance = getDb()
  return dbInstance.khatmahProgress
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray()
}

export async function logReadingSession(session: {
  startTime: number
  endTime: number
  duration: number
  pagesRead: number
  ayahsRead: number
  startPage: number
  endPage: number
}): Promise<ReadingSessionLog> {
  const dbInstance = getDb()
  const today = new Date().toISOString().split('T')[0]
  const log: ReadingSessionLog = { date: today, ...session }
  const id = await dbInstance.readingSessionLogs.add(log)
  return { ...log, id }
}

export async function getReadingSessions(): Promise<ReadingSessionLog[]> {
  const dbInstance = getDb()
  return dbInstance.readingSessionLogs.orderBy('date').reverse().toArray()
}

/* ──────────────────────────────────────────────
   Goals CRUD
   ────────────────────────────────────────────── */

export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
  const dbInstance = getDb()
  const newGoal: Goal = { ...goal, createdAt: Date.now() }
  const id = await dbInstance.goals.add(newGoal)
  return { ...newGoal, id }
}

export async function getGoals(type?: Goal['type']): Promise<Goal[]> {
  const dbInstance = getDb()
  if (type) return dbInstance.goals.where('type').equals(type).reverse().sortBy('createdAt')
  return dbInstance.goals.orderBy('createdAt').reverse().toArray()
}

export async function updateGoal(id: number, patch: Partial<Omit<Goal, 'id' | 'createdAt'>>): Promise<void> {
  const dbInstance = getDb()
  await dbInstance.goals.update(id, patch)
}

export async function deleteGoal(id: number): Promise<void> {
  const dbInstance = getDb()
  await dbInstance.goals.delete(id)
  await dbInstance.goalCheckIns.where('goalId').equals(id).delete()
}

export async function addGoalCheckIn(checkIn: Omit<GoalCheckIn, 'id' | 'createdAt'>): Promise<GoalCheckIn> {
  const dbInstance = getDb()
  const newCheckIn: GoalCheckIn = { ...checkIn, createdAt: Date.now() }
  const id = await dbInstance.goalCheckIns.add(newCheckIn)
  return { ...newCheckIn, id }
}

export async function getGoalCheckIns(goalId: number): Promise<GoalCheckIn[]> {
  const dbInstance = getDb()
  return dbInstance.goalCheckIns.where('goalId').equals(goalId).reverse().sortBy('date')
}
