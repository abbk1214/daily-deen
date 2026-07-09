# Daily Deen — Navigation Design Specification

> Global navigation system — bottom nav (mobile), sidebar (desktop), collapsed state.
> All tokens reference `DESIGN.md`. No code. Pure design.
> Aesthetic: Linear / Notion Calendar — not Material Design.

---

## 1. Navigation Model

### 1.1 Surface Strategy

| Breakpoint | Primary Nav | Pattern |
|---|---|---|
| `<1024px` (mobile + tablet) | Bottom navigation bar | 4 tabs, fixed bottom |
| `≥1024px` (desktop) | Left sidebar | Collapsible, 200px expanded / 64px collapsed |

The navigation never uses a hamburger menu. Every destination is one tap away. No hidden drawers, no overflow menus, no "More" screens that lead to settings.

### 1.2 Destinations

| # | Label | Icon (Lucide) | Route | Notes |
|---|---|---|---|---|
| 1 | Home | `Home` | `/` | Dashboard — day arc, progress, prayer status |
| 2 | Habits | `ListChecks` | `/habits` | Daily habit tracking |
| 3 | Journal | `BookOpen` | `/journal` | Reflective writing |
| 4 | Settings | `Settings` | `/settings` | App configuration |

**Why these four**: Each represents a core daily action — check status (Home), log habits (Habits), reflect (Journal), configure (Settings). No feature is more than one tap away.

### 1.3 Information Architecture

```
Home (Dashboard)
├── Day Arc Hero
├── Daily Progress
├── Prayer Status
└── Affirmation

Habits
├── Week Strip
├── Habit Rows
└── Add Habit

Journal
├── Mood Selector
├── Entry Editor
├── Tags
└── Previous Entries

Settings (scrollable single page)
├── General
├── Prayer Calculation
├── Location
├── Notifications
├── Daily Targets
├── Appearance
└── About
```

---

## 2. Bottom Navigation (Mobile + Tablet)

### 2.1 Container

| Property | Value | Token |
|---|---|---|
| Position | Fixed, bottom | — |
| Width | 100vw | — |
| Height | 56px content + safe area | `--space-14` (56px) |
| Background | `--background` | Page background (not a separate surface) |
| Border top | 1px solid `--border` | Hairline divider |
| Z-index | `z-overlay` (30) | Above page content |
| Backdrop blur | none | — (solid background, no glassmorphism) |

**Safe area padding**:
```css
padding-bottom: env(safe-area-inset-bottom);
```
On devices with home indicators (iPhone, modern Android), the bar extends behind the indicator area. The 56px content height sits above the safe area. Total visual height: `56px + env(safe-area-inset-bottom)`.

### 2.2 Layout

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐    │
│   │  🏠  │   │  📋  │   │  📖  │   │  ⚙️  │    │
│   │ Home │   │Habits│   │Journal│   │Settings│   │
│   │  ·   │   │      │   │      │   │      │    │
│   └──────┘   └──────┘   └──────┘   └──────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
        ↑ active tab has dot indicator
```

Four tabs, evenly distributed. Each tab is a self-contained column: icon on top, label below, optional indicator dot below label.

### 2.3 Tab Anatomy

```
     ┌─────┐
     │ Icon│     ← 20px Lucide, stroke 1.5
     │     │
     └─────┘
    Label Text   ← 12px Inter, weight 500
       ·         ← 4px dot (active only)
```

**Vertical spacing within tab**:
| Element | Gap | Token |
|---|---|---|
| Icon → label | 4px | `--space-1` |
| Label → dot | 2px | `--space-0-5` |

**Tab width**: `calc(100% / 4)` — evenly distributed.

**Tab height**: Full container height (56px content area). The entire column is the tap target.

### 2.4 Icon Sizing

| Property | Value | Token |
|---|---|---|
| Default size | 20px × 20px | `--icon-md` |
| Stroke width | 1.5px | Lucide default |
| Color (inactive) | `--muted-foreground` | — |
| Color (active) | `--dd-dusk-teal` | Accent |
| Color (hover) | `--foreground` | — |

**No filled icons**. All icons are stroke-only, consistent with DESIGN.md iconography rules.

**Icon selection rationale**:
| Tab | Icon | Why |
|---|---|---|
| Home | `Home` | Universal, immediately recognizable |
| Habits | `ListChecks` | Checklist metaphor — habits are items to complete |
| Journal | `BookOpen` | Open book — journaling, writing |
| Settings | `Settings` | Gear — universally understood |

### 2.5 Label Sizing

| Property | Value | Token |
|---|---|---|
| Font | Inter | `--font-body` |
| Size | 12px | `--text-caption` |
| Weight (inactive) | 500 | `--weight-medium` |
| Weight (active) | 500 | `--weight-medium` |
| Letter spacing | 0.02em | `--tracking-wide` |
| Color (inactive) | `--muted-foreground` | — |
| Color (active) | `--dd-dusk-teal` | Accent |
| Color (hover) | `--foreground` | — |
| Max width | 64px | — (truncate with ellipsis if exceeded) |

**Truncation**: If a label exceeds 64px (unlikely with these four labels), truncate with ellipsis. The icon provides identification when label is clipped.

### 2.6 Active State

When a tab is active:

| Property | Value |
|---|---|
| Icon color | `--dd-dusk-teal` |
| Label color | `--dd-dusk-teal` |
| Indicator dot | 4px × 4px circle, `--dd-dusk-teal`, centered below label |
| Background | none (no highlight, no pill, no underline bar) |

**Design rationale**: Linear and Notion Calendar use minimal active indicators — a subtle color shift or tiny dot, never a bold underline bar or background pill. The Dusk Teal color change + dot is sufficient. No animation on the dot (it appears/disappears instantly).

**Indicator dot specification**:
| Property | Value |
|---|---|
| Size | 4px × 4px |
| Shape | Circle (`--radius-full`) |
| Color | `--dd-dusk-teal` |
| Position | Centered horizontally, 2px below label baseline |
| Animation | None (instant appear/disappear) |

### 2.7 Inactive State

When a tab is inactive:

| Property | Value |
|---|---|
| Icon color | `--muted-foreground` |
| Label color | `--muted-foreground` |
| Indicator dot | Hidden |
| Background | none |

### 2.8 Hover State (Desktop/Tablet with pointer)

| Property | Value |
|---|---|
| Icon color | `--foreground` |
| Label color | `--foreground` |
| Background | none (no hover background) |
| Cursor | `pointer` |
| Transition | color 150ms `--ease-out` |

**Design rationale**: Linear's sidebar has no hover background — only a color shift. This is cleaner than Material's ripple or background highlight. The color shift to `--foreground` signals interactivity without adding visual weight.

### 2.9 Focus State

| Property | Value |
|---|---|
| Focus ring | `2px solid var(--ring)` (Dusk Teal) |
| Focus offset | 2px |
| Focus scope | Applied to the entire tab column (icon + label + dot) |
| Visible only on | `:focus-visible` (keyboard navigation) |

**Focus ring shape**: Rectangular, wrapping the tab's bounding box. Not circular, not pill-shaped. The ring follows the tab's rectangular hit area.

### 2.10 Touch Target

| Property | Value |
|---|---|
| Minimum size | 44px × 44px |
| Actual hit area | Full tab column: `calc(100vw / 4) × 56px` |
| Padding | None needed — the column itself is the target |

Each tab occupies 25% of the viewport width. On a 375px screen: ~93px wide × 56px tall — well above the 44px minimum.

---

## 3. Desktop Sidebar

### 3.1 Expanded State (≥1024px)

**Container**:

| Property | Value | Token |
|---|---|---|
| Position | Fixed, left | — |
| Width | 200px | — |
| Height | 100vh | — |
| Background | `--background` | Same as page (no separate surface) |
| Border right | 1px solid `--border` | Hairline divider |
| Z-index | `z-raised` (10) | Below top bar |
| Padding | `--space-6` (24px) all sides | — |

**Layout**:
```
┌──────────────────┐
│                  │
│  Daily Deen      │  ← app name, top
│                  │
│  ──────────────  │  ← 1px divider
│                  │
│  ●  Home         │  ← active: teal dot + bold
│     Habits       │
│     Journal      │
│     Settings     │
│                  │
│  ──────────────  │  ← 1px divider
│                  │
│  v1.0.0          │  ← version, bottom
│                  │
└──────────────────┘
```

### 3.2 App Name Header

| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| "Daily Deen" | Fraunces | 16px | 600 | `--foreground` | Display, small |

- Margin bottom: `--space-6` (24px)
- Letter spacing: `-0.01em`
- No icon, no logo — text only

### 3.3 Navigation Links

Each link is a row:

```
  ●  Home          ← active
     Habits        ← inactive
     Journal       ← inactive
     Settings      ← inactive
```

**Link row anatomy**:

| Element | Font | Size | Weight | Color (inactive) | Color (active) |
|---|---|---|---|---|---|
| Icon | Lucide | 20px (`--icon-md`) | — | `--muted-foreground` | `--dd-dusk-teal` |
| Label | Inter | 14px (`--text-body-sm`) | 500 | `--muted-foreground` | `--foreground` (bold) |

**Spacing within row**:
| Element | Gap | Token |
|---|---|---|
| Icon → label | 12px | `--space-3` |
| Between rows | 4px | `--space-1` |

**Row height**: 36px (icon 20px + vertical padding).

**Row padding**: `--space-1` (4px) vertical, `--space-2` (8px) horizontal.

**Row border radius**: `--radius-sm` (4px) — subtle rounding for hover area.

### 3.4 Active State (Sidebar)

| Property | Value |
|---|---|
| Icon color | `--dd-dusk-teal` |
| Label color | `--foreground` |
| Label weight | 600 (semibold) |
| Indicator | 4px × 4px dot, `--dd-dusk-teal`, left of icon |
| Background | none (no highlight) |
| Left border | none (not a colored left-border accent) |

**Design rationale**: Linear uses a tiny dot or subtle background tint for active state. We use the dot (consistent with bottom nav). No colored left border — that's the "dashboard-card aesthetic" anti-pattern from DESIGN.md.

### 3.5 Inactive State (Sidebar)

| Property | Value |
|---|---|
| Icon color | `--muted-foreground` |
| Label color | `--muted-foreground` |
| Label weight | 500 (medium) |
| Background | none |

### 3.6 Hover State (Sidebar)

| Property | Value |
|---|---|
| Row background | `--secondary` (subtle tint) |
| Icon color | `--foreground` |
| Label color | `--foreground` |
| Cursor | `pointer` |
| Transition | background 150ms `--ease-out`, color 150ms `--ease-out` |

**Design rationale**: Notion Calendar uses a subtle background tint on hover. This provides clear feedback without the heaviness of Material's ripple effect. The `--secondary` token is a very light parchment wash in light mode — barely visible, just enough to register.

### 3.7 Focus State (Sidebar)

| Property | Value |
|---|---|
| Focus ring | `2px solid var(--ring)` (Dusk Teal) |
| Focus offset | 2px |
| Focus scope | Entire row (icon + label) |
| Visible only on | `:focus-visible` |

### 3.8 Version Footer

Positioned at the bottom of the sidebar, separated by a divider:

| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Version | IBM Plex Mono | 12px (`--text-mono-sm`) | 400 | `--muted-foreground` | Mono small |

- Margin top: `--space-8` (32px) — pushed to bottom via `flex-end` or absolute positioning
- Padding top: `--space-6` (24px) — above the divider
- Divider: 1px `--border`, full width

---

## 4. Collapsed Sidebar

### 4.1 Trigger

The sidebar collapses when:
1. User clicks the collapse button (top of sidebar), OR
2. Viewport narrows below 1024px (automatic), OR
3. User hasn't interacted with sidebar for 3+ seconds and viewport is <1280px (auto-collapse, optional)

### 4.2 Collapsed State (64px)

**Container**:

| Property | Value |
|---|---|
| Width | 64px |
| Height | 100vh |
| Background | `--background` |
| Border right | 1px solid `--border` |
| Padding | `--space-2` (8px) horizontal, `--space-6` (24px) vertical |

**Layout**:
```
┌────────┐
│        │
│  ◁     │  ← collapse/expand toggle
│        │
│  ────  │
│        │
│  🏠    │  ← icons only, no labels
│  📋    │
│  📖    │
│  ⚙️    │
│        │
└────────┘
```

### 4.3 Icon-Only Links

| Element | Value |
|---|---|
| Icon size | 20px (`--icon-md`) |
| Icon color (inactive) | `--muted-foreground` |
| Icon color (active) | `--dd-dusk-teal` |
| Icon color (hover) | `--foreground` |
| Row size | 44px × 44px |
| Row radius | `--radius-sm` (4px) |
| Indicator (active) | 4px dot, `--dd-dusk-teal`, positioned at left edge of row |

**Tooltip on hover**: When collapsed, hovering an icon shows a tooltip:
- Text: the nav label (e.g., "Home")
- Position: right of the icon, 8px gap
- Background: `--popover`
- Border: 1px `--border`
- Border radius: `--radius-sm` (4px)
- Shadow: `--shadow-sm`
- Font: Inter 12px/500
- Color: `--foreground`
- Padding: `--space-1` (4px) vertical, `--space-2` (8px) horizontal
- Delay: 300ms (prevent flash on quick mouse movement)
- Arrow: none (no tooltip arrow)

### 4.4 Expand Trigger

At the top of the collapsed sidebar:

| Element | Value |
|---|---|
| Icon | `Lucide PanelLeftOpen` (expand) / `Lucide PanelLeftClose` (collapse) |
| Size | 20px (`--icon-md`) |
| Color | `--muted-foreground` |
| Row size | 44px × 44px |
| Hover | `--foreground` |
| Focus | Ring visible |

**Toggle behavior**:
- Click: expands to 200px or collapses to 64px
- State persists in `localStorage`
- Animation: width transition 200ms `--ease-out` (respect reduced motion)

### 4.5 Collapse Animation

| Property | Value |
|---|---|
| Transition | width 200ms `--ease-out` |
| Content reflow | Labels fade out (opacity 0) as width shrinks, icons remain |
| Tooltip | Appears after 300ms delay |

**Reduced motion**: Width change is instant (no 200ms transition). Labels disappear instantly.

---

## 5. Safe Areas

### 5.1 Bottom Safe Area

**Affected**: Bottom navigation bar.

```css
padding-bottom: env(safe-area-inset-bottom);
```

**Behavior**:
- On devices with home indicator (iPhone X+, modern Android): bar extends behind indicator
- Content (icon + label + dot) sits above the safe area
- Total visual height: `56px + env(safe-area-inset-bottom)`
- On devices without home indicator: `env(safe-area-inset-bottom)` = 0, no extra padding

### 5.2 Top Safe Area

**Affected**: Top bar.

```css
padding-top: env(safe-area-inset-top);
```

**Behavior**:
- On devices with notch/dynamic island: top bar extends behind the sensor housing
- Content sits below the safe area
- Total visual height: `48px + env(safe-area-inset-top)`

### 5.3 Left/Right Safe Areas

**Affected**: Sidebar on desktop, page content on mobile.

```css
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

**Behavior**:
- On devices with rounded screen corners (some tablets): content avoids corners
- Typically 0 on phones, variable on tablets
- Applied to page container, not to sidebar

### 5.4 Safe Area Summary

| Edge | Token | Applies To |
|---|---|---|
| Bottom | `env(safe-area-inset-bottom)` | Bottom nav bar |
| Top | `env(safe-area-inset-top)` | Top bar |
| Left | `env(safe-area-inset-left)` | Page content (rarely non-zero) |
| Right | `env(safe-area-inset-right)` | Page content (rarely non-zero) |

**Viewport meta tag** (required for safe areas):
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

## 6. Desktop Breakpoints

### 6.1 Breakpoint Behavior

| Breakpoint | Sidebar | Bottom Nav | Layout |
|---|---|---|---|
| `<640px` (mobile) | Hidden | Visible, 56px + safe area | Full-width content |
| `640–1023px` (tablet) | Hidden | Visible, 56px + safe area | Content max 720px, centered |
| `1024–1279px` (laptop) | Visible, 200px (or 64px collapsed) | Hidden | Sidebar + content |
| `1280–1535px` (desktop) | Visible, 200px (or 64px collapsed) | Hidden | Sidebar + content |
| `≥1536px` (wide) | Visible, 200px (or 64px collapsed) | Hidden | Sidebar + content, max 1200px |

### 6.2 Transition Point

At exactly 1024px:
- Bottom nav fades out (opacity 0, 150ms)
- Sidebar fades in (opacity 0→1, 150ms)
- Content reflows from full-width to sidebar + content layout

**Reduced motion**: Instant switch, no fade.

### 6.3 Content Area Margins

| Sidebar State | Left Margin | Right Margin | Max Width |
|---|---|---|---|
| Expanded (200px) | 200px | auto | Content width |
| Collapsed (64px) | 64px | auto | Content width |
| Hidden (<1024px) | 0 | 0 | 100% |

---

## 7. Offline Indicator

### 7.1 Position

The offline indicator is **not** part of the navigation bar. It is a separate banner that appears below the top bar, above page content. This keeps the navigation clean and the status message contextual.

### 7.2 Appearance

| Property | Value | Token |
|---|---|---|
| Position | Below top bar, full width | — |
| Height | 40px | `--space-10` |
| Background | `--dd-dusk-teal` | Accent |
| Text color | `--accent-foreground` | Light on teal |
| Text | "Offline — data saved locally" | — |
| Icon | `Lucide WifiOff` | `--icon-sm` (16px) |
| Z-index | `z-overlay` (30) | Above content, below top bar |
| Dismiss | Auto on reconnection | — |

### 7.3 Behavior

- Appears instantly when connection is lost
- Dismisses with fade (opacity 0, 150ms `--ease-out`) when connection restores
- Does not displace navigation — sits between top bar and content
- On mobile: scrolls with content (not fixed)
- On desktop: scrolls with content (not fixed)

### 7.4 Reduced Motion

- Appear: instant (no fade)
- Dismiss: instant (no fade)

---

## 8. Loading Indicator

### 8.1 Per-Page Loading

When navigating between screens, a loading indicator shows progress.

**Position**: Below top bar, full width.

**Appearance**:

| Property | Value |
|---|---|
| Height | 2px |
| Background | `--dd-dusk-teal` (Accent) |
| Position | Fixed, below top bar |
| Z-index | `z-overlay` (30) |
| Animation | Indeterminate progress (translateX slide) |

**Animation specification**:
- A 40px-wide segment slides left to right across the full width
- Duration: 1.5s per cycle
- Easing: `--ease-in-out`
- Loop: infinite until page load completes

**Reduced motion**: No animation. Show a static 2px bar at 50% width, centered, opacity 0.5. Disappears when load completes.

### 8.2 Completion

When page load completes:
- Bar fades out (opacity 1→0, 150ms `--ease-out`)
- Then removed from DOM

### 8.3 Skeleton Coordination

The loading bar works in tandem with page-level skeletons:
- Loading bar appears immediately on navigation
- Page content shows skeleton (per screen spec)
- Loading bar disappears when content is ready
- Skeletons remain until data loads from Dexie

---

## 9. Keyboard Navigation

### 9.1 Bottom Nav (Mobile/Tablet)

| Key | Behavior |
|---|---|
| `Arrow Left` | Move focus to previous tab |
| `Arrow Right` | Move focus to next tab |
| `Home` | Move focus to first tab |
| `End` | Move focus to last tab |
| `Enter` / `Space` | Activate focused tab (navigate) |
| `Tab` | Move focus out of nav to page content |

**Roving tabindex**: Only the active tab has `tabindex="0"`. All others have `tabindex="-1"`. Arrow keys move focus between tabs. This prevents Tab from visiting every tab individually.

### 9.2 Sidebar (Desktop)

| Key | Behavior |
|---|---|
| `Arrow Up` | Move focus to previous link |
| `Arrow Down` | Move focus to next link |
| `Home` | Move focus to first link |
| `End` | Move focus to last link |
| `Enter` / `Space` | Activate focused link (navigate) |
| `Tab` | Move focus out of sidebar to page content |
| `Escape` | Collapse sidebar (if expanded) |

**Roving tabindex**: Same as bottom nav — only active link has `tabindex="0"`.

### 9.3 Sidebar Toggle

| Key | Behavior |
|---|---|
| `Enter` / `Space` | Toggle sidebar expand/collapse |
| `Tab` | Move focus to next element (first nav link) |

### 9.4 Global Shortcuts

| Key | Behavior |
|---|---|
| `g` then `h` | Navigate to Home (Go Home) |
| `g` then `b` | Navigate to Habits (Go Habits) |
| `g` then `j` | Navigate to Journal (Go Journal) |
| `g` then `s` | Navigate to Settings (Go Settings) |

**Implementation**: Key sequence listener. `g` is pressed, then within 500ms the second key is pressed. If the second key doesn't match, the sequence resets. If the user is in an input field, shortcuts are disabled.

**Reduced motion**: No animation on shortcut navigation (instant page switch).

---

## 10. Touch Interactions

### 10.1 Bottom Nav

| Interaction | Behavior |
|---|---|
| Tap on tab | Navigate to destination |
| Tap on active tab | Scroll to top of current page |
| Long press | No action (not a shortcut menu) |
| Swipe up on nav | No action (not a drawer) |

### 10.2 Sidebar (Touch-Enabled Desktop/Tablet)

| Interaction | Behavior |
|---|---|
| Tap on link | Navigate to destination |
| Tap on toggle | Expand/collapse sidebar |
| Swipe left on sidebar | Collapse (if expanded) |
| Swipe right from left edge | Expand (if collapsed) |

**Edge swipe**: On touch-enabled devices, a swipe from the left edge (within 20px) expands the collapsed sidebar. This is a common pattern in tablet apps.

### 10.3 Hit Area Compliance

| Element | Actual Size | Minimum | Compliant |
|---|---|---|---|
| Bottom nav tab | ~93px × 56px | 44px × 44px | ✓ |
| Sidebar link (expanded) | 176px × 36px | 44px × 44px | ✓ (height via padding) |
| Sidebar link (collapsed) | 44px × 44px | 44px × 44px | ✓ |
| Sidebar toggle | 44px × 44px | 44px × 44px | ✓ |

---

## 11. Accessibility

### 11.1 Landmark Roles

| Element | HTML | ARIA |
|---|---|---|
| Bottom nav | `<nav>` | `aria-label="Primary navigation"` |
| Sidebar | `<nav>` | `aria-label="Sidebar navigation"` |
| Each tab/link | `<a>` | `aria-current="page"` on active |
| Sidebar toggle | `<button>` | `aria-label="Toggle sidebar"`, `aria-expanded="true/false"` |
| Offline banner | `<div>` | `role="status"`, `aria-live="polite"` |
| Loading bar | `<div>` | `role="progressbar"`, `aria-label="Loading"` |

### 11.2 Active Page Indication

- Active tab/link: `aria-current="page"`
- This is the canonical way to indicate current page — not just visual styling
- Screen readers announce "Home, current page" or similar

### 11.3 Focus Management

**On navigation**:
1. Focus moves to the new page's main content area (`<main>`)
2. If page has a heading, focus moves to `<h1>` (or first heading)
3. Skip link (`<a href="#main" class="sr-only">`) is the first focusable element on every page

**On sidebar toggle**:
1. Focus remains on the toggle button
2. If expanding: screen reader announces "Sidebar expanded, 4 navigation links"
3. If collapsing: screen reader announces "Sidebar collapsed"

### 11.4 Screen Reader Announcements

| Event | `aria-live` | Text |
|---|---|---|
| Page navigation | — | (handled by `aria-current="page"`) |
| Sidebar expanded | `polite` | "Sidebar expanded" |
| Sidebar collapsed | `polite` | "Sidebar collapsed" |
| Offline detected | `polite` | "Connection lost. Data saved locally." |
| Connection restored | `polite` | "Connection restored." |
| Loading started | — | (handled by `role="progressbar"`) |
| Loading complete | — | (progressbar removed) |

### 11.5 Color Independence

- Active state: teal color **+** dot indicator **+** bold label (sidebar) — never color-only
- Offline state: teal banner **+** text **+** icon — never color-only
- Loading state: animated bar **+** `role="progressbar"` — never animation-only

---

## 12. Reduced Motion

### 12.1 Behavior

| Element | Normal | Reduced Motion |
|---|---|---|
| Tab color transition | 150ms `--ease-out` | Instant |
| Tab dot appear/disappear | Instant | Instant |
| Sidebar hover background | 150ms `--ease-out` | Instant |
| Sidebar expand/collapse | 200ms `--ease-out` width | Instant width change |
| Sidebar content fade | 150ms opacity | Instant |
| Tooltip appear | 300ms delay | 300ms delay (no change — delay is not animation) |
| Loading bar animation | 1.5s infinite slide | Static bar, no animation |
| Loading bar dismiss | 150ms fade | Instant |
| Offline banner appear | Instant | Instant |
| Offline banner dismiss | 150ms fade | Instant |
| Page transition | Fade 200ms | Instant |
| Focus ring | 150ms `--ease-out` | Instant |

### 12.2 Implementation

Inherited from global `prefers-reduced-motion` in `tokens.css`. The sidebar width transition needs explicit handling:

```css
@media (prefers-reduced-motion: reduce) {
  .sidebar { transition: none !important; }
}
```

---

## 13. Token Usage

### 13.1 Navigation Token Map

**Colors**:
| Token | Where Used |
|---|---|
| `--background` | Bottom nav bg, sidebar bg |
| `--foreground` | Hover text, active sidebar label |
| `--muted-foreground` | Inactive icons, inactive labels |
| `--secondary` | Sidebar hover row background |
| `--border` | Bottom nav top border, sidebar right border, dividers |
| `--accent` / `--dd-dusk-teal` | Active icons, active labels, indicator dots, offline banner, loading bar |
| `--accent-foreground` | Offline banner text |
| `--popover` | Tooltip background |

**Typography**:
| Token | Where Used |
|---|---|
| `--font-display` (Fraunces) | App name in sidebar |
| `--font-body` (Inter) | Tab labels, sidebar links |
| `--font-mono` (IBM Plex Mono) | Version number |
| `--text-body-sm` (14px) | Sidebar link labels |
| `--text-caption` (12px) | Bottom nav labels |
| `--text-mono-sm` (12px) | Version number |
| `--weight-medium` (500) | Labels (active and inactive) |
| `--weight-semibold` (600) | Active sidebar label, app name |

**Spacing**:
| Token | Where Used |
|---|---|
| `--space-0-5` (2px) | Label → dot gap |
| `--space-1` (4px) | Icon → label gap (bottom nav), between sidebar rows |
| `--space-2` (8px) | Sidebar row horizontal padding, tooltip padding |
| `--space-3` (12px) | Icon → label gap (sidebar), sidebar horizontal padding (collapsed) |
| `--space-6` (24px) | Sidebar vertical padding, sidebar section gaps |
| `--space-8` (32px) | Sidebar version margin-top |
| `--space-10` (40px) | Offline banner height |
| `--space-14` (56px) | Bottom nav content height |

**Radius**:
| Token | Where Used |
|---|---|
| `--radius-sm` (4px) | Sidebar row hover, tooltip |
| `--radius-full` | Indicator dots |

**Shadows**:
| Token | Where Used |
|---|---|
| `--shadow-sm` | Tooltip |

**Z-Index**:
| Token | Where Used |
|---|---|
| `--z-raised` (10) | Sidebar |
| `--z-overlay` (30) | Offline banner, loading bar, bottom nav |

**Motion**:
| Token | Where Used |
|---|---|
| `--ease-out` | Tab color, sidebar hover, sidebar expand, tooltip, loading bar |
| `--duration-fast` (150ms) | Tab color, sidebar hover, focus ring, loading dismiss |
| `--duration-normal` (200ms) | Sidebar expand/collapse, page transition |

### 13.2 Color Budget

| Color | Max Uses | Actual Uses |
|---|---|---|
| Dusk Teal | 2 | Active nav item (1 pattern), offline banner (1) |
| Quiet Sage | 0 | Not used in navigation |
| Lantern Gold | 0 | Not used in navigation |
| Destructive | 0 | Not used in navigation |

Total accent uses per viewport: ≤ 2 (Dusk Teal). ✓

---

*End of Navigation specification. All values reference DESIGN.md tokens.*
