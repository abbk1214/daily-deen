"use client"

import { useMemo } from "react"
import { detectSeasonalMode, getSeasonalGreeting } from "@/lib/seasonal/service"

export function useSeasonal() {
  const config = useMemo(() => detectSeasonalMode(), [])
  const greeting = useMemo(() => getSeasonalGreeting(config), [config])

  return {
    config,
    greeting,
    isRamadan: config.mode === 'ramadan' || config.mode === 'last-ten-nights',
    isHajj: config.mode === 'hajj',
    isEid: config.mode === 'eid',
    isLaylatulQadr: config.mode === 'last-ten-nights',
    isActive: config.isActive,
  }
}
