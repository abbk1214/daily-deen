export default function QuranLoading() {
  return (
    <div className="flex flex-1 flex-col pb-24 lg:pb-8">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background" style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}>
        <div className="h-5 w-5 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-5 w-5 rounded bg-muted" />
      </div>

      {/* Search skeleton */}
      <div style={{ padding: "var(--space-4) var(--space-5)" }}>
        <div className="h-10 w-full rounded-lg bg-muted" />
      </div>

      {/* Tab skeleton */}
      <div className="flex gap-2" style={{ padding: "0 var(--space-5)", marginBottom: "var(--space-4)" }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 w-16 rounded-lg bg-muted" />
        ))}
      </div>

      {/* Surah list skeleton */}
      <div className="flex flex-col">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4" style={{ padding: "var(--space-3) var(--space-5)", borderBottom: "1px solid var(--border)" }}>
            <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
            <div className="h-3 w-8 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
