"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface AddHabitFormProps {
  onAdd: (habit: {
    name: string
    type: "exercise" | "walk" | "hydration" | "custom"
    target: number
    unit: string
    increment: number
  }) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  target?: string;
  unit?: string;
}

export function AddHabitForm({ onAdd, onCancel }: AddHabitFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"exercise" | "walk" | "hydration" | "custom">("custom");
  const [unit, setUnit] = useState("");
  const [target, setTarget] = useState("1");
  const [increment, setIncrement] = useState("1");
  const [errors, setErrors] = useState<FormErrors>({});
  const nameInputRef = useRef<HTMLInputElement>(null);
  const unitInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const incrementInputRef = useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Give your habit a name";
    } else if (name.length > 32) {
      newErrors.name = "Name must be 32 characters or fewer";
    }

    const targetNum = Number(target);
    if (!target || isNaN(targetNum) || targetNum < 1) {
      newErrors.target = "Target must be at least 1";
    }

    if (!unit.trim()) {
      newErrors.unit = "What unit are you tracking?";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, target, unit]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      onAdd({
        name: name.trim(),
        type,
        target: Number(target),
        unit: unit.trim() || "times",
        increment: Number(increment) || 1,
      });
    },
    [name, type, target, unit, increment, validate, onAdd],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [onCancel],
  );

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      unitInputRef.current?.focus();
    }
  }, []);

  const handleUnitKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      targetInputRef.current?.focus();
    }
  }, []);

  const handleTargetKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      incrementInputRef.current?.focus();
    }
  }, []);

  const handleIncrementKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addButtonRef.current?.click();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      aria-label="Add new habit"
      className="flex flex-col"
      style={{ padding: "var(--space-6) 0" }}
    >
      {/* Name */}
      <div style={{ marginBottom: "var(--space-4)" }}>
        <label
          htmlFor="habit-name"
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
            display: "block",
            marginBottom: "var(--space-1)",
          }}
        >
          Habit name
        </label>
        <input
          id="habit-name"
          ref={nameInputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleNameKeyDown}
          aria-required="true"
          aria-describedby={errors.name ? "habit-name-error" : undefined}
          autoComplete="off"
          className="w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body)",
            fontFamily: "var(--font-body)",
          }}
          placeholder="e.g. Read Qur'an"
        />
        {errors.name && (
          <p
            id="habit-name-error"
            role="alert"
            className="text-destructive"
            style={{
              fontSize: "var(--text-caption)",
              marginTop: "var(--space-1)",
            }}
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Type */}
      <div style={{ marginBottom: "var(--space-4)" }}>
        <span
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
            display: "block",
            marginBottom: "var(--space-2)",
          }}
        >
          Type
        </span>
        <div
          role="radiogroup"
          aria-label="Habit type"
          className="flex gap-3"
        >
          {(["custom", "exercise", "walk", "hydration"] as const).map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
              }}
            >
              <input
                type="radio"
                name="habit-type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="accent-[var(--dd-dusk-teal)]"
                style={{ width: "16px", height: "16px" }}
              />
              <span className="capitalize">{t === "custom" ? "Custom" : t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Unit */}
      <div style={{ marginBottom: "var(--space-4)" }}>
          <label
            htmlFor="habit-unit"
            className="text-muted-foreground"
            style={{
              fontSize: "var(--text-caption)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-wide)",
              display: "block",
              marginBottom: "var(--space-1)",
            }}
          >
            Unit
          </label>
          <input
            id="habit-unit"
            ref={unitInputRef}
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            onKeyDown={handleUnitKeyDown}
            aria-describedby={errors.unit ? "habit-unit-error" : undefined}
            className="w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
            style={{
              height: "var(--space-10)",
              fontSize: "var(--text-body)",
              fontFamily: "var(--font-body)",
            }}
            placeholder="e.g. cups, minutes, steps"
          />
          {errors.unit && (
            <p
              id="habit-unit-error"
              role="alert"
              className="text-destructive"
              style={{
                fontSize: "var(--text-caption)",
                marginTop: "var(--space-1)",
              }}
            >
              {errors.unit}
            </p>
          )}
        </div>

      {/* Target */}
      <div style={{ marginBottom: "var(--space-4)" }}>
        <label
          htmlFor="habit-target"
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
            display: "block",
            marginBottom: "var(--space-1)",
          }}
        >
          Daily target
        </label>
        <input
          id="habit-target"
          ref={targetInputRef}
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={handleTargetKeyDown}
          min={1}
          max={999}
          aria-required="true"
          aria-describedby={errors.target ? "habit-target-error" : undefined}
          className="w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body)",
            fontFamily: "var(--font-mono)",
          }}
        />
        {errors.target && (
          <p
            id="habit-target-error"
            role="alert"
            className="text-destructive"
            style={{
              fontSize: "var(--text-caption)",
              marginTop: "var(--space-1)",
            }}
          >
            {errors.target}
          </p>
        )}
      </div>

      {/* Increment */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <label
          htmlFor="habit-increment"
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
            display: "block",
            marginBottom: "var(--space-1)",
          }}
        >
          Increment per tap
        </label>
        <input
          id="habit-increment"
          ref={incrementInputRef}
          type="number"
          value={increment}
          onChange={(e) => setIncrement(e.target.value)}
          onKeyDown={handleIncrementKeyDown}
          min={1}
          max={999}
          className="w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body)",
            fontFamily: "var(--font-mono)",
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          ref={cancelButtonRef}
          onClick={onCancel}
          className="flex-1 rounded-lg border border-border bg-transparent px-4 text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          ref={addButtonRef}
          className="flex-1 rounded-lg bg-primary px-4 text-primary-foreground transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-primary/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary/90"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          Add Habit
        </button>
      </div>
    </form>
  );
}
