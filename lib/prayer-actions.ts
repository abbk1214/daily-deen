import db, { type Prayer } from './db'

/** Returns today's prayer times from IndexedDB, or undefined if not yet seeded. */
export async function getTodaysPrayers(): Promise<Prayer | undefined> {
  const dateStr = new Date().toISOString().split("T")[0]
  return db.prayers.where('date').equals(dateStr).first()
}
