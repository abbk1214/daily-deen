"use client";

import { useCallback, useEffect, useRef } from "react";

interface JournalEntryEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MIN_HEIGHT = 240;
const MAX_HEIGHT = 480;

export function JournalEntryEditor({
  value,
  onChange,
  placeholder = "Write about your day...",
}: JournalEntryEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    el.style.height = `${Math.max(MIN_HEIGHT, Math.min(scrollHeight, MAX_HEIGHT))}px`;
    el.style.overflowY = scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <div
      className="rounded-lg border border-border bg-card shadow-[var(--shadow-xs)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-within:border-ring focus-within:shadow-[var(--focus-ring)]"
    >
      <textarea
        ref={textareaRef}
        id="editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Journal entry"
        aria-describedby="editor-hint"
        autoComplete="off"
        className="w-full resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
        style={{
          padding: "var(--space-5)",
          fontSize: "var(--text-body)",
          lineHeight: "var(--leading-body)",
          letterSpacing: "var(--tracking-body)",
          fontFamily: "var(--font-body)",
          minHeight: `${MIN_HEIGHT}px`,
          maxHeight: `${MAX_HEIGHT}px`,
        }}
      />
      <span id="editor-hint" className="sr-only">
        Write your journal entry. Press Ctrl+S or Cmd+S to save.
      </span>
    </div>
  );
}
