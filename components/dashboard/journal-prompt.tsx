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
        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-quiet-sage/10">
          <Check size={20} className="text-quiet-sage" strokeWidth={1.5} />
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
      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lantern-gold/10">
        <PenLine size={20} className="text-lantern-gold" strokeWidth={1.5} />
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
