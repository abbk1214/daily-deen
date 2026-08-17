export default function HabitsLoading() {
  return (
    <div className="flex flex-1 flex-col pb-24 lg:pb-8" style={{ padding: "var(--space-5)", maxWidth: "var(--content-reading)", marginInline: "auto", width: "100%" }}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
        <div className="h-7 w-24 rounded bg-muted" />
        <div className="h-8 w-20 rounded-lg bg-muted" />
      </div>

      {/* Week strip skeleton */}
      <div className="flex justify-between" style={{ marginBottom: "var(--space-6)" }}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex flex-col items-center" style={{ gap: "var(--space-1)" }}>
            <div className="h-3 w-6 rounded bg-muted" />
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        ))}
      </div>

      {/* Habit cards skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border" style={{ padding: "var(--space-4)", marginBottom: "var(--space-3)" }}>
          <div className="h-10 w-10 rounded-xl bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-2 w-full rounded-full bg-muted" />
          </div>
          <div className="h-8 w-8 rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}
