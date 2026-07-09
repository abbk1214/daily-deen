import { memo, useMemo } from "react";

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
  const weekDates = useMemo(() => getWeekDates(), []);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <nav aria-label="Week selector" className="flex items-center justify-between">
      <div
        className="flex items-center justify-between flex-1"
        role="radiogroup"
        aria-label="Days of the week"
      >
        {weekDates.map((date, index) => {
          const isSelected = date === selectedDate;
          const isToday = date === today;
          const dayNum = new Date(date + "T00:00:00").getDate();

          return (
            <button
              key={date}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${DAY_LABELS[index]}, ${new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}${isToday ? " (today)" : ""}`}
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
                className="flex items-center justify-center rounded-full"
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
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
})
