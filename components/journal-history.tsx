import { memo, useCallback } from "react";
import { BookOpen } from "lucide-react";
import type { JournalEntry } from "@/lib/db";
import { formatHijriDate } from "@/lib/hijri-date";

interface JournalHistoryProps {
  entries: JournalEntry[];
  loading: boolean;
}

const MOOD_LABELS: Record<string, string> = {
  grateful: "Grateful",
  peaceful: "Peaceful",
  reflective: "Reflective",
  hopeful: "Hopeful",
  seeking: "Seeking",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatHijri(dateStr: string): string {
  return formatHijriDate(dateStr);
}

const MOOD_ICONS: Record<string, React.ReactNode> = {
  grateful: (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 16 C8 12, 12 10, 16 10 C20 10, 24 12, 24 16" />
      <path d="M10 16 L10 18 C10 20, 12 22, 16 22 C20 22, 22 20, 22 18 L22 16" />
      <path d="M16 10 L16 8" />
    </svg>
  ),
  peaceful: (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 C14 8, 10 14, 10 20 C10 26, 14 30, 20 30 C15 26, 13 18, 16 10 C17 8, 18 7, 20 6 Z" />
    </svg>
  ),
  reflective: (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8 L6 10 L6 24 L16 22 L26 24 L26 10 L16 8 Z" />
      <path d="M16 8 L16 22" />
    </svg>
  ),
  hopeful: (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 22 L26 22" />
      <path d="M10 22 A6 6 0 0 1 22 22" />
      <path d="M16 16 L16 12" />
      <path d="M10 18 L8 15" />
      <path d="M22 18 L24 15" />
    </svg>
  ),
  seeking: (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="16" r="10" />
      <path d="M16 6 L16 26" />
      <path d="M14 8 L16 4 L18 8" />
    </svg>
  ),
};

const EntryCard = memo(function EntryCard({ entry }: { entry: JournalEntry }) {
  const preview = entry.text.length > 120
    ? entry.text.slice(0, 120) + "..."
    : entry.text;

  const visibleTags = entry.tags.slice(0, 3);
  const extraCount = entry.tags.length - 3;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
  }, []);

  return (
    <article
      className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-xs)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-accent hover:shadow-[var(--shadow-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
      tabIndex={0}
      role="button"
      aria-label={`Journal entry from ${formatDate(entry.date)}`}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: "var(--space-2)" }}>
        <div>
          <time
            dateTime={entry.date}
            className="text-foreground"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-body-sm)",
            }}
          >
            {formatHijri(entry.date)}
          </time>
          <time
            dateTime={entry.date}
            className="text-muted-foreground block"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-caption)",
            }}
          >
            {formatDate(entry.date)}
          </time>
        </div>
        {entry.mood && (
          <span
            className="flex items-center gap-1 text-dusk-teal"
            style={{
              fontSize: "var(--text-caption)",
              fontWeight: 500,
            }}
          >
            {MOOD_ICONS[entry.mood]}
            {MOOD_LABELS[entry.mood] ?? entry.mood}
          </span>
        )}
      </div>

      {preview && (
        <p
          className="text-foreground"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "var(--space-3)",
          }}
        >
          {preview}
        </p>
      )}

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground"
              style={{
                fontSize: "var(--text-caption)",
                fontWeight: 500,
              }}
            >
              #{tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span
              className="text-muted-foreground"
              style={{
                fontSize: "var(--text-caption)",
                fontWeight: 500,
              }}
            >
              +{extraCount}
            </span>
          )}
        </div>
      )}
    </article>
  );
})

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-xs)]">
      <div
        className="animate-pulse rounded"
        style={{
          width: "120px",
          height: "14px",
          background: "var(--secondary)",
          marginBottom: "var(--space-3)",
        }}
      />
      <div
        className="animate-pulse rounded"
        style={{
          width: "100%",
          height: "16px",
          background: "var(--secondary)",
          marginBottom: "var(--space-2)",
        }}
      />
      <div
        className="animate-pulse rounded"
        style={{
          width: "80%",
          height: "16px",
          background: "var(--secondary)",
          marginBottom: "var(--space-3)",
        }}
      />
      <div className="flex gap-2">
        {[60, 60, 60].map((w, i) => (
          <div
            key={i}
            className="animate-pulse rounded-full"
            style={{
              width: `${w}px`,
              height: "20px",
              background: "var(--secondary)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <BookOpen
        size={32}
        strokeWidth={1.5}
        className="text-muted-foreground"
        style={{ marginBottom: "var(--space-4)" }}
      />
      <h3
        className="text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-h3)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-h3)",
          marginBottom: "var(--space-2)",
        }}
      >
        No entries yet
      </h3>
      <p
        className="text-muted-foreground"
        style={{ fontSize: "var(--text-body-sm)" }}
      >
        Start writing to see your journal entries here.
      </p>
    </div>
  );
}

export const JournalHistory = memo(function JournalHistory({ entries, loading }: JournalHistoryProps) {
  if (loading) {
    return (
      <section aria-label="Previous entries">
        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h3)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-h3)",
            marginBottom: "var(--space-6)",
          }}
        >
          Previous Entries
        </h2>
        <div
          className="border-t border-border"
          style={{ marginBottom: "var(--space-6)" }}
        />
        <div className="flex flex-col gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section aria-label="Previous entries">
        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h3)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-h3)",
            marginBottom: "var(--space-6)",
          }}
        >
          Previous Entries
        </h2>
        <div
          className="border-t border-border"
          style={{ marginBottom: "var(--space-6)" }}
        />
        <EmptyState />
      </section>
    );
  }

  return (
    <section aria-label="Previous entries">
      <h2
        className="text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-h3)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-h3)",
          marginBottom: "var(--space-6)",
        }}
      >
        Previous Entries
      </h2>
      <div
        className="border-t border-border"
        style={{ marginBottom: "var(--space-6)" }}
      />
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
})
