"use client";

import { useState, useCallback, useRef } from "react";
import { Volume2, X } from "lucide-react";
import { fetchAyahWords, type WordData } from "@/lib/quran/api";

interface WordByWordProps {
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
  fontSize: number;
}

export function WordByWord({ surahNumber, ayahNumber, ayahText: _ayahText, fontSize }: WordByWordProps) {
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadWords = useCallback(async () => {
    if (expanded) {
      setExpanded(false);
      setSelectedWord(null);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAyahWords(surahNumber, ayahNumber);
      setWords(data);
      setExpanded(true);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [surahNumber, ayahNumber, expanded]);

  const playWord = useCallback((word: WordData) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (word.audio_url) {
      const audio = new Audio(word.audio_url);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  }, []);

  const playEntireAyah = useCallback(async () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Play words sequentially
    for (const word of words) {
      if (word.audio_url) {
        await new Promise<void>((resolve) => {
          const audio = new Audio(word.audio_url);
          audioRef.current = audio;
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
          audio.play().catch(() => resolve());
        });
      }
    }
  }, [words]);

  return (
    <div className="mt-2">
      {/* Tap to expand button */}
      <button
        type="button"
        onClick={loadWords}
        disabled={loading}
        className="text-muted-foreground hover:text-dusk-teal transition-colors"
        style={{ fontSize: "var(--text-caption)" }}
      >
        {loading ? (
          <span className="animate-pulse">Loading words...</span>
        ) : expanded ? (
          <span className="flex items-center gap-1">
            <X size={12} /> Hide word-by-word
          </span>
        ) : (
          <span>Tap for word-by-word</span>
        )}
      </button>

      {/* Expanded word-by-word view */}
      {expanded && words.length > 0 && (
        <div className="mt-3 space-y-2">
          {/* Play entire ayah button */}
          <button
            type="button"
            onClick={playEntireAyah}
            className="flex items-center gap-1.5 text-dusk-teal hover:text-dusk-teal/80 transition-colors mb-3"
            style={{ fontSize: "var(--text-caption)" }}
          >
            <Volume2 size={12} />
            Play ayah word-by-word
          </button>

          {/* Word grid */}
          <div
            className="flex flex-wrap gap-2 justify-center"
            style={{ direction: "rtl" }}
          >
            {words.map((word) => (
              <button
                key={word.position}
                type="button"
                onClick={() => {
                  setSelectedWord(selectedWord?.position === word.position ? null : word);
                  playWord(word);
                }}
                className="group relative rounded-lg px-2 py-1 transition-all"
                style={{
                  background: selectedWord?.position === word.position
                    ? "color-mix(in srgb, var(--dusk-teal) 15%, var(--card))"
                    : "var(--muted)",
                  border: selectedWord?.position === word.position
                    ? "1px solid var(--dusk-teal)"
                    : "1px solid transparent",
                }}
              >
                <p
                  className="text-foreground"
                  style={{
                    fontSize: `${fontSize - 4}px`,
                    fontFamily: "var(--font-display)",
                    lineHeight: 1.6,
                  }}
                >
                  {word.text_uthmani}
                </p>
              </button>
            ))}
          </div>

          {/* Selected word detail */}
          {selectedWord && (
            <div
              className="rounded-xl border border-border bg-card p-3 mt-2"
              style={{ direction: "ltr" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-foreground"
                  style={{
                    fontSize: "clamp(24px, 4vw, 32px)",
                    fontFamily: "var(--font-display)",
                    direction: "rtl",
                  }}
                >
                  {selectedWord.text_uthmani}
                </p>
                <button
                  type="button"
                  onClick={() => playWord(selectedWord)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-dusk-teal hover:bg-muted transition-colors"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                {selectedWord.translation}
              </p>
              <p className="text-muted-foreground italic" style={{ fontSize: "var(--text-caption)" }}>
                {selectedWord.transliteration}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
