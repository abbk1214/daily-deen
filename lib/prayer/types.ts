export type AsrFactor = 1 | 2

export interface PrayerTimes {
  fajr: number
  sunrise: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}

export interface CalculationMethodParams {
  name: string
  fajrAngle: number
  ishaAngle?: number
  ishaMinutes?: number
  maghribMinutes?: number
}

export interface PrayerCalculationInput {
  date: Date
  latitude: number
  longitude: number
  timezone: number
  method: CalculationMethodParams
  asrFactor: AsrFactor
}

export type PrayerName = keyof PrayerTimes
