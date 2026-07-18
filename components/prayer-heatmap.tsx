"use client";

import { useMemo } from "react";

interface PrayerHeatmapProps {
  data: Record<string, { fajr: boolean; dhuhr: boolean; asr: boolean; maghrib: boolean; isha: boolean }>;
  days?: number;
}

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const PRAYER_LABELS: Record<string, string> = {
  fajr: "F",
  dhuhr: "D",
  asr: "A",
  maghrib: "M",
  isha: "I",
};

function getCompletionLevel(prayers: { fajr: boolean; dhuhr: boolean; asr: boolean; maghrib: boolean; isha: boolean }): 0 | 1 | 2 | 3 | 4 | 5 {
  const count = PRAYERS.filter((p) => prayers[p]).length;
  return count as 0 | 1 | 2 | 3 | 4 | 5;
}

function getColor(level: 0 | 1 | 2 | 3 | 4 | 5): string {
  const colors = [
    "var(--muted)",
    "color-mix(in srgb, var(--dusk-teal) 20%, var(--muted))",
    "color-mix(in srgb, var(--dusk-teal) 40%, var(--muted))",
    "color-mix(in srgb, var(--dusk-teal) 60%, var(--muted))",
    "color-mix(in srgb, var(--dusk-teal) 80%, var(--muted))",
    "var(--dusk-teal)",
  ];
  return colors[level];
}

export function PrayerHeatmap({ data, days = 90 }: PrayerHeatmapProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const weeksData: { date: string; level: 0 | 1 | 2 | 3 | 4 | 5; prayers: Record<string, boolean> }[][] = [];
    let currentWeek: { date: string; level: 0 | 1 | 2 | 3 | 4 | 5; prayers: Record<string, boolean> }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayData = data[dateStr];
      const level = dayData ? getCompletionLevel(dayData) : 0;

      currentWeek.push({ date: dateStr, level, prayers: dayData || {} });

      if (d.getDay() === 6 || i === 0) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }

    return weeksData;
  }, [data, days]);

  const cellSize = 14;
  const gap = 3;
  const totalWidth = weeks.length * (cellSize + gap);
  const totalHeight = 7 * (cellSize + gap);

  const totalPrayers = useMemo(() => {
    let total = 0;
    let completed = 0;
    for (const dayData of Object.values(data)) {
      total += 5;
      completed += PRAYERS.filter((p) => dayData[p]).length;
    }
    return { total, completed, rate: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Prayer Consistency
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            {totalPrayers.rate}% completion rate
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground" style={{ fontSize: "10px" }}>Less</span>
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="rounded-sm"
              style={{
                width: 10,
                height: 10,
                background: getColor(level as 0 | 1 | 2 | 3 | 4 | 5),
              }}
            />
          ))}
          <span className="text-muted-foreground" style={{ fontSize: "10px" }}>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <svg
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="block"
        >
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              const x = wi * (cellSize + gap);
              const y = di * (cellSize + gap);

              return (
                <rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={3}
                  ry={3}
                  fill={getColor(day.level)}
                >
                  <title>
                    {day.date}: {PRAYERS.filter((p) => day.prayers[p]).length}/5 prayers
                  </title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        {PRAYERS.map((p) => {
          const count = Object.values(data).filter((d) => d[p]).length;
          return (
            <div key={p} className="flex items-center gap-1.5">
              <span
                className="flex h-5 w-5 items-center justify-center rounded text-xs font-medium"
                style={{
                  background: "var(--dusk-teal)",
                  color: "white",
                  fontSize: "9px",
                }}
              >
                {PRAYER_LABELS[p]}
              </span>
              <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                {count}d
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
