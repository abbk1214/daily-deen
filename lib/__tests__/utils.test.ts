import { describe, it, expect } from 'vitest'
import {
  timeToMinutes,
  formatTimeFromMinutes,
  formatValue,
  getIncrementStep,
  getToday,
  daysAgo,
  daysFromNow,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  dateRange,
  toYearMonth,
  toYear,
  formatDuration,
  formatDateShort,
  formatDateLong,
  formatDateWithWeekday,
  clamp,
} from '../utils'
import type { Habit } from '../db'

describe('timeToMinutes', () => {
  it('converts midnight', () => {
    expect(timeToMinutes('00:00')).toBe(0)
  })

  it('converts noon', () => {
    expect(timeToMinutes('12:00')).toBe(720)
  })

  it('converts arbitrary time', () => {
    expect(timeToMinutes('14:30')).toBe(870)
  })

  it('converts end of day', () => {
    expect(timeToMinutes('23:59')).toBe(1439)
  })
})

describe('formatTimeFromMinutes', () => {
  it('formats midnight', () => {
    expect(formatTimeFromMinutes(0)).toBe('12:00 AM')
  })

  it('formats noon', () => {
    expect(formatTimeFromMinutes(720)).toBe('12:00 PM')
  })

  it('formats morning time', () => {
    expect(formatTimeFromMinutes(480)).toBe('8:00 AM')
  })

  it('formats afternoon time', () => {
    expect(formatTimeFromMinutes(900)).toBe('3:00 PM')
  })

  it('formats with leading zero minutes', () => {
    expect(formatTimeFromMinutes(605)).toBe('10:05 AM')
  })
})

describe('formatValue', () => {
  it('returns plain number for non-steps', () => {
    expect(formatValue(42, 'reps')).toBe('42')
  })

  it('formats steps with locale separators', () => {
    const result = formatValue(10000, 'steps')
    expect(result).toMatch(/10[,.]000/)
  })
})

describe('getIncrementStep', () => {
  it('returns increment from habit', () => {
    const habit = { increment: 5 } as Habit
    expect(getIncrementStep(habit)).toBe(5)
  })

  it('defaults to 1 when increment is 0', () => {
    const habit = { increment: 0 } as Habit
    expect(getIncrementStep(habit)).toBe(1)
  })
})

describe('getToday', () => {
  it('returns YYYY-MM-DD format', () => {
    const today = getToday()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('daysAgo', () => {
  it('returns today for 0', () => {
    expect(daysAgo(0)).toBe(getToday())
  })

  it('returns yesterday for 1', () => {
    const yesterday = daysAgo(1)
    const today = new Date()
    today.setDate(today.getDate() - 1)
    const expected = today.toLocaleDateString('en-CA')
    expect(yesterday).toBe(expected)
  })
})

describe('daysFromNow', () => {
  it('returns today for 0', () => {
    expect(daysFromNow(0)).toBe(getToday())
  })
})

describe('date range helpers', () => {
  it('startOfWeek returns Sunday', () => {
    const result = startOfWeek('2024-01-10') // Wednesday
    expect(new Date(result + 'T00:00:00').getDay()).toBe(0)
  })

  it('endOfWeek returns Saturday', () => {
    const result = endOfWeek('2024-01-10') // Wednesday
    expect(new Date(result + 'T00:00:00').getDay()).toBe(6)
  })

  it('startOfMonth returns first day', () => {
    expect(startOfMonth('2024-03-15')).toBe('2024-03-01')
  })

  it('endOfMonth returns last day', () => {
    expect(endOfMonth('2024-02-10')).toBe('2024-02-29') // leap year
  })

  it('endOfMonth for non-leap year', () => {
    expect(endOfMonth('2023-02-10')).toBe('2023-02-28')
  })

  it('startOfYear', () => {
    expect(startOfYear('2024-06-15')).toBe('2024-01-01')
  })

  it('endOfYear', () => {
    expect(endOfYear('2024-06-15')).toBe('2024-12-31')
  })
})

describe('dateRange', () => {
  it('returns single day for same start/end', () => {
    const result = dateRange('2024-01-01', '2024-01-01')
    expect(result).toEqual(['2024-01-01'])
  })

  it('returns correct range', () => {
    const result = dateRange('2024-01-01', '2024-01-03')
    expect(result).toEqual(['2024-01-01', '2024-01-02', '2024-01-03'])
  })
})

describe('toYearMonth / toYear', () => {
  it('extracts year-month', () => {
    expect(toYearMonth('2024-03-15')).toBe('2024-03')
  })

  it('extracts year', () => {
    expect(toYear('2024-03-15')).toBe('2024')
  })
})

describe('formatDuration', () => {
  it('formats hours only', () => {
    expect(formatDuration(120)).toBe('2h')
  })

  it('formats minutes only', () => {
    expect(formatDuration(45)).toBe('45m')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m')
  })
})

describe('formatDateShort', () => {
  it('formats date', () => {
    expect(formatDateShort('2024-01-15')).toBe('Jan 15')
  })
})

describe('formatDateLong', () => {
  it('formats date with year', () => {
    expect(formatDateLong('2024-01-15')).toBe('January 15, 2024')
  })
})

describe('formatDateWithWeekday', () => {
  it('formats date with weekday', () => {
    const result = formatDateWithWeekday('2024-01-15')
    expect(result).toContain('Monday')
    expect(result).toContain('January')
    expect(result).toContain('15')
  })
})

describe('clamp', () => {
  it('clamps below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('clamps above max', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('keeps value in range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
})
