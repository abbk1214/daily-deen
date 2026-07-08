# Daily Deen

Your Islamic daily companion for productivity and spiritual growth.

## Features

- **Offline-first**: Works completely offline with IndexedDB
- **Prayer times**: Calculate prayer times based on location and method
- **Journal**: Track daily spiritual reflections and moods
- **Habits**: Manage spiritual and physical habits (exercise, hydration, etc.)
- **Notifications**: Customizable notification system
- **Settings**: Location and prayer calculation preferences

## Installation

```bash
pnpm install
pnpm dev
```

## Development

- Type checking: `pnpm exec tsc --noEmit`
- Linting: `pnpm lint`
- Build: `pnpm build`

## Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Dexie (IndexedDB)
- Adhan (prayer calculations)
- Base UI (components)
- Lucide React (icons)

## Offline Capabilities

The application uses:
- IndexedDB for local storage via Dexie
- Service Worker with next-pwa for caching
- Local notifications
- Persistent data storage

## Data Structure

The database includes 5 tables:
- `settings`: User preferences (location, method, notifications)
- `prayers`: Daily prayer times and completion status
- `journal`: Daily entries with mood and reflections
- `habits`: User habit definitions
- `habitLogs`: Daily habit tracking

## Default Habits

- Exercise (30 minutes)
- Walk (10,000 steps)
- Hydration (8 glasses)

## License

MIT
