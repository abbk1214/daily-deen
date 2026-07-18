"use client"

import { memo } from "react"
import { TimelineEventCard } from "./timeline-event-card"
import type { TimelineMonth } from "@/lib/timeline/types"

interface TimelineMonthSectionProps {
  month: TimelineMonth
}

export const TimelineMonthSection = memo(function TimelineMonthSection({
  month,
}: TimelineMonthSectionProps) {
  return (
    <section aria-label={month.label} style={{ marginBottom: 'var(--space-8)' }}>
      <h2
        className="text-muted-foreground"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-caption)',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-4)',
          paddingBottom: 'var(--space-2)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {month.label}
      </h2>
      <div className="flex flex-col">
        {month.events.map((event) => (
          <TimelineEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
})
