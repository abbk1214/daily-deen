import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  type CalculationParameters,
} from 'adhan'
import db, { getSettings, type Prayer } from './db'

const methodMap: Record<string, () => CalculationParameters> = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  Egyptian: CalculationMethod.Egyptian,
  Karachi: CalculationMethod.Karachi,
  UmmAlQura: CalculationMethod.UmmAlQura,
  Dubai: CalculationMethod.Dubai,
  MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
  NorthAmerica: CalculationMethod.NorthAmerica,
  Kuwait: CalculationMethod.Kuwait,
  Qatar: CalculationMethod.Qatar,
  Singapore: CalculationMethod.Singapore,
  Tehran: CalculationMethod.Tehran,
  Turkey: CalculationMethod.Turkey,
  Other: CalculationMethod.Other,
}

const VALID_METHODS = new Set(Object.keys(methodMap))

function getLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function validateSettings(
  latitude: number,
  longitude: number,
  calculationMethod: string,
): void {
  if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error(`Invalid latitude: ${latitude}. Must be a finite number between -90 and 90.`)
  }
  if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error(`Invalid longitude: ${longitude}. Must be a finite number between -180 and 180.`)
  }
  if (!VALID_METHODS.has(calculationMethod)) {
    throw new Error(
      `Invalid calculation method: "${calculationMethod}". Must be one of: ${[...VALID_METHODS].join(', ')}.`,
    )
  }
}

function computePrayerTimes(
  latitude: number,
  longitude: number,
  calculationMethod: string,
  date: Date,
): Omit<Prayer, 'id'> {
  const coordinates = new Coordinates(latitude, longitude)
  const methodFn = methodMap[calculationMethod] ?? CalculationMethod.MuslimWorldLeague
  const params = methodFn()
  const pt = new PrayerTimes(coordinates, date, params)

  return {
    date: getLocalDateString(date),
    fajr: formatTime(pt.fajr),
    dhuhr: formatTime(pt.dhuhr),
    asr: formatTime(pt.asr),
    maghrib: formatTime(pt.maghrib),
    isha: formatTime(pt.isha),
    completed: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    },
  }
}

export async function calculateTodaysPrayers(): Promise<Prayer | undefined> {
  const settings = await getSettings()
  if (!settings) return undefined

  const { latitude, longitude, calculationMethod } = settings
  validateSettings(latitude, longitude, calculationMethod)

  const today = new Date()
  const dateStr = getLocalDateString(today)

  const existing = await db.prayers.where('date').equals(dateStr).first()
  if (existing) return existing

  try {
    const record = computePrayerTimes(latitude, longitude, calculationMethod, today)
    const id = await db.prayers.add(record as Prayer)
    return db.prayers.get(id)
  } catch (error) {
    // Unique constraint race: another call inserted the same date — return it
    const raced = await db.prayers.where('date').equals(dateStr).first()
    if (raced) return raced

    console.error('Failed to calculate prayer times:', error)
    return undefined
  }
}

export async function recalculateTodaysPrayers(): Promise<Prayer | undefined> {
  const settings = await getSettings()
  if (!settings) return undefined

  const { latitude, longitude, calculationMethod } = settings
  validateSettings(latitude, longitude, calculationMethod)

  const today = new Date()
  const dateStr = getLocalDateString(today)

  await db.prayers.where('date').equals(dateStr).delete()

  try {
    const record = computePrayerTimes(latitude, longitude, calculationMethod, today)
    const id = await db.prayers.add(record as Prayer)
    return db.prayers.get(id)
  } catch (error) {
    console.error('Failed to recalculate prayer times:', error)
    return undefined
  }
}

export async function getTodaysPrayers(): Promise<Prayer | undefined> {
  const dateStr = getLocalDateString(new Date())
  return db.prayers.where('date').equals(dateStr).first()
}
