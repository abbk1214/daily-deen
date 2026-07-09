"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-8 text-center font-sans">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <h1
          className="font-display text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          You&apos;re Offline
        </h1>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
          }}
        >
          Daily Deen is not available without an internet connection. Please
          check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex h-12 items-center justify-center rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{
            fontSize: "var(--text-body)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}
