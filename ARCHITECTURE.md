# Daily Deen — Architecture

## Folder Structure

```
daily-deen/
├── app/                          # Next.js 16 App Router pages
│   ├── globals.css               # Tailwind v4 imports + design token theme
│   ├── layout.tsx                # Root layout (Server Component, fonts, metadata)
│   ├── page.tsx                  # Dashboard (client component)
│   ├── habits/page.tsx           # Habit tracker
│   ├── journal/page.tsx          # Journal entry + history
│   ├── settings/page.tsx         # App settings
│   ├── onboarding/page.tsx       # 3-step onboarding flow
│   └── offline/page.tsx          # Offline fallback page
├── components/                   # Shared UI components
│   ├── add-habit-form.tsx        # New habit creation form
│   ├── day-arc.tsx               # SVG arc showing prayer time progress
│   ├── habit-row.tsx             # Single habit with increment/decrement
│   ├── journal-entry-editor.tsx  # Auto-resizing textarea
│   ├── journal-history.tsx       # Past journal entry cards
│   ├── loading-bar.tsx           # Top loading indicator
│   ├── mood-selector.tsx         # 5-mood radio group
│   ├── navigation.tsx            # Mobile bottom nav + desktop sidebar
│   ├── prayer-status.tsx         # Current prayer with progress bar
│   ├── progress-tracker.tsx      # Dashboard habit list with controls
│   ├── tag-input.tsx             # Tag chip input
│   ├── tooltip.tsx               # Hover/focus tooltip
│   └── week-strip.tsx            # 7-day week selector
├── features/                     # Feature-level compositions
│   └── dashboard.tsx             # Dashboard layout (arc + habits + affirmations)
├── hooks/                        # Custom React hooks
│   ├── use-dashboard-data.ts     # Fetches prayers + habits from Dexie
│   ├── use-keyboard-shortcuts.ts # g+{h,b,j,s} vim-style navigation
│   ├── use-navigation-loading.ts # Loading bar state
│   ├── use-online-status.ts     # navigator.onLine tracker
│   └── use-sidebar-state.ts     # Sidebar collapse (localStorage-persisted)
├── lib/                          # Data layer + utilities
│   ├── db.ts                     # Dexie schema, AppSettings, DEFAULT_SETTINGS
│   ├── habit-actions.ts          # CRUD for habits + habit logs
│   ├── hijri-date.ts             # Gregorian-to-Hijri converter
│   ├── journal-actions.ts        # CRUD for journal entries
│   ├── prayer-actions.ts         # Prayer times query from IndexedDB
│   └── utils.ts                  # getToday, timeToMinutes, formatTime, etc.
├── tokens.css                    # Design token system (OKLCh, light + dark)
├── next.config.ts                # Next.js 16 config + PWA wrapper
├── eslint.config.mjs             # ESLint 9 flat config
├── postcss.config.mjs            # Tailwind CSS v4 via @tailwindcss/postcss
└── public/                       # Static assets + PWA files
    ├── manifest.json             # PWA manifest
    └── icons/                    # App icons (192x192, 512x512)
```

## Component Dependency Graph

```
pages → features → hooks → lib/actions → lib/db
pages → components → lib/utils + lib/db (types)
features → components + hooks
hooks → lib/actions + lib/db
```

### Page imports

| Page | Imports |
|------|---------|
| `app/page.tsx` | `components/navigation`, `features/dashboard`, `hooks/use-keyboard-shortcuts` |
| `app/habits/page.tsx` | `components/week-strip`, `components/habit-row`, `components/add-habit-form`, `lib/habit-actions`, `hooks/use-online-status`, `lib/db` (types) |
| `app/journal/page.tsx` | `components/mood-selector`, `components/journal-entry-editor`, `components/tag-input`, `components/journal-history`, `lib/journal-actions`, `lib/utils`, `hooks/use-online-status`, `lib/db` (types) |
| `app/settings/page.tsx` | `lib/db`, `hooks/use-online-status`, `lib/db` (types) |
| `app/onboarding/page.tsx` | `lib/db` |
| `app/offline/page.tsx` | _(none)_ |

### Component imports

| Component | Imports |
|-----------|---------|
| `features/dashboard.tsx` | `hooks/use-dashboard-data`, `hooks/use-online-status`, `components/day-arc`, `components/progress-tracker`, `components/prayer-status` |
| `components/navigation.tsx` | `hooks/use-sidebar-state`, `hooks/use-navigation-loading`, `components/loading-bar`, `components/tooltip` |
| `components/day-arc.tsx` | `lib/utils`, `lib/db` (types) |
| `components/prayer-status.tsx` | `lib/utils`, `lib/db` (types) |
| `components/habit-row.tsx` | `lib/utils`, `lib/db` (types) |
| `components/progress-tracker.tsx` | `lib/utils`, `lib/db` (types) |
| `components/journal-history.tsx` | `lib/hijri-date`, `lib/db` (types) |
| All other components | _(no project imports)_ |

### Hook imports

| Hook | Imports |
|------|---------|
| `use-dashboard-data.ts` | `lib/db`, `lib/prayer-actions`, `lib/utils`, `lib/habit-actions` |
| `use-keyboard-shortcuts.ts` | _(only next/navigation)_ |
| `use-navigation-loading.ts` | _(only next/navigation)_ |
| `use-online-status.ts` | _(none)_ |
| `use-sidebar-state.ts` | _(none)_ |

### Lib imports

| Module | Imports |
|--------|---------|
| `lib/db.ts` | _(only dexie)_ |
| `lib/prayer-actions.ts` | `lib/db` |
| `lib/habit-actions.ts` | `lib/db` |
| `lib/journal-actions.ts` | `lib/db`, `lib/utils` |
| `lib/utils.ts` | `lib/db` (types only) |
| `lib/hijri-date.ts` | _(none)_ |

## Data Architecture

### Database (Dexie/IndexedDB)

Schema v2 (current):

| Table | Fields | Indexes | Constraints |
|-------|--------|---------|-------------|
| `prayers` | `id, date, fajr, dhuhr, asr, maghrib, isha, completed` | `++id, &date` | Unique date |
| `habits` | `id, name, type, target, unit, increment` | `++id, &name, type` | Unique name |
| `habitLogs` | `id, habitId, date, value` | `++id, &[habitId+date]` | Compound unique |
| `journal` | `id, date, mood, text, tags` | `++id, &date` | Unique date |
| `settings` | `id, + all AppSettings fields` | `++id` | Single row (upsert) |

### Data flow pattern

1. All pages are client components (`"use client"`)
2. Pages call `lib/*-actions.ts` functions that directly query/mutate Dexie
3. State is managed locally via `useState` + `useEffect` for initial load
4. Optimistic local state updates after writes (no full re-fetch)
5. Settings use upsert: `getSettings()` returns first row; `saveSettings()` updates or inserts

### No global state management

Each page independently loads its data from IndexedDB on mount. There is no React Context, Redux, or Zustand. The `DEFAULT_SETTINGS` constant serves as the fallback.

## PWA Architecture

**Tooling:** `@ducanh2912/next-pwa` wraps the Next.js build, generating Workbox-based service worker files.

**next.config.ts PWA config:**
- `dest: "public"` — outputs sw.js, workbox-*.js, fallback-*.js
- `register: true` — auto-registers the service worker
- `reloadOnOnline: true` — reloads when connection restores
- `cacheOnFrontEndNav: true` + `aggressiveFrontEndNavCaching: true` — caches navigations
- `fallbacks.document: "/offline"` — offline fallback page
- `skipWaiting: true` + `clientsClaim: true` — immediate activation

**Runtime caching:**
- Google Fonts API (`fonts.googleapis.com`) — CacheFirst, 30-day expiry, max 10 entries
- Google Fonts webfiles (`fonts.gstatic.com`) — CacheFirst, 30-day expiry, max 20 entries

**Offline strategy:** Fully offline-first. All data lives in IndexedDB. The service worker caches the app shell. The app is functionally identical online and offline — the online/offline banner is purely informational.

## Navigation Architecture

**Mobile (< 1024px):** Bottom tab bar with 4 tabs (Home, Habits, Journal, Settings). Fixed at bottom, respects safe area. Arrow key navigation between tabs.

**Desktop (>= 1024px):** Collapsible sidebar (200px expanded, 64px collapsed). Collapse state persisted to `localStorage`. Tooltips on collapsed links. ArrowUp/Down keyboard navigation, Escape to toggle.

**Breakpoint:** 1024px (lg), tracked via `useSidebarState` using `window.matchMedia`.

**Loading indicator:** Teal sliding bar at top during navigation. State managed by `useNavigationLoading`.

**Keyboard shortcuts** (home page):
- `g` then `h` = Home
- `g` then `b` = Habits
- `g` then `j` = Journal
- `g` then `s` = Settings
- `Ctrl+S` / `Cmd+S` = Save journal (journal page)

## Known Tech Debt

### Prayer Calculation — Major Gap
- No prayer time calculation algorithm. Settings references 12 methods but none are implemented.
- `PrayerAdjustor` controls are non-functional (hardcoded to 0, onChange is `() => {}`).
- No code seeds prayer records into IndexedDB. Users see "No prayer times set."

### Notifications — Stub Only
- Bell icon has no click handler. No `Notification.requestPermission()`, no push subscription.
- Settings toggles save to IndexedDB but nothing reads them to trigger notifications.

### Language Setting — Non-functional
- Language selector saves to IndexedDB but no i18n system exists. UI is hardcoded English.

### Export Data — Partial
- Only exports `settings` as JSON. Does not export habits, habit logs, or journal entries.

### Empty Directory
- `components/features/` is empty and unused.

### Onboarding Guard Missing
- No middleware or layout logic redirects to `/onboarding` when `onboardingComplete` is false.

### Sunrise Prayer
- Settings lists `"sunrise"` in adjustments but `Prayer` interface has no sunrise field.

## Performance Notes

### Strengths
- `DayArc`, `PrayerStatus`, `HabitRow`, `ProgressTracker`, `JournalHistory`, `WeekStrip` are memoized with `React.memo`
- Offline-first — no network requests for data
- IndexedDB queries are indexed (unique compound indexes on habitLogs)

### Opportunities
- **Consolidate timers:** `DayArc` and `PrayerStatus` each run independent 60s `setInterval`. Could share a `useCurrentTime` hook.
- **Inline styles:** Nearly all styling uses inline `style={{...}}` objects, creating new objects every render. Could migrate to Tailwind classes.
- **`dangerouslySetInnerHTML` in Dashboard:** Injects `<style>` tag with keyframes on every render.
- **No error boundaries:** A component crash takes down the entire page.
- **Journal history loads upfront:** 20 entries loaded immediately on mount, even if user never scrolls.
- **No virtualization:** Flat lists for habits and journal entries.
- **No code splitting beyond route-level:** No dynamic imports or lazy-loaded components within pages.
- **Offline page text misleading:** Says "not available without internet" but the app works fine offline once cached.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, webpack) |
| UI | React 19, TypeScript strict |
| Styling | Tailwind CSS v4, custom OKLCh design tokens |
| Database | Dexie.js (IndexedDB wrapper) |
| PWA | `@ducanh2912/next-pwa` (Workbox) |
| Fonts | Fraunces (display), Inter (body), IBM Plex Mono (mono) |
| Icons | Lucide React |
| Prayer Times | `adhan` (installed, not yet integrated) |
| Linting | ESLint 9 (next/core-web-vitals + typescript) |
