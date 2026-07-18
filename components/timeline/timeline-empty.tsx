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
          : 'As you use Daily Deen, your story will unfold here — streaks, milestones, and memories.'}
      </p>
    </div>
  )
})
