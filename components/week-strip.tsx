"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { getToday } from "@/lib/utils";

interface WeekStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

function getWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export const WeekStrip = memo(function WeekStrip({ selectedDate, onSelectDate }: WeekStripProps) {
  const today = getToday();
  const weekDates = useMemo(() => getWeekDates(), [today]);
  const tabsRef = useRef<HTMLButtonElement[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = weekDates.indexOf(selectedDate);
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight": {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % 7;
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + 7) % 7;
          break;
        }
        case "Home": {
          e.preventDefault();
          nextIndex = 0;
          break;
        }
        case "End": {
          e.preventDefault();
          nextIndex = 6;
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          onSelectDate(weekDates[currentIndex]);
          return;
        }
        default:
          return;
      }

      if (nextIndex !== null) {
        onSelectDate(weekDates[nextIndex]);
        tabsRef.current[nextIndex]?.focus();
      }
    },
    [weekDates, selectedDate, onSelectDate],
  );

  return (
    <nav aria-label="Week selector">
      <div
        role="tablist"
        aria-label="Days of the week"
        className="flex items-center justify-between"
        onKeyDown={handleKeyDown}
      >
        {weekDates.map((date, index) => {
          const isSelected = date === selectedDate;
          const isToday = date === today;
          const dayNum = new Date(date + "T00:00:00").getDate();
          const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <button
              key={date}
              ref={(el) => { tabsRef.current[index] = el!; }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`${DAY_LABELS[index]}, ${dateLabel}${isToday ? " (today)" : ""}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelectDate(date)}
              className="flex flex-col items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                width: "44px",
                height: "44px",
              }}
            >
              <span
                className="text-muted-foreground"
                style={{
                  fontSize: "var(--text-caption)",
                  fontWeight: 500,
                  letterSpacing: "var(--tracking-wide)",
                  color: isSelected ? "var(--dd-dusk-teal)" : undefined,
                }}
              >
                {DAY_LABELS[index]}
              </span>
              <span
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: "24px",
                  height: "24px",
                  fontSize: "var(--text-body-sm)",
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected
                    ? "var(--dd-dusk-teal)"
                    : isToday
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  background: isSelected ? "var(--dd-dusk-teal)" : "transparent",
                  borderRadius: "var(--radius-full)",
                  marginTop: "2px",
                }}
              >
                {dayNum}
                {isToday && !isSelected && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--dd-dusk-teal)",
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
})
