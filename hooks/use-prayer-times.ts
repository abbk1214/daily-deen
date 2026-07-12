"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSettings } from "./use-settings"
import { getPrayerTimes, invalidateCache } from "@/lib/prayer"
import type { PrayerTimes } from "@/lib/prayer"

export interface UsePrayerTimesResult {
  times: PrayerTimes | null
  loading: boolean
  error: string | null
  nextPrayer: { name: string; minutesUntil: number } | null
  refresh: () => void
}

export function usePrayerTimes(): UsePrayerTimesResult {
  const { settings } = useSettings()
  const [times, setTimes] = useState<PrayerTimes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nowMinutes, setNowMinutes] = useState(() => {
    const d = new Date()
    return d.getHours() * 60 + d.getMinutes()
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date()
      setNowMinutes(d.getHours() * 60 + d.getMinutes())
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  const compute = useCallback(() => {
    if (!settings.latitude && !settings.longitude) {
      setTimes(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = getPrayerTimes({
        date: new Date(),
        latitude: settings.latitude,
        longitude: settings.longitude,
        timezone: settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        method: settings.calculationMethod,
        school: settings.school,
        adjustments: settings.prayerAdjustments,
      })
      setTimes(result)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to compute prayer times"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [settings.latitude, settings.longitude, settings.calculationMethod, settings.school, settings.timezone, settings.prayerAdjustments])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      compute()
    })
    return () => cancelAnimationFrame(raf)
  }, [compute])

  useEffect(() => {
    const onSettingsChange = () => {
      invalidateCache()
      compute()
    }
    window.addEventListener("prayer-settings-changed", onSettingsChange)
    return () => window.removeEventListener("prayer-settings-changed", onSettingsChange)
  }, [compute])

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const nextPrayer = useMemo(() => {
    if (!times) return null
    const keys = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const
    for (const key of keys) {
      if (nowMinutes < times[key]) {
        return {
          name: key.charAt(0).toUpperCase() + key.slice(1),
          minutesUntil: times[key] - nowMinutes,
        }
      }
    }
    return {
      name: "Fajr",
      minutesUntil: 24 * 60 - nowMinutes + times.fajr,
    }
  }, [times, nowMinutes])

  const refresh = useCallback(() => {
    invalidateCache()
    compute()
  }, [compute])

  return {
    times,
    loading,
    error,
    nextPrayer,
    refresh,
  }
}
