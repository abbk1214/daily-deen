export default function SettingsLoading() {
  return (
    <div className="flex flex-1 flex-col pb-24 lg:pb-8" style={{ padding: "var(--space-5)", maxWidth: "var(--content-narrow)", marginInline: "auto", width: "100%" }}>
      {/* Header skeleton */}
      <div className="h-7 w-24 rounded bg-muted" style={{ marginBottom: "var(--space-6)" }} />

      {/* Profile section skeleton */}
      <div className="rounded-xl border border-border bg-card" style={{ padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
        <div className="h-4 w-16 rounded bg-muted" style={{ marginBottom: "var(--space-3)" }} />
        <div className="h-10 w-full rounded-lg bg-muted" />
      </div>

      {/* Settings sections skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card" style={{ padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <div className="h-4 w-20 rounded bg-muted" style={{ marginBottom: "var(--space-3)" }} />
          <div className="space-y-3">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-6 w-12 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
