import { markCompleted, markMissed, getDay } from './prayer/history-service'
import { getToday } from './utils'

type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

/** Returns today's prayer completion status derived from prayerLogs (single source of truth). */
export async function getTodaysPrayerStatus(): Promise<Record<PrayerName, boolean>> {
  const dateStr = getToday()
  const logs = await getDay(dateStr)
  const result: Record<string, boolean> = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false }
  for (const log of logs) {
    if (log.prayer in result) {
      result[log.prayer] = log.completed
    }
  }
  return result as Record<PrayerName, boolean>
}

/** Toggle a prayer for today. Returns the new boolean value. */
export async function togglePrayer(prayer: PrayerName): Promise<boolean> {
  const dateStr = getToday()
  const logs = await getDay(dateStr)
  const existing = logs.find((l) => l.prayer === prayer)
  const wasCompleted = existing?.completed ?? false
  const scheduledTime = existing?.scheduledTime ?? ''

  if (wasCompleted) {
    await markMissed(dateStr, prayer)
    return false
  } else {
    await markCompleted(dateStr, prayer, scheduledTime)
    return true
  }
}

/** Legacy compat — reads from prayerLogs and returns Prayer-shaped object. */
export async function getTodaysPrayers() {
  const status = await getTodaysPrayerStatus()
  const dateStr = getToday()
  const logs = await getDay(dateStr)
  const findTime = (p: string) => logs.find((l) => l.prayer === p)?.scheduledTime ?? ''
  return {
    date: dateStr,
    fajr: findTime('fajr'),
    dhuhr: findTime('dhuhr'),
    asr: findTime('asr'),
    maghrib: findTime('maghrib'),
    isha: findTime('isha'),
    completed: status,
  }
}
