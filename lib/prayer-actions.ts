import db, { type Prayer } from './db'
import { getToday } from './utils'

/** Returns today's prayer times from IndexedDB, or undefined if not yet seeded. */
export async function getTodaysPrayers(): Promise<Prayer | undefined> {
  const dateStr = getToday()
  return db.prayers.where('date').equals(dateStr).first()
}

/** Seeds today's computed prayer times into IndexedDB for offline persistence. */
export async function seedTodaysPrayers(times: {
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}): Promise<void> {
  const dateStr = getToday()

  const existing = await db.prayers.where('date').equals(dateStr).first()
  if (existing) return

  await db.prayers.put({
    date: dateStr,
    fajr: times.fajr,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
    completed: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    },
  })
}

/** Toggles a prayer's completion status for today. */
export async function togglePrayer(
  prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
): Promise<boolean> {
  const dateStr = getToday()
  const existing = await db.prayers.where('date').equals(dateStr).first()

  if (!existing) return false

  const newValue = !existing.completed[prayer]
  await db.prayers.update(existing.id!, {
    completed: {
      ...existing.completed,
      [prayer]: newValue,
    },
  })

  return newValue
}

/** Marks a specific prayer as completed for a given date. */
export async function markPrayer(
  date: string,
  prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
  completed: boolean,
): Promise<void> {
  const existing = await db.prayers.where('date').equals(date).first()
  if (!existing) return

  await db.prayers.update(existing.id!, {
    completed: {
      ...existing.completed,
      [prayer]: completed,
    },
  })
}
