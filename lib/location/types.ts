export interface Coordinates {
  latitude: number
  longitude: number
}

export interface GeocodedLocation {
  city: string
  country: string
  coordinates: Coordinates
}

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unavailable'
