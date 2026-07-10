"use client"

import { memo } from "react"
import type { QiblaResult } from "@/lib/qibla"
import { formatBearing, formatDistance, getDirectionLabel } from "@/lib/qibla/helpers"

interface QiblaInfoProps {
  qibla: QiblaResult
}

export const QiblaInfo = memo(function QiblaInfo({ qibla }: QiblaInfoProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-2xl font-display font-medium text-[var(--color-ink)] dark:text-[var(--color-parchment)]">
        {formatBearing(qibla.bearing)}
      </p>
      <p className="text-sm text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)]">
        {getDirectionLabel(qibla.bearing)} · {formatDistance(qibla.distance)}
      </p>
    </div>
  )
})
