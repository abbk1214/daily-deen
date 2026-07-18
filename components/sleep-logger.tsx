"use client";

import { useState, useEffect, useCallback } from "react";
import { Moon, Plus, X, Star } from "lucide-react";
import db from "@/lib/db";
import type { SleepEntry } from "@/lib/db";
import { getToday } from "@/lib/utils";

const SLEEP_TAGS = [
  "Caffeine", "Exercise", "Stress", "Screen time", "Late meal",
  "Meditation", "Reading", "Cool room", "Noisy", "Comfortable",
];

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function SleepLogger() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [showCheckin, setShowCheckin] = useState(false);
  const [bedtime, setBedtime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [quality, setQuality] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [avgSleep, setAvgSleep] = useState(0);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const all = await db.sleepEntries.toArray();
      const sorted = all.sort((a, b) => b.createdAt - a.createdAt);
      setEntries(sorted.slice(0, 7)); // Last 7 entries

      // Calculate average
      if (all.length > 0) {
        const avg = all.reduce((sum, e) => sum + e.duration, 0) / all.length;
        setAvgSleep(Math.round(avg));
      }
    } catch {
      // silent
    }
  }

  const addEntry = useCallback(async () => {
    const bedMinutes = timeToMinutes(bedtime);
    const wakeMinutes = timeToMinutes(wakeTime);
    let duration = wakeMinutes - bedMinutes;
    if (duration < 0) duration += 24 * 60; // Crosses midnight

    const entry: SleepEntry = {
      date: getToday(),
      bedtime,
      wakeTime,
      duration,
      quality,
      notes,
      tags: selectedTags,
      createdAt: Date.now(),
    };

    try {
      await db.sleepEntries.add(entry);
      setShowCheckin(false);
      setQuality(3);
      setSelectedTags([]);
      setNotes("");
      loadEntries();
    } catch {
      // silent
    }
  }, [bedtime, wakeTime, quality, selectedTags, notes]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const todayEntry = entries.find((e) => e.date === getToday());

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Sleep
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            {todayEntry
              ? `Last night: ${formatDuration(todayEntry.duration)} · ${"⭐".repeat(todayEntry.quality)}`
              : avgSleep > 0
                ? `Avg: ${formatDuration(avgSleep)}`
                : "No sleep logged"}
          </p>
        </div>
          <button
          onClick={() => setShowCheckin(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Recent entries */}
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              <Moon size={14} className="text-accent" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                    {formatDuration(entry.duration)}
                  </span>
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>
                    {"⭐".repeat(entry.quality)}
                  </span>
                </div>
                <span className="text-muted-foreground" style={{ fontSize: "10px" }}>
                  {entry.bedtime} → {entry.wakeTime}
                </span>
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
            Tap + to log your sleep
          </p>
        </div>
      )}

      {/* Check-in modal */}
      {showCheckin && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card rounded-t-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 600 }}>
                Log Sleep
              </h3>
              <button
                onClick={() => setShowCheckin(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Bedtime & Wake time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground mb-1 block" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                  Bedtime
                </label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ fontSize: "var(--text-body-sm)" }}
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                  Wake Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ fontSize: "var(--text-body-sm)" }}
                />
              </div>
            </div>

            {/* Duration preview */}
            <div className="text-center py-2 rounded-lg bg-muted/50">
              <span className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                Duration: {formatDuration(
                  (() => {
                    const bed = timeToMinutes(bedtime);
                    const wake = timeToMinutes(wakeTime);
                    let d = wake - bed;
                    if (d < 0) d += 24 * 60;
                    return d;
                  })(),
                )}
              </span>
            </div>

            {/* Quality */}
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                Sleep Quality
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setQuality(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={star <= quality ? "text-yellow-400 fill-yellow-400" : "text-muted"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                What affected your sleep?
              </p>
              <div className="flex flex-wrap gap-2">
                {SLEEP_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="rounded-full px-3 py-1 text-foreground transition-colors"
                    style={{
                      background: selectedTags.includes(tag)
                        ? "var(--dusk-teal)"
                        : "var(--muted)",
                      color: selectedTags.includes(tag) ? "white" : "var(--foreground)",
                      fontSize: "var(--text-caption)",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                Notes (optional)
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you sleep?"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                style={{ fontSize: "var(--text-body-sm)" }}
                rows={2}
              />
            </div>

            {/* Submit */}
            <button
              onClick={addEntry}
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-medium transition-colors hover:bg-accent/90"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Save Sleep Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
