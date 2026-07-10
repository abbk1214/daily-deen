import type { PrayerName } from '../prayer/types'
import type { ScheduledNotification, NotificationScheduleConfig } from './types'
import { canNotify } from './permission'
import { getPrayerReminderPayload, getPrayerStartPayload, minutesToMs } from './helpers'

const PRAYER_NAMES: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

let scheduledNotifications: ScheduledNotification[] = []
let midnightTimer: ReturnType<typeof setTimeout> | null = null
let heartbeatInterval: ReturnType<typeof setInterval> | null = null
let rescheduleCallback: (() => void) | null = null

function sendNotification(payload: { title: string; body: string; tag?: string; requireInteraction?: boolean }): void {
  if (!canNotify()) return

  try {
    const notification = new Notification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction ?? false,
    })

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
}

function schedulePrayerNotification(
  prayerName: PrayerName,
  scheduledTimeMs: number,
  type: 'reminder' | 'prayer',
  offsetMinutes?: number,
): void {
  const now = Date.now()
  const delay = scheduledTimeMs - now

  if (delay <= 0) return

  const id = `${type}-${prayerName}-${scheduledTimeMs}`
  const timeoutId = setTimeout(() => {
    if (type === 'reminder' && offsetMinutes !== undefined) {
      sendNotification(getPrayerReminderPayload(prayerName, offsetMinutes))
    } else {
      sendNotification(getPrayerStartPayload(prayerName))
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

function scheduleDay(config: NotificationScheduleConfig): number {
  cancelAllScheduled()

  if (!canNotify()) return 0

  const { prayerTimes, reminderOffset, date } = config
  const [year, month, day] = date.split('-').map(Number)

  let count = 0

  for (const prayerName of PRAYER_NAMES) {
    const prayerMinutes = prayerTimes[prayerName]
    const hours = Math.floor(prayerMinutes / 60)
    const minutes = prayerMinutes % 60

    const prayerDate = new Date(year, month - 1, day, hours, minutes, 0, 0)
    const prayerTimeMs = prayerDate.getTime()

    schedulePrayerNotification(prayerName, prayerTimeMs, 'prayer')
    count++

    const reminderMs = minutesToMs(reminderOffset)
    const reminderTimeMs = prayerTimeMs - reminderMs

    if (reminderTimeMs > Date.now()) {
      schedulePrayerNotification(prayerName, reminderTimeMs, 'reminder', reminderOffset)
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
