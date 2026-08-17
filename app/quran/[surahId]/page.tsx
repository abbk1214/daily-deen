"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Pause, Settings2, ChevronLeft, ChevronRight } from "lucide-react";
import { getSurahMeta } from "@/lib/quran/data";
import { fetchAyahs, fetchTranslation } from "@/lib/quran/api";
import { addQuranBookmark, removeQuranBookmark, getBookmarks, updateReadingProgress, getReadingProgress, getQuranSettings, saveQuranSettings } from "@/lib/db";
import type { Ayah, AyahTranslation } from "@/lib/quran/types";
import { RECITERS, TRANSLATIONS } from "@/lib/quran/types";
import { WordByWord } from "@/components/word-by-word";
import { useQuranAudio } from "@/hooks/use-quran-audio";
import { AudioPlayerBar } from "@/components/quran/audio-player-bar";

export default function SurahPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const surahNumber = Number(params.surahId);
  const initialAyah = Number(searchParams.get("ayah")) || 1;

  const surah = getSurahMeta(surahNumber);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [translations, setTranslations] = useState<AyahTranslation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(28);
  const [selectedTranslation, setSelectedTranslation] = useState("en.sahih");
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const ayahsRef = useRef<Ayah[]>([]);
  const surahRef = useRef(surah);
  const parentRef = useRef<HTMLDivElement>(null);

  // Shared audio hook with auto-advance
  const audio = useQuranAudio({
    onAyahEnd: useCallback((ayahGlobalNumber: number) => {
      const currentSurah = surahRef.current;
      const currentAyahs = ayahsRef.current;
      const endedAyah = currentAyahs.find((a) => a.number === ayahGlobalNumber);
      if (endedAyah && currentSurah && endedAyah.numberInSurah < currentSurah.numberOfAyahs) {
        audio.playAyah(currentAyahs[endedAyah.numberInSurah].number);
      }
    }, []),
  });

  // Virtualizer for long ayah lists
  const virtualizer = useVirtualizer({
    count: ayahs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated height per ayah
    overscan: 5,
  });

  useEffect(() => {
    ayahsRef.current = ayahs;
    surahRef.current = surah;
  });

  // Load Quran settings from database
  useEffect(() => {
    getQuranSettings().then((settings) => {
      if (settings.selectedReciter) audio.setReciter(settings.selectedReciter);
      setSelectedTranslation(settings.selectedTranslation);
      setFontSize(settings.fontSize);
      setShowTranslation(settings.showTranslation);
    });
  }, []);

  useEffect(() => {
    if (!surahNumber) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setIsLoading(true);
        setError(null);
      }
    });
    Promise.all([
      fetchAyahs(surahNumber),
      fetchTranslation(surahNumber, selectedTranslation),
    ])
      .then(([a, t]) => {
        if (cancelled) return;
        setAyahs(a);
        setTranslations(t);
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load surah:", err);
        setError("Failed to load ayahs. Check your internet connection and try again.");
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [surahNumber, selectedTranslation]);

  useEffect(() => {
    if (ayahs.length === 0) return;
    getReadingProgress().then((progress) => {
      const existing = progress.find((p) => p.surahNumber === surahNumber);
      const targetAyah = existing ? existing.ayahNumber : initialAyah;
      const el = ayahRefs.current.get(targetAyah);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [ayahs, surahNumber, initialAyah]);

  useEffect(() => {
    if (ayahs.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ayahNum = Number(entry.target.getAttribute("data-ayah"));
            if (ayahNum) updateReadingProgress(surahNumber, ayahNum);
          }
        }
      },
      { threshold: 0.5 },
    );
    ayahRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ayahs, surahNumber]);

  const toggleBookmark = useCallback(async (ayah: Ayah) => {
    const isBm = bookmarkedAyahs.has(ayah.numberInSurah);
    if (isBm) {
      await removeQuranBookmark(surahNumber, ayah.numberInSurah);
      setBookmarkedAyahs((prev) => {
        const next = new Set(prev);
        next.delete(ayah.numberInSurah);
        return next;
      });
    } else {
      const trans = translations.find((t) => t.ayahNumber === ayah.numberInSurah);
      await addQuranBookmark(surahNumber, ayah.numberInSurah, surah?.englishName || "", trans?.text || ayah.text);
      setBookmarkedAyahs((prev) => new Set(prev).add(ayah.numberInSurah));
    }
  }, [bookmarkedAyahs, surahNumber, surah, translations]);

  useEffect(() => {
    if (surahNumber && ayahs.length > 0) {
      getBookmarks().then((allBookmarks) => {
        const surahBookmarks = allBookmarks.filter((b) => b.surahNumber === surahNumber);
        const bmSet = new Set(surahBookmarks.map((b) => b.ayahNumber));
        setBookmarkedAyahs(bmSet);
      });
    }
  }, [surahNumber, ayahs]);

  const stopPlayback = audio.stop;

  if (!surah) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Surah not found</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <Link
          href="/quran"
          aria-label="Back to surahs"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <div className="ml-3 flex-1 min-w-0">
          <h1
            className="text-foreground truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-h5)",
              fontWeight: 600,
            }}
          >
            {surah.englishName}
          </h1>
          <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
            {surah.englishNameTranslation} · {surah.numberOfAyahs} ayahs
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Reading settings"
            aria-expanded={showSettings}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Settings2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="border-b border-border bg-card px-5 py-4">
          <div className="flex items-center gap-4">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Translation
            </label>
            <button
              type="button"
              onClick={() => {
                const newValue = !showTranslation;
                setShowTranslation(newValue);
                saveQuranSettings({ showTranslation: newValue });
              }}
              role="switch"
              aria-checked={showTranslation}
              aria-label="Show translation"
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                showTranslation ? "bg-dusk-teal text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {showTranslation ? "On" : "Off"}
            </button>
          </div>

          {/* Translation selector */}
          <div className="flex items-center gap-4 mt-3">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Translation
            </label>
            <select
              value={selectedTranslation}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTranslation(value);
                saveQuranSettings({ selectedTranslation: value });
              }}
              aria-label="Translation language"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {TRANSLATIONS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Reciter selector */}
          <div className="flex items-center gap-4 mt-3">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Reciter
            </label>
            <select
              value={audio.reciter.id}
              onChange={(e) => audio.setReciter(e.target.value)}
              aria-label="Reciter"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <label className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>
              Arabic Size
            </label>
            <input
              type="range"
              min={20}
              max={48}
              value={fontSize}
              onChange={(e) => {
                const value = Number(e.target.value);
                setFontSize(value);
                saveQuranSettings({ fontSize: value });
              }}
              aria-label="Arabic font size"
              className="flex-1 accent-[var(--dd-dusk-teal)]"
            />
            <span className="text-muted-foreground w-8 text-right" style={{ fontSize: "var(--text-caption)" }}>
              {fontSize}
            </span>
          </div>
        </div>
      )}

      {/* Surah header */}
      <div className="px-5 py-10 text-center border-b border-border">
        <p
          className="text-foreground mb-3"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 600,
            lineHeight: 1.4,
            direction: "rtl",
          }}
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
        <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", fontStyle: "italic" }}>
          In the name of Allah, the Entirely Merciful, the Especially Merciful
        </p>
      </div>

      {/* Ayahs */}
      <main className="flex-1 pb-24 lg:pb-8">
        {isLoading ? (
          <div className="flex flex-col gap-6 p-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-8 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground mb-4" style={{ fontSize: "var(--text-body-sm)" }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                Promise.all([
                  fetchAyahs(surahNumber),
                  fetchTranslation(surahNumber, "en.sahih"),
                ])
                  .then(([a, t]) => {
                    setAyahs(a);
                    setTranslations(t);
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    console.error("Failed to load surah:", err);
                    setError("Failed to load ayahs. Check your internet connection and try again.");
                    setIsLoading(false);
                  });
              }}
              className="rounded-lg bg-dusk-teal px-4 py-2 text-white transition-colors hover:bg-dusk-teal/90"
              style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div ref={parentRef} className="flex-1 overflow-auto" style={{ minHeight: "calc(100vh - 200px)" }}>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const ayah = ayahs[virtualRow.index];
                const trans = translations.find((t) => t.ayahNumber === ayah.numberInSurah);
                const isPlaying = audio.playingAyah === ayah.number;
                const isBm = bookmarkedAyahs.has(ayah.numberInSurah);
                return (
                  <div
                    key={ayah.numberInSurah}
                    ref={(el) => {
                      if (el) {
                        ayahRefs.current.set(ayah.numberInSurah, el);
                        virtualizer.measureElement(el);
                      }
                    }}
                    data-ayah={ayah.numberInSurah}
                    data-index={virtualRow.index}
                    className="border-b border-border px-5 py-8"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {/* Ayah number badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-caption)",
                          fontWeight: 500,
                        }}
                      >
                        {ayah.numberInSurah}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => audio.toggleAyah(ayah.number)}
                          aria-label={audio.isPlaying && audio.playingAyah === ayah.number ? "Pause" : "Play"}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {audio.isPlaying && audio.playingAyah === ayah.number ? <Pause size={16} strokeWidth={1.5} /> : <Play size={16} strokeWidth={1.5} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(ayah)}
                          aria-label={isBm ? "Remove bookmark" : "Bookmark"}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {isBm ? (
                            <BookmarkCheck size={16} className="text-dusk-teal" strokeWidth={1.5} />
                          ) : (
                            <Bookmark size={16} strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Arabic text */}
                    <p
                      className="text-foreground text-center mb-5"
                      style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: "var(--font-display)",
                        fontWeight: 400,
                        lineHeight: 2,
                        direction: "rtl",
                        wordSpacing: "0.12em",
                      }}
                    >
                      {ayah.text}
                    </p>

                    {/* Translation */}
                    {showTranslation && trans && (
                      <p
                        className="text-muted-foreground"
                        style={{
                          fontSize: "var(--text-body-sm)",
                          lineHeight: 1.7,
                          fontStyle: "italic",
                          paddingLeft: "var(--space-4)",
                          borderLeft: "2px solid var(--border)",
                        }}
                      >
                        {trans.text}
                      </p>
                    )}

                    {/* Word-by-word */}
                    <WordByWord
                      surahNumber={surahNumber}
                      ayahNumber={ayah.numberInSurah}
                      ayahText={ayah.text}
                      fontSize={fontSize}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Navigation footer */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-5"
        style={{ height: "var(--space-14)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {surahNumber > 1 ? (
          <Link
            href={`/quran/${surahNumber - 1}`}
            className="flex items-center gap-2 text-foreground transition-colors hover:text-dusk-teal"
            style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            {surahNumber - 1 > 0 ? `Surah ${surahNumber - 1}` : ""}
          </Link>
        ) : <div />}
        {surahNumber < 114 ? (
          <Link
            href={`/quran/${surahNumber + 1}`}
            className="flex items-center gap-2 text-foreground transition-colors hover:text-dusk-teal"
            style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
          >
            Surah {surahNumber + 1}
            <ChevronRight size={16} strokeWidth={1.5} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
