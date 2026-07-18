"use client"

import { memo } from "react"
import {
  Flame,
  BookOpen,
  PenLine,
  CheckCircle,
  Trophy,
  Dumbbell,
  Moon,
  Droplets,
  Calendar,
  Sparkles,
} from "lucide-react"
import type { Insight } from "@/lib/insights/types"

const ICONS: Record<string, typeof Flame> = {
  flame: Flame,
  'book-open': BookOpen,
  'pen-line': PenLine,
  'check-circle': CheckCircle,
  trophy: Trophy,
  dumbbell: Dumbbell,
  moon: Moon,
  droplets: Droplets,
  calendar: Calendar,
}

const COLORS: Record<string, { bg: string; fg: string }> = {
  'lantern-gold': { bg: 'var(--dd-lantern-gold)', fg: 'white' },
  'dusk-teal': { bg: 'var(--dd-dusk-teal)', fg: 'white' },
  'quiet-sage': { bg: 'var(--dd-quiet-sage)', fg: 'white' },
}

interface InsightCardProps {
  insight: Insight
}

export const InsightCard = memo(function InsightCard({
  insight,
}: InsightCardProps) {
  const Icon = ICONS[insight.icon] ?? Sparkles
  const color = COLORS[insight.color] ?? COLORS['lantern-gold']

  return (
    <article
      className="rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
      aria-label={insight.title}
    >
      <div className="flex gap-3">
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            backgroundColor: color.bg,
            color: color.fg,
          }}
        >
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-foreground"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 600,
                lineHeight: 'var(--leading-tight)',
              }}
            >
              {insight.title}
            </h3>
            {insight.priority === 'high' && (
              <span
                className="flex-shrink-0 rounded-full px-2 py-0.5"
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  backgroundColor: 'var(--dd-lantern-gold)',
                  color: 'white',
                }}
              >
                NEW
              </span>
            )}
          </div>
          <p
            className="text-muted-foreground"
            style={{
              fontSize: 'var(--text-caption)',
              marginTop: 'var(--space-1)',
              lineHeight: 'var(--leading-normal)',
            }}
          >
            {insight.description}
          </p>
          {insight.type === 'correlation' && insight.metadata && (
            <div
              className="flex items-center gap-2 mt-2"
              style={{ fontSize: 'var(--text-caption)' }}
            >
              <span
                className="rounded-full px-2 py-0.5"
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                }}
              >
                {insight.metadata.direction === 'positive' ? '↑' : '↓'}{' '}
                {Math.round((insight.metadata.strength as number) * 100)}% effect
              </span>
              <span className="text-muted-foreground">
                n={insight.metadata.sampleSize as number}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
})
