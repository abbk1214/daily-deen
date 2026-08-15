"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, WifiOff } from "lucide-react";
import Link from "next/link";
import { MoodSelector } from "@/components/mood-selector";
import { JournalEntryEditor } from "@/components/journal-entry-editor";
import { TagInput } from "@/components/tag-input";
import { JournalHistory } from "@/components/journal-history";
import {
  saveJournalEntry,
  getRecentEntries,
  getJournalEntry,
} from "@/lib/journal-actions";
import { getToday } from "@/lib/utils";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { JournalEntry } from "@/lib/db";

const AUTOSAVE_DELAY = 300;

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function JournalPage() {
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const isOnline = useOnlineStatus();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const initialLoadDoneRef = useRef(false);
  const savingRef = useRef(false);

  // Load today's entry and recent entries on mount
  useEffect(() => {
    mountedRef.current = true;

    async function load() {
      try {
        const [todayEntry, recentEntries] = await Promise.all([
          getJournalEntry(getToday()),
          getRecentEntries(),
        ]);

        if (!mountedRef.current) return;

        if (todayEntry) {
          setMood(todayEntry.mood || null);
          setText(todayEntry.text);
          setTags(todayEntry.tags);
        }

        setEntries(recentEntries);
        setEntriesLoading(false);
        initialLoadDoneRef.current = true;
      } catch (error) {
        console.error("Failed to load journal data:", error);
        if (mountedRef.current) {
          setEntriesLoading(false);
          initialLoadDoneRef.current = true;
        }
      }
    }

    load();

    return () => {
      mountedRef.current = false;
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current);
    };
  }, []);

  // Unsaved changes guard
  useEffect(() => {
    if (!initialLoadDoneRef.current) return;

    const hasChanges = text.trim().length > 0 || mood !== null || tags.length > 0;
    setHasUnsavedChanges(hasChanges);
  }, [text, mood, tags]);

  // beforeunload guard
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  // Autosave
  const performSave = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;

    setSaveStatus("saving");

    try {
      await saveJournalEntry({ mood: mood ?? "", text, tags });
      if (mountedRef.current) {
        setSaveStatus("saved");
        setHasUnsavedChanges(false);

        // Refresh entries list
        const recentEntries = await getRecentEntries();
        if (mountedRef.current) {
          setEntries(recentEntries);
        }

        // Reset saved status after 2s
        if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current);
        saveStatusTimerRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setSaveStatus("idle");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      if (mountedRef.current) {
        setSaveStatus("error");
      }
    } finally {
      savingRef.current = false;
    }
  }, [mood, text, tags]);

  // Autosave on change with debounce
  useEffect(() => {
    if (!initialLoadDoneRef.current) return;
    if (text.trim().length === 0 && mood === null && tags.length === 0) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      performSave();
    }, AUTOSAVE_DELAY);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [text, mood, tags, performSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        performSave();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [performSave]);

  const handleRetry = useCallback(() => {
    setSaveStatus("idle");
    performSave();
  }, [performSave]);

  const handleTextChange = useCallback((value: string) => {
    setText(value);
    setSaveStatus("idle");
  }, []);

  const handleMoodChange = useCallback((value: string | null) => {
    setMood(value);
    setSaveStatus("idle");
  }, []);

  const handleTagsChange = useCallback((value: string[]) => {
    setTags(value);
    setSaveStatus("idle");
  }, []);

  const today = useMemo(() => new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }), []);

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      <a
        href="#editor"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to editor
      </a>

      {/* Offline banner */}
      {!isOnline && (
        <div
          role="alert"
          className="flex items-center justify-center gap-2 bg-dusk-teal text-accent-foreground"
          style={{
            height: "var(--space-10)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
          }}
        >
          <WifiOff size={16} strokeWidth={1.5} />
          Offline — entries will save locally
        </div>
      )}

      {/* Top bar */}
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
          Journal
        </h1>
        <span
          className="ml-3 text-muted-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-caption)",
          }}
        >
          {today}
        </span>
      </header>

      {/* Main content */}
      <main
        id="main"
        className="flex flex-1 flex-col gap-8 pb-24 lg:pb-8"
        style={{
          padding: "var(--space-5)",
          paddingBottom: "calc(var(--space-14) + env(safe-area-inset-bottom, 0px) + var(--space-5))",
          maxWidth: "var(--content-reading)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      >
        {/* Mood selector */}
        <MoodSelector value={mood} onChange={handleMoodChange} />

        {/* Editor */}
        <div style={{ marginTop: "var(--space-8)" }}>
          <JournalEntryEditor value={text} onChange={handleTextChange} />
        </div>

        {/* Tags */}
        <TagInput tags={tags} onChange={handleTagsChange} />

        {/* Save button */}
        <div>
          {saveStatus === "error" ? (
            <button
              type="button"
              onClick={handleRetry}
              aria-label="Save failed. Tap to retry."
              className="flex h-12 w-full items-center justify-center rounded-lg border border-destructive bg-destructive/10 px-6 text-destructive transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-destructive/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                fontSize: "var(--text-body)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Save failed — tap to retry
            </button>
          ) : (
            <button
              type="button"
              onClick={performSave}
              disabled={saveStatus === "saving"}
              aria-label={
                saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                    ? "Saved"
                    : "Save journal entry"
              }
              className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-primary-foreground transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-primary/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-80"
              style={{
                fontSize: "var(--text-body)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wide)",
                color: saveStatus === "saved" ? "var(--dd-quiet-sage)" : undefined,
              }}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "Saved"
                  : "Save Entry"}
            </button>
          )}
          <div role="status" aria-live="polite" className="sr-only">
            {saveStatus === "saving" && "Saving journal entry..."}
            {saveStatus === "saved" && "Journal entry saved successfully"}
            {saveStatus === "error" && "Failed to save journal entry"}
          </div>
        </div>

        {/* Previous entries */}
        <div style={{ marginTop: "var(--space-12)" }}>
          <JournalHistory entries={entries} loading={entriesLoading} />
        </div>
      </main>
    </div>
  );
}
