"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { timeToMinutes, formatTimeFromMinutes } from "@/lib/utils";
import { formatHijriDate } from "@/lib/hijri-date";
import type { Prayer } from "@/lib/db";

function minutesToAngle(minutes: number, fajrMinutes: number, ishaMinutes: number): number {
  const dayLength = ishaMinutes - fajrMinutes;
  if (dayLength <= 0) return 0;
  const progress = (minutes - fajrMinutes) / dayLength;
  return Math.max(0, Math.min(1, progress)) * 180;
}

interface DayArcProps {
  prayers: Prayer | undefined;
  loading: boolean;
}

export const DayArc = memo(function DayArc({ prayers, loading }: DayArcProps) {
  const [now, setNow] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const timeData = useMemo(() => {
    const hours = Math.floor(now / 60);
    const minutes = now % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return {
      timeString: `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`,
      isoString: new Date().toISOString(),
    };
  }, [now]);

  const hijriDate = useMemo(() => getHijriDateString(), []);
  const gregorianDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  if (loading || !prayers) {
    return (
      <section
        className="rounded-lg border border-border bg-card"
        style={{
          padding: "var(--space-8) var(--space-6)",
          boxShadow: "var(--shadow-xs)",
        }}
        aria-label="Prayer times arc"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="animate-pulse rounded-full bg-muted"
            style={{ width: "clamp(100px, 20vw, 160px)", height: "clamp(100px, 20vw, 160px)" }}
          />
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </section>
    );
  }

  const fajrMin = timeToMinutes(prayers.fajr) || 0;
  const dhuhrMin = timeToMinutes(prayers.dhuhr) || 0;
  const asrMin = timeToMinutes(prayers.asr) || 0;
  const maghribMin = timeToMinutes(prayers.maghrib) || 0;
  const ishaMin = timeToMinutes(prayers.isha) || 0;

  const prayerTimes = [
    { name: "Fajr", minutes: fajrMin, key: "fajr" as const },
    { name: "Dhuhr", minutes: dhuhrMin, key: "dhuhr" as const },
    { name: "Asr", minutes: asrMin, key: "asr" as const },
    { name: "Maghrib", minutes: maghribMin, key: "maghrib" as const },
    { name: "Isha", minutes: ishaMin, key: "isha" as const },
  ];

  const clampedNow = Math.max(fajrMin, Math.min(ishaMin, now));
  const currentAngle = minutesToAngle(clampedNow, fajrMin, ishaMin);

  const r = 80;
  const cx = 100;
  const cy = 100;

  function polarToCartesian(angle: number) {
    const rad = ((180 - angle) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  }

  const trackD = describeArc(cx, cy, r, 0, 180);
  const fillD = describeArc(cx, cy, r, 0, currentAngle);

  const currentPrayerName = getCurrentPrayerName(now, prayerTimes);

  return (
    <section
      className="rounded-lg border border-border bg-card"
      style={{
        padding: "var(--space-8) var(--space-6)",
        boxShadow: "var(--shadow-xs)",
      }}
      aria-label={`Prayer times arc, currently ${timeData.timeString}`}
    >
      <div className="flex flex-col items-center gap-4">
        {currentPrayerName && (
          <p
            className="font-medium text-foreground"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            {currentPrayerName}
          </p>
        )}

        <svg
          role="img"
      aria-label={`Prayer times arc, currently ${timeData.timeString}`}
          viewBox="0 0 200 110"
          className="w-full max-w-xs"
          style={{ height: "clamp(100px, 20vw, 160px)" }}
        >
          <path
            d={trackD}
            fill="none"
            stroke="var(--border)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={fillD}
            fill="none"
            stroke="var(--dd-lantern-gold)"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {prayerTimes.map((pt) => {
            const angle = minutesToAngle(pt.minutes, fajrMin, ishaMin);
            const pos = polarToCartesian(angle);
            const isCompleted = prayers.completed[pt.key];
            return (
              <g key={pt.key}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={4}
                  fill={isCompleted ? "var(--dd-lantern-gold)" : "var(--card)"}
                  stroke={isCompleted ? "var(--dd-lantern-gold)" : "var(--border)"}
                  strokeWidth={1.5}
                  aria-label={`${pt.name} at ${formatTimeFromMinutes(pt.minutes)}`}
                />
              </g>
            );
          })}

          {(() => {
            const pos = polarToCartesian(currentAngle);
            return (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={6}
                fill="var(--dd-lantern-gold)"
                style={{
                  filter: "none",
                }}
                aria-hidden="true"
              />
            );
          })()}
        </svg>

        <div className="flex flex-col items-center gap-1">
          <time
            className="font-mono font-medium text-foreground"
            style={{
              fontSize: "clamp(20px, 3vw, 32px)",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
            }}
            dateTime={timeData.isoString}
          >
            {timeData.timeString}
          </time>
          <p
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            {hijriDate}
          </p>
          <p
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            {gregorianDate}
          </p>
        </div>
      </div>
    </section>
  );
})

function getCurrentPrayerName(
  now: number,
  times: { name: string; minutes: number }[],
): string | null {
  for (let i = times.length - 1; i >= 0; i--) {
    if (now >= times[i].minutes) return times[i].name;
  }
  return times[0]?.name ?? null;
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const startRad = ((180 - startAngle) * Math.PI) / 180;
  const endRad = ((180 - endAngle) * Math.PI) / 180;
  const sx = x + radius * Math.cos(startRad);
  const sy = y - radius * Math.sin(startRad);
  const ex = x + radius * Math.cos(endRad);
  const ey = y - radius * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 0 ${ex} ${ey}`;
}

function getHijriDateString(): string {
  try {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    return formatHijriDate(dateStr);
  } catch {
    return "";
  }
}
