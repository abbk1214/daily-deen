import type { LocationCache } from './types'

const CACHE_KEY = 'daily-deen:location-cache'
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

export function getCachedLocation(): LocationCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: LocationCache = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return cached
  } catch {
    return null
  }
}

export function setCachedLocation(data: Omit<LocationCache, 'timestamp'>): void {
  try {
    const entry: LocationCache = { ...data, timestamp: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {}
}

export function clearCachedLocation(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {}
}
