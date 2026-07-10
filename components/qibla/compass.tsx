"use client"

import { memo, useEffect, useRef } from "react"
import { useCompass } from "@/hooks/use-compass"
import { useQibla } from "@/hooks/use-qibla"
import { CompassDial } from "./compass-dial"
import { CompassArrow } from "./compass-arrow"
import { QiblaInfo } from "./qibla-info"
import { CalibrationCard } from "./calibration-card"

interface CompassProps {
  showDegrees?: boolean
}

export const Compass = memo(function Compass({ showDegrees = true }: CompassProps) {
  const { compass, heading, startListening, stopListening } = useCompass()
  const { qibla, hasLocation } = useQibla()
  const startedRef = useRef(false)

  useEffect(() => {
    if (compass.isSupported && !startedRef.current) {
      startedRef.current = true
      startListening()
    }
    return () => {
      stopListening()
      startedRef.current = false
    }
  }, [compass.isSupported, startListening, stopListening])

  if (!compass.isSupported) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)] flex items-center justify-center">
          <p className="text-sm text-[var(--color-stone-400)] dark:text-[var(--color-stone-500)] text-center px-8">
            Compass not available on this device
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <CalibrationCard compass={compass} />

      <div className="relative">
        <CompassDial heading={heading} showDegrees={showDegrees} />
        {hasLocation && qibla && (
          <CompassArrow qiblaBearing={qibla.bearing} deviceHeading={heading} />
        )}

        {/* North indicator - fixed at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
          <div className="w-3 h-3 rounded-full bg-[var(--color-ink)] dark:bg-[var(--color-parchment)]" />
        </div>
      </div>

      {qibla && <QiblaInfo qibla={qibla} />}
    </div>
  )
})
