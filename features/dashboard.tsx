"use client";

import { memo, useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, ArrowRight } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useSettings } from "@/hooks/use-settings";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getToday } from "@/lib/utils";
import { formatHijriDate } from "@/lib/hijri-date";
import { DateHeader, NextPrayerCard } from "@/components/dashboard";
import { getLastReadSurah } from "@/lib/db";
import { SURAH_LIST } from "@/lib/quran/data";
import { AdhkarTracker } from "@/components/adhkar-tracker";
import { DashboardSkeleton } from "@/components/skeleton";
import { WeatherWidget } from "@/components/weather-widget";
import { DailyQuote } from "@/components/daily-quote";
import { PrayerCheckIn } from "@/components/prayer-checkin";
import { StreakCard } from "@/components/dashboard/streak-card";
import { TodayHabits } from "@/components/dashboard/today-habits";
import { JournalPrompt } from "@/components/dashboard/journal-prompt";
import { WeeklySummary } from "@/components/dashboard/weekly-summary";
import { HealthSummary } from "@/components/dashboard/health-summary";
import { CompanionCard } from "@/components/companion/companion-card";

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

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name ? `${timeGreeting}, ${name}` : timeGreeting;
}

function getGregorianDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const ContinueReading = memo(function ContinueReading() {
  const [lastRead, setLastRead] = useState<{ surahNumber: number; ayahNumber: number } | null>(null);

  useEffect(() => {
    getLastReadSurah().then(setLastRead);
  }, []);

  if (!lastRead) return null;

  const surah = SURAH_LIST.find((s) => s.number === lastRead.surahNumber);
  if (!surah) return null;

  return (
    <Link
      href={`/quran/${lastRead.surahNumber}?ayah=${lastRead.ayahNumber}`}
      className="flex items-center gap-4 rounded-2xl border border-border bg-card transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      style={{ padding: "var(--space-4)", boxShadow: "var(--shadow-xs)" }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: 44,
          height: 44,
          background: "color-mix(in srgb, var(--dd-dusk-teal) 8%, transparent)",
        }}
      >
        <BookOpen size={18} className="text-dusk-teal" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
          Continue Reading
        </p>
        <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
          {surah.englishName} — Ayah {lastRead.ayahNumber}
        </p>
      </div>
      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
    </Link>
  );
});

export function Dashboard() {
  const {
    prayers,
    computedTimes,
    habits,
    habitLogs,
    loading,
    nextPrayer,
    incrementHabit,
  } = useDashboardData();
  const isOnline = useOnlineStatus();
  const { settings } = useSettings();
  const [streakRefreshKey, setStreakRefreshKey] = useState(0);
  const scrollRef = useScrollReveal();

  const today = useMemo(() => getToday(), []);
  const affirmation = useMemo(() => getTodayAffirmation(), []);
  const greeting = useMemo(() => getGreeting(settings.name || undefined), [settings.name]);
  const gregorianDate = useMemo(() => getGregorianDate(), []);
  const [lastSyncTime] = useState(() => Date.now());
  const hijriDate = useMemo(() => {
    try {
      return formatHijriDate(today);
    } catch {
      return null;
    }
  }, [today]);

  if (loading) {
    return (
      <>
        <header
          className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
          style={{
            height: "var(--space-12)",
            padding: "var(--space-3) var(--space-5)",
          }}
        >
          <h1
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h4)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Daily Deen
          </h1>
        </header>
        <main id="main" aria-busy="true" aria-label="Dashboard loading">
          <DashboardSkeleton />
        </main>
      </>
    );
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <h1
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Daily Deen
        </h1>
      </header>

      <main
        ref={scrollRef}
        id="main"
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          paddingInline: "var(--space-6)",
          paddingTop: "var(--space-8)",
          paddingBottom: "calc(var(--space-16) + env(safe-area-inset-bottom, 0px) + var(--space-6))",
          maxWidth: "var(--content-reading)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          gap: "var(--space-10)",
        }}
      >
        {/* Greeting — editorial opening moment */}
        <section aria-label="Date and greeting" style={{ paddingBottom: "var(--space-2)" }}>
          <p
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 500,
              fontStyle: "italic",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "-0.02em",
              marginBottom: "var(--space-4)",
            }}
          >
            {greeting}
          </p>
          <DateHeader
            hijriDate={hijriDate}
            gregorianDate={gregorianDate}
            city={settings.city || ""}
            country={settings.country || ""}
            isOnline={isOnline}
            lastSync={lastSyncTime}
          />
        </section>

        {/* Prayer Check-in — primary action */}
        <section aria-label="Mark prayers as completed" className="dd-reveal">
          <PrayerCheckIn onToggle={() => setStreakRefreshKey((k) => k + 1)} />
        </section>

        {/* Journal Prompt — contextual, appears after all prayers done */}
        <section aria-label="Journal prompt" className="dd-reveal">
          <JournalPrompt
            allPrayersCompleted={
              prayers
                ? Object.values(prayers.completed).every(Boolean)
                : false
            }
          />
        </section>

        {/* Weekly Summary — progress overview */}
        <section aria-label="Weekly summary" className="dd-reveal">
          <WeeklySummary />
        </section>

        {/* Health Summary — today's wellness at a glance */}
        <section aria-label="Health summary" className="dd-reveal">
          <HealthSummary />
        </section>

        {/* Streak — visible progress */}
        <section aria-label="Prayer streak" className="dd-reveal">
          <StreakCard loading={loading} refreshKey={streakRefreshKey} />
        </section>

        {/* Today's Habits — quick log */}
        <section aria-label="Today's habits" className="dd-reveal">
          <TodayHabits
            habits={habits}
            habitLogs={habitLogs}
            onIncrement={incrementHabit}
          />
        </section>

        {/* Next Prayer + Continue Reading — task-oriented */}
        <section aria-label="Next prayer and reading" className="dd-reveal flex flex-col" style={{ gap: "var(--space-3)" }}>
          <ContinueReading />
          <NextPrayerCard
            nextPrayer={nextPrayer}
            computedTimes={computedTimes}
            prayers={prayers}
            loading={loading}
          />
        </section>

        {/* Today's Focus — one contextual card */}
        <section aria-label="Today's focus" className="dd-reveal">
          <AdhkarTracker />
        </section>

        {/* Deen Guide — spiritual companion */}
        <section aria-label="Deen Guide" className="dd-reveal">
          <CompanionCard />
        </section>

        {/* Weather + Quote — ambient context */}
        <section aria-label="Weather and inspiration" className="dd-reveal flex flex-col" style={{ gap: "var(--space-3)" }}>
          <WeatherWidget />
          <DailyQuote />
        </section>

        {/* Daily Affirmation — closing thought */}
        <aside
          aria-label="Daily reflection"
          className="dd-reveal flex flex-col items-center text-center"
          style={{
            paddingTop: "var(--space-8)",
            paddingBottom: "var(--space-4)",
            maxWidth: "36ch",
            marginInline: "auto",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "1px",
              background: "var(--border)",
              marginBottom: "var(--space-6)",
            }}
            aria-hidden="true"
          />
          <p
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 3vw, 22px)",
              fontWeight: 500,
              fontStyle: "italic",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
            }}
          >
            {affirmation.text}
          </p>
          <p
            className="text-muted-foreground"
            style={{
              fontSize: "var(--text-caption)",
              marginTop: "var(--space-3)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
            — {affirmation.source}
          </p>
        </aside>

        {/* Explore more — progressive disclosure */}
        <Link
          href="/wellness"
          aria-label="Explore all wellness trackers"
          className="dd-reveal flex items-center justify-center gap-2 rounded-2xl border border-border bg-card transition-colors hover:bg-secondary"
          style={{ padding: "var(--space-4)", boxShadow: "var(--shadow-xs)" }}
        >
          <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Explore all trackers
          </span>
          <ArrowRight size={16} className="text-muted-foreground" />
        </Link>
      </main>
    </>
  );
}
