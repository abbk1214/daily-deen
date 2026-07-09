import Dexie, { type Table } from 'dexie'

export interface Prayer {
  id?: number
  /** ISO date string e.g. "2026-07-08" */
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
  /** ISO date string e.g. "2026-07-08" */
  date: string
  value: number
  timestamp: number
}

export interface JournalEntry {
  id?: number
  /** ISO date string e.g. "2026-07-08" */
  date: string
  mood: string
  text: string
  tags: string[]
}

export interface AppSettings {
  id?: number
  latitude: number
  longitude: number
  calculationMethod: string
  notificationsEnabled: boolean
  onboardingComplete: boolean
  name: string
  language: string
  school: string
  reminderOffset: number
  adhanSound: boolean
  vibrate: boolean
  theme: string
  paperTexture: boolean
  textSize: string
  waterTarget: number
  exerciseTarget: number
  walkingTarget: number
}

/** Default settings used during onboarding and as fallback values. */
export const DEFAULT_SETTINGS: Omit<AppSettings, "id"> = {
  latitude: 0,
  longitude: 0,
  calculationMethod: "MuslimWorldLeague",
  notificationsEnabled: true,
  onboardingComplete: true,
  name: "",
  language: "English",
  school: "Shafi'i",
  reminderOffset: 10,
  adhanSound: false,
  vibrate: true,
  theme: "system",
  paperTexture: false,
  textSize: "default",
  waterTarget: 8,
  exerciseTarget: 30,
  walkingTarget: 8000,
}

class DailyDeenDB extends Dexie {
  prayers!: Table<Prayer, number>
  habits!: Table<Habit, number>
  habitLogs!: Table<HabitLog, number>
  journal!: Table<JournalEntry, number>
  settings!: Table<AppSettings, number>

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
  }
}

const db = new DailyDeenDB()

export async function getSettings(): Promise<AppSettings | undefined> {
  return db.settings.toCollection().first()
}

export async function saveSettings(
  data: Omit<AppSettings, 'id'>,
): Promise<AppSettings> {
  const existing = await db.settings.toCollection().first()
  if (existing?.id != null) {
    await db.settings.update(existing.id, data)
    return { ...data, id: existing.id }
  }
  const id = await db.settings.add(data as AppSettings)
  return { ...data, id }
}

export default db
