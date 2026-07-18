"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { getJuzInfo, getJuzName } from "@/lib/quran/metadata"
import { getSurahMeta } from "@/lib/quran/data"

export default function JuzListPage() {
  const [selectedTab, setSelectedTab] = useState<"juz" | "page">("juz")

  const juzList = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}
      >
        <Link
          href="/quran"
          aria-label="Back to Quran"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1
          className="ml-3 text-foreground"
          style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h5)", fontWeight: 600 }}
        >
          Juz &amp; Page
        </h1>
      </header>

      <div className="flex border-b border-border" role="tablist">
        <button
          role="tab"
          aria-selected={selectedTab === "juz"}
          onClick={() => setSelectedTab("juz")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            selectedTab === "juz"
              ? "border-b-2 border-dusk-teal text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Juz (30)
        </button>
        <button
          role="tab"
          aria-selected={selectedTab === "page"}
          onClick={() => setSelectedTab("page")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            selectedTab === "page"
              ? "border-b-2 border-dusk-teal text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Page (604)
        </button>
      </div>

      <main className="flex-1 pb-24 lg:pb-8">
        {selectedTab === "juz" ? (
          <ul aria-label="Juz list" className="flex flex-col">
            {juzList.map((juz) => {
              const info = getJuzInfo(juz)
              if (!info) return null
              const startName = getSurahMeta(info.startSurah)?.englishName ?? `Surah ${info.startSurah}`
              const endName = getSurahMeta(info.endSurah)?.englishName ?? `Surah ${info.endSurah}`
              const juzName = getJuzName(juz)

              return (
                <li key={juz}>
                  <Link
                    href={`/quran/juz/${juz}`}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-dusk-teal/10 text-dusk-teal"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-caption)", fontWeight: 500 }}
                    >
                      {juz}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground truncate" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                        {juzName}
                      </p>
                      <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
                        {startName}{info.startSurah !== info.endSurah ? ` → ${endName}` : ""} · p.{info.startPage}–{info.endPage}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <PageGrid />
        )}
      </main>
    </div>
  )
}

function PageGrid() {
  const pages = Array.from({ length: 604 }, (_, i) => i + 1)

  return (
    <div style={{ padding: "var(--space-4) var(--space-5)" }}>
      <p className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)" }}>
        Mushaf page number — tap to read
      </p>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {pages.map((page) => (
          <Link
            key={page}
            href={`/quran/page-list/${page}`}
            className="flex h-10 items-center justify-center rounded-md bg-secondary text-foreground transition-colors hover:bg-dusk-teal/10 hover:text-dusk-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-caption)" }}
          >
            {page}
          </Link>
        ))}
      </div>
    </div>
  )
}
