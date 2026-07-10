"use client"

import { memo } from "react"
import type { CompassState } from "@/lib/qibla"

interface CalibrationCardProps {
  compass: CompassState
  onCalibrate?: () => void
}

export const CalibrationCard = memo(function CalibrationCard({
  compass,
  onCalibrate,
}: CalibrationCardProps) {
  if (compass.isCalibrated || !compass.isSupported) return null

  return (
    <div className="rounded-xl border border-[var(--color-lantern)]/20 bg-[var(--color-lantern)]/5 p-4 text-center">
      <p className="text-sm font-medium text-[var(--color-ink)] dark:text-[var(--color-parchment)]">
        Compass needs calibration
      </p>
      <p className="mt-1 text-xs text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)]">
        Move your phone in a figure-eight pattern to calibrate
      </p>
      {onCalibrate && (
        <button
          onClick={onCalibrate}
          className="mt-3 text-xs font-medium text-[var(--color-lantern)] hover:underline"
        >
          Dismiss
        </button>
      )}
    </div>
  )
})
