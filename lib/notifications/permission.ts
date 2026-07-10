import type { PermissionStatus } from './types'
import type { Result } from '../result'
import { ok, err } from '../result'

export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'Notification' in window
}

export function getPermissionStatus(): PermissionStatus {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission as PermissionStatus
}

export async function requestNotificationPermission(): Promise<Result<PermissionStatus>> {
  if (!isNotificationSupported()) {
    return err('Notifications are not supported in this browser')
  }

  if (Notification.permission === 'granted') {
    return ok('granted')
  }

  if (Notification.permission === 'denied') {
    return err('Notifications are blocked. Please enable them in your browser settings.')
  }

  try {
    const result = await Notification.requestPermission()
    return ok(result as PermissionStatus)
  } catch {
    return err('Failed to request notification permission')
  }
}

export function canNotify(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted'
}
