"use client"

import { lazy, Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLocation } from "@/hooks/use-location"

const CompassWidget = lazy(() =>
  import("@/components/qibla/compass").then((m) => ({ default: m.CompassWidget }))
)

export default function CompassPage() {
  const { city, country, latitude, longitude } = useLocation()
  const hasLocation =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    (latitude !== 0 || longitude !== 0)

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to main content
      </a>

      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1
          className="ml-3 text-foreground"
          style={{
            fontSize: "var(--text-body)",
            fontWeight: 500,
          }}
        >
          Qibla Compass
        </h1>
      </header>

      {/* Main content */}
      <main
        id="main"
        className="flex flex-1 flex-col items-center justify-center pb-24 lg:pb-8"
        style={{
          padding: "var(--space-5)",
          maxWidth: "var(--content-narrow)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      >
        {hasLocation && city && country && (
          <p
            className="text-muted-foreground mb-6 text-center"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            {city}, {country}
          </p>
        )}

        {!hasLocation && (
          <div className="text-center mb-6">
            <p
              className="text-muted-foreground"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Set your location in Settings to find the Qibla direction.
            </p>
          </div>
        )}

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-80">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            </div>
          }
        >
          <CompassWidget />
        </Suspense>
      </main>
    </div>
  )
}
