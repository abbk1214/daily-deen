# Daily Deen

Prayer times, Quran, habits, journal, and insights. All offline.

## Why I Built This

I was the kind of Muslim who would pray on time for a week, then miss Fajr for a month. I tried apps that reminded me, but they were either too simple (just a clock) or too complicated (tracking everything from water intake to mood). I wanted something that focused on what actually matters: praying on time, every day, and building a streak I wouldn't want to break.

So I built Daily Deen. Not because the world needs another Islamic app, but because I needed one that worked the way I think.

## What It Does

**Prayer tracking that actually works.**
- Mark prayers as you complete them
- See your streak grow (or reset, which hurts enough to motivate)
- Know exactly when the next prayer is with a live countdown

**Quran reading with audio.**
- Full Quran with 3 reciters (Mishary Rashid Alafasy, Abu Bakr Al Shatri, Hani Ar-Rifai)
- Continue where you left off
- Bookmark ayahs that hit different

**Dhikr counter.**
- Morning and evening adhkar
- Tasbeeh counter with target tracking
- Your progress saves automatically

**Habit tracking.**
- Build routines around prayer
- Track whatever matters to you
- See your consistency over time

**Journey milestones.**
- See your prayer streaks grow
- Track Quran reading progress
- Remember how far you've come

**Works offline.**
- All data stored on your device
- No internet required after first load
- Your data never leaves your phone

## Tech Stack

I chose these tools because they fit the problem, not because they're trendy.

**Next.js 16** — Server-side rendering for the initial load, client-side for everything else. The hybrid approach lets us have a fast first paint while keeping the app interactive.

**React 19** — Component-based UI that's easy to reason about. The hooks system makes state management straightforward.

**Dexie.js (IndexedDB)** — Local-first database. Your prayer data lives on your device, not on some server. This means it works offline and your data stays private.

**Adhan.js** — Prayer time calculation library that supports 12 different calculation methods. This is the hard part done right.

**Tailwind CSS** — Utility-first CSS that lets you build UI fast without writing custom CSS. The design system uses CSS custom properties for theming.

**TypeScript** — Type safety catches bugs before they happen. With 211 tests, you want the types to match the tests.

## Architecture

The app follows a local-first architecture. Here's how it works:

```
┌─────────────────────────────────────┐
│           User Interface            │
│  (React Components + Hooks)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         State Management            │
│  (React Context + Custom Hooks)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Data Layer (Dexie.js)       │
│  (IndexedDB - 20 tables)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Prayer Calculation Engine      │
│  (Adhan.js - 12 methods)           │
└─────────────────────────────────────┘
```

**Why local-first?**
- Your data stays on your device (privacy)
- Works offline (reliability)
- No server costs (sustainability)
- Fast reads/writes (performance)

**Why not a backend?**
- Prayer times are calculated locally using coordinates
- No user accounts needed (initially)
- No data to sync (until you want cross-device)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/abbk1214/daily-deen.git
cd daily-deen

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Optional: Set up Supabase for cloud sync**
1. Create a Supabase project
2. Copy your project URL and anon key
3. Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```
4. Run the SQL migration in Supabase Dashboard

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

**211 tests covering:**
- Prayer time calculation (all 12 methods)
- Streak computation
- Hijri date conversion
- Qibla direction calculation
- Notification scheduling
- Data export/import
- Component rendering

## Deployment

The easiest way to deploy is on Vercel:

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Deploy

Or deploy manually:
```bash
pnpm build
pnpm start
```

## Limitations

I want to be honest about what works and what doesn't.

**What works well:**
- Prayer time calculation (tested against official mosque times)
- Offline support (all data stored locally)
- Quran reading with audio
- Dashboard showing next prayer and streak

**What doesn't work well yet:**
- **Notifications** — Prayer reminders only work when the app is open. On mobile, you need to add it to your Home Screen, and even then, iOS throttles notifications when the app is backgrounded. Push notifications (working when app is closed) need a server component and are planned for later.

- **No cross-device sync** — Your data lives on one device. If you switch phones, you lose your streaks. Cloud sync is planned but not implemented yet.

- **iOS limitations** — Apple doesn't let web apps send reliable notifications. The adhan sound won't play when the app is in the background. This is an Apple limitation, not something I can fix.

## What's Next

Things I want to build when I have time:

- [ ] Push notifications (requires server component)
- [ ] Cloud sync (Supabase integration)
- [ ] More calculation methods
- [ ] Widget support (when browsers support it)
- [ ] Native apps (iOS/Android) for better notification reliability
- [ ] Multi-language support (Arabic, Urdu, Malay)
- [ ] Family mode (track multiple people's prayers)

## License

MIT — do whatever you want with it.
