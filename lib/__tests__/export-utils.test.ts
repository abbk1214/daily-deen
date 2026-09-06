import { describe, it, expect } from 'vitest'
import { generateFullCSV } from '../export-utils'
import type { DatabaseExport } from '../db'

function makeExport(overrides: Partial<DatabaseExport> = {}): DatabaseExport {
  return {
    version: 1,
    exportedAt: '2024-01-15T10:00:00Z',
    prayers: [],
    prayerLogs: [],
    habits: [],
    habitLogs: [],
    journal: [],
    quranBookmarks: [],
    khatmahProgress: [],
    settings: {
      name: 'Test',
      city: 'London',
      country: 'UK',
      latitude: 51.5,
      longitude: -0.1,
      timezone: 'Europe/London',
      locationUpdatedAt: 0,
      accuracy: 0,
      calculationMethod: 'MWL',
      asrCalculationMethod: 'MWL',
      higherLatitudeMethod: 'None',
      temperatureUnit: 'celsius',
      theme: 'light',
      textSize: 'medium',
      paperTexture: true,
      onboardingComplete: true,
      notificationsEnabled: true,
      prayerNotifications: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
        jummah: false,
        advanceMinutes: 10,
      },
      quranReciter: 'mishary',
      lastLanguage: 'en',
      dailyAmounts: { quranPages: 1, athkarTarget: 10 },
      prayerAdjustments: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    } as any,
    ...overrides,
  }
}

describe('generateFullCSV', () => {
  it('generates CSV with metadata', () => {
    const csv = generateFullCSV(makeExport())
    expect(csv).toContain('=== Metadata ===')
    expect(csv).toContain('exportedAt,2024-01-15T10:00:00Z')
    expect(csv).toContain('version,1')
  })

  it('includes all sections', () => {
    const csv = generateFullCSV(makeExport())
    expect(csv).toContain('=== Prayer Logs ===')
    expect(csv).toContain('=== Prayers (Legacy) ===')
    expect(csv).toContain('=== Habits ===')
    expect(csv).toContain('=== Habit Logs ===')
    expect(csv).toContain('=== Journal ===')
    expect(csv).toContain('=== Settings ===')
  })

  it('handles empty data', () => {
    const csv = generateFullCSV(makeExport())
    // Should not throw
    expect(typeof csv).toBe('string')
    expect(csv.length).toBeGreaterThan(0)
  })

  it('escapes CSV values with commas', () => {
    const exportData = makeExport({
      habits: [{ id: 1, name: 'Read, daily', type: 'custom', target: 1, unit: 'pages', increment: 1 }],
    })
    const csv = generateFullCSV(exportData)
    expect(csv).toContain('"Read, daily"')
  })

  it('includes prayer data', () => {
    const exportData = makeExport({
      prayers: [{
        date: '2024-01-15',
        fajr: '05:30',
        dhuhr: '12:00',
        asr: '15:00',
        maghrib: '17:00',
        isha: '19:00',
        completed: { fajr: true, dhuhr: true, asr: false, maghrib: true, isha: false },
      }],
    })
    const csv = generateFullCSV(exportData)
    expect(csv).toContain('2024-01-15')
    expect(csv).toContain('05:30')
  })
})
