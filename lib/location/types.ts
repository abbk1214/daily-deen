export interface Coordinates {
  latitude: number
  longitude: number
}

export interface GeocodedLocation {
  city: string
  country: string
  timezone: string
  coordinates: Coordinates
}

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unavailable'

export interface GeoResult {
  coordinates: Coordinates
  accuracy: number
  permission: PermissionState
}

export interface LocationCache {
  latitude: number
  longitude: number
  city: string
  country: string
  timezone: string
  accuracy: number
  timestamp: number
}
