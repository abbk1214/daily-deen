"use client"

import { memo, useCallback, useState } from "react"
import { Check, X, Clock, Users, StickyNote, Trash2 } from "lucide-react"
import type { PrayerLog } from "@/lib/db"
import { PRAYER_NAMES } from "@/lib/prayer/history-service"
import { formatTimeFromMinutes } from "@/lib/utils"
import { markCompleted, markMissed, markQaza, markJamaah, addNote, removeNote } from "@/lib/prayer/history-service"

const PRAYER_DISPLAY: Record<string, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
}

interface PrayerDetailsProps {
  date: string
  logs: PrayerLog[]
  scheduledTimes?: Record<string, number>
  onUpdate: () => void
}

export const PrayerDetails = memo(function PrayerDetails({ date, logs, scheduledTimes, onUpdate }: PrayerDetailsProps) {
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  const handleMarkCompleted = useCallback(async (prayer: string) => {
    try {
      const scheduled = scheduledTimes?.[prayer]
      const timeStr = scheduled !== undefined ? formatTimeFromMinutes(scheduled) : ''
      await markCompleted(date, prayer, timeStr)
      onUpdate()
    } catch (err) {
      console.error("Failed to mark prayer completed:", err)
    }
  }, [date, scheduledTimes, onUpdate])

  const handleMarkMissed = useCallback(async (prayer: string) => {
    try {
      await markMissed(date, prayer)
      onUpdate()
    } catch (err) {
      console.error("Failed to mark prayer missed:", err)
    }
  }, [date, onUpdate])

  const handleMarkQaza = useCallback(async (prayer: string) => {
    try {
      const scheduled = scheduledTimes?.[prayer]
      const timeStr = scheduled !== undefined ? formatTimeFromMinutes(scheduled) : ''
      await markQaza(date, prayer, timeStr)
      onUpdate()
    } catch (err) {
      console.error("Failed to mark prayer qaza:", err)
    }
  }, [date, scheduledTimes, onUpdate])

  const handleMarkJamaah = useCallback(async (prayer: string) => {
    try {
      const scheduled = scheduledTimes?.[prayer]
      const timeStr = scheduled !== undefined ? formatTimeFromMinutes(scheduled) : ''
      await markJamaah(date, prayer, timeStr)
      onUpdate()
    } catch (err) {
      console.error("Failed to mark prayer jamaah:", err)
    }
  }, [date, scheduledTimes, onUpdate])

  const handleSaveNote = useCallback(async (prayer: string) => {
    try {
      await addNote(date, prayer, noteText)
      setEditingNote(null)
      setNoteText('')
      onUpdate()
    } catch (err) {
      console.error("Failed to save note:", err)
    }
  }, [date, noteText, onUpdate])

  const handleRemoveNote = useCallback(async (prayer: string) => {
    try {
      await removeNote(date, prayer)
      onUpdate()
    } catch (err) {
      console.error("Failed to remove note:", err)
    }
  }, [date, onUpdate])

  return (
    <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
      <h3
        className="text-foreground"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          marginBottom: 'var(--space-3)',
        }}
      >
        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </h3>

      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        {PRAYER_NAMES.map((prayer) => {
          const log = logs.find((l) => l.prayer === prayer)
          const status = log?.status ?? 'pending'
          const isEditing = editingNote === prayer

          return (
            <div
              key={prayer}
              className="rounded-md border border-border"
              style={{ padding: 'var(--space-3)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-foreground"
                    style={{
                      fontSize: 'var(--text-body)',
                      fontWeight: 500,
                      minWidth: '60px',
                    }}
                  >
                    {PRAYER_DISPLAY[prayer]}
                  </span>
                  {log?.scheduledTime && (
                    <span
                      className="text-muted-foreground"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}
                    >
                      {log.scheduledTime}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {status === 'completed' && (
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: 'var(--dd-lantern-gold)', color: 'var(--primary-foreground)' }}>
                      <Check size={12} /> Done
                    </span>
                  )}
                  {status === 'jamaah' && (
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: 'var(--dd-dusk-teal)', color: 'var(--primary-foreground)' }}>
                      <Users size={12} /> Jamaah
                    </span>
                  )}
                  {status === 'qaza' && (
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"               style={{ backgroundColor: 'var(--dd-lantern-gold)', color: 'var(--primary-foreground)' }}>
                      <Clock size={12} /> Qaza
                    </span>
                  )}
                  {status === 'missed' && (
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"               style={{ backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)' }}>
                      <X size={12} /> Missed
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1" style={{ marginTop: 'var(--space-2)' }}>
                <button
                  type="button"
                  onClick={() => handleMarkCompleted(prayer)}
                  className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Check size={12} /> Done
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkJamaah(prayer)}
                  className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Users size={12} /> Jamaah
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkQaza(prayer)}
                  className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Clock size={12} /> Qaza
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkMissed(prayer)}
                  className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ color: 'var(--destructive)' }}
                >
                  <X size={12} /> Missed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingNote(prayer)
                    setNoteText(log?.notes ?? '')
                  }}
                  className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ color: 'var(--muted-foreground)' }}
                  aria-label="Add note"
                >
                  <StickyNote size={12} />
                </button>
              </div>

              {log?.notes && !isEditing && (
                <div className="mt-2 flex items-start gap-2 rounded bg-muted" style={{ padding: 'var(--space-2)' }}>
                  <StickyNote size={12} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-foreground" style={{ fontSize: 'var(--text-body-sm)' }}>
                    {log.notes}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNote(prayer)}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Remove note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              {isEditing && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNote(prayer); if (e.key === 'Escape') setEditingNote(null) }}
                    placeholder="Add a note..."
                    className="flex-1 rounded border border-input bg-background px-2 py-1 text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:shadow-[var(--focus-ring)]"
                    style={{ fontSize: 'var(--text-body-sm)' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveNote(prayer)}
                    className="rounded bg-dusk-teal px-2 py-1 text-xs text-white transition-colors hover:opacity-90"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
