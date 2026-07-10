import type { Coordinates } from '../location/types'

export const KAABA: Coordinates = {
  latitude: 21.4225,
  longitude: 39.8262,
}

export const EARTH_RADIUS_KM = 6371

export const DEG_TO_RAD = Math.PI / 180
export const RAD_TO_DEG = 180 / Math.PI

export const COMPASS_UPDATE_INTERVAL = 100
export const COMPASS_SMOOTHING_FACTOR = 0.3
export const CALIBRATION_THRESHOLD = 15
export const CALIBRATION_STABILITY_FRAMES = 10

export const CARDINAL_DIRECTIONS = [
  { angle: 0, label: 'N' },
  { angle: 45, label: 'NE' },
  { angle: 90, label: 'E' },
  { angle: 135, label: 'SE' },
  { angle: 180, label: 'S' },
  { angle: 225, label: 'SW' },
  { angle: 270, label: 'W' },
  { angle: 315, label: 'NW' },
] as const
