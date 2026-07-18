"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Play, Pause, Settings2, ChevronLeft, ChevronRight } from "lucide-react"
import { getJuzInfo, getJuzName, getAyahsInJuz } from "@/lib/quran/metadata"
import { fetchAyahs, fetchTranslation } from "@/lib/quran/api"
import { getSurahMeta } from "@/lib/quran/data"
import type { Ayah, AyahTranslation } from "@/lib/quran/types"
import { useVirtualizer } from "@tanstack/react-virtual"
import { getQuranSettings, saveQuranSettings } from "@/lib/db"
import { RECITERS, TRANSLATIONS } from "@/lib/quran/types"

export default function JuzReaderPage() {
  const params = useParams()
  const juzId = Number(params.juzId)

  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [translations, setTranslations] = useState<AyahTranslation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTranslation, setShowTranslation] = useState(true)
  const [fontSize, setFontSize] = useState(28)
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy")
  const [selectedTranslation, setSelectedTranslation] = useState("en.sahih")
  const [playingAyah, setPlayingAyah] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ayahsRef = useRef<Ayah[]>([])
  const juzInfo = getJuzInfo(juzId)

  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: ayahs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  })

  useEffect(() => {
    ayahsRef.current = ayahs
  }, [ayahs])

  // Load Quran settings
  useEffect(() => {
    getQuranSettings().then((s) => {
      setSelectedReciter(s.selectedReciter)
      setSelectedTranslation(s.selectedTranslation)
      setFontSize(s.fontSize)
      setShowTranslation(s.showTranslation)
    })
  }, [])

  useEffect(() => {
    if (!juzInfo || isNaN(juzId)) return
    let cancelled = false

    const ayahPairs = getAyahsInJuz(juzId)
    // Group by surah
    const surahGroups = new Map<number, number[]>()
    for (const { surah, ayah } of ayahPairs) {
      const arr = surahGroups.get(surah) || []
      arr.push(ayah)
      surahGroups.set(surah, arr)
    }

    setIsLoading(true)
    setError(null)

    const surahNumbers = [...surahGroups.keys()]
    Promise.all(
      surahNumbers.map((s) =>
        Promise.all([fetchAyahs(s), fetchTranslation(s, selectedTranslation)])
          .then(([a, t]) => {
            const validAyahs = surahGroups.get(s) || []
            const ayahSet = new Set(validAyahs)
            return {
              ayahs: a.filter((x) => ayahSet.has(x.numberInSurah)),
              translations: t.filter((x) => ayahSet.has(x.ayahNumber)),
            }
          })
      )
    )
      .then((results) => {
        if (cancelled) return
        const allAyahs = results.flatMap((r) => r.ayahs)
        const allTrans = results.flatMap((r) => r.translations)
        setAyahs(allAyahs)
        setTranslations(allTrans)
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError((err as Error).message)
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [juzId, selectedTranslation])

  const playAyah = useCallback((ayahNumber: number) => {
    if (audioRef.current) audioRef.current.pause()
    const ayah = ayahsRef.current.find((a) => a.numberInSurah === ayahNumber && a.number === ayahNumber)
    if (!ayah) {
      // Find by global number
      const found = ayahsRef.current.find((a) => a.number === ayahNumber)
      if (!found) return
      const reciter = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0]
      const audio = new Audio(`${reciter.baseUrl}/${found.number}.mp3`)
      audioRef.current = audio
      setPlayingAyah(found.number)
      audio.play().catch(() => setPlayingAyah(null))
      audio.onerror = () => setPlayingAyah(null)
      audio.onended = () => setPlayingAyah(null)
      return
    }
    const reciter = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0]
    const audio = new Audio(`${reciter.baseUrl}/${ayah.number}.mp3`)
    audioRef.current = audio
    setPlayingAyah(ayah.number)
    audio.play().catch(() => setPlayingAyah(null))
    audio.onerror = () => setPlayingAyah(null)
    audio.onended = () => setPlayingAyah(null)
  }, [selectedReciter])

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayingAyah(null)
  }, [])

  if (isNaN(juzId) || juzId < 1 || juzId > 30) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-5">
        <p className="text-muted-foreground">Invalid Juz number</p>
        <Link href="/quran/juz" className="mt-4 text-dusk-teal underline">Back to Juz list</Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-5">
        <div aria-busy="true" className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        <p className="mt-3 text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
          Loading Juz {juzId}...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-5" role="alert">
        <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)" }}>Failed to load</p>
        <p className="mt-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>{error}</p>
        <Link href="/quran/juz" className="mt-4 text-dusk-teal underline text-sm">Back</Link>
      </div>
    )
  }

  const transMap = new Map(translations.map((t) => [t.ayahNumber, t.text]))
  let lastSurah = 0

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}
      >
        <Link
          href="/quran/juz"
          aria-label="Back to Juz list"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <div className="ml-3 flex-1 min-w-0">
          <h1
            className="text-foreground truncate"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h5)", fontWeight: 600 }}
          >
            Juz {juzId}
          </h1>
          <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
            {getJuzName(juzId)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {juzId > 1 && (
            <Link
              href={`/quran/juz/${juzId - 1}`}
              aria-label="Previous juz"
              className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary"
            >
              <ChevronLeft size={18} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Reading settings"
            aria-expanded={showSettings}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Settings2 size={18} strokeWidth={1.5} />
          </button>
          {juzId < 30 && (
            <Link
              href={`/quran/juz/${juzId + 1}`}
              aria-label="Next juz"
              className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary"
            >
              <ChevronRight size={18} />
            </Link>
          )}
        </div>
      </header>

      {showSettings && (
        <div className="border-b border-border bg-card px-5 py-4 space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Show Translation
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={showTranslation}
              onClick={() => {
                const v = !showTranslation
                setShowTranslation(v)
                saveQuranSettings({ showTranslation: v })
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                showTranslation ? "bg-dusk-teal text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {showTranslation ? "On" : "Off"}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Translation
            </label>
            <select
              value={selectedTranslation}
              onChange={(e) => {
                setSelectedTranslation(e.target.value)
                saveQuranSettings({ selectedTranslation: e.target.value })
              }}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {TRANSLATIONS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Reciter
            </label>
            <select
              value={selectedReciter}
              onChange={(e) => {
                setSelectedReciter(e.target.value)
                saveQuranSettings({ selectedReciter: e.target.value })
              }}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Arabic Size
            </label>
            <input
              type="range"
              min={20}
              max={48}
              value={fontSize}
              onChange={(e) => {
                const v = Number(e.target.value)
                setFontSize(v)
                saveQuranSettings({ fontSize: v })
              }}
              className="flex-1 accent-[var(--dd-dusk-teal)]"
            />
            <span className="text-muted-foreground w-8 text-right" style={{ fontSize: "var(--text-caption)" }}>
              {fontSize}
            </span>
          </div>
        </div>
      )}

      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
        style={{ contain: "strict" }}
      >
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const ayah = ayahs[virtualRow.index]
            if (!ayah) return null
            const showSurahHeader = ayah.surahNumber !== lastSurah
            if (showSurahHeader) lastSurah = ayah.surahNumber
            const trans = transMap.get(ayah.numberInSurah)
            const isPlaying = playingAyah === ayah.number
            const surahMeta = getSurahMeta(ayah.surahNumber)

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {showSurahHeader && (
                  <div className="border-b border-border bg-card px-5 py-3">
                    <p className="text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
                      {surahMeta?.englishName ?? `Surah ${ayah.surahNumber}`}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                      {surahMeta?.englishNameTranslation} · {surahMeta?.revelationType}
                    </p>
                  </div>
                )}
                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => isPlaying ? stopPlayback() : playAyah(ayah.number)}
                      aria-label={isPlaying ? `Pause ayah ${ayah.numberInSurah}` : `Play ayah ${ayah.numberInSurah}`}
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isPlaying
                          ? "bg-dusk-teal text-white"
                          : "bg-secondary text-muted-foreground hover:bg-dusk-teal/10 hover:text-dusk-teal"
                      }`}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-foreground leading-relaxed"
                        dir="rtl"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: `${fontSize}px`,
                          fontWeight: 600,
                          lineHeight: 1.8,
                        }}
                      >
                        {ayah.text}
                      </p>
                      {showTranslation && trans && (
                        <p className="mt-2 text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.6 }}>
                          {trans}
                        </p>
                      )}
                      <p className="mt-1 text-muted-foreground/50" style={{ fontSize: "var(--text-caption)", fontFamily: "var(--font-mono)" }}>
                        {ayah.numberInSurah}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
