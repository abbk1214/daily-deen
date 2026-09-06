"use client"

import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth-context"
import Link from "next/link"

export default function LoginPage() {
  const { signInWithEmail, user, signOut, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>Loading...</p>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div
          className="rounded-2xl border border-border bg-card text-center"
          style={{ padding: "var(--space-8)", maxWidth: "380px", width: "100%" }}
        >
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: "var(--space-2)" }}>
            Signed in as
          </p>
          <p className="text-foreground" style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h4)", fontWeight: 600, marginBottom: "var(--space-6)" }}>
            {user.email}
          </p>
          <Link
            href="/"
            className="block w-full rounded-xl bg-foreground text-background text-center transition-opacity hover:opacity-90"
            style={{ padding: "var(--space-3) var(--space-4)", fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: "var(--space-3)" }}
          >
            Go to Dashboard
          </Link>
          <button
            onClick={signOut}
            className="w-full rounded-xl border border-border text-foreground transition-colors hover:bg-secondary"
            style={{ padding: "var(--space-3) var(--space-4)", fontSize: "var(--text-body-sm)", fontWeight: 500, cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("sending")
    setErrorMsg("")

    const { error } = await signInWithEmail(email)
    if (error) {
      setStatus("error")
      setErrorMsg(error)
    } else {
      setStatus("sent")
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div
        className="rounded-2xl border border-border bg-card"
        style={{ padding: "var(--space-8)", maxWidth: "380px", width: "100%" }}
      >
        <div className="text-center" style={{ marginBottom: "var(--space-6)" }}>
          <h1
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h3)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              marginBottom: "var(--space-2)",
            }}
          >
            Daily Deen
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
            Prayer times, Quran, habits, journal
          </p>
        </div>

        {status === "sent" ? (
          <div className="text-center">
            <p
              className="text-foreground"
              style={{
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
                marginBottom: "var(--space-2)",
              }}
            >
              Check your email
            </p>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "var(--text-caption)", marginBottom: "var(--space-6)" }}
            >
              We sent a sign-in link to <strong>{email}</strong>
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="w-full rounded-xl border border-border text-foreground transition-colors hover:bg-secondary"
              style={{ padding: "var(--space-3) var(--space-4)", fontSize: "var(--text-body-sm)", fontWeight: 500, cursor: "pointer" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="block text-foreground"
              style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: "var(--space-2)" }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              style={{
                padding: "var(--space-3) var(--space-4)",
                fontSize: "var(--text-body-sm)",
                marginBottom: "var(--space-4)",
              }}
            />

            {status === "error" && (
              <p
                className="text-red-500"
                style={{ fontSize: "var(--text-caption)", marginBottom: "var(--space-3)" }}
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                padding: "var(--space-3) var(--space-4)",
                fontSize: "var(--text-body-sm)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {status === "sending" ? "Sending link..." : "Send magic link"}
            </button>
          </form>
        )}

        <p
          className="text-center text-muted-foreground"
          style={{ fontSize: "var(--text-caption)", marginTop: "var(--space-6)" }}
        >
          No password needed — we&apos;ll email you a sign-in link.
        </p>
      </div>
    </div>
  )
}
