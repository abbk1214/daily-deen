"use client";

import { memo, useEffect, useState } from "react";
import { formatTimeFromMinutes } from "@/lib/utils";
import type { PrayerTimes } from "@/lib/prayer";

interface PrayerStatusProps {
  prayers: PrayerTimes;
  loading: boolean;
}

function formatTimeUntil(targetMinutes: number, nowMinutes: number): string {
  let diff = targetMinutes - nowMinutes;
  if (diff < 0) diff += 24 * 60;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours === 0) return `in ${mins}m`;
  if (mins === 0) return `in ${hours}h`;
  return `in ${hours}h ${mins}m`;
}

function formatCountdown(targetMinutes: number, nowMinutes: number): string {
  let diff = targetMinutes - nowMinutes;
  if (diff < 0) diff += 24 * 60;
  if (diff === 0) return "now";
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

const PRAYER_KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
const PRAYER_NAMES: Record<(typeof PRAYER_KEYS)[number], string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export const PrayerStatus = memo(function PrayerStatus({ prayers, loading }: PrayerStatusProps) {
  const [nowMinutes, setNowMinutes] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section
        role="region"
        aria-label="Prayer status"
        className="rounded-lg border border-border bg-card"
        style={{ padding: "var(--space-6)", boxShadow: "var(--shadow-xs)" }}
        aria-busy="true"
      >
        <div className="flex flex-col gap-3">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        </div>
      </section>
    );
  }

  const times = PRAYER_KEYS.map((key) => ({
    key,
    name: PRAYER_NAMES[key],
    minutes: prayers[key],
  }));

  let currentIdx = 0;
  for (let i = times.length - 1; i >= 0; i--) {
    if (nowMinutes >= times[i].minutes) {
      currentIdx = i;
      break;
    }
  }

  const current = times[currentIdx];
  const nextIdx = (currentIdx + 1) % times.length;
  const next = times[nextIdx];

  const isCountdown = next.minutes - nowMinutes > 0 && next.minutes - nowMinutes <= 30;

  return (
    <section
      role="region"
      aria-label="Prayer status"
      className="rounded-lg border border-border bg-card"
      style={{
        padding: "var(--space-6)",
        boxShadow: "var(--shadow-xs)",
      }}
      aria-live="polite"
    >
      <div className="flex flex-col gap-3">
        <span
          className="font-medium tracking-wide text-dusk-teal"
          style={{
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          NOW
        </span>

        <h3
          className="font-display text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h3)",
            fontWeight: 600,
          }}
        >
          {current.name}
        </h3>

        <span
          className="font-mono text-muted-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-body-sm)",
          }}
        >
          {formatTimeFromMinutes(current.minutes)}
        </span>

        <div className="mt-2 flex flex-col gap-1">
          <span
            className="text-muted-foreground"
            style={{
              fontSize: "var(--text-caption)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            NEXT
          </span>
          <span
            className="font-medium text-foreground"
            style={{ fontSize: "var(--text-body)", fontWeight: 500 }}
          >
            {next.name}
          </span>
          <span
            className="font-mono text-muted-foreground"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-body-sm)",
            }}
          >
            {formatTimeFromMinutes(next.minutes)} —{" "}
            {formatTimeUntil(next.minutes, nowMinutes)}
          </span>
        </div>

        {isCountdown && (
          <div
            className="mt-3 flex items-center gap-2 rounded-lg bg-dusk-teal/10 px-4 py-3"
            style={{ borderLeft: "3px solid var(--dd-lantern-gold)" }}
          >
            <span
              className="text-dusk-teal"
              style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)" }}
            >
              COUNTDOWN
            </span>
            <span
              className="font-mono text-foreground"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-h4)",
                fontWeight: 600,
                color: "var(--dd-lantern-gold)",
              }}
            >
              {formatCountdown(next.minutes, nowMinutes)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
});
