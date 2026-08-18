export default function WellnessLoading() {
  return (
    <div className="flex flex-1 flex-col pb-24 lg:pb-8" style={{ padding: "var(--space-5)", maxWidth: "var(--content-reading)", marginInline: "auto", width: "100%" }}>
      {/* Header skeleton */}
      <div className="h-7 w-24 rounded bg-muted" style={{ marginBottom: "var(--space-6)" }} />

      {/* Tab skeleton */}
      <div className="flex gap-2" style={{ marginBottom: "var(--space-6)" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-16 rounded-lg bg-muted" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="rounded-xl border border-border bg-card" style={{ padding: "var(--space-5)" }}>
        <div className="h-4 w-32 rounded bg-muted" style={{ marginBottom: "var(--space-4)" }} />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/50" style={{ padding: "var(--space-4)" }}>
              <div className="h-8 w-8 rounded bg-muted" style={{ marginBottom: "var(--space-2)" }} />
              <div className="h-4 w-16 rounded bg-muted" style={{ marginBottom: "var(--space-1)" }} />
              <div className="h-3 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
