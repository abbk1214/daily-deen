"use client"

import { memo } from "react"
import type { Coordinates } from "@/lib/location/types"
import type { QiblaResult } from "@/lib/qibla"
import { formatDistance } from "@/lib/qibla/helpers"
import { KAABA } from "@/lib/qibla/constants"

interface QiblaMapProps {
  userLocation: Coordinates
  qibla: QiblaResult
}

export const QiblaMap = memo(function QiblaMap({ userLocation, qibla }: QiblaMapProps) {
  const mapWidth = 280
  const mapHeight = 200

  const toMercX = (lng: number) => ((lng + 180) / 360) * mapWidth
  const toMercY = (lat: number) => {
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    return mapHeight / 2 - (mercN / Math.PI) * (mapHeight / 2) * 0.8
  }

  const userX = toMercX(userLocation.longitude)
  const userY = toMercY(userLocation.latitude)
  const kaabaX = toMercX(KAABA.longitude)
  const kaabaY = toMercY(KAABA.latitude)

  const lineAngle = qibla.bearing * (Math.PI / 180)
  const lineLength = 100

  return (
    <div className="rounded-xl border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)] overflow-hidden bg-[var(--color-parchment)] dark:bg-[var(--color-ink)]">
      <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-auto">
        {/* Grid lines */}
        {[-120, -60, 0, 60, 120].map((lng) => (
          <line
            key={`v-${lng}`}
            x1={toMercX(lng)}
            y1={0}
            x2={toMercX(lng)}
            y2={mapHeight}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-[var(--color-stone-200)] dark:text-[var(--color-stone-700)]"
          />
        ))}
        {[-60, -30, 0, 30, 60].map((lat) => (
          <line
            key={`h-${lat}`}
            x1={0}
            y1={toMercY(lat)}
            x2={mapWidth}
            y2={toMercY(lat)}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-[var(--color-stone-200)] dark:text-[var(--color-stone-700)]"
          />
        ))}

        {/* Qibla line */}
        <line
          x1={userX}
          y1={userY}
          x2={userX + lineLength * Math.sin(lineAngle)}
          y2={userY - lineLength * Math.cos(lineAngle)}
          stroke="var(--dd-lantern-gold)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.6"
        />

        {/* User location */}
        <circle cx={userX} cy={userY} r="5" fill="currentColor" className="fill-[var(--color-lantern)]" />
        <circle
          cx={userX}
          cy={userY}
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="fill-[var(--color-lantern)]"
          opacity="0.3"
        />

        {/* Kaaba */}
        <rect
          x={kaabaX - 4}
          y={kaabaY - 4}
          width="8"
          height="8"
          rx="1"
          fill="currentColor"
          className="fill-[var(--color-ink)] dark:fill-[var(--color-parchment)]"
        />

        {/* Labels */}
        <text
          x={userX}
          y={userY + 14}
          textAnchor="middle"
          className="text-[8px] fill-[var(--color-stone-500)] dark:fill-[var(--color-stone-400)]"
        >
          You
        </text>
        <text
          x={kaabaX}
          y={kaabaY - 8}
          textAnchor="middle"
          className="text-[8px] fill-[var(--color-stone-500)] dark:fill-[var(--color-stone-400)]"
        >
          Kaaba
        </text>
      </svg>

      <div className="px-3 py-2 border-t border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)]">
        <p className="text-[10px] text-[var(--color-stone-400)] dark:text-[var(--color-stone-500)]">
          {formatDistance(qibla.distance)} from your location
        </p>
      </div>
    </div>
  )
})
