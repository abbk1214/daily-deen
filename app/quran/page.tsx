"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Bookmark, ChevronRight } from "lucide-react";
import { searchSurahs } from "@/lib/quran/data";
import { getLastReadSurah } from "@/lib/db";
import { useEffect } from "react";

export default function QuranPage() {
  const [query, setQuery] = useState("");
  const [lastRead, setLastRead] = useState<{ surahNumber: number; ayahNumber: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");

  useEffect(() => {
    getLastReadSurah().then(setLastRead);
  }, []);

  const results = useMemo(() => searchSurahs(query), [query]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

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
          href="/"
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1
          className="ml-3 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
          }}
        >
          Quran
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/quran/khatmah"
            aria-label="Khatmah Tracker"
            className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
          >
            <BookOpen size={16} strokeWidth={1.5} />
            <span className="hidden sm:inline">Khatmah</span>
          </Link>
          <Link
            href="/quran/bookmarks"
            aria-label="Bookmarks"
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Bookmark size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* Continue reading */}
      {lastRead && !query && (
        <Link
          href={`/quran/${lastRead.surahNumber}?ayah=${lastRead.ayahNumber}`}
          className="flex items-center gap-3 border-b border-border px-5 py-4 transition-colors hover:bg-secondary"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dusk-teal/10">
            <BookOpen size={18} className="text-dusk-teal" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Continue Reading
            </p>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
              Surah {lastRead.surahNumber}, Ayah {lastRead.ayahNumber}
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "surah"}
          onClick={() => setActiveTab("surah")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "surah"
              ? "border-b-2 border-dusk-teal text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Surah (114)
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "juz"}
          onClick={() => setActiveTab("juz")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "juz"
              ? "border-b-2 border-dusk-teal text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Juz (30)
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "page"}
          onClick={() => setActiveTab("page")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "page"
              ? "border-b-2 border-dusk-teal text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Page (604)
        </button>
      </div>

      {activeTab === "surah" ? (
        <>
          {/* Search */}
          <div style={{ padding: "var(--space-4) var(--space-5)" }}>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.5}
              />
              <input
                type="search"
                placeholder="Search surahs..."
                value={query}
                onChange={handleSearch}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:shadow-[var(--focus-ring)]"
                style={{
                  height: "var(--space-10)",
                  fontSize: "var(--text-body-sm)",
                }}
              />
            </div>
          </div>

          {/* Surah list */}
          <main className="flex-1 pb-24 lg:pb-8">
            <ul aria-label="Surahs" className="flex flex-col">
              {results.map((surah) => (
                <li key={surah.number}>
                  <Link
                    href={`/quran/${surah.number}`}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-caption)",
                        fontWeight: 500,
                      }}
                    >
                      {surah.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground truncate" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
                          {surah.englishName}
                        </span>
                        <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                          · {surah.numberOfAyahs} ayahs
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
                        {surah.englishNameTranslation} · {surah.revelationType}
                      </p>
                    </div>
                    <span
                      className="text-foreground ml-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-body)",
                        fontWeight: 600,
                        direction: "rtl",
                      }}
                    >
                      {surah.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {results.length === 0 && query && (
              <div className="flex flex-col items-center py-24 text-center">
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
                  No surahs found for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}
          </main>
        </>
      ) : (
        <Link
          href="/quran/juz"
          className="flex items-center gap-3 border-b border-border px-5 py-4 transition-colors hover:bg-secondary"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dusk-teal/10">
            <BookOpen size={18} className="text-dusk-teal" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
              Browse by {activeTab === "juz" ? "Juz" : "Page"}
            </p>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
              {activeTab === "juz" ? "30 juz with surah range info" : "604 mushaf pages"}
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      )}
    </div>
  );
}
