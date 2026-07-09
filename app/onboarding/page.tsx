"use client";

import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveSettings, DEFAULT_SETTINGS } from "@/lib/db";

type Screen = "welcome" | "location" | "goals";

const ILLUSTRATIONS = {
  welcome: (
    <svg
      width="120"
      height="120"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="text-muted-foreground"
    >
      <circle cx="40" cy="40" r="12" />
      <circle cx="44" cy="38" r="24" strokeDasharray="56 19" />
      <circle cx="36" cy="44" r="36" strokeDasharray="57 173" />
    </svg>
  ),
  location: (
    <svg
      width="120"
      height="120"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="text-muted-foreground"
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
      width="120"
      height="120"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="text-muted-foreground"
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
  const [goals, setGoals] = useState({
    water: 8,
    exercise: 30,
    walking: 8000,
  });

  const completeOnboarding = useCallback(async () => {
    try {
      await saveSettings({
        ...DEFAULT_SETTINGS,
        waterTarget: goals.water,
        exerciseTarget: goals.exercise,
        walkingTarget: goals.walking,
      });
    } catch (error) {
      console.error("Failed to save onboarding:", error);
    }
    router.push("/");
  }, [router, goals]);

  const handleEnableLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      // No geolocation available, move to next screen
      setScreen("goals");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        },
      );

      await saveSettings({
        ...DEFAULT_SETTINGS,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        waterTarget: goals.water,
        exerciseTarget: goals.exercise,
        walkingTarget: goals.walking,
      });

      setScreen("goals");
    } catch (error) {
      console.error("Geolocation error:", error);
      // Still move forward even if GPS fails
      setScreen("goals");
    }
  }, [goals]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && screen !== "welcome") {
        if (screen === "goals") {
          setScreen("location");
        } else {
          setScreen("welcome");
        }
      }
    },
    [screen],
  );

  const screenIndex = screen === "welcome" ? 0 : screen === "location" ? 1 : 2;
  const canGoBack = screen !== "welcome";
  const showSkip = screen !== "welcome";

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

      {/* Back button */}
      {canGoBack && (
        <div className="fixed top-0 left-0 z-10" style={{ padding: "var(--space-3) var(--space-5)" }}>
          <button
            type="button"
            aria-label="Go back"
            onClick={() => setScreen(screen === "goals" ? "location" : "welcome")}
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
          maxWidth: "var(--content-narrow)",
          width: "100%",
        }}
      >
        {/* Illustration */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          {ILLUSTRATIONS[screen]}
        </div>

        {/* Heading */}
        <h1
          className="text-center text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h2)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-h2)",
            lineHeight: "var(--leading-h2)",
            maxWidth: "320px",
            marginBottom: "var(--space-3)",
          }}
        >
          {screen === "welcome"
            ? "Welcome to Daily Deen"
            : screen === "location"
              ? "Where are you?"
              : "Set your daily goals"}
        </h1>

        {/* Description */}
        <p
          className="text-center text-muted-foreground"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            maxWidth: "48ch",
            marginBottom: "var(--space-12)",
          }}
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
            className="flex flex-col gap-4 w-full"
            style={{
              maxWidth: "280px",
              marginBottom: "var(--space-8)",
            }}
          >
            {[
              { key: "water" as const, label: "Water", unit: "cups", min: 1, max: 20, step: 1 },
              { key: "exercise" as const, label: "Exercise", unit: "min", min: 5, max: 180, step: 5 },
              { key: "walking" as const, label: "Walking", unit: "steps", min: 1000, max: 30000, step: 500 },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between"
              >
                <span
                  className="text-foreground"
                  style={{
                    fontSize: "var(--text-body-sm)",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={goals[item.key]}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!isNaN(v)) {
                        setGoals((prev) => ({
                          ...prev,
                          [item.key]: Math.max(item.min, Math.min(item.max, v)),
                        }));
                      }
                    }}
                    min={item.min}
                    max={item.max}
                    aria-label={`${item.label} target`}
                    className="rounded-lg border border-input bg-background px-3 text-foreground text-center outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
                    style={{
                      height: "44px",
                      width: "80px",
                      fontSize: "var(--text-body)",
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <span
                    className="text-muted-foreground"
                    style={{
                      fontSize: "var(--text-body-sm)",
                      minWidth: "40px",
                    }}
                  >
                    {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => {
            if (screen === "welcome") {
              setScreen("location");
            } else if (screen === "location") {
              handleEnableLocation();
            } else {
              completeOnboarding();
            }
          }}
          className="w-full rounded-lg bg-primary px-6 text-primary-foreground transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-primary/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary/90"
          style={{
            height: "var(--space-12)",
            fontSize: "var(--text-body)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
            maxWidth: "320px",
          }}
        >
          {screen === "welcome"
            ? "Get started"
            : screen === "location"
              ? "Enable location"
              : "Start your day"}
        </button>

        {/* Secondary CTA */}
        <button
          type="button"
          onClick={() => {
            if (screen === "welcome") {
              completeOnboarding();
            } else if (screen === "location") {
              setScreen("goals");
            } else {
              completeOnboarding();
            }
          }}
          className="mt-3 rounded-lg bg-transparent px-6 text-muted-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{
            height: "44px",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
            maxWidth: "320px",
            width: "100%",
          }}
        >
          {screen === "welcome"
            ? "I already know my way"
            : screen === "location"
              ? "Enter city manually"
              : "Use defaults"}
        </button>
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
          <ol className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <span
                  className="block rounded-full"
                  style={{
                    width: "8px",
                    height: "8px",
                    background:
                      i === screenIndex
                        ? "var(--dd-dusk-teal)"
                        : "var(--border)",
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
            onClick={completeOnboarding}
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
