"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, ListChecks, WifiOff } from "lucide-react";
import Link from "next/link";
import { WeekStrip } from "@/components/week-strip";
import { HabitRow } from "@/components/habit-row";
import { AddHabitForm } from "@/components/add-habit-form";
import { useHabits } from "@/hooks/use-habits";
import { useOnlineStatus } from "@/hooks/use-online-status";

export default function HabitsPage() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const isOnline = useOnlineStatus();

  const {
    habits,
    loading,
    error,
    increment,
    decrement,
    addHabit,
    refresh,
    logFor,
  } = useHabits(selectedDate);

  const handleAddHabit = useCallback(
    async (habit: {
      name: string;
      type: "exercise" | "walk" | "hydration" | "custom";
      target: number;
      unit: string;
      increment: number;
    }) => {
      await addHabit(habit);
      setShowAddForm(false);
    },
    [addHabit],
  );

  const handleCancelAdd = useCallback(() => setShowAddForm(false), []);

  const today = useMemo(
    () =>
      new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [selectedDate],
  );

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      <a
        href="#habits"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to habits
      </a>

      {/* Offline banner */}
      {!isOnline && (
        <div
          role="alert"
          className="flex items-center justify-center gap-2 bg-dusk-teal text-accent-foreground"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
          }}
        >
          <WifiOff size={16} strokeWidth={1.5} />
          Offline — habits saved locally
        </div>
      )}

      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 backdrop-blur-md"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
        role="banner"
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1
          className="ml-3 text-muted-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-body-sm)",
          }}
        >
          {today}
        </h1>
      </header>

      {/* Main content */}
      <main
        id="habits"
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          padding: "var(--space-5)",
          paddingBottom:
            "calc(var(--space-14) + env(safe-area-inset-bottom, 0px) + var(--space-5))",
          maxWidth: "var(--content-reading)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      >
        {/* Week strip */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <WeekStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <div
          className="border-t border-border"
          style={{ marginBottom: "var(--space-6)" }}
        />

        {/* Habits list */}
        {loading ? (
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div
                  className="flex flex-col gap-2"
                  style={{ padding: "var(--space-4) 0" }}
                >
                  <div className="flex justify-between">
                    <div
                      className="animate-pulse rounded"
                      style={{
                        width: "100px",
                        height: "16px",
                        background: "var(--muted)",
                      }}
                    />
                    <div
                      className="animate-pulse rounded"
                      style={{
                        width: "80px",
                        height: "12px",
                        background: "var(--muted)",
                      }}
                    />
                  </div>
                  <div
                    className="animate-pulse rounded-full"
                    style={{
                      width: "100%",
                      height: "4px",
                      background: "var(--muted)",
                    }}
                  />
                  <div className="flex justify-between">
                    <div
                      className="animate-pulse rounded-full"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: "var(--muted)",
                      }}
                    />
                    <div
                      className="animate-pulse rounded-full"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: "var(--muted)",
                      }}
                    />
                  </div>
                </div>
                {i < 3 && <div className="border-t border-border" />}
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex flex-col items-center py-24 text-center">
            <AlertCircle
              size={32}
              strokeWidth={1.5}
              className="text-destructive"
              style={{ marginBottom: "var(--space-4)" }}
            />
            <h2
              className="text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h3)",
                fontWeight: 600,
                letterSpacing: "var(--tracking-h3)",
                marginBottom: "var(--space-2)",
              }}
            >
              Couldn&apos;t load habits
            </h2>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-body-sm)",
                maxWidth: "30ch",
                marginBottom: "var(--space-8)",
              }}
            >
              Something went wrong. Tap to retry.
            </p>
            <button
              type="button"
              onClick={refresh}
              className="text-dusk-teal transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                fontSize: "var(--text-body)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wide)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "var(--space-4) var(--space-5)",
              }}
            >
              Retry
            </button>
          </div>
        ) : habits.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center py-24 text-center">
            <ListChecks
              size={48}
              strokeWidth={1.5}
              className="text-muted-foreground"
              style={{ marginBottom: "var(--space-4)" }}
            />
            <h2
              className="text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h3)",
                fontWeight: 600,
                letterSpacing: "var(--tracking-h3)",
                marginBottom: "var(--space-2)",
              }}
            >
              Build your daily routine
            </h2>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-body-sm)",
                maxWidth: "30ch",
                marginBottom: "var(--space-8)",
              }}
            >
              Add habits to track your spiritual and physical well-being each
              day.
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="text-dusk-teal transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                fontSize: "var(--text-body)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wide)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "var(--space-4) var(--space-5)",
              }}
            >
              + Add your first habit
            </button>
          </div>
        ) : (
          /* Habit rows */
          <ul aria-label="Daily habits" className="flex flex-col">
            {habits.map((habit, index) => (
              <div key={habit.id}>
                <HabitRow
                  habit={habit}
                  log={logFor(habit.id!)}
                  onIncrement={increment}
                  onDecrement={decrement}
                />
                {index < habits.length - 1 && (
                  <div
                    className="border-t border-border"
                    style={{ margin: "var(--space-4) 0" }}
                  />
                )}
              </div>
            ))}

            <div
              className="border-t border-border"
              style={{ margin: "var(--space-4) 0" }}
            />

            {/* Add habit */}
            {showAddForm ? (
              <AddHabitForm
                onAdd={handleAddHabit}
                onCancel={handleCancelAdd}
              />
            ) : (
              <li>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  aria-expanded={showAddForm}
                  className="w-full text-dusk-teal transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{
                    fontSize: "var(--text-body)",
                    fontWeight: 500,
                    letterSpacing: "var(--tracking-wide)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "var(--space-4) 0",
                  }}
                >
                  + Add habit
                </button>
              </li>
            )}
          </ul>
        )}
      </main>
    </div>
  );
}
