import type { Coordinates, PermissionState } from './types'

export interface GeoResult {
  coordinates: Coordinates
  accuracy: number
  permission: PermissionState
}

export function getCurrentPosition(options?: {
  highAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}): Promise<GeoResult> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          permission: 'granted',
        })
      },
      (error) => {
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
