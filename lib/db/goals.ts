import { getDb } from './schema'
import type { Goal, GoalCheckIn } from './types'

/* ──────────────────────────────────────────────
   Goals CRUD
   ────────────────────────────────────────────── */

export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
  const db = getDb()
  const newGoal: Goal = { ...goal, createdAt: Date.now() }
  const id = await db.goals.add(newGoal)
  return { ...newGoal, id }
}

export async function getGoals(type?: Goal['type']): Promise<Goal[]> {
  const db = getDb()
  if (type) return db.goals.where('type').equals(type).reverse().sortBy('createdAt')
  return db.goals.orderBy('createdAt').reverse().toArray()
}

export async function updateGoal(id: number, patch: Partial<Omit<Goal, 'id' | 'createdAt'>>): Promise<void> {
  const db = getDb()
  await db.goals.update(id, patch)
}

export async function deleteGoal(id: number): Promise<void> {
  const db = getDb()
  await db.transaction('rw', [db.goals, db.goalCheckIns], async () => {
    await db.goals.delete(id)
    await db.goalCheckIns.where('goalId').equals(id).delete()
  })
}

export async function addGoalCheckIn(checkIn: Omit<GoalCheckIn, 'id' | 'createdAt'>): Promise<GoalCheckIn> {
  const db = getDb()
  const newCheckIn: GoalCheckIn = { ...checkIn, createdAt: Date.now() }
  const id = await db.goalCheckIns.add(newCheckIn)
  return { ...newCheckIn, id }
}

export async function getGoalCheckIns(goalId: number): Promise<GoalCheckIn[]> {
  const db = getDb()
  return db.goalCheckIns.where('goalId').equals(goalId).reverse().sortBy('date')
}
