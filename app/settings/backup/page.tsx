"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Upload,
  AlertTriangle,
  FileJson,
  FileText,
} from "lucide-react";
import db from "@/lib/db";
import { generateFullCSV, downloadCSV, downloadJSON } from "@/lib/export-utils";
import type { DatabaseExport } from "@/lib/db";

export default function BackupPage() {
  const [status, setStatus] = useState<"idle" | "exporting" | "importing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [lastBackup, setLastBackup] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dailydeen_last_backup");
    }
    return null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = useCallback(async () => {
    setStatus("exporting");
    setMessage("Preparing export...");

    try {
      const [prayers, habits, habitLogs, journal, settings, prayerLogs, quranBookmarks, quranProgress, khatmahGoals, khatmahProgress, readingSessionLogs, goals, goalCheckIns] =
        await Promise.all([
          db.prayers.toArray(),
          db.habits.toArray(),
          db.habitLogs.toArray(),
          db.journal.toArray(),
          db.settings.toArray(),
          db.prayerLogs.toArray(),
          db.quranBookmarks.toArray(),
          db.quranProgress.toArray(),
          db.khatmahGoals.toArray(),
          db.khatmahProgress.toArray(),
          db.readingSessionLogs.toArray(),
          db.goals.toArray(),
          db.goalCheckIns.toArray(),
        ]);

      const exportData: DatabaseExport = {
        version: 8,
        exportedAt: new Date().toISOString(),
        prayers,
        habits,
        habitLogs,
        journal,
        settings: settings[0] || null,
        prayerLogs,
        quranBookmarks,
        quranProgress,
        khatmahGoals,
        khatmahProgress,
        readingSessionLogs,
        goals,
        goalCheckIns,
      };

      const filename = `dailydeen-backup-${new Date().toISOString().split("T")[0]}.json`;
      downloadJSON(exportData, filename);

      const now = new Date().toISOString();
      setLastBackup(now);
      localStorage.setItem("dailydeen_last_backup", now);

      setStatus("success");
      setMessage(`Backup exported as ${filename}`);
    } catch (_err) {
      setStatus("error");
      setMessage("Failed to export backup. Please try again.");
    }
  }, []);

  const handleExportCSV = useCallback(async () => {
    setStatus("exporting");
    setMessage("Preparing CSV export...");

    try {
      const [prayers, habits, habitLogs, journal, settings, prayerLogs] =
        await Promise.all([
          db.prayers.toArray(),
          db.habits.toArray(),
          db.habitLogs.toArray(),
          db.journal.toArray(),
          db.settings.toArray(),
          db.prayerLogs.toArray(),
        ]);

      const exportData: DatabaseExport = {
        version: 8,
        exportedAt: new Date().toISOString(),
        prayers,
        habits,
        habitLogs,
        journal,
        settings: settings[0] || null,
        prayerLogs,
      };

      const csv = generateFullCSV(exportData);
      const filename = `dailydeen-export-${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(csv, filename);

      setStatus("success");
      setMessage(`CSV exported as ${filename}`);
    } catch (_err) {
      setStatus("error");
      setMessage("Failed to export CSV. Please try again.");
    }
  }, []);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("importing");
    setMessage("Reading file...");

    try {
      const text = await file.text();
      const data = JSON.parse(text) as DatabaseExport;

      if (!data.version || !data.exportedAt) {
        throw new Error("Invalid backup file format");
      }

      setMessage("Importing data...");

      await db.transaction("rw", [
        db.prayers,
        db.habits,
        db.habitLogs,
        db.journal,
        db.settings,
        db.prayerLogs,
        db.quranBookmarks,
        db.quranProgress,
        db.khatmahGoals,
        db.khatmahProgress,
        db.readingSessionLogs,
        db.goals,
        db.goalCheckIns,
      ], async () => {
        if (data.prayers) await db.prayers.bulkPut(data.prayers);
        if (data.habits) await db.habits.bulkPut(data.habits);
        if (data.habitLogs) await db.habitLogs.bulkPut(data.habitLogs);
        if (data.journal) await db.journal.bulkPut(data.journal);
        if (data.settings) await db.settings.put({ ...data.settings, id: 1 });
        if (data.prayerLogs) await db.prayerLogs.bulkPut(data.prayerLogs);
        if (data.quranBookmarks) await db.quranBookmarks.bulkPut(data.quranBookmarks);
        if (data.quranProgress) await db.quranProgress.bulkPut(data.quranProgress);
        if (data.khatmahGoals) await db.khatmahGoals.bulkPut(data.khatmahGoals);
        if (data.khatmahProgress) await db.khatmahProgress.bulkPut(data.khatmahProgress);
        if (data.readingSessionLogs) await db.readingSessionLogs.bulkPut(data.readingSessionLogs);
        if (data.goals) await db.goals.bulkPut(data.goals);
        if (data.goalCheckIns) await db.goalCheckIns.bulkPut(data.goalCheckIns);
      });

      setStatus("success");
      setMessage(`Successfully imported data from ${file.name}`);
    } catch (_err) {
      setStatus("error");
      setMessage("Failed to import. Please check the file format.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleClearAll = useCallback(async () => {
    if (!confirm("Are you sure you want to delete ALL data? This cannot be undone.")) {
      return;
    }

    setStatus("importing");
    setMessage("Clearing data...");

    try {
      await db.delete();
      window.location.reload();
    } catch (_err) {
      setStatus("error");
      setMessage("Failed to clear data. Please try again.");
    }
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
          href="/settings"
          aria-label="Back to settings"
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
          Backup & Restore
        </h1>
      </header>

      <main className="flex-1 pb-24 lg:pb-8" style={{ padding: "var(--space-5)" }}>
        {/* Status message */}
        {message && (
          <div
            role="alert"
            className={`mb-4 rounded-xl border p-4 ${
              status === "success"
                ? "border-quiet-sage bg-quiet-sage/10"
                : status === "error"
                  ? "border-destructive bg-destructive/10"
                  : "border-dusk-teal bg-dusk-teal/10"
            }`}
          >
            <p
              className={`${
                status === "success"
                  ? "text-quiet-sage"
                  : status === "error"
                    ? "text-destructive"
                    : "text-dusk-teal"
              }`}
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              {message}
            </p>
          </div>
        )}

        {/* Last backup info */}
        {lastBackup && (
          <div
            className="mb-4 rounded-xl border border-border bg-card p-4"
          >
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
              Last backup: {new Date(lastBackup).toLocaleString()}
            </p>
          </div>
        )}

        {/* Export section */}
        <section className="mb-6">
          <h2
            className="text-foreground mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-body)",
              fontWeight: 600,
            }}
          >
            Export Data
          </h2>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              disabled={status === "exporting"}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dusk-teal/10">
                <FileJson size={20} className="text-dusk-teal" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  Full Backup (JSON)
                </p>
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                  Complete backup with all data. Use this to restore later.
                </p>
              </div>
              <Download size={16} className="text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={status === "exporting"}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warm-sand/10">
                <FileText size={20} className="text-warm-sand" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  CSV Export
                </p>
                <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                  Spreadsheet-compatible format for analysis in Excel/Sheets.
                </p>
              </div>
              <Download size={16} className="text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Import section */}
        <section className="mb-6">
          <h2
            className="text-foreground mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-body)",
              fontWeight: 600,
            }}
          >
            Import Data
          </h2>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            aria-label="Import backup file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={status === "importing"}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dusk-mauve/10">
              <Upload size={20} className="text-dusk-mauve" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                Restore from Backup
              </p>
              <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                Import a previously exported JSON backup file.
              </p>
            </div>
            <Upload size={16} className="text-muted-foreground" />
          </button>
        </section>

        {/* Danger zone */}
        <section>
          <h2
            className="text-foreground mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-body)",
              fontWeight: 600,
            }}
          >
            Danger Zone
          </h2>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-destructive mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-foreground mb-1" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                  Delete All Data
                </p>
                <p className="text-muted-foreground mb-3" style={{ fontSize: "var(--text-caption)" }}>
                  This will permanently delete all your data including prayers, habits, journal entries, and settings. Make sure you have a backup first.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-lg bg-destructive px-3 py-1.5 text-white transition-colors hover:bg-destructive/90"
                  style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
