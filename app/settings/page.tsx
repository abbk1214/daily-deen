"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, WifiOff } from "lucide-react";
import Link from "next/link";
import db, { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/lib/db";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { AppSettings } from "@/lib/db";

const CALCULATION_METHODS: { label: string; value: string }[] = [
  { label: "Muslim World League", value: "MuslimWorldLeague" },
  { label: "Islamic Society of North America", value: "NorthAmerica" },
  { label: "Egyptian General Authority of Survey", value: "Egyptian" },
  { label: "Umm Al-Qura University, Makkah", value: "UmmAlQura" },
  { label: "University of Islamic Sciences, Karachi", value: "Karachi" },
  { label: "Institute of Geophysics, University of Tehran", value: "Tehran" },
  { label: "Gulf Region", value: "Dubai" },
  { label: "Kuwait", value: "Kuwait" },
  { label: "Qatar", value: "Qatar" },
  { label: "Singapore", value: "Singapore" },
  { label: "Turkey", value: "Turkey" },
  { label: "Other", value: "Other" },
];

const SCHOOLS = ["Shafi'i", "Hanafi"] as const;
const REMINDER_OFFSETS = [5, 10, 15, 20, 30] as const;
const THEMES = ["system", "light", "dark"] as const;
const TEXT_SIZES = ["small", "default", "large"] as const;
const PRAYERS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

function applyTheme(theme: string) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

function applyTextSize(size: string) {
  const root = document.documentElement;
  if (size === "small") {
    root.style.fontSize = "14px";
  } else if (size === "large") {
    root.style.fontSize = "18px";
  } else {
    root.style.fontSize = "";
  }
}

function applyPaperTexture(enabled: boolean) {
  document.body.classList.toggle("paper-texture", enabled);
}

/* ─── Reusable Controls ─── */

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "var(--space-4) 0", minHeight: "48px" }}
    >
      <div className="flex-1" style={{ marginRight: "var(--space-4)" }}>
        <div className="text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
          {label}
        </div>
        {description && (
          <div className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", marginTop: "var(--space-1)" }}>
            {description}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-border" />;
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-foreground scroll-mt-24"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-h3)",
        fontWeight: 600,
        letterSpacing: "var(--tracking-h3)",
        marginBottom: "var(--space-4)",
      }}
    >
      {children}
    </h2>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      style={{ width: "44px", height: "24px", background: checked ? "var(--dd-dusk-teal)" : "var(--muted)" }}
    >
      <span
        className="inline-block rounded-full shadow-sm transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]"
        style={{
          width: "16px",
          height: "16px",
          background: checked ? "var(--primary-foreground)" : "var(--muted-foreground)",
          transform: `translateX(${checked ? "24px" : "4px"})`,
        }}
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly (string | { label: string; value: string })[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none rounded-lg border border-input bg-background pl-3 pr-8 text-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
        style={{ height: "var(--space-10)", fontSize: "var(--text-body)", fontFamily: "var(--font-body)", minWidth: "120px" }}
      >
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 1,
  max = 999,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
      }}
      min={min}
      max={max}
      aria-label={label}
      className="rounded-lg border border-input bg-background px-3 text-foreground text-center outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
      style={{ height: "var(--space-10)", width: "80px", fontSize: "var(--text-body)", fontFamily: "var(--font-mono)" }}
    />
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className="rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
      style={{ height: "var(--space-10)", fontSize: "var(--text-body)", fontFamily: "var(--font-body)", width: "100%", maxWidth: "240px" }}
    />
  );
}

function LinkRow({ label, onClick, destructive }: { label: string; onClick: () => void; destructive?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      style={{ padding: "var(--space-4) 0", minHeight: "48px" }}
    >
      <span
        className={destructive ? "text-destructive" : "text-dusk-teal"}
        style={{ fontSize: "var(--text-body)", fontWeight: 500 }}
      >
        {label}
      </span>
      <ChevronRight size={16} strokeWidth={1.5} className="text-muted-foreground" />
    </button>
  );
}

function PrayerAdjustor({
  prayer,
  value,
  onChange,
}: {
  prayer: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between" style={{ minHeight: "32px" }}>
      <span className="text-foreground capitalize" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, minWidth: "80px" }}>
        {prayer}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Decrement ${prayer}`}
          onClick={() => onChange(Math.max(-30, value - 1))}
          className="flex items-center justify-center rounded transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:text-border"
          disabled={value <= -30}
          style={{ width: "28px", height: "28px", fontSize: "14px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
        >
          −
        </button>
        <span
          className="text-muted-foreground text-center"
          style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-sm)", width: "40px" }}
        >
          {value >= 0 ? `+${value}` : value} min
        </span>
        <button
          type="button"
          aria-label={`Increment ${prayer}`}
          onClick={() => onChange(Math.min(30, value + 1))}
          className="flex items-center justify-center rounded transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:text-border"
          disabled={value >= 30}
          style={{ width: "28px", height: "28px", fontSize: "14px", fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ─── Main Settings Page ─── */

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const mountedRef = useRef(true);
  const isOnline = useOnlineStatus();

  // Load settings
  useEffect(() => {
    mountedRef.current = true;

    async function load() {
      try {
        const saved = await getSettings();
        if (!mountedRef.current) return;
        if (saved) {
          setSettings((prev) => ({ ...prev, ...saved }));
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load settings:", err);
        if (mountedRef.current) setLoading(false);
      }
    }

    load();
    return () => { mountedRef.current = false; };
  }, []);

  // Apply theme on change
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Apply text size on change
  useEffect(() => {
    applyTextSize(settings.textSize);
  }, [settings.textSize]);

  // Apply paper texture on change
  useEffect(() => {
    applyPaperTexture(settings.paperTexture);
  }, [settings.paperTexture]);

  const update = useCallback(
    (partial: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        saveSettings({
          latitude: next.latitude,
          longitude: next.longitude,
          calculationMethod: next.calculationMethod,
          notificationsEnabled: next.notificationsEnabled,
          onboardingComplete: next.onboardingComplete,
          name: next.name,
          language: next.language,
          school: next.school,
          reminderOffset: next.reminderOffset,
          adhanSound: next.adhanSound,
          vibrate: next.vibrate,
          theme: next.theme,
          paperTexture: next.paperTexture,
          textSize: next.textSize,
          waterTarget: next.waterTarget,
          exerciseTarget: next.exerciseTarget,
          walkingTarget: next.walkingTarget,
        }).catch(console.error);
        return next;
      });
    },
    [],
  );

  const handleClearData = useCallback(async () => {
    try {
      await db.delete();
      window.location.reload();
    } catch (err) {
      console.error("Failed to clear data:", err);
    }
  }, []);

  const handleExportData = useCallback(() => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-deen-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col paper-texture">
        <header
          className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 backdrop-blur-md"
          style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}
        >
          <Link href="/" aria-label="Back to home" className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <ArrowLeft size={20} strokeWidth={1.5} />
          </Link>
          <span className="ml-3 text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>Settings</span>
        </header>
        <main className="flex flex-1 items-center justify-center pb-24 lg:pb-8" style={{ maxWidth: "var(--content-narrow)", margin: "0 auto", width: "100%" }}>
          <div className="animate-pulse rounded-lg" style={{ width: "100%", height: "200px", background: "var(--muted)" }} aria-busy="true" aria-label="Loading settings" />
        </main>
      </div>
    );
  }

  const content = (
    <>
      {/* General */}
      <section aria-labelledby="section-general" style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeading id="section-general">General</SectionHeading>
        <SettingRow label="Your name" description="Used in greetings and journal prompts">
          <TextInput value={settings.name} onChange={(name) => update({ name })} placeholder="Enter your name" label="Your name" />
        </SettingRow>
        <Divider />
        <SettingRow label="Language" description="Interface language">
          <Select value={settings.language} onChange={(language) => update({ language })} options={["English", "Arabic", "Urdu"]} label="Language" />
        </SettingRow>
        <Divider />
        <LinkRow label="Export data" onClick={handleExportData} />
        <Divider />
        <LinkRow label="Clear all data" onClick={() => setShowClearConfirm(true)} destructive />
      </section>

      {/* Prayer Calculation */}
      <section aria-labelledby="section-prayer" style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeading id="section-prayer">Prayer Calculation</SectionHeading>
        <SettingRow label="Calculation method" description="Determines prayer time benchmarks">
          <Select value={settings.calculationMethod} onChange={(calculationMethod) => update({ calculationMethod })} options={CALCULATION_METHODS} label="Calculation method" />
        </SettingRow>
        <Divider />
        <SettingRow label="School of jurisprudence" description="Affects Asr calculation">
          <div role="radiogroup" aria-label="School of jurisprudence" className="flex gap-3">
            {SCHOOLS.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                <input type="radio" name="school" value={s} checked={settings.school === s} onChange={() => update({ school: s })} className="accent-[var(--dd-dusk-teal)]" style={{ width: "16px", height: "16px" }} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </SettingRow>
        <Divider />
        <div style={{ padding: "var(--space-4) 0" }}>
          <div className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", marginBottom: "var(--space-2)" }}>
            Adjustments
          </div>
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            {PRAYERS.map((prayer) => (
              <PrayerAdjustor
                key={prayer}
                prayer={prayer}
                value={0}
                onChange={() => {}}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section aria-labelledby="section-location" style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeading id="section-location">Location</SectionHeading>
        <SettingRow label="Current location" description="Your city for prayer time calculation">
          <span className="text-muted-foreground" style={{ fontSize: "var(--text-body)" }}>
            {settings.latitude !== 0 || settings.longitude !== 0
              ? `${settings.latitude.toFixed(4)}, ${settings.longitude.toFixed(4)}`
              : "Not set"}
          </span>
        </SettingRow>
        <Divider />
        <SettingRow label="Manual location" description="Enter coordinates manually">
          <TextInput value={settings.latitude ? `${settings.latitude}` : ""} onChange={(v) => update({ latitude: Number(v) || 0 })} placeholder="Latitude" label="Latitude" />
        </SettingRow>
      </section>

      {/* Notifications */}
      <section aria-labelledby="section-notifications" style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeading id="section-notifications">Notifications</SectionHeading>
        <SettingRow label="Prayer reminders" description="Get notified before each prayer">
          <Toggle checked={settings.notificationsEnabled} onChange={(notificationsEnabled) => update({ notificationsEnabled })} label="Prayer reminders" />
        </SettingRow>
        <Divider />
        <SettingRow label="Reminder offset" description="Minutes before prayer to notify">
          <Select value={String(settings.reminderOffset)} onChange={(v) => update({ reminderOffset: Number(v) })} options={REMINDER_OFFSETS.map(String)} label="Reminder offset" />
        </SettingRow>
        <Divider />
        <SettingRow label="Adhan sound" description="Play the call to prayer">
          <Toggle checked={settings.adhanSound} onChange={(adhanSound) => update({ adhanSound })} label="Adhan sound" />
        </SettingRow>
        <Divider />
        <SettingRow label="Vibrate" description="Vibrate with notification">
          <Toggle checked={settings.vibrate} onChange={(vibrate) => update({ vibrate })} label="Vibrate" />
        </SettingRow>
      </section>

      {/* Daily Targets */}
      <section aria-labelledby="section-targets" style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeading id="section-targets">Daily Targets</SectionHeading>
        <SettingRow label="Water" description="Glasses of water per day">
          <div className="flex items-center gap-2">
            <NumberInput value={settings.waterTarget} onChange={(waterTarget) => update({ waterTarget })} min={1} max={20} label="Water target" />
            <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-sm)" }}>cups</span>
          </div>
        </SettingRow>
        <Divider />
        <SettingRow label="Exercise" description="Minutes of physical activity">
          <div className="flex items-center gap-2">
            <NumberInput value={settings.exerciseTarget} onChange={(exerciseTarget) => update({ exerciseTarget })} min={5} max={180} label="Exercise target" />
            <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-sm)" }}>min</span>
          </div>
        </SettingRow>
        <Divider />
        <SettingRow label="Walking" description="Daily step count">
          <div className="flex items-center gap-2">
            <NumberInput value={settings.walkingTarget} onChange={(walkingTarget) => update({ walkingTarget })} min={1000} max={30000} label="Walking target" />
            <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-sm)" }}>steps</span>
          </div>
        </SettingRow>
      </section>

      {/* Appearance */}
      <section aria-labelledby="section-appearance" style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeading id="section-appearance">Appearance</SectionHeading>
        <SettingRow label="Theme" description="Light or dark mode">
          <div role="radiogroup" aria-label="Theme" className="flex gap-3">
            {THEMES.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                <input type="radio" name="theme" value={t} checked={settings.theme === t} onChange={() => update({ theme: t })} className="accent-[var(--dd-dusk-teal)]" style={{ width: "16px", height: "16px" }} />
                <span className="capitalize">{t}</span>
              </label>
            ))}
          </div>
        </SettingRow>
        <Divider />
        <SettingRow label="Paper texture" description="Subtle grain overlay on backgrounds">
          <Toggle checked={settings.paperTexture} onChange={(paperTexture) => update({ paperTexture })} label="Paper texture" />
        </SettingRow>
        <Divider />
        <SettingRow label="Text size" description="Base font size adjustment">
          <Select value={settings.textSize} onChange={(textSize) => update({ textSize })} options={TEXT_SIZES} label="Text size" />
        </SettingRow>
      </section>

      {/* About */}
      <section aria-labelledby="section-about" style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeading id="section-about">About</SectionHeading>
        <SettingRow label="Version">
          <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono)" }}>1.0.0</span>
        </SettingRow>
        <Divider />
        <SettingRow label="Build">
          <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-mono-sm)" }}>2026.07.09</span>
        </SettingRow>
      </section>
    </>
  );

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      <a
        href="#settings"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to settings
      </a>

      {/* Offline banner */}
      {!isOnline && (
        <div role="alert" className="flex items-center justify-center gap-2 bg-dusk-teal text-accent-foreground" style={{ height: "var(--space-10)", fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
          <WifiOff size={16} strokeWidth={1.5} />
          Offline — settings saved locally
        </div>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 backdrop-blur-md" style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}>
        <Link href="/" aria-label="Back to home" className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="ml-3 text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>Settings</h1>
      </header>

      {/* Main content */}
      <main
        id="settings"
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          padding: "var(--space-5)",
          paddingBottom: "calc(var(--space-24) + env(safe-area-inset-bottom, 0px))",
          maxWidth: "var(--content-narrow)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      >
        {content}
      </main>

      {/* Clear data confirmation modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowClearConfirm(false); }}
          onKeyDown={(e) => { if (e.key === "Escape") setShowClearConfirm(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            className="rounded-lg bg-background p-6"
            style={{ boxShadow: "var(--shadow-lg)", maxWidth: "400px", width: "90%" }}
          >
            <h3 id="clear-dialog-title" className="text-foreground" style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
              Clear all data?
            </h3>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", marginBottom: "var(--space-6)" }}>
              This cannot be undone. Your journal entries, habits, and settings will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 rounded-lg border border-border bg-transparent px-4 text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                style={{ height: "var(--space-10)", fontSize: "var(--text-body-sm)", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="flex-1 rounded-lg bg-destructive px-4 text-destructive-foreground transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-destructive/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-destructive/80"
                style={{ height: "var(--space-10)", fontSize: "var(--text-body-sm)", fontWeight: 500 }}
              >
                Clear everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
