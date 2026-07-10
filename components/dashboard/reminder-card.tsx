"use client"

import { memo, useEffect, useState } from "react"
import { PenLine, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "./dashboard-card"
import { getToday } from "@/lib/utils"

interface JournalReminderCardProps {
  loading: boolean
}

export const JournalReminderCard = memo(function JournalReminderCard({
  loading,
}: JournalReminderCardProps) {
  const router = useRouter()
  const [hasEntry, setHasEntry] = useState<boolean | null>(null)

  useEffect(() => {
    const checkJournal = async () => {
      try {
        const { getJournalEntry } = await import("@/lib/journal-actions")
        const today = getToday()
        const entry = await getJournalEntry(today)
        setHasEntry(!!entry)
      } catch {
        setHasEntry(false)
      }
    }
    checkJournal()
  }, [])

  if (loading || hasEntry === null) return null
  if (hasEntry) return null

  return (
    <DashboardCard title="Journal" ariaLabel="Journal reminder">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 48,
            height: 48,
            backgroundColor: "var(--dd-dusk-teal)",
            color: "var(--accent-foreground)",
          }}
        >
          <PenLine size={24} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p
            className="text-foreground"
            style={{
              fontSize: "var(--text-body-sm)",
              fontWeight: 500,
              lineHeight: "var(--leading-snug)",
            }}
          >
            How was your day?
          </p>
          <p
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            Take a moment to reflect and write.
          </p>
        </div>
        <button
          onClick={() => router.push("/journal")}
          aria-label="Write journal entry"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring shrink-0"
          style={{
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            minHeight: 40,
            backgroundColor: "var(--muted)",
          }}
        >
          <PenLine size={14} strokeWidth={1.5} />
          Write
        </button>
      </div>
    </DashboardCard>
  )
})

interface QuranReminderCardProps {
  loading: boolean
}

export const QuranReminderCard = memo(function QuranReminderCard({
  loading,
}: QuranReminderCardProps) {
  if (loading) return null

  return (
    <DashboardCard title="Daily Reminder" ariaLabel="Daily Quran reminder">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 48,
            height: 48,
            backgroundColor: "var(--dd-quiet-sage)",
            color: "var(--primary-foreground)",
          }}
        >
          <BookOpen size={24} strokeWidth={1.5} />
        </div>
        <div>
          <p
            className="text-foreground"
            style={{
              fontSize: "var(--text-body-sm)",
              fontWeight: 500,
              lineHeight: "var(--leading-snug)",
            }}
          >
            Read a page of Quran today
          </p>
          <p
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            Even one verse brings barakah to your day.
          </p>
        </div>
      </div>
    </DashboardCard>
  )
})
