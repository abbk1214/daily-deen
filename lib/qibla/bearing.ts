import type { Coordinates } from '../location/types'
import type { QiblaResult } from './types'
import { KAABA, EARTH_RADIUS_KM, DEG_TO_RAD } from './constants'

function toRadians(degrees: number): number {
  return degrees * DEG_TO_RAD
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

export function calculateInitialBearing(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude)
  const lat2 = toRadians(to.latitude)
  const dLon = toRadians(to.longitude - from.longitude)

  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)

  const bearing = toDegrees(Math.atan2(y, x))
  return (bearing + 360) % 360
}

export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude)
  const lat2 = toRadians(to.latitude)
  const dLat = toRadians(to.latitude - from.latitude)
  const dLon = toRadians(to.longitude - from.longitude)

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

export function calculateQiblaDirection(userLocation: Coordinates): QiblaResult {
  const bearing = calculateInitialBearing(userLocation, KAABA)
  const distance = calculateDistance(userLocation, KAABA)

  return {
    bearing,
    distance,
    direction: getCardinalDirection(bearing),
    degreesFromNorth: bearing,
  }
}

function getCardinalDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}
