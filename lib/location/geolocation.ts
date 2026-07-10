import type { GeoResult, PermissionState } from './types'

export function getCurrentPosition(options?: {
  highAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  signal?: AbortSignal
}): Promise<GeoResult> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    if (options?.signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    let aborted = false

    const onAbort = () => {
      aborted = true
      reject(new DOMException('Aborted', 'AbortError'))
    }

    options?.signal?.addEventListener('abort', onAbort, { once: true })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        options?.signal?.removeEventListener('abort', onAbort)
        if (aborted) return
        resolve({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          permission: 'granted' as PermissionState,
        })
      },
      (error) => {
        options?.signal?.removeEventListener('abort', onAbort)
        if (aborted) return
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please enable it in your browser settings.'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location unavailable. Please check your device settings.'))
            break
          case error.TIMEOUT:
            reject(new Error('Location request timed out. Please try again.'))
            break
          default:
            reject(new Error('Unable to determine location.'))
        }
      },
      {
        enableHighAccuracy: options?.highAccuracy ?? true,
        timeout: options?.timeout ?? 15000,
        maximumAge: options?.maximumAge ?? 300000,
      },
    )
  })
}
