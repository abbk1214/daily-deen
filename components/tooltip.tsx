"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  disabled?: boolean;
}

export function Tooltip({ children, content, disabled }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleEnter = useCallback(() => {
    if (disabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(true), 300);
  }, [disabled]);

  const handleLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShow(false);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      {show && !disabled && (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2"
          style={{
            marginLeft: "var(--space-2)",
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-sm)",
            padding: "var(--space-1) var(--space-2)",
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            color: "var(--foreground)",
            whiteSpace: "nowrap",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
