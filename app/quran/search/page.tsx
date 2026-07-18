"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { searchSurahs } from "@/lib/quran/data";

export default function QuranSearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchSurahs(query), [query]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
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
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
          }}
        >
          Search
        </h1>
      </header>

      <div style={{ padding: "var(--space-4) var(--space-5)" }}>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
          />
          <input
            type="search"
            placeholder="Search by name, number, or meaning..."
            value={query}
            onChange={handleSearch}
            autoFocus
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:shadow-[var(--focus-ring)]"
            style={{
              height: "var(--space-10)",
              fontSize: "var(--text-body-sm)",
            }}
          />
        </div>
      </div>

      <main className="flex-1 pb-24 lg:pb-8">
        <ul aria-label="Search results" className="flex flex-col">
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
                  <span className="text-foreground" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
                    {surah.englishName}
                  </span>
                  <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                    {surah.englishNameTranslation} · {surah.numberOfAyahs} ayahs
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
