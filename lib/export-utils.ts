import { type PrayerLog, type Prayer, type Habit, type HabitLog, type JournalEntry, type AppSettings, type DatabaseExport } from './db'

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function prayerLogsToCSV(logs: PrayerLog[]): string {
  const headers = ['date', 'prayer', 'scheduledTime', 'completedAt', 'status', 'completed', 'late', 'missed', 'jamaah', 'qaza', 'notes', 'createdAt', 'updatedAt']
  const rows = logs.map((l) =>
    headers.map((h) => escapeCSV(String(l[h as keyof PrayerLog] ?? ''))).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

function prayersToCSV(prayers: Prayer[]): string {
  const headers = ['date', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'completed_fajr', 'completed_dhuhr', 'completed_asr', 'completed_maghrib', 'completed_isha']
  const rows = prayers.map((p) =>
    [
      escapeCSV(p.date),
      escapeCSV(p.fajr),
      escapeCSV(p.dhuhr),
      escapeCSV(p.asr),
      escapeCSV(p.maghrib),
      escapeCSV(p.isha),
      p.completed.fajr,
      p.completed.dhuhr,
      p.completed.asr,
      p.completed.maghrib,
      p.completed.isha,
    ].join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

function habitsToCSV(habits: Habit[]): string {
  const headers = ['name', 'type', 'target', 'unit', 'increment']
  const rows = habits.map((h) =>
    [escapeCSV(h.name), escapeCSV(h.type), h.target, escapeCSV(h.unit), h.increment].join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

function habitLogsToCSV(logs: HabitLog[]): string {
  const headers = ['habitId', 'date', 'value', 'timestamp']
  const rows = logs.map((l) =>
    [l.habitId, escapeCSV(l.date), l.value, l.timestamp].join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

function journalToCSV(entries: JournalEntry[]): string {
  const headers = ['date', 'mood', 'text', 'tags']
  const rows = entries.map((e) =>
    [escapeCSV(e.date), escapeCSV(e.mood), escapeCSV(e.text), escapeCSV(e.tags.join(';'))].join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

function settingsToCSV(settings: AppSettings): string {
  const headers = ['key', 'value']
  const entries = Object.entries(settings).filter(([k]) => k !== 'id' && k !== 'prayerAdjustments')
  const rows = entries.map(([k, v]) => [escapeCSV(k), escapeCSV(String(v))].join(','))
  return [headers.join(','), ...rows].join('\n')
}

export function generateFullCSV(data: DatabaseExport): string {
  const sections: string[] = []

  sections.push('=== Prayer Logs ===')
  sections.push(prayerLogsToCSV(data.prayerLogs ?? []))
  sections.push('')

  sections.push('=== Prayers (Legacy) ===')
  sections.push(prayersToCSV(data.prayers))
  sections.push('')

  sections.push('=== Habits ===')
  sections.push(habitsToCSV(data.habits))
  sections.push('')

  sections.push('=== Habit Logs ===')
  sections.push(habitLogsToCSV(data.habitLogs))
  sections.push('')

  sections.push('=== Journal ===')
  sections.push(journalToCSV(data.journal))
  sections.push('')

  sections.push('=== Settings ===')
  sections.push(settingsToCSV(data.settings))
  sections.push('')

  sections.push('=== Metadata ===')
  sections.push('exportedAt,' + escapeCSV(data.exportedAt))
  sections.push('version,' + data.version)

  return sections.join('\n')
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: DatabaseExport, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
