"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Upload,
  MapPin,
  Bell,
  Palette,
  Database,
  Moon,
  Sun,
  Smartphone,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/use-settings";
import { useLocation } from "@/hooks/use-location";
import { downloadJSON } from "@/lib/export-utils";
import { getToday } from "@/lib/utils";

const CALCULATION_METHODS: { label: string; value: string }[] = [
  { label: "Muslim World League", value: "MuslimWorldLeague" },
  { label: "ISNA", value: "NorthAmerica" },
  { label: "Egyptian", value: "Egyptian" },
  { label: "Umm Al-Qura", value: "UmmAlQura" },
  { label: "Karachi", value: "Karachi" },
  { label: "Tehran", value: "Tehran" },
  { label: "Dubai", value: "Dubai" },
  { label: "Turkey", value: "Turkey" },
];

const SCHOOLS = ["Shafi'i", "Hanafi"] as const;
const THEMES = ["system", "light", "dark"] as const;

export default function SettingsPage() {
  const { settings, update, updateImmediate } = useSettings();
  const { city, country, detectLocation } = useLocation();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(async () => {
    const { exportDatabase } = await import("@/lib/db");
    const data = await exportDatabase();
    downloadJSON(data, `dailydeen-${getToday()}.json`);
  }, []);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const { importDatabase } = await import("@/lib/db");
      await importDatabase(data);
      window.location.reload();
    } catch {
      alert("Failed to import. Please check the file format.");
    }
  }, []);

  const handleClearAll = useCallback(async () => {
    const { clearAllData } = await import("@/lib/db");
    await clearAllData();
    window.location.reload();
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
          Settings
        </h1>
      </header>

      <main
        className="flex-1 pb-24 lg:pb-8"
        style={{
          padding: "var(--space-5)",
          maxWidth: "var(--content-narrow)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      >
        {/* Profile */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
            Profile
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Your name</p>
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>Used in greetings</p>
              </div>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Enter name"
                className="w-32 rounded-lg border border-border bg-background px-3 py-1.5 text-right text-foreground focus:border-dusk-teal focus:outline-none"
                style={{ fontSize: "var(--text-body-sm)" }}
              />
            </div>
          </div>
        </section>

        {/* Prayer */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
            Prayer
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Calculation method</p>
              </div>
              <select
                value={settings.calculationMethod}
                onChange={(e) => update({ calculationMethod: e.target.value })}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-foreground focus:border-dusk-teal focus:outline-none"
                style={{ fontSize: "var(--text-body-sm)" }}
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>School</p>
              </div>
              <div className="flex gap-2">
                {SCHOOLS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateImmediate({ school: s })}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      settings.school === s
                        ? "bg-dusk-teal text-white"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Link
              href="/settings/prayer"
              className="flex items-center justify-between p-4 transition-colors hover:bg-secondary"
            >
              <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Prayer time adjustments</p>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </section>

        {/* Location */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
            Location
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                    {city && country ? `${city}, ${country}` : "No location set"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={detectLocation}
                className="rounded-lg bg-dusk-teal px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-dusk-teal/90"
              >
                Detect
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
            Notifications
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Prayer reminders</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.notificationsEnabled}
                aria-label="Prayer reminders"
                onClick={() => updateImmediate({ notificationsEnabled: !settings.notificationsEnabled })}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  settings.notificationsEnabled ? "bg-dusk-teal" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    settings.notificationsEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
            Appearance
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Palette size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Theme</p>
              </div>
              <div className="flex gap-1">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateImmediate({ theme: t })}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      settings.theme === t
                        ? "bg-dusk-teal text-white"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {t === "system" ? <Smartphone size={12} className="inline mr-1" /> : t === "light" ? <Sun size={12} className="inline mr-1" /> : <Moon size={12} className="inline mr-1" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
            Tools
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <Link
              href="/zakat"
              className="flex items-center justify-between p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <Calculator size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Zakat Calculator</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </section>

        {/* Data */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", textTransform: "uppercase" }}>
            Data
          </h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-between w-full p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <Download size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Export backup</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-between w-full p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <Upload size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Import backup</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            <Link
              href="/settings/backup"
              className="flex items-center justify-between p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <Database size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Advanced backup</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-foreground mb-2" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Delete all data</p>
            <p className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)" }}>
              This cannot be undone. Make sure you have a backup first.
            </p>
            {showClearConfirm ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-destructive/90"
                >
                  Confirm delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/80"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                Delete everything
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
