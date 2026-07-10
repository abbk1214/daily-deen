"use client"

import { memo } from "react"
import { Compass } from "lucide-react"
import { DashboardCard } from "./dashboard-card"

interface QiblaCardProps {
  bearing: number | null
  city?: string
  onOpenCompass: () => void
  isVisible: boolean
}

function getDirectionLabel(bearing: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}

export const QiblaCard = memo(function QiblaCard({
  bearing,
  city,
  onOpenCompass,
  isVisible,
}: QiblaCardProps) {
  if (bearing === null) return null

  return (
    <DashboardCard
      title="Qibla"
      ariaLabel={`Qibla direction: ${Math.round(bearing)} degrees ${getDirectionLabel(bearing)}`}
      action={
        <button
          onClick={onOpenCompass}
          aria-label={isVisible ? "Close compass" : "Open compass"}
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{
            backgroundColor: isVisible ? "var(--dd-lantern-gold)" : "var(--muted)",
            color: isVisible ? "var(--primary-foreground)" : "var(--foreground)",
          }}
        >
          <Compass size={16} strokeWidth={1.5} />
        </button>
      }
    >
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 56,
            height: 56,
            backgroundColor: "var(--dd-lantern-gold)",
            color: "var(--primary-foreground)",
          }}
        >
          <Compass size={28} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span
            className="font-mono text-foreground"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-h3)",
              fontWeight: 600,
              lineHeight: "var(--leading-tight)",
            }}
          >
            {Math.round(bearing)}° {getDirectionLabel(bearing)}
          </span>
          {city && (
            <span
              className="text-muted-foreground"
              style={{ fontSize: "var(--text-caption)" }}
            >
              {city}
            </span>
          )}
        </div>
      </div>
    </DashboardCard>
  )
})
