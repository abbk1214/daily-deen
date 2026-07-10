"use client"

import { useMemo } from "react"
import { useLocation } from "./use-location"
import {
  getQiblaDirection,
  type QiblaResult,
} from "@/lib/qibla"

export interface UseQiblaReturn {
  qibla: QiblaResult | null
  loading: boolean
  hasLocation: boolean
}

export function useQibla(): UseQiblaReturn {
  const { latitude, longitude } = useLocation()

  const hasLocation =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude)

  const qibla = useMemo<QiblaResult | null>(() => {
    if (!hasLocation) return null
    return getQiblaDirection({
      latitude: latitude as number,
      longitude: longitude as number,
    })
  }, [latitude, longitude, hasLocation])

  return { qibla, loading: false, hasLocation }
}
