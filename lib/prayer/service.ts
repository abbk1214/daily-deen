import type { PrayerTimes } from './types'
import { calculatePrayerTimes as engineCalculate, formatPrayerTime } from '../prayer-engine'
import type { PrayerEngineInput } from '../prayer-engine'
import type { PrayerAdjustments } from '../db'

interface CacheEntry {
  key: string
  times: PrayerTimes
  timestamp: number
}

let cache: CacheEntry | null = null
const CACHE_TTL = 1000 * 60 * 60 * 12 // 12 hours

function buildCacheKey(input: PrayerEngineInput): string {
  const d = input.date.toISOString().split('T')[0]
  return `${d}:${input.latitude.toFixed(4)}:${input.longitude.toFixed(4)}:${input.method}:${input.school}:${JSON.stringify(input.adjustments)}`
}

export function getPrayerTimes(input: {
  date: Date
  latitude: number
  longitude: number
  timezone: string
  method: string
  school: string
  adjustments?: PrayerAdjustments
}): PrayerTimes {
  const engineInput: PrayerEngineInput = {
    date: input.date,
    latitude: input.latitude,
    longitude: input.longitude,
    timezone: input.timezone,
    method: input.method,
    school: input.school,
    adjustments: input.adjustments,
  }

  const key = buildCacheKey(engineInput)

  if (cache && cache.key === key && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.times
  }

  const times = engineCalculate(engineInput)
  cache = { key, times, timestamp: Date.now() }
  return times
}

export function invalidateCache(): void {
  cache = null
}

export function getPrayerTimesFormatted(input: {
  date: Date
  latitude: number
  longitude: number
  timezone: string
  method: string
  school: string
  adjustments?: PrayerAdjustments
}): Record<keyof PrayerTimes, string> {
  const times = getPrayerTimes(input)
  return {
    fajr: formatPrayerTime(times.fajr),
    sunrise: formatPrayerTime(times.sunrise),
    dhuhr: formatPrayerTime(times.dhuhr),
    asr: formatPrayerTime(times.asr),
    maghrib: formatPrayerTime(times.maghrib),
    isha: formatPrayerTime(times.isha),
  }
}
