"use client"

import { memo } from "react"
import { Play, Pause, SkipForward, SkipBack, Gauge } from "lucide-react"
import type { Reciter } from "@/lib/quran/types"

type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5

const SPEED_OPTIONS: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5]
const SPEED_LABELS: Record<PlaybackSpeed, string> = {
  0.5: "0.5×",
  0.75: "0.75×",
  1: "1×",
  1.25: "1.25×",
  1.5: "1.5×",
}

interface AudioPlayerBarProps {
  /** Currently playing ayah number (surah-local), or null */
  currentAyah: number | null
  /** Total ayahs in current surah */
  totalAyahs: number
  /** Is audio playing */
  isPlaying: boolean
  /** Is audio loading */
  loading: boolean
  /** Current playback speed */
  playbackSpeed: PlaybackSpeed
  /** Selected reciter */
  reciter: Reciter
  /** Play/pause toggle */
  onTogglePlay: () => void
  /** Go to next ayah */
  onNext: () => void
  /** Go to previous ayah */
  onPrev: () => void
  /** Change playback speed */
  onSpeedChange: (speed: PlaybackSpeed) => void
  /** Change reciter */
  onReciterChange: (reciterId: string) => void
  /** Available reciters */
  reciters: Reciter[]
}

export const AudioPlayerBar = memo(function AudioPlayerBar({
  currentAyah,
  totalAyahs,
  isPlaying,
  loading,
  playbackSpeed,
  reciter,
  onTogglePlay,
  onNext,
  onPrev,
  onSpeedChange,
  onReciterChange,
  reciters,
}: AudioPlayerBarProps) {
  if (currentAyah === null) return null

  const speedIndex = SPEED_OPTIONS.indexOf(playbackSpeed)
  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEED_OPTIONS.length
    onSpeedChange(SPEED_OPTIONS[nextIndex])
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm"
      style={{
        padding: "var(--space-3) var(--space-4)",
        paddingBottom: "calc(var(--space-3) + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: "var(--content-reading)", gap: "var(--space-3)" }}
      >
        {/* Ayah info */}
        <div className="min-w-0 flex-1">
          <p
            className="text-foreground truncate"
            style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
          >
            Ayah {currentAyah} / {totalAyahs}
          </p>
          <p
            className="text-muted-foreground truncate"
            style={{ fontSize: "var(--text-caption)" }}
          >
            {reciter.name}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center" style={{ gap: "var(--space-2)" }}>
          <button
            onClick={onPrev}
            disabled={currentAyah <= 1}
            className="flex items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted disabled:opacity-30"
            style={{ width: 36, height: 36 }}
            aria-label="Previous ayah"
          >
            <SkipBack size={16} strokeWidth={1.5} />
          </button>

          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
            style={{ width: 44, height: 44 }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : isPlaying ? (
              <Pause size={18} strokeWidth={2} />
            ) : (
              <Play size={18} strokeWidth={2} style={{ marginLeft: 2 }} />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentAyah >= totalAyahs}
            className="flex items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted disabled:opacity-30"
            style={{ width: 36, height: 36 }}
            aria-label="Next ayah"
          >
            <SkipForward size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Speed + Reciter */}
        <div className="flex items-center" style={{ gap: "var(--space-2)" }}>
          <button
            onClick={cycleSpeed}
            className="flex items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
            style={{ width: 36, height: 36 }}
            aria-label={`Playback speed: ${playbackSpeed}×`}
          >
            <span style={{ fontSize: "10px", fontWeight: 600 }}>
              {SPEED_LABELS[playbackSpeed]}
            </span>
          </button>

          <select
            value={reciter.id}
            onChange={(e) => onReciterChange(e.target.value)}
            className="rounded-lg border border-border bg-background text-foreground"
            style={{
              padding: "var(--space-1) var(--space-2)",
              fontSize: "var(--text-caption)",
              maxWidth: 120,
            }}
            aria-label="Select reciter"
          >
            {reciters.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name.split(" ").slice(-1)[0]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
})
