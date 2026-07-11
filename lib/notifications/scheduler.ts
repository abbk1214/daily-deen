import type { PrayerName } from '../prayer/types'
import type { ScheduledNotification, NotificationScheduleConfig } from './types'
import { canNotify } from './permission'
import { getPrayerReminderPayload, getPrayerStartPayload, minutesToMs } from './helpers'
import { playAdhanSound, stopAdhanSound } from './sound'

const PRAYER_NAMES: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

let scheduledNotifications: ScheduledNotification[] = []
let midnightTimer: ReturnType<typeof setTimeout> | null = null
let heartbeatInterval: ReturnType<typeof setInterval> | null = null
let rescheduleCallback: (() => void) | null = null
let currentConfig: NotificationScheduleConfig | null = null

function sendNotification(
  payload: { title: string; body: string; tag?: string; requireInteraction?: boolean },
  options: { silent: boolean; vibrate: boolean },
): void {
  if (!canNotify()) return

  try {
    const notification = new Notification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction ?? false,
      silent: options.silent,
    })

    if (options.vibrate && !options.silent && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  } catch {
    // Notification construction can fail in some environments
  }
}

function cancelAllScheduled(): void {
  for (const n of scheduledNotifications) {
    if (n.timeoutId !== null) {
      clearTimeout(n.timeoutId)
    }
  }
  scheduledNotifications = []

  if (midnightTimer !== null) {
    clearTimeout(midnightTimer)
    midnightTimer = null
  }

  if (heartbeatInterval !== null) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }

  stopAdhanSound()
}

function schedulePrayerNotification(
  prayerName: PrayerName,
  scheduledTimeMs: number,
  type: 'reminder' | 'prayer',
  config: NotificationScheduleConfig,
  offsetMinutes?: number,
): void {
  const now = Date.now()
  const delay = scheduledTimeMs - now

  if (delay <= 0) return

  const id = `${type}-${prayerName}-${scheduledTimeMs}`
  const timeoutId = setTimeout(() => {
    if (type === 'reminder' && offsetMinutes !== undefined) {
      sendNotification(getPrayerReminderPayload(prayerName, offsetMinutes), {
        silent: config.silent,
        vibrate: config.vibrate,
      })
    } else {
      sendNotification(getPrayerStartPayload(prayerName), {
        silent: config.silent,
        vibrate: config.vibrate,
      })

      if (config.adhanSound && prayerName !== 'sunrise') {
        playAdhanSound(0.5)
      }
    }

    scheduledNotifications = scheduledNotifications.filter((n) => n.id !== id)
  }, delay)

  scheduledNotifications.push({
    id,
    prayerName,
    type,
    scheduledTime: scheduledTimeMs,
    timeoutId,
  })
}

function cancelObsoleteNotifications(newConfig: NotificationScheduleConfig): void {
  if (!currentConfig) return

  const newKey = buildConfigKey(newConfig)
  const oldKey = buildConfigKey(currentConfig)

  if (newKey === oldKey) return

  for (const n of scheduledNotifications) {
    if (n.timeoutId !== null) {
      clearTimeout(n.timeoutId)
    }
  }
  scheduledNotifications = []
  stopAdhanSound()
}

function buildConfigKey(config: NotificationScheduleConfig): string {
  return `${config.date}:${config.prayerTimes.fajr}:${config.prayerTimes.dhuhr}:${config.prayerTimes.asr}:${config.prayerTimes.maghrib}:${config.prayerTimes.isha}:${config.reminderOffset}:${config.adhanSound}:${config.silent}`
}

function scheduleDay(config: NotificationScheduleConfig): number {
  cancelObsoleteNotifications(config)

  if (!canNotify()) return 0

  currentConfig = config
  const { prayerTimes, reminderOffset, date } = config
  const [year, month, day] = date.split('-').map(Number)

  let count = 0

  for (const prayerName of PRAYER_NAMES) {
    const prayerMinutes = prayerTimes[prayerName]
    const hours = Math.floor(prayerMinutes / 60)
    const minutes = prayerMinutes % 60

    const prayerDate = new Date(year, month - 1, day, hours, minutes, 0, 0)
    const prayerTimeMs = prayerDate.getTime()

    schedulePrayerNotification(prayerName, prayerTimeMs, 'prayer', config)
    count++

    const reminderMs = minutesToMs(reminderOffset)
    const reminderTimeMs = prayerTimeMs - reminderMs

    if (reminderTimeMs > Date.now()) {
      schedulePrayerNotification(prayerName, reminderTimeMs, 'reminder', config, reminderOffset)
      count++
    }
  }

  return count
}

function scheduleMidnightRefresh(): void {
  if (midnightTimer !== null) clearTimeout(midnightTimer)

  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const delay = midnight.getTime() - now.getTime()

  midnightTimer = setTimeout(() => {
    midnightTimer = null
    if (rescheduleCallback) {
      rescheduleCallback()
    }
    scheduleMidnightRefresh()
  }, delay + 1000)
}

function startHeartbeat(): void {
  if (heartbeatInterval !== null) return

  heartbeatInterval = setInterval(() => {
    const now = Date.now()
    scheduledNotifications = scheduledNotifications.filter((n) => {
      if (n.scheduledTime < now - 60_000) {
        if (n.timeoutId !== null) clearTimeout(n.timeoutId)
        return false
      }
      return true
    })
  }, 5 * 60 * 1000)
}

export function scheduleNotifications(config: NotificationScheduleConfig): number {
  const count = scheduleDay(config)
  scheduleMidnightRefresh()
  startHeartbeat()
  return count
}

export function cancelAllNotifications(): void {
  cancelAllScheduled()
  currentConfig = null
}

export function getScheduledCount(): number {
  return scheduledNotifications.length
}

export function setRescheduleCallback(callback: () => void): void {
  rescheduleCallback = callback
}

export function clearRescheduleCallback(): void {
  rescheduleCallback = null
}
