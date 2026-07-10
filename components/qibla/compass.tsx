"use client"

import { memo, useEffect, useRef, useState } from "react"
import { useCompass } from "@/hooks/use-compass"
import { useQibla } from "@/hooks/use-qibla"
import { useSettings } from "@/hooks/use-settings"
import { CompassDial } from "./compass-dial"
import { CompassArrow } from "./compass-arrow"
import { QiblaInfo } from "./qibla-info"
import { CalibrationCard } from "./calibration-card"
import { Compass, MapPin } from "lucide-react"

interface CompassWidgetProps {
  showDegrees?: boolean
}

export const CompassWidget = memo(function CompassWidget({ showDegrees: propShowDegrees }: CompassWidgetProps) {
  const { settings } = useSettings()
  const showDegrees = propShowDegrees ?? settings.compassShowDegrees
  const smoothing = settings.compassSmoothing

  const { compass, heading, startListening, stopListening } = useCompass(smoothing)
  const { qibla, hasLocation } = useQibla()
  const startedRef = useRef(false)
  const [permissionAsked, setPermissionAsked] = useState(false)

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

  // Desktop / unsupported sensors
  if (!compass.isSupported) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)] flex flex-col items-center justify-center gap-4">
          <Compass
            size={48}
            strokeWidth={1}
            className="text-[var(--color-stone-300)] dark:text-[var(--color-stone-600)]"
          />
          <div className="text-center px-8">
            <p className="text-sm font-medium text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)]">
              Compass not available
            </p>
            <p className="mt-1 text-xs text-[var(--color-stone-400)] dark:text-[var(--color-stone-500)]">
              Your device does not have a compass sensor.
            </p>
          </div>
          {hasLocation && qibla && (
            <div className="text-center">
              <p className="text-lg font-display font-medium text-[var(--color-ink)] dark:text-[var(--color-parchment)]">
                Qibla: {Math.round(qibla.bearing)}°
              </p>
              <p className="text-xs text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)]">
                {qibla.direction} · {qibla.distance < 1 ? `${Math.round(qibla.distance * 1000)} m` : `${qibla.distance.toFixed(1)} km`}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Permission denied
  if (compass.permissionState === "denied") {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)] flex flex-col items-center justify-center gap-4">
          <MapPin
            size={48}
            strokeWidth={1}
            className="text-[var(--color-stone-300)] dark:text-[var(--color-stone-600)]"
          />
          <div className="text-center px-8">
            <p className="text-sm font-medium text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)]">
              Compass permission denied
            </p>
            <p className="mt-1 text-xs text-[var(--color-stone-400)] dark:text-[var(--color-stone-500)]">
              Enable compass access in your device settings to use the Qibla finder.
            </p>
          </div>
          {hasLocation && qibla && (
            <div className="text-center">
              <p className="text-lg font-display font-medium text-[var(--color-ink)] dark:text-[var(--color-parchment)]">
                Qibla: {Math.round(qibla.bearing)}°
              </p>
              <p className="text-xs text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)]">
                {qibla.direction} · {qibla.distance < 1 ? `${Math.round(qibla.distance * 1000)} m` : `${qibla.distance.toFixed(1)} km`}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Prompt permission (iOS requires user gesture)
  if (compass.permissionState === "prompt" && !permissionAsked) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)] flex flex-col items-center justify-center gap-4">
          <Compass
            size={48}
            strokeWidth={1}
            className="text-[var(--color-stone-300)] dark:text-[var(--color-stone-600)]"
          />
          <div className="text-center px-8">
            <p className="text-sm font-medium text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)]">
              Enable compass
            </p>
            <p className="mt-1 text-xs text-[var(--color-stone-400)] dark:text-[var(--color-stone-500)]">
              Allow compass access to find the Qibla direction.
            </p>
          </div>
          <button
            onClick={() => {
              setPermissionAsked(true)
              startListening()
            }}
            className="rounded-lg bg-[var(--color-lantern)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Enable Compass
          </button>
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

        {/* North indicator — fixed at top of screen */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
          <div className="w-3 h-3 rounded-full bg-[var(--color-ink)] dark:bg-[var(--color-parchment)]" />
        </div>
      </div>

      {qibla && <QiblaInfo qibla={qibla} />}
    </div>
  )
})
