"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSettings } from "./use-settings"
import { usePrayerTimes } from "./use-prayer-times"
import {
  getNotificationState,
  requestPermission,
  schedulePrayerNotifications,
  cancelPrayerNotifications,
  initializeNotificationService,
  registerNotificationSW,
} from "@/lib/notifications"
import type { PermissionStatus } from "@/lib/notifications"
import { getToday } from "@/lib/utils"

export interface UseNotificationsResult {
  permission: PermissionStatus
  supported: boolean
  enabled: boolean
  scheduledCount: number
  scheduleToday: () => void
  refresh: () => void
  cancelAll: () => void
  requestPermission: () => Promise<void>
}

export function useNotifications(): UseNotificationsResult {
  const { settings } = useSettings()
  const { times } = usePrayerTimes()

  const [permission, setPermission] = useState<PermissionStatus>("unsupported")
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [scheduledCount, setScheduledCount] = useState(0)

  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const syncState = useCallback(() => {
    if (!mountedRef.current) return
    const state = getNotificationState()
    setPermission(state.permission)
    setSupported(state.supported)
    setEnabled(state.enabled)
    setScheduledCount(state.scheduledCount)
  }, [])

  useEffect(() => {
    syncState()
  }, [syncState])

  const scheduleToday = useCallback(() => {
    if (!settings.notificationsEnabled) {
      cancelPrayerNotifications()
      syncState()
      return
    }

    if (!times) return

    const today = getToday()
    const count = schedulePrayerNotifications(
      times,
      settings.reminderOffset,
      today,
      settings.adhanSound,
      settings.vibrate,
      settings.silentMode ?? false,
    )
    setScheduledCount(count)
  }, [
    settings.notificationsEnabled,
    settings.reminderOffset,
    settings.adhanSound,
    settings.vibrate,
    settings.silentMode,
    times,
    syncState,
  ])

  const refresh = useCallback(() => {
    syncState()
    scheduleToday()
  }, [syncState, scheduleToday])

  const cancelAll = useCallback(() => {
    cancelPrayerNotifications()
    syncState()
  }, [syncState])

  const handleRequestPermission = useCallback(async () => {
    await requestPermission()
    syncState()
  }, [syncState])

  useEffect(() => {
    if (!settings.notificationsEnabled) {
      cancelPrayerNotifications()
      syncState()
      return
    }

    const raf = requestAnimationFrame(() => {
      scheduleToday()
    })
    return () => cancelAnimationFrame(raf)
  }, [
    settings.notificationsEnabled,
    settings.reminderOffset,
    settings.calculationMethod,
    settings.latitude,
    settings.longitude,
    settings.school,
    settings.adhanSound,
    settings.vibrate,
    settings.silentMode,
    times,
    scheduleToday,
    syncState,
  ])

  useEffect(() => {
    const cleanup = initializeNotificationService(() => {
      if (mountedRef.current) {
        scheduleToday()
      }
    })

    registerNotificationSW()

    return cleanup
  }, [scheduleToday])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [refresh])

  return {
    permission,
    supported,
    enabled,
    scheduledCount,
    scheduleToday,
    refresh,
    cancelAll,
    requestPermission: handleRequestPermission,
  }
}
