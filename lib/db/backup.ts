import { getDb } from './schema'
import { getSettings } from './settings'
import type { DatabaseExport } from './types'
import { DEFAULT_SETTINGS } from './types'

/* ──────────────────────────────────────────────
   Import validation
   ────────────────────────────────────────────── */

function validateImportData(data: unknown): data is DatabaseExport {
  if (!data || typeof data !== "object") return false
  const obj = data as Record<string, unknown>

  if (typeof obj.version !== "number" || obj.version < 1) return false
  if (typeof obj.exportedAt !== "string") return false
  if (!Array.isArray(obj.prayers)) return false
  if (!Array.isArray(obj.habits)) return false
  if (!Array.isArray(obj.habitLogs)) return false
  if (!Array.isArray(obj.journal)) return false
  if (!obj.settings || typeof obj.settings !== "object") return false

  return true
}

/* ──────────────────────────────────────────────
   Full database export / import / clear
   ────────────────────────────────────────────── */

export async function exportDatabase(): Promise<DatabaseExport> {
  const db = getDb()
  const [prayers, habits, habitLogs, journal, settings, prayerLogs, quranBookmarks, quranProgress, khatmahGoals, khatmahProgress, readingSessionLogs, goals, goalCheckIns, moodEntries, waterEntries, sleepEntries, exerciseEntries, dailyQuotes] = await Promise.all([
    db.prayers.toArray(),
    db.habits.toArray(),
    db.habitLogs.toArray(),
    db.journal.toArray(),
    getSettings(),
    db.prayerLogs.toArray(),
    db.quranBookmarks.toArray(),
    db.quranProgress.toArray(),
    db.khatmahGoals.toArray(),
    db.khatmahProgress.toArray(),
    db.readingSessionLogs.toArray(),
    db.goals.toArray(),
    db.goalCheckIns.toArray(),
    db.moodEntries.toArray(),
    db.waterEntries.toArray(),
    db.sleepEntries.toArray(),
    db.exerciseEntries.toArray(),
    db.dailyQuotes.toArray(),
  ])
  return {
    version: 10,
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
  if (!validateImportData(data)) {
    throw new Error("Invalid backup data: missing required fields or malformed structure")
  }
  const db = getDb()
  await db.transaction(
    'rw',
    [db.prayers, db.habits, db.habitLogs, db.journal, db.settings, db.prayerLogs, db.quranBookmarks, db.quranProgress, db.khatmahGoals, db.khatmahProgress, db.readingSessionLogs, db.goals, db.goalCheckIns, db.moodEntries, db.waterEntries, db.sleepEntries, db.exerciseEntries, db.dailyQuotes],
    async () => {
      await Promise.all([
        db.prayers.clear(),
        db.habits.clear(),
        db.habitLogs.clear(),
        db.journal.clear(),
        db.settings.clear(),
        db.prayerLogs.clear(),
        db.quranBookmarks.clear(),
        db.quranProgress.clear(),
        db.khatmahGoals.clear(),
        db.khatmahProgress.clear(),
        db.readingSessionLogs.clear(),
        db.goals.clear(),
        db.goalCheckIns.clear(),
        db.moodEntries.clear(),
        db.waterEntries.clear(),
        db.sleepEntries.clear(),
        db.exerciseEntries.clear(),
        db.dailyQuotes.clear(),
      ])
      await Promise.all([
        db.prayers.bulkAdd(data.prayers),
        db.habits.bulkAdd(data.habits),
        db.habitLogs.bulkAdd(data.habitLogs),
        db.journal.bulkAdd(data.journal),
        db.settings.put({ ...data.settings, id: 1 }),
        data.prayerLogs.length > 0 ? db.prayerLogs.bulkAdd(data.prayerLogs) : Promise.resolve(),
        data.quranBookmarks?.length ? db.quranBookmarks.bulkAdd(data.quranBookmarks) : Promise.resolve(),
        data.quranProgress?.length ? db.quranProgress.bulkAdd(data.quranProgress) : Promise.resolve(),
        data.khatmahGoals?.length ? db.khatmahGoals.bulkAdd(data.khatmahGoals) : Promise.resolve(),
        data.khatmahProgress?.length ? db.khatmahProgress.bulkAdd(data.khatmahProgress) : Promise.resolve(),
        data.readingSessionLogs?.length ? db.readingSessionLogs.bulkAdd(data.readingSessionLogs) : Promise.resolve(),
        data.goals?.length ? db.goals.bulkAdd(data.goals) : Promise.resolve(),
        data.goalCheckIns?.length ? db.goalCheckIns.bulkAdd(data.goalCheckIns) : Promise.resolve(),
        data.moodEntries?.length ? db.moodEntries.bulkAdd(data.moodEntries) : Promise.resolve(),
        data.waterEntries?.length ? db.waterEntries.bulkAdd(data.waterEntries) : Promise.resolve(),
        data.sleepEntries?.length ? db.sleepEntries.bulkAdd(data.sleepEntries) : Promise.resolve(),
        data.exerciseEntries?.length ? db.exerciseEntries.bulkAdd(data.exerciseEntries) : Promise.resolve(),
        data.dailyQuotes?.length ? db.dailyQuotes.bulkAdd(data.dailyQuotes) : Promise.resolve(),
      ])
    },
  )
}

export async function clearAllData(): Promise<void> {
  const db = getDb()
  await db.transaction(
    'rw',
    [db.prayers, db.habits, db.habitLogs, db.journal, db.settings, db.prayerLogs, db.quranBookmarks, db.quranProgress, db.khatmahGoals, db.khatmahProgress, db.readingSessionLogs, db.goals, db.goalCheckIns, db.moodEntries, db.waterEntries, db.sleepEntries, db.exerciseEntries, db.dailyQuotes],
    async () => {
      await Promise.all([
        db.prayers.clear(),
        db.habits.clear(),
        db.habitLogs.clear(),
        db.journal.clear(),
        db.settings.clear(),
        db.prayerLogs.clear(),
        db.quranBookmarks.clear(),
        db.quranProgress.clear(),
        db.khatmahGoals.clear(),
        db.khatmahProgress.clear(),
        db.readingSessionLogs.clear(),
        db.goals.clear(),
        db.goalCheckIns.clear(),
        db.moodEntries.clear(),
        db.waterEntries.clear(),
        db.sleepEntries.clear(),
        db.exerciseEntries.clear(),
        db.dailyQuotes.clear(),
      ])
      await db.settings.put({ ...DEFAULT_SETTINGS, id: 1 })
    },
  )
}
