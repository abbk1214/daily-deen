"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, X } from "lucide-react";
import db from "@/lib/db";
import type { MoodEntry } from "@/lib/db";
import { getToday } from "@/lib/utils";

const MOODS = [
  { emoji: "😄", label: "Great", value: 5, color: "#22c55e" },
  { emoji: "😊", label: "Good", value: 4, color: "#84cc16" },
  { emoji: "😐", label: "Okay", value: 3, color: "#eab308" },
  { emoji: "😔", label: "Low", value: 2, color: "#f97316" },
  { emoji: "😢", label: "Bad", value: 1, color: "#ef4444" },
];

const ENERGY_LEVELS = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 2 },
  { label: "High", value: 3 },
];

const CONTEXT_TAGS = [
  "Work", "Exercise", "Social", "Family", "Nature", "Rest",
  "Learning", "Creative", "Spiritual", "Travel", "Food", "Health",
];

function getTimeNow(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[number] | null>(null);
  const [energy, setEnergy] = useState(2);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [todayAverage, setTodayAverage] = useState(0);

  const today = useMemo(() => getToday(), []);

  useEffect(() => {
    async function loadEntries() {
      try {
        const all = await db.moodEntries.where("date").equals(today).toArray();
        setEntries(all.sort((a, b) => b.createdAt - a.createdAt));
        if (all.length > 0) {
          const moodValues: Record<string, number> = { Great: 5, Good: 4, Okay: 3, Low: 2, Bad: 1 };
          const avg = all.reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / all.length;
          setTodayAverage(Math.round(avg * 10) / 10);
        }
      } catch {
        // silent
      }
    }
    loadEntries();
  }, [today]);

  const addEntry = useCallback(async () => {
    if (!selectedMood) return;

    const entry: MoodEntry = {
      date: today,
      time: getTimeNow(),
      mood: selectedMood.label,
      emoji: selectedMood.emoji,
      energy,
      tags: selectedTags,
      note,
      createdAt: Date.now(),
    };

    try {
      await db.moodEntries.add(entry);
      setSelectedMood(null);
      setEnergy(2);
      setSelectedTags([]);
      setNote("");
      setShowCheckin(false);
      // Reload entries
      const all = await db.moodEntries.where("date").equals(today).toArray();
      setEntries(all.sort((a, b) => b.createdAt - a.createdAt));
      if (all.length > 0) {
        const moodValues: Record<string, number> = { Great: 5, Good: 4, Okay: 3, Low: 2, Bad: 1 };
        const avg = all.reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / all.length;
        setTodayAverage(Math.round(avg * 10) / 10);
      }
    } catch {
      // silent
    }
  }, [selectedMood, energy, selectedTags, note, today]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Get mood distribution for today
  const moodDistribution = MOODS.map((m) => ({
    ...m,
    count: entries.filter((e) => e.mood === m.label).length,
  })).filter((m) => m.count > 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, letterSpacing: "var(--tracking-wide)" }}>
            Mood
          </p>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "var(--text-caption)" }}>
            {entries.length > 0
              ? `Today: ${todayAverage.toFixed(1)}/5 · ${entries.length} check-in${entries.length !== 1 ? "s" : ""}`
              : "No check-ins yet"}
          </p>
        </div>
        <button
          onClick={() => setShowCheckin(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--dd-dusk-teal), var(--dd-quiet-sage))",
            boxShadow: "0 4px 12px var(--dd-dusk-teal)40",
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Today's mood distribution */}
      {moodDistribution.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          {moodDistribution.map((m) => (
            <div key={m.label} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted">
              <span style={{ fontSize: "16px" }}>{m.emoji}</span>
              <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 500 }}>×{m.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent entries */}
      {entries.length > 0 ? (
        <div className="space-y-2.5">
          {entries.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted"
            >
              <span style={{ fontSize: "22px" }}>{entry.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 600 }}>
                    {entry.mood}
                  </span>
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>
                    Energy: {"⚡".repeat(entry.energy)}
                  </span>
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-1">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 bg-secondary text-muted-foreground"
                        style={{ fontSize: "10px", fontWeight: 500 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-muted-foreground" style={{ fontSize: "10px", fontWeight: 500 }}>
                {entry.time}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
            Tap + to log your mood
          </p>
        </div>
      )}

      {/* Check-in modal */}
      {showCheckin && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-foreground" style={{ fontSize: "var(--text-h4)", fontWeight: 600, letterSpacing: "var(--tracking-h3)" }}>
                How are you feeling?
              </h3>
              <button
                onClick={() => setShowCheckin(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mood selection */}
            <div className="flex justify-center gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300"
                  style={{
                    background: selectedMood?.label === m.label
                      ? `linear-gradient(135deg, ${m.color}20, ${m.color}10)`
                      : "var(--muted)",
                    border: selectedMood?.label === m.label
                      ? `2px solid ${m.color}60`
                      : "2px solid transparent",
                    transform: selectedMood?.label === m.label ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span style={{ fontSize: "36px" }}>{m.emoji}</span>
                  <span className="text-foreground" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.02em" }}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Energy level */}
            <div>
              <p className="text-muted-foreground mb-2.5" style={{ fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "var(--tracking-wide)" }}>
                Energy Level
              </p>
              <div className="flex gap-2">
                {ENERGY_LEVELS.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setEnergy(e.value)}
                    className="flex-1 py-2.5 rounded-xl text-foreground transition-all duration-200"
                    style={{
                      background: energy === e.value
                        ? "linear-gradient(135deg, var(--dd-dusk-teal)15, var(--dd-dusk-teal)08)"
                        : "var(--muted)",
                      border: energy === e.value
                        ? "1.5px solid var(--dd-dusk-teal)40"
                        : "1.5px solid transparent",
                      fontSize: "var(--text-caption)",
                      fontWeight: 600,
                    }}
                  >
                    {"⚡".repeat(e.value)} {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Context tags */}
            <div>
              <p className="text-muted-foreground mb-2.5" style={{ fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "var(--tracking-wide)" }}>
                What&apos;s affecting your mood?
              </p>
              <div className="flex flex-wrap gap-2">
                {CONTEXT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="rounded-full px-3.5 py-1.5 text-foreground transition-all duration-200"
                    style={{
                      background: selectedTags.includes(tag)
                        ? "var(--dd-dusk-teal)"
                        : "var(--muted)",
                      color: selectedTags.includes(tag) ? "white" : "var(--foreground)",
                      fontSize: "var(--text-caption)",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <p className="text-muted-foreground mb-2.5" style={{ fontSize: "var(--text-caption)", fontWeight: 600, letterSpacing: "var(--tracking-wide)" }}>
                Quick note (optional)
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                style={{ fontSize: "var(--text-body-sm)" }}
                rows={2}
              />
            </div>

            {/* Submit */}
            <button
              onClick={addEntry}
              disabled={!selectedMood}
              className="w-full py-3.5 rounded-2xl text-white font-semibold transition-all duration-300 disabled:opacity-50"
              style={{
                background: selectedMood
                  ? "linear-gradient(135deg, var(--dd-dusk-teal), var(--dd-quiet-sage))"
                  : "var(--muted)",
                fontSize: "var(--text-body-sm)",
                boxShadow: selectedMood ? "0 4px 16px var(--dd-dusk-teal)40" : "none",
              }}
            >
              Save Check-in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
