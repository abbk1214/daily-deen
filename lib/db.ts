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
   Full database export / import / clear
   ────────────────────────────────────────────── */

export interface DatabaseExport {
  version: 1
  exportedAt: string
  prayers: Prayer[]
  habits: Habit[]
  habitLogs: HabitLog[]
  journal: JournalEntry[]
  settings: AppSettings
  prayerLogs: PrayerLog[]
}

export async function exportDatabase(): Promise<DatabaseExport> {
  const dbInstance = getDb()
  const [prayers, habits, habitLogs, journal, settings, prayerLogs] = await Promise.all([
    dbInstance.prayers.toArray(),
    dbInstance.habits.toArray(),
    dbInstance.habitLogs.toArray(),
    dbInstance.journal.toArray(),
    getSettings(),
    dbInstance.prayerLogs.toArray(),
  ])
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    prayers,
    habits,
    habitLogs,
    journal,
    settings,
    prayerLogs,
  }
}

export async function importDatabase(data: DatabaseExport): Promise<void> {
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
      await Promise.all([
        dbInstance.prayers.bulkAdd(data.prayers),
        dbInstance.habits.bulkAdd(data.habits),
        dbInstance.habitLogs.bulkAdd(data.habitLogs),
        dbInstance.journal.bulkAdd(data.journal),
        dbInstance.settings.put({ ...data.settings, id: 1 }),
        data.prayerLogs.length > 0 ? dbInstance.prayerLogs.bulkAdd(data.prayerLogs) : Promise.resolve(),
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
