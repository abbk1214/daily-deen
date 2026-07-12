"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  MapPin,
  WifiOff,
  Search,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/use-settings";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useLocation } from "@/hooks/use-location";
import { generateFullCSV, downloadCSV, downloadJSON } from "@/lib/export-utils";
import type { PrayerAdjustments } from "@/lib/db";

/* ─── Constants ─── */

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
const PRAYER_KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

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

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
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
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
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

function LinkRow({
  label,
  onClick,
  destructive,
  icon,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
  icon?: React.ReactNode;
}) {
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
      {icon ?? <ChevronRight size={16} strokeWidth={1.5} className="text-muted-foreground" />}
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
      <span
        className="text-foreground capitalize"
        style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, minWidth: "80px" }}
      >
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
  const {
    settings,
    loading,
    update,
    updateImmediate,
    exportData,
    importData,
    clearAll,
  } = useSettings();

  const {
    loading: locationLoading,
    error: locationError,
    permission: locationPermission,
    city,
    country,
    latitude,
    longitude,
    timezone: locationTimezone,
    locationUpdatedAt,
    accuracy,
    isManualOverride,
    isOnline: locationOnline,
    retryCount,
    detectLocation,
    retry: retryLocation,
    searchCity,
    setManualCoordinates,
    clearManualOverride,
  } = useLocation();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOnline = useOnlineStatus();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  /* ── Geolocation ── */
  const handleGeolocation = useCallback(async () => {
    const success = await detectLocation();
    showToast(success ? "Location updated" : "Failed to detect location");
  }, [detectLocation, showToast]);

  /* ── Manual coordinates ── */
  const handleManualCoordinateSubmit = useCallback(async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      showToast("Invalid coordinates");
      return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      showToast("Coordinates out of range");
      return;
    }
    await setManualCoordinates(lat, lng);
    setManualLat("");
    setManualLng("");
    setShowManualInput(false);
    showToast("Location updated manually");
  }, [manualLat, manualLng, setManualCoordinates, showToast]);

  /* ── City search ── */
  const handleCitySearch = useCallback(async () => {
    if (!citySearch.trim()) return;
    await searchCity(citySearch.trim());
    setCitySearch("");
    showToast("Location updated");
  }, [citySearch, searchCity, showToast]);

  /* ── Export ── */
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const handleExport = useCallback(async () => {
    try {
      const data = await exportData();
      const dateStr = new Date().toISOString().split("T")[0];
      if (exportFormat === 'csv') {
        const csv = generateFullCSV(data);
        downloadCSV(csv, `daily-deen-backup-${dateStr}.csv`);
      } else {
        downloadJSON(data, `daily-deen-backup-${dateStr}.json`);
      }
      showToast(`Data exported as ${exportFormat.toUpperCase()}`);
    } catch {
      showToast("Export failed");
    }
  }, [exportData, showToast, exportFormat]);

  /* ── Import ── */
  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.version || !data.prayers || !data.habits || !data.settings) {
          showToast("Invalid backup file");
          return;
        }
        await importData(data);
        showToast("Data imported successfully");
      } catch {
        showToast("Failed to import — invalid file");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [importData, showToast],
  );

  /* ── Clear ── */
  const handleClear = useCallback(async () => {
    await clearAll();
    setShowClearConfirm(false);
    showToast("All data cleared");
  }, [clearAll, showToast]);

  /* ── Prayer adjustments ── */
  const adjustments = settings.prayerAdjustments;

  const updateAdjustment = useCallback(
    (prayer: keyof PrayerAdjustments, value: number) => {
      updateImmediate({
        prayerAdjustments: { ...adjustments, [prayer]: value },
      });
    },
    [adjustments, updateImmediate],
  );

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col paper-texture">
        <header
          className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 backdrop-blur-md"
          style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}
        >
          <Link
            href="/"
            aria-label="Back to home"
            className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </Link>
          <span className="ml-3 text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
            Settings
          </span>
        </header>
        <main className="flex flex-1 items-center justify-center pb-24 lg:pb-8" style={{ maxWidth: "var(--content-narrow)", margin: "0 auto", width: "100%" }}>
          <div className="animate-pulse rounded-lg" style={{ width: "100%", height: "200px", background: "var(--muted)" }} aria-busy="true" aria-label="Loading settings" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      <a
        href="#settings"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to settings
      </a>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Import backup file"
        tabIndex={-1}
      />

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-background shadow-lg"
          style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
        >
          {toast}
        </div>
      )}

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
        <h1 className="ml-3 text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
          Settings
        </h1>
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
        {/* ─── General ─── */}
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
          <div style={{ padding: "var(--space-4) 0" }}>
            <div className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", marginBottom: "var(--space-2)" }}>
              Export format
            </div>
            <div className="flex gap-2">
              {(["json", "csv"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{
                    borderColor: exportFormat === fmt ? "var(--dd-dusk-teal)" : "var(--border)",
                    backgroundColor: exportFormat === fmt ? "var(--dd-dusk-teal)" : "transparent",
                    color: exportFormat === fmt ? "var(--primary-foreground)" : "var(--foreground)",
                    textTransform: "uppercase",
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
          <LinkRow label={`Export data (${exportFormat.toUpperCase()})`} onClick={handleExport} icon={<Download size={16} strokeWidth={1.5} className="text-muted-foreground" />} />
          <Divider />
          <LinkRow label="Import backup" onClick={handleImport} icon={<Upload size={16} strokeWidth={1.5} className="text-muted-foreground" />} />
          <Divider />
          <LinkRow label="Clear all data" onClick={() => setShowClearConfirm(true)} destructive />
        </section>

        {/* ─── Prayer Calculation ─── */}
        <section aria-labelledby="section-prayer" style={{ marginBottom: "var(--space-12)" }}>
          <SectionHeading id="section-prayer">Prayer Calculation</SectionHeading>
          <SettingRow label="Calculation method" description="Determines prayer time benchmarks">
            <Select value={settings.calculationMethod} onChange={(calculationMethod) => update({ calculationMethod })} options={CALCULATION_METHODS} label="Calculation method" />
          </SettingRow>
          <Divider />
          <SettingRow label="School of jurisprudence" description="Affects Asr calculation">
            <div role="radiogroup" aria-label="School of jurisprudence" className="flex gap-3">
              {SCHOOLS.map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="school"
                    value={s}
                    checked={settings.school === s}
                    onChange={() => updateImmediate({ school: s })}
                    className="accent-[var(--dd-dusk-teal)]"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </SettingRow>
          <Divider />
          <div style={{ padding: "var(--space-4) 0" }}>
            <div
              className="text-muted-foreground"
              style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", marginBottom: "var(--space-2)" }}
            >
              Adjustments
            </div>
            <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
              {PRAYER_KEYS.map((prayer) => (
                <PrayerAdjustor
                  key={prayer}
                  prayer={prayer}
                  value={adjustments[prayer]}
                  onChange={(v) => updateAdjustment(prayer, v)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Location ─── */}
        <section aria-labelledby="section-location" style={{ marginBottom: "var(--space-12)" }}>
          <SectionHeading id="section-location">Location</SectionHeading>

          {/* Current location display */}
          <SettingRow label="Current location" description="Your city for prayer time calculation">
            <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", textAlign: "right", maxWidth: "160px" }}>
              {latitude === 0 && longitude === 0
                ? "Not set"
                : city && country
                  ? `${city}, ${country}`
                  : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
            </span>
          </SettingRow>
          <Divider />

          {/* Manual override indicator */}
          {isManualOverride && (
            <>
              <SettingRow label="Source" description="Location was set manually">
                <span className="text-dusk-teal" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  Manual
                </span>
              </SettingRow>
              <Divider />
            </>
          )}

          {/* Offline state */}
          {!locationOnline && (
            <>
              <SettingRow label="Network" description="Connection status">
                <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: "var(--text-body-sm)" }}>
                  <WifiOff size={14} strokeWidth={1.5} />
                  Offline
                </span>
              </SettingRow>
              <Divider />
            </>
          )}

          {/* Permission denied state */}
          {locationPermission === "denied" && (
            <>
              <SettingRow label="GPS permission" description="Permission was denied">
                <span className="text-destructive" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  Denied
                </span>
              </SettingRow>
              <Divider />
            </>
          )}

          {/* Location details */}
          {locationUpdatedAt > 0 && (
            <>
              <SettingRow label="Last updated" description="When location was last refreshed">
                <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", textAlign: "right" }}>
                  {new Date(locationUpdatedAt).toLocaleString()}
                </span>
              </SettingRow>
              <Divider />
            </>
          )}
          {accuracy > 0 && (
            <>
              <SettingRow label="Accuracy" description="GPS accuracy radius">
                <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", textAlign: "right" }}>
                  ±{Math.round(accuracy)}m
                </span>
              </SettingRow>
              <Divider />
            </>
          )}
          {locationTimezone && (
            <>
              <SettingRow label="Timezone" description="Detected from location">
                <span className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", textAlign: "right" }}>
                  {locationTimezone}
                </span>
              </SettingRow>
              <Divider />
            </>
          )}

          {/* City search */}
          <div style={{ padding: "var(--space-4) 0" }}>
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500, letterSpacing: "var(--tracking-wide)", display: "block", marginBottom: "var(--space-2)" }}>
              Search city
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCitySearch(); }}
                placeholder="e.g. Makkah, Madinah"
                aria-label="Search city"
                className="flex-1 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
                style={{ height: "var(--space-10)", fontSize: "var(--text-body)", fontFamily: "var(--font-body)" }}
              />
              <button
                type="button"
                onClick={handleCitySearch}
                disabled={!citySearch.trim() || locationLoading || !locationOnline}
                className="flex items-center justify-center rounded-lg border border-input bg-background text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                style={{ width: "var(--space-10)", height: "var(--space-10)" }}
                aria-label="Search"
              >
                <Search size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <Divider />

          {/* GPS detection */}
          <SettingRow label="Use current location" description="Detect via GPS">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGeolocation}
                disabled={locationLoading || !locationOnline}
                className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                style={{ height: "var(--space-10)", fontSize: "var(--text-body-sm)", fontWeight: 500 }}
              >
                <MapPin size={16} strokeWidth={1.5} />
                {locationLoading ? "Detecting..." : "Use GPS"}
              </button>
              {latitude !== 0 && longitude !== 0 && (
                <button
                  type="button"
                  onClick={handleGeolocation}
                  disabled={locationLoading || !locationOnline}
                  className="flex items-center justify-center rounded-lg border border-input bg-background text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                  style={{ width: "var(--space-10)", height: "var(--space-10)" }}
                  aria-label="Refresh location"
                >
                  <RefreshCw size={16} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </SettingRow>

          {/* Error state with retry */}
          {locationError && (
            <div style={{ padding: "var(--space-2) 0" }}>
              <p className="text-destructive" style={{ fontSize: "var(--text-body-sm)", marginBottom: "var(--space-2)" }}>
                {locationError}
              </p>
              {locationOnline && locationPermission !== "denied" && (
                <button
                  type="button"
                  onClick={retryLocation}
                  disabled={locationLoading}
                  className="text-dusk-teal flex items-center gap-1 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:underline"
                  style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
                >
                  <RefreshCw size={14} strokeWidth={1.5} />
                  Retry{retryCount > 0 ? ` (${retryCount})` : ""}
                </button>
              )}
            </div>
          )}
          <Divider />

          {/* Manual coordinate override */}
          <div style={{ padding: "var(--space-4) 0" }}>
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-dusk-teal flex items-center gap-1 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:underline"
              style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
            >
              {showManualInput ? "Hide" : "Enter coordinates manually"}
            </button>
            {showManualInput && (
              <div className="flex flex-col gap-2" style={{ marginTop: "var(--space-3)" }}>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="Latitude (e.g. 21.4225)"
                    aria-label="Manual latitude"
                    step="0.0001"
                    min="-90"
                    max="90"
                    className="flex-1 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
                    style={{ height: "var(--space-10)", fontSize: "var(--text-body)", fontFamily: "var(--font-mono)" }}
                  />
                  <input
                    type="number"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="Longitude (e.g. 39.8262)"
                    aria-label="Manual longitude"
                    step="0.0001"
                    min="-180"
                    max="180"
                    className="flex-1 rounded-lg border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-ring focus:shadow-[var(--focus-ring)]"
                    style={{ height: "var(--space-10)", fontSize: "var(--text-body)", fontFamily: "var(--font-mono)" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleManualCoordinateSubmit}
                  disabled={locationLoading || !manualLat.trim() || !manualLng.trim()}
                  className="rounded-lg border border-input bg-background px-4 text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                  style={{ height: "var(--space-10)", fontSize: "var(--text-body-sm)", fontWeight: 500 }}
                >
                  Set Coordinates
                </button>
              </div>
            )}
          </div>

          {/* Clear manual override */}
          {isManualOverride && (
            <>
              <Divider />
              <LinkRow
                label="Resume automatic detection"
                onClick={clearManualOverride}
                icon={<RefreshCw size={16} strokeWidth={1.5} className="text-muted-foreground" />}
              />
            </>
          )}
        </section>

        {/* ─── Notifications ─── */}
        <section aria-labelledby="section-notifications" style={{ marginBottom: "var(--space-12)" }}>
          <SectionHeading id="section-notifications">Notifications</SectionHeading>
          <SettingRow label="Prayer reminders" description="Get notified before each prayer">
            <Toggle checked={settings.notificationsEnabled} onChange={(notificationsEnabled) => updateImmediate({ notificationsEnabled })} label="Prayer reminders" />
          </SettingRow>
          <Divider />
          <SettingRow label="Reminder offset" description="Minutes before prayer to notify">
            <Select value={String(settings.reminderOffset)} onChange={(v) => updateImmediate({ reminderOffset: Number(v) })} options={REMINDER_OFFSETS.map(String)} label="Reminder offset" />
          </SettingRow>
          <Divider />
          <SettingRow label="Adhan sound" description="Play the call to prayer">
            <Toggle checked={settings.adhanSound} onChange={(adhanSound) => updateImmediate({ adhanSound })} label="Adhan sound" />
          </SettingRow>
          <Divider />
          <SettingRow label="Vibrate" description="Vibrate with notification">
            <Toggle checked={settings.vibrate} onChange={(vibrate) => updateImmediate({ vibrate })} label="Vibrate" />
          </SettingRow>
          <Divider />
          <SettingRow label="Silent mode" description="Suppress notification sound and vibration">
            <Toggle checked={settings.silentMode ?? false} onChange={(silentMode) => updateImmediate({ silentMode })} label="Silent mode" />
          </SettingRow>
        </section>

        {/* ─── Compass ─── */}
        <section aria-labelledby="section-compass" style={{ marginBottom: "var(--space-12)" }}>
          <SectionHeading id="section-compass">Compass</SectionHeading>
          <SettingRow label="Show degrees" description="Display degree markers on compass">
            <Toggle checked={settings.compassShowDegrees ?? true} onChange={(compassShowDegrees) => updateImmediate({ compassShowDegrees })} label="Show degrees" />
          </SettingRow>
          <Divider />
          <SettingRow label="Auto calibration" description="Prompt for compass calibration">
            <Toggle checked={settings.compassAutoCalibration ?? true} onChange={(compassAutoCalibration) => updateImmediate({ compassAutoCalibration })} label="Auto calibration" />
          </SettingRow>
          <Divider />
          <SettingRow label="Smoothing" description="Compass smoothing level">
            <Select
              value={String(settings.compassSmoothing ?? 0.3)}
              onChange={(v) => updateImmediate({ compassSmoothing: Number(v) })}
              options={["0.1", "0.3", "0.5", "0.7"]}
              label="Smoothing"
            />
          </SettingRow>
        </section>

        {/* ─── Daily Targets ─── */}
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

        {/* ─── Calendar ─── */}
        <section aria-labelledby="section-calendar" style={{ marginBottom: "var(--space-12)" }}>
          <SectionHeading id="section-calendar">Calendar</SectionHeading>
          <SettingRow label="Calendar type" description="Show Gregorian or Hijri dates in the calendar">
            <div role="radiogroup" aria-label="Calendar type" className="flex gap-3">
              {(["gregorian", "hijri"] as const).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="calendarType"
                    value={t}
                    checked={settings.calendarType === t}
                    onChange={() => updateImmediate({ calendarType: t })}
                    className="accent-[var(--dd-dusk-teal)]"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span className="capitalize">{t === "gregorian" ? "Gregorian" : "Hijri"}</span>
                </label>
              ))}
            </div>
          </SettingRow>
        </section>

        {/* ─── Appearance ─── */}
        <section aria-labelledby="section-appearance" style={{ marginBottom: "var(--space-12)" }}>
          <SectionHeading id="section-appearance">Appearance</SectionHeading>
          <SettingRow label="Theme" description="Light or dark mode">
            <div role="radiogroup" aria-label="Theme" className="flex gap-3">
              {THEMES.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="theme"
                    value={t}
                    checked={settings.theme === t}
                    onChange={() => updateImmediate({ theme: t })}
                    className="accent-[var(--dd-dusk-teal)]"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
          </SettingRow>
          <Divider />
          <SettingRow label="Paper texture" description="Subtle grain overlay on backgrounds">
            <Toggle checked={settings.paperTexture} onChange={(paperTexture) => updateImmediate({ paperTexture })} label="Paper texture" />
          </SettingRow>
          <Divider />
          <SettingRow label="Text size" description="Base font size adjustment">
            <Select value={settings.textSize} onChange={(textSize) => updateImmediate({ textSize })} options={TEXT_SIZES} label="Text size" />
          </SettingRow>
        </section>

        {/* ─── About ─── */}
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
      </main>

      {/* ─── Clear data confirmation modal ─── */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowClearConfirm(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowClearConfirm(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            className="rounded-lg bg-background p-6"
            style={{ boxShadow: "var(--shadow-lg)", maxWidth: "400px", width: "90%" }}
          >
            <h3
              id="clear-dialog-title"
              className="text-foreground"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: 600, marginBottom: "var(--space-2)" }}
            >
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
                onClick={handleClear}
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
