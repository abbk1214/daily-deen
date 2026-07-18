export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Ula",
  "Jumada al-Thani",
  "Rajab",
  "Shaban",
  "Ramadan",
  "Shawwal",
  "Dhul Qi'dah",
  "Dhul Hijjah",
] as const

const HIJRI_DAYS_IN_MONTH_COMMON = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29] as const
const HIJRI_DAYS_IN_MONTH_LEAP = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30] as const

const CACHE = new Map<string, { year: number; month: number; day: number }>()

function parseComponents(
  date: Date,
): { year: number; month: number; day: number } {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const key = `${y}-${m}-${d}`;
  const cached = CACHE.get(key)
  if (cached) return cached

  const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })

  const parts = formatter.formatToParts(date)
  const year = Number(parts.find((p) => p.type === "year")?.value ?? 0)
  const month = Number(parts.find((p) => p.type === "month")?.value ?? 0)
  const day = Number(parts.find((p) => p.type === "day")?.value ?? 0)

  const result = { year, month, day }
  CACHE.set(key, result)
  return result
}

export function getHijriDate(date: Date = new Date()): {
  year: number
  month: number
  day: number
  monthName: string
} {
  const { year, month, day } = parseComponents(date)
  return {
    year,
    month,
    day,
    monthName: HIJRI_MONTHS[month - 1] ?? "",
  }
}

export function formatHijriDate(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00")
  const h = getHijriDate(date)
  return `${h.day} ${h.monthName} ${h.year}`
}

export function formatHijriDateShort(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00")
  const h = getHijriDate(date)
  return `${h.day} ${h.monthName}`
}

export function getHijriMonthYear(isoDate: string): {
  year: number
  month: number
} {
  const date = new Date(isoDate + "T00:00:00")
  const h = getHijriDate(date)
  return { year: h.year, month: h.month }
}

export function isHijriLeapYear(year: number): boolean {
  const base = 1445
  const diff = year - base
  return (11 * diff + 14) % 30 < 11
}

export function getDaysInHijriMonth(year: number, month: number): number {
  if (isHijriLeapYear(year)) {
    return HIJRI_DAYS_IN_MONTH_LEAP[month - 1] ?? 29
  }
  return HIJRI_DAYS_IN_MONTH_COMMON[month - 1] ?? 29
}

export function hijriToGregorian(
  year: number,
  month: number,
  day: number,
): Date {
  const jd =
    Math.floor((11 * year + 3) / 30) +
    Math.floor(354 * year) +
    Math.floor((30 * month - month + 5) / 10) +
    day +
    1948440 -
    385

  const l = jd + 68569
  const n = Math.floor((4 * l) / 146097)
  const l2 = l - Math.floor((146097 * n + 3) / 4)
  const i = Math.floor((4000 * (l2 + 1)) / 1461001)
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31
  const j = Math.floor((80 * l3) / 2447)
  const dayNum = l3 - Math.floor((2447 * j) / 80)
  const l4 = Math.floor(j / 11)
  const monthNum = j + 2 - 12 * l4
  const yearNum = 100 * (n - 49) + i + l4

  const result = new Date(yearNum, monthNum - 1, dayNum)
  result.setHours(12, 0, 0, 0)
  return result
}

export function hijriToIsoDate(
  year: number,
  month: number,
  day: number,
): string {
  const date = hijriToGregorian(year, month, day)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getHijriToday(): {
  year: number
  month: number
  day: number
  monthName: string
  isoDate: string
} {
  const today = new Date()
  const h = getHijriDate(today)
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const isoDate = `${y}-${m}-${d}`;
  return { ...h, isoDate }
}
