import Dexie, { type Table } from 'dexie'

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

export interface AppSettings {
  id?: number
  latitude: number
  longitude: number
  calculationMethod: string
  notificationsEnabled: boolean
  onboardingComplete: boolean
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
  }
}

const db = new DailyDeenDB()

export async function seedDefaults() {
  const count = await db.habits.count()
  if (count > 0) return

  await db.habits.bulkAdd([
    { name: 'Exercise', type: 'exercise', target: 30, unit: 'min' },
    { name: 'Walk', type: 'walk', target: 10000, unit: 'steps' },
    { name: 'Hydration', type: 'hydration', target: 8, unit: 'glasses' },
  ])
}

export default db
