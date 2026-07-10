import type { PrayerName } from '../prayer/types'
import type { NotificationPayload } from './types'

const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
}

export function getPrayerReminderPayload(prayerName: PrayerName, offsetMinutes: number): NotificationPayload {
  const display = PRAYER_DISPLAY_NAMES[prayerName]
  return {
    title: `${display} Prayer`,
    body: `${display} begins in ${offsetMinutes} minute${offsetMinutes !== 1 ? 's' : ''}.`,
    tag: `daily-deen-reminder-${prayerName}`,
    requireInteraction: true,
  }
}

export function getPrayerStartPayload(prayerName: PrayerName): NotificationPayload {
  const display = PRAYER_DISPLAY_NAMES[prayerName]
  return {
    title: `${display} Prayer`,
    body: `It's time for ${display}. May Allah accept your prayer.`,
    tag: `daily-deen-prayer-${prayerName}`,
    requireInteraction: true,
  }
}

export function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000
}

export function getMsUntilMidnight(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

export function buildNotificationTag(prayerName: string, type: 'reminder' | 'prayer'): string {
  return `daily-deen-${type}-${prayerName}`
}
