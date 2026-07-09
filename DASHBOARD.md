# Daily Deen — Dashboard Design Specification

> Screen-level design spec for the Dashboard — the home screen after login.
> All tokens reference `DESIGN.md`. No code. Pure design.

---

## 1. Page Layout

### 1.1 Top-Level Structure

```
┌─────────────────────────────────────────────────┐
│  Skip to Content Link (sr-only)                 │
├─────────────────────────────────────────────────┤
│  Top Bar (h-12/48px)                            │
│  Logo left · Greeting · Bell icon right         │
├────────────────────────────┬────────────────────┤
│  Main Content              │  Sidebar (≥1024px) │
│  ┌──────────────────────┐  │  ┌──────────────┐  │
│  │  Day Arc Hero        │  │  │  Prayer List  │  │
│  │  (full-width)        │  │  │  (sticky)     │  │
│  ├──────────────────────┤  │  └──────────────┘  │
│  │  Daily Progress      │  │  ┌──────────────┐  │
│  │  (3 trackers)        │  │  │  Quick Actions│  │
│  ├──────────────────────┤  │  └──────────────┘  │
│  │  Prayer Status       │  │                    │
│  │  (current/next)      │  │                    │
│  ├──────────────────────┤  │                    │
│  │  Affirmation         │  │                    │
│  │  (text block)        │  │                    │
│  └──────────────────────┘  │                    │
├────────────────────────────┴────────────────────┤
│  Bottom Nav (h-14/56px, <1024px only)           │
│  Home · Progress · Qur'an · More                │
└─────────────────────────────────────────────────┘
```

### 1.2 Breakpoint Layout Shifts

| Breakpoint | Main Content | Sidebar | Bottom Nav |
|---|---|---|---|
| `<640px` (mobile) | Single column, full width | Hidden | Visible |
| `640–1023px` (tablet) | Single column, max 720px | Hidden | Visible |
| `≥1024px` (desktop) | Left column, 720px max | Right column, 200px | Hidden (replaced by top bar nav) |

---

## 2. Section Specifications

### 2.1 Top Bar

**Height**: `--space-12` (48px)

**Layout**:
- Horizontal, items centered vertically
- Padding: `--space-5` (20px) horizontal, `--space-3` (12px) vertical
- Gap between greeting and bell: `auto` (push bell right)

**Elements**:
| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Logo / App Name | Fraunces | `--text-h4` (18px) | 600 | `--foreground` | Ink Night / soft Parchment |
| Greeting text | Inter | `--text-body-sm` (14px) | 400 | `--muted-foreground` | Muted text |
| Bell icon | Lucide `Bell` | `--icon-md` (20px) | — | `--foreground` | Inherit |

**Border**: Bottom, `--border` token, 1px solid.

**Behavior**:
- Sticky on scroll (z-index: `z-overlay` = 30)
- Backdrop blur: `backdrop-blur(8px)`, background `--background / 0.9`
- On mobile: hides on scroll down, reappears on scroll up (optional, can defer)

---

### 2.2 Day Arc Hero (Primary Visual)

**Purpose**: Show the sun's position from Fajr (pre-dawn) to Isha (night) with the current time marked on the arc. Five prayer time markers are shown as notches on the arc. Completed prayers fill the arc segment with Lantern Gold.

**Container**:
- Background: `--card` (lighter parchment surface)
- Border: `--border`, 1px
- Border radius: `--radius-md` (8px)
- Padding: `--space-8` (32px) top/bottom, `--space-6` (24px) left/right
- Shadow: `--shadow-xs` (raised elevation)

**Arc SVG**:
- Shape: Semi-circle (180° arc), opening upward
- Arc stroke width: 3px
- Arc stroke color: `--border` (track), `--dd-lantern-gold` (filled segments)
- Arc radius: Fluid — `clamp(100px, 20vw, 160px)`
- Center point: bottom-center of the container
- Notch markers: 5 small circles (8px diameter) positioned along the arc at Fajr, Dhuhr, Asr, Maghrib, Isha angles
- Notch fill: `--card` with `--border` stroke (uncompleted), Lantern Gold fill (completed)
- Current time indicator: 12px circle on the arc at the sun's calculated angle, filled `--dd-lantern-gold`, with a subtle glow (box-shadow: `0 0 8px oklch(0.76 0.14 85 / 0.3)`)

**Text Elements**:
| Element | Position | Font | Size | Weight | Color |
|---|---|---|---|---|---|
| Current time | Center below arc | IBM Plex Mono | `--text-h2` (32px) | 500 | `--foreground` |
| Date (Hijri) | Below current time | Inter | `--text-body-sm` (14px) | 400 | `--muted-foreground` |
| Date (Gregorian) | Below Hijri date | Inter | `--text-caption` (12px) | 400 | `--muted-foreground` |
| Prayer label (nearest) | Above arc, centered | Inter | `--text-body-sm` (14px) | 500 | `--foreground` |

**States**:
| State | Arc Appearance | Indicator |
|---|---|---|
| Fajr → Sunrise | Track visible, current indicator at Fajr position | `--dd-lantern-gold` dot |
| Sunrise → Isha | Track progressively filled with gold up to current time | Gold fill follows sun |
| All prayers completed | Full arc filled | Gold with subtle glow, "Day complete" text |
| Before Fajr | Empty track, indicator at left edge | Dimmed |

**Accessibility**:
- `role="img"` on SVG with `aria-label="Prayer times arc, currently [time]"`
- Each notch has `aria-label="[Prayer name] at [time]"`
- Current position announced via `aria-live="polite"` on time change

---

### 2.3 Daily Progress Trackers

**Purpose**: Three horizontal progress bars for Water, Exercise, and Journal — each tracking daily goals.

**Container**:
- Gap between trackers: `--space-4` (16px)
- Each tracker row: `--space-3` (12px) vertical padding

**Tracker Row Layout**:
```
┌──────────────────────────────────────────────────┐
│  [Icon]  Label              [Value] / [Goal]     │
│  ─────── ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────────────────────────┘
```

**Elements**:
| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Icon | Lucide `--icon-md` (20px) | — | — | `--muted-foreground` |
| Label (e.g. "Water") | Inter | `--text-body` (16px) | 500 | `--foreground` |
| Value (e.g. "4/8 glasses") | IBM Plex Mono | `--text-body-sm` (14px) | 400 | `--muted-foreground` |

**Progress Bar**:
- Height: 6px
- Background: `--muted` (soft parchment wash)
- Fill: `--dd-dusk-teal` (default), `--dd-quiet-sage` (success when 100%)
- Border radius: `--radius-full` (pill shape)
- Transition: `width 200ms ease-out` (animate fill on load/update)
- Width: `(value / goal) * 100%`

**Interaction**:
- Tap on tracker row → opens inline edit or bottom sheet (can increment/decrement value)
- Active state: row background flashes `--secondary` for 150ms
- Focus: `2px solid var(--ring)` ring on the row

**Accessibility**:
- Each row: `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="[Label]: [value] of [goal]"`
- Value change announced via `aria-live="polite"`

---

### 2.4 Prayer Status

**Purpose**: Show current prayer status — which prayer is now, which is next, and completion percentage.

**Container**:
- Background: `--card`
- Border: `--border`, 1px
- Border radius: `--radius-md` (8px)
- Padding: `--space-6` (24px)

**Layout**:
```
┌──────────────────────────────────────────┐
│  NOW: Dhuhr                              │
│  12:15 PM – 3:30 PM                      │
│  ████████████░░░░░░░░  60% complete      │
│                                          │
│  NEXT: Asr                               │
│  3:30 PM — in 2h 15m                     │
└──────────────────────────────────────────┘
```

**Typography**:
| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| "NOW" label | Inter | `--text-caption` (12px) | 500 | `--dd-dusk-teal` | Accent color |
| Current prayer name | Fraunces | `--text-h3` (20px) | 600 | `--foreground` | Primary |
| Time range | IBM Plex Mono | `--text-body-sm` (14px) | 400 | `--muted-foreground` | Muted |
| Progress % | IBM Plex Mono | `--text-body-sm` (14px) | 500 | `--dd-dusk-teal` | Accent |
| "NEXT" label | Inter | `--text-caption` (12px) | 500 | `--muted-foreground` | Muted |
| Next prayer name | Inter | `--text-body` (16px) | 500 | `--foreground` | Primary |
| Time until | IBM Plex Mono | `--text-body-sm` (14px) | 400 | `--muted-foreground` | Muted |

**Progress bar**: Same spec as Daily Progress trackers (6px height, pill shape, `--dd-dusk-teal` fill).

**Border accent**: Left border, 3px, `--dd-lantern-gold` — **only when current prayer is completed**. Otherwise no left border accent.

**Accessibility**:
- Container: `role="region"` with `aria-label="Prayer status"`
- Current prayer: `aria-live="polite"` (updates every minute)
- "in Xh Ym" countdown: `aria-live="polite"`, announced every 5 minutes (not every second)

---

### 2.5 Affirmation / Daily Quote

**Purpose**: Display a rotating Islamic reminder or affirmation.

**Container**:
- No card wrapper — direct text on background
- Max width: `65ch`
- Padding: `--space-12` (48px) top/bottom, `--space-6` (24px) left/right (centered)
- Text alignment: center

**Typography**:
| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Quote text | Fraunces | `--text-h2` (clamp 24–32px) | 600 | `--foreground` | Primary |
| Source attribution | Inter | `--text-body-sm` (14px) | 400 | `--muted-foreground` | Muted |

**Rules**:
- Max 2 sentences. If source is Hadith, include narrator chain abbreviation.
- Line height: `1.3` (tighter for display text)
- Letter spacing: `-0.015em`
- No decorative quotation marks — the typography itself is the frame.

**Behavior**:
- Changes daily at Fajr time (or on first load of the day)
- Transition: fade out old → fade in new (200ms, `--ease-in-out`)
- Respect `prefers-reduced-motion` — instant swap, no fade

---

### 2.6 Bottom Navigation

**Visible**: `<1024px` only

**Height**: `--space-14` (56px)

**Layout**:
- 4 items: Home, Progress, Qur'an, More
- Evenly distributed across full width
- Padding bottom: `env(safe-area-inset-bottom)` for PWA

**Elements per tab**:
| Element | Font | Size | Weight | Color (inactive) | Color (active) |
|---|---|---|---|---|---|
| Icon | Lucide `--icon-md` (20px) | — | — | `--muted-foreground` | `--dd-dusk-teal` |
| Label | Inter | `--text-caption` (12px) | 500 | `--muted-foreground` | `--dd-dusk-teal` |

**Active state**:
- Icon + label color: `--dd-dusk-teal`
- Optional: small dot (4px, `--dd-dusk-teal`) below label as indicator

**Border**: Top, `--border`, 1px solid.

**Elevation**: `--shadow-sm` (floating)

**Accessibility**:
- `role="tablist"` on container
- Each tab: `role="tab"`, `aria-selected="true/false"`, `aria-controls` pointing to page content
- Keyboard: arrow keys navigate between tabs, Enter/Space activates

---

### 2.7 Sidebar (Desktop Only, ≥1024px)

**Width**: 200px

**Layout**:
- Fixed right column
- Background: `--background` (matches page, no separate surface)
- Padding: `--space-6` (24px) all sides
- Gap between sections: `--space-8` (32px)

**Sections**:
1. **Prayer List** — All 5 prayers listed vertically
   - Each row: prayer name (Inter 14px 500), time (IBM Plex Mono 12px 400)
   - Completed: name in `--dd-lantern-gold`, checkmark icon `Lucide Check` in `--dd-lantern-gold`
   - Upcoming: name in `--foreground`, time in `--muted-foreground`
   - Current: name in `--dd-dusk-teal`, bold, left border 3px `--dd-dusk-teal`
   - Gap between rows: `--space-3` (12px)

2. **Quick Actions** — 2–3 action buttons
   - Style: Ghost buttons (text-only, `--foreground` color, transparent bg)
   - Hover: background `--secondary`
   - Font: Inter 14px 500
   - Gap between buttons: `--space-2` (8px)

---

## 3. Component Sizes Summary

| Component | Width | Height | Padding | Radius |
|---|---|---|---|---|
| Top Bar | 100% | 48px | 20px h / 12px v | 0 (none) |
| Day Arc Hero | 100% (mobile), 720px max (desktop) | Auto (fluid) | 32px v / 24px h | 8px |
| Daily Progress Tracker | 100% | Row: 48px | 12px v / 16px h | 0 (none) |
| Progress Bar | 100% | 6px | — | 9999px |
| Prayer Status Card | 100% | Auto | 24px | 8px |
| Affirmation | 100%, max 65ch | Auto | 48px v / 24px h | 0 |
| Bottom Nav | 100% | 56px | 0 + safe-area | 0 |
| Sidebar | 200px | 100% (sticky) | 24px | 0 |
| Sidebar Prayer Row | 100% | 40px | 8px h | 0 |

---

## 4. Spacing Map

### 4.1 Vertical Rhythm (Mobile)

```
Top Bar                          48px
├── gap                          0px (flush)
Day Arc Hero
├── top padding                  32px
├── arc + text                   ~200px
├── bottom padding               32px
├── gap to next section          32px (space-8)
Daily Progress
├── Tracker 1                    48px
├── gap                          16px (space-4)
├── Tracker 2                    48px
├── gap                          16px
├── Tracker 3                    48px
├── gap to next section          48px (space-12)
Prayer Status
├── card padding                 24px
├── card content                 ~100px
├── gap to next section          48px (space-12)
Affirmation
├── top padding                  48px
├── text                         ~80px
├── bottom padding               48px
Bottom Nav                       56px (fixed)
├── safe-area bottom             env(safe-area-inset-bottom)
```

### 4.2 Horizontal Rhythm (Mobile)

```
Page padding (left/right)       20px (space-5)
Content width                   100% - 40px
```

### 4.3 Desktop Additions (≥1024px)

```
Main column                     720px max, centered
├── gap between sections         48px (space-12)
Sidebar                         200px
├── left margin from main        32px (space-8)
Page padding (left/right)       32px to 64px (space-8 to space-16)
```

---

## 5. Interaction States

### 5.1 Buttons / Interactive Elements

| State | Background | Text Color | Border | Shadow | Duration |
|---|---|---|---|---|---|
| Default | — (transparent) | `--foreground` | — | — | — |
| Hover | `--secondary` | `--foreground` | — | — | 150ms `--ease-out` |
| Active | `--muted` | `--foreground` | — | — | 0ms (instant) |
| Focus | — | `--foreground` | — | `2px solid var(--ring)`, 2px offset | 150ms `--ease-out` |
| Disabled | — | `--muted-foreground` | — | — | — |

### 5.2 Card Surfaces (Day Arc, Prayer Status)

| State | Background | Border | Shadow | Transform |
|---|---|---|---|---|
| Default | `--card` | `--border` 1px | `--shadow-xs` | none |
| Hover (desktop) | `--card` | `--border` 1px | `--shadow-sm` | none |
| Active (tap) | `--card` | `--border` 1px | `--shadow-xs` | none |

### 5.3 Progress Bar Fill

| State | Fill Color | Transition |
|---|---|---|
| In progress | `--dd-dusk-teal` | `width 200ms --ease-out` |
| Complete (100%) | `--dd-quiet-sage` | `width 200ms --ease-out` |
| Updated (value change) | Color cross-fade | `fill-color 200ms --ease-in-out` |

### 5.4 Bottom Nav Tabs

| State | Icon Color | Label Color | Background |
|---|---|---|---|
| Inactive | `--muted-foreground` | `--muted-foreground` | — |
| Active | `--dd-dusk-teal` | `--dd-dusk-teal` | — |
| Hover (inactive) | `--foreground` | `--foreground` | `--secondary` |
| Focus | `--foreground` | `--foreground` | —, ring visible |

---

## 6. Animation Specifications

### 6.1 Page Load Sequence

| Step | Element | Animation | Duration | Delay |
|---|---|---|---|---|
| 1 | Top Bar | Fade in (opacity 0→1) | 200ms | 0ms |
| 2 | Day Arc Hero | Fade in (opacity 0→1) | 200ms | 50ms |
| 3 | Daily Progress | Fade in (opacity 0→1) | 200ms | 100ms |
| 4 | Prayer Status | Fade in (opacity 0→1) | 200ms | 150ms |
| 5 | Affirmation | Fade in (opacity 0→1) | 200ms | 200ms |

All use `--ease-out` (`cubic-bezier(0, 0, 0.2, 1)`).

### 6.2 Micro-interactions

| Interaction | Animation | Duration |
|---|---|---|
| Progress bar update | Width transition | 200ms `--ease-out` |
| Prayer completion (arc fill) | Stroke-dashoffset animation | 300ms `--ease-out` |
| Tab switch (bottom nav) | Color cross-fade | 150ms `--ease-out` |
| Card hover (desktop) | Shadow xs → sm | 150ms `--ease-out` |
| Value increment (tracker) | Number swap (opacity 0→1) | 150ms `--ease-out` |

### 6.3 Reduced Motion

All animations disabled via `prefers-reduced-motion: reduce`:
- No fade-in on page load — all elements visible immediately
- No translate — elements appear at final position
- Progress bar width: instant, no transition
- Arc fill: instant, no stroke animation
- Tab color change: instant
- Shadow hover: instant

---

## 7. Accessibility Specifications

### 7.1 Landmark Roles

| Element | HTML | ARIA |
|---|---|---|
| Skip link | `<a href="#main">` | `class="sr-only"` (visible on focus) |
| Top bar | `<header>` | — |
| Main content | `<main id="main">` | — |
| Day Arc | `<section>` | `role="img"` on SVG, `aria-label` |
| Progress section | `<section>` | `aria-label="Daily progress"` |
| Prayer status | `<section>` | `role="region"`, `aria-label="Prayer status"` |
| Affirmation | `<aside>` | `aria-label="Daily affirmation"` |
| Bottom nav | `<nav>` | `aria-label="Main navigation"` |
| Sidebar | `<aside>` | `aria-label="Prayer schedule"` |

### 7.2 Focus Order

```
1. Skip to main content link
2. Bell icon (top bar)
3. Day Arc (tabindex="0", enter to expand details)
4. Water tracker (tabindex="0")
5. Exercise tracker (tabindex="0")
6. Journal tracker (tabindex="0")
7. Prayer status (tabindex="0")
8. Bottom nav: Home → Progress → Qur'an → More
```

**Focus ring**: `2px solid var(--ring)` with `2px` offset — always visible on keyboard focus, hidden on mouse click (`:focus-visible`).

### 7.3 Screen Reader Announcements

| Event | Element | `aria-live` | Text |
|---|---|---|---|
| Prayer time changes | Prayer status section | `polite` | "It is now [Prayer]. Next prayer: [Prayer] at [Time]." |
| Progress value updated | Progress bar | `polite` | "[Label]: [value] of [goal]" |
| Day arc position updates | Day arc SVG | `polite` (debounced 5min) | "Current time: [time]. Sun position: [percentage] of daylight." |
| All prayers completed | Prayer status | `assertive` | "All prayers completed for today. MashaAllah." |

### 7.4 Keyboard Navigation

| Key | Behavior |
|---|---|
| `Tab` | Move focus forward through interactive elements |
| `Shift+Tab` | Move focus backward |
| `Enter` / `Space` | Activate focused element (tracker increment, nav switch) |
| `Arrow Left/Right` | Navigate between bottom nav tabs (when nav focused) |
| `Escape` | Dismiss any open bottom sheet / inline edit |

### 7.5 Color Independence

- Prayer completion: Lantern Gold fill **+** checkmark icon **+** "completed" text — never gold-only
- Prayer status: colored label ("NOW" in Dusk Teal) **+** bold text — never color-only
- Progress bar: fill width **+** numeric value — never bar-only
- Active nav tab: teal color **+** dot indicator **+** bold label — never color-only

---

## 8. Responsive Behavior

### 8.1 Mobile (<640px)

**Layout**: Single column, full width, 20px horizontal padding.

**Day Arc**:
- SVG arc radius: `clamp(80px, 25vw, 120px)` (smaller on mobile)
- Container padding: `--space-6` (24px) vertical
- Current time text: `--text-h3` (20px) instead of h2 (32px)

**Daily Progress**:
- Full width, no side padding adjustments
- Tap targets: full row width (easy thumb reach)

**Bottom Nav**:
- Always visible, fixed to bottom
- Safe area padding: `env(safe-area-inset-bottom)` for iPhone notch

**Sidebar**: Hidden entirely.

### 8.2 Tablet (640–1023px)

**Layout**: Single column, max 720px centered, 24px horizontal padding.

**Day Arc**:
- SVG arc radius: `clamp(100px, 20vw, 160px)` (larger)
- Container padding: `--space-8` (32px) vertical

**Daily Progress**:
- Full width within 720px constraint

**Bottom Nav**: Still visible, same spec.

**Sidebar**: Hidden entirely.

### 8.3 Desktop (≥1024px)

**Layout**: Two-column — main (720px max) + sidebar (200px), 32px gap, 32–64px page padding.

**Day Arc**:
- SVG arc radius: `clamp(120px, 18vw, 180px)` (largest)
- Container padding: `--space-8` (32px) vertical, `--space-6` (24px) horizontal

**Daily Progress**:
- Full width within 720px constraint
- Hover states enabled on rows

**Bottom Nav**: Hidden — replaced by top bar navigation links (optional, can defer).

**Sidebar**:
- Sticky top: `--space-12` (48px) from top (below top bar)
- Visible immediately on page load
- Prayer list: all 5 prayers shown
- Quick actions: 2–3 text buttons

### 8.4 Wide (≥1280px)

Same as desktop. Max content width enforced at 1200px (main + sidebar + gap).

---

## 9. States

### 9.1 Empty State (No Data Yet)

**When**: First-time user, no prayer times set, no progress data.

**Day Arc**: Gray track only, no prayer markers, no current indicator. Label: "Set your location to see prayer times."

**Daily Progress**: All bars at 0%. Labels visible. No values shown — just "0 / 8", "0 / 30 min", "0 / 1".

**Prayer Status**: "No prayer times set. Add your location to get started."

**Affirmation**: Default first-run quote or "Welcome to Daily Deen."

**Action**: Primary button "Set Location" (Ink Night bg, Parchment text) in center of Day Arc area.

### 9.2 Loading State

**When**: Initial page load, data fetching from Dexie/IndexedDB.

**Skeleton pattern**:
- Day Arc: Pulsing gray circle (background `--muted`, 200ms pulse cycle)
- Progress bars: Gray bar at 50% width, pulsing
- Prayer status: Two gray rectangles (title + time), pulsing
- Affirmation: Two gray lines (text placeholder), pulsing

**Animation**: `opacity 0.4 → 0.7 → 0.4` on skeleton elements, 200ms cycle, `--ease-in-out`.

**Reduced motion**: Skeleton visible at `opacity: 0.5` static, no pulse.

### 9.3 Offline State

**When**: Device is offline, data loaded from Dexie but cannot sync.

**Banner**: Top of main content, full width, `--dd-dusk-teal` background (light), `--accent-foreground` text. Height: `--space-10` (40px). Text: "Offline — showing saved data." with `Lucide WifiOff` icon (16px).

**Behavior**: Auto-dismisses when connection restored. Does not block interaction with dashboard.

**Z-index**: Above content (`z-overlay` = 30), below top bar.

### 9.4 Completed Day State

**When**: All 5 prayers completed.

**Day Arc**: Full arc filled with Lantern Gold. Current indicator at Isha position. Glow effect on arc (`box-shadow: 0 0 12px oklch(0.76 0.14 85 / 0.25)`).

**Prayer Status**: All prayers listed with checkmarks. "All prayers completed for today" in `--dd-quiet-sage` text.

**Affirmation**: Special completion quote (e.g., "Indeed, those who believe and do righteous deeds — they are the best of creation.").

**Visual emphasis**: Lantern Gold used more prominently — arc glow, completion badge. This is the celebration moment.

### 9.5 Reduced Motion State

**When**: User has `prefers-reduced-motion: reduce` system setting.

**Behavior**:
- All page load animations disabled — elements appear immediately
- All micro-interactions disabled (no hover shadows, no progress transitions)
- Skeleton loading: static, no pulse
- Tab switching: instant color change
- Day arc: static, no position animation
- Affirmation: instant text swap on daily change

---

## 10. Deliverables

### 10.1 Specification Documents

| Deliverable | Format | Status |
|---|---|---|
| Dashboard Design Spec (this document) | Markdown | ✅ Complete |
| Design System (DESIGN.md) | Markdown | ✅ Complete |
| CSS Tokens (tokens.css) | CSS | ✅ Complete |
| TypeScript Tokens (lib/tokens.ts) | TypeScript | ✅ Complete |

### 10.2 Visual Reference Diagrams

The following ASCII diagrams serve as layout references. For implementation, refer to the token values and spacing specs above.

**Mobile Layout (single column)**:
```
┌────────────────────────┐
│     Top Bar (48px)     │
├────────────────────────┤
│                        │
│    ┌──────────────┐    │
│    │   Day Arc    │    │  ← card surface, radius 8px
│    │  (SVG arc)   │    │
│    │  12:45 PM    │    │  ← IBM Plex Mono 32px
│    │  15 Ramadan  │    │  ← Inter 14px muted
│    └──────────────┘    │
│                        │
│  ─── 32px gap ───      │
│                        │
│  💧 Water    4/8       │  ← tracker row, 48px
│  ████████░░░░          │  ← progress bar, 6px
│                        │
│  🏃 Exercise  15/30    │
│  ██████░░░░░░          │
│                        │
│  📝 Journal   0/1      │
│  ░░░░░░░░░░░░          │
│                        │
│  ─── 48px gap ───      │
│                        │
│  ┌──────────────┐    │
│  │ NOW: Dhuhr   │    │
│  │ 12:15 – 3:30 │    │
│  │ ████░░ 60%   │    │
│  │ NEXT: Asr    │    │
│  │ in 2h 15m    │    │
│  └──────────────┘    │
│                        │
│  ─── 48px gap ───      │
│                        │
│   "And He found you    │
│    lost and guided."   │
│    — Quran 93:7        │
│                        │
├────────────────────────┤
│  🏠  📊  📖  ⋯       │  ← bottom nav, 56px
│  Home                  │
└────────────────────────┘
```

**Desktop Layout (two-column)**:
```
┌────────────────────────────────────────────────────────┐
│  Top Bar (48px)                                        │
├──────────────────────────────┬─────────────────────────┤
│                              │                         │
│  ┌────────────────────┐     │  Prayer Schedule        │
│  │     Day Arc        │     │  ─────────────          │
│  │    (larger SVG)    │     │  ✓ Fajr    5:15 AM     │
│  │                    │     │  • Dhuhr   12:15 PM    │
│  └────────────────────┘     │    Asr     3:30 PM     │
│                              │    Maghrib 6:45 PM     │
│  ─── 48px gap ───           │    Isha    8:15 PM     │
│                              │                         │
│  Progress trackers...        │  Quick Actions          │
│                              │  ─────────────          │
│  ─── 48px gap ───           │  + Log water            │
│                              │  + Start journal        │
│  Prayer status card...       │  + View Qur'an          │
│                              │                         │
│  ─── 48px gap ───           │                         │
│                              │                         │
│  Affirmation text...         │                         │
│                              │                         │
└──────────────────────────────┴─────────────────────────┘
```

### 10.3 Token Usage Summary

| Token | Where Used |
|---|---|
| `--background` | Page background, sidebar |
| `--card` | Day Arc container, Prayer Status card |
| `--border` | Card borders, top bar bottom, bottom nav top |
| `--foreground` | All primary text |
| `--muted-foreground` | Secondary text, timestamps, inactive nav |
| `--secondary` | Hover states, skeleton loading |
| `--muted` | Progress bar track, skeleton base |
| `--ring` | All focus rings (Dusk Teal) |
| `--dd-lantern-gold` | Arc fill (completed), current time indicator, prayer completion glow |
| `--dd-dusk-teal` | Active nav tab, "NOW" label, progress bar fill, current prayer highlight |
| `--dd-quiet-sage` | Progress bar at 100%, completed day text |
| `--shadow-xs` | Cards at rest |
| `--shadow-sm` | Cards on hover, bottom nav |
| `--radius-md` | Day Arc card, Prayer Status card |
| `--radius-full` | Progress bar, current time indicator dot |

---

*End of Dashboard specification. All values reference DESIGN.md tokens.*
