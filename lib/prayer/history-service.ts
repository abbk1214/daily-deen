import db, { type PrayerLog, type PrayerStatus } from '../db'

const PRAYER_NAMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const

function now(): number {
  return Date.now()
}

function ensureLogBase(date: string, prayer: string): PrayerLog {
  return {
    date,
    prayer,
    scheduledTime: '',
    completedAt: null,
    status: 'pending',
    completed: false,
    late: false,
    missed: false,
    jamaah: false,
    qaza: false,
    notes: '',
    createdAt: now(),
    updatedAt: now(),
  }
}

export async function markCompleted(
  date: string,
  prayer: string,
  scheduledTime: string,
  options?: { jamaah?: boolean; late?: boolean; notes?: string },
): Promise<PrayerLog> {
  const existing = await db.prayerLogs.where('[date+prayer]').equals([date, prayer]).first()

  const base = existing ?? ensureLogBase(date, prayer)
  const updated: PrayerLog = {
    ...base,
    scheduledTime: scheduledTime || base.scheduledTime,
    completedAt: new Date().toISOString(),
    status: 'completed',
    completed: true,
    late: options?.late ?? false,
    missed: false,
    jamaah: options?.jamaah ?? false,
    qaza: false,
    notes: options?.notes ?? base.notes,
    updatedAt: now(),
  }

  if (existing?.id) {
    await db.prayerLogs.update(existing.id, updated)
    return { ...updated, id: existing.id }
  }

  const id = await db.prayerLogs.add(updated)
  return { ...updated, id }
}

export async function markMissed(date: string, prayer: string): Promise<PrayerLog> {
  const existing = await db.prayerLogs.where('[date+prayer]').equals([date, prayer]).first()
  const base = existing ?? ensureLogBase(date, prayer)

  const updated: PrayerLog = {
    ...base,
    status: 'missed',
    completed: false,
    late: false,
    missed: true,
    jamaah: false,
    qaza: false,
    updatedAt: now(),
  }

  if (existing?.id) {
    await db.prayerLogs.update(existing.id, updated)
    return { ...updated, id: existing.id }
  }

  const id = await db.prayerLogs.add(updated)
  return { ...updated, id }
}

export async function markQaza(date: string, prayer: string, scheduledTime: string): Promise<PrayerLog> {
  const existing = await db.prayerLogs.where('[date+prayer]').equals([date, prayer]).first()
  const base = existing ?? ensureLogBase(date, prayer)

  const updated: PrayerLog = {
    ...base,
    scheduledTime: scheduledTime || base.scheduledTime,
    completedAt: new Date().toISOString(),
    status: 'qaza',
    completed: true,
    late: true,
    missed: false,
    jamaah: false,
    qaza: true,
    updatedAt: now(),
  }

  if (existing?.id) {
    await db.prayerLogs.update(existing.id, updated)
    return { ...updated, id: existing.id }
  }

  const id = await db.prayerLogs.add(updated)
  return { ...updated, id }
}

export async function markJamaah(date: string, prayer: string, scheduledTime: string): Promise<PrayerLog> {
  const existing = await db.prayerLogs.where('[date+prayer]').equals([date, prayer]).first()
  const base = existing ?? ensureLogBase(date, prayer)

  const updated: PrayerLog = {
    ...base,
    scheduledTime: scheduledTime || base.scheduledTime,
    completedAt: new Date().toISOString(),
    status: 'jamaah',
    completed: true,
    late: false,
    missed: false,
    jamaah: true,
    qaza: false,
    updatedAt: now(),
  }

  if (existing?.id) {
    await db.prayerLogs.update(existing.id, updated)
    return { ...updated, id: existing.id }
  }

  const id = await db.prayerLogs.add(updated)
  return { ...updated, id }
}

export async function addNote(date: string, prayer: string, note: string): Promise<void> {
  const existing = await db.prayerLogs.where('[date+prayer]').equals([date, prayer]).first()
  if (existing?.id) {
    await db.prayerLogs.update(existing.id, { notes: note, updatedAt: now() })
  }
}

export async function removeNote(date: string, prayer: string): Promise<void> {
  const existing = await db.prayerLogs.where('[date+prayer]').equals([date, prayer]).first()
  if (existing?.id) {
    await db.prayerLogs.update(existing.id, { notes: '', updatedAt: now() })
  }
}

export async function getDay(date: string): Promise<PrayerLog[]> {
  return db.prayerLogs.where('date').equals(date).toArray()
}

export async function getWeek(startDate: string): Promise<PrayerLog[]> {
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  const endStr = end.toISOString().split('T')[0]

  return db.prayerLogs
    .where('date')
    .between(startDate, endStr, true, false)
    .toArray()
}

export async function getMonth(year: number, month: number): Promise<PrayerLog[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  return db.prayerLogs
    .where('date')
    .between(start, end, true, true)
    .toArray()
}

export async function getYear(year: number): Promise<PrayerLog[]> {
  const start = `${year}-01-01`
  const end = `${year}-12-31`

  return db.prayerLogs
    .where('date')
    .between(start, end, true, true)
    .toArray()
}

export async function getHistory(
  startDate: string,
  endDate: string,
  filter?: { status?: PrayerStatus; prayer?: string },
): Promise<PrayerLog[]> {
  const collection = db.prayerLogs
    .where('date')
    .between(startDate, endDate, true, true)

  let results = await collection.toArray()

  if (filter?.status) {
    results = results.filter((r) => r.status === filter.status)
  }
  if (filter?.prayer) {
    results = results.filter((r) => r.prayer === filter.prayer)
  }

  return results
}

export async function searchNotes(query: string): Promise<PrayerLog[]> {
  const lower = query.toLowerCase()
  const all = await db.prayerLogs.toArray()
  return all.filter((r) => r.notes.toLowerCase().includes(lower))
}

export async function getPrayerNames(): Promise<readonly string[]> {
  return PRAYER_NAMES
}

export { PRAYER_NAMES }
