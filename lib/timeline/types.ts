export interface TimelineEvent {
  id: string
  date: string
  type: TimelineEventType
  title: string
  subtitle?: string
  description?: string
  icon: string
  color: string
  metadata?: Record<string, unknown>
}

export type TimelineEventType =
  | 'prayer_streak'
  | 'prayer_milestone'
  | 'quran_milestone'
  | 'journal_entry'
  | 'habit_milestone'
  | 'habit_consistency'
  | 'water_milestone'
  | 'exercise_entry'
  | 'khatmah_completion'
  | 'ramadan_achievement'
  | 'personal_record'
  | 'first_time'
  | 'weekly_report'
  | 'monthly_report'
  | 'sleep_milestone'

export interface TimelineMonth {
  year: number
  month: number
  label: string
  events: TimelineEvent[]
}

export interface TimelineData {
  months: TimelineMonth[]
  totalEvents: number
  hasMore: boolean
}

export interface TimelineFilters {
  types: TimelineEventType[]
  searchQuery: string
  dateRange?: { start: string; end: string }
}

export interface TimelineStats {
  totalPrayerDays: number
  totalQuranPages: number
  totalJournalEntries: number
  totalHabitDays: number
  longestStreak: number
  totalKhatmah: number
}
