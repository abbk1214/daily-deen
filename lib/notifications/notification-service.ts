import type { PrayerTimes } from '../prayer/types'
import type { NotificationServiceState, NotificationScheduleConfig } from './types'
import type { Result } from '../result'
import {
  isNotificationSupported,
  getPermissionStatus,
  requestNotificationPermission,
  canNotify,
} from './permission'
import {
  scheduleNotifications,
  cancelAllNotifications,
  getScheduledCount,
  setRescheduleCallback,
  clearRescheduleCallback,
} from './scheduler'
import { getMsUntilMidnight } from './helpers'

let lastScheduleKey = ''

function buildScheduleKey(
  times: PrayerTimes,
  offset: number,
  date: string,
  adhanSound: boolean,
  vibrate: boolean,
  silent: boolean,
): string {
  return `${date}:${times.fajr}:${times.dhuhr}:${times.asr}:${times.maghrib}:${times.isha}:${offset}:${adhanSound}:${vibrate}:${silent}`
}

export function getNotificationState(): NotificationServiceState {
  return {
    permission: getPermissionStatus(),
    supported: isNotificationSupported(),
    enabled: canNotify(),
    scheduledCount: getScheduledCount(),
  }
}

export async function requestPermission(): Promise<Result<void>> {
  const result = await requestNotificationPermission()
  if (!result.ok) return result
  return { ok: true, value: undefined }
}

export function schedulePrayerNotifications(
  times: PrayerTimes,
  reminderOffset: number,
  date: string,
  adhanSound: boolean,
  vibrate: boolean,
  silent: boolean,
): number {
  if (!canNotify()) return 0

  const key = buildScheduleKey(times, reminderOffset, date, adhanSound, vibrate, silent)
  if (key === lastScheduleKey) return getScheduledCount()
  lastScheduleKey = key

  const config: NotificationScheduleConfig = {
    prayerTimes: times,
    reminderOffset,
    date,
    adhanSound,
    vibrate,
    silent,
  }

  return scheduleNotifications(config)
}

export function cancelPrayerNotifications(): void {
  lastScheduleKey = ''
  cancelAllNotifications()
}

export function initializeNotificationService(
  onReschedule: () => void,
): () => void {
  setRescheduleCallback(onReschedule)

  const midnightCheck = setInterval(() => {
    // Re-check at midnight boundary
  }, getMsUntilMidnight() + 60_000)

  return () => {
    clearRescheduleCallback()
    clearInterval(midnightCheck)
    cancelAllNotifications()
  }
}
