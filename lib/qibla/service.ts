import type { Coordinates } from '../location/types'
import type { QiblaResult, QiblaSettings } from './types'
import { calculateQiblaDirection } from './bearing'

let cachedQibla: { key: string; result: QiblaResult } | null = null

function buildCacheKey(coords: Coordinates): string {
  return `${coords.latitude.toFixed(4)}:${coords.longitude.toFixed(4)}`
}

export function getQiblaDirection(coords: Coordinates): QiblaResult {
  const key = buildCacheKey(coords)
  if (cachedQibla && cachedQibla.key === key) {
    return cachedQibla.result
  }

  const result = calculateQiblaDirection(coords)
  cachedQibla = { key, result }
  return result
}

export function invalidateQiblaCache(): void {
  cachedQibla = null
}

export function getQiblaForSettings(
  coords: Coordinates,
  _settings: QiblaSettings,
): QiblaResult & { adjustedBearing: number } {
  const qibla = getQiblaDirection(coords)
  return {
    ...qibla,
    adjustedBearing: qibla.bearing,
  }
}
