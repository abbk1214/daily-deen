import db, { type Habit, type HabitLog } from "@/lib/db"

export async function getHabits(): Promise<Habit[]> {
  return db.habits.toArray()
}

export async function addHabit(habit: {
  name: string
  type: "exercise" | "walk" | "hydration" | "custom"
  target: number
  unit: string
  increment: number
}): Promise<Habit> {
  const id = await db.habits.add(habit as Habit)
  return { ...habit, id }
}

export async function getHabitLogsForDate(
  date: string,
): Promise<HabitLog[]> {
  return db.habitLogs.where("date").equals(date).toArray()
}

export async function incrementHabitLog(
  habitId: number,
  date: string,
  step: number,
): Promise<HabitLog> {
  const existing = await db.habitLogs
    .where("[habitId+date]")
    .equals([habitId, date])
    .first()

  const newValue = (existing?.value ?? 0) + step

  if (existing?.id != null) {
    await db.habitLogs.update(existing.id, {
      value: newValue,
      timestamp: Date.now(),
    })
    return { ...existing, value: newValue, timestamp: Date.now() }
  }

  const id = await db.habitLogs.add({
    habitId,
    date,
    value: newValue,
    timestamp: Date.now(),
  })

  return { id, habitId, date, value: newValue, timestamp: Date.now() }
}

export async function decrementHabitLog(
  habitId: number,
  date: string,
  step: number,
): Promise<HabitLog | null> {
  const existing = await db.habitLogs
    .where("[habitId+date]")
    .equals([habitId, date])
    .first()

  if (!existing) return null

  const newValue = Math.max(0, existing.value - step)

  if (existing.id != null) {
    if (newValue <= 0) {
      await db.habitLogs.delete(existing.id)
      return null
    }
    await db.habitLogs.update(existing.id, {
      value: newValue,
      timestamp: Date.now(),
    })
    return { ...existing, value: newValue, timestamp: Date.now() }
  }

  return null
}
