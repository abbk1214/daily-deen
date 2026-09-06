/* ──────────────────────────────────────────────
   Feature flag system
   Enable/disable features without code changes
   ────────────────────────────────────────────── */

export interface FeatureFlags {
  // Core features
  prayer: boolean
  quran: boolean
  habits: boolean
  journal: boolean
  timeline: boolean
  insights: boolean
  dhikr: boolean
  compass: boolean

  // Premium features
  cloud_sync: boolean
  family_sharing: boolean
  widgets: boolean
  premium_themes: boolean

  // Seasonal features
  ramadan_mode: boolean
  hajj_mode: boolean
  laylatul_qadr: boolean

  // Experimental
  word_by_word: boolean
  audio_recitation: boolean
  offline_mode: boolean

  // Dev/debug
  debug_mode: boolean
  analytics: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  // Core — all enabled by default
  prayer: true,
  quran: true,
  habits: true,
  journal: true,
  timeline: true,
  insights: true,
  dhikr: true,
  compass: true,

  // Premium — disabled by default
  cloud_sync: false,
  family_sharing: false,
  widgets: false,
  premium_themes: false,

  // Seasonal — managed by seasonal service
  ramadan_mode: false,
  hajj_mode: false,
  laylatul_qadr: false,

  // Experimental
  word_by_word: true,
  audio_recitation: true,
  offline_mode: true,

  // Dev/debug
  debug_mode: false,
  analytics: false,
}

/* ──────────────────────────────────────────────
   Flag storage
   ────────────────────────────────────────────── */

const STORAGE_KEY = "dd-feature-flags"

function loadFlags(): Partial<FeatureFlags> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveFlags(flags: Partial<FeatureFlags>): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags))
  } catch {
    // Storage full
  }
}

/* ──────────────────────────────────────────────
   Public API
   ────────────────────────────────────────────── */

let cachedFlags: FeatureFlags | null = null

function getFlags(): FeatureFlags {
  if (!cachedFlags) {
    const overrides = loadFlags()
    cachedFlags = { ...DEFAULT_FLAGS, ...overrides }
  }
  return cachedFlags
}

/** Check if a feature is enabled */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return getFlags()[flag]
}

/** Get all feature flags */
export function getAllFlags(): FeatureFlags {
  return { ...getFlags() }
}

/** Set a feature flag (persists to localStorage) */
export function setFeatureFlag(flag: keyof FeatureFlags, enabled: boolean): void {
  const current = getFlags()
  current[flag] = enabled
  cachedFlags = current
  saveFlags(current)
}

/** Reset all flags to defaults */
export function resetFlags(): void {
  cachedFlags = null
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/** Clear the in-memory cache (useful after bulk updates) */
export function clearFlagCache(): void {
  cachedFlags = null
}
