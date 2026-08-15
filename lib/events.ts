/* ──────────────────────────────────────────────
   Lightweight event bus for cross-feature communication
   ────────────────────────────────────────────── */

type EventPayload = Record<string, unknown>

type EventHandler<T extends EventPayload = EventPayload> = (payload: T) => void

interface EventDefinition {
  payload: EventPayload
}

/* ──────────────────────────────────────────────
   Event type registry — extend this as new events are added
   ────────────────────────────────────────────── */

export interface EventMap extends EventDefinition {
  // Prayer events
  "prayer:completed": { prayer: string; date: string }
  "prayer:missed": { prayer: string; date: string }

  // Habit events
  "habit:completed": { habitId: number; habitName: string; date: string }
  "habit:updated": { habitId: number }

  // Journal events
  "journal:saved": { date: string; mood: string }
  "journal:deleted": { date: string }

  // Quran events
  "quran:read": { surahNumber: number; ayahNumber: number; date: string }
  "quran:bookmark_added": { surahNumber: number; ayahNumber: number }
  "quran:bookmark_removed": { surahNumber: number; ayahNumber: number }
  "quran:khatmah_progress": { pagesRead: number; date: string }

  // Health events
  "water:updated": { amount: number; total: number; date: string }
  "sleep:logged": { duration: number; quality: number; date: string }
  "exercise:logged": { type: string; duration: number; date: string }
  "mood:logged": { mood: string; date: string }

  // Streak events
  "streak:updated": { type: string; count: number }

  // Achievement events
  "achievement:unlocked": { type: string; title: string; description: string }

  // Settings events
  "settings:updated": { key: string }

  // App events
  "app:online": Record<string, never>
  "app:offline": Record<string, never>
  "app:date_changed": { date: string }
}

/* ──────────────────────────────────────────────
   Event bus implementation
   ────────────────────────────────────────────── */

type Listener = (payload: EventPayload) => void

class EventBus {
  private listeners = new Map<string, Set<Listener>>()

  on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler as Listener)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler as Listener)
    }
  }

  emit<K extends keyof EventMap>(
    event: K,
    payload: EventMap[K],
  ): void {
    const handlers = this.listeners.get(event)
    if (!handlers) return

    for (const handler of handlers) {
      try {
        handler(payload)
      } catch (err) {
        console.error(`Event handler error for "${event}":`, err)
      }
    }
  }

  once<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): () => void {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe()
      handler(payload)
    })
    return unsubscribe
  }

  off<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): void {
    this.listeners.get(event)?.delete(handler as Listener)
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }
}

/* ──────────────────────────────────────────────
   Singleton export
   ────────────────────────────────────────────── */

export const events = new EventBus()

/* ──────────────────────────────────────────────
   React hook for subscribing to events
   ────────────────────────────────────────────── */

import { useEffect } from "react"

export function useEvent<K extends keyof EventMap>(
  event: K,
  handler: EventHandler<EventMap[K]>,
): void {
  useEffect(() => {
    const unsubscribe = events.on(event, handler)
    return unsubscribe
  }, [event, handler])
}
