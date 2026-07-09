"use client";

import { useMemo } from "react";
import { Bell, WifiOff } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { DayArc } from "@/components/day-arc";
import { ProgressTracker } from "@/components/progress-tracker";
import { PrayerStatus } from "@/components/prayer-status";

const AFFIRMATIONS = [
  { text: "And He found you lost and guided.", source: "Quran 93:7" },
  { text: "Indeed, with hardship comes ease.", source: "Quran 94:6" },
  { text: "So remember Me; I will remember you.", source: "Quran 2:152" },
  { text: "And whoever puts their trust in Allah, He is sufficient for them.", source: "Quran 65:3" },
  { text: "Verily, with every difficulty there is relief.", source: "Quran 94:5" },
  { text: "And Allah is the best of planners.", source: "Quran 3:20" },
  { text: "Do not grieve; indeed Allah is with us.", source: "Quran 9:40" },
];

function getTodayAffirmation() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const fadeInStyle = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .dd-fade-in { animation: fadeInUp 200ms var(--ease-out) both; }
  .dd-fade-in-1 { animation-delay: 0ms; }
  .dd-fade-in-2 { animation-delay: 50ms; }
  .dd-fade-in-3 { animation-delay: 100ms; }
  .dd-fade-in-4 { animation-delay: 150ms; }
  .dd-fade-in-5 { animation-delay: 200ms; }
  @media (prefers-reduced-motion: reduce) {
    .dd-fade-in { animation: none; opacity: 1; transform: none; }
  }
`;

export function Dashboard() {
  const {
    prayers,
    habits,
    habitLogs,
    loading,
    incrementHabit,
    decrementHabit,
  } = useDashboardData();
  const isOnline = useOnlineStatus();

  const affirmation = useMemo(() => getTodayAffirmation(), []);
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fadeInStyle }} />

      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 backdrop-blur-md dd-fade-in dd-fade-in-1"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <h1
          className="font-display text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Daily Deen
        </h1>
        <span
          className="ml-4 text-muted-foreground"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          {greeting}
        </span>
        <div className="ml-auto">
          <button
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Bell size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2 bg-dusk-teal text-accent-foreground"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
          }}
        >
          <WifiOff size={16} strokeWidth={1.5} />
          Offline — showing saved data
        </div>
      )}

      <main
        id="main"
        className="flex flex-1 flex-col pb-24 lg:pb-8 dd-fade-in dd-fade-in-2"
        style={{
          padding: "var(--space-5)",
          paddingBottom: "calc(var(--space-14) + env(safe-area-inset-bottom, 0px) + var(--space-5))",
          maxWidth: "var(--content-reading)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          gap: "var(--space-8)",
        }}
      >
        <div
          className="dd-fade-in dd-fade-in-2"
          style={{
            marginLeft: "calc(-1 * var(--space-5))",
            marginRight: "calc(-1 * var(--space-5))",
            paddingLeft: "var(--space-5)",
            paddingRight: "var(--space-5)",
          }}
        >
          <DayArc prayers={prayers} loading={loading} />
        </div>

        <div className="dd-fade-in dd-fade-in-3">
          <ProgressTracker
            habits={habits}
            habitLogs={habitLogs}
            onIncrement={incrementHabit}
            onDecrement={decrementHabit}
            loading={loading}
          />
        </div>

        <div className="dd-fade-in dd-fade-in-4">
          <PrayerStatus prayers={prayers} loading={loading} />
        </div>

        <aside
          aria-label="Daily affirmation"
          className="flex flex-col items-center py-12 text-center dd-fade-in dd-fade-in-5"
          style={{ maxWidth: "65ch", marginInline: "auto" }}
        >
          <p
            className="font-display text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
            }}
          >
            {affirmation.text}
          </p>
          <p
            className="mt-3 text-muted-foreground"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            — {affirmation.source}
          </p>
        </aside>
      </main>
    </>
  );
}
