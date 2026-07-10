"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";

const SIDEBAR_STORAGE_KEY = "dd-sidebar-collapsed";
const LOADING_TIMEOUT_MS = 5000;

/* ─── Sidebar persistence helpers ─── */

function getStoredCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function setStoredCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  } catch {
    // ignore
  }
}

/* ─── Keyboard key map ─── */

interface KeyBinding {
  direction: number;
  wrap: boolean;
}

type KeyMap = Record<string, KeyBinding>;

const HORIZONTAL_KEY_MAP: KeyMap = {
  ArrowRight: { direction: 1, wrap: true },
  ArrowLeft: { direction: -1, wrap: true },
  Home: { direction: 0, wrap: false },
  End: { direction: -1, wrap: false },
};

const VERTICAL_KEY_MAP: KeyMap = {
  ArrowDown: { direction: 1, wrap: true },
  ArrowUp: { direction: -1, wrap: true },
  Home: { direction: 0, wrap: false },
  End: { direction: -1, wrap: false },
};

/* ─── Hook ─── */

export interface UseNavigationReturn {
  pathname: string;
  isCollapsed: boolean;
  isDesktop: boolean;
  isLoading: boolean;
  activeIndex: number;
  tabRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  toggleSidebar: () => void;
  startLoading: () => void;
  moveFocus: (index: number) => void;
  handleHorizontalKeyDown: (e: React.KeyboardEvent) => void;
  handleVerticalKeyDown: (
    e: React.KeyboardEvent,
    onEscape?: () => void,
  ) => void;
}

function computeActiveIndex(pathname: string): number {
  const idx = NAV_ITEMS.findIndex((item) => item.href === pathname);
  return idx >= 0 ? idx : 0;
}

export function useNavigation(): UseNavigationReturn {
  const pathname = usePathname();

  /* ── Sidebar state ── */
  const [isCollapsed, setIsCollapsed] = useState(() => getStoredCollapsed());
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");

    // Defer initial read to avoid synchronous setState in effect
    requestAnimationFrame(() => {
      setIsDesktop(mql.matches);
    });

    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (!e.matches) {
        setIsCollapsed(false);
        setStoredCollapsed(false);
      }
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      setStoredCollapsed(next);
      return next;
    });
  }, []);

  /* ── Loading state ── */
  const [isLoading, setIsLoading] = useState(false);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsLoading(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsLoading(false), LOADING_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* ── Focus management ── */
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  const moveFocus = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  /* ── Active index ── */
  const activeIndex = computeActiveIndex(pathname);

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, keyMap: KeyMap, onEscape?: () => void) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      const binding = keyMap[e.key];
      if (!binding) return;

      e.preventDefault();

      const total = NAV_ITEMS.length;
      let nextIndex: number;

      if (binding.direction === 0) {
        // Home
        nextIndex = 0;
      } else if (binding.wrap) {
        // Arrow keys with wrapping
        nextIndex =
          (activeIndex + binding.direction + total) % total;
      } else {
        // End
        nextIndex = total - 1;
      }

      moveFocus(nextIndex);
    },
    [activeIndex, moveFocus],
  );

  const handleHorizontalKeyDown = useCallback(
    (e: React.KeyboardEvent) => handleKeyDown(e, HORIZONTAL_KEY_MAP),
    [handleKeyDown],
  );

  const handleVerticalKeyDown = useCallback(
    (e: React.KeyboardEvent, onEscape?: () => void) =>
      handleKeyDown(e, VERTICAL_KEY_MAP, onEscape),
    [handleKeyDown],
  );

  return {
    pathname,
    isCollapsed,
    isDesktop,
    isLoading,
    activeIndex,
    tabRefs,
    toggleSidebar,
    startLoading,
    moveFocus,
    handleHorizontalKeyDown,
    handleVerticalKeyDown,
  };
}
