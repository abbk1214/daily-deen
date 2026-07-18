"use client";

import { useMemo } from "react";

interface HabitGraphProps {
  data: Record<string, number>;
  target: number;
  unit: string;
  color?: string;
  days?: number;
}

export function HabitGraph({
  data,
  target,
  unit,
  color = "var(--dusk-teal)",
  days = 90,
}: HabitGraphProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const weeksData: { date: string; value: number; level: 0 | 1 | 2 | 3 | 4 }[][] = [];
    let currentWeek: { date: string; value: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const value = data[dateStr] || 0;
      const ratio = target > 0 ? value / target : 0;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (ratio >= 1) level = 4;
      else if (ratio >= 0.75) level = 3;
      else if (ratio >= 0.5) level = 2;
      else if (ratio > 0) level = 1;

      currentWeek.push({ date: dateStr, value, level });

      if (d.getDay() === 6 || i === 0) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }

    return weeksData;
  }, [data, target, days]);

  const cellSize = 12;
  const gap = 3;
  const totalWidth = weeks.length * (cellSize + gap);
  const totalHeight = 7 * (cellSize + gap);

  return (
    <div className="overflow-x-auto">
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
            const fill =
              day.level === 0
                ? "var(--muted)"
                : day.level === 1
                  ? `color-mix(in srgb, ${color} 25%, var(--muted))`
                  : day.level === 2
                    ? `color-mix(in srgb, ${color} 50%, var(--muted))`
                    : day.level === 3
                      ? `color-mix(in srgb, ${color} 75%, var(--muted))`
                      : color;

            return (
              <rect
                key={day.date}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={2}
                ry={2}
                fill={fill}
              >
                <title>
                  {day.date}: {day.value} {unit}
                </title>
              </rect>
            );
          }),
        )}
      </svg>
    </div>
  );
}

interface WeeklyBarChartProps {
  data: { label: string; value: number; target?: number }[];
  color?: string;
  height?: number;
}

export function WeeklyBarChart({
  data,
  color = "var(--dusk-teal)",
  height = 120,
}: WeeklyBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * (height - 20);
        const isComplete = d.target ? d.value >= d.target : d.value > 0;

        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end" style={{ height: height - 20 }}>
              {d.target && (
                <div
                  className="w-full border-t border-dashed border-muted-foreground/30"
                  style={{ bottom: `${(d.target / maxValue) * 100}%`, position: "absolute" }}
                />
              )}
              <div
                className="w-full rounded-t transition-all duration-300"
                style={{
                  height: barHeight,
                  background: isComplete ? color : `color-mix(in srgb, ${color} 40%, var(--muted))`,
                }}
              />
            </div>
            <span className="text-muted-foreground" style={{ fontSize: "9px" }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface StreakDisplayProps {
  current: number;
  longest: number;
  total: number;
}

export function StreakDisplay({ current, longest, total }: StreakDisplayProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className="text-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
          }}
        >
          {current}
        </span>
        <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          Current
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span
          className="text-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
          }}
        >
          {longest}
        </span>
        <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          Longest
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span
          className="text-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
          }}
        >
          {total}
        </span>
        <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          Total Days
        </span>
      </div>
    </div>
  );
}
