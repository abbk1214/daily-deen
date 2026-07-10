"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, Search, Filter } from "lucide-react"
import Link from "next/link"
import type { PrayerLog, PrayerStatus } from "@/lib/db"
import {
  getHistory,
  searchNotes,
} from "@/lib/prayer/history-service"
import {
  computeStatistics,
  computeWeeklyStats,
} from "@/lib/prayer/statistics"
import { computeStreaks, getWeeklyProgress } from "@/lib/prayer/streaks"
import { getToday, daysAgo, startOfWeek } from "@/lib/utils"
import { PrayerCalendar } from "@/components/prayer/calendar"
import { Heatmap } from "@/components/prayer/heatmap"
import { DonutChart, BarChart } from "@/components/prayer/charts"
import { PrayerDetails } from "@/components/prayer/prayer-details"

type FilterType = 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom'
type StatusFilter = PrayerStatus | 'all'

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
]

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Missed', value: 'missed' },
  { label: 'Qaza', value: 'qaza' },
  { label: 'Jamaah', value: 'jamaah' },
]

export default function HistoryPage() {
  const [logs, setLogs] = useState<PrayerLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<FilterType>('week')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const mountedRef = useRef(true)

  const today = getToday()

  const getDateRange = useCallback(() => {
    switch (filterType) {
      case 'today':
        return { start: today, end: today }
      case 'yesterday':
        return { start: daysAgo(1), end: daysAgo(1) }
      case 'week':
        return { start: startOfWeek(today), end: today }
      case 'month': {
        const d = new Date(today + 'T00:00:00')
        const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
        return { start, end: today }
      }
      case 'year':
        return { start: `${new Date(today + 'T00:00:00').getFullYear()}-01-01`, end: today }
      default:
        return { start: today, end: today }
    }
  }, [filterType, today])

  const loadLogs = useCallback(async () => {
    if (!mountedRef.current) return
    setLoading(true)
    try {
      const { start, end } = getDateRange()
      const statusFilterVal = statusFilter === 'all' ? undefined : statusFilter
      const data = await getHistory(start, end, {
        status: statusFilterVal,
      })
      if (mountedRef.current) setLogs(data)
    } catch (err) {
      console.error('Failed to load prayer logs:', err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [getDateRange, statusFilter])

  useEffect(() => {
    mountedRef.current = true
    const raf = requestAnimationFrame(() => {
      loadLogs()
    })
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(raf)
    }
  }, [loadLogs])

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      loadLogs()
      return
    }
    setLoading(true)
    try {
      const results = await searchNotes(searchQuery)
      if (mountedRef.current) setLogs(results)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [searchQuery, loadLogs])

  const handleUpdate = useCallback(() => {
    loadLogs()
  }, [loadLogs])

  const stats = useMemo(() => computeStatistics(logs), [logs])
  const streaks = useMemo(() => computeStreaks(logs), [logs])
  const weeklyProgress = useMemo(() => getWeeklyProgress(logs), [logs])

  const selectedDayLogs = useMemo(() => {
    if (!selectedDate) return []
    return logs.filter((l) => l.date === selectedDate)
  }, [logs, selectedDate])

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 backdrop-blur-md"
        style={{ height: 'var(--space-12)', padding: 'var(--space-3) var(--space-5)' }}
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1
          className="ml-3 text-foreground"
          style={{ fontSize: 'var(--text-body)', fontWeight: 500 }}
        >
          Prayer History
        </h1>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Filter size={20} strokeWidth={1.5} />
        </button>
      </header>

      <main
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          padding: 'var(--space-5)',
          paddingBottom: 'calc(var(--space-24) + env(safe-area-inset-bottom, 0px) + var(--space-5))',
          maxWidth: 'var(--content-narrow)',
          margin: '0 auto',
          width: '100%',
          gap: 'var(--space-6)',
        }}
      >
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              placeholder="Search notes..."
              className="w-full rounded-lg border border-input bg-background pl-9 pr-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:shadow-[var(--focus-ring)]"
              style={{ height: 'var(--space-10)', fontSize: 'var(--text-body)' }}
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
            <div className="flex flex-wrap gap-2" style={{ marginBottom: 'var(--space-3)' }}>
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilterType(opt.value)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{
                    borderColor: filterType === opt.value ? 'var(--dd-dusk-teal)' : 'var(--border)',
                    backgroundColor: filterType === opt.value ? 'var(--dd-dusk-teal)' : 'transparent',
                    color: filterType === opt.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatusFilter(opt.value)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{
                    borderColor: statusFilter === opt.value ? 'var(--dd-dusk-teal)' : 'var(--border)',
                    backgroundColor: statusFilter === opt.value ? 'var(--dd-dusk-teal)' : 'transparent',
                    color: statusFilter === opt.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
            <div className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)' }}>
              STREAK
            </div>
            <div className="font-mono text-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 600 }}>
              {streaks.current}
            </div>
            <div className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>days</div>
          </div>
          <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
            <div className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)' }}>
              COMPLETED
            </div>
            <div className="font-mono text-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 600 }}>
              {stats.completionPercent}%
            </div>
            <div className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>overall</div>
          </div>
          <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
            <div className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)' }}>
              THIS WEEK
            </div>
            <div className="font-mono text-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 600 }}>
              {weeklyProgress.percent}%
            </div>
            <div className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>{weeklyProgress.completed}/{weeklyProgress.total}</div>
          </div>
        </div>

        {/* Donut charts */}
        <div className="flex items-center justify-around">
          <DonutChart completed={stats.completedCount} total={stats.totalPrayers} label="Prayers" />
          <DonutChart completed={stats.jamaahCount} total={stats.completedCount || 1} label="Jamaah" />
          <DonutChart completed={stats.qazaCount} total={stats.totalPrayers || 1} label="Qaza" />
        </div>

        {/* Heatmap */}
        <Heatmap logs={logs} range="month" />

        {/* Calendar */}
        <PrayerCalendar
          logs={logs}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Prayer details for selected day */}
        {selectedDate && (
          <PrayerDetails
            date={selectedDate}
            logs={selectedDayLogs}
            onUpdate={handleUpdate}
          />
        )}

        {/* Weekly bar chart */}
        <BarChart
          data={computeWeeklyStats(logs, startOfWeek(today)).days.map((d) => ({
            date: d.date,
            total: d.total,
            completed: d.completed,
            missed: d.missed,
            qaza: d.qaza,
            jamaah: d.jamaah,
            percent: d.percent,
          }))}
          label="This Week"
        />

        {/* History list */}
        <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
          <h3
            className="text-foreground"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-body)',
              fontWeight: 600,
              marginBottom: 'var(--space-3)',
            }}
          >
            Recent Activity
          </h3>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-sm)' }}>
              No prayer logs found for this period.
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
              {logs.slice(0, 30).map((log) => (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => setSelectedDate(log.date)}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-left transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-foreground" style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, textTransform: 'capitalize' }}>
                      {log.prayer}
                    </span>
                    <span className="text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}>
                      {log.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.completed && (
                      <span className="rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: 'var(--dd-lantern-gold)', color: 'var(--primary-foreground)' }}>
                        Done
                      </span>
                    )}
                    {log.jamaah && (
                      <span className="rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: 'var(--dd-dusk-teal)', color: 'var(--primary-foreground)' }}>
                        Jamaah
                      </span>
                    )}
                    {log.qaza && (
                      <span className="rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: 'oklch(0.55 0.14 85)', color: 'var(--primary-foreground)' }}>
                        Qaza
                      </span>
                    )}
                    {log.missed && (
                      <span className="rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: 'oklch(0.55 0.15 25)', color: 'white' }}>
                        Missed
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
