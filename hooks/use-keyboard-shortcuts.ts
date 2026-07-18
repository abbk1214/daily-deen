"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SHORTCUT_MAP } from "@/constants/navigation";

const RESET_DELAY = 500;

function isInputElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (el as HTMLElement).isContentEditable
  );
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const routerRef = useRef(router);
  const pendingKey = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    routerRef.current = router;
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isInputElement(document.activeElement)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (pendingKey.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        const sequence = pendingKey.current + e.key;
        pendingKey.current = null;

        const route = SHORTCUT_MAP[sequence];
        if (route) {
          e.preventDefault();
          routerRef.current.push(route);
        }
        return;
      }

      if (e.key === "g") {
        e.preventDefault();
        pendingKey.current = "g";
        timerRef.current = setTimeout(() => {
          pendingKey.current = null;
        }, RESET_DELAY);
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
