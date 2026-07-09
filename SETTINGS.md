# Daily Deen — Settings Design Specification

> Screen-level design spec for the Settings experience — calm, editorial, premium.
> All tokens reference `DESIGN.md`. No code. Pure design.

---

## 1. Information Architecture

### 1.1 Navigation Model

Settings uses a **single scrolling page** on mobile and a **sidebar + content** split on desktop. No nested sub-pages. Every section is visible on one surface — the user scrolls to find what they need, never drills into sub-screens.

```
Mobile (<1024px):              Desktop (≥1024px):
┌────────────────────┐         ┌──────────┬─────────────────────┐
│ Top Bar (48px)     │         │ Top Bar (48px)                │
│ ← Settings        │         ├──────────┼─────────────────────┤
├────────────────────┤         │          │                     │
│                    │         │ General  │  (section content)  │
│  General           │         │ Prayer   │                     │
│  ───────────────── │         │ Location │                     │
│  Prayer Calculation│         │ Notify   │                     │
│  ───────────────── │         │ Targets  │                     │
│  Location          │         │appearanc │                     │
│  ───────────────── │         │ About    │                     │
│  Notifications     │         │          │                     │
│  ───────────────── │         │ (sticky) │                     │
│  Daily Targets     │         │          │                     │
│  ───────────────── │         │          │                     │
│  Appearance        │         │          │                     │
│  ───────────────── │         │          │                     │
│  About             │         │          │                     │
│                    │         │          │                     │
├────────────────────┤         ├──────────┴─────────────────────┤
│ Bottom Nav (56px)  │         │                                │
└────────────────────┘         └────────────────────────────────┘
```

### 1.2 Section Map

| # | Section | Purpose | Complexity |
|---|---|---|---|
| 1 | **General** | Name, language, data management | Low |
| 2 | **Prayer Calculation** | Method, school, adjustors | Medium |
| 3 | **Location** | GPS, manual entry, permission | High |
| 4 | **Notifications** | Prayer reminders, quiet hours | Medium |
| 5 | **Daily Targets** | Water, exercise, walking, custom | Medium |
| 6 | **Appearance** | Theme, texture, typography size | Low |
| 7 | **About** | Version, credits, links | Low |

### 1.3 Section Order Rationale

1. **General** — first-time setup items, always relevant
2. **Prayer Calculation** — core functionality, may need adjustment
3. **Location** — required for prayer times, permission flow
4. **Notifications** — engagement, needs setup
5. **Daily Targets** — habit configuration
6. **Appearance** — personalization, lower priority
7. **About** — reference, never urgent

---

## 2. Page Layout

### 2.1 Mobile (<1024px)

**Structure**: Single column, scrollable.

**Spacing**:
| Element | Spacing | Token |
|---|---|---|
| Page padding (horizontal) | 20px | `--space-5` |
| Page padding (top) | 16px | `--space-4` |
| Page padding (bottom) | 96px | `--space-24` |
| Between sections | 48px | `--space-12` |
| Section heading → first setting | 16px | `--space-4` |

### 2.2 Desktop (≥1024px)

**Structure**: Two-column — sidebar navigation (200px) + content area (480px max).

**Sidebar**:
- Width: 200px
- Position: sticky, `top: var(--space-12)` (48px, below top bar)
- Background: transparent (no card, no border)
- Section links: Inter `--text-body` (16px), weight 400
- Active section: weight 500, color `--foreground`, left border 2px `--dd-dusk-teal`
- Inactive section: color `--muted-foreground`
- Gap between links: `--space-1` (4px)

**Content area**:
- Max width: 480px (`--content-narrow`)
- Centered in remaining space

---

## 3. Section Components

### 3.1 Section Heading

Every section begins with a heading.

| Property | Value | Token |
|---|---|---|
| Font | Fraunces | `--font-display` |
| Size | 20px | `--text-h3` |
| Weight | 600 | `--weight-semibold` |
| Color | `--foreground` | Primary text |
| Letter spacing | -0.01em | `--tracking-h3` |
| Margin bottom | 16px | `--space-4` |

**Rules**:
- No icon next to the heading — typography carries hierarchy
- No background, no border, no decorative underline
- The heading is plain text, sitting on the page background

### 3.2 Setting Row

Each setting is a row within a section.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Label text                          [Control]   │
│  Description text here                           │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Row structure**:
| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Label | Inter | 16px | 500 | `--foreground` | Body, medium |
| Description | Inter | 14px | 400 | `--muted-foreground` | Body Small, muted |
| Control | — | — | — | — | (varies) |

**Row spacing**:
| Element | Spacing | Token |
|---|---|---|
| Row padding (vertical) | 16px | `--space-4` |
| Row padding (horizontal) | 0 | — |
| Label → description | 4px | `--space-1` |
| Between rows | 1px `--border` divider | — |
| Last row → next section | 48px | `--space-12` |

**Row height**: Auto (label + description). Minimum 48px for touch target compliance.

### 3.3 Divider

Between settings within a section:
- 1px solid `--border`
- Full width of content area
- No left/right padding — the line extends edge to edge

---

## 4. Controls

### 4.1 Toggle (Switch)

Used for: on/off settings (notifications, quiet hours, paper texture).

**Appearance**:

| State | Track | Thumb | Transition |
|---|---|---|---|
| Off | `--muted` | `--muted-foreground` (16px circle) | 150ms `--ease-out` |
| On | `--dd-dusk-teal` | `--primary-foreground` (16px circle) | 150ms `--ease-out` |
| Disabled (off) | `--border` | `--border` | — |
| Disabled (on) | `--dd-dusk-teal / 0.5` | `--primary-foreground` / 0.5 | — |

**Dimensions**:
| Property | Value |
|---|---|
| Track width | 44px |
| Track height | 24px |
| Track radius | `--radius-full` (pill) |
| Thumb diameter | 16px |
| Thumb offset (off) | 4px from left edge |
| Thumb offset (on) | 4px from right edge |

**Thumb animation**: Horizontal translate 150ms `--ease-out`. No scale, no rotation.

**Touch**: Entire row is tappable (not just the switch). 44px minimum hit area.

### 4.2 Select / Dropdown

Used for: prayer calculation method, school, language, theme.

**Appearance**:

| Property | Value | Token |
|---|---|---|
| Height | 40px | `--space-10` |
| Padding | 0 12px | `0 --space-3` |
| Border | 1px `--input` | — |
| Border radius | 8px | `--radius-md` |
| Background | `--background` | — |
| Font | Inter 16px/400 | `--font-body` |
| Color | `--foreground` | — |
| Chevron | `Lucide ChevronDown` 16px | `--icon-sm` |

**Focus state**:
- Border: `--ring` (Dusk Teal), 2px
- Box-shadow: `var(--focus-ring)`
- Transition: border-color 150ms, box-shadow 150ms

**Dropdown menu**:
- Background: `--popover`
- Border: 1px `--border`
- Border radius: `--radius-md` (8px)
- Shadow: `--shadow-sm`
- Max height: 240px (scrollable)
- Option padding: `--space-3` (12px) vertical, `--space-4` (16px) horizontal
- Option font: Inter 16px/400
- Selected option: weight 500, left checkmark `Lucide Check` 16px `--dd-dusk-teal`
- Hover: `--secondary` background
- Z-index: `z-floating` (20)

### 4.3 Number Input

Used for: daily targets (water glasses, exercise minutes, step count).

**Appearance**:

| Property | Value | Token |
|---|---|---|
| Height | 40px | `--space-10` |
| Width | 80px | — |
| Padding | 0 12px | `0 --space-3` |
| Border | 1px `--input` | — |
| Border radius | 8px | `--radius-md` |
| Background | `--background` | — |
| Font | IBM Plex Mono 14px/400 | `--font-mono` |
| Color | `--foreground` | — |
| Text align | center | — |

**Stepper buttons** (optional, inline):
- `−` and `+` flanking the input
- 32px × 32px each, `--muted-foreground` text
- Same behavior as Habits `−`/`+` controls

**Validation**:
- Minimum: 1 (or 0 for optional habits)
- Maximum: 999
- Non-numeric input: blocked (numeric keyboard on mobile)
- Out-of-range: input snaps to nearest valid value on blur

### 4.4 Text Input

Used for: user name, manual location entry.

**Appearance**:

| Property | Value | Token |
|---|---|---|
| Height | 40px | `--space-10` |
| Width | 100% | — |
| Padding | 0 12px | `0 --space-3` |
| Border | 1px `--input` | — |
| Border radius | 8px | `--radius-md` |
| Background | `--background` | — |
| Font | Inter 16px/400 | `--font-body` |
| Color | `--foreground` | — |

**Placeholder**: Inter 16px, `--muted-foreground`

**Focus**: Same as Select — border + ring

**Validation**:
- Name: required, max 32 characters
- Location: required if GPS disabled, format "City, Country"
- Error message below input: Inter 12px, `--destructive`

### 4.5 Radio Group

Used for: prayer calculation method, school, theme mode.

**Appearance**:

| Element | Size | Token |
|---|---|---|
| Radio circle | 20px × 20px | `--icon-md` |
| Outer ring (unselected) | 2px `--border` | — |
| Inner dot (selected) | 8px, `--dd-dusk-teal` fill | Accent |
| Label | Inter 16px/500 | `--font-body` |
| Gap: radio → label | 8px | `--space-2` |
| Gap: between options | 12px | `--space-3` |

**Layout**: Vertical stack (not horizontal grid). Each option on its own line.

**Focus**: Ring around the 20px radio circle, 2px `--ring`, 2px offset.

**Keyboard**: Arrow keys navigate between options. Space/Enter selects.

### 4.6 Link Row

Used for: "Manage subscription", "View privacy policy", external links.

**Appearance**:
- Same as setting row, but label is `--dd-dusk-teal` (accent color)
- Right arrow: `Lucide ChevronRight` 16px, `--muted-foreground`
- On hover: label color deepens slightly (oklch lightness -5%)
- No background change on hover

---

## 5. Section Specifications

### 5.1 General

**Purpose**: Basic app configuration — name, language, data.

**Settings**:

| # | Label | Description | Control | Validation |
|---|---|---|---|---|
| 1 | Your name | Used in greetings and journal prompts | Text input | Required, max 32 chars |
| 2 | Language | Interface language | Select (English, Arabic, Urdu) | — |
| 3 | Export data | Download your journal, habits, and settings | Link row ("Export") | — |
| 4 | Clear all data | Permanently delete everything | Link row ("Clear", `--destructive` color) | Confirmation dialog |

**Hierarchy**: Name is first (most personal). Language second (affects everything). Data management last (destructive, separated by extra whitespace).

**Spacing**:
- Section heading → first setting: `--space-4` (16px)
- Between settings: 1px `--border` divider
- After last setting → next section: `--space-12` (48px)

**Clear data confirmation**:
- Modal dialog, `--shadow-lg`, `--radius-lg` (10px)
- Heading: "Clear all data?" (Fraunces 20px/600)
- Description: "This cannot be undone. Your journal entries, habits, and settings will be permanently deleted." (Inter 14px, `--muted-foreground`)
- Two buttons: "Cancel" (ghost) and "Clear everything" (`--destructive` bg)
- Focus trap: first focusable element is "Cancel"
- `Escape` closes dialog

### 5.2 Prayer Calculation

**Purpose**: Configure how prayer times are calculated.

**Settings**:

| # | Label | Description | Control | Default |
|---|---|---|---|---|
| 1 | Calculation method | Determines prayer time benchmarks | Select (8 methods) | Muslim World League |
| 2 | School of jurisprudence | Affects Asr calculation | Radio (Hanafi, Shafi'i) | Shafi'i |
| 3 | Maghrib angle | Minutes after sunset for Maghrib | Number input | 0 |
| 4 | Isha angle | Minutes after sunset for Isha | Number input | 0 |
| 5 | Adjustments | Manual minute offsets for each prayer | Inline adjustors (see below) | 0 for all |

**Inline prayer adjustors**:
A compact grid showing each prayer with `−` / `+` controls:

```
Fajr      −  ·  +    0 min
Sunrise   −  ·  +    0 min
Dhuhr     −  ·  +    0 min
Asr       −  ·  +    0 min
Maghrib   −  ·  +    0 min
Isha      −  ·  +    0 min
```

- Each row: Inter 14px/500 label left, `−`/`+` controls center, IBM Plex Mono 12px value right
- `−`/`+` step: 1 minute
- Range: -30 to +30 minutes
- Gap between prayer rows: `--space-2` (8px)

**Keyboard**: Tab through each `−`/`+` pair. Arrow keys adjust value. Home/End jump to min/max.

### 5.3 Location

**Purpose**: Set location for accurate prayer times.

**Settings**:

| # | Label | Description | Control |
|---|---|---|---|
| 1 | Current location | Your city for prayer time calculation | Text display + edit |
| 2 | Use GPS | Automatically detect your location | Toggle |
| 3 | Manual entry | Type a city name | Text input (when GPS off) |

**Location display**:
- When GPS is on: "Detecting location..." (with loading spinner) or "London, United Kingdom" (resolved)
- When GPS is off: text input with placeholder "Enter city name..."
- Font: Inter 16px/500 for resolved location, 16px/400 for input

**GPS toggle behavior**:
- Off → On: triggers permission flow (see §7)
- On → Off: reverts to manual input, clears GPS-derived location
- State persists across sessions

### 5.4 Notifications

**Purpose**: Configure prayer time reminders.

**Settings**:

| # | Label | Description | Control | Default |
|---|---|---|---|---|
| 1 | Prayer reminders | Get notified before each prayer | Toggle | On |
| 2 | Reminder offset | Minutes before prayer to notify | Select (5, 10, 15, 20, 30) | 10 min |
| 3 | Adhan sound | Play the call to prayer | Toggle | Off |
| 4 | Quiet hours | No notifications during these hours | Time range selector | 11 PM – 6 AM |
| 5 | Vibrate | Vibrate with notification | Toggle | On |

**Quiet hours control**:
- Two time pickers: "From" and "To"
- Format: 12-hour with AM/PM toggle
- Font: IBM Plex Mono 14px
- Default: 11:00 PM – 6:00 AM

**Notification permission**:
- If system notifications are disabled: show a banner below the toggle
- Banner: "Notifications are disabled. Enable them in your device settings."
- Link: "Open settings" (Dusk Teal text)
- No in-app toggle for system permission — defer to OS

### 5.5 Daily Targets

**Purpose**: Configure habit tracking goals.

**Settings**:

| # | Label | Description | Control | Default |
|---|---|---|---|---|
| 1 | Water | Glasses of water per day | Number input + stepper | 8 |
| 2 | Exercise | Minutes of physical activity | Number input + stepper | 30 |
| 3 | Walking | Daily step count | Number input + stepper | 8,000 |
| 4 | Custom habits | User-defined targets | List of habits (see below) | — |

**Custom habits list**:
Each custom habit shows as a row:
- Label: habit name (Inter 16px/500)
- Control: number input + stepper (target value)
- Delete: `Lucide Trash2` 16px icon, `--muted-foreground`, hover `--destructive`
- Add new: "+ Add custom habit" text button (same as Habits page trigger)

**Validation**:
- Minimum target: 1
- Maximum target: 999
- Custom habit name: required, max 24 characters

### 5.6 Appearance

**Purpose**: Visual personalization.

**Settings**:

| # | Label | Description | Control | Default |
|---|---|---|---|---|
| 1 | Theme | Light or dark mode | Radio (Light, Dark, System) | System |
| 2 | Paper texture | Subtle grain overlay on backgrounds | Toggle | Off |
| 3 | Text size | Base font size adjustment | Select (Small, Default, Large) | Default |

**Theme behavior**:
- "System" follows OS preference (`prefers-color-scheme`)
- "Light" forces light mode
- "Dark" forces dark mode
- Change applies instantly (no save required)

**Text size behavior**:
- "Small": base 14px (body scales down proportionally)
- "Default": base 16px (standard)
- "Large": base 18px (body scales up proportionally)
- Applied via CSS custom property override on `:root`
- All spacing tokens remain fixed — only typography scales

**Paper texture toggle**:
- Applies `.paper-texture` class to `--background` surfaces
- Opacity: 0.02 light, 0.015 dark (per DESIGN.md rules)
- Change is instant

### 5.7 About

**Purpose**: App information and credits.

**Content**:

| # | Label | Value / Control |
|---|---|---|
| 1 | Version | `1.0.0` (IBM Plex Mono 14px) |
| 2 | Build | `2026.07.08` (IBM Plex Mono 12px, `--muted-foreground`) |
| 3 | Credits | Link row → credits modal |
| 4 | Privacy policy | Link row → external URL |
| 5 | Terms of use | Link row → external URL |
| 6 | Open source licenses | Link row → licenses screen/modal |

**Credits modal**:
- Lists contributors, libraries, and inspirations
- Simple text list, no avatars, no cards
- Inter 14px, names in weight 500

**Version display**:
- Version number in IBM Plex Mono, not Inter — signals technical metadata
- No icon, no badge — plain text

---

## 6. Geolocation Permission Flow

### 6.1 Trigger

The flow starts when:
1. User toggles "Use GPS" ON in Location settings, OR
2. First-time onboarding asks for location permission

### 6.2 Flow Steps

```
┌──────────────────────────────────────────────────┐
│                                                  │
│          (MapPin icon, 48px)                     │
│                                                  │
│       Enable location access?                    │  ← Fraunces h3, 20px
│                                                  │
│   Daily Deen uses your location to calculate     │  ← Inter body, 14px, muted
│   accurate prayer times for your area.           │
│                                                  │
│   Your location is never shared or stored        │
│   on our servers.                                │
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │          Enable Location                 │   │  ← primary button
│   └──────────────────────────────────────────┘   │
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │          Enter Manually                  │   │  ← ghost button
│   └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 6.3 Permission Dialog (System)

After tapping "Enable Location":
1. App requests `navigator.geolocation.getCurrentPosition()`
2. Browser/OS shows native permission dialog (not designed by us)
3. Two outcomes:

**Granted**:
- Permission dialog closes
- App shows "Detecting location..." with subtle loading indicator
- On success: location resolved, prayer times updated
- On failure: show error state (§6.5)

**Denied**:
- Permission dialog closes
- App shows inline message below the toggle:
  - Text: "Location access denied. Enter your city manually."
  - Color: `--muted-foreground`
  - Font: Inter 14px
- Toggle snaps back to OFF position
- Manual input field appears

### 6.4 Loading State

While GPS is resolving:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Current location                                │
│                                                  │
│  Detecting location...              ◌ (spinner)  │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Text: "Detecting location..." in `--muted-foreground`
- Spinner: 16px, `--dd-dusk-teal`, rotating 1s linear (respect reduced motion)
- Duration: typically 1–5 seconds

**Reduced motion**: No spinner animation. Show static dot (16px, `--dd-dusk-teal`).

### 6.5 Error State

If GPS fails to resolve:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Current location                                │
│                                                  │
│  Couldn't detect location.            (icon)     │
│  Check your connection or enter a city manually. │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  Retry                                   │    │  ← ghost button
│  └──────────────────────────────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Error icon: `Lucide AlertCircle` 16px, `--destructive`
- Error text: Inter 14px, `--muted-foreground`
- Retry button: ghost style, Dusk Teal text

### 6.6 Reverse Geocoding

After GPS coordinates are obtained:
1. App performs reverse geocoding (coordinates → city name)
2. While resolving: "Detecting location..." with spinner
3. On success: "London, United Kingdom" displayed
4. On failure: coordinates shown in IBM Plex Mono (e.g., "51.5074° N, 0.1278° W"), manual city input available

---

## 7. Onboarding Completion Flow

### 7.1 Context

Onboarding is a separate flow that runs before the Dashboard. Settings can be revisited to adjust onboarding choices. The onboarding completion flow is the final step of onboarding.

### 7.2 Completion Screen

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│          (Checkmark icon, 48px, Quiet Sage)      │
│                                                  │
│       You're all set.                            │  ← Fraunces h2, 24px
│                                                  │
│   Daily Deen is ready to help you build          │  ← Inter body, 16px
│   consistent spiritual habits.                   │
│                                                  │
│   ─── 32px gap ───                               │
│                                                  │
│   Prayer times: London, Muslim World League      │  ← summary items
│   Notifications: On, 10 min before              │
│   Daily targets: 8 cups, 30 min, 8,000 steps   │
│                                                  │
│   ─── 48px gap ───                               │
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │          Start your day                  │   │  ← primary button
│   └──────────────────────────────────────────┘   │
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │          Adjust settings                 │   │  ← ghost button
│   └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 7.3 Summary Items

Three lines summarizing the user's onboarding choices:

| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Label (e.g., "Prayer times:") | Inter | 14px | 500 | `--foreground` | Body Small, medium |
| Value (e.g., "London, Muslim World League") | Inter | 14px | 400 | `--muted-foreground` | Body Small, muted |

**Layout**: Each item is a single line. Label and value separated by a soft space (no colon in the value — the label includes the colon).

**Spacing**: `--space-2` (8px) between items.

### 7.4 Actions

- "Start your day" → navigates to Dashboard
- "Adjust settings" → navigates to Settings (full scroll to top)

### 7.5 Keyboard

- `Tab` cycles: summary items → "Start your day" → "Adjust settings"
- `Enter`/`Space` activates focused button
- No `Escape` action (this is a terminal screen)

### 7.6 Accessibility

- Heading: `<h1>` (this is the page heading)
- Summary: `<dl>` (definition list) with `<dt>` for labels, `<dd>` for values
- Buttons: standard `<button>` elements
- Focus order: logical top-to-bottom

---

## 8. Keyboard Interactions

### 8.1 Global

| Key | Behavior |
|---|---|
| `Tab` | Move forward through focusable elements |
| `Shift+Tab` | Move backward |
| `Escape` | Close any open dropdown/modal, return focus to trigger |

### 8.2 Section Navigation (Desktop Sidebar)

| Key | Behavior |
|---|---|
| `Arrow Up/Down` | Navigate between section links |
| `Enter` | Jump to section (scroll into view) |
| `Home` | Jump to first section |
| `End` | Jump to last section |

### 8.3 Controls

| Control | Key | Behavior |
|---|---|---|
| Toggle | `Space` / `Enter` | Toggle on/off |
| Select | `Space` / `Enter` | Open dropdown |
| Select (open) | `Arrow Up/Down` | Navigate options |
| Select (open) | `Enter` | Select option |
| Select (open) | `Escape` | Close without selecting |
| Radio group | `Arrow Up/Down` | Navigate options |
| Radio group | `Space` / `Enter` | Select option |
| Number input | `Arrow Up` | Increment |
| Number input | `Arrow Down` | Decrement |
| Number input | `Home` | Jump to minimum |
| Number input | `End` | Jump to maximum |
| Text input | `Escape` | Clear input, blur |

### 8.4 Focus Management

**Focus ring**: `2px solid var(--ring)` with `2px` offset — Dusk Teal.

**Focus order** (mobile):
1. Skip to content link
2. Back button
3. Section headings (not focusable — decorative)
4. Setting rows (each control is focusable)
5. Bottom nav

**Focus order** (desktop):
1. Skip to content link
2. Sidebar section links
3. Content area controls
4. (No bottom nav)

---

## 9. Touch Interactions

### 9.1 Hit Areas

| Element | Minimum Size | Notes |
|---|---|---|
| Toggle switch | 44px × 44px (whole row) | Row is tappable, not just switch |
| Select dropdown | 44px height | Native select or custom dropdown |
| Number input stepper | 32px × 32px buttons | With 44px total row height |
| Text input | 44px height | Standard input |
| Radio option | 44px height | Entire row is tappable |
| Link row | 44px height | Full width |

### 9.2 Tap Feedback

- Toggles: thumb slides with no background flash (smooth, not bouncy)
- Select: native OS picker on mobile (not custom dropdown)
- Link rows: `--secondary` flash on tap (150ms)
- No haptic feedback

### 9.3 Scroll Behavior

- Smooth scroll to section on sidebar link tap (desktop)
- No scroll snap
- Momentum scrolling on iOS ( `-webkit-overflow-scrolling: touch`)

---

## 10. Accessibility

### 10.1 Landmark Roles

| Element | HTML | ARIA |
|---|---|---|
| Skip link | `<a href="#settings">` | `class="sr-only"` |
| Top bar | `<header>` | — |
| Main content | `<main id="settings">` | — |
| Sidebar nav (desktop) | `<nav>` | `aria-label="Settings sections"` |
| Each section | `<section>` | `aria-labelledby="[heading-id]"` |
| Bottom nav | `<nav>` | `aria-label="Main navigation"` |

### 10.2 Form Labels

Every control must have a visible label. No placeholder-only inputs.

- Text inputs: `<label>` associated via `for`/`id`
- Toggles: label is the row label text
- Selects: label is the row label text
- Radio groups: `role="radiogroup"` with `aria-label`
- Number inputs: label includes the unit (e.g., "Water target (glasses)")

### 10.3 Error Handling

- Errors announced via `role="alert"` (assertive)
- Error message associated with input via `aria-describedby`
- Focus moves to errored input on validation failure
- Error cleared when user begins correcting

### 10.4 Screen Reader Announcements

| Event | `aria-live` | Text |
|---|---|---|
| Toggle changed | `polite` | "[Label] [on/off]" |
| Select changed | `polite` | "[Label] set to [value]" |
| Number changed | `polite` | "[Label]: [value] [unit]" |
| Theme changed | `polite` | "Theme set to [light/dark/system]" |
| Location resolving | `polite` | "Detecting location..." |
| Location resolved | `polite` | "Location set to [city]" |
| Location failed | `assertive` | "Couldn't detect location. Enter a city manually." |
| Save confirmed | `polite` | "Settings saved" |

### 10.5 Color Independence

- Toggle state: position (left/right) **+** color **+** label text — never color-only
- Theme preview: text label ("Light" / "Dark" / "System") **+** radio selection — never color-only
- Error states: color **+** icon **+** text — never color-only
- Active sidebar section: border **+** weight **+** color — never color-only

---

## 11. Reduced Motion

### 11.1 Behavior

| Element | Normal | Reduced Motion |
|---|---|---|
| Toggle thumb | Translate 150ms `--ease-out` | Instant jump |
| Dropdown open | Fade 150ms | Instant appear |
| Error message | Fade in 150ms | Instant appear |
| Section scroll (desktop) | Smooth scroll | Instant jump |
| GPS spinner | Rotate 1s linear | Static dot |
| Theme change | Instant (no transition) | Instant |
| Paper texture toggle | Instant (no transition) | Instant |

### 11.2 Implementation

Inherited from global `prefers-reduced-motion` in `tokens.css`. Section scroll uses `scroll-behavior: auto` when reduced motion is active.

---

## 12. Responsive Behavior

### 12.1 Mobile (<640px)

| Property | Value | Token |
|---|---|---|
| Page padding | 20px | `--space-5` |
| Max width | 100% | — |
| Layout | Single column, scrollable | — |
| Bottom nav | Visible, 56px | `--space-14` |
| Select control | Native OS picker | — |

### 12.2 Tablet (640–1023px)

| Property | Value | Token |
|---|---|---|
| Page padding | 24px | `--space-6` |
| Max width | 480px (content), centered | `--content-narrow` |
| Layout | Single column, centered | — |
| Bottom nav | Visible, 56px | `--space-14` |
| Select control | Custom dropdown | — |

### 12.3 Desktop (≥1024px)

| Property | Value | Token |
|---|---|---|
| Page padding | 32–64px | `--space-8` to `--space-16` |
| Sidebar | 200px, sticky | — |
| Content max width | 480px | `--content-narrow` |
| Layout | Two-column (sidebar + content) | — |
| Bottom nav | Hidden | — |
| Select control | Custom dropdown | — |

### 12.4 Responsive Control Adaptations

| Control | Mobile | Tablet | Desktop |
|---|---|---|---|
| Select | Native OS picker (bottom sheet) | Custom dropdown | Custom dropdown |
| Time picker | Native time input | Custom inline | Custom inline |
| Radio group | Vertical stack | Vertical stack | Vertical stack |
| Number input | Numeric keyboard | Standard keyboard | Standard keyboard |

---

## 13. Token Usage

### 13.1 Complete Token Map

**Backgrounds & Surfaces**:
| Token | Where Used |
|---|---|
| `--background` | Page background, input backgrounds |
| `--popover` | Dropdown menu background |
| `--muted` | Toggle track (off), skeleton fill |
| `--secondary` | Tap/link hover flash |
| `--primary` | Primary button background |

**Text & Foreground**:
| Token | Where Used |
|---|---|
| `--foreground` | Labels, headings, active text |
| `--muted-foreground` | Descriptions, placeholders, disabled text |
| `--primary-foreground` | Text on primary buttons |
| `--accent-foreground` | (Not used) |
| `--destructive` | Clear data link, error text |
| `--popover-foreground` | Dropdown text |

**Accent & Status**:
| Token | Where Used |
|---|---|
| `--accent` (Dusk Teal) | Active sidebar, radio dot, focus rings, toggle on |
| `--ring` | Focus rings (`--focus-ring` composite) |
| `--success` / `--dd-quiet-sage` | Onboarding checkmark |
| `--destructive` | Clear data, error states |

**Borders**:
| Token | Where Used |
|---|---|
| `--border` | Setting row dividers, radio outer ring |
| `--input` | Input/select borders |

**Typography**:
| Token | Where Used |
|---|---|
| `--font-display` (Fraunces) | Section headings, onboarding heading |
| `--font-body` (Inter) | All labels, descriptions, controls |
| `--font-mono` (IBM Plex Mono) | Version number, prayer times, step values |
| `--text-h3` (20px) | Section headings |
| `--text-h2` (24px) | Onboarding completion heading |
| `--text-body` (16px) | Setting labels, button text |
| `--text-body-sm` (14px) | Descriptions, summary items |
| `--text-caption` (12px) | Error messages, build number |
| `--text-mono` (14px) | Version number, number inputs |
| `--text-mono-sm` (12px) | Prayer adjustor values |
| `--weight-regular` (400) | Body copy, descriptions |
| `--weight-medium` (500) | Labels, active states |
| `--weight-semibold` (600) | Headings |

**Spacing**:
| Token | Where Used |
|---|---|
| `--space-1` (4px) | Label → description gap |
| `--space-2` (8px) | Radio → label gap, adjustor rows |
| `--space-3` (12px) | Radio option gap, button gap |
| `--space-4` (16px) | Row padding, heading → content |
| `--space-5` (20px) | Mobile page padding |
| `--space-6` (24px) | Tablet page padding |
| `--space-8` (32px) | Summary → buttons gap |
| `--space-10` (40px) | Input/select height |
| `--space-12` (48px) | Section gap, sidebar top offset |
| `--space-14` (56px) | Bottom nav height |
| `--space-24` (96px) | Mobile bottom padding |

**Radius**:
| Token | Where Used |
|---|---|
| `--radius-md` (8px) | Inputs, selects, modals |
| `--radius-lg` (10px) | Confirmation modal |
| `--radius-full` | Toggle tracks, toggle thumbs |

**Shadows**:
| Token | Where Used |
|---|---|
| `--shadow-sm` | Dropdown menus, tooltips |
| `--shadow-lg` | Confirmation modal |

**Motion**:
| Token | Where Used |
|---|---|
| `--ease-out` | Toggle slide, dropdown enter, error fade |
| `--ease-in-out` | (Not used — no exiting panels) |
| `--duration-fast` (150ms) | Toggle, hover, focus |
| `--duration-normal` (200ms) | Dropdown enter |

**Z-Index**:
| Token | Where Used |
|---|---|
| `--z-floating` (20) | Dropdown menus |
| `--z-overlay` (30) | Modal backdrop |
| `--z-modal` (40) | Confirmation modal |

### 13.2 Color Budget

| Color | Max Uses | Actual Uses |
|---|---|---|
| Dusk Teal | 2 | Active sidebar (1), toggle on (1) |
| Quiet Sage | 1 | Onboarding checkmark (1) |
| Lantern Gold | 0 | Not used in Settings |
| Destructive | 2 | Clear data link (1), errors (1 pattern) |

Total accent uses per viewport: ≤ 2 (Dusk Teal). ✓

---

*End of Settings specification. All values reference DESIGN.md tokens.*
