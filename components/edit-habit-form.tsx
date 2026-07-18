"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface EditHabitFormProps {
  habit: {
    id: number;
    name: string;
    type: "exercise" | "walk" | "hydration" | "custom";
    target: number;
    unit: string;
    increment: number;
  };
  onUpdate: (habitId: number, patch: {
    name?: string;
    type?: "exercise" | "walk" | "hydration" | "custom";
    target?: number;
    unit?: string;
    increment?: number;
  }) => void;
  onDelete: (habitId: number) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  target?: string;
  unit?: string;
}

export function EditHabitForm({ habit, onUpdate, onDelete, onCancel }: EditHabitFormProps) {
  const [name, setName] = useState(habit.name);
  const [type, setType] = useState(habit.type);
  const [unit, setUnit] = useState(habit.unit);
  const [target, setTarget] = useState(String(habit.target));
  const [increment, setIncrement] = useState(String(habit.increment));
  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

      onUpdate(habit.id, {
        name: name.trim(),
        type,
        target: Number(target),
        unit: unit.trim() || "times",
        increment: Number(increment) || 1,
      });
    },
    [habit.id, name, type, target, unit, increment, validate, onUpdate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [onCancel],
  );

  const handleDelete = useCallback(() => {
    if (showConfirmDelete) {
      onDelete(habit.id);
    } else {
      setShowConfirmDelete(true);
    }
  }, [showConfirmDelete, habit.id, onDelete]);

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      aria-label={`Edit ${habit.name}`}
      className="flex flex-col"
      style={{ padding: "var(--space-4) 0" }}
    >
      {/* Name */}
      <div style={{ marginBottom: "var(--space-3)" }}>
        <label
          htmlFor={`edit-habit-name-${habit.id}`}
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
          id={`edit-habit-name-${habit.id}`}
          ref={nameInputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-required="true"
          aria-describedby={errors.name ? `edit-habit-name-error-${habit.id}` : undefined}
          autoComplete="off"
          className="w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body)",
            fontFamily: "var(--font-body)",
          }}
        />
        {errors.name && (
          <p
            id={`edit-habit-name-error-${habit.id}`}
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
      <div style={{ marginBottom: "var(--space-3)" }}>
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
        <div role="radiogroup" aria-label="Habit type" className="flex gap-3">
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
                name={`edit-habit-type-${habit.id}`}
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
      <div style={{ marginBottom: "var(--space-3)" }}>
        <label
          htmlFor={`edit-habit-unit-${habit.id}`}
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
          id={`edit-habit-unit-${habit.id}`}
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          aria-describedby={errors.unit ? `edit-habit-unit-error-${habit.id}` : undefined}
          className="w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body)",
            fontFamily: "var(--font-body)",
          }}
        />
        {errors.unit && (
          <p
            id={`edit-habit-unit-error-${habit.id}`}
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
      <div style={{ marginBottom: "var(--space-3)" }}>
        <label
          htmlFor={`edit-habit-target-${habit.id}`}
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
          id={`edit-habit-target-${habit.id}`}
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          min={1}
          max={999}
          aria-required="true"
          aria-describedby={errors.target ? `edit-habit-target-error-${habit.id}` : undefined}
          className="w-full rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body)",
            fontFamily: "var(--font-mono)",
          }}
        />
        {errors.target && (
          <p
            id={`edit-habit-target-error-${habit.id}`}
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
      <div style={{ marginBottom: "var(--space-4)" }}>
        <label
          htmlFor={`edit-habit-increment-${habit.id}`}
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
          id={`edit-habit-increment-${habit.id}`}
          type="number"
          value={increment}
          onChange={(e) => setIncrement(e.target.value)}
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
          onClick={handleDelete}
          className="rounded-lg border border-destructive/30 bg-transparent px-4 text-destructive transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
          }}
        >
          {showConfirmDelete ? "Confirm Delete" : "Delete"}
        </button>
        <button
          type="button"
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
          className="flex-1 rounded-lg bg-primary px-4 text-primary-foreground transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-primary/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary/90"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}
