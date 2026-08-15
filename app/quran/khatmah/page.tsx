"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  Clock,
  Flame,
  Plus,
  X,
  Check,
} from "lucide-react";
import { useKhatmah } from "@/hooks/use-khatmah";

export default function KhatmahPage() {
  const { goal, progress, sessions, loading, stats, createGoal, addProgress } = useKhatmah();
  const [showGoalSetup, setShowGoalSetup] = useState(false);
  const [showLogProgress, setShowLogProgress] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"overview" | "progress" | "sessions">("overview");

  const khatmahStats = useMemo(() => stats(), [stats]);

  const formatMinutes = (min: number) => {
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className="sticky top-0 z-30 flex items-center border-b border-border bg-background" style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}>
          <div className="h-11 w-11 animate-pulse rounded-md bg-muted" />
          <div className="ml-3 h-5 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex-1 p-5" aria-busy="true" aria-label="Loading khatmah">
          <div className="animate-pulse rounded-2xl border border-border bg-card p-5 mb-4">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-muted mb-2" />
                <div className="h-6 w-12 animate-pulse rounded bg-muted mb-1" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
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
          href="/quran"
          aria-label="Back to Quran"
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
          Khatmah Tracker
        </h1>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setShowLogProgress(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-dusk-teal px-3 text-white transition-colors hover:bg-dusk-teal/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
          >
            <Plus size={14} strokeWidth={2} />
            Log
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24 lg:pb-8" style={{ padding: "var(--space-5)" }}>
        {/* Progress ring */}
        <section
          aria-label="Overall progress"
          className="rounded-2xl border border-border bg-card mb-4"
          style={{ padding: "var(--space-5)" }}
        >
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--dusk-teal)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - khatmahStats.percentComplete / 100)}`}
                  transform="rotate(-90 40 40)"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-foreground"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-body)",
                    fontWeight: 600,
                  }}
                >
                  {khatmahStats.percentComplete}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h2
                className="text-foreground mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h5)",
                  fontWeight: 600,
                }}
              >
                {khatmahStats.completedKhatmahs > 0
                  ? `${khatmahStats.completedKhatmahs} Khatmah${khatmahStats.completedKhatmahs > 1 ? "s" : ""} Complete`
                  : "First Khatmah"}
              </h2>
              <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
                {khatmahStats.totalPagesRead} / {khatmahStats.totalPages} pages
              </p>
              {goal && (
                <p className="text-dusk-teal mt-1" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
                  Goal: {goal.type.replace(/_/g, " ")} ({goal.target})
                </p>
              )}
            </div>
          </div>

          {!goal && (
            <button
              type="button"
              onClick={() => setShowGoalSetup(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-dusk-teal bg-dusk-teal/5 py-3 text-dusk-teal transition-colors hover:bg-dusk-teal/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
            >
              <Target size={16} strokeWidth={1.5} />
              Set Khatmah Goal
            </button>
          )}
        </section>

        {/* Tabs */}
        <div className="flex border-b border-border mb-4" role="tablist" aria-label="Khatmah sections">
          {(["overview", "progress", "sessions"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={selectedTab === tab}
              aria-controls={`khatmah-${tab}`}
              id={`khatmah-tab-${tab}`}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className="relative flex-1 py-3 text-center transition-colors"
              style={{
                color: selectedTab === tab ? "var(--dusk-teal)" : "var(--muted-foreground)",
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {tab}
              {selectedTab === tab && (
                <span
                  className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-dusk-teal"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>

        {selectedTab === "overview" && (
          <div className="flex flex-col gap-3">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<BookOpen size={18} className="text-dusk-teal" strokeWidth={1.5} />}
                label="Pages Read"
                value={String(khatmahStats.totalPagesRead)}
                sub={`${khatmahStats.pagesPerDay}/day avg`}
              />
              <StatCard
                icon={<TrendingUp size={18} className="text-dusk-teal" strokeWidth={1.5} />}
                label="Ayahs Read"
                value={String(khatmahStats.totalAyahsRead)}
                sub={`${khatmahStats.ayahsPerDay}/day avg`}
              />
              <StatCard
                icon={<Clock size={18} className="text-dusk-teal" strokeWidth={1.5} />}
                label="Time Spent"
                value={formatMinutes(khatmahStats.totalMinutes)}
                sub={`${khatmahStats.totalDays} days`}
              />
              <StatCard
                icon={<Flame size={18} className="text-dusk-teal" strokeWidth={1.5} />}
                label="Current Streak"
                value={`${khatmahStats.currentStreak}d`}
                sub={`Best: ${khatmahStats.longestStreak}d`}
              />
            </div>

            {/* Prediction */}
            {khatmahStats.estimatedDaysToComplete > 0 && khatmahStats.percentComplete < 100 && (
              <div
                className="rounded-2xl border border-border bg-card"
                style={{ padding: "var(--space-4)" }}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-dusk-teal" strokeWidth={1.5} />
                  <div>
                    <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                      Estimated completion
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                      {khatmahStats.estimatedDaysToComplete} days at current pace
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === "progress" && (
          <div className="flex flex-col gap-3">
            {progress.length === 0 ? (
              <div
                className="rounded-2xl border border-border bg-card text-center"
                style={{ padding: "var(--space-8)" }}
              >
                <BookOpen size={32} className="text-muted-foreground mx-auto mb-3" strokeWidth={1} />
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
                  No progress logged yet. Start reading to track your journey.
                </p>
              </div>
            ) : (
              progress.slice(0, 30).map((p) => (
                <div
                  key={p.date}
                  className="flex items-center justify-between rounded-xl border border-border bg-card"
                  style={{ padding: "var(--space-3) var(--space-4)" }}
                >
                  <div>
                    <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                      {formatDate(p.date)}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                      {p.pagesRead} pages · {p.ayahsRead} ayahs
                    </p>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                    {formatMinutes(p.duration)}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === "sessions" && (
          <div className="flex flex-col gap-3">
            {sessions.length === 0 ? (
              <div
                className="rounded-2xl border border-border bg-card text-center"
                style={{ padding: "var(--space-8)" }}
              >
                <Clock size={32} className="text-muted-foreground mx-auto mb-3" strokeWidth={1} />
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
                  No reading sessions logged yet.
                </p>
              </div>
            ) : (
              sessions.slice(0, 20).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card"
                  style={{ padding: "var(--space-3) var(--space-4)" }}
                >
                  <div>
                    <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                      {formatDate(s.date)}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                      Pages {s.startPage}–{s.endPage} · {s.ayahsRead} ayahs
                    </p>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                    {formatMinutes(s.duration)}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Goal Setup Modal */}
      {showGoalSetup && (
        <GoalSetupModal onClose={() => setShowGoalSetup(false)} onCreate={createGoal} />
      )}

      {/* Log Progress Modal */}
      {showLogProgress && (
        <LogProgressModal onClose={() => setShowLogProgress(false)} onLog={addProgress} />
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      className="rounded-2xl border border-border bg-card"
      style={{ padding: "var(--space-4)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          {label}
        </span>
      </div>
      <p
        className="text-foreground"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-h5)",
          fontWeight: 600,
        }}
      >
        {value}
      </p>
      <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
        {sub}
      </p>
    </div>
  );
}

function GoalSetupModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (type: "pages_per_day" | "juz_per_week" | "surah_per_month" | "full_quran_per_year", target: number) => void;
}) {
  const [selectedType, setSelectedType] = useState<"pages_per_day" | "juz_per_week" | "surah_per_month" | "full_quran_per_year">("pages_per_day");
  const [target, setTarget] = useState(5);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  const goalOptions = [
    { type: "pages_per_day" as const, label: "Pages per Day", description: "Read a set number of pages daily", example: "5 pages/day = ~4 months" },
    { type: "juz_per_week" as const, label: "Juz per Week", description: "Complete one juz every week", example: "1 juz/week = ~7 months" },
    { type: "surah_per_month" as const, label: "Surah per Month", description: "Read a surah each month", example: "10 surahs/month = ~1 year" },
    { type: "full_quran_per_year" as const, label: "Full Quran per Year", description: "Complete one khatmah per year", example: "1.6 pages/day" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" role="dialog" aria-modal="true" aria-label="Set Khatmah Goal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-t-2xl bg-background sm:rounded-2xl"
        style={{ padding: "var(--space-6)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h5)",
              fontWeight: 600,
            }}
          >
            Set Khatmah Goal
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {goalOptions.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => setSelectedType(opt.type)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                selectedType === opt.type
                  ? "border-dusk-teal bg-dusk-teal/5"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <div className="mt-0.5">
                {selectedType === opt.type ? (
                  <Check size={16} className="text-dusk-teal" strokeWidth={2} />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-border" />
                )}
              </div>
              <div>
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  {opt.label}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                  {opt.description}
                </p>
                <p className="text-dusk-teal mt-1" style={{ fontSize: "var(--text-caption)" }}>
                  {opt.example}
                </p>
              </div>
            </button>
          ))}
        </div>

        {selectedType !== "full_quran_per_year" && (
          <div className="mb-6">
            <label className="text-foreground block mb-2" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Target
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-dusk-teal focus:outline-none"
              style={{ fontSize: "var(--text-body)" }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            const finalTarget = selectedType === "full_quran_per_year" ? 1 : target;
            onCreate(selectedType, finalTarget);
            onClose();
          }}
          className="w-full rounded-xl bg-dusk-teal py-3 text-white transition-colors hover:bg-dusk-teal/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{ fontSize: "var(--text-body)", fontWeight: 600 }}
        >
          Start Khatmah
        </button>
      </div>
    </div>
  );
}

function LogProgressModal({
  onClose,
  onLog,
}: {
  onClose: () => void;
  onLog: (entry: {
    pagesRead: number;
    juzRead: number;
    ayahsRead: number;
    duration: number;
    lastPage: number;
    lastJuz: number;
  }) => void;
}) {
  const [pages, setPages] = useState(1);
  const [ayahs, setAyahs] = useState(10);
  const [minutes, setMinutes] = useState(15);
  const [startPage, setStartPage] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" role="dialog" aria-modal="true" aria-label="Log Reading" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-t-2xl bg-background sm:rounded-2xl"
        style={{ padding: "var(--space-6)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h5)",
              fontWeight: 600,
            }}
          >
            Log Reading
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-foreground block mb-1.5" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Pages Read
            </label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-dusk-teal focus:outline-none"
              style={{ fontSize: "var(--text-body)" }}
            />
          </div>
          <div>
            <label className="text-foreground block mb-1.5" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Ayahs Read
            </label>
            <input
              type="number"
              value={ayahs}
              onChange={(e) => setAyahs(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-dusk-teal focus:outline-none"
              style={{ fontSize: "var(--text-body)" }}
            />
          </div>
          <div>
            <label className="text-foreground block mb-1.5" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Duration (minutes)
            </label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-dusk-teal focus:outline-none"
              style={{ fontSize: "var(--text-body)" }}
            />
          </div>
          <div>
            <label className="text-foreground block mb-1.5" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Starting Page
            </label>
            <input
              type="number"
              value={startPage}
              onChange={(e) => setStartPage(Number(e.target.value))}
              min={1}
              max={604}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-dusk-teal focus:outline-none"
              style={{ fontSize: "var(--text-body)" }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onLog({
              pagesRead: pages,
              juzRead: 0,
              ayahsRead: ayahs,
              duration: minutes,
              lastPage: startPage + pages - 1,
              lastJuz: 0,
            });
            onClose();
          }}
          className="w-full rounded-xl bg-dusk-teal py-3 text-white transition-colors hover:bg-dusk-teal/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{ fontSize: "var(--text-body)", fontWeight: 600 }}
        >
          Log Progress
        </button>
      </div>
    </div>
  );
}
