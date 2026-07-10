import { DEG_TO_RAD, RAD_TO_DEG } from './constants'

export function toRadians(degrees: number): number {
  return degrees * DEG_TO_RAD
}

export function toDegrees(radians: number): number {
  return radians * RAD_TO_DEG
}

export function normalizeAngle(angle: number): number {
  const normalized = angle % 360
  return normalized < 0 ? normalized + 360 : normalized
}

export function formatBearing(bearing: number): string {
  const rounded = Math.round(normalizeAngle(bearing))
  return `${rounded}°`
}

export function getDirectionLabel(bearing: number): string {
  const normalized = normalizeAngle(bearing)
  if (normalized >= 337.5 || normalized < 22.5) return 'North'
  if (normalized >= 22.5 && normalized < 67.5) return 'North-East'
  if (normalized >= 67.5 && normalized < 112.5) return 'East'
  if (normalized >= 112.5 && normalized < 157.5) return 'South-East'
  if (normalized >= 157.5 && normalized < 202.5) return 'South'
  if (normalized >= 202.5 && normalized < 247.5) return 'South-West'
  if (normalized >= 247.5 && normalized < 292.5) return 'West'
  return 'North-West'
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 100) return `${km.toFixed(1)} km`
  return `${Math.round(km).toLocaleString()} km`
}

export function smoothHeading(current: number, previous: number, factor: number): number {
  let diff = current - previous
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return normalizeAngle(previous + diff * factor)
}
