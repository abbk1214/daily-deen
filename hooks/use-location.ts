"use client"

import { useCallback, useRef, useState } from "react"
import { useSettings } from "./use-settings"
import {
  getCurrentPosition,
  reverseGeocode,
  requestGeolocationPermission,
} from "@/lib/location"
import { invalidateCache } from "@/lib/prayer"
import type { PermissionState } from "@/lib/location"

export interface LocationState {
  loading: boolean
  error: string | null
  permission: PermissionState
  city: string
  country: string
}

export function useLocation() {
  const { settings, update } = useSettings()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permission, setPermission] = useState<PermissionState>("prompt")
  const abortRef = useRef<AbortController | null>(null)

  const detectLocation = useCallback(async () => {
    setLoading(true)
    setError(null)
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const geo = await getCurrentPosition({ highAccuracy: true, timeout: 15000 })
      setPermission("granted")

      const geoResult = await reverseGeocode(
        geo.coordinates,
        abortRef.current.signal,
      )

      await update({
        latitude: geo.coordinates.latitude,
        longitude: geo.coordinates.longitude,
        city: geoResult.city,
        country: geoResult.country,
        accuracy: geo.accuracy,
        locationUpdatedAt: Date.now(),
      })

      invalidateCache()
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      const msg = err instanceof Error ? err.message : "Failed to detect location"
      setError(msg)
      if (msg.includes("denied")) setPermission("denied")
    } finally {
      setLoading(false)
    }
  }, [update])

  const searchCity = useCallback(
    async (query: string) => {
      setLoading(true)
      setError(null)
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      try {
        const { forwardGeocode } = await import("@/lib/location")
        const results = await forwardGeocode(query, abortRef.current.signal)
        if (results.length > 0) {
          const loc = results[0]
          await update({
            latitude: loc.coordinates.latitude,
            longitude: loc.coordinates.longitude,
            city: loc.city,
            country: loc.country,
            locationUpdatedAt: Date.now(),
          })
          invalidateCache()
        } else {
          setError("City not found. Try a different name.")
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return
        const msg = err instanceof Error ? err.message : "Search failed"
        setError(msg)
      } finally {
        setLoading(false)
      }
    },
    [update],
  )

  const refreshPermission = useCallback(async () => {
    const state = await requestGeolocationPermission()
    setPermission(state)
  }, [])

  return {
    loading,
    error,
    permission,
    city: settings.city,
    country: settings.country,
    latitude: settings.latitude,
    longitude: settings.longitude,
    locationUpdatedAt: settings.locationUpdatedAt,
    detectLocation,
    searchCity,
    refreshPermission,
  }
}
