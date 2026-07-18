"use client"

import { memo, useEffect, useState } from "react"
import { Check, Moon } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { getToday } from "@/lib/utils"
import db from "@/lib/db"
import type { TaraweehLog } from "@/lib/seasonal/types"

export const TaraweehTracker = memo(function TaraweehTracker() {
  const [log, setLog] = useState<TaraweehLog | null>(null)

  useEffect(() => {
    const load = async () => {
      const today = getToday()
      const existing = await db.taraweeh.where('date').equals(today).first()
      if (existing) {
        setLog(existing as TaraweehLog)
      }
    }
    load()
  }, [])

  const toggle = async () => {
    const today = getToday()
    if (log?.completed) {
      setLog(null)
      await db.taraweeh.where('date').equals(today).delete()
    } else {
      const newLog: TaraweehLog = {
        date: today,
        rakat: 8,
        completed: true,
      }
      await db.taraweeh.add(newLog)
      setLog(newLog)
    }
  }

  const isCompleted = log?.completed ?? false

  return (
    <DashboardCard title="Taraweeh" ariaLabel="Taraweeh tracker">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-3 w-full rounded-xl border border-border p-3 transition-colors hover:bg-secondary"
        aria-label={isCompleted ? 'Taraweeh completed' : 'Mark Taraweeh as completed'}
      >
        <div
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{
            width: 36,
            height: 36,
            backgroundColor: isCompleted ? 'var(--dd-dusk-teal)' : 'transparent',
            color: isCompleted ? 'white' : 'var(--muted-foreground)',
            border: isCompleted ? 'none' : '1px solid var(--border)',
          }}
        >
          {isCompleted ? (
            <Check size={16} strokeWidth={2} />
          ) : (
            <Moon size={16} strokeWidth={1.5} />
          )}
        </div>
        <div className="flex-1 text-left">
          <p
            className="text-foreground"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
            }}
          >
            {isCompleted ? 'Completed' : 'Mark as completed'}
          </p>
          <p
            className="text-muted-foreground"
            style={{ fontSize: 'var(--text-caption)' }}
          >
            8 rakat — Sunnah mu&apos;akkadah
          </p>
        </div>
      </button>
    </DashboardCard>
  )
})
