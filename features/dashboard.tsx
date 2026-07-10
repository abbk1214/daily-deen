"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useNotifications } from "@/hooks/use-notifications";
import { useSettings } from "@/hooks/use-settings";
import { useLocation } from "@/hooks/use-location";
import { useWeather } from "@/hooks/use-weather";
import { DayArc } from "@/components/day-arc";
import { ProgressTracker } from "@/components/progress-tracker";
import { PrayerStatus } from "@/components/prayer-status";
import { getToday } from "@/lib/utils";
import { formatHijriDate } from "@/lib/hijri-date";
import {
  DateHeader,
  NextPrayerCard,
  StreakCard,
  CompletionCard,
  HabitSummaryCard,
  WeatherCard,
  QiblaCard,
  QuickActionsCard,
  JournalReminderCard,
  QuranReminderCard,
} from "@/components/dashboard";
import { getQiblaDirection } from "@/lib/qibla";

const QiblaCompass = lazy(() =>
  import("@/components/qibla/compass").then((m) => ({ default: m.CompassWidget }))
);

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

function getGregorianDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const cardEntranceStyle = `
  @keyframes dd-card-enter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .dd-card { animation: dd-card-enter 300ms var(--ease-out) both; }
  .dd-card-1 { animation-delay: 0ms; }
  .dd-card-2 { animation-delay: 50ms; }
  .dd-card-3 { animation-delay: 100ms; }
  .dd-card-4 { animation-delay: 150ms; }
  .dd-card-5 { animation-delay: 200ms; }
  .dd-card-6 { animation-delay: 250ms; }
  .dd-card-7 { animation-delay: 300ms; }
  .dd-card-8 { animation-delay: 350ms; }
  .dd-card-9 { animation-delay: 400ms; }
  .dd-card-10 { animation-delay: 450ms; }

  @media (prefers-reduced-motion: reduce) {
    .dd-card { animation: none; opacity: 1; transform: none; }
  }
`;

function NotificationStatus() {
  const { supported, enabled, permission } = useNotifications();
  const { settings } = useSettings();

  if (!supported) return null;

  if (permission === "denied") {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 bg-muted text-muted-foreground"
        style={{
          height: "var(--space-10)",
          fontSize: "var(--text-body-sm)",
          fontWeight: 500,
        }}
      >
        <BellOff size={16} strokeWidth={1.5} />
        Notifications are disabled in your browser.
      </div>
    );
  }

  if (!enabled || !settings.notificationsEnabled) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 bg-dusk-teal/10 text-dusk-teal"
      style={{
        height: "var(--space-10)",
        fontSize: "var(--text-body-sm)",
        fontWeight: 500,
      }}
    >
      <Bell size={16} strokeWidth={1.5} />
      Notifications Enabled — Reminder: {settings.reminderOffset} min before
    </div>
  );
}

export function Dashboard() {
  const {
    prayers,
    computedTimes,
    habits,
    habitLogs,
    loading,
    incrementHabit,
    decrementHabit,
    nextPrayer,
    refreshPrayers,
  } = useDashboardData();
  const isOnline = useOnlineStatus();
  const { latitude, longitude, city, country, detectLocation } = useLocation();
  const { weather } = useWeather(
    typeof latitude === "number" ? latitude : undefined,
    typeof longitude === "number" ? longitude : undefined,
  );
  const [showCompass, setShowCompass] = useState(false);

  const affirmation = useMemo(() => getTodayAffirmation(), []);
  const greeting = useMemo(() => getGreeting(), []);
  const gregorianDate = useMemo(() => getGregorianDate(), []);

  const hijriDate = useMemo(() => {
    try {
      return formatHijriDate(getToday());
    } catch {
      return null;
    }
  }, []);

  const hasLocation =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  const qiblaBearing = useMemo(() => {
    if (!hasLocation) return null
    const result = getQiblaDirection({ latitude: latitude!, longitude: longitude! })
    return result.bearing
  }, [latitude, longitude, hasLocation])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cardEntranceStyle }} />

      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 backdrop-blur-md"
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
          className="ml-4 text-muted-foreground hidden sm:inline"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          {greeting}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {hasLocation && (
            <button
              aria-label="Qibla compass"
              onClick={() => setShowCompass(!showCompass)}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                showCompass
                  ? "bg-[var(--color-lantern)] text-white"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <NotificationStatus />

      <main
        id="main"
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          padding: "var(--space-5)",
          paddingBottom: "calc(var(--space-14) + env(safe-area-inset-bottom, 0px) + var(--space-5))",
          maxWidth: "var(--content-reading)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          gap: "var(--space-5)",
        }}
      >
        {/* Greeting + Date Header */}
        <div className="dd-card dd-card-1">
          <div className="mb-2">
            <span
              className="text-muted-foreground"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              {greeting}
            </span>
          </div>
          <DateHeader
            hijriDate={hijriDate}
            gregorianDate={gregorianDate}
            city={city}
            country={country}
            isOnline={isOnline}
            lastSync={new Date().getTime()}
          />
        </div>

        {/* Day Arc — full width */}
        <div
          className="dd-card dd-card-2"
          style={{
            marginLeft: "calc(-1 * var(--space-5))",
            marginRight: "calc(-1 * var(--space-5))",
            paddingLeft: "var(--space-5)",
            paddingRight: "var(--space-5)",
          }}
        >
          <DayArc prayers={prayers} loading={loading} />
        </div>

        {/* Qibla Compass (conditionally visible) */}
        {showCompass && hasLocation && (
          <div className="dd-card dd-card-3">
            <section
              role="region"
              aria-label="Qibla compass"
              className="rounded-lg border border-border bg-card"
              style={{
                padding: "var(--space-6)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <h2
                className="font-display text-foreground mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h5)",
                  fontWeight: 600,
                }}
              >
                Qibla Direction
              </h2>
              {city && country && (
                <p
                  className="text-muted-foreground mb-4"
                  style={{ fontSize: "var(--text-caption)" }}
                >
                  {city}, {country}
                </p>
              )}
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-80">
                    <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                  </div>
                }
              >
                <QiblaCompass />
              </Suspense>
            </section>
          </div>
        )}

        {/* Card grid: 2-column on larger screens */}
        <div
          className="dd-card dd-card-3 grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          }}
        >
          <NextPrayerCard
            nextPrayer={nextPrayer}
            computedTimes={computedTimes}
            prayers={prayers}
            loading={loading}
          />
          <WeatherCard
            weather={weather}
            city={city}
            loading={loading}
          />
        </div>

        <div
          className="dd-card dd-card-4 grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          }}
        >
          <CompletionCard
            computedTimes={computedTimes}
            loading={loading}
          />
          <StreakCard loading={loading} />
        </div>

        <div
          className="dd-card dd-card-5 grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          }}
        >
          <HabitSummaryCard
            habits={habits}
            habitLogs={habitLogs}
            loading={loading}
          />
          <QiblaCard
            bearing={qiblaBearing}
            city={city}
            onOpenCompass={() => setShowCompass(!showCompass)}
            isVisible={showCompass}
          />
        </div>

        {/* Interactive Progress Tracker */}
        <div className="dd-card dd-card-6">
          <ProgressTracker
            habits={habits}
            habitLogs={habitLogs}
            onIncrement={incrementHabit}
            onDecrement={decrementHabit}
            loading={loading}
          />
        </div>

        {/* Prayer Status Detail */}
        <div className="dd-card dd-card-7">
          {computedTimes && <PrayerStatus prayers={computedTimes} loading={loading} />}
        </div>

        {/* Reminders */}
        <div
          className="dd-card dd-card-8 grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          }}
        >
          <JournalReminderCard loading={loading} />
          <QuranReminderCard loading={loading} />
        </div>

        {/* Quick Actions */}
        <div className="dd-card dd-card-9">
          <QuickActionsCard
            onRefreshLocation={detectLocation}
            onRefreshPrayers={refreshPrayers}
          />
        </div>

        {/* Daily Affirmation */}
        <aside
          aria-label="Daily affirmation"
          className="dd-card dd-card-10 flex flex-col items-center py-12 text-center"
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
