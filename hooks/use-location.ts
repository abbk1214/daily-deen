"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSettings } from "./use-settings"
import { useOnlineStatus } from "./use-online-status"
import {
  getCurrentPosition,
  reverseGeocode,
  forwardGeocode,
  requestGeolocationPermission,
  onPermissionChange,
  getCachedLocation,
  setCachedLocation,
} from "@/lib/location"
import { invalidateCache } from "@/lib/prayer"
import type { PermissionState } from "@/lib/location"

export interface LocationState {
  loading: boolean
  error: string | null
  permission: PermissionState
  city: string
  country: string
  latitude: number
  longitude: number
  timezone: string
  locationUpdatedAt: number
  accuracy: number
  isManualOverride: boolean
  isOnline: boolean
  retryCount: number
}

export function useLocation() {
  const { settings, update } = useSettings()
  const isOnline = useOnlineStatus()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permission, setPermission] = useState<PermissionState>("prompt")
  const [retryCount, setRetryCount] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)
  const autoDetectDoneRef = useRef(false)

  // Check initial permission on mount
  useEffect(() => {
    mountedRef.current = true
    requestGeolocationPermission().then((state) => {
      if (mountedRef.current) setPermission(state)
    })
    return () => { mountedRef.current = false }
  }, [])

  // Listen for permission changes
  useEffect(() => {
    return onPermissionChange((state) => {
      if (mountedRef.current) setPermission(state)
    })
  }, [])

  const detectLocation = useCallback(async (): Promise<boolean> => {
    if (!isOnline) {
      setError("Offline — cannot detect location")
      return false
    }

    setLoading(true)
    setError(null)
    setRetryCount(0)
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const geo = await getCurrentPosition({
        highAccuracy: true,
        timeout: 15000,
        signal: abortRef.current.signal,
      })

      if (!mountedRef.current) return true
      setPermission("granted")

      const geoResult = await reverseGeocode(
        geo.coordinates,
        abortRef.current.signal,
      )

      if (!mountedRef.current) return true

      await update({
        latitude: geo.coordinates.latitude,
        longitude: geo.coordinates.longitude,
        city: geoResult.city,
        country: geoResult.country,
        timezone: geoResult.timezone,
        accuracy: geo.accuracy,
        locationUpdatedAt: Date.now(),
        locationManualOverride: false,
      })

      setCachedLocation({
        latitude: geo.coordinates.latitude,
        longitude: geo.coordinates.longitude,
        city: geoResult.city,
        country: geoResult.country,
        timezone: geoResult.timezone,
        accuracy: geo.accuracy,
      })

      invalidateCache()
      return true
    } catch (err: unknown) {
      if (!mountedRef.current) return false
      if (err instanceof Error && err.name === "AbortError") return false

      const msg = err instanceof Error ? err.message : "Failed to detect location"
      setError(msg)
      if (msg.includes("denied")) setPermission("denied")
      return false
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [isOnline, update])

  // Auto-detect on first visit (no manual override, no existing location)
  useEffect(() => {
    if (autoDetectDoneRef.current) return
    if (settings.locationManualOverride) return
    if (settings.latitude !== 0 && settings.longitude !== 0) return
    autoDetectDoneRef.current = true

    const cached = getCachedLocation()
    if (cached) {
      update({
        latitude: cached.latitude,
        longitude: cached.longitude,
        city: cached.city,
        country: cached.country,
        timezone: cached.timezone,
        accuracy: cached.accuracy,
        locationUpdatedAt: cached.timestamp,
      })
      invalidateCache()
      return
    }

    if (permission === "denied" || permission === "unavailable") return

    // Defer to avoid setState-in-effect
    const raf = requestAnimationFrame(() => {
      detectLocation()
    })
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission, settings.latitude, settings.longitude, settings.locationManualOverride])

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1)
    detectLocation()
  }, [detectLocation])

  const searchCity = useCallback(
    async (query: string) => {
      if (!isOnline) {
        setError("Offline — cannot search cities")
        return
      }

      setLoading(true)
      setError(null)
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      try {
        const results = await forwardGeocode(query, abortRef.current.signal)
        if (!mountedRef.current) return

        if (results.length > 0) {
          const loc = results[0]
          await update({
            latitude: loc.coordinates.latitude,
            longitude: loc.coordinates.longitude,
            city: loc.city,
            country: loc.country,
            timezone: loc.timezone,
            locationUpdatedAt: Date.now(),
            locationManualOverride: true,
          })

          setCachedLocation({
            latitude: loc.coordinates.latitude,
            longitude: loc.coordinates.longitude,
            city: loc.city,
            country: loc.country,
            timezone: loc.timezone,
            accuracy: 0,
          })

          invalidateCache()
        } else {
          setError("City not found. Try a different name.")
        }
      } catch (err: unknown) {
        if (!mountedRef.current) return
        if (err instanceof Error && err.name === "AbortError") return
        const msg = err instanceof Error ? err.message : "Search failed"
        setError(msg)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    },
    [isOnline, update],
  )

  const setManualCoordinates = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true)
      setError(null)
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      try {
        const geoResult = await reverseGeocode(
          { latitude, longitude },
          abortRef.current.signal,
        )

        if (!mountedRef.current) return

        await update({
          latitude,
          longitude,
          city: geoResult.city,
          country: geoResult.country,
          timezone: geoResult.timezone,
          locationUpdatedAt: Date.now(),
          locationManualOverride: true,
        })

        setCachedLocation({
          latitude,
          longitude,
          city: geoResult.city,
          country: geoResult.country,
          timezone: geoResult.timezone,
          accuracy: 0,
        })

        invalidateCache()
      } catch (err: unknown) {
        if (!mountedRef.current) return
        if (err instanceof Error && err.name === "AbortError") return

        // Even if reverse geocode fails, save the raw coordinates
        await update({
          latitude,
          longitude,
          city: "",
          country: "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          locationUpdatedAt: Date.now(),
          locationManualOverride: true,
        })
        invalidateCache()
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    },
    [update],
  )

  const clearManualOverride = useCallback(() => {
    update({ locationManualOverride: false })
    detectLocation()
  }, [update, detectLocation])

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
    timezone: settings.timezone,
    locationUpdatedAt: settings.locationUpdatedAt,
    accuracy: settings.accuracy,
    isManualOverride: settings.locationManualOverride,
    isOnline,
    retryCount,
    detectLocation,
    retry,
    searchCity,
    setManualCoordinates,
    clearManualOverride,
    refreshPermission,
  }
}
