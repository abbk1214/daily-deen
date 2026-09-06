import { getHijriDate } from '@/lib/hijri-date'
import { getDaysInHijriMonth } from '@/lib/hijri-date'
import type { SeasonalConfig, SeasonalFeatures } from './types'

function getRamadanFeatures(): SeasonalFeatures {
  return {
    suhoorCountdown: true,
    iftarCountdown: true,
    taraweehTracker: true,
    khatmahPlanner: true,
    dailyDuas: true,
    charityTracker: true,
    laylatulQadrTracker: true,
    hajjChecklist: false,
    tawafCounter: false,
    themeOverride: 'ramadan',
  }
}

function getHajjFeatures(): SeasonalFeatures {
  return {
    suhoorCountdown: false,
    iftarCountdown: false,
    taraweehTracker: false,
    khatmahPlanner: false,
    dailyDuas: true,
    charityTracker: false,
    laylatulQadrTracker: false,
    hajjChecklist: true,
    tawafCounter: true,
    themeOverride: 'hajj',
  }
}

function getEidFeatures(): SeasonalFeatures {
  return {
    suhoorCountdown: false,
    iftarCountdown: false,
    taraweehTracker: false,
    khatmahPlanner: false,
    dailyDuas: true,
    charityTracker: true,
    laylatulQadrTracker: false,
    hajjChecklist: false,
    tawafCounter: false,
  }
}

function getLaylatulQadrFeatures(): SeasonalFeatures {
  return {
    suhoorCountdown: false,
    iftarCountdown: true,
    taraweehTracker: true,
    khatmahPlanner: true,
    dailyDuas: true,
    charityTracker: true,
    laylatulQadrTracker: true,
    hajjChecklist: false,
    tawafCounter: false,
    themeOverride: 'laylatul-qadr',
  }
}

export function detectSeasonalMode(): SeasonalConfig {
  const hijri = getHijriDate()
  const { year, month, day } = hijri

  // Ramadan (month 9)
  if (month === 9) {
    const daysInMonth = getDaysInHijriMonth(year, 9)
    const daysRemaining = daysInMonth - day

    // Last 10 nights (days 21-30)
    if (day >= 21) {
      return {
        mode: 'last-ten-nights',
        isActive: true,
        hijriMonth: month,
        hijriDay: day,
        hijriYear: year,
        daysRemaining,
        features: getLaylatulQadrFeatures(),
      }
    }

    return {
      mode: 'ramadan',
      isActive: true,
      hijriMonth: month,
      hijriDay: day,
      hijriYear: year,
      daysRemaining,
      features: getRamadanFeatures(),
    }
  }

  // Eid al-Fitr (Shawwal 1-3, month 10)
  if (month === 10 && day <= 3) {
    return {
      mode: 'eid',
      isActive: true,
      hijriMonth: month,
      hijriDay: day,
      hijriYear: year,
      daysRemaining: 3 - day,
      features: getEidFeatures(),
    }
  }

  // Hajj season (Dhul Hijjah 8-12, month 12)
  if (month === 12 && day >= 8 && day <= 12) {
    return {
      mode: 'hajj',
      isActive: true,
      hijriMonth: month,
      hijriDay: day,
      hijriYear: year,
      daysRemaining: 12 - day,
      features: getHajjFeatures(),
    }
  }

  // Eid al-Adha (Dhul Hijjah 10-13, month 12)
  if (month === 12 && day >= 10 && day <= 13) {
    return {
      mode: 'eid',
      isActive: true,
      hijriMonth: month,
      hijriDay: day,
      hijriYear: year,
      daysRemaining: 13 - day,
      features: getEidFeatures(),
    }
  }

  return {
    mode: 'none',
    isActive: false,
    hijriMonth: month,
    hijriDay: day,
    hijriYear: year,
    daysRemaining: 0,
    features: {
      suhoorCountdown: false,
      iftarCountdown: false,
      taraweehTracker: false,
      khatmahPlanner: false,
      dailyDuas: false,
      charityTracker: false,
      laylatulQadrTracker: false,
      hajjChecklist: false,
      tawafCounter: false,
    },
  }
}

export function getSeasonalGreeting(config: SeasonalConfig): string | null {
  if (!config.isActive) return null

  switch (config.mode) {
    case 'ramadan':
      return `Ramadan Mubarak — Day ${config.hijriDay} of ${config.daysRemaining} remaining`
    case 'last-ten-nights':
      return `Laylatul Qadr — Night ${config.hijriDay - 20} of the last 10`
    case 'eid':
      return 'Eid Mubarak!'
    case 'hajj':
      return `Hajj Mubarak — Day ${config.hijriDay - 7} of Hajj`
    default:
      return null
  }
}

export function getRamadanCountdown(_hijriYear: number): { suhoor: Date; iftar: Date } | null {
  // Approximate times — these would be overridden by actual prayer times
  const now = new Date()
  const suhoor = new Date(now)
  suhoor.setHours(4, 30, 0, 0)
  const iftar = new Date(now)
  iftar.setHours(18, 30, 0, 0)
  return { suhoor, iftar }
}
