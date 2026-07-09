"use client";

import { useCallback, useRef } from "react";

interface MoodSelectorProps {
  value: string | null;
  onChange: (mood: string | null) => void;
}

const MOODS = [
  {
    id: "grateful",
    label: "Grateful",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Cupped hands — du'a gesture */}
        <path d="M8 16 C8 12, 12 10, 16 10 C20 10, 24 12, 24 16" />
        <path d="M10 16 L10 18 C10 20, 12 22, 16 22 C20 22, 22 20, 22 18 L22 16" />
        <path d="M16 10 L16 8" />
      </svg>
    ),
  },
  {
    id: "peaceful",
    label: "Peaceful",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Crescent moon */}
        <path d="M20 6 C14 8, 10 14, 10 20 C10 26, 14 30, 20 30 C15 26, 13 18, 16 10 C17 8, 18 7, 20 6 Z" />
      </svg>
    ),
  },
  {
    id: "reflective",
    label: "Reflective",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Open book */}
        <path d="M16 8 L6 10 L6 24 L16 22 L26 24 L26 10 L16 8 Z" />
        <path d="M16 8 L16 22" />
      </svg>
    ),
  },
  {
    id: "hopeful",
    label: "Hopeful",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Sunrise over horizon */}
        <path d="M6 22 L26 22" />
        <path d="M10 22 A6 6 0 0 1 22 22" />
        <path d="M16 16 L16 12" />
        <path d="M10 18 L8 15" />
        <path d="M22 18 L24 15" />
      </svg>
    ),
  },
  {
    id: "seeking",
    label: "Seeking",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Compass needle */}
        <circle cx="16" cy="16" r="10" />
        <path d="M16 6 L16 26" />
        <path d="M14 8 L16 4 L18 8" />
        <path d="M13 14 L16 10 L19 14" />
      </svg>
    ),
  },
] as const;

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = MOODS.findIndex((m) => m.id === value);
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown": {
          e.preventDefault();
          nextIndex =
            currentIndex < 0 ? 0 : (currentIndex + 1) % MOODS.length;
          break;
        }
        case "ArrowLeft":
        case "ArrowUp": {
          e.preventDefault();
          nextIndex =
            currentIndex < 0
              ? MOODS.length - 1
              : (currentIndex - 1 + MOODS.length) % MOODS.length;
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (currentIndex >= 0) {
            // Toggle: if already selected, clear
            onChange(value === MOODS[currentIndex].id ? null : MOODS[currentIndex].id);
          } else if (MOODS.length > 0) {
            onChange(MOODS[0].id);
          }
          return;
        }
        case "Escape": {
          e.preventDefault();
          onChange(null);
          return;
        }
        default:
          return;
      }

      if (nextIndex !== null) {
        onChange(MOODS[nextIndex].id);
        const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="radio"]',
        );
        buttons?.[nextIndex]?.focus();
      }
    },
    [value, onChange],
  );

  return (
    <div>
      <p
        className="text-muted-foreground"
        style={{
          fontSize: "var(--text-body-sm)",
          marginBottom: "var(--space-2)",
        }}
      >
        How are you feeling?
      </p>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Mood selector"
        className="flex flex-wrap gap-6"
        onKeyDown={handleKeyDown}
      >
        {MOODS.map((mood) => {
          const isSelected = value === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={mood.label}
              onClick={() => onChange(isSelected ? null : mood.id)}
              className="flex flex-col items-center justify-center rounded-md transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                width: "44px",
                height: "44px",
                color: isSelected
                  ? "var(--dd-dusk-teal)"
                  : "var(--muted-foreground)",
              }}
            >
              {mood.icon}
            </button>
          );
        })}
      </div>
      {/* Screen reader announcement */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {value
          ? `Mood set to ${MOODS.find((m) => m.id === value)?.label ?? value}`
          : "Mood cleared"}
      </div>
    </div>
  );
}
