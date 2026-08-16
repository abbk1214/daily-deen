"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, Sunrise, Sun, Sunset, Moon, CloudMoon } from "lucide-react";
import { togglePrayer, getTodaysPrayers } from "@/lib/prayer-actions";
import { markCompleted, markMissed } from "@/lib/prayer/history-service";
import { useSettings } from "@/hooks/use-settings";
import { getToday } from "@/lib/utils";
import type { Prayer } from "@/lib/db";

const PRAYERS = [
  { key: "fajr" as const, label: "Fajr", Icon: CloudMoon },
  { key: "dhuhr" as const, label: "Dhuhr", Icon: Sun },
  { key: "asr" as const, label: "Asr", Icon: Sunset },
  { key: "maghrib" as const, label: "Maghrib", Icon: Sunrise },
  { key: "isha" as const, label: "Isha", Icon: Moon },
];

interface PrayerCheckInProps {
  onToggle?: () => void;
}

export function PrayerCheckIn({ onToggle }: PrayerCheckInProps) {
  const [prayers, setPrayers] = useState<Prayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const prevAllDoneRef = useRef(false);
  const { settings } = useSettings();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getTodaysPrayers();
        if (!cancelled) setPrayers(data || null);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleToggle = useCallback(async (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    setToggling(prayer);
    try {
      const newValue = await togglePrayer(prayer);
      setPrayers((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          completed: {
            ...prev.completed,
            [prayer]: newValue,
          },
        };
      });

      // Sync to prayerLogs so StreakCard sees the update
      const date = getToday();
      const scheduledTime = prayers?.[prayer] ?? "";
      if (newValue) {
        await markCompleted(date, prayer, scheduledTime);
      } else {
        await markMissed(date, prayer);
      }

      onToggle?.();
    } catch {
      // silent
    } finally {
      setToggling(null);
    }
  }, [prayers, onToggle]);

  const completedCount = prayers
    ? Object.values(prayers.completed).filter(Boolean).length
    : 0;
  const totalPrayers = 5;
  const allDone = completedCount === totalPrayers;

  // Detect transition to all done — trigger celebration
  useEffect(() => {
    if (allDone && !prevAllDoneRef.current && !loading) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 2400);
      return () => clearTimeout(timer);
    }
    prevAllDoneRef.current = allDone;
  }, [allDone, loading]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="flex justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 w-14 rounded-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border bg-card transition-colors duration-200"
      style={{
        borderColor: celebrating ? "var(--dd-lantern-gold)" : "var(--border)",
        boxShadow: celebrating
          ? "0 0 24px color-mix(in srgb, var(--dd-lantern-gold) 12%, transparent)"
          : "var(--shadow-xs)",
        padding: "var(--space-5)",
      }}
    >
      {/* Prayer circles — refined, horizontal */}
      <div className="flex items-center justify-between">
        {PRAYERS.map((p, i) => {
          const isCompleted = prayers?.completed[p.key] ?? false;
          const isToggling = toggling === p.key;

          return (
            <div key={p.key} className="flex items-center">
              <button
                onClick={() => handleToggle(p.key)}
                disabled={isToggling}
                aria-label={`${p.label} prayer ${isCompleted ? "completed" : "not completed"}`}
                className="flex flex-col items-center"
                style={{
                  opacity: isToggling ? 0.5 : 1,
                  gap: "var(--space-2)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: 48,
                    height: 48,
                    border: isCompleted
                      ? celebrating
                        ? "1.5px solid var(--dd-lantern-gold)"
                        : "1.5px solid var(--dd-dusk-teal)"
                      : "1px solid var(--border)",
                    background: isCompleted
                      ? celebrating
                        ? "var(--dd-lantern-gold)"
                        : "var(--dd-dusk-teal)"
                      : "transparent",
                    color: isCompleted ? "white" : "var(--muted-foreground)",
                    transform: celebrating && isCompleted ? "scale(1.06)" : "scale(1)",
                  }}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={2.5} />
                  ) : (
                    <p.Icon size={18} strokeWidth={1.5} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: isCompleted
                      ? "var(--dd-dusk-teal)"
                      : "var(--muted-foreground)",
                    transition: "color 200ms ease-out",
                  }}
                >
                  {p.label}
                </span>
              </button>
              {/* Subtle separator between circles */}
              {i < PRAYERS.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    width: "1px",
                    height: "24px",
                    background: "var(--border)",
                    marginInline: "var(--space-3)",
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {allDone && (
        <div
          className="text-center"
          style={{
            marginTop: "var(--space-4)",
            opacity: 1,
            transition: "opacity 200ms ease-out",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-body-sm)",
              fontWeight: 600,
              fontStyle: "italic",
              color: celebrating ? "var(--dd-lantern-gold)" : "var(--dd-dusk-teal)",
              transition: "color 400ms ease-out",
            }}
          >
            {celebrating && settings.name
              ? `MashaAllah, ${settings.name}!`
              : "All prayers completed — MashaAllah"}
          </p>
          {celebrating && (
            <p
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--muted-foreground)",
                marginTop: "var(--space-1)",
                fontStyle: "italic",
                fontFamily: "var(--font-display)",
              }}
            >
              &ldquo;Indeed, prayer prohibits immorality&rdquo; — Quran 29:45
            </p>
          )}
        </div>
      )}
    </div>
  );
}
