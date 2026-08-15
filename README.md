# Daily Deen

Your Islamic daily companion for productivity and spiritual growth.

## Features

- **Offline-first**: Works completely offline with IndexedDB
- **Prayer times**: Calculate prayer times based on location and method
- **Quran reader**: Full Quran with word-by-word, bookmarks, khatmah tracking
- **Journal**: Track daily spiritual reflections and moods
- **Habits**: Manage spiritual and physical habits
- **Wellness**: Mood, water, sleep, and exercise tracking
- **Insights**: Personal analytics and correlation analysis
- **Timeline**: Journey history and milestones
- **AI Companion**: Local and cloud-powered spiritual guidance
- **Dhikr**: Remembrance tracker
- **Zakat**: Calculator
- **Qibla**: Compass with direction
- **Seasonal**: Ramadan, Hajj, Eid detection

## Installation

```bash
pnpm install
pnpm dev
```

## Development

```bash
pnpm lint          # Lint
pnpm tsc --noEmit  # Type check
pnpm test          # Run tests
pnpm build         # Build
```

**Quality gate** (must pass before any commit):
```bash
pnpm lint && pnpm tsc --noEmit && pnpm test && pnpm build
```

## Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Dexie.js (IndexedDB)
- Adhan (prayer calculations)
- Lucide React (icons)
- @tanstack/react-virtual (virtual lists)
- Vitest (testing)

## Data Structure

20 IndexedDB tables via Dexie.js:
- `prayers`, `prayerLogs` — Prayer times and check-ins
- `habits`, `habitLogs` — Habit definitions and tracking
- `journal` — Daily entries with mood and tags
- `settings`, `quranSettings` — App and reader preferences
- `quranBookmarks`, `quranProgress` — Quran reading state
- `khatmahGoals`, `khatmahProgress`, `readingSessionLogs` — Quran completion tracking
- `goals`, `goalCheckIns` — Spiritual goals
- `moodEntries`, `waterEntries`, `sleepEntries`, `exerciseEntries` — Wellness data
- `dailyQuotes`, `taraweeh` — Daily quotes and taraweeh tracking

## License

MIT
