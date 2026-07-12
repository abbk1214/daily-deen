"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  isCompassSupported,
  requestCompassPermission,
  startCompassListener,
  getCompassState,
  type CompassState,
} from "@/lib/qibla"

export interface UseCompassReturn {
  compass: CompassState
  heading: number
  startListening: () => void
  stopListening: () => void
}

export function useCompass(smoothing?: number): UseCompassReturn {
  const [heading, setHeading] = useState(0)
  const [permissionState, setPermissionState] = useState<"granted" | "denied" | "prompt">("prompt")
  const [isCalibrated, setIsCalibrated] = useState(true)
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false
    return isCompassSupported()
  })
  const cleanupRef = useRef<(() => void) | null>(null)

  const onHeading = useCallback((h: number) => {
    setHeading(h)
  }, [])

  const onError = useCallback((msg: string) => {
    console.error('Compass error:', msg)
    setIsCalibrated(false)
  }, [])

  const startListening = useCallback(async () => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    const granted = await requestCompassPermission()
    setPermissionState(granted ? "granted" : "denied")
    if (!granted) return

    cleanupRef.current = startCompassListener(onHeading, onError, smoothing)
  }, [onHeading, onError, smoothing])

  const stopListening = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [])

  const compass: CompassState = {
    ...getCompassState(heading, isSupported),
    permissionState,
    isCalibrated,
  }

  return {
    compass,
    heading,
    startListening,
    stopListening,
  }
}
