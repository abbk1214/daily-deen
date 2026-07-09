"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "dd-sidebar-collapsed";

function getStoredState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function setStoredState(collapsed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch {
    // ignore
  }
}

function getIsDesktop(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(() => getStoredState());
  const [isDesktop, setIsDesktop] = useState(() => getIsDesktop());
  const mqlRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    mqlRef.current = mql;

    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (!e.matches) {
        setIsCollapsed(false);
        setStoredState(false);
      }
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      setStoredState(next);
      return next;
    });
  }, []);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
    setStoredState(true);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    setStoredState(false);
  }, []);

  const sidebarWidth = isDesktop ? (isCollapsed ? 64 : 200) : 0;

  return { isCollapsed, isDesktop, sidebarWidth, toggle, collapse, expand };
}
