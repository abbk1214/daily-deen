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
    return result.state as PermissionState
  } catch {
    return 'prompt'
  }
}

export function onPermissionChange(callback: (state: PermissionState) => void): () => void {
  if (typeof navigator === 'undefined' || !navigator.permissions) {
    return () => {}
  }

  let mounted = true

  navigator.permissions
    .query({ name: 'geolocation' })
    .then((result) => {
      if (!mounted) return
      callback(result.state as PermissionState)
      result.addEventListener('change', () => {
        if (mounted) callback(result.state as PermissionState)
      })
    })
    .catch(() => {})

  return () => {
    mounted = false
  }
}
