"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import db from "@/lib/db";
import type { ExerciseEntry } from "@/lib/db";
import { getToday, formatDuration } from "@/lib/utils";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const EXERCISE_CATEGORIES = [
  { name: "Running", icon: "🏃", type: "cardio" },
  { name: "Walking", icon: "🚶", type: "cardio" },
  { name: "Cycling", icon: "🚴", type: "cardio" },
  { name: "Swimming", icon: "🏊", type: "cardio" },
  { name: "Yoga", icon: "🧘", type: "flexibility" },
  { name: "Stretching", icon: "🤸", type: "flexibility" },
  { name: "Weight Training", icon: "🏋️", type: "strength" },
  { name: "Push-ups", icon: "💪", type: "strength" },
  { name: "Pull-ups", icon: "💪", type: "strength" },
  { name: "Squats", icon: "🦵", type: "strength" },
  { name: "Plank", icon: "🧎", type: "strength" },
  { name: "HIIT", icon: "⚡", type: "cardio" },
  { name: "Sports", icon: "⚽", type: "cardio" },
  { name: "Dancing", icon: "💃", type: "cardio" },
];

const PRESETS: Record<string, { duration: number; calories: number }> = {
  "Running": { duration: 30, calories: 300 },
  "Walking": { duration: 30, calories: 150 },
  "Cycling": { duration: 30, calories: 250 },
  "Swimming": { duration: 30, calories: 350 },
  "Yoga": { duration: 45, calories: 150 },
  "Weight Training": { duration: 45, calories: 250 },
  "HIIT": { duration: 20, calories: 300 },
  "Sports": { duration: 60, calories: 400 },
};

export function ExerciseLogger() {
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<typeof EXERCISE_CATEGORIES[number] | null>(null);
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(0);
  const [notes, setNotes] = useState("");
  const [todayStats, setTodayStats] = useState({ count: 0, totalMinutes: 0, totalCalories: 0 });

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const all = await db.exerciseEntries.toArray();
      const sorted = all.sort((a, b) => b.createdAt - a.createdAt);
      setEntries(sorted.slice(0, 10));

      // Today's stats
      const today = getToday();
      const todayEntries = all.filter((e) => e.date === today);
      setTodayStats({
        count: todayEntries.length,
        totalMinutes: todayEntries.reduce((s, e) => s + e.duration, 0),
        totalCalories: todayEntries.reduce((s, e) => s + (e.calories || 0), 0),
      });
    } catch {
      // silent
    }
  }

  const selectExercise = (exercise: typeof EXERCISE_CATEGORIES[number]) => {
    setSelectedExercise(exercise);
    const preset = PRESETS[exercise.name];
    if (preset) {
      setDuration(preset.duration);
      setCalories(preset.calories);
    }
  };

  const addEntry = useCallback(async () => {
    if (!selectedExercise) return;

    const entry: ExerciseEntry = {
      date: getToday(),
      type: selectedExercise.type,
      name: selectedExercise.name,
      duration,
      calories,
      notes,
      createdAt: Date.now(),
    };

    try {
      await db.exerciseEntries.add(entry);
      setShowCheckin(false);
      setSelectedExercise(null);
      setDuration(30);
      setCalories(0);
      setNotes("");
      loadEntries();
    } catch {
      // silent
    }
  }, [selectedExercise, duration, calories, notes]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Exercise
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            {todayStats.count > 0
              ? `Today: ${todayStats.count} workout${todayStats.count !== 1 ? "s" : ""} · ${formatDuration(todayStats.totalMinutes)} · ${todayStats.totalCalories} cal`
              : "No workouts today"}
          </p>
        </div>
        <button
          onClick={() => setShowCheckin(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-lantern-gold/10 text-lantern-gold hover:bg-lantern-gold/20 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Today's exercises */}
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              <span style={{ fontSize: "18px" }}>
                {EXERCISE_CATEGORIES.find((e) => e.name === entry.name)?.icon || "🏃"}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                    {entry.name}
                  </span>
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>
                    {formatDuration(entry.duration)}
                  </span>
                </div>
                {entry.calories && (
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>
                    🔥 {entry.calories} cal
                  </span>
                )}
              </div>
              <span className="text-muted-foreground" style={{ fontSize: "10px" }}>
                {entry.date}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            Tap + to log a workout
          </p>
        </div>
      )}

      {/* Check-in modal */}
      <BottomSheet open={showCheckin} onClose={() => setShowCheckin(false)} title="Log Exercise">
            {/* Exercise grid */}
            <div className="grid grid-cols-4 gap-2">
              {EXERCISE_CATEGORIES.map((exercise) => (
                <button
                  key={exercise.name}
                  onClick={() => selectExercise(exercise)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                  style={{
                    background: selectedExercise?.name === exercise.name
                      ? "color-mix(in srgb, var(--dusk-teal) 15%, var(--card))"
                      : "var(--muted)",
                    border: selectedExercise?.name === exercise.name
                      ? "1px solid var(--dusk-teal)"
                      : "1px solid transparent",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{exercise.icon}</span>
                  <span className="text-foreground text-center" style={{ fontSize: "9px", fontWeight: 500 }}>
                    {exercise.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Duration & Calories */}
            {selectedExercise && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground mb-1 block" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontSize: "var(--text-body-sm)" }}
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                    Calories (est.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontSize: "var(--text-body-sm)" }}
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                Notes (optional)
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How was your workout?"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                style={{ fontSize: "var(--text-body-sm)" }}
                rows={2}
              />
            </div>

            {/* Submit */}
            <button
              onClick={addEntry}
              disabled={!selectedExercise}
              className="w-full py-3 rounded-xl bg-dusk-teal text-white font-medium transition-colors hover:bg-dusk-teal/90 disabled:opacity-50"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Save Workout
            </button>
      </BottomSheet>
    </div>
  );
}
