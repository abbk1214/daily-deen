/* ──────────────────────────────────────────────
   Database module — re-exports everything
   ────────────────────────────────────────────── */

// Schema and singleton
export { getDb } from './schema'
export type { DailyDeenDB } from './schema'

// Types
export type {
  Prayer, Habit, HabitLog, JournalEntry, PrayerStatus, PrayerLog,
  QuranBookmark, QuranProgress, KhatmahGoal, KhatmahProgress,
  ReadingSessionLog, QuranSettings, Goal, GoalCheckIn,
  MoodEntry, WaterEntry, SleepEntry, ExerciseEntry,
  DailyQuote, TaraweehLog, PrayerAdjustments, AppSettings,
  DatabaseExport, TasbeehCount,
} from './types'
export {
  DEFAULT_QURAN_SETTINGS, DEFAULT_ADJUSTMENTS, DEFAULT_SETTINGS,
} from './types'

// Settings
export { getSettings, saveSettings, resetSettings, getQuranSettings, saveQuranSettings } from './settings'

// Quran
export {
  addQuranBookmark, removeQuranBookmark, isBookmarked, getBookmarks,
  updateReadingProgress, getReadingProgress, getLastReadSurah,
} from './quran'

// Khatmah
export {
  addKhatmahGoal, getActiveKhatmahGoal, getAllKhatmahGoals, deactivateKhatmahGoal,
  logKhatmahProgress, getKhatmahProgress, getKhatmahProgressRange,
  logReadingSession, getReadingSessions,
} from './khatmah'

// Goals
export {
  addGoal, getGoals, updateGoal, deleteGoal,
  addGoalCheckIn, getGoalCheckIns,
} from './goals'

// Backup
export { exportDatabase, importDatabase, clearAllData } from './backup'

/* ──────────────────────────────────────────────
   Lazy proxy for backward compatibility
   Allows: db.prayers.toArray(), db.habits.toArray(), etc.
   ────────────────────────────────────────────── */

import { getDb } from './schema'
import type { DailyDeenDB } from './schema'

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
