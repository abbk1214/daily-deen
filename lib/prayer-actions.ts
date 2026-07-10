import db, { type Prayer } from './db'

/** Returns today's prayer times from IndexedDB, or undefined if not yet seeded. */
export async function getTodaysPrayers(): Promise<Prayer | undefined> {
  const dateStr = new Date().toISOString().split("T")[0]
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
  const dateStr = new Date().toISOString().split("T")[0]

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
