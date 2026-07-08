import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan'
import db from './db'

const methodMap: Record<string, () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>> = {
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

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

export async function calculateTodaysPrayers(): Promise<void> {
  const settings = await db.settings.toArray()
  if (settings.length === 0) return

  const { latitude, longitude, calculationMethod } = settings[0]

  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10)

  const existing = await db.prayers.where('date').equals(dateStr).first()
  if (existing) return

  const coordinates = new Coordinates(latitude, longitude)
  const methodFn = methodMap[calculationMethod] || CalculationMethod.MuslimWorldLeague
  const params = methodFn()
  const prayerTimes = new PrayerTimes(coordinates, today, params)

  await db.prayers.add({
    date: dateStr,
    fajr: formatTime(prayerTimes.fajr),
    dhuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: formatTime(prayerTimes.isha),
    completed: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    },
  })
}
