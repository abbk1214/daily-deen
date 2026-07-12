import type { Habit } from "@/lib/db";

/** Formats a Date as local YYYY-MM-DD. */
function fmtLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns today's date as a local ISO string (YYYY-MM-DD). */
export function getToday(): string {
  return fmtLocal(new Date());
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

/* ─── Date helpers ─── */

/** Returns the date string for N days ago. */
export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return fmtLocal(d);
}

/** Returns the date string for N days from now. */
export function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return fmtLocal(d);
}

/** Returns the start of the week (Sunday) for a given date string. */
export function startOfWeek(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return fmtLocal(d);
}

/** Returns the end of the week (Saturday) for a given date string. */
export function endOfWeek(dateStr: string): string {
  const start = startOfWeek(dateStr);
  const d = new Date(start + "T00:00:00");
  d.setDate(d.getDate() + 6);
  return fmtLocal(d);
}

/** Returns the first day of the month for a given date string. */
export function startOfMonth(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

/** Returns the last day of the month for a given date string. */
export function endOfMonth(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

/** Returns the first day of the year for a given date string. */
export function startOfYear(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}-01-01`;
}

/** Returns the last day of the year for a given date string. */
export function endOfYear(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}-12-31`;
}

/** Returns an array of date strings between start and end (inclusive). */
export function dateRange(start: string, end: string): string[] {
  const dates: string[] = []
  const d = new Date(start + "T00:00:00")
  const endD = new Date(end + "T00:00:00")
  while (d <= endD) {
    dates.push(fmtLocal(d))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

/** Returns YYYY-MM format for a date string. */
export function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7)
}

/** Returns YYYY format for a date string. */
export function toYear(dateStr: string): string {
  return dateStr.slice(0, 4)
}
