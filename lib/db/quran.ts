import { getDb } from './schema'
import type { QuranBookmark, QuranProgress } from './types'

/* ──────────────────────────────────────────────
   Quran Bookmarks CRUD
   ────────────────────────────────────────────── */

export async function addQuranBookmark(
  surahNumber: number,
  ayahNumber: number,
  surahName: string,
  ayahText: string,
  note?: string,
): Promise<QuranBookmark> {
  const db = getDb()
  const existing = await db.quranBookmarks
    .where('[surahNumber+ayahNumber]')
    .equals([surahNumber, ayahNumber])
    .first()
  if (existing) return existing
  const bookmark: QuranBookmark = {
    surahNumber,
    ayahNumber,
    surahName,
    ayahText,
    note,
    createdAt: Date.now(),
  }
  const id = await db.quranBookmarks.add(bookmark)
  return { ...bookmark, id }
}

export async function removeQuranBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
  const db = getDb()
  const existing = await db.quranBookmarks
    .where('[surahNumber+ayahNumber]')
    .equals([surahNumber, ayahNumber])
    .first()
  if (existing?.id) await db.quranBookmarks.delete(existing.id)
}

export async function isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
  const db = getDb()
  const existing = await db.quranBookmarks
    .where('[surahNumber+ayahNumber]')
    .equals([surahNumber, ayahNumber])
    .first()
  return !!existing
}

export async function getBookmarks(): Promise<QuranBookmark[]> {
  const db = getDb()
  return db.quranBookmarks.orderBy('createdAt').reverse().toArray()
}

/* ──────────────────────────────────────────────
   Reading Progress CRUD
   ────────────────────────────────────────────── */

export async function updateReadingProgress(surahNumber: number, ayahNumber: number): Promise<void> {
  const db = getDb()
  const existing = await db.quranProgress
    .where('surahNumber')
    .equals(surahNumber)
    .first()
  if (existing?.id) {
    await db.quranProgress.update(existing.id, {
      ayahNumber,
      lastReadAt: Date.now(),
    })
  } else {
    await db.quranProgress.add({
      surahNumber,
      ayahNumber,
      lastReadAt: Date.now(),
    })
  }
}

export async function getReadingProgress(): Promise<QuranProgress[]> {
  const db = getDb()
  return db.quranProgress.toArray()
}

export async function getLastReadSurah(): Promise<{ surahNumber: number; ayahNumber: number } | null> {
  const db = getDb()
  const all = await db.quranProgress.toArray()
  if (all.length === 0) return null
  all.sort((a, b) => b.lastReadAt - a.lastReadAt)
  const latest = all[0]
  return { surahNumber: latest.surahNumber, ayahNumber: latest.ayahNumber }
}
