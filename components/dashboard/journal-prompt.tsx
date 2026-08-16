"use client"

import { memo, useEffect, useState } from "react"
import Link from "next/link"
import { PenLine, Check } from "lucide-react"
import { getJournalEntry } from "@/lib/journal-actions"
import { getToday } from "@/lib/utils"

interface JournalPromptProps {
  allPrayersCompleted: boolean
}

export const JournalPrompt = memo(function JournalPrompt({
  allPrayersCompleted,
}: JournalPromptProps) {
  const [hasEntry, setHasEntry] = useState<boolean | null>(null)

  useEffect(() => {
    getJournalEntry(getToday()).then((entry) => {
      setHasEntry(!!entry)
    })
  }, [])

  if (!allPrayersCompleted || hasEntry === null) return null

  if (hasEntry) {
    return (
      <Link
        href="/journal"
        className="flex items-center gap-4 rounded-2xl border border-border bg-card transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        style={{ padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}
      >
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 44,
            height: 44,
            background: "color-mix(in srgb, var(--dd-quiet-sage) 10%, transparent)",
          }}
        >
          <Check size={18} className="text-quiet-sage" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Today&apos;s reflection saved
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            Tap to edit your journal entry
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href="/journal"
      className="flex items-center gap-4 rounded-2xl border border-border bg-card transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      style={{ padding: "var(--space-5)", boxShadow: "var(--shadow-xs)" }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: 44,
          height: 44,
          background: "color-mix(in srgb, var(--dd-lantern-gold) 10%, transparent)",
        }}
      >
        <PenLine size={18} className="text-lantern-gold" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
          How was your day?
        </p>
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          Take a moment to reflect and write a journal entry
        </p>
      </div>
    </Link>
  )
})
