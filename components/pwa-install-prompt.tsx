"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user dismissed within last 7 days
    const dismissedAt = localStorage.getItem("pwa-install-dismissed")
    if (dismissedAt) {
      const daysSinceDismiss = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismiss < 7) {
        setDismissed(true)
        return
      }
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a short delay to not be intrusive
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    localStorage.setItem("pwa-install-dismissed", String(Date.now()))
    setShowPrompt(false)
    setDismissed(true)
  }, [])

  if (!showPrompt || dismissed || !deferredPrompt) return null

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-border bg-card shadow-lg"
      style={{ padding: "var(--space-4)" }}
      role="alert"
      aria-label="Install Daily Deen"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{
            width: 40,
            height: 40,
            background: "color-mix(in srgb, var(--dd-dusk-teal) 10%, transparent)",
          }}
        >
          <Download size={18} className="text-dusk-teal" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-foreground"
            style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
          >
            Install Daily Deen
          </p>
          <p
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)", marginTop: "2px" }}
          >
            Add to your home screen for quick access and offline use
          </p>
          <div className="flex items-center gap-2" style={{ marginTop: "var(--space-3)" }}>
            <button
              onClick={handleInstall}
              className="rounded-lg bg-foreground text-background transition-opacity hover:opacity-90"
              style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-caption)", fontWeight: 500 }}
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg text-muted-foreground transition-colors hover:bg-muted"
              style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-caption)", fontWeight: 500 }}
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
