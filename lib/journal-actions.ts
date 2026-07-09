import db, { type JournalEntry } from "@/lib/db"
import { getToday } from "@/lib/utils"

export async function saveJournalEntry(entry: {
  mood: string
  text: string
  tags: string[]
}): Promise<JournalEntry> {
  const today = getToday()
  const existing = await db.journal.where("date").equals(today).first()

  if (existing?.id != null) {
    await db.journal.update(existing.id, {
      mood: entry.mood,
      text: entry.text,
      tags: entry.tags,
    })
    return { ...existing, mood: entry.mood, text: entry.text, tags: entry.tags }
  }

  const id = await db.journal.add({
    date: today,
    mood: entry.mood,
    text: entry.text,
    tags: entry.tags,
  })

  return { id, date: today, mood: entry.mood, text: entry.text, tags: entry.tags }
}

export async function getJournalEntry(
  date: string,
): Promise<JournalEntry | undefined> {
  return db.journal.where("date").equals(date).first()
}

export async function getRecentEntries(
  limit = 20,
): Promise<JournalEntry[]> {
  return db.journal.orderBy("date").reverse().limit(limit).toArray()
}
