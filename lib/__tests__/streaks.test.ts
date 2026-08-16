import { describe, it, expect } from 'vitest'
import { computeStreaks, getDayStatus, getWeeklyProgress } from '../prayer/streaks'
import type { PrayerLog } from '../db'

function makeLog(overrides: Partial<PrayerLog> & { date: string; prayer: string }): PrayerLog {
  return {
    scheduledTime: '05:00',
    completedAt: null,
    status: 'pending',
    completed: false,
    late: false,
    missed: false,
    jamaah: false,
    qaza: false,
    notes: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

function makeCompleteDay(date: string): PrayerLog[] {
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
  return prayers.map((prayer) =>
    makeLog({ date, prayer, completed: true, status: 'completed' })
  )
}

describe('computeStreaks', () => {
  it('returns 0 streaks for empty logs', () => {
    const result = computeStreaks([])
    expect(result.current).toBe(0)
    expect(result.longest).toBe(0)
  })

  it('computes current streak for today', () => {
    const today = new Date().toLocaleDateString('en-CA')
    const logs = makeCompleteDay(today)
    const result = computeStreaks(logs)
    expect(result.current).toBeGreaterThanOrEqual(1)
  })

  it('computes multi-day streak', () => {
    const logs: PrayerLog[] = []
    for (let i = 0; i < 3; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('en-CA')
      logs.push(...makeCompleteDay(dateStr))
    }
    const result = computeStreaks(logs)
    expect(result.current).toBe(3)
    expect(result.longest).toBe(3)
  })

  it('breaks streak on incomplete day', () => {
    const logs: PrayerLog[] = []
    // Today - complete
    const today = new Date()
    logs.push(...makeCompleteDay(today.toLocaleDateString('en-CA')))
    // Yesterday - incomplete (only fajr)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    logs.push(makeLog({ date: yesterday.toLocaleDateString('en-CA'), prayer: 'fajr', completed: true, status: 'completed' }))
    // 2 days ago - complete
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    logs.push(...makeCompleteDay(twoDaysAgo.toLocaleDateString('en-CA')))

    const result = computeStreaks(logs)
    expect(result.current).toBe(1) // only today
  })
})

describe('getDayStatus', () => {
  it('returns none for no logs', () => {
    expect(getDayStatus('2024-01-01', [])).toBe('none')
  })

  it('returns complete when all prayers done', () => {
    const logs = makeCompleteDay('2024-01-01')
    expect(getDayStatus('2024-01-01', logs)).toBe('complete')
  })

  it('returns partial when some prayers done', () => {
    const logs = [makeLog({ date: '2024-01-01', prayer: 'fajr', completed: true, status: 'completed' })]
    expect(getDayStatus('2024-01-01', logs)).toBe('partial')
  })

  it('returns missed when no prayers completed', () => {
    const logs = [makeLog({ date: '2024-01-01', prayer: 'fajr', completed: false, status: 'missed' })]
    expect(getDayStatus('2024-01-01', logs)).toBe('missed')
  })
})

describe('getWeeklyProgress', () => {
  it('returns zeros for empty logs', () => {
    const result = getWeeklyProgress([])
    expect(result.completed).toBe(0)
    expect(result.percent).toBe(0)
  })

  it('counts completed prayers this week', () => {
    const today = new Date().toLocaleDateString('en-CA')
    const logs = makeCompleteDay(today)
    const result = getWeeklyProgress(logs)
    expect(result.completed).toBe(5)
    expect(result.total).toBeGreaterThanOrEqual(5)
  })
})
