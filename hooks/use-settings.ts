"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSettings,
  saveSettings,
  resetSettings,
  exportDatabase,
  importDatabase,
  clearAllData,
  type AppSettings,
  type DatabaseExport,
} from "@/lib/db";

const DEBOUNCE_MS = 300;

/* ─── Side-effect appliers ─── */

function applyTheme(theme: string) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
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

function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<string | null> {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
    {
      signal,
      headers: { "User-Agent": "DailyDeen/1.0" },
    },
  )
    .then((r) => r.json())
    .then((data: { address?: { city?: string; town?: string; village?: string; state?: string; country?: string } }) => {
      const city =
        data.address?.city ?? data.address?.town ?? data.address?.village ?? "";
      const country = data.address?.country ?? "";
      if (city && country) return `${city}, ${country}`;
      if (country) return country;
      return null;
    })
    .catch(() => null);
}

/* ─── Hook return type ─── */

export interface UseSettingsReturn {
  settings: AppSettings;
  loading: boolean;
  update: (partial: Partial<Omit<AppSettings, "id">>) => void;
  updateImmediate: (partial: Partial<Omit<AppSettings, "id">>) => void;
  reset: () => Promise<void>;
  refresh: () => Promise<void>;
  exportData: () => Promise<DatabaseExport>;
  importData: (data: DatabaseExport) => Promise<void>;
  clearAll: () => Promise<void>;
  locationLabel: string;
}

/* ─── Hook ─── */

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState("");

  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Partial<Omit<AppSettings, "id">> | null>(null);
  const geocodeAbortRef = useRef<AbortController | null>(null);
  const pendingWriteRef = useRef<AppSettings | null>(null);
  const prevLocationRef = useRef<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  /* ── Load on mount ── */
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    getSettings()
      .then((s) => {
        if (cancelled || !mountedRef.current) return;
        setSettings(s);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        if (mountedRef.current) setLoading(false);
      });

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, []);

  /* ── Apply theme on change + listen for system preference ── */
  useEffect(() => {
    applyTheme(settings.theme);

    if (settings.theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [settings.theme]);

  /* ── Apply text size on change ── */
  useEffect(() => {
    applyTextSize(settings.textSize);
  }, [settings.textSize]);

  /* ── Apply paper texture on change ── */
  useEffect(() => {
    applyPaperTexture(settings.paperTexture);
  }, [settings.paperTexture]);

  /* ── Reverse geocode when location changes ── */
  useEffect(() => {
    geocodeAbortRef.current?.abort();

    const prev = prevLocationRef.current;
    const changed =
      prev.lat !== settings.latitude || prev.lng !== settings.longitude;
    prevLocationRef.current = { lat: settings.latitude, lng: settings.longitude };

    if (settings.latitude === 0 && settings.longitude === 0) {
      if (changed) setLocationLabel("");
      return;
    }

    // Clear label immediately when location changes to indicate loading
    if (changed) setLocationLabel("");

    const controller = new AbortController();
    geocodeAbortRef.current = controller;

    reverseGeocode(settings.latitude, settings.longitude, controller.signal)
      .then((label) => {
        if (!mountedRef.current || controller.signal.aborted) return;
        setLocationLabel(label ?? "");
      })
      .catch(() => {
        if (!mountedRef.current || controller.signal.aborted) return;
        setLocationLabel("");
      });

    return () => {
      controller.abort();
    };
  }, [settings.latitude, settings.longitude]);

  /* ── Cleanup timers and abort on unmount ── */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      geocodeAbortRef.current?.abort();
    };
  }, []);

  /* ── Flush pending writes on unmount ── */
  useEffect(() => {
    return () => {
      if (pendingRef.current && pendingWriteRef.current) {
        saveSettings(pendingRef.current).catch(console.error);
      }
    };
  }, []);

  /* ── Debounced write ── */
  const flushDebounce = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingRef.current) {
      const toWrite = pendingRef.current;
      pendingRef.current = null;
      saveSettings(toWrite).catch(console.error);
    }
  }, []);

  const update = useCallback(
    (partial: Partial<Omit<AppSettings, "id">>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        pendingWriteRef.current = next;

        if (timerRef.current) clearTimeout(timerRef.current);

        pendingRef.current = partial;
        timerRef.current = setTimeout(() => {
          if (pendingRef.current) {
            const toWrite = pendingRef.current;
            pendingRef.current = null;
            saveSettings(toWrite).catch(console.error);
          }
          timerRef.current = null;
        }, DEBOUNCE_MS);

        return next;
      });
    },
    [],
  );

  /* ── Immediate update (bypasses debounce for toggles, radios) ── */
  const updateImmediate = useCallback(
    (partial: Partial<Omit<AppSettings, "id">>) => {
      flushDebounce();
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        pendingWriteRef.current = next;
        saveSettings(partial).catch(console.error);
        return next;
      });
    },
    [flushDebounce],
  );

  /* ── Reset to defaults ── */
  const reset = useCallback(async () => {
    flushDebounce();
    const fresh = await resetSettings();
    if (mountedRef.current) setSettings(fresh);
  }, [flushDebounce]);

  /* ── Reload from DB ── */
  const refresh = useCallback(async () => {
    flushDebounce();
    const fresh = await getSettings();
    if (mountedRef.current) setSettings(fresh);
  }, [flushDebounce]);

  /* ── Export ── */
  const exportData = useCallback(async () => {
    flushDebounce();
    return exportDatabase();
  }, [flushDebounce]);

  /* ── Import ── */
  const importData = useCallback(
    async (data: DatabaseExport) => {
      flushDebounce();
      await importDatabase(data);
      const fresh = await getSettings();
      if (mountedRef.current) setSettings(fresh);
    },
    [flushDebounce],
  );

  /* ── Clear all ── */
  const clearAll = useCallback(async () => {
    flushDebounce();
    await clearAllData();
    const fresh = await getSettings();
    if (mountedRef.current) setSettings(fresh);
  }, [flushDebounce]);

  return {
    settings,
    loading,
    update,
    updateImmediate,
    reset,
    refresh,
    exportData,
    importData,
    clearAll,
    locationLabel,
  };
}

const DEFAULT_SETTINGS = {
  id: 1,
  latitude: 0,
  longitude: 0,
  calculationMethod: "MuslimWorldLeague",
  notificationsEnabled: true,
  onboardingComplete: true,
  name: "",
  language: "English",
  school: "Shafi'i",
  reminderOffset: 10,
  adhanSound: false,
  vibrate: true,
  theme: "system",
  paperTexture: false,
  textSize: "default",
  waterTarget: 8,
  exerciseTarget: 30,
  walkingTarget: 8000,
  prayerAdjustments: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
} satisfies AppSettings;
