import { memo, useCallback } from "react";
import { BookOpen } from "lucide-react";
import type { JournalEntry } from "@/lib/db";

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
        <time
          dateTime={entry.date}
          className="text-muted-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-body-sm)",
          }}
        >
          {formatDate(entry.date)}
        </time>
        {entry.mood && (
          <span
            className="text-dusk-teal"
            style={{
              fontSize: "var(--text-caption)",
              fontWeight: 500,
            }}
          >
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
