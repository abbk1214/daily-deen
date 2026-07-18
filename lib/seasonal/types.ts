export type SeasonalMode = 'none' | 'ramadan' | 'hajj' | 'eid' | 'last-ten-nights'

export interface SeasonalConfig {
  mode: SeasonalMode
  isActive: boolean
  hijriMonth: number
  hijriDay: number
  hijriYear: number
  daysRemaining: number
  features: SeasonalFeatures
}

export interface SeasonalFeatures {
  suhoorCountdown: boolean
  iftarCountdown: boolean
  taraweehTracker: boolean
  khatmahPlanner: boolean
  dailyDuas: boolean
  charityTracker: boolean
  zakatReminder: boolean
  laylatulQadrTracker: boolean
  hajjChecklist: boolean
  tawafCounter: boolean
  themeOverride?: string
}

export interface TaraweehLog {
  id?: number
  date: string
  rakat: number
  completed: boolean
}

export interface CharityLog {
  id?: number
  date: string
  amount: number
  type: 'sadaqah' | 'zakat' | 'waqf'
  note: string
}
