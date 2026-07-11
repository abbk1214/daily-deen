import { getHijriDate } from "./hijri-date"

export interface IslamicHoliday {
  name: string
  month: number
  day: number
  type: "fixed" | "variable"
  description: string
}

export const ISLAMIC_HOLIDAYS: readonly IslamicHoliday[] = [
  {
    name: "Islamic New Year",
    month: 1,
    day: 1,
    type: "fixed",
    description: "Start of the new Hijri year",
  },
  {
    name: "Ashura",
    month: 1,
    day: 10,
    type: "fixed",
    description: "Day of remembrance",
  },
  {
    name: "Mawlid al-Nabi",
    month: 3,
    day: 12,
    type: "fixed",
    description: "Birth of Prophet Muhammad (PBUH)",
  },
  {
    name: "Isra and Mi'raj",
    month: 7,
    day: 27,
    type: "fixed",
    description: "Night Journey and Ascension",
  },
  {
    name: "Shab-e-Barat",
    month: 8,
    day: 15,
    type: "fixed",
    description: "Night of Forgiveness",
  },
  {
    name: "Ramadan Begins",
    month: 9,
    day: 1,
    type: "fixed",
    description: "Start of the holy month of Ramadan",
  },
  {
    name: "Laylat al-Qadr",
    month: 9,
    day: 27,
    type: "fixed",
    description: "Night of Power",
  },
  {
    name: "Eid al-Fitr",
    month: 10,
    day: 1,
    type: "fixed",
    description: "Festival of Breaking the Fast",
  },
  {
    name: "Day of Arafah",
    month: 12,
    day: 9,
    type: "fixed",
    description: "Pilgrimage day at Mount Arafat",
  },
  {
    name: "Eid al-Adha",
    month: 12,
    day: 10,
    type: "fixed",
    description: "Festival of the Sacrifice",
  },
] as const

export interface HolidayResult {
  name: string
  description: string
  type: "fixed" | "variable"
}

export function getHolidayForDate(isoDate: string): HolidayResult | null {
  const date = new Date(isoDate + "T00:00:00")
  const hijri = getHijriDate(date)

  for (const holiday of ISLAMIC_HOLIDAYS) {
    if (hijri.month === holiday.month && hijri.day === holiday.day) {
      return {
        name: holiday.name,
        description: holiday.description,
        type: holiday.type,
      }
    }
  }

  return null
}

export function isRamadan(isoDate: string): boolean {
  const date = new Date(isoDate + "T00:00:00")
  const hijri = getHijriDate(date)
  return hijri.month === 9
}

export function getRamadanDates(year: number): {
  start: string
  end: string
} {
  const hijriYear = year
  const start = hijriToIsoDateForHoliday(hijriYear, 9, 1)
  const end = hijriToIsoDateForHoliday(hijriYear, 9, 29)
  return { start, end }
}

function hijriToIsoDateForHoliday(
  year: number,
  month: number,
  day: number,
): string {
  const hijriYear = year
  const approxGregorianYear = Math.floor(
    ((hijriYear - 1) * 354.36667 + 1948440 - 385) / 365.2425,
  )

  let bestDate = new Date(approxGregorianYear, month - 2, day)
  let bestDiff = Infinity

  for (let offset = -3; offset <= 3; offset++) {
    const candidate = new Date(
      approxGregorianYear + offset,
      month - 2,
      day,
    )
    candidate.setHours(12, 0, 0, 0)
    const h = getHijriDate(candidate)
    const diff = Math.abs(
      (h.year - hijriYear) * 360 + (h.month - month) * 30 + (h.day - day),
    )
    if (diff < bestDiff) {
      bestDiff = diff
      bestDate = candidate
    }
  }

  return bestDate.toISOString().slice(0, 10)
}

export function getCurrentHoliday(): HolidayResult | null {
  const today = new Date().toISOString().slice(0, 10)
  return getHolidayForDate(today)
}

export function getNextHoliday(): {
  holiday: IslamicHoliday
  daysUntil: number
} | null {
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  let nearest: { holiday: IslamicHoliday; daysUntil: number } | null = null

  for (const holiday of ISLAMIC_HOLIDAYS) {
    const testDate = new Date(today)
    testDate.setFullYear(testDate.getFullYear() + 1)
    const testHijri = getHijriDate(testDate)

    if (holiday.month === testHijri.month && holiday.day === testHijri.day) {
      const diffDays = Math.ceil(
        (testDate.getTime() - today.getTime()) / 86400000,
      )
      if (diffDays > 0 && (!nearest || diffDays < nearest.daysUntil)) {
        nearest = { holiday, daysUntil: diffDays }
      }
    }
  }

  return nearest
}

export function getHolidayBadge(
  isoDate: string,
): { name: string; color: string } | null {
  const holiday = getHolidayForDate(isoDate)
  if (!holiday) return null

  const colorMap: Record<string, string> = {
    "Eid al-Fitr": "var(--dd-lantern-gold)",
    "Eid al-Adha": "var(--dd-lantern-gold)",
    "Ramadan Begins": "var(--dd-dusk-teal)",
    "Laylat al-Qadr": "var(--dd-dusk-teal)",
    "Ashura": "oklch(0.55 0.15 25)",
    "Mawlid al-Nabi": "oklch(0.65 0.15 145)",
    "Isra and Mi'raj": "oklch(0.65 0.15 280)",
    "Shab-e-Barat": "oklch(0.65 0.15 280)",
    "Islamic New Year": "var(--dd-rose-dawn)",
    "Day of Arafah": "var(--dd-dusk-teal)",
  }

  return {
    name: holiday.name,
    color: colorMap[holiday.name] ?? "var(--dd-lantern-gold)",
  }
}
