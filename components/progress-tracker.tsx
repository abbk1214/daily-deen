import { memo } from "react";
import { Droplets, Footprints, PenLine, Check } from "lucide-react";
import { formatValue, getIncrementStep } from "@/lib/utils";
import type { Habit, HabitLog } from "@/lib/db";

interface ProgressTrackerProps {
  habits: Habit[];
  habitLogs: HabitLog[];
  onIncrement: (habitId: number, step: number) => void;
  onDecrement: (habitId: number, step: number) => void;
  loading: boolean;
}

function getIcon(type: Habit["type"]) {
  switch (type) {
    case "hydration":
      return Droplets;
    case "exercise":
      return Footprints;
    case "walk":
      return Footprints;
    default:
      return PenLine;
  }
}

export const ProgressTracker = memo(function ProgressTracker({
  habits,
  habitLogs,
  onIncrement,
  onDecrement,
  loading,
}: ProgressTrackerProps) {
  if (loading) {
    return (
      <section aria-label="Daily progress" aria-busy="true">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (habits.length === 0) {
    return null;
  }

  const logMap = new Map(habitLogs.map((l) => [l.habitId, l]));

  return (
    <section aria-label="Daily progress">
      <div className="flex flex-col gap-4">
        {habits.map((habit) => {
          const log = habit.id != null ? logMap.get(habit.id) : undefined;
          const value = log?.value ?? 0;
          const progress = Math.min(100, (value / habit.target) * 100);
          const isComplete = value >= habit.target;
          const step = getIncrementStep(habit);
          const Icon = getIcon(habit.type);

          return (
            <div key={habit.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                  <span
                    className="font-medium text-foreground"
                    style={{
                      fontSize: "var(--text-body)",
                      fontWeight: 500,
                    }}
                  >
                    {habit.name}
                  </span>
                  {isComplete && (
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="text-quiet-sage"
                      aria-label="Goal reached"
                    />
                  )}
                </div>
                <span
                  className="font-mono text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-body-sm)",
                    fontWeight: 400,
                    color: isComplete ? "var(--dd-quiet-sage)" : undefined,
                  }}
                >
                  {formatValue(value, habit.unit)} / {formatValue(habit.target, habit.unit)}{" "}
                  {habit.unit}
                </span>
              </div>

              <div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={habit.target}
                aria-label={`${habit.name}: ${value} of ${habit.target} ${habit.unit}`}
                className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: isComplete
                      ? "var(--dd-quiet-sage)"
                      : "var(--dd-dusk-teal)",
                    transitionDuration: "var(--duration-normal)",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => habit.id != null && onDecrement(habit.id, step)}
                  disabled={value <= 0}
                  aria-label={`Decrement ${habit.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground disabled:text-border disabled:opacity-50"
                  style={{ fontSize: "16px", fontFamily: "var(--font-mono)" }}
                >
                  −
                </button>
                <span
                  className="text-border"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    letterSpacing: "var(--tracking-wide)",
                  }}
                  aria-hidden="true"
                >
                  {"·".repeat(20)}
                </span>
                <button
                  onClick={() => habit.id != null && onIncrement(habit.id, step)}
                  disabled={isComplete}
                  aria-label={`Increment ${habit.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground disabled:text-border disabled:opacity-50"
                  style={{ fontSize: "16px", fontFamily: "var(--font-mono)" }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
})
