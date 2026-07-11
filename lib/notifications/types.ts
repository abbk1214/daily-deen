import type { PrayerTimes } from '../prayer/types'

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported'

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
}

export interface ScheduledNotification {
  id: string
  prayerName: string
  type: 'reminder' | 'prayer'
  scheduledTime: number
  timeoutId: ReturnType<typeof setTimeout> | null
}

export interface NotificationScheduleConfig {
  prayerTimes: PrayerTimes
  reminderOffset: number
  date: string
  adhanSound: boolean
  vibrate: boolean
  silent: boolean
}

export interface NotificationServiceState {
  permission: PermissionStatus
  supported: boolean
  enabled: boolean
  scheduledCount: number
}
