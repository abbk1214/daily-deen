import type { Table } from 'dexie'

/* ──────────────────────────────────────────────
   Core types
   ────────────────────────────────────────────── */

export interface TasbeehCount {
  id?: number
  dhikrId: string
  target: number
  current: number
  date: string
}

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

export interface DailyQuote {
  id?: number
  text: string
  author: string
  date: string
  createdAt: number
}

/* ──────────────────────────────────────────────
   Quran types
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   Goal types
   ────────────────────────────────────────────── */

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

export interface TaraweehLog {
  id?: number
  date: string
  rakat: number
  completed: boolean
}

/* ──────────────────────────────────────────────
   Settings types
   ────────────────────────────────────────────── */

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
   Database export type
   ────────────────────────────────────────────── */

export interface DatabaseExport {
  version: number
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
  tasbeehCounts?: TasbeehCount[]
}
