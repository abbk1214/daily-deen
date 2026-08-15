import { getDb } from './schema'
import type { KhatmahGoal, KhatmahProgress, ReadingSessionLog } from './types'
import { getToday } from '@/lib/utils'

/* ──────────────────────────────────────────────
   Khatmah Goals CRUD
   ────────────────────────────────────────────── */

export async function addKhatmahGoal(
  type: KhatmahGoal['type'],
  target: number,
  startDate: string,
): Promise<KhatmahGoal> {
  const db = getDb()
  const goal: KhatmahGoal = {
    type,
    target,
    startDate,
    isActive: true,
    createdAt: Date.now(),
  }
  const id = await db.khatmahGoals.add(goal)
  return { ...goal, id }
}

export async function getActiveKhatmahGoal(): Promise<KhatmahGoal | null> {
  const db = getDb()
  const result = await db.khatmahGoals.where('isActive').equals(1).first()
  return result ?? null
}

export async function getAllKhatmahGoals(): Promise<KhatmahGoal[]> {
  const db = getDb()
  return db.khatmahGoals.orderBy('createdAt').reverse().toArray()
}

export async function deactivateKhatmahGoal(id: number): Promise<void> {
  const db = getDb()
  await db.khatmahGoals.update(id, { isActive: false })
}

/* ──────────────────────────────────────────────
   Khatmah Progress CRUD
   ────────────────────────────────────────────── */

export async function logKhatmahProgress(entry: {
  pagesRead: number
  juzRead: number
  ayahsRead: number
  duration: number
  lastPage: number
  lastJuz: number
}): Promise<KhatmahProgress> {
  const db = getDb()
  const today = getToday()
  let result!: KhatmahProgress
  await db.transaction('rw', db.khatmahProgress, async () => {
    const existing = await db.khatmahProgress.where('date').equals(today).first()
    if (existing?.id) {
      await db.khatmahProgress.update(existing.id, {
        pagesRead: existing.pagesRead + entry.pagesRead,
        juzRead: existing.juzRead + entry.juzRead,
        ayahsRead: existing.ayahsRead + entry.ayahsRead,
        duration: existing.duration + entry.duration,
        lastPage: entry.lastPage,
        lastJuz: entry.lastJuz,
      })
      result = { ...existing, ...entry }
    } else {
      const progress: KhatmahProgress = { date: today, ...entry }
      const id = await db.khatmahProgress.add(progress)
      result = { ...progress, id }
    }
  })
  return result
}

export async function getKhatmahProgress(): Promise<KhatmahProgress[]> {
  const db = getDb()
  return db.khatmahProgress.orderBy('date').reverse().toArray()
}

export async function getKhatmahProgressRange(
  startDate: string,
  endDate: string,
): Promise<KhatmahProgress[]> {
  const db = getDb()
  return db.khatmahProgress
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray()
}

/* ──────────────────────────────────────────────
   Reading Sessions CRUD
   ────────────────────────────────────────────── */

export async function logReadingSession(session: {
  startTime: number
  endTime: number
  duration: number
  pagesRead: number
  ayahsRead: number
  startPage: number
  endPage: number
}): Promise<ReadingSessionLog> {
  const db = getDb()
  const today = getToday()
  const log: ReadingSessionLog = { date: today, ...session }
  const id = await db.readingSessionLogs.add(log)
  return { ...log, id }
}

export async function getReadingSessions(): Promise<ReadingSessionLog[]> {
  const db = getDb()
  return db.readingSessionLogs.orderBy('date').reverse().toArray()
}
