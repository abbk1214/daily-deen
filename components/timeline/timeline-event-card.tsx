"use client"

import { memo } from "react"
import {
  Flame,
  BookOpen,
  PenLine,
  CheckCircle,
  Trophy,
  Droplets,
  Dumbbell,
  Moon,
  BookCheck,
  Sparkles,
} from "lucide-react"
import type { TimelineEvent } from "@/lib/timeline/types"

const ICONS: Record<string, typeof Flame> = {
  flame: Flame,
  'book-open': BookOpen,
  'pen-line': PenLine,
  'check-circle': CheckCircle,
  trophy: Trophy,
  droplets: Droplets,
  dumbbell: Dumbbell,
  moon: Moon,
  'book-check': BookCheck,
}

const COLORS: Record<string, { bg: string; fg: string }> = {
  'lantern-gold': { bg: 'var(--dd-lantern-gold)', fg: 'white' },
  'dusk-teal': { bg: 'var(--dd-dusk-teal)', fg: 'white' },
  'quiet-sage': { bg: 'var(--dd-quiet-sage)', fg: 'white' },
}

interface TimelineEventCardProps {
  event: TimelineEvent
}

export const TimelineEventCard = memo(function TimelineEventCard({
  event,
}: TimelineEventCardProps) {
  const Icon = ICONS[event.icon] ?? Sparkles
  const color = COLORS[event.color] ?? COLORS['lantern-gold']

  return (
    <article
      className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
      style={{ marginBottom: 'var(--space-3)' }}
      aria-label={event.title}
    >
      <div
        className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{
          width: 44,
          height: 44,
          backgroundColor: color.bg,
          color: color.fg,
        }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="text-foreground"
          style={{
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            lineHeight: 'var(--leading-tight)',
          }}
        >
          {event.title}
        </h3>
        {event.subtitle && (
          <p
            className="text-muted-foreground"
            style={{ fontSize: 'var(--text-caption)', marginTop: 'var(--space-1)' }}
          >
            {event.subtitle}
          </p>
        )}
        {event.description && (
          <p
            className="text-muted-foreground"
            style={{ fontSize: 'var(--text-caption)', marginTop: 'var(--space-1)' }}
          >
            {event.description}
          </p>
        )}
      </div>
      <time
        dateTime={event.date}
        className="text-muted-foreground flex-shrink-0"
        style={{
          fontSize: 'var(--text-caption)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </time>
    </article>
  )
})
