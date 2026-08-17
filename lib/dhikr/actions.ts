import db, { type TasbeehCount } from '../db'
import { getToday } from '../utils'

/** Get all dhikr progress for today */
export async function getTodaysDhikrProgress(): Promise<TasbeehCount[]> {
  const date = getToday()
  return db.tasbeehCounts.where('date').equals(date).toArray()
}

/** Get progress for a specific dhikr today */
export async function getDhikrCount(dhikrId: string): Promise<number> {
  const date = getToday()
  const existing = await db.tasbeehCounts
    .where('[dhikrId+date]')
    .equals([dhikrId, date])
    .first()
  return existing?.current ?? 0
}

/** Increment a dhikr count. Returns the new count. */
export async function incrementDhikr(
  dhikrId: string,
  target: number,
): Promise<number> {
  const date = getToday()
  const existing = await db.tasbeehCounts
    .where('[dhikrId+date]')
    .equals([dhikrId, date])
    .first()

  const current = existing?.current ?? 0
  const next = current + 1

  if (existing?.id) {
    await db.tasbeehCounts.update(existing.id, {
      current: next,
      target,
    })
  } else {
    await db.tasbeehCounts.add({
      dhikrId,
      date,
      current: next,
      target,
    })
  }

  return next
}

/** Reset a dhikr count to 0 */
export async function resetDhikr(dhikrId: string): Promise<void> {
  const date = getToday()
  const existing = await db.tasbeehCounts
    .where('[dhikrId+date]')
    .equals([dhikrId, date])
    .first()

  if (existing?.id) {
    await db.tasbeehCounts.update(existing.id, { current: 0 })
  }
}

/** Set tasbeeh global counter (non-date-specific, persists across days) */
export async function getTasbeehGlobal(): Promise<{ count: number; target: number; dhikr: string }> {
  const record = await db.tasbeehCounts.where('dhikrId').equals('__tasbeeh_global').first()
  return {
    count: record?.current ?? 0,
    target: record?.target ?? 33,
    dhikr: 'SubhanAllah',
  }
}

/** Save tasbeeh global counter */
export async function saveTasbeehGlobal(count: number, target: number): Promise<void> {
  const existing = await db.tasbeehCounts
    .where('dhikrId')
    .equals('__tasbeeh_global')
    .first()

  if (existing?.id) {
    await db.tasbeehCounts.update(existing.id, { current: count, target, date: getToday() })
  } else {
    await db.tasbeehCounts.add({
      dhikrId: '__tasbeeh_global',
      date: getToday(),
      current: count,
      target,
    })
  }
}
