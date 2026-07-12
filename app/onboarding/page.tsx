"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/lib/db";

type Screen = "welcome" | "location" | "goals";

const ILLUSTRATIONS = {
  welcome: (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      role="img"
      aria-label="Three concentric circles suggesting expanding awareness"
      className="text-muted-foreground w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]"
    >
      <circle cx="40" cy="40" r="12" />
      <circle cx="44" cy="38" r="24" strokeDasharray="56 19" />
      <circle cx="36" cy="44" r="36" strokeDasharray="57 173" />
    </svg>
  ),
  location: (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      role="img"
      aria-label="Compass rose suggesting direction and location"
      className="text-muted-foreground w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]"
    >
      <circle cx="40" cy="40" r="2" fill="currentColor" />
      <line x1="40" y1="40" x2="40" y2="12" />
      <line x1="40" y1="40" x2="40" y2="68" />
      <line x1="40" y1="40" x2="68" y2="40" />
      <line x1="40" y1="40" x2="12" y2="40" />
    </svg>
  ),
  goals: (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      role="img"
      aria-label="Three ascending bars suggesting growth and progress"
      className="text-muted-foreground w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]"
    >
      <line x1="26" y1="56" x2="26" y2="32" />
      <line x1="37" y1="56" x2="37" y2="16" />
      <line x1="48" y1="56" x2="48" y2="0" />
    </svg>
  ),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [transitioning, setTransitioning] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "error" | "denied">("idle");
  const [locationError, setLocationError] = useState("");
  const [goals, setGoals] = useState({ water: 8, exercise: 30, walking: 8000 });
  const [announcement, setAnnouncement] = useState("");
  const mountedRef = useRef(true);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const announce = useCallback((text: string) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(text));
  }, []);

  const transitionTo = useCallback((next: Screen) => {
    setTransitioning(true);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setScreen(next);
      setTransitioning(false);
      const stepNum = next === "welcome" ? 1 : next === "location" ? 2 : 3;
      const headings: Record<Screen, string> = {
        welcome: "Welcome to Daily Deen",
        location: "Where are you?",
        goals: "Set your daily goals",
      };
      announce(`Step ${stepNum} of 3: ${headings[next]}`);
    }, 200);
  }, [announce]);

  const completeOnboarding = useCallback(async (goalsOverride?: typeof goals) => {
    const g = goalsOverride ?? goals;
    try {
      await saveSettings({
        waterTarget: g.water,
        exerciseTarget: g.exercise,
        walkingTarget: g.walking,
        onboardingComplete: true,
      });
    } catch (err) {
      console.error("Failed to save onboarding:", err);
    }
    announce("Onboarding complete. Welcome to Daily Deen.");
    router.push("/");
  }, [router, goals, announce]);

  const handleEnableLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Location not available on this device.");
      return;
    }

    setLocationStatus("loading");
    announce("Detecting location...");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      if (!mountedRef.current) return;

      await saveSettings({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      announce("Location access granted");
      setLocationStatus("idle");
      transitionTo("goals");
    } catch (err) {
      if (!mountedRef.current) return;
      const msg = err instanceof GeolocationPositionError
        ? err.code === 1
          ? "Location access denied. You can enter a city manually."
          : "Couldn't detect your location. Check your connection or enter a city manually."
        : "Couldn't detect your location. Check your connection or enter a city manually.";
      setLocationStatus(err instanceof GeolocationPositionError && err.code === 1 ? "denied" : "error");
      setLocationError(msg);
      announce(msg);
    }
  }, [transitionTo, announce]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape" && screen !== "welcome") {
      if (screen === "goals") {
        transitionTo("location");
      } else {
        transitionTo("welcome");
      }
    }
  }, [screen, transitionTo]);

  const screenIndex = screen === "welcome" ? 0 : screen === "location" ? 1 : 2;
  const canGoBack = screen !== "welcome";
  const showSkip = screen !== "welcome";

  const screenContent = (
    <>
      {/* Illustration */}
      <div
        style={{ marginBottom: "var(--space-10)" }}
        className="animate-[fadeIn_200ms_var(--ease-out)_forwards]"
        key={`illust-${screen}`}
      >
        {ILLUSTRATIONS[screen]}
      </div>

      {/* Heading */}
      <h1
        className="text-center text-foreground animate-[fadeIn_200ms_var(--ease-out)_50ms_forwards] opacity-0"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-h2)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-h2)",
          lineHeight: "var(--leading-h2)",
          maxWidth: "320px",
          marginBottom: "var(--space-3)",
        }}
        key={`heading-${screen}`}
      >
        {screen === "welcome"
          ? "Welcome to Daily Deen"
          : screen === "location"
            ? "Where are you?"
            : "Set your daily goals"}
      </h1>

      {/* Description */}
      <p
        className="text-center text-muted-foreground animate-[fadeIn_200ms_var(--ease-out)_100ms_forwards] opacity-0"
        style={{
          fontSize: "var(--text-body)",
          lineHeight: "var(--leading-body)",
          maxWidth: "48ch",
          marginBottom: "var(--space-12)",
        }}
        key={`desc-${screen}`}
      >
        {screen === "welcome"
          ? "Build consistent spiritual habits with daily prayer times, journaling, and mindful tracking."
          : screen === "location"
            ? "We use your location to calculate accurate prayer times for your area. Your location is never shared."
            : "Choose targets that feel right for you. You can always adjust these later in Settings."}
      </p>

      {/* Screen-specific content */}
      {screen === "goals" && (
        <div
          className="flex flex-col gap-4 w-full animate-[fadeIn_200ms_var(--ease-out)_150ms_forwards] opacity-0"
          style={{ maxWidth: "280px", marginBottom: "var(--space-8)" }}
          key="goals-content"
        >
          {([
            { key: "water" as const, label: "Water", unit: "cups", min: 1, max: 20, step: 1 },
            { key: "exercise" as const, label: "Exercise", unit: "min", min: 5, max: 180, step: 5 },
            { key: "walking" as const, label: "Walking", unit: "steps", min: 1000, max: 30000, step: 500 },
          ]).map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Decrease ${item.label}`}
                  onClick={() => setGoals((p) => ({ ...p, [item.key]: Math.max(item.min, p[item.key] - item.step) }))}
                  disabled={goals[item.key] <= item.min}
                  className="flex items-center justify-center rounded transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:text-border"
                  style={{ width: "32px", height: "32px", fontSize: "14px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={goals[item.key]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!isNaN(v)) setGoals((p) => ({ ...p, [item.key]: Math.max(item.min, Math.min(item.max, v)) }));
                  }}
                  min={item.min}
                  max={item.max}
                  aria-label={`${item.label} target (${item.unit})`}
                  className="rounded-lg border border-input bg-background px-3 text-foreground text-center outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
                  style={{ height: "44px", width: "80px", fontSize: "var(--text-body)", fontFamily: "var(--font-mono)" }}
                />
                <button
                  type="button"
                  aria-label={`Increase ${item.label}`}
                  onClick={() => setGoals((p) => ({ ...p, [item.key]: Math.min(item.max, p[item.key] + item.step) }))}
                  disabled={goals[item.key] >= item.max}
                  className="flex items-center justify-center rounded transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:text-border"
                  style={{ width: "32px", height: "32px", fontSize: "14px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
                >
                  +
                </button>
                <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", minWidth: "40px" }}>
                  {item.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Location error message */}
      {screen === "location" && (locationStatus === "error" || locationStatus === "denied") && (
        <p className="text-center text-muted-foreground animate-[fadeIn_200ms_var(--ease-out)_forwards] opacity-0" style={{ fontSize: "var(--text-body-sm)", maxWidth: "32ch", marginBottom: "var(--space-6)" }} key="loc-error">
          {locationError}
        </p>
      )}

      {/* Primary CTA */}
      <button
        type="button"
        onClick={() => {
          if (screen === "welcome") {
            transitionTo("location");
          } else if (screen === "location") {
            handleEnableLocation();
          } else {
            completeOnboarding();
          }
        }}
        disabled={locationStatus === "loading"}
        className="w-full rounded-lg bg-primary px-6 text-primary-foreground transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-primary/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary/90 disabled:opacity-80 animate-[fadeIn_200ms_var(--ease-out)_150ms_forwards] opacity-0"
        style={{
          height: "var(--space-12)",
          fontSize: "var(--text-body)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-wide)",
          maxWidth: "320px",
        }}
        key="primary-cta"
      >
        {screen === "welcome"
          ? "Get started"
          : screen === "location"
            ? locationStatus === "loading" ? "Setting up..." : "Enable location"
            : "Start your day"}
      </button>

      {/* Secondary CTA */}
      <button
        type="button"
        onClick={() => {
          if (screen === "welcome") {
            completeOnboarding();
          } else if (screen === "location") {
            setLocationStatus("idle");
            setLocationError("");
            transitionTo("goals");
          } else {
            completeOnboarding();
          }
        }}
        className="mt-3 rounded-lg bg-transparent px-6 text-muted-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring animate-[fadeIn_200ms_var(--ease-out)_200ms_forwards] opacity-0"
        style={{
          height: "44px",
          fontSize: "var(--text-body-sm)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-wide)",
          maxWidth: "320px",
          width: "100%",
        }}
        key="secondary-cta"
      >
        {screen === "welcome"
          ? "I already know my way"
          : screen === "location"
            ? "Enter city manually"
            : "Use defaults"}
      </button>
    </>
  );

  return (
    <div
      className="flex min-h-dvh flex-col items-center paper-texture"
      onKeyDown={handleKeyDown}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to content
      </a>

      {/* Screen reader announcements */}
      <div role="status" aria-live="assertive" className="sr-only">{announcement}</div>

      {/* Back button */}
      {canGoBack && (
        <div className="fixed top-0 left-0 z-10" style={{ padding: "var(--space-3) var(--space-5)" }}>
          <button
            type="button"
            aria-label="Go back"
            onClick={() => {
              if (screen === "goals") {
                transitionTo("location");
              } else {
                transitionTo("welcome");
              }
            }}
            className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Main content */}
      <main
        id="content"
        className="flex flex-1 flex-col items-center justify-center"
        style={{
          padding: "var(--space-5)",
          paddingTop: "96px",
          paddingBottom: "var(--space-12)",
          maxWidth: "var(--content-narrow)",
          width: "100%",
        }}
      >
        <div
          className="flex flex-col items-center"
          style={{ opacity: transitioning ? 0 : 1, transition: "opacity 200ms var(--ease-out)" }}
        >
          {screenContent}
        </div>
      </main>

      {/* Bottom controls */}
      <div
        className="flex w-full items-center justify-between"
        style={{
          padding: "var(--space-5)",
          paddingBottom: "var(--space-12)",
          maxWidth: "var(--content-narrow)",
        }}
      >
        {/* Progress dots */}
        <nav aria-label="Onboarding progress">
          <ol className="flex items-center" style={{ gap: "var(--space-2)" }}>
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <span
                  className="block rounded-full"
                  style={{
                    width: "8px",
                    height: "8px",
                    background: i === screenIndex ? "var(--dd-dusk-teal)" : "var(--border)",
                  }}
                  aria-label={`Step ${i + 1} of 3`}
                />
              </li>
            ))}
          </ol>
        </nav>

        {/* Skip button */}
        {showSkip && (
          <button
            type="button"
            onClick={() => completeOnboarding()}
            aria-label="Skip onboarding"
            className="text-muted-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{
              fontSize: "var(--text-body-sm)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-wide)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "var(--space-3) var(--space-4)",
            }}
          >
            Skip →
          </button>
        )}
      </div>
    </div>
  );
}
