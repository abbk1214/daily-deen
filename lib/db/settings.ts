import { getDb } from './schema'
import type { AppSettings, QuranSettings } from './types'
import { DEFAULT_SETTINGS, DEFAULT_ADJUSTMENTS, DEFAULT_QURAN_SETTINGS } from './types'

/* ──────────────────────────────────────────────
   Settings CRUD — single row, id = 1
   ────────────────────────────────────────────── */

function mergeWithDefaults(saved: AppSettings): AppSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    id: 1,
    locationManualOverride: saved.locationManualOverride ?? false,
    calendarType: saved.calendarType ?? 'gregorian',
    silentMode: saved.silentMode ?? false,
    prayerAdjustments: {
      ...DEFAULT_ADJUSTMENTS,
      ...(saved.prayerAdjustments ?? {}),
    },
    dashboardCardOrder: saved.dashboardCardOrder ?? DEFAULT_SETTINGS.dashboardCardOrder,
    dashboardHiddenCards: saved.dashboardHiddenCards ?? DEFAULT_SETTINGS.dashboardHiddenCards,
  }
}

export async function getSettings(): Promise<AppSettings> {
  const db = getDb()
  const existing = await db.settings.get(1)
  if (existing) return mergeWithDefaults(existing)
  await db.settings.put({ ...DEFAULT_SETTINGS, id: 1 })
  return { ...DEFAULT_SETTINGS, id: 1 }
}

export async function saveSettings(
  partial: Partial<Omit<AppSettings, 'id'>>,
): Promise<AppSettings> {
  const db = getDb()
  let next!: AppSettings
  await db.transaction('rw', db.settings, async () => {
    const existing = await db.settings.get(1)
    const current = existing ? mergeWithDefaults(existing) : { ...DEFAULT_SETTINGS, id: 1 }
    next = {
      ...current,
      ...partial,
      id: 1,
      prayerAdjustments: {
        ...current.prayerAdjustments,
        ...(partial.prayerAdjustments ?? {}),
      },
    }
    await db.settings.put(next)
  })
  return next
}

export async function resetSettings(): Promise<AppSettings> {
  const db = getDb()
  const reset = { ...DEFAULT_SETTINGS, id: 1 }
  await db.settings.put(reset)
  return reset
}

/* ──────────────────────────────────────────────
   Quran Settings CRUD — single row, id = 1
   ────────────────────────────────────────────── */

export async function getQuranSettings(): Promise<QuranSettings> {
  const db = getDb()
  const existing = await db.quranSettings.get(1)
  if (existing) return { ...DEFAULT_QURAN_SETTINGS, ...existing, id: 1 }
  await db.quranSettings.put({ ...DEFAULT_QURAN_SETTINGS, id: 1 })
  return { ...DEFAULT_QURAN_SETTINGS, id: 1 }
}

export async function saveQuranSettings(
  partial: Partial<Omit<QuranSettings, 'id'>>,
): Promise<QuranSettings> {
  const db = getDb()
  let next!: QuranSettings
  await db.transaction('rw', db.quranSettings, async () => {
    const existing = await db.quranSettings.get(1)
    const current = existing ? { ...DEFAULT_QURAN_SETTINGS, ...existing, id: 1 } : { ...DEFAULT_QURAN_SETTINGS, id: 1 }
    next = { ...current, ...partial, id: 1 }
    await db.quranSettings.put(next)
  })
  return next
}
