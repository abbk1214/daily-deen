"use client";

import { useState, useEffect, useCallback } from "react";
import { Droplets, Plus, Minus } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import db from "@/lib/db";
import { getToday } from "@/lib/utils";

const QUICK_ADD = [100, 250, 500];
const DEFAULT_GOAL = 2000; // ml

function formatMl(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
  return `${ml}ml`;
}

export function WaterTracker() {
  const [total, setTotal] = useState(0);
  const [goal] = useState(DEFAULT_GOAL);

  useEffect(() => {
    async function loadTotal() {
      try {
        const today = getToday();
        const entries = await db.waterEntries.where("date").equals(today).toArray();
        const sum = entries.reduce((s, e) => s + e.amount, 0);
        setTotal(sum);
      } catch {
        // silent
      }
    }
    loadTotal();
  }, []);

  const addWater = useCallback(async (amount: number) => {
    try {
      await db.waterEntries.add({
        date: getToday(),
        amount,
        timestamp: Date.now(),
      });
      setTotal((prev) => prev + amount);
    } catch {
      // silent
    }
  }, []);

  const removeLast = useCallback(async () => {
    try {
      const today = getToday();
      const entries = await db.waterEntries.where("date").equals(today).toArray();
      if (entries.length > 0) {
        const last = entries.sort((a, b) => b.timestamp - a.timestamp)[0];
        if (last.id) {
          await db.waterEntries.delete(last.id);
          setTotal((prev) => Math.max(0, prev - last.amount));
        }
      }
    } catch {
      // silent
    }
  }, []);

  const progress = Math.min((total / goal) * 100, 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            Water Intake
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            Goal: {formatMl(goal)}
          </p>
        </div>
        <Droplets size={18} className="text-accent" />
      </div>

      {/* Circular progress */}
      <div className="flex justify-center mb-4">
        <div className="relative" style={{ width: 120, height: 120 }}>
          <CircularProgressbar
            value={progress}
            text={`${Math.round(progress)}%`}
            styles={buildStyles({
              textSize: "14px",
              textColor: "var(--foreground)",
              pathColor: "var(--dusk-teal)",
              trailColor: "var(--muted)",
              pathTransitionDuration: 0.5,
            })}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Droplets size={20} className="text-accent mb-1" />
            <span className="text-foreground" style={{ fontSize: "16px", fontWeight: 700 }}>
              {formatMl(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="flex gap-2 mb-3">
        {QUICK_ADD.map((amount) => (
          <button
            key={amount}
            onClick={() => addWater(amount)}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}
          >
            <Plus size={12} />
            {formatMl(amount)}
          </button>
        ))}
      </div>

      {/* Undo button */}
      <button
        onClick={removeLast}
        className="w-full flex items-center justify-center gap-1 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
        style={{ fontSize: "var(--text-caption)" }}
      >
        <Minus size={12} />
        Undo last
      </button>
    </div>
  );
}
