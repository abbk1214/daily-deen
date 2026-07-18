"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { formatValue, getIncrementStep } from "@/lib/utils";
import type { Habit, HabitLog } from "@/lib/db";

interface HabitRowProps {
  habit: Habit;
  log: HabitLog | undefined;
  onIncrement: (habitId: number, step: number) => Promise<void>;
  onDecrement: (habitId: number, step: number) => Promise<void>;
  onEdit: (habit: Habit) => void;
  showSeparator?: boolean;
}

function truncateName(name: string, maxLen = 24): string {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 1) + "\u2026";
}

export const HabitRow = memo(function HabitRow({ habit, log, onIncrement, onDecrement, onEdit, showSeparator = false }: HabitRowProps) {
  const currentValue = log?.value ?? 0;
  const isComplete = currentValue >= habit.target;
  const baseStep = getIncrementStep(habit);
  const percentage = Math.min(100, (currentValue / habit.target) * 100);
  const habitId = habit.id!;

  const [isPressed, setIsPressed] = useState<"inc" | "dec" | null>(null);
  const [isAccelerated, setIsAccelerated] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }
    setIsAccelerated(false);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const handleIncrementStart = useCallback(() => {
    setIsPressed("inc");
    onIncrement(habitId, baseStep);

    longPressTimerRef.current = setTimeout(() => {
      setIsAccelerated(true);
      intervalTimerRef.current = setInterval(() => {
        onIncrement(habitId, baseStep);
      }, 100);
    }, 500);
  }, [habitId, baseStep, onIncrement]);

  const handleIncrementEnd = useCallback(() => {
    setIsPressed(null);
    clearAllTimers();
  }, [clearAllTimers]);

  const handleDecrementStart = useCallback(() => {
    setIsPressed("dec");
    onDecrement(habitId, baseStep);

    longPressTimerRef.current = setTimeout(() => {
      setIsAccelerated(true);
      intervalTimerRef.current = setInterval(() => {
        onDecrement(habitId, baseStep);
      }, 100);
    }, 500);
  }, [habitId, baseStep, onDecrement]);

  const handleDecrementEnd = useCallback(() => {
    setIsPressed(null);
    clearAllTimers();
  }, [clearAllTimers]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "+" || (e.key === "=" && e.shiftKey)) {
        e.preventDefault();
        onIncrement(habitId, baseStep);
      } else if (e.key === "-") {
        e.preventDefault();
        onDecrement(habitId, baseStep);
      }
    },
    [habitId, baseStep, onIncrement, onDecrement],
  );

  const progressLabel = `${formatValue(currentValue, habit.unit)} / ${formatValue(habit.target, habit.unit)} ${habit.unit}`;

  return (
    <li
      className="flex flex-col group"
      role="listitem"
      aria-label={`${habit.name}: ${progressLabel}`}
      onKeyDown={handleKeyDown}
      style={showSeparator ? { borderBottom: "1px solid var(--border)", margin: "var(--space-4) 0", paddingBottom: "var(--space-4)" } : { padding: "var(--space-4) 0" }}
    >
      {/* Title + Progress label */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--space-2)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-foreground"
            style={{
              fontSize: "var(--text-body)",
              fontWeight: 500,
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {truncateName(habit.name)}
          </span>
          {isComplete && (
            <Check
              size={16}
              strokeWidth={1.5}
              className="text-quiet-sage"
              aria-label="Goal reached"
            />
          )}
          <button
            type="button"
            aria-label={`Edit ${habit.name}`}
            onClick={() => onEdit(habit)}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] text-muted-foreground hover:text-foreground rounded p-0.5"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Pencil size={14} strokeWidth={1.5} />
          </button>
        </div>
        <span
          className={isComplete ? "text-quiet-sage" : "text-muted-foreground"}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono-sm)",
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          {progressLabel}
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={currentValue}
        aria-valuemin={0}
        aria-valuemax={habit.target}
        aria-label={`${habit.name}: ${currentValue} of ${habit.target} ${habit.unit}`}
        className="w-full rounded-full"
        style={{
          height: "var(--space-1)",
          background: "var(--muted)",
          marginBottom: "var(--space-2)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]"
          style={{
            width: `${percentage}%`,
            background: isComplete ? "var(--dd-quiet-sage)" : "var(--muted-foreground)",
          }}
        />
      </div>

      {/* Quick log controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrement ${habit.name}`}
          disabled={currentValue <= 0}
          onMouseDown={handleDecrementStart}
          onMouseUp={handleDecrementEnd}
          onMouseLeave={handleDecrementEnd}
          onTouchStart={handleDecrementStart}
          onTouchEnd={handleDecrementEnd}
          className="flex items-center justify-center rounded-md transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:text-border disabled:hover:bg-transparent disabled:hover:text-border"
          style={{
            width: "44px",
            height: "44px",
            fontSize: "16px",
            fontFamily: "var(--font-mono)",
            color: isPressed === "dec" ? "var(--foreground)" : "var(--muted-foreground)",
            background: isPressed === "dec" ? "var(--secondary)" : "transparent",
            opacity: isAccelerated && isPressed === "dec" ? 0.8 : 1,
          }}
        >
          −
        </button>

        <div
          className="flex-1 text-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono-sm)",
            color: "var(--border)",
            letterSpacing: "0.15em",
          }}
          aria-hidden="true"
        >
          ····························································
        </div>

        <button
          type="button"
          aria-label={`Increment ${habit.name}`}
          disabled={currentValue >= habit.target}
          onMouseDown={handleIncrementStart}
          onMouseUp={handleIncrementEnd}
          onMouseLeave={handleIncrementEnd}
          onTouchStart={handleIncrementStart}
          onTouchEnd={handleIncrementEnd}
          className="flex items-center justify-center rounded-md transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:text-border disabled:hover:bg-transparent disabled:hover:text-border"
          style={{
            width: "44px",
            height: "44px",
            fontSize: "16px",
            fontFamily: "var(--font-mono)",
            color: isPressed === "inc" ? "var(--foreground)" : "var(--muted-foreground)",
            background: isPressed === "inc" ? "var(--secondary)" : "transparent",
            opacity: isAccelerated && isPressed === "inc" ? 0.8 : 1,
          }}
        >
          +
        </button>
      </div>

      {/* Screen reader live region */}
      <div role="status" aria-live="polite" className="sr-only">
        {isComplete && `${habit.name} goal reached for today`}
      </div>
    </li>
  );
})
