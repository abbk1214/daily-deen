"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, RotateCcw, ChevronRight } from "lucide-react";
import { ALL_ADHKAR_CATEGORIES } from "@/lib/dhikr/data";
import type { Dhikr, DhikrCategory } from "@/lib/dhikr/data";

export default function DhikrPage() {
  const [selectedCategory, setSelectedCategory] = useState<DhikrCategory | null>(null);
  const [tasbeehTarget, setTasbeehTarget] = useState(33);
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState<string>("SubhanAllah");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dhikrOptions = [
    { label: "SubhanAllah", arabic: "سُبْحَانَ اللَّه" },
    { label: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّه" },
    { label: "Allahu Akbar", arabic: "اللَّهُ أَكْبَر" },
    { label: "La ilaha illAllah", arabic: "لَا إِلَٰهَ إِلَّا اللَّه" },
    { label: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّه" },
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const incrementTasbeeh = useCallback(() => {
    setTasbeehCount((prev) => {
      if (prev >= tasbeehTarget) return prev;
      const next = prev + 1;
      if (next >= tasbeehTarget) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      return next;
    });
  }, [tasbeehTarget]);

  const resetTasbeeh = useCallback(() => {
    setTasbeehCount(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  if (selectedCategory) {
    return (
      <DhikrCategoryView
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1
          className="ml-3 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
          }}
        >
          Dhikr
        </h1>
      </header>

      <main className="flex-1 pb-24 lg:pb-8" style={{ padding: "var(--space-5)" }}>
        {/* Tasbeeh counter */}
        <section
          aria-label="Tasbeeh counter"
          className="rounded-xl border border-border bg-card mb-6"
          style={{ padding: "var(--space-6)" }}
        >
          <h2
            className="text-foreground mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h5)",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Tasbeeh Counter
          </h2>

          {/* Dhikr selector */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {dhikrOptions.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => { setSelectedDhikr(d.label); resetTasbeeh(); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedDhikr === d.label
                    ? "bg-dusk-teal text-white"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Arabic display */}
          <p
            className="text-foreground text-center mb-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 6vw, 36px)",
              fontWeight: 400,
              direction: "rtl",
            }}
          >
            {dhikrOptions.find((d) => d.label === selectedDhikr)?.arabic || ""}
          </p>

          {/* Counter display */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              type="button"
              onClick={resetTasbeeh}
              aria-label="Reset"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80"
            >
              <RotateCcw size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={incrementTasbeeh}
              aria-label={`Count: ${tasbeehCount} of ${tasbeehTarget}`}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-dusk-teal text-white transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-h2)",
                fontWeight: 600,
              }}
            >
              {tasbeehCount}
            </button>
            <button
              type="button"
              onClick={() => {
                setTasbeehTarget((prev) => (prev === 33 ? 99 : prev === 99 ? 100 : 33));
                resetTasbeeh();
              }}
              aria-label={`Target: ${tasbeehTarget}`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-caption)",
                fontWeight: 500,
              }}
            >
              {tasbeehTarget}
            </button>
          </div>

          {/* Progress */}
          <div
            className="w-full rounded-full"
            style={{ height: "var(--space-1)", background: "var(--muted)" }}
          >
            <div
              className="h-full rounded-full bg-dusk-teal transition-all duration-300"
              style={{ width: `${(tasbeehCount / tasbeehTarget) * 100}%` }}
            />
          </div>
          <p className="text-muted-foreground text-center mt-2" style={{ fontSize: "var(--text-caption)" }}>
            {tasbeehCount} / {tasbeehTarget}
          </p>
        </section>

        {/* Adhkar categories */}
        <section aria-label="Adhkar categories">
          <h2
            className="text-foreground mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h5)",
              fontWeight: 600,
            }}
          >
            Adhkar
          </h2>
          <div className="flex flex-col gap-3">
            {ALL_ADHKAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dusk-teal/10">
                  {cat.id === "morning" ? (
                    <Sun size={20} className="text-dusk-teal" strokeWidth={1.5} />
                  ) : (
                    <Moon size={20} className="text-dusk-teal" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
                    {cat.name}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                    {cat.dhikrs.length} adhkar · {cat.description}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function DhikrCategoryView({
  category,
  onBack,
}: {
  category: DhikrCategory;
  onBack: () => void;
}) {
  const [completedDhikrs, setCompletedDhikrs] = useState<Set<string>>(new Set());

  const toggleComplete = useCallback((id: string) => {
    setCompletedDhikrs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <h1
          className="ml-3 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h5)",
            fontWeight: 600,
          }}
        >
          {category.name}
        </h1>
        <span className="ml-3 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          {completedDhikrs.size}/{category.dhikrs.length}
        </span>
      </header>

      <main className="flex-1 pb-24 lg:pb-8">
        {category.dhikrs.map((dhikr, i) => {
          const isComplete = completedDhikrs.has(dhikr.id);
          return (
            <DhikrCard
              key={dhikr.id}
              dhikr={dhikr}
              index={i}
              isComplete={isComplete}
              onToggle={() => toggleComplete(dhikr.id)}
            />
          );
        })}
      </main>
    </div>
  );
}

function DhikrCard({
  dhikr,
  index,
  isComplete,
  onToggle,
}: {
  dhikr: Dhikr;
  index: number;
  isComplete: boolean;
  onToggle: () => void;
}) {
  const [count, setCount] = useState(0);

  return (
    <div
      className="border-b border-border px-5 py-5"
      style={{ opacity: isComplete ? 0.5 : 1 }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-caption)",
            fontWeight: 500,
          }}
        >
          {index + 1}
        </span>
        <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          {count}/{dhikr.count}
        </span>
      </div>

      <p
        className="text-foreground text-center mb-3"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 4vw, 28px)",
          fontWeight: 400,
          lineHeight: 1.6,
          direction: "rtl",
        }}
      >
        {dhikr.arabic}
      </p>

      <p
        className="text-muted-foreground text-center mb-2"
        style={{ fontSize: "var(--text-body-sm)", fontStyle: "italic" }}
      >
        {dhikr.transliteration}
      </p>

      <p
        className="text-muted-foreground text-center mb-3"
        style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.5 }}
      >
        {dhikr.translation}
      </p>

      <p className="text-muted-foreground text-center mb-3" style={{ fontSize: "var(--text-caption)" }}>
        {dhikr.reference}
      </p>

      {dhikr.virtuous && (
        <p
          className="text-dusk-teal text-center mb-3"
          style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}
        >
          {dhikr.virtuous}
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            if (count < dhikr.count) setCount((c) => c + 1);
            if (count + 1 >= dhikr.count) onToggle();
          }}
          disabled={isComplete}
          className="rounded-full bg-dusk-teal text-white transition-all active:scale-95 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{
            width: "64px",
            height: "64px",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-body)",
            fontWeight: 600,
          }}
        >
          {isComplete ? "✓" : dhikr.count - count}
        </button>
      </div>
    </div>
  );
}
