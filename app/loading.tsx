export default function Loading() {
  return (
    <div className="flex flex-1 flex-col pb-24 lg:pb-8" style={{ paddingInline: "var(--space-6)", paddingTop: "var(--space-8)", maxWidth: "var(--content-reading)", marginInline: "auto", width: "100%" }}>
      {/* Greeting skeleton */}
      <div style={{ marginBottom: "var(--space-10)" }}>
        <div className="h-10 w-48 animate-pulse rounded bg-muted" style={{ marginBottom: "var(--space-4)" }} />
        <div className="h-5 w-32 animate-pulse rounded bg-muted" style={{ marginBottom: "var(--space-2)" }} />
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </div>

      {/* Prayer check-in skeleton */}
      <div className="rounded-2xl border border-border bg-card animate-pulse" style={{ padding: "var(--space-5)", marginBottom: "var(--space-10)" }}>
        <div className="h-1 w-full rounded-full bg-muted" style={{ marginBottom: "var(--space-5)" }} />
        <div className="flex items-center justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center" style={{ gap: "var(--space-2)" }}>
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="h-3 w-10 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Card skeletons */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card animate-pulse" style={{ padding: "var(--space-5)", marginBottom: "var(--space-10)" }}>
          <div className="h-4 w-28 rounded bg-muted" style={{ marginBottom: "var(--space-4)" }} />
          <div className="h-24 w-full rounded-xl bg-muted" />
        </div>
      ))}
    </div>
  );
}
