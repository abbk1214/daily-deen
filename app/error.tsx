"use client"

import { useEffect } from "react"

interface RouteErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    console.error("Route error:", error)
  }, [error])

  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "60vh",
        padding: "var(--space-6)",
      }}
    >
      <div
        className="rounded-2xl border border-border bg-card"
        style={{
          padding: "var(--space-8)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h3)",
            fontWeight: 600,
            marginBottom: "var(--space-3)",
          }}
        >
          Something went wrong
        </h2>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-body-sm)",
            marginBottom: "var(--space-6)",
            lineHeight: "var(--leading-body)",
          }}
        >
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="w-full rounded-xl border border-border bg-foreground text-background transition-opacity hover:opacity-90"
          style={{
            padding: "var(--space-3) var(--space-4)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
