"use client"

import { memo } from "react"
import { Sparkles } from "lucide-react"

interface TimelineEmptyProps {
  isSearch: boolean
}

export const TimelineEmpty = memo(function TimelineEmpty({
  isSearch,
}: TimelineEmptyProps) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <Sparkles
        size={40}
        strokeWidth={1}
        className="text-muted-foreground"
        style={{ marginBottom: 'var(--space-4)' }}
      />
      <h2
        className="text-foreground"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-h4)',
          fontWeight: 600,
          marginBottom: 'var(--space-2)',
        }}
      >
        {isSearch ? 'No results found' : 'Your journey begins here'}
      </h2>
      <p
        className="text-muted-foreground"
        style={{
          fontSize: 'var(--text-body-sm)',
          maxWidth: '30ch',
        }}
      >
        {isSearch
          ? 'Try a different search term.'
          : 'Prayers, habits, and milestones will appear here as you use Daily Deen.'}
      </p>
    </div>
  )
})
