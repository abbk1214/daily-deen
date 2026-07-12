"use client";

import { useEffect, useState } from "react";

/** Tracks browser online/offline status via window events. */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Defer initial read to avoid synchronous setState in effect
    const rafId = requestAnimationFrame(() => {
      setIsOnline(navigator.onLine);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
