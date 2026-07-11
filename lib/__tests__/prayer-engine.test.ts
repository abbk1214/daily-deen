import { describe, it, expect } from 'vitest'
import {
  calculatePrayerTimes,
  getNextPrayer,
  getCurrentPrayer,
  getPrayerProgress,
  formatPrayerTime,
  isPrayerPassed,
  calculateRemainingTime,
  getQiblaDirection,
  isValidCoordinates,
  type PrayerEngineInput,
} from '../prayer-engine'

/* ─── Test fixtures ─── */

const MAKKAH_INPUT: PrayerEngineInput = {
  date: new Date('2026-07-10T00:00:00'),
  latitude: 21.4225,
  longitude: 39.8262,
  timezone: 'Asia/Riyadh',
  method: 'UmmAlQura',
  school: "Shafi'i",
}

const LONDON_INPUT: PrayerEngineInput = {
  date: new Date('2026-07-10T00:00:00'),
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 'Europe/London',
  method: 'MuslimWorldLeague',
  school: 'Hanafi',
}

const NEW_YORK_INPUT: PrayerEngineInput = {
  date: new Date('2026-07-10T00:00:00'),
  latitude: 40.7128,
  longitude: -74.006,
  timezone: 'America/New_York',
  method: 'NorthAmerica',
  school: "Shafi'i",
}

const KUALA_LUMPUR_INPUT: PrayerEngineInput = {
  date: new Date('2026-07-10T00:00:00'),
  latitude: 3.139,
  longitude: 101.6869,
  timezone: 'Asia/Kuala_Lumpur',
  method: 'Singapore',
  school: "Shafi'i",
}

const ARCTIC_INPUT: PrayerEngineInput = {
  date: new Date('2026-06-21T00:00:00'),
  latitude: 69.6496,
  longitude: 18.956,
  timezone: 'Europe/Oslo',
  method: 'MuslimWorldLeague',
  school: "Shafi'i",
}

/* ─── calculatePrayerTimes ─── */

describe('calculatePrayerTimes', () => {
  it('returns valid prayer times for Makkah', () => {
    const times = calculatePrayerTimes(MAKKAH_INPUT)
    expect(times.fajr).toBeGreaterThan(0)
    expect(times.fajr).toBeLessThan(24 * 60)
    expect(times.sunrise).toBeGreaterThan(times.fajr)
    expect(times.dhuhr).toBeGreaterThan(times.sunrise)
    expect(times.asr).toBeGreaterThan(times.dhuhr)
    expect(times.maghrib).toBeGreaterThan(times.asr)
    expect(times.isha).toBeGreaterThan(times.maghrib)
  })

  it('returns valid prayer times for London (Hanafi)', () => {
    const times = calculatePrayerTimes(LONDON_INPUT)
    expect(times.fajr).toBeGreaterThan(0)
    expect(times.dhuhr).toBeGreaterThan(12 * 60) // After noon
    expect(times.asr).toBeGreaterThan(times.dhuhr)
  })

  it('returns valid prayer times for New York', () => {
    const times = calculatePrayerTimes(NEW_YORK_INPUT)
    expect(times.fajr).toBeGreaterThan(0)
    expect(times.isha).toBeLessThan(24 * 60)
  })

  it('returns valid prayer times for Kuala Lumpur', () => {
    const times = calculatePrayerTimes(KUALA_LUMPUR_INPUT)
    expect(times.fajr).toBeGreaterThan(0)
    expect(times.sunrise).toBeGreaterThan(times.fajr)
  })

  it('handles polar regions (midnight sun)', () => {
    const times = calculatePrayerTimes(ARCTIC_INPUT)
    // All times should be valid numbers
    expect(Number.isFinite(times.fajr)).toBe(true)
    expect(Number.isFinite(times.isha)).toBe(true)
  })

  it('applies adjustments', () => {
    const base = calculatePrayerTimes(MAKKAH_INPUT)
    const adjusted = calculatePrayerTimes({
      ...MAKKAH_INPUT,
      adjustments: { fajr: 10, sunrise: 5, dhuhr: -5, asr: 10, maghrib: 5, isha: 10 },
    })
    expect(adjusted.fajr).toBe(base.fajr + 10)
    expect(adjusted.dhuhr).toBe(base.dhuhr - 5)
    expect(adjusted.asr).toBe(base.asr + 10)
  })

  it('handles Hanafi Asr differently from Shafi', () => {
    // Use equatorial location where Asr shadow difference is more pronounced
    const equatorBase: PrayerEngineInput = {
      date: new Date('2026-07-10T00:00:00'),
      latitude: 6.5244,
      longitude: 3.3792,
      timezone: 'Africa/Lagos',
      method: 'MuslimWorldLeague',
      school: "Shafi'i",
    }
    const shafi = calculatePrayerTimes(equatorBase)
    const hanafi = calculatePrayerTimes({ ...equatorBase, school: 'Hanafi' })
    // Hanafi Asr should be later (factor 2 vs 1)
    expect(hanafi.asr).toBeGreaterThanOrEqual(shafi.asr)
  })

  it('handles different calculation methods', () => {
    const mwl = calculatePrayerTimes({ ...MAKKAH_INPUT, method: 'MuslimWorldLeague' })
    const ummAlQura = calculatePrayerTimes(MAKKAH_INPUT)
    const karachi = calculatePrayerTimes({ ...MAKKAH_INPUT, method: 'Karachi' })

    // Different methods should produce different times
    expect(mwl.fajr).not.toBe(ummAlQura.fajr)
    expect(karachi.fajr).not.toBe(ummAlQura.fajr)
  })

  it('defaults to MuslimWorldLeague for unknown method', () => {
    const unknown = calculatePrayerTimes({ ...MAKKAH_INPUT, method: 'UnknownMethod' })
    const mwl = calculatePrayerTimes({ ...MAKKAH_INPUT, method: 'MuslimWorldLeague' })
    expect(unknown.fajr).toBe(mwl.fajr)
  })
})

/* ─── getNextPrayer ─── */

describe('getNextPrayer', () => {
  it('returns next prayer for a time before Fajr', () => {
    const beforeFajr = new Date(MAKKAH_INPUT.date)
    beforeFajr.setHours(3, 0, 0, 0) // 3 AM
    const result = getNextPrayer(MAKKAH_INPUT, beforeFajr)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('fajr')
    expect(result!.minutesUntil).toBeGreaterThanOrEqual(0)
  })

  it('returns next prayer for a known time', () => {
    const afterDhuhr = new Date(MAKKAH_INPUT.date)
    afterDhuhr.setHours(13, 30, 0, 0) // 1:30 PM
    const result = getNextPrayer(MAKKAH_INPUT, afterDhuhr)
    expect(result).not.toBeNull()
    expect(result!.name).toBeTruthy()
    expect(result!.minutesUntil).toBeGreaterThanOrEqual(0)
  })

  it('returns a next prayer for any given time', () => {
    const testTime = new Date(MAKKAH_INPUT.date)
    testTime.setHours(6, 0, 0, 0) // 6:00 AM - between Fajr and Sunrise
    const result = getNextPrayer(MAKKAH_INPUT, testTime)
    expect(result).not.toBeNull()
  })
})

/* ─── getCurrentPrayer ─── */

describe('getCurrentPrayer', () => {
  it('returns current prayer at a known time', () => {
    // At noon, current prayer should be Dhuhr
    const noon = new Date(MAKKAH_INPUT.date)
    noon.setHours(12, 0, 0, 0)
    const result = getCurrentPrayer(MAKKAH_INPUT, noon)
    // Could be dhuhr or asr depending on exact Makkah prayer times
    expect(result).not.toBeNull()
    expect(['sunrise', 'dhuhr', 'asr']).toContain(result!.name)
  })

  it('returns a prayer name from the valid set', () => {
    const result = getCurrentPrayer(MAKKAH_INPUT)
    if (result) {
      expect(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']).toContain(result.name)
    }
  })
})

/* ─── getPrayerProgress ─── */

describe('getPrayerProgress', () => {
  it('returns progress for all 6 prayers', () => {
    const progress = getPrayerProgress(MAKKAH_INPUT)
    expect(progress).toHaveLength(6)
    expect(progress.map((p) => p.name)).toEqual(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'])
  })

  it('each entry has valid fields', () => {
    const progress = getPrayerProgress(MAKKAH_INPUT)
    for (const p of progress) {
      expect(p.scheduled).toBeInstanceOf(Date)
      expect(p.elapsed).toBeGreaterThanOrEqual(0)
      expect(p.total).toBeGreaterThanOrEqual(0)
      expect(p.percent).toBeGreaterThanOrEqual(0)
      expect(p.percent).toBeLessThanOrEqual(100)
      expect(typeof p.passed).toBe('boolean')
    }
  })
})

/* ─── formatPrayerTime ─── */

describe('formatPrayerTime', () => {
  it('formats midnight correctly', () => {
    expect(formatPrayerTime(0)).toBe('12:00 AM')
  })

  it('formats noon correctly', () => {
    expect(formatPrayerTime(12 * 60)).toBe('12:00 PM')
  })

  it('formats 9:05 AM correctly', () => {
    expect(formatPrayerTime(9 * 60 + 5)).toBe('9:05 AM')
  })

  it('formats 11:59 PM correctly', () => {
    expect(formatPrayerTime(23 * 60 + 59)).toBe('11:59 PM')
  })

  it('formats 1:30 PM correctly', () => {
    expect(formatPrayerTime(13 * 60 + 30)).toBe('1:30 PM')
  })

  it('pads single-digit minutes', () => {
    expect(formatPrayerTime(7 * 60 + 1)).toBe('7:01 AM')
  })
})

/* ─── isPrayerPassed ─── */

describe('isPrayerPassed', () => {
  it('returns true when current time is after prayer', () => {
    expect(isPrayerPassed(360, 400)).toBe(true) // 6:00 AM prayer, 6:40 AM now
  })

  it('returns false when current time is before prayer', () => {
    expect(isPrayerPassed(400, 360)).toBe(false) // 6:40 AM prayer, 6:00 AM now
  })

  it('returns true at exact prayer time', () => {
    expect(isPrayerPassed(360, 360)).toBe(true)
  })
})

/* ─── calculateRemainingTime ─── */

describe('calculateRemainingTime', () => {
  it('calculates remaining time same day', () => {
    expect(calculateRemainingTime(400, 360)).toBe(40) // 40 min remaining
  })

  it('wraps to next day', () => {
    const remaining = calculateRemainingTime(300, 1200) // prayer at 5AM, now 8PM
    expect(remaining).toBe(24 * 60 - 1200 + 300)
  })

  it('returns full day when at prayer time (wraps to next day)', () => {
    expect(calculateRemainingTime(360, 360)).toBe(24 * 60)
  })
})

/* ─── getQiblaDirection ─── */

describe('getQiblaDirection', () => {
  it('returns a valid bearing for Makkah', () => {
    const bearing = getQiblaDirection(MAKKAH_INPUT.latitude, MAKKAH_INPUT.longitude)
    // Makkah is at the Kaaba, Qibla should be close to 0 or undefined
    expect(Number.isFinite(bearing)).toBe(true)
  })

  it('returns a valid bearing for London', () => {
    const bearing = getQiblaDirection(LONDON_INPUT.latitude, LONDON_INPUT.longitude)
    expect(Number.isFinite(bearing)).toBe(true)
    expect(bearing).toBeGreaterThan(-180)
    expect(bearing).toBeLessThan(180)
  })

  it('returns a valid bearing for New York', () => {
    const bearing = getQiblaDirection(NEW_YORK_INPUT.latitude, NEW_YORK_INPUT.longitude)
    expect(Number.isFinite(bearing)).toBe(true)
  })
})

/* ─── isValidCoordinates ─── */

describe('isValidCoordinates', () => {
  it('returns true for valid coordinates', () => {
    expect(isValidCoordinates(0, 0)).toBe(true)
    expect(isValidCoordinates(90, 180)).toBe(true)
    expect(isValidCoordinates(-90, -180)).toBe(true)
    expect(isValidCoordinates(51.5, -0.1)).toBe(true)
  })

  it('returns false for invalid coordinates', () => {
    expect(isValidCoordinates(91, 0)).toBe(false)
    expect(isValidCoordinates(-91, 0)).toBe(false)
    expect(isValidCoordinates(0, 181)).toBe(false)
    expect(isValidCoordinates(0, -181)).toBe(false)
    expect(isValidCoordinates(NaN, 0)).toBe(false)
    expect(isValidCoordinates(0, NaN)).toBe(false)
  })
})

/* ─── Edge cases ─── */

describe('edge cases', () => {
  it('handles date boundary correctly', () => {
    const lateNight = new Date('2026-07-10T23:59:00')
    const input: PrayerEngineInput = { ...MAKKAH_INPUT, date: lateNight }
    const times = calculatePrayerTimes(input)
    expect(times.fajr).toBeGreaterThan(0)
    expect(times.isha).toBeGreaterThan(0)
  })

  it('handles different dates', () => {
    const winter = new Date('2026-12-21T00:00:00')
    const summer = new Date('2026-06-21T00:00:00')

    const winterTimes = calculatePrayerTimes({ ...MAKKAH_INPUT, date: winter })
    const summerTimes = calculatePrayerTimes({ ...MAKKAH_INPUT, date: summer })

    // Prayer times should differ between seasons
    expect(winterTimes.fajr).not.toBe(summerTimes.fajr)
    expect(winterTimes.isha).not.toBe(summerTimes.isha)
  })

  it('handles equatorial locations', () => {
    const equatorInput: PrayerEngineInput = {
      date: new Date('2026-03-20T00:00:00'), // Equinox
      latitude: 0,
      longitude: 0,
      timezone: 'Africa/Abidjan',
      method: 'MuslimWorldLeague',
      school: "Shafi'i",
    }
    const times = calculatePrayerTimes(equatorInput)
    expect(Number.isFinite(times.fajr)).toBe(true)
    expect(Number.isFinite(times.isha)).toBe(true)
  })
})
