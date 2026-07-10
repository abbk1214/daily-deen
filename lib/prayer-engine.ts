import {
  CalculationMethod,
  Coordinates as AdhanCoordinates,
  Madhab,
  Prayer,
  PrayerTimes as AdhanPrayerTimes,
  HighLatitudeRule,
  PolarCircleResolution,
  Rounding,
  Qibla,
  type CalculationParameters,
} from 'adhan'
import type { PrayerTimes, PrayerName } from './prayer/types'
import type { PrayerAdjustments } from './db'

/* ─── Types ─── */

export interface PrayerEngineInput {
  date: Date
  latitude: number
  longitude: number
  timezone: string
  method: string
  school: string
  adjustments?: PrayerAdjustments
}

export interface NextPrayerInfo {
  name: PrayerName
  minutesUntil: number
  time: Date
}

export interface CurrentPrayerInfo {
  name: PrayerName
  time: Date
}

export interface PrayerProgress {
  name: PrayerName
  scheduled: Date
  elapsed: number
  total: number
  percent: number
  passed: boolean
}

/* ─── Method mapping ─── */

const METHOD_MAP: Record<string, () => CalculationParameters> = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  NorthAmerica: CalculationMethod.NorthAmerica,
  Egyptian: CalculationMethod.Egyptian,
  UmmAlQura: CalculationMethod.UmmAlQura,
  Karachi: CalculationMethod.Karachi,
  Tehran: CalculationMethod.Tehran,
  Dubai: CalculationMethod.Dubai,
  Kuwait: CalculationMethod.Kuwait,
  Qatar: CalculationMethod.Qatar,
  Singapore: CalculationMethod.Singapore,
  Turkey: CalculationMethod.Turkey,
  Other: CalculationMethod.Other,
}

const PRAYER_KEYS: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

/* ─── Helpers ─── */

function dateToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

function getMethod(key: string): () => CalculationParameters {
  return METHOD_MAP[key] ?? CalculationMethod.MuslimWorldLeague
}

function getMadhab(school: string): typeof Madhab[keyof typeof Madhab] {
  return school === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi
}

function buildParams(input: PrayerEngineInput): CalculationParameters {
  const params = getMethod(input.method)()
  params.madhab = getMadhab(input.school)
  params.highLatitudeRule = HighLatitudeRule.recommended(
    new AdhanCoordinates(input.latitude, input.longitude),
  )
  params.polarCircleResolution = PolarCircleResolution.AqrabBalad
  params.rounding = Rounding.Nearest

  if (input.adjustments) {
    params.adjustments = { ...input.adjustments }
  }

  return params
}

function computeAdhanTimes(input: PrayerEngineInput): AdhanPrayerTimes {
  const coords = new AdhanCoordinates(input.latitude, input.longitude)
  const params = buildParams(input)
  return new AdhanPrayerTimes(coords, input.date, params)
}

/* ─── Core Engine Functions ─── */

/** Calculate prayer times as minutes-since-midnight. */
export function calculatePrayerTimes(input: PrayerEngineInput): PrayerTimes {
  const times = computeAdhanTimes(input)
  return {
    fajr: dateToMinutes(times.fajr),
    sunrise: dateToMinutes(times.sunrise),
    dhuhr: dateToMinutes(times.dhuhr),
    asr: dateToMinutes(times.asr),
    maghrib: dateToMinutes(times.maghrib),
    isha: dateToMinutes(times.isha),
  }
}

/** Get the next prayer after the given date. */
export function getNextPrayer(
  input: PrayerEngineInput,
  after?: Date,
): NextPrayerInfo | null {
  const times = computeAdhanTimes(input)
  const now = after ?? new Date()
  const nextName = times.nextPrayer(now)

  if (nextName === Prayer.None) return null

  const name = nextName as PrayerName
  const time = times.timeForPrayer(nextName as typeof Prayer[keyof typeof Prayer])
  if (!time) return null

  const diffMs = time.getTime() - now.getTime()
  const minutesUntil = Math.max(0, Math.round(diffMs / 60_000))

  return { name, minutesUntil, time }
}

/** Get the currently active prayer. */
export function getCurrentPrayer(
  input: PrayerEngineInput,
  at?: Date,
): CurrentPrayerInfo | null {
  const times = computeAdhanTimes(input)
  const currentName = times.currentPrayer(at)

  if (currentName === Prayer.None) return null

  const name = currentName as PrayerName
  const time = times.timeForPrayer(currentName as typeof Prayer[keyof typeof Prayer])
  if (!time) return null

  return { name, time }
}

/** Get progress for each prayer for today. */
export function getPrayerProgress(
  input: PrayerEngineInput,
  now?: Date,
): PrayerProgress[] {
  const times = computeAdhanTimes(input)
  const currentTime = now ?? new Date()

  return PRAYER_KEYS.map((key) => {
    const prayerDate = times.timeForPrayer(key as typeof Prayer[keyof typeof Prayer])
    const scheduled = prayerDate ?? new Date()

    // Find the next prayer to compute window end
    const nextPrayerName = times.nextPrayer(currentTime)
    let nextTime: Date
    if (nextPrayerName === Prayer.None) {
      // After Isha: window ends at midnight
      nextTime = new Date(currentTime)
      nextTime.setHours(24, 0, 0, 0)
    } else {
      nextTime = times.timeForPrayer(nextPrayerName as typeof Prayer[keyof typeof Prayer]) ?? new Date()
    }

    const isCurrentPrayer = times.currentPrayer(currentTime) === key
    const hasPassed = currentTime.getTime() > scheduled.getTime() + 15 * 60_000 // 15-min window

    let elapsed = 0
    let total = 0

    if (isCurrentPrayer) {
      elapsed = Math.max(0, (currentTime.getTime() - scheduled.getTime()) / 60_000)
      total = Math.max(1, (nextTime.getTime() - scheduled.getTime()) / 60_000)
    } else if (hasPassed) {
      elapsed = total = 1
    }

    const percent = isCurrentPrayer
      ? Math.min(100, Math.round((elapsed / total) * 100))
      : hasPassed
        ? 100
        : 0

    return {
      name: key,
      scheduled,
      elapsed: Math.round(elapsed),
      total: Math.round(total),
      percent,
      passed: hasPassed,
    }
  })
}

/** Format a minutes-since-midnight value to 12-hour time string. */
export function formatPrayerTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

/** Check if a prayer time has passed. */
export function isPrayerPassed(prayerMinutes: number, nowMinutes: number): boolean {
  return nowMinutes >= prayerMinutes
}

/** Calculate remaining time until a prayer in minutes. */
export function calculateRemainingTime(
  prayerMinutes: number,
  nowMinutes: number,
): number {
  if (prayerMinutes > nowMinutes) {
    return prayerMinutes - nowMinutes
  }
  // Next day
  return 24 * 60 - nowMinutes + prayerMinutes
}

/** Get Qibla direction in degrees from north. */
export function getQiblaDirection(latitude: number, longitude: number): number {
  const coords = new AdhanCoordinates(latitude, longitude)
  return Qibla(coords)
}

/** Check if coordinates are valid. */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude)
  )
}
