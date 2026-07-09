# Daily Deen — Onboarding Design Specification

> Three-screen onboarding flow — calm, minimal, welcoming.
> All tokens reference `DESIGN.md`. No code. Pure design.

---

## 1. Flow Overview

### 1.1 Screen Sequence

| # | Screen | Purpose | Duration |
|---|---|---|---|
| 1 | **Welcome** | Greet, set tone, explain value | 5–10 seconds |
| 2 | **Location Permission** | Request GPS for accurate prayer times | 5–15 seconds |
| 3 | **Daily Goals** | Set initial habit targets | 10–30 seconds |

### 1.2 Navigation Model

- Linear flow: 1 → 2 → 3 → Dashboard
- No skipping back from Welcome (first screen)
- Back allowed from screens 2 and 3
- Skip allowed from screens 2 and 3
- Completion screen is part of Settings spec (see `SETTINGS.md` §7) — not a fourth onboarding screen

### 1.3 Design Posture

This is not a product tour. There are no feature callouts, no carousel of screenshots, no "swipe through" tutorial. The onboarding is three calm, purposeful screens that collect the minimum information needed for the app to function. Each screen does one thing. The user is never overwhelmed.

**Visual language**:
- Centered layout, generous whitespace
- One illustration per screen (custom SVG, line art)
- One heading, one description, one action
- No cards, no panels, no chrome
- The page background *is* the surface

---

## 2. Page Layout

### 2.1 Common Structure

All three screens share the same layout skeleton:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                                                  │
│                  (illustration)                  │  ← centered, 80–120px
│                                                  │
│                  ─── 40px ───                    │
│                                                  │
│               Screen Heading                     │  ← Fraunces h2, centered
│                                                  │
│                  ─── 12px ───                    │
│                                                  │
│            Description text here                 │  ← Inter body, centered
│            spanning two lines max                │     max 48ch
│                                                  │
│                                                  │
│                  ─── 48px ───                    │
│                                                  │
│               ┌──────────────────┐               │
│               │   Primary CTA    │               │  ← full-width button
│               └──────────────────┘               │
│                                                  │
│                  ─── 12px ───                    │
│                                                  │
│               ┌──────────────────┐               │
│               │   Secondary CTA  │               │  ← ghost button / text link
│               └──────────────────┘               │
│                                                  │
│                                                  │
│                                                  │
│          ●  ○  ○          Skip →                │  ← progress + skip
│                                                  │
└──────────────────────────────────────────────────┘
```

### 2.2 Vertical Rhythm

| Element | Spacing | Token |
|---|---|---|
| Top padding | 96px (mobile), 96px (tablet+), 128px (desktop) | `--space-24`, `--space-24`, `--space-16` + `--space-8` |
| Illustration → heading | 40px | `--space-10` |
| Heading → description | 12px | `--space-3` |
| Description → CTAs | 48px | `--space-12` |
| Primary CTA → secondary CTA | 12px | `--space-3` |
| CTAs → bottom controls | Auto (pushed to bottom via flex) | — |
| Bottom padding | 48px | `--space-12` |

### 2.3 Horizontal Layout

| Breakpoint | Content Max Width | Padding |
|---|---|---|
| `<640px` (mobile) | 100% | 20px (`--space-5`) |
| `640–1023px` (tablet) | 480px (`--content-narrow`) | 24px (`--space-6`) |
| `≥1024px` (desktop) | 480px (`--content-narrow`) | 32–64px (`--space-8` to `--space-16`) |

Content is always centered horizontally. The 480px max width keeps text comfortable and illustrations prominent.

---

## 3. Illustrations

### 3.1 Style

Each screen has one custom SVG illustration. These are not photos, not 3D renders, not emoji. They are abstract geometric line art — calm, minimal, spiritual without being literal.

**Style rules**:
- Stroke-only (no fill)
- Stroke width: 1.5px (consistent with Lucide icons)
- Stroke color: `--muted-foreground` (light mode) / `--muted-foreground` (dark mode)
- No gradient, no shadow, no blur
- Size: 80px × 80px (mobile), 100px × 100px (tablet), 120px × 120px (desktop)
- Animation: fade in on screen enter (200ms `--ease-out`)

### 3.2 Screen 1 — Welcome

**Illustration concept**: Three concentric circles, slightly offset, suggesting ripples of calm. The innermost circle is complete. The middle circle is ¾ complete. The outer circle is ½ complete. This suggests expanding awareness — a spiritual unfolding.

**SVG specification**:
```
Circle 1 (inner):  cx=40, cy=40, r=12, stroke-dasharray=none (complete)
Circle 2 (middle): cx=44, cy=38, r=24, stroke-dasharray=56 19 (¾ of 75.4)
Circle 3 (outer):  cx=36, cy=44, r=36, stroke-dasharray=57 173 (½ of 226.2)
```

**Visual effect**: Three overlapping circles of increasing size, each progressively less complete. The overlap creates gentle intersections. The circles are not perfectly centered — they're offset by 4–8px, creating organic asymmetry.

### 3.3 Screen 2 — Location Permission

**Illustration concept**: A compass rose with four cardinal points, simplified to four thin lines radiating from a center dot. The north line is slightly longer. A small circle at the center suggests the needle's pivot.

**SVG specification**:
```
Center dot: cx=40, cy=40, r=2
North line: x1=40, y1=40, x2=40, y2=12 (longer)
South line: x1=40, y1=40, x2=40, y2=68
East line:  x1=40, y1=40, x2=68, y2=40
West line:  x1=40, y1=40, x2=12, y2=40
```

**Visual effect**: A minimal compass suggesting direction and location. Four clean lines from a center point. No decorative elements, no degree markers, no arrows at line ends.

### 3.4 Screen 3 — Daily Goals

**Illustration concept**: Three vertical bars of ascending height, suggesting growth and accumulation. The bars are thin (3px width), with 8px gaps between them. Heights: 24px, 40px, 56px. Bottom-aligned.

**SVG specification**:
```
Bar 1: x=26, y=32, width=3, height=24  (short)
Bar 2: x=37, y=16, width=3, height=40  (medium)
Bar 3: x=48, y=0,  width=3, height=56  (tall)
```

**Visual effect**: Three ascending bars, like a gentle bar chart. Suggests progress, growth, accumulation. No axes, no labels, no gridlines — just the ascending rhythm.

### 3.5 Illustration Animation

On screen enter, each illustration fades in:
- Opacity: 0 → 1
- Duration: 200ms
- Easing: `--ease-out`
- No translate, no scale — just opacity

**Reduced motion**: Instant appear (no fade).

---

## 4. Typography

### 4.1 Heading

| Property | Value | Token |
|---|---|---|
| Font | Fraunces | `--font-display` |
| Size | `--text-h2` (clamp 24–32px) | `--text-h2` |
| Weight | 600 | `--weight-semibold` |
| Line height | 1.2 | `--leading-h2` |
| Letter spacing | -0.015em | `--tracking-h2` |
| Color | `--foreground` | Primary text |
| Alignment | Center | — |
| Max width | 320px | — (prevents widows) |

**Screen-specific headings**:

| Screen | Heading |
|---|---|
| Welcome | "Welcome to Daily Deen" |
| Location | "Where are you?" |
| Daily Goals | "Set your daily goals" |

### 4.2 Description

| Property | Value | Token |
|---|---|---|
| Font | Inter | `--font-body` |
| Size | 16px | `--text-body` |
| Weight | 400 | `--weight-regular` |
| Line height | 1.6 | `--leading-body` |
| Letter spacing | 0 | `--tracking-body` |
| Color | `--muted-foreground` | Secondary text |
| Alignment | Center | — |
| Max width | 48ch | — (comfortable reading) |

**Screen-specific descriptions**:

| Screen | Description |
|---|---|
| Welcome | "Build consistent spiritual habits with daily prayer times, journaling, and mindful tracking." |
| Location | "We use your location to calculate accurate prayer times for your area. Your location is never shared." |
| Daily Goals | "Choose targets that feel right for you. You can always adjust these later in Settings." |

### 4.3 Rules

- Headings never exceed 8 words
- Descriptions never exceed 2 sentences
- No text smaller than 14px on any screen
- No ALL CAPS anywhere in onboarding
- No bold in descriptions — weight 400 only

---

## 5. Spacing

### 5.1 Complete Spacing Map

```
┌──────────────────────────────────────────────────┐
│                                                  │
│          96px (mobile) / 120px (tablet+)          │  ← top padding
│                                                  │
│                                                  │
│              (illustration 80–120px)              │
│                                                  │
│                    40px                          │  ← --space-10
│                                                  │
│              Screen Heading                      │
│                                                  │
│                    12px                          │  ← --space-3
│                                                  │
│              Description text                    │
│                                                  │
│                                                  │
│                    48px                          │  ← --space-12
│                                                  │
│              ┌──────────────────────┐            │
│              │    Primary CTA       │            │  ← 48px height
│              └──────────────────────┘            │
│                                                  │
│                    12px                          │  ← --space-3
│                                                  │
│              ┌──────────────────────┐            │
│              │   Secondary CTA      │            │  ← 44px height
│              └──────────────────────┘            │
│                                                  │
│                                                  │
│          ●  ○  ○              Skip →            │  ← bottom controls
│                                                  │
│                    48px                          │  ← bottom padding
│                                                  │
└──────────────────────────────────────────────────┘
```

### 5.2 Responsive Spacing Adjustments

| Element | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---|---|---|---|
| Top padding | 96px (`--space-24`) | 96px (`--space-24`) | 128px (`--space-16` + `--space-8`) |
| Illustration size | 80px | 100px | 120px |
| Illustration → heading | 40px | 40px | 40px |
| Heading → description | 12px | 12px | 12px |
| Description → CTAs | 48px | 48px | 48px |
| CTA gap | 12px | 12px | 12px |
| Bottom padding | 48px | 48px | 48px |
| Page padding | 20px | 24px | 32–64px |

---

## 6. Buttons

### 6.1 Primary CTA

The main action on each screen.

**Appearance**:

| Property | Value | Token |
|---|---|---|
| Background | `--primary` | Ink Night (light) / Parchment (dark) |
| Text color | `--primary-foreground` | Parchment (light) / Ink Night (dark) |
| Font | Inter | `--font-body` |
| Font size | 16px | `--text-body` |
| Font weight | 500 | `--weight-medium` |
| Letter spacing | 0.02em | `--tracking-wide` |
| Height | 48px | `--space-12` |
| Width | 100% | — (full width of content area) |
| Border radius | 8px | `--radius-md` |
| Border | none | — |
| Shadow | none | — |
| Cursor | pointer | — |

**Screen-specific labels**:

| Screen | Label |
|---|---|
| Welcome | "Get started" |
| Location | "Enable location" |
| Daily Goals | "Start your day" |

**Interaction states**:

| State | Background | Text | Transition |
|---|---|---|---|
| Default | `--primary` | `--primary-foreground` | — |
| Hover | `--primary` (95% opacity) | `--primary-foreground` | 150ms `--ease-out` |
| Active | `--primary` (90% opacity) | `--primary-foreground` | 0ms |
| Focus | `--primary` | `--primary-foreground` | ring visible |
| Disabled | `--muted` | `--muted-foreground` | — |
| Loading | `--primary` (80% opacity) | `--primary-foreground` | — |

**Loading state**: Button text changes to "Setting up..." with subtle opacity reduction. No spinner.

### 6.2 Secondary CTA

A quieter alternative action.

**Appearance**:

| Property | Value | Token |
|---|---|---|
| Background | transparent | — |
| Text color | `--muted-foreground` | Secondary text |
| Font | Inter | `--font-body` |
| Font size | 14px | `--text-body-sm` |
| Font weight | 500 | `--weight-medium` |
| Letter spacing | 0.02em | `--tracking-wide` |
| Height | 44px | — |
| Width | 100% | — |
| Border | none | — |
| Border radius | 8px | `--radius-md` |
| Cursor | pointer | — |

**Screen-specific labels**:

| Screen | Label |
|---|---|
| Welcome | "I already know my way" (skip to Dashboard) |
| Location | "Enter city manually" |
| Daily Goals | "Use defaults" (skip to Dashboard) |

**Interaction states**:

| State | Text Color | Background | Transition |
|---|---|---|---|
| Default | `--muted-foreground` | transparent | — |
| Hover | `--foreground` | transparent | 150ms `--ease-out` |
| Active | `--foreground` | `--secondary` (flash) | 0ms |
| Focus | `--foreground` | transparent | ring visible |

### 6.3 Skip Button

A text-only escape hatch at the bottom right.

**Appearance**:

| Property | Value | Token |
|---|---|---|
| Background | transparent | — |
| Text color | `--muted-foreground` | — |
| Font | Inter | `--font-body` |
| Font size | 14px | `--text-body-sm` |
| Font weight | 500 | `--weight-medium` |
| Label | "Skip →" | — |
| Position | Bottom right | — |
| Padding | `--space-3` (12px) vertical, `--space-4` (16px) horizontal | — |

**Visibility**: Only on screens 2 and 3. Not on Welcome (first screen — no skipping the greeting).

**Interaction**: Same as secondary CTA (hover → foreground, active → secondary flash).

---

## 7. Progress Indicator

### 7.1 Dot Progress

Positioned at the bottom left of the screen, horizontally aligned with the Skip button on the right.

**Appearance**:

```
     ●  ○  ○        ← 3 dots, first active
```

| Property | Value |
|---|---|
| Active dot | 8px × 8px circle, `--dd-dusk-teal` fill |
| Inactive dot | 8px × 8px circle, `--border` fill (or `--muted` in dark mode) |
| Gap between dots | 8px (`--space-2`) |
| Alignment | Bottom left, vertically centered with Skip button |

**Animation**: Dots do not animate on transition. The active dot simply moves to the next position. No slide, no morph — instant update.

### 7.2 Screen-to-Dot Mapping

| Screen | Active Dot |
|---|---|
| Welcome | Dot 1 (filled) |
| Location | Dot 2 (filled) |
| Daily Goals | Dot 3 (filled) |

### 7.3 Reduced Motion

No change — dots are already static (no animation on transition).

---

## 8. Screen Specifications

### 8.1 Screen 1 — Welcome

**Purpose**: Greet the user, set the tone, establish the product identity.

**Layout**:
```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│              (concentric circles)                │
│                                                  │
│                    40px                          │
│                                                  │
│          Welcome to Daily Deen                   │
│                                                  │
│                    12px                          │
│                                                  │
│     Build consistent spiritual habits with       │
│     daily prayer times, journaling, and          │
│     mindful tracking.                            │
│                                                  │
│                    48px                          │
│                                                  │
│              ┌──────────────────────┐            │
│              │     Get started      │            │
│              └──────────────────────┘            │
│                                                  │
│                    12px                          │
│                                                  │
│         I already know my way                    │
│                                                  │
│                                                  │
│          ●  ○  ○                                │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Navigation**:
- "Get started" → Screen 2 (Location)
- "I already know my way" → Dashboard (skip onboarding entirely)
- Back: none (this is the first screen)
- Keyboard: Tab to buttons, Enter/Space to activate

### 8.2 Screen 2 — Location Permission

**Purpose**: Request GPS access for accurate prayer times.

**Layout**:
```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│              (compass rose)                      │
│                                                  │
│                    40px                          │
│                                                  │
│           Where are you?                         │
│                                                  │
│                    12px                          │
│                                                  │
│     We use your location to calculate accurate   │
│     prayer times for your area. Your location    │
│     is never shared.                             │
│                                                  │
│                    48px                          │
│                                                  │
│              ┌──────────────────────┐            │
│              │   Enable location    │            │
│              └──────────────────────┘            │
│                                                  │
│                    12px                          │
│                                                  │
│           Enter city manually                    │
│                                                  │
│                                                  │
│          ●  ●  ○              Skip →            │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Navigation**:
- "Enable location" → triggers system permission dialog
  - Granted → Screen 3 (Daily Goals)
  - Denied → show inline error, stay on screen
- "Enter city manually" → navigates to Settings > Location (manual entry)
- Back → Screen 1 (Welcome)
- Skip → Dashboard (with no location set)

**Permission flow** (detailed in `SETTINGS.md` §6):
1. User taps "Enable location"
2. Browser/OS shows native permission dialog
3. If granted: location resolves, user advances to Screen 3
4. If denied: inline message appears below the button:
   - Text: "Location access denied. You can enter a city manually."
   - Color: `--muted-foreground`
   - Font: Inter 14px
   - No icon, no banner — just text

**Error state**:
- If GPS fails to resolve after permission is granted:
  - Text: "Couldn't detect your location. Check your connection or enter a city manually."
  - Button text changes to "Retry" (ghost style)
  - Stays on Screen 2

### 8.3 Screen 3 — Daily Goals

**Purpose**: Set initial habit targets.

**Layout**:
```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│              (ascending bars)                    │
│                                                  │
│                    40px                          │
│                                                  │
│          Set your daily goals                    │
│                                                  │
│                    12px                          │
│                                                  │
│     Choose targets that feel right for you.      │
│     You can always adjust these later in         │
│     Settings.                                    │
│                                                  │
│                    32px                          │
│                                                  │
│     Water          ┌──────┐                      │
│                    │  8   │ cups                 │
│                    └──────┘                      │
│                                                  │
│                    16px                          │
│                                                  │
│     Exercise       ┌──────┐                      │
│                    │  30  │ min                  │
│                    └──────┘                      │
│                                                  │
│                    16px                          │
│                                                  │
│     Walking        ┌──────┐                      │
│                    │ 8000 │ steps                │
│                    └──────┘                      │
│                                                  │
│                    48px                          │
│                                                  │
│              ┌──────────────────────┐            │
│              │    Start your day    │            │
│              └──────────────────────┘            │
│                                                  │
│                    12px                          │
│                                                  │
│              Use defaults                        │
│                                                  │
│                                                  │
│          ●  ●  ●              Skip →            │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Goal inputs**:

| Goal | Default | Unit | Min | Max | Step |
|---|---|---|---|---|---|
| Water | 8 | cups | 1 | 20 | 1 |
| Exercise | 30 | min | 5 | 180 | 5 |
| Walking | 8,000 | steps | 1,000 | 30,000 | 500 |

**Input appearance**:

| Property | Value | Token |
|---|---|---|
| Height | 44px | — |
| Width | 80px | — |
| Border | 1px `--input` | — |
| Border radius | 8px | `--radius-md` |
| Background | `--background` | — |
| Font | IBM Plex Mono | `--font-mono` |
| Font size | 16px | `--text-body` |
| Font weight | 400 | `--weight-regular` |
| Color | `--foreground` | — |
| Text align | center | — |
| Unit label | Inter 14px/400, `--muted-foreground`, right of input | — |

**Input controls**:
- `−` and `+` buttons flanking the input (optional, inline)
- 32px × 32px each, `--muted-foreground` text
- Same behavior as Habits `−`/`+` controls

**Validation**:
- Minimum/maximum enforced on blur
- Non-numeric input blocked (numeric keyboard on mobile)
- No error messages shown during onboarding — values snap to nearest valid number silently

**Navigation**:
- "Start your day" → Dashboard (saves goals)
- "Use defaults" → Dashboard (saves default values: 8 cups, 30 min, 8,000 steps)
- Back → Screen 2 (Location)
- Skip → Dashboard (saves default values)

---

## 9. Skip Behavior

### 9.1 When Skip Is Available

| Screen | Skip Available | Label |
|---|---|---|
| Welcome | No | — |
| Location | Yes | "Skip →" |
| Daily Goals | Yes | "Skip →" |

### 9.2 What Skip Does

- Navigates directly to the Dashboard
- On Location screen: no location is set (user will be prompted in Dashboard or Settings)
- On Daily Goals screen: default values are used (8 cups, 30 min, 8,000 steps)
- Onboarding completion flag is set (user won't see onboarding again)

### 9.3 Skip Confirmation

No confirmation dialog. Skip is a lightweight escape hatch — the user can always adjust settings later. Adding a confirmation would disrupt the calm flow.

### 9.4 "I already know my way" (Welcome Screen)

This is the Welcome screen's skip equivalent. It:
- Navigates directly to the Dashboard
- Sets default values for everything
- Marks onboarding as complete

---

## 10. Back Behavior

### 10.1 Back Navigation

| Screen | Back Available | Target |
|---|---|---|
| Welcome | No | — (first screen) |
| Location | Yes | Screen 1 (Welcome) |
| Daily Goals | Yes | Screen 2 (Location) |

### 10.2 Back Implementation

**Mobile**: System back button (Android) / swipe from left edge (iOS) → navigates to previous screen.

**Desktop**: Back arrow in top-left corner (same as other screens' back button).

**Back arrow appearance**:
- Icon: `Lucide ArrowLeft` at `--icon-md` (20px)
- Color: `--foreground`
- Hit area: 44px × 44px (with padding)
- Position: top-left, `--space-5` (20px) from edges

### 10.3 State Preservation

When navigating back:
- Screen 2 (Location): any entered city name is preserved
- Screen 3 (Daily Goals): any adjusted values are preserved
- No data is lost on back navigation

---

## 11. Animations

### 11.1 Screen Transitions

| Transition | Animation | Duration |
|---|---|---|
| Screen 1 → Screen 2 | Fade out current (opacity 1→0) + fade in next (opacity 0→1) | 200ms each, overlapping |
| Screen 2 → Screen 3 | Same as above | 200ms each |
| Back navigation | Same as forward | 200ms each |

**Implementation detail**:
- Outgoing screen: opacity 1→0, 200ms `--ease-in-out`
- Incoming screen: opacity 0→1, 200ms `--ease-out` (starts 100ms after out begins)
- No translate — pure fade. The calm design language avoids movement.

### 11.2 Element Animations

| Element | Animation | Duration |
|---|---|---|
| Illustration | Fade in (opacity 0→1) | 200ms `--ease-out` |
| Heading | Fade in (opacity 0→1) | 200ms `--ease-out`, 50ms delay |
| Description | Fade in (opacity 0→1) | 200ms `--ease-out`, 100ms delay |
| Primary CTA | Fade in (opacity 0→1) | 200ms `--ease-out`, 150ms delay |
| Secondary CTA | Fade in (opacity 0→1) | 200ms `--ease-out`, 200ms delay |
| Progress dots | Instant (no animation) | — |
| Skip button | Instant (no animation) | — |

**Staggered entrance**: Elements appear in sequence — illustration first, then heading, then description, then buttons. Each staggered by 50ms. Total entrance: ~350ms from screen start to all elements visible.

### 11.3 Permission Dialog

The system permission dialog (native OS) has no app-controlled animation. It appears and dismisses per OS behavior.

### 11.4 Reduced Motion

| Element | Normal | Reduced Motion |
|---|---|---|
| Screen transition | Fade 200ms | Instant (no fade) |
| Illustration | Fade 200ms | Instant |
| Heading | Fade 200ms, 50ms delay | Instant |
| Description | Fade 200ms, 100ms delay | Instant |
| CTA buttons | Fade 200ms, 150ms delay | Instant |
| Progress dots | Instant | Instant |

All stagger delays are removed. Every element appears simultaneously and instantly.

---

## 12. Responsive Layouts

### 12.1 Mobile (<640px)

**Layout**: Single column, full width, centered content.

| Property | Value |
|---|---|
| Page padding | 20px (`--space-5`) |
| Content max width | 100% |
| Illustration size | 80px × 80px |
| Top padding | 96px (`--space-24`) |
| Bottom padding | 48px (`--space-12`) |
| CTA height | 48px |
| Skip position | Bottom right |

**Special considerations**:
- Illustration is smaller to preserve vertical space
- Goal inputs on Screen 3 are stacked vertically (not side-by-side)
- Numeric keyboard appears on input focus

### 12.2 Tablet (640–1023px)

**Layout**: Centered column, max 480px.

| Property | Value |
|---|---|
| Page padding | 24px (`--space-6`) |
| Content max width | 480px (`--content-narrow`) |
| Illustration size | 100px × 100px |
| Top padding | 120px |
| Bottom padding | 48px |

**Hover states**: Enabled. CTA buttons respond to hover.

### 12.3 Desktop (≥1024px)

**Layout**: Centered column, max 480px, generous side margins.

| Property | Value |
|---|---|
| Page padding | 32–64px (`--space-8` to `--space-16`) |
| Content max width | 480px (`--content-narrow`) |
| Illustration size | 120px × 120px |
| Top padding | 140px |
| Bottom padding | 48px |

**Hover states**: Full hover/focus/active on all interactive elements. Cursor: `pointer`.

### 12.4 Responsive Summary

| Property | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---|---|---|---|
| Padding | 20px | 24px | 32–64px |
| Max width | 100% | 480px | 480px |
| Illustration | 80px | 100px | 120px |
| Top padding | 96px | 96px | 128px |
| Heading size | --text-h2 (clamp 24–32px) | --text-h2 | --text-h2 |
| CTA height | 48px | 48px | 48px |
| Back button | Hidden (use system back) | Visible (top-left) | Visible (top-left) |

---

## 13. Accessibility

### 13.1 Landmark Roles

| Element | HTML | ARIA |
|---|---|---|
| Skip link | `<a href="#content">` | `class="sr-only"` |
| Main content | `<main id="content">` | — |
| Back button | `<button>` | `aria-label="Go back"` |
| Primary CTA | `<button>` | `aria-label="[action]"` (e.g., "Get started") |
| Secondary CTA | `<button>` | — |
| Skip button | `<button>` | `aria-label="Skip onboarding"` |
| Illustration | `<svg>` | `role="img"`, `aria-label="[description]"` |
| Progress | `<nav>` | `aria-label="Onboarding progress"` |
| Progress dots | `<ol>` | `aria-label="Step [N] of 3"` |
| Goal inputs | `<input>` | `aria-label="[goal] target ([unit])"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` |

### 13.2 Focus Order

```
1. Skip link (sr-only)
2. Back button (if visible)
3. Primary CTA
4. Secondary CTA
5. Skip button (if visible)
6. Goal inputs (Screen 3 only)
7. −/+ buttons (Screen 3 only)
```

### 13.3 Screen Reader Announcements

| Event | `aria-live` | Text |
|---|---|---|
| Screen entered | `polite` | "Step [N] of 3: [heading]" |
| Permission granted | `polite` | "Location access granted" |
| Permission denied | `assertive` | "Location access denied. You can enter a city manually." |
| Goal value changed | `polite` | "[Goal]: [value] [unit]" |
| Onboarding complete | `assertive` | "Onboarding complete. Welcome to Daily Deen." |

### 13.4 Keyboard Navigation

| Key | Behavior |
|---|---|
| `Tab` | Move forward through focusable elements |
| `Shift+Tab` | Move backward |
| `Enter` / `Space` | Activate focused button |
| `Arrow Up/Down` | Adjust goal value (when input is focused) |
| `Escape` | Go back (if available) |

### 13.5 Color Independence

- Progress dots: color (teal vs border) **+** position (first, second, third) — never color-only
- Permission denied: text message **+** context — never color-only
- Active button: background color **+** text label — never color-only

### 13.6 Contrast Ratios

| Pair | Ratio | Standard |
|---|---|---|
| Heading on background | ≥ 4.5:1 | WCAG AA |
| Description on background | ≥ 4.5:1 | WCAG AA |
| CTA text on CTA background | ≥ 4.5:1 | WCAG AA |
| Secondary CTA text on background | ≥ 3:1 | WCAG AA (large text) |
| Progress dot (active) on background | ≥ 3:1 | WCAG AA |
| Illustration on background | ≥ 3:1 | WCAG AA |

---

## 14. Reduced Motion

### 14.1 Complete Behavior

| Element | Normal | Reduced Motion |
|---|---|---|
| Screen transition | Fade 200ms | Instant |
| Illustration enter | Fade 200ms | Instant |
| Heading enter | Fade 200ms, 50ms delay | Instant |
| Description enter | Fade 200ms, 100ms delay | Instant |
| CTA enter | Fade 200ms, 150ms delay | Instant |
| Secondary CTA enter | Fade 200ms, 200ms delay | Instant |
| Progress dots | Instant | Instant |
| Skip button | Instant | Instant |
| CTA hover | 150ms color | Instant |
| CTA active | 0ms | Instant |
| Button loading state | Opacity change | Instant |

### 14.2 Implementation

Inherited from global `prefers-reduced-motion` in `tokens.css`. The stagger delays are removed programmatically (not just the animations — the delays themselves).

---

## 15. Token Usage

### 15.1 Complete Token Map

**Colors**:
| Token | Where Used |
|---|---|
| `--background` | Page background |
| `--foreground` | Headings, back button, hover text |
| `--muted-foreground` | Descriptions, secondary CTAs, illustrations, skip button |
| `--primary` | Primary CTA background |
| `--primary-foreground` | Primary CTA text |
| `--secondary` | Secondary CTA active flash |
| `--border` | Inactive progress dots |
| `--input` | Goal input borders |
| `--ring` | Focus rings |
| `--accent` / `--dd-dusk-teal` | Active progress dot |
| `--muted` | Disabled CTA background |

**Typography**:
| Token | Where Used |
|---|---|
| `--font-display` (Fraunces) | Screen headings |
| `--font-body` (Inter) | Descriptions, buttons, labels |
| `--font-mono` (IBM Plex Mono) | Goal input values |
| `--text-body` (16px) | Descriptions, primary CTA text |
| `--text-body-sm` (14px) | Secondary CTA text, skip button |
| `--text-h2` (clamp 24–32px) | Headings |
| `--weight-regular` (400) | Descriptions |
| `--weight-medium` (500) | Buttons, labels |
| `--weight-semibold` (600) | Headings |
| `--tracking-wide` (0.02em) | Button text |
| `--tracking-h2` (-0.015em) | Headings |

**Spacing**:
| Token | Where Used |
|---|---|
| `--space-2` (8px) | Progress dot gap |
| `--space-3` (12px) | Heading → description, CTA gap, back padding |
| `--space-5` (20px) | Mobile page padding |
| `--space-6` (24px) | Tablet page padding |
| `--space-8` to `--space-16` | Desktop page padding |
| `--space-10` (40px) | Illustration → heading |
| `--space-12` (48px) | Description → CTAs, bottom padding, CTA height |
| `--space-24` (96px) | Mobile top padding |

**Radius**:
| Token | Where Used |
|---|---|
| `--radius-md` (8px) | CTA buttons, goal inputs |
| `--radius-full` | Progress dots |

**Motion**:
| Token | Where Used |
|---|---|
| `--ease-out` | Screen enter, element enter, hover |
| `--ease-in-out` | Screen exit |
| `--duration-fast` (150ms) | Hover states |
| `--duration-normal` (200ms) | Screen transitions, element animations |

### 15.2 Color Budget

| Color | Max Uses | Actual Uses |
|---|---|---|
| Dusk Teal | 2 | Active progress dot (1), focus rings (1 pattern) |
| Quiet Sage | 0 | Not used in onboarding |
| Lantern Gold | 0 | Not used in onboarding |
| Destructive | 0 | Not used in onboarding |

Total accent uses per viewport: ≤ 1 (Dusk Teal dot). ✓

---

*End of Onboarding specification. All values reference DESIGN.md tokens.*
