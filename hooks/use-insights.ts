"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getInsights, searchInsights } from "@/lib/insights/service"
import type { Insight, InsightsData } from "@/lib/insights/types"

export function useInsights() {
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Insight[] | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    let cancelled = false

    async function fetchData() {
      try {
        const result = await getInsights()
        if (!cancelled && mountedRef.current) {
          setData(result)
          setLoading(false)
        }
      } catch {
        if (!cancelled && mountedRef.current) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true; mountedRef.current = false }
  }, [])

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }
    try {
      const results = await searchInsights(query)
      if (mountedRef.current) setSearchResults(results)
    } catch {
      // Silently degrade
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getInsights()
      if (mountedRef.current) {
        setData(result)
        setLoading(false)
      }
    } catch {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    searchResults,
    search,
    refresh,
  }
}
