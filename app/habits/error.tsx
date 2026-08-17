"use client";

export default function HabitsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center" style={{ padding: "var(--space-6)" }}>
      <h1
        className="text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-h3)",
          fontWeight: 600,
          marginBottom: "var(--space-2)",
        }}
      >
        Unable to load habits
      </h1>
      <p
        className="text-muted-foreground"
        style={{
          fontSize: "var(--text-body-sm)",
          maxWidth: "36ch",
          marginBottom: "var(--space-6)",
        }}
      >
        {error.message || "Something went wrong while loading your habits. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-dusk-teal px-6 py-3 text-white transition-colors hover:bg-dusk-teal/90"
        style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
      >
        Try again
      </button>
    </div>
  );
}
