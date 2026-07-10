import type { PermissionState } from './types'

export function checkGeolocationPermission(): PermissionState {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return 'unavailable'
  }
  if (!navigator.permissions) {
    return 'prompt'
  }
  return 'prompt'
}

export async function requestGeolocationPermission(): Promise<PermissionState> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return 'unavailable'
  }
  if (!navigator.permissions) {
    return 'prompt'
  }
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state
  } catch {
    return 'prompt'
  }
}
