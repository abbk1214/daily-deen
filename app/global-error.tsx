"use client"

import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "40rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          An unexpected error occurred. Please try again.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              background: "#1a1a2e",
              color: "white",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Go home
          </Link>
        </div>
        {error.digest && (
          <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#999" }}>
            Error ID: {error.digest}
          </p>
        )}
      </body>
    </html>
  )
}
