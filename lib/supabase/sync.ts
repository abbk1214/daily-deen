import { createClient } from "@/lib/supabase/client"
import db from "@/lib/db"

const supabase = createClient()

/** Sync all local IndexedDB data to Supabase */
export async function syncAllToCloud(): Promise<{ synced: number; errors: string[] }> {
  let user
  try {
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u
  } catch {
    return { synced: 0, errors: ["Cloud unavailable"] }
  }
  if (!user) return { synced: 0, errors: ["Not authenticated"] }

  const errors: string[] = []
  let synced = 0

  // Sync prayer logs
  try {
    const prayers = await db.prayerLogs.toArray()
    if (prayers.length > 0) {
      const rows = prayers.map((p) => ({
        user_id: user.id,
        date: p.date,
        prayer: p.prayer,
        status: p.status,
        completed: p.completed,
        completed_at: p.completedAt,
        scheduled_time: p.scheduledTime,
        late: p.late,
        missed: p.missed,
        jamaah: p.jamaah,
        qaza: p.qaza,
        notes: p.notes,
      }))
      const { error } = await supabase
        .from("prayer_logs")
        .upsert(rows, { onConflict: "user_id,date,prayer" })
      if (error) errors.push(`prayer_logs: ${error.message}`)
      else synced += rows.length
    }
  } catch (e: any) {
    errors.push(`prayer_logs: ${e.message}`)
  }

  // Sync habits
  try {
    const habits = await db.habits.toArray()
    if (habits.length > 0) {
      const rows = habits.map((h) => ({
        user_id: user.id,
        remote_id: h.id,
        name: h.name,
        type: h.type,
        target: h.target,
        unit: h.unit,
        increment: h.increment,
      }))
      const { error } = await supabase
        .from("habits")
        .upsert(rows, { onConflict: "user_id,name" })
      if (error) errors.push(`habits: ${error.message}`)
      else synced += rows.length
    }
  } catch (e: any) {
    errors.push(`habits: ${e.message}`)
  }

  // Sync habit logs
  try {
    const logs = await db.habitLogs.toArray()
    if (logs.length > 0) {
      const rows = logs.map((l) => ({
        user_id: user.id,
        habit_id: l.habitId,
        date: l.date,
        value: l.value,
        timestamp: l.timestamp,
      }))
      const { error } = await supabase
        .from("habit_logs")
        .upsert(rows, { onConflict: "user_id,habit_id,date" })
      if (error) errors.push(`habit_logs: ${error.message}`)
      else synced += rows.length
    }
  } catch (e: any) {
    errors.push(`habit_logs: ${e.message}`)
  }

  // Sync journal
  try {
    const entries = await db.journal.toArray()
    if (entries.length > 0) {
      const rows = entries.map((j) => ({
        user_id: user.id,
        date: j.date,
        content: j.text,
        mood: j.mood,
      }))
      const { error } = await supabase
        .from("journal")
        .upsert(rows, { onConflict: "user_id,date" })
      if (error) errors.push(`journal: ${error.message}`)
      else synced += rows.length
    }
  } catch (e: any) {
    errors.push(`journal: ${e.message}`)
  }

  // Sync dhikr progress
  try {
    const dhikr = await db.tasbeehCounts.toArray()
    if (dhikr.length > 0) {
      const rows = dhikr.map((d) => ({
        user_id: user.id,
        dhikr_id: d.dhikrId,
        target: d.target,
        current: d.current,
        date: d.date,
      }))
      const { error } = await supabase
        .from("dhikr_progress")
        .upsert(rows, { onConflict: "user_id,dhikr_id,date" })
      if (error) errors.push(`dhikr_progress: ${error.message}`)
      else synced += rows.length
    }
  } catch (e: any) {
    errors.push(`dhikr_progress: ${e.message}`)
  }

  // Sync settings
  try {
    const settings = await db.settings.toCollection().first()
    if (settings) {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          settings: settings as any,
        }, { onConflict: "user_id" })
      if (error) errors.push(`user_settings: ${error.message}`)
      else synced += 1
    }
  } catch (e: any) {
    errors.push(`user_settings: ${e.message}`)
  }

  return { synced, errors }
}

/** Pull cloud data into local IndexedDB */
export async function syncFromCloud(): Promise<{ pulled: number; errors: string[] }> {
  let user
  try {
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u
  } catch {
    return { pulled: 0, errors: ["Cloud unavailable"] }
  }
  if (!user) return { pulled: 0, errors: ["Not authenticated"] }

  const errors: string[] = []
  let pulled = 0

  // Pull prayer logs
  try {
    const { data, error } = await supabase
      .from("prayer_logs")
      .select("*")
      .eq("user_id", user.id)
    if (error) errors.push(`prayer_logs: ${error.message}`)
    else if (data) {
      for (const row of data) {
        await db.prayerLogs.put({
          date: row.date,
          prayer: row.prayer,
          status: row.status,
          completed: row.completed,
          completedAt: row.completed_at,
          scheduledTime: row.scheduled_time,
          late: row.late,
          missed: row.missed,
          jamaah: row.jamaah,
          qaza: row.qaza,
          notes: row.notes,
          createdAt: new Date(row.created_at).getTime(),
          updatedAt: new Date(row.updated_at).getTime(),
        })
      }
      pulled += data.length
    }
  } catch (e: any) {
    errors.push(`prayer_logs: ${e.message}`)
  }

  return { pulled, errors }
}
