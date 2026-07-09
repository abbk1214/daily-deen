# Daily Deen — Journal Design Specification

> Screen-level design spec for the Journal experience — reflective writing with mood tracking.
> All tokens reference `DESIGN.md`. No code. Pure design.

---

## 1. Visual Hierarchy

### 1.1 Primary → Secondary → Tertiary

| Level | Element | Visual Weight | Rationale |
|---|---|---|---|
| **Primary** | Entry editor (textarea) | Highest — full width, generous height, centered | The editor is the reason this screen exists. It must dominate the viewport. |
| **Secondary** | Mood selector | Medium — horizontal strip above editor, subtle icons | Chosen before or during writing. Visible but not competing with the editor. |
| **Tertiary** | Previous entries list | Low — smaller cards, muted colors, below fold | Reference material. Accessed on scroll or via link, not the focal point. |

### 1.2 Screen Flow (Mobile)

```
┌──────────────────────────────┐
│  Top Bar (48px)              │
│  ← Journal    [Date]        │
├──────────────────────────────┤
│                              │
│  How are you feeling?        │  ← caption, muted, 12px
│  ○  ○  ○  ○  ○              │  ← mood icons, 32px
│                              │
│  ─── 32px gap ───            │
│                              │
│  ┌──────────────────────┐    │
│  │                      │    │
│  │  (textarea)          │    │  ← primary focus
│  │  Write about your    │    │
│  │  day...              │    │
│  │                      │    │
│  │                      │    │
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │  + Add tags...       │    │  ← tag input
│  └──────────────────────┘    │
│                              │
│  ─── 16px gap ───            │
│                              │
│  ┌──────────────────────┐    │
│  │      Save Entry      │    │  ← primary button
│  └──────────────────────┘    │
│                              │
│  ─── 48px gap ───            │
│                              │
│  Previous Entries            │  ← section heading
│  ┌──────────────────────┐    │
│  │ Thu, 5 Ramadan       │    │  ← entry card
│  │ Peaceful 🌙          │    │
│  │ Today I reflected... │    │
│  └──────────────────────┘    │
│  ┌──────────────────────┐    │
│  │ Wed, 4 Ramadan       │    │
│  │ Grateful ✋          │    │
│  │ Alhamdulillah for... │    │
│  └──────────────────────┘    │
│                              │
├──────────────────────────────┤
│  Bottom Nav (56px)           │
└──────────────────────────────┘
```

### 1.3 Reading Order

1. Back navigation + date (orientation)
2. Mood question + icons (emotional context)
3. Textarea (action)
4. Tags (categorization)
5. Save button (commit)
6. Previous entries (history)

---

## 2. Mood Selector

### 2.1 Moods

Five custom SVG line icons representing spiritual/emotional states. No emoji. Each icon is a single custom-drawn SVG using `currentColor` at 1.5px stroke — consistent with Lucide's stroke weight.

| Mood | Label | SVG Concept | Semantic Role |
|---|---|---|---|
| **Grateful** | Grateful | Two cupped hands, palms up (du'a gesture) — simple, abstracted, no anatomical detail | Gratitude, blessings, thankfulness |
| **Peaceful** | Peaceful | Crescent moon — clean arc, single stroke | Serenity, calm, contentment |
| **Reflective** | Reflective | Open book — two angled lines meeting at spine | Contemplation, learning, thought |
| **Hopeful** | Hopeful | Sunrise over horizon — half circle with three radiating lines | Optimism, new beginnings, aspiration |
| **Seeking** | Seeking | Compass needle — vertical line with diamond tip | Seeking guidance, direction, intention |

### 2.2 Icon Specifications

| Property | Value | Token |
|---|---|---|
| Default size | `32px × 32px` | `--icon-xl` (32px) |
| Stroke width | `1.5px` | Lucide standard |
| Stroke color (inactive) | `--muted-foreground` | Muted text |
| Stroke color (active) | `--dd-dusk-teal` | Accent |
| Stroke color (hover) | `--foreground` | Primary text |
| Fill (inactive) | `none` | — |
| Fill (active) | `none` | Stroke-only, no fill |
| Hit area | `44px × 44px` | Touch target minimum |
| Spacing between icons | `--space-6` (24px) | Horizontal gap |

### 2.3 Active State

When a mood is selected:
- Icon stroke color: `--dd-dusk-teal` (`oklch(0.46 0.06 175)`)
- Label below icon appears (if labels are shown): Inter `--text-caption` (12px), weight 500, color `--dd-dusk-teal`
- Subtle underline: 2px solid `--dd-dusk-teal`, width equal to icon hit area (44px), centered below icon, `--space-1` (4px) gap
- Transition: stroke color 150ms `--ease-out`, underline opacity 0→1 150ms `--ease-out`

### 2.4 Hover State (Desktop)

- Icon stroke color transitions to `--foreground` (primary text)
- Cursor: `pointer`
- Transition: stroke color 150ms `--ease-out`
- No scale, no shadow, no background change

### 2.5 Keyboard Focus

- Focus ring: `2px solid var(--ring)` with `2px` offset (Dusk Teal)
- Applied to the 44px × 44px hit area
- Visible only on `:focus-visible` (keyboard navigation)
- Transition: outline-offset 150ms `--ease-out`

### 2.6 Keyboard Interaction

| Key | Behavior |
|---|---|
| `Tab` | Move focus to next mood icon |
| `Shift+Tab` | Move focus to previous mood icon |
| `Enter` / `Space` | Select focused mood (toggle if already selected) |
| `Arrow Left/Right` | Navigate between mood icons when any mood is focused |
| `Escape` | Clear mood selection (set to none) |

### 2.7 Screen Reader

- Each icon: `role="radio"` within `role="radiogroup"` with `aria-label="Mood selector"`
- Each button: `aria-label="[Mood label]"`, `aria-checked="true/false"`
- Selection change announced via `aria-live="polite"`: "Mood set to [label]" or "Mood cleared"

### 2.8 Layout

```
┌──────────────────────────────────────────────┐
│  How are you feeling?                        │  ← caption, muted
│                                              │
│   [Grateful]   [Peaceful]   [Reflective]     │  ← 32px icons, 24px gap
│      ○              ○              ○          │     44px hit areas
│                                              │
│   [Hopeful]    [Seeking]                     │
│      ○              ○                        │
│                                              │
└──────────────────────────────────────────────┘
```

On mobile: icons wrap to two rows if needed (5 × 44px + 4 × 24px = 316px — fits in one row at 390px with 20px padding on each side). If viewport < 340px, wrap to second row.

---

## 3. Entry Editor

### 3.1 Textarea

**Container**:
- Background: `--card` (lighter parchment surface)
- Border: `--border`, 1px solid
- Border radius: `--radius-md` (8px)
- Shadow: `--shadow-xs` (raised elevation)

**Textarea element**:
- Background: transparent (inherits `--card`)
- Border: none (container provides border)
- Font: Inter (`--font-body`)
- Font size: `--text-body` (16px)
- Line height: `--leading-body` (1.6)
- Letter spacing: `--tracking-body` (0)
- Color: `--foreground`
- Placeholder color: `--muted-foreground`
- Padding: `--space-5` (20px) all sides
- Min height: `240px` (approximately 8 lines of text)
- Max height: `480px` (approximately 16 lines — prevents runaway growth)
- Width: 100%
- Resize: `none` (autosize handles height)
- Outline: none (focus ring on container instead)

**Focus state**:
- Container border: `--ring` (Dusk Teal), 2px solid
- Container box-shadow: `var(--focus-ring)` (2px offset, `--ring` color)
- Transition: border-color 150ms `--ease-out`, box-shadow 150ms `--ease-out`

### 3.2 Placeholder Behavior

**Text**: "Write about your day..."

**Appearance**:
- Color: `--muted-foreground`
- Font: same as textarea (Inter 16px/1.6)
- Italic: no — plain weight 400
- Disappears on first character typed (native `::placeholder` behavior)

**Empty state**: When textarea is empty and unfocused, placeholder is visible. On focus, placeholder remains until text is entered.

### 3.3 Typography

| Property | Value | Token |
|---|---|---|
| Font family | Inter | `--font-body` |
| Font size | 16px | `--text-body` |
| Font weight | 400 | `--weight-regular` |
| Line height | 1.6 | `--leading-body` |
| Letter spacing | 0 | `--tracking-body` |
| Color | `--foreground` | Primary text |

**Rules**:
- Body text is never smaller than 14px on mobile, 16px here (standard reading)
- No `text-align: justify` — left-aligned only
- Max line length: naturally limited by container width (65ch equivalent)

### 3.4 Spacing

| Element | Spacing | Token |
|---|---|---|
| Textarea padding | 20px all sides | `--space-5` |
| Gap: mood → textarea | 32px | `--space-8` |
| Gap: textarea → tags | 16px | `--space-4` |
| Gap: tags → save button | 16px | `--space-4` |
| Gap: save → previous entries | 48px | `--space-12` |

### 3.5 Maximum Width

| Breakpoint | Editor Width | Constraint |
|---|---|---|
| `<640px` (mobile) | 100% of viewport minus padding | `calc(100vw - 2 * var(--space-5))` |
| `640–1023px` (tablet) | 100% of content area, max 720px | `max-width: var(--content-reading)` (720px) |
| `≥1024px` (desktop) | 100% of main column, max 720px | `max-width: var(--content-reading)` (720px) |

The editor never exceeds 720px — the reading-width constraint ensures comfortable line lengths.

### 3.6 Autosize Rules

**Behavior**: Textarea height grows with content, up to `--max-height`.

**Parameters**:
| Property | Value | Rationale |
|---|---|---|
| Min height | 240px | ~8 lines — enough for a short entry without feeling cramped |
| Max height | 480px | ~16 lines — prevents editor from consuming entire viewport |
| Step | 1px (continuous) | Smooth resize, no jumps |
| Trigger | `input` event | Resize on every keystroke, paste, or programmatic change |

**Algorithm**:
1. On `input`, temporarily set height to `auto`
2. Read `scrollHeight`
3. Set height to `max(minHeight, min(scrollHeight, maxHeight))`
4. If `scrollHeight > maxHeight`, show vertical scroll (native overflow)

**Overflow**: When content exceeds max height, textarea scrolls vertically. Scrollbar: thin, `--muted-foreground` thumb on `--muted` track, 6px width.

---

## 4. Tags

### 4.1 Appearance

Each tag is a small pill containing text and a remove button.

**Tag pill**:
- Background: `--muted` (parchment wash)
- Border: none
- Border radius: `--radius-full` (9999px — pill shape)
- Padding: `--space-1` (4px) vertical, `--space-3` (12px) horizontal
- Font: Inter `--text-body-sm` (14px), weight 500
- Color: `--muted-foreground`
- Max width: 120px (truncate with ellipsis if exceeded)

**Remove button (×)**:
- Size: 16px × 16px
- Icon: `Lucide X` at `--icon-sm` (16px), stroke 1.5
- Color: `--muted-foreground`
- Margin left: `--space-1` (4px)
- Hit area: 24px × 24px (includes padding for touch)
- Cursor: `pointer`

### 4.2 Tag Input

**Container**:
- Background: `--card`
- Border: `--border`, 1px solid
- Border radius: `--radius-md` (8px)
- Padding: `--space-2` (8px)
- Display: flex, wrap

**Input field**:
- Background: transparent
- Border: none
- Font: Inter `--text-body-sm` (14px), weight 400
- Color: `--foreground`
- Placeholder: "Add tags..."
- Placeholder color: `--muted-foreground`
- Min width: 100px
- Flex: 1 (grows to fill remaining space)
- Outline: none

**Focus state**:
- Container border: `--ring` (Dusk Teal), 2px solid
- Container box-shadow: `var(--focus-ring)`

### 4.3 Wrapping

- Tags wrap to next line when row is full
- `flex-wrap: wrap` on container
- Gap between tags: `--space-2` (8px) horizontal, `--space-1` (4px) vertical
- Input field sits on same line as tags, moves to next line when tags fill the row

### 4.4 Spacing

| Context | Value | Token |
|---|---|---|
| Tag gap (horizontal) | 8px | `--space-2` |
| Tag gap (vertical) | 4px | `--space-1` |
| Tag internal padding | 4px × 12px | `--space-1` × `--space-3` |
| Container padding | 8px | `--space-2` |
| Max tags visible before truncation | 8 | (shows "+N more" if exceeded) |

### 4.5 Remove Interaction

**Hover (desktop)**:
- Remove button color: `--foreground` (primary text)
- Transition: color 150ms `--ease-out`

**Active (tap/click)**:
- Tag pill background: `--secondary` (slightly darker)
- Transition: background 150ms `--ease-out`

**Keyboard**:
- `Tab` to focus remove button within tag
- `Enter` or `Space` to remove tag
- Focus moves to next tag's remove button, or to input field if last tag

**Animation**:
- On remove: tag fades out (opacity 0)
- Duration: 150ms `--ease-out`
- After animation: tag removed from DOM, input field receives focus

### 4.6 Screen Reader

- Tag container: `role="group"` with `aria-label="Tags"`
- Each tag: `aria-label="[Tag text], remove"`
- Remove button: `aria-label="Remove [Tag text]"`
- On removal: `aria-live="polite"` — "[Tag text] removed"

### 4.7 Empty State

When no tags exist:
- Input field shows placeholder: "Add tags..."
- No tag pills visible
- Input is focusable and ready for typing

---

## 5. Save Button

### 5.1 Appearance

**Default state**:
- Background: `--primary` (Ink Night in light mode, Parchment in dark mode)
- Text color: `--primary-foreground` (Parchment in light mode, Ink Night in dark mode)
- Font: Inter `--text-body` (16px), weight 500
- Letter spacing: `--tracking-wide` (0.02em)
- Padding: `--space-3` (12px) vertical, `--space-6` (24px) horizontal
- Border radius: `--radius-md` (8px)
- Width: 100% (full width of editor container)
- Height: `--space-12` (48px) minimum
- Cursor: `pointer`
- Shadow: none

### 5.2 Interaction States

| State | Background | Text | Shadow | Transition |
|---|---|---|---|---|
| Default | `--primary` | `--primary-foreground` | none | — |
| Hover | `--primary` (95% opacity) | `--primary-foreground` | none | 150ms `--ease-out` |
| Active | `--primary` (90% opacity) | `--primary-foreground` | none | 0ms (instant) |
| Focus | `--primary` | `--primary-foreground` | `var(--focus-ring)` | 150ms `--ease-out` |
| Disabled | `--muted` | `--muted-foreground` | none | — |
| Saving | `--primary` (80% opacity) | `--primary-foreground` | none | — |

### 5.3 Saving State

When save is in progress:
- Button text changes to "Saving..."
- Button becomes disabled (no double-tap)
- Subtle opacity reduction (0.8)
- No spinner — the text change is sufficient feedback (consistent with calm design language)

### 5.4 Success State

After successful save:
- Button text changes to "Saved" for 2 seconds
- Text color transitions to `--dd-quiet-sage` (success green)
- Background remains `--primary`
- After 2 seconds: reverts to default state, textarea clears, mood resets

### 5.5 Error State

If save fails:
- Button text: "Save failed — tap to retry"
- Background: `--destructive`
- Text: `--destructive-foreground`
- On tap: retries save

### 5.6 Accessibility

- Element: `<button>` with `type="button"`
- `aria-label`: "Save journal entry" (default), "Saving..." (in progress), "Saved" (success)
- Focus ring: visible on keyboard focus
- Keyboard: `Enter` and `Space` activate save
- Disabled state: `aria-disabled="true"`

---

## 6. Previous Entries List

### 6.1 Section Header

**Layout**:
- Text: "Previous Entries"
- Font: Fraunces (`--font-display`), `--text-h3` (20px), weight 600
- Color: `--foreground`
- Letter spacing: `--tracking-h3` (-0.01em)
- Margin bottom: `--space-6` (24px)
- Separator: 1px `--border` line below, full width

### 6.2 Entry Card

**Container**:
- Background: `--card` (lighter parchment surface)
- Border: `--border`, 1px solid
- Border radius: `--radius-md` (8px)
- Padding: `--space-5` (20px)
- Shadow: `--shadow-xs` (raised elevation)
- Cursor: `pointer`

**Layout**:
```
┌──────────────────────────────────────────┐
│  Thu, 5 Ramadan · 1447 AH     ○ Peaceful│
│                                          │
│  Today I reflected on the meaning of     │
│  patience. Alhamdulillah for the...      │
│                                          │
│  #gratitude  #patience  #reflection     │
└──────────────────────────────────────────┘
```

**Typography**:

| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Date (Hijri) | IBM Plex Mono | `--text-body-sm` (14px) | 400 | `--foreground` | Primary |
| Date (Gregorian) | IBM Plex Mono | `--text-caption` (12px) | 400 | `--muted-foreground` | Muted |
| Mood icon | Custom SVG | 20px | — | `--dd-dusk-teal` | Accent |
| Mood label | Inter | `--text-caption` (12px) | 500 | `--dd-dusk-teal` | Accent |
| Preview text | Inter | `--text-body` (16px) | 400 | `--foreground` | Primary |
| Tag pills | Inter | `--text-caption` (12px) | 500 | `--muted-foreground` | Muted |

**Date line**:
- Display: flex, space-between (date left, mood right)
- Margin bottom: `--space-2` (8px)
- Hijri date: primary format (this is an Islamic app)
- Gregorian date: secondary, smaller, muted

**Preview text**:
- Content: first 120 characters of entry, followed by ellipsis ("...")
- Line height: `--leading-body` (1.6)
- Max lines: 3 (CSS `line-clamp: 3`)
- Color: `--foreground`
- Margin bottom: `--space-3` (12px)

**Tag row**:
- Display: flex, wrap, gap `--space-1` (4px)
- Tags shown as small pills (same style as entry editor tags, but smaller: `--text-caption` 12px, padding `--space-0-5` × `--space-2`)
- Max 3 tags visible, then "+N" indicator
- Color: `--muted-foreground`

### 6.3 Card Interaction

**Hover (desktop)**:
- Border: `--accent` (Dusk Teal), 1px solid
- Shadow: `--shadow-sm` (one level up from xs)
- Transition: border-color 150ms `--ease-out`, box-shadow 150ms `--ease-out`

**Active (tap)**:
- Background: `--secondary` (slightly darker)
- Transition: background 150ms `--ease-out`

**Keyboard focus**:
- Focus ring: `2px solid var(--ring)` with `2px` offset
- Visible on `:focus-visible` only

**Keyboard interaction**:
- `Tab` to focus card
- `Enter` / `Space` to open entry (full view / edit mode)

### 6.4 Card Spacing

| Element | Spacing | Token |
|---|---|---|
| Card padding | 20px | `--space-5` |
| Gap between cards | 12px | `--space-3` |
| Date → preview gap | 8px | `--space-2` |
| Preview → tags gap | 12px | `--space-3` |

### 6.5 Empty State

When no entries exist:

```
┌──────────────────────────────────────────┐
│                                          │
│          (book icon, 48px)               │
│                                          │
│       No entries yet                     │  ← Fraunces h3, 20px
│                                          │
│   Start writing to see your journal      │  ← Inter body, 14px, muted
│   entries here.                          │
│                                          │
└──────────────────────────────────────────┘
```

- Icon: `Lucide BookOpen` at `--icon-xl` (32px), color `--muted-foreground`
- Heading: "No entries yet" — Fraunces `--text-h3` (20px), weight 600, color `--foreground`
- Description: "Start writing to see your journal entries here." — Inter `--text-body-sm` (14px), color `--muted-foreground`
- Text alignment: center
- Padding: `--space-16` (64px) top/bottom
- No card wrapper — direct text on background

### 6.6 Loading State (Skeleton)

When entries are loading from Dexie:

- 3 skeleton cards stacked vertically
- Each card: 100% width, 120px height, `--muted` background, `--radius-md` (8px)
- Internal skeleton lines:
  - Date line: 120px × 14px, `--secondary` background
  - Preview line 1: 100% × 16px, `--secondary` background
  - Preview line 2: 80% × 16px, `--secondary` background
  - Tags: 3 pills, 60px × 20px each, `--secondary` background
- Animation: `opacity 0.4 → 0.7 → 0.4`, 200ms cycle, `--ease-in-out`
- Reduced motion: static at `opacity: 0.5`, no pulse

---

## 7. Mobile (<640px)

### 7.1 Layout

- Single column, full width
- Page padding: `--space-5` (20px) horizontal
- Content flows vertically: mood → editor → tags → save → entries

### 7.2 Specific Adjustments

| Element | Mobile Value | Token |
|---|---|---|
| Page padding | 20px | `--space-5` |
| Mood icons | 32px, single row (wraps if < 340px) | `--icon-xl` |
| Textarea min height | 200px | (reduced from 240px) |
| Textarea max height | 400px | (reduced from 480px) |
| Editor max width | 100% | — |
| Entry cards | Full width | — |
| Save button | Full width, 48px height | `--space-12` |
| Bottom nav | Visible, 56px | `--space-14` |

### 7.3 Touch Considerations

- All interactive elements: minimum 44px × 44px hit area
- Mood icons: 44px × 44px (icon is 32px, padding fills the rest)
- Tag remove buttons: 24px × 24px (with 4px padding = 32px, acceptable on mobile due to adjacent tag spacing)
- Save button: full width, 48px height — impossible to miss
- Entry cards: full width, entire card is tappable

### 7.4 Keyboard Shortcut Hint

On mobile, no keyboard shortcut hints are shown. The interface is purely touch-driven.

---

## 8. Tablet (640–1023px)

### 8.1 Layout

- Single column, max 720px centered
- Page padding: `--space-6` (24px) horizontal
- Same vertical flow as mobile

### 8.2 Specific Adjustments

| Element | Tablet Value | Token |
|---|---|---|
| Page padding | 24px | `--space-6` |
| Mood icons | 32px, single row | `--icon-xl` |
| Textarea min height | 240px | (standard) |
| Textarea max height | 480px | (standard) |
| Editor max width | 720px | `--content-reading` |
| Entry cards | 720px max | `--content-reading` |
| Save button | 720px max, 48px height | `--content-reading` |
| Bottom nav | Visible, 56px | `--space-14` |

### 8.3 Hover States

Hover states are now active:
- Mood icons: stroke color transition on hover
- Entry cards: border + shadow change on hover
- Save button: opacity change on hover

---

## 9. Desktop (≥1024px)

### 9.1 Layout

Two options depending on navigation pattern:

**Option A — Full-width editor (recommended)**:
- Main content: 720px max, centered
- Sidebar: hidden (journal is a focused, single-purpose screen)
- No split layout — the editor deserves full attention

**Option B — Split layout (alternative)**:
- Left column: Editor (720px max)
- Right column: Previous entries (320px), sticky on scroll
- Gap: `--space-8` (32px)

**Default: Option A**. The journal is a reflective, focused activity. Splitting the screen fragments attention.

### 9.2 Specific Adjustments

| Element | Desktop Value | Token |
|---|---|---|
| Page padding | 32px–64px | `--space-8` to `--space-16` |
| Mood icons | 32px, single row | `--icon-xl` |
| Textarea min height | 240px | (standard) |
| Textarea max height | 480px | (standard) |
| Editor max width | 720px | `--content-reading` |
| Entry cards | 720px max | `--content-reading` |
| Save button | 720px max, 48px height | `--content-reading` |
| Bottom nav | Hidden (replaced by top bar nav) | — |

### 9.3 Hover States

Full hover/focus/active states enabled on all interactive elements:
- Mood icons: stroke color on hover
- Entry cards: border + shadow on hover
- Save button: opacity on hover
- Tag remove buttons: color on hover
- Cursor: `pointer` on all interactive elements

### 9.4 Entry Card Grid (Optional)

If many entries exist, cards can display in a 2-column grid at ≥1024px:
- Grid: 2 columns, `--space-4` (16px) gap
- Each card: `calc(50% - 8px)` width
- Max entries visible before "Load more": 6

---

## 10. Accessibility

### 10.1 Landmark Roles

| Element | HTML | ARIA |
|---|---|---|
| Skip link | `<a href="#editor">` | `class="sr-only"` (visible on focus) |
| Top bar | `<header>` | — |
| Main content | `<main id="main">` | — |
| Mood selector | `<div>` | `role="radiogroup"`, `aria-label="Mood selector"` |
| Entry editor | `<textarea id="editor">` | `aria-label="Journal entry"`, `aria-describedby="editor-hint"` |
| Tags section | `<div>` | `role="group"`, `aria-label="Tags"` |
| Save button | `<button>` | `aria-label="Save journal entry"` |
| Previous entries | `<section>` | `aria-label="Previous entries"` |
| Bottom nav | `<nav>` | `aria-label="Main navigation"` |

### 10.2 Focus Order

```
1. Skip to editor link
2. Back button (top bar)
3. Mood icons (Grateful → Peaceful → Reflective → Hopeful → Seeking)
4. Textarea (editor)
5. Tag input field
6. Existing tag remove buttons (within tags)
7. Save button
8. Previous entry cards (if any)
9. Bottom nav tabs
```

### 10.3 Screen Reader Announcements

| Event | Element | `aria-live` | Text |
|---|---|---|---|
| Mood selected | Mood selector | `polite` | "Mood set to [label]" |
| Mood cleared | Mood selector | `polite` | "Mood cleared" |
| Tag added | Tags group | `polite` | "Tag [text] added" |
| Tag removed | Tags group | `polite` | "Tag [text] removed" |
| Save started | Save button | `polite` | "Saving entry..." |
| Save completed | Save button | `assertive` | "Entry saved" |
| Save failed | Save button | `assertive` | "Save failed. Tap to retry." |
| Character count | Editor | `polite` (debounced 5s) | "[N] characters" (optional, can omit) |

### 10.4 Keyboard Navigation

| Key | Context | Behavior |
|---|---|---|
| `Tab` | Any | Move forward through focusable elements |
| `Shift+Tab` | Any | Move backward |
| `Enter` / `Space` | Mood icon | Select mood |
| `Enter` / `Space` | Save button | Trigger save |
| `Enter` / `Space` | Entry card | Open entry |
| `Arrow Left/Right` | Mood group | Navigate between mood icons |
| `Arrow Down` | Tag input | Move to save button |
| `Escape` | Tag input | Clear input, move to textarea |
| `Backspace` | Tag input (empty) | Remove last tag |

### 10.5 Color Independence

- Mood selection: teal color **+** underline **+** label text — never color-only
- Save states: text change ("Save" → "Saving..." → "Saved") **+** color change — never color-only
- Error state: destructive color **+** error text **+** retry instruction — never color-only
- Tag removal: × icon **+** label text — never color-only

### 10.6 Contrast Ratios

| Pair | Ratio | Standard |
|---|---|---|
| Body text on `--card` | ≥ 4.5:1 | WCAG AA |
| Placeholder text on `--card` | ≥ 3:1 | WCAG AA (large text) |
| Mood icon (inactive) on `--background` | ≥ 3:1 | WCAG AA |
| Mood icon (active) on `--background` | ≥ 4.5:1 | WCAG AA |
| Tag text on `--muted` | ≥ 4.5:1 | WCAG AA |
| Save button text on `--primary` | ≥ 4.5:1 | WCAG AA |

---

## 11. Reduced Motion

### 11.1 Behavior

When `prefers-reduced-motion: reduce` is active:

| Element | Normal Behavior | Reduced Motion |
|---|---|---|
| Mood icon selection | Stroke color 150ms `--ease-out` | Instant color change |
| Mood underline | Opacity 0→1 150ms `--ease-out` | Instant appear |
| Tag removal | Fade 150ms | Instant disappear |
| Save state transitions | Color/text 150ms | Instant change |
| Entry card hover | Border/shadow 150ms | Instant change |
| Skeleton loading | Pulse animation 200ms | Static, no pulse |
| Textarea autosize | Height transition | Instant resize (no smooth) |

### 11.2 Implementation

All reduced motion behavior is inherited from the global `prefers-reduced-motion` media query in `tokens.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

No additional journal-specific reduced motion rules are needed — the global rule covers all animations and transitions.

---

## 12. Skeleton Loading

### 12.1 When Skeletons Appear

- Initial page load (before Dexie data loads)
- Search/filter operations (if implemented later)
- Pull-to-refresh on mobile

### 12.2 Skeleton Structure

```
┌──────────────────────────────────────────┐
│                                          │
│  How are you feeling?                    │  ← text: 140px × 12px
│                                          │
│  ○  ○  ○  ○  ○                          │  ← 5 circles, 32px each
│                                          │
│  ┌──────────────────────────────┐        │
│  │                              │        │  ← textarea: 100% × 240px
│  │                              │        │
│  │                              │        │
│  └──────────────────────────────┘        │
│                                          │
│  ┌──────────────────────────────┐        │
│  │  Add tags...                 │        │  ← tag input: 100% × 40px
│  └──────────────────────────────┘        │
│                                          │
│  ┌──────────────────────────────┐        │
│  │         Save Entry           │        │  ← button: 100% × 48px
│  └──────────────────────────────┘        │
│                                          │
│  Previous Entries                        │  ← heading: 140px × 20px
│                                          │
│  ┌──────────────────────────────┐        │
│  │  ████████  ·  ·  ○          │        │  ← entry card 1
│  │  ████████████████████        │        │
│  │  ██████████                  │        │
│  │  [tag] [tag] [tag]          │        │
│  └──────────────────────────────┘        │
│                                          │
│  ┌──────────────────────────────┐        │
│  │  ████████  ·  ·  ○          │        │  ← entry card 2
│  │  ████████████████████        │        │
│  │  ██████████                  │        │
│  │  [tag] [tag]                 │        │
│  └──────────────────────────────┘        │
│                                          │
└──────────────────────────────────────────┘
```

### 12.3 Skeleton Styles

| Element | Background | Radius | Animation |
|---|---|---|---|
| Text lines | `--muted` | `--radius-sm` (4px) | Pulse 200ms |
| Mood circles | `--muted` | `--radius-full` (circle) | Pulse 200ms |
| Textarea box | `--muted` | `--radius-md` (8px) | Pulse 200ms |
| Tag input box | `--muted` | `--radius-md` (8px) | Pulse 200ms |
| Button box | `--muted` | `--radius-md` (8px) | Pulse 200ms |
| Entry cards | `--muted` | `--radius-md` (8px) | Pulse 200ms |

**Pulse animation**: `opacity 0.4 → 0.7 → 0.4`, 200ms cycle, `--ease-in-out`

### 12.4 Reduced Motion Skeleton

No pulse. Skeletons appear at `opacity: 0.5` and remain static.

---

## 13. Offline State

### 13.1 Offline Banner

When device is offline:

- Position: below top bar, full width
- Background: `--dd-dusk-teal` (accent)
- Text color: `--accent-foreground` (light on teal)
- Height: `--space-10` (40px)
- Text: "Offline — entries will save locally"
- Icon: `Lucide WifiOff` at `--icon-sm` (16px), left of text
- Z-index: `z-overlay` (30)
- Dismiss: auto-dismisses when connection restores

### 13.2 Offline Behavior

| Feature | Behavior |
|---|---|
| New entries | Saved to Dexie (IndexedDB) locally — no server sync |
| Tag creation | Stored locally, synced when online |
| Mood selection | Stored locally |
| Previous entries | Read from Dexie — fully available offline |
| Save button | Functions normally (saves to local storage) |
| Success state | "Saved locally" instead of "Saved" |

### 13.3 Offline Entry Cards

Previously synced entries show normally. New (unsynced) entries show a small indicator:

- Badge: "Local" in `--text-caption` (12px), weight 500
- Color: `--dd-dusk-teal` (accent)
- Position: right of date line, before mood icon
- No card border change — the badge is the only indicator

### 13.4 Sync on Reconnection

When connection restores:
- Banner changes to "Syncing..." for 1–2 seconds
- Entries upload to server
- Banner dismisses
- "Local" badges disappear from entry cards
- No user action required

---

*End of Journal specification. All values reference DESIGN.md tokens.*
