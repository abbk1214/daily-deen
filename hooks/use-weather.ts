"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getWeather, getCachedWeather } from "@/lib/weather"
import type { WeatherData } from "@/lib/weather"
import { useOnlineStatus } from "@/hooks/use-online-status"

function getInitialWeather(latitude?: number, longitude?: number): WeatherData | null {
  if (typeof latitude !== "number" || typeof longitude !== "number") return null
  if (isNaN(latitude) || isNaN(longitude)) return null
  try {
    return getCachedWeather(latitude, longitude)
  } catch {
    return null
  }
}

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<WeatherData | null>(() =>
    getInitialWeather(latitude, longitude),
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOnline = useOnlineStatus()
  const abortRef = useRef<AbortController | null>(null)

  const hasCoords = typeof latitude === "number" && typeof longitude === "number" && !isNaN(latitude) && !isNaN(longitude)

  useEffect(() => {
    if (!hasCoords || !isOnline) return

    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getWeather(latitude!, longitude!, controller.signal)
        if (controller.signal.aborted) return
        setWeather(data)
        setError(null)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : "Weather unavailable")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [latitude, longitude, hasCoords, isOnline])

  const refresh = useCallback(() => {
    if (!hasCoords || !isOnline) return

    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    getWeather(latitude!, longitude!, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setWeather(data)
        setError(null)
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : "Weather unavailable")
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
  }, [latitude, longitude, hasCoords, isOnline])

  return { weather, loading, error, refresh }
}
