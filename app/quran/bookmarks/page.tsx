"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Trash2 } from "lucide-react";
import { getBookmarks, removeQuranBookmark } from "@/lib/db";
import type { QuranBookmark } from "@/lib/db";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks().then((bms) => {
      setBookmarks(bms);
      setLoading(false);
    });
  }, []);

  const handleRemove = useCallback(async (bookmark: QuranBookmark) => {
    await removeQuranBookmark(bookmark.surahNumber, bookmark.ayahNumber);
    setBookmarks((prev) =>
      prev.filter((b) => !(b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber)),
    );
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
          Bookmarks
        </h1>
      </header>

      <main className="flex-1 pb-24 lg:pb-8">
        {loading ? (
          <div className="flex flex-col gap-3 p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Bookmark size={48} strokeWidth={1.5} className="text-muted-foreground" style={{ marginBottom: "var(--space-4)" }} />
            <h2 className="text-foreground" style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
              No bookmarks yet
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)", maxWidth: "30ch" }}>
              Bookmark ayahs to save them here for quick access.
            </p>
          </div>
        ) : (
          <ul aria-label="Bookmarks" className="flex flex-col">
            {bookmarks.map((bm) => (
              <li key={`${bm.surahNumber}-${bm.ayahNumber}`}>
                <Link
                  href={`/quran/${bm.surahNumber}?ayah=${bm.ayahNumber}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                        {bm.surahName}
                      </span>
                      <span className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                        · Ayah {bm.ayahNumber}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)", direction: "rtl" }}>
                      {bm.ayahText}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(bm);
                    }}
                    aria-label="Remove bookmark"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
