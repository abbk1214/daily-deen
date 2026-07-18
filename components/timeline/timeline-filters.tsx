"use client"

import { memo } from "react"
import {
  Flame,
  BookOpen,
  PenLine,
  CheckCircle,
  Dumbbell,
  Moon,
  Droplets,
} from "lucide-react"
import type { TimelineEventType } from "@/lib/timeline/types"

interface FilterChip {
  type: TimelineEventType
  label: string
  icon: typeof Flame
}

const FILTERS: FilterChip[] = [
  { type: "prayer_streak", label: "Prayer", icon: Flame },
  { type: "quran_milestone", label: "Quran", icon: BookOpen },
  { type: "journal_entry", label: "Journal", icon: PenLine },
  { type: "habit_milestone", label: "Habits", icon: CheckCircle },
  { type: "exercise_entry", label: "Exercise", icon: Dumbbell },
  { type: "sleep_milestone", label: "Sleep", icon: Moon },
  { type: "water_milestone", label: "Water", icon: Droplets },
]

interface TimelineFiltersProps {
  active: TimelineEventType[]
  onChange: (types: TimelineEventType[]) => void
}

export const TimelineFilters = memo(function TimelineFilters({
  active,
  onChange,
}: TimelineFiltersProps) {
  const toggle = (type: TimelineEventType) => {
    if (active.includes(type)) {
      onChange(active.filter((t) => t !== type))
    } else {
      onChange([...active, type])
    }
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto"
      style={{ paddingBottom: 'var(--space-2)' }}
      role="group"
      aria-label="Filter timeline by type"
    >
      {FILTERS.map(({ type, label, icon: Icon }) => {
        const isActive = active.includes(type)
        return (
          <button
            key={type}
            type="button"
            onClick={() => toggle(type)}
            aria-pressed={isActive}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors flex-shrink-0"
            style={{
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              cursor: 'pointer',
              background: isActive ? 'var(--dd-dusk-teal)' : 'transparent',
              color: isActive ? 'white' : 'var(--muted-foreground)',
              borderColor: isActive ? 'var(--dd-dusk-teal)' : 'var(--border)',
            }}
          >
            <Icon size={12} strokeWidth={1.5} />
            {label}
          </button>
        )
      })}
    </div>
  )
})
