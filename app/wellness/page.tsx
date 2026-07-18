"use client";

import { useState } from "react";
import { ArrowLeft, Droplets, Dumbbell, Smile, BedDouble } from "lucide-react";
import Link from "next/link";
import { MoodTracker } from "@/components/mood-tracker";
import { WaterTracker } from "@/components/water-tracker";
import { SleepLogger } from "@/components/sleep-logger";
import { ExerciseLogger } from "@/components/exercise-logger";

type Tab = "overview" | "mood" | "water" | "sleep" | "exercise";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "overview", label: "Overview", icon: Smile },
  { id: "mood", label: "Mood", icon: Smile },
  { id: "water", label: "Water", icon: Droplets },
  { id: "sleep", label: "Sleep", icon: BedDouble },
  { id: "exercise", label: "Exercise", icon: Dumbbell },
];

export default function WellnessPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="flex min-h-dvh flex-col">
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
          Wellness
        </h1>
      </header>

      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Wellness sections"
        className="flex gap-1 p-2 border-b border-border overflow-x-auto"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`wellness-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
            style={{
              background: activeTab === tab.id
                ? "color-mix(in srgb, var(--dusk-teal) 15%, var(--card))"
                : "transparent",
              color: activeTab === tab.id ? "var(--dusk-teal)" : "var(--muted-foreground)",
              fontSize: "var(--text-caption)",
              fontWeight: 500,
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <main
        id="wellness-overview"
        role="tabpanel"
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
        {activeTab === "overview" && (
          <>
            <MoodTracker />
            <WaterTracker />
            <SleepLogger />
            <ExerciseLogger />
          </>
        )}
        {activeTab === "mood" && <MoodTracker />}
        {activeTab === "water" && <WaterTracker />}
        {activeTab === "sleep" && <SleepLogger />}
        {activeTab === "exercise" && <ExerciseLogger />}
      </main>
    </div>
  );
}
