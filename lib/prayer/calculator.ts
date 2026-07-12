import {
  julianDate,
  julianCentury,
  sunDeclination,
  equationOfTime,
  fixHour,
  dmsToDeg,
  DEG_TO_RAD,
  RAD_TO_DEG,
} from './helpers'
import type {
  PrayerTimes,
  PrayerCalculationInput,
} from './types'

const SUNRISE_ANGLE = -0.833

export function calculatePrayerTimes(input: PrayerCalculationInput): PrayerTimes {
  const { date, latitude, longitude, timezone, method, asrFactor } = input

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const jd = julianDate(year, month, day)
  const tc = julianCentury(jd)

  const decl = sunDeclination(tc + 0.5)
  const eqt = equationOfTime(tc + 0.5)

  const transit = fixHour(12 + timezone - longitude / 15 - eqt / 60)

  const sunAngle = (angle: number) => {
    const cosHA =
      (Math.sin(-angle * DEG_TO_RAD) -
        Math.sin(latitude * DEG_TO_RAD) *
          Math.sin(decl * DEG_TO_RAD)) /
      (Math.cos(latitude * DEG_TO_RAD) *
        Math.cos(decl * DEG_TO_RAD))
    const ha = Math.acos(Math.max(-1, Math.min(1, cosHA))) * RAD_TO_DEG / 15
    return ha
  }

  const sunriseHA = sunAngle(SUNRISE_ANGLE)
  const fajrHA = sunAngle(method.fajrAngle)
  const ishaHA = sunAngle(method.ishaAngle ?? 17)

  const sunrise = fixHour(transit - sunriseHA)
  const sunset = fixHour(transit + sunriseHA)

  let fajr: number
  if (method.fajrAngle) {
    fajr = fixHour(transit - fajrHA)
  } else {
    fajr = sunrise - dmsToDeg(1, 20, 0) / 15
  }

  let isha: number
  if (method.ishaMinutes) {
    isha = fixHour(sunset + method.ishaMinutes / 60)
  } else {
    isha = fixHour(transit + ishaHA)
  }

  const dhuhr = fixHour(transit + 0.5 / 60)

  let maghrib: number
  if (method.maghribMinutes) {
    maghrib = fixHour(sunset + method.maghribMinutes / 60)
  } else {
    maghrib = fixHour(sunset + dmsToDeg(0, 0, 50) / 15)
  }

  const asrDecl = decl
  const asrAngleRad = Math.atan(1 / (asrFactor + Math.abs(Math.tan((latitude - asrDecl) * DEG_TO_RAD))))
  const asrHA2 =
    (Math.sin(-asrAngleRad) -
      Math.sin(latitude * DEG_TO_RAD) *
        Math.sin(asrDecl * DEG_TO_RAD)) /
    (Math.cos(latitude * DEG_TO_RAD) *
      Math.cos(asrDecl * DEG_TO_RAD))
  const asrHA = Math.acos(Math.max(-1, Math.min(1, asrHA2))) * RAD_TO_DEG / 15
  const asr = fixHour(transit + asrHA)

  return {
    fajr: Math.round(fajr * 60),
    sunrise: Math.round(sunrise * 60),
    dhuhr: Math.round(dhuhr * 60),
    asr: Math.round(asr * 60),
    maghrib: Math.round(maghrib * 60),
    isha: Math.round(isha * 60),
  }
}
