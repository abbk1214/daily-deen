"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getSettings,
  saveSettings,
  resetSettings,
  exportDatabase,
  importDatabase,
  clearAllData,
  DEFAULT_SETTINGS,
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

/* ─── Context ─── */

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
}

const SettingsContext = createContext<UseSettingsReturn | null>(null);

/* ─── Provider ─── */

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Partial<Omit<AppSettings, "id">> | null>(null);
  const pendingWriteRef = useRef<AppSettings | null>(null);

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

  /* ── Cleanup timers on unmount ── */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
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

  const updateImmediate = useCallback(
    (partial: Partial<Omit<AppSettings, "id">>) => {
      flushDebounce();
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        pendingWriteRef.current = next;
        saveSettings(next).catch(console.error);
        return next;
      });
    },
    [flushDebounce],
  );

  const reset = useCallback(async () => {
    flushDebounce();
    const fresh = await resetSettings();
    if (mountedRef.current) setSettings(fresh);
  }, [flushDebounce]);

  const refresh = useCallback(async () => {
    flushDebounce();
    const fresh = await getSettings();
    if (mountedRef.current) setSettings(fresh);
  }, [flushDebounce]);

  const exportData = useCallback(async () => {
    flushDebounce();
    return exportDatabase();
  }, [flushDebounce]);

  const importData = useCallback(
    async (data: DatabaseExport) => {
      flushDebounce();
      await importDatabase(data);
      const fresh = await getSettings();
      if (mountedRef.current) setSettings(fresh);
    },
    [flushDebounce],
  );

  const clearAll = useCallback(async () => {
    flushDebounce();
    await clearAllData();
    const fresh = await getSettings();
    if (mountedRef.current) setSettings(fresh);
  }, [flushDebounce]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        update,
        updateImmediate,
        reset,
        refresh,
        exportData,
        importData,
        clearAll,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

/* ─── Consumer hook ─── */

export function useSettings(): UseSettingsReturn {
  const ctx = useContext(SettingsContext);
  if (ctx) return ctx;

  // Fallback for components rendered outside the provider (e.g., SSR)
  // This should not happen in normal usage
  throw new Error("useSettings must be used within a SettingsProvider");
}
