import type { Habit } from "@/lib/db";

/** Returns today's date as an ISO string (YYYY-MM-DD). */
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/** Converts a "HH:MM" time string to total minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Converts total minutes since midnight to a 12-hour "h:mm AM/PM" string. */
export function formatTimeFromMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/** Formats a numeric value with locale-aware thousands separators for step-based units. */
export function formatValue(value: number, unit: string): string {
  if (unit === "steps") {
    return value.toLocaleString();
  }
  return String(value);
}

/** Returns the increment step size for a habit, defaulting to 1. */
export function getIncrementStep(habit: Habit): number {
  return habit.increment || 1;
}
