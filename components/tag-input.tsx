"use client";

import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Add tags...",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addTag = useCallback(
    (text: string) => {
      const trimmed = text.trim().toLowerCase();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
      }
      setInputValue("");
    },
    [tags, onChange],
  );

  const removeTag = useCallback(
    (index: number) => {
      const removed = tags[index];
      onChange(tags.filter((_, i) => i !== index));
      // Announce removal
      const live = containerRef.current?.querySelector<HTMLElement>(
        '[role="status"]',
      );
      if (live) {
        live.textContent = `${removed} removed`;
      }
      inputRef.current?.focus();
    },
    [tags, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Enter" &&
        (e.metaKey || e.ctrlKey) &&
        inputValue.trim()
      ) {
        e.preventDefault();
        addTag(inputValue);
        return;
      }

      if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        e.preventDefault();
        removeTag(tags.length - 1);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setInputValue("");
        return;
      }
    },
    [inputValue, tags, addTag, removeTag],
  );

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Tags"
      className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-within:border-ring focus-within:shadow-[var(--focus-ring)]"
    >
      {tags.map((tag, index) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
          style={{
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
            maxWidth: "120px",
          }}
          aria-label={`${tag}, remove`}
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => removeTag(index)}
            className="flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-foreground"
            style={{
              width: "28px",
              height: "28px",
              minWidth: "28px",
              minHeight: "28px",
            }}
          >
            <X size={12} strokeWidth={1.5} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        aria-label="Add tag"
        className="min-w-[100px] flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground outline-none"
        style={{
          fontSize: "var(--text-body-sm)",
        }}
      />
      <div role="status" aria-live="polite" className="sr-only" />
    </div>
  );
}
