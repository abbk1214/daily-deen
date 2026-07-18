"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  getTimeline,
  searchTimeline,
  filterTimeline,
  getTimelineStats,
} from "@/lib/timeline/service"
import type {
  TimelineData,
  TimelineEvent,
  TimelineFilters,
  TimelineStats,
} from "@/lib/timeline/types"

export function useTimeline() {
  const [data, setData] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchResults, setSearchResults] = useState<TimelineEvent[] | null>(null)
  const [stats, setStats] = useState<TimelineStats | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    let cancelled = false

    const controller = new AbortController()

    async function fetchData() {
      try {
        const [timeline, timelineStats] = await Promise.all([
          getTimeline(0, 3),
          getTimelineStats(),
        ])
        if (!cancelled && mountedRef.current && !controller.signal.aborted) {
          setData(timeline)
          setStats(timelineStats)
          setLoading(false)
        }
      } catch {
        if (!cancelled && mountedRef.current) setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
      mountedRef.current = false
      controller.abort()
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!data || loadingMore) return
    setLoadingMore(true)
    try {
      const more = await getTimeline(data.months.length, 3)
      if (mountedRef.current) {
        setData((prev) => {
          if (!prev) return prev
          return {
            months: [...prev.months, ...more.months],
            totalEvents: more.totalEvents,
            hasMore: more.hasMore,
          }
        })
        setLoadingMore(false)
      }
    } catch {
      if (mountedRef.current) setLoadingMore(false)
    }
  }, [data, loadingMore])

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }
    try {
      const results = await searchTimeline(query)
      if (mountedRef.current) setSearchResults(results)
    } catch {
      // Silently degrade
    }
  }, [])

  const filter = useCallback(async (filters: TimelineFilters) => {
    try {
      const result = await filterTimeline(filters)
      if (mountedRef.current) setData(result)
    } catch {
      // Silently degrade
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [timeline, timelineStats] = await Promise.all([
        getTimeline(0, 3),
        getTimelineStats(),
      ])
      if (mountedRef.current) {
        setData(timeline)
        setStats(timelineStats)
        setLoading(false)
      }
    } catch {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    loadingMore,
    searchResults,
    stats,
    loadMore,
    search,
    filter,
    refresh,
  }
}
