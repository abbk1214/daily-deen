"use client"

import { useCallback, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTimeline } from "@/hooks/use-timeline"
import { TimelineSearch } from "@/components/timeline/timeline-search"
import { TimelineFilters } from "@/components/timeline/timeline-filters"
import { TimelineStatsBar } from "@/components/timeline/timeline-stats"
import { TimelineMonthSection } from "@/components/timeline/timeline-month-section"
import { TimelineEmpty } from "@/components/timeline/timeline-empty"
import type { TimelineEventType } from "@/lib/timeline/types"

export default function TimelinePage() {
  const {
    data,
    loading,
    loadingMore,
    searchResults,
    stats,
    loadMore,
    search,
    filter,
  } = useTimeline()

  const [activeFilters, setActiveFilters] = useState<TimelineEventType[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      search(query)
    },
    [search],
  )

  const handleFilterChange = useCallback(
    (types: TimelineEventType[]) => {
      setActiveFilters(types)
      filter({ types, searchQuery })
    },
    [filter, searchQuery],
  )

  const displayEvents = searchQuery ? searchResults : null
  const showEmpty = !loading && (!data || data.months.length === 0) && !displayEvents

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: 'var(--space-12)',
          padding: 'var(--space-3) var(--space-5)',
        }}
        role="banner"
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
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-h4)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Timeline
        </h1>
      </header>

      {/* Main content */}
      <main
        id="timeline"
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          padding: 'var(--space-5)',
          paddingBottom: 'calc(var(--space-14) + env(safe-area-inset-bottom, 0px) + var(--space-5))',
          maxWidth: 'var(--content-reading)',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <TimelineSearch onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <TimelineFilters active={activeFilters} onChange={handleFilterChange} />
        </div>

        {/* Stats */}
        {stats && !searchQuery && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <TimelineStatsBar stats={stats} />
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-4">
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search results */}
        {displayEvents && displayEvents.length > 0 && (
          <div className="flex flex-col">
            {displayEvents.map((event) => (
              <TimelineMonthSection
                key={event.id}
                month={{
                  year: new Date(event.date + 'T00:00:00').getFullYear(),
                  month: new Date(event.date + 'T00:00:00').getMonth() + 1,
                  label: new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  }),
                  events: [event],
                }}
              />
            ))}
          </div>
        )}

        {/* Timeline months */}
        {!loading && data && !searchQuery && (
          <div className="flex flex-col">
            {data.months.map((month) => (
              <TimelineMonthSection key={`${month.year}-${month.month}`} month={month} />
            ))}

            {/* Load more */}
            {data.hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full rounded-2xl border border-border bg-card py-4 text-center transition-colors hover:bg-secondary disabled:opacity-50"
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 500,
                  color: 'var(--dd-dusk-teal)',
                  cursor: loadingMore ? 'wait' : 'pointer',
                  background: 'none',
                  border: '1px solid var(--border)',
                }}
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {showEmpty && <TimelineEmpty isSearch={!!searchQuery} />}
      </main>
    </div>
  )
}
