"use client"

import { useCallback, useState } from "react"
import { ArrowLeft, Search, X } from "lucide-react"
import Link from "next/link"
import { useInsights } from "@/hooks/use-insights"
import { InsightCard } from "@/components/insights/insight-card"
import { ReportCard } from "@/components/insights/report-card"
import { Sparkles } from "lucide-react"

export default function InsightsPage() {
  const { data, loading, searchResults, search } = useInsights()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value
      setSearchQuery(query)
      search(query)
    },
    [search],
  )

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    search("")
  }, [search])

  const displayInsights = searchQuery ? searchResults : data?.insights ?? []

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: 'var(--space-12)',
          padding: 'var(--space-3) var(--space-5)',
        }}
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
          Insights
        </h1>
      </header>

      {/* Main content */}
      <main
        id="insights"
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
        <div
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4"
          style={{ height: 44, marginBottom: 'var(--space-4)' }}
        >
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search insights..."
            aria-label="Search insights"
            className="flex-1 bg-transparent outline-none text-foreground"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontFamily: 'var(--font-body)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              style={{ width: 24, height: 24, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading insights">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports */}
        {!loading && !searchQuery && data && (
          <div className="flex flex-col gap-4" style={{ marginBottom: 'var(--space-6)' }}>
            {data.weeklyReport && <ReportCard report={data.weeklyReport} />}
            {data.monthlyReport && <ReportCard report={data.monthlyReport} />}
          </div>
        )}

        {/* Insights */}
        {!loading && displayInsights && displayInsights.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2
              className="text-muted-foreground"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-2)',
              }}
            >
              {searchQuery ? 'Search Results' : 'Discoveries'}
            </h2>
            {displayInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && displayInsights && displayInsights.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <Sparkles
              size={48}
              strokeWidth={1}
              className="text-muted-foreground"
              style={{ marginBottom: 'var(--space-4)' }}
            />
            <h2
              className="text-foreground"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-h3)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-h3)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {searchQuery ? 'No matching insights' : 'Insights appear over time'}
            </h2>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--text-body-sm)',
                maxWidth: '30ch',
              }}
            >
              {searchQuery
                ? 'Try a different search term.'
                : 'As you use Daily Deen, we\'ll detect patterns, correlations, and milestones in your data.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
