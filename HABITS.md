# Daily Deen — Habits Design Specification

> Screen-level design spec for the Habits experience — daily habit tracking with calm, reflective energy.
> All tokens reference `DESIGN.md`. No code. Pure design.

---

## 1. Information Hierarchy

### 1.1 Primary → Secondary → Tertiary

| Level | Element | Visual Weight | Rationale |
|---|---|---|---|
| **Primary** | Today's habit cards | Highest — full width, generous padding, clear progress | The user opens this screen to log habits. The cards are the action surface. |
| **Secondary** | Date selector / streak context | Medium — horizontal strip, muted, above cards | Provides temporal orientation without competing with the cards. |
| **Tertiary** | "Add Habit" trigger | Low — text button, below cards, quiet | Available when needed, never shouted. |

### 1.2 Design Posture

This is not a dashboard. There are no charts, no analytics panels, no colorful progress rings, no gamification badges. The screen answers one question: *What did I do today?*

**Visual language**:
- Thin horizontal lines as dividers, not card borders
- Monochrome progress bars (single muted tone, not rainbow)
- Typography carries hierarchy — weight and size, not color
- One accent color per viewport (Dusk Teal for active states)
- Whitespace is the primary separator between sections

**Inspiration references**:
- Apple Health: clean rows, minimal chrome, monochrome progress
- Notion Calendar: restrained date controls, dense but breathable
- Raycast: tight vertical rhythm, high information density, no decoration
- Japanese editorial: asymmetric balance, text-as-structure

### 1.3 Screen Flow (Mobile)

```
┌──────────────────────────────┐
│  Top Bar (48px)              │
│  ← Habits     Wed, 5 Ramadan│
├──────────────────────────────┤
│                              │
│  ◀  S  M  T  W  T  F  S  ▶  │  ← week strip
│           ·                  │  ← today dot
│                              │
│  ─── 1px line ──────────────│
│                              │
│  Water                       │  ← habit row
│  ████████░░░░░░  4 / 8 cups │
│  −  ···················  +  │  ← quick log
│                              │
│  ─── 1px line ──────────────│
│                              │
│  Exercise                    │
│  ██████░░░░░░░░  15 / 30 min│
│  −  ···················  +  │
│                              │
│  ─── 1px line ──────────────│
│                              │
│  Walking                     │
│  ██████████████  6,200 /     │
│               8,000 steps   │
│  −  ···················  +  │
│                              │
│  ─── 1px line ──────────────│
│                              │
│  Read Qur'an                │
│  ░░░░░░░░░░░░░░  0 / 10 min│
│  −  ···················  +  │
│                              │
│  ─── 1px line ──────────────│
│                              │
│         + Add habit          │  ← text button, muted
│                              │
├──────────────────────────────┤
│  Bottom Nav (56px)           │
└──────────────────────────────┘
```

---

## 2. Habit Card Anatomy

### 2.1 Card Structure

Each habit is a row, not a card. No borders, no backgrounds, no shadows. Separation is achieved through hairline dividers and whitespace.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Title                               4 / 8 cups │  ← title left, progress right
│                                                  │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← progress bar
│                                                  │
│  −         ···································  + │  ← quick log controls
│                                                  │
└──────────────────────────────────────────────────┘
```

### 2.2 Title

| Property | Value | Token |
|---|---|---|
| Font | Inter | `--font-body` |
| Size | 16px | `--text-body` |
| Weight | 500 | `--weight-medium` |
| Color | `--foreground` | Primary text |
| Letter spacing | 0 | `--tracking-body` |

- Left-aligned
- Single line, no wrapping (truncate at 24 characters with ellipsis if exceeded)

### 2.3 Unit / Progress Label

| Property | Value | Token |
|---|---|---|
| Font | IBM Plex Mono | `--font-mono` |
| Size | 12px | `--text-mono-sm` |
| Weight | 400 | `--weight-regular` |
| Color | `--muted-foreground` | Muted text |
| Letter spacing | 0.02em | `--tracking-wide` |

- Right-aligned on same line as title
- Format: `[current] / [target] [unit]` (e.g. "4 / 8 cups", "15 / 30 min", "6,200 / 8,000 steps")
- When goal is met: color changes to `--dd-quiet-sage` (success)

### 2.4 Today's Progress

The progress bar is the visual heart of each habit row.

**Bar specification**:

| Property | Value | Token |
|---|---|---|
| Height | 4px | `--space-1` |
| Background | `--muted` | Muted surface |
| Fill (in progress) | `--muted-foreground` | Muted text (monochrome) |
| Fill (goal met) | `--dd-quiet-sage` | Success green |
| Border radius | `--radius-full` | Pill shape |
| Width | 100% of row | — |

**Rules**:
- The bar is always visible, even at 0% (empty bar shows the track)
- Fill animates on value change: `width 200ms --ease-out`
- No gradient, no glow, no color variation — single flat fill
- The bar is thin (4px) — it communicates progress without dominating

### 2.5 Target

The target is shown as part of the progress label (right-aligned, same line as title). It is not a separate element.

**Target formats**:

| Habit Type | Format | Example |
|---|---|---|
| Count-based | `N / N [unit]` | `4 / 8 cups` |
| Duration-based | `N / N min` | `15 / 30 min` |
| Distance-based | `N,NNN / N,NNN steps` | `6,200 / 8,000 steps` |
| Binary (yes/no) | `Done` or `Not yet` | — |

### 2.6 Quick Log Controls

Minimal increment/decrement controls for rapid logging.

**Layout**:
```
  −   ·············································   +
```

**Elements**:

| Element | Size | Font | Color | Token |
|---|---|---|---|---|
| `−` button | 44px × 44px | IBM Plex Mono 16px | `--muted-foreground` | Muted |
| `+` button | 44px × 44px | IBM Plex Mono 16px | `--muted-foreground` | Muted |
| Visual size (icon within) | 32px × 32px | — | — | Padding fills hit area |

**Spacing**:
- `−` left-aligned, `+` right-aligned
- Gap between label row and controls: `--space-2` (8px)
- Dot leader between buttons: `·` characters filling the gap, color `--border`, font `--font-mono` 12px

**Interaction states**:

| State | Button Color | Background | Transition |
|---|---|---|---|
| Default | `--muted-foreground` | none | — |
| Hover (desktop) | `--foreground` | none | 150ms `--ease-out` |
| Active (tap) | `--foreground` | `--secondary` (flash) | 0ms (instant) |
| Disabled (at min) | `--border` | none | — |
| Disabled (at max) | `--border` | none | — |
| Focus | `--foreground` | none | ring visible |

**Keyboard**: `−` and `+` are focusable. `Enter` / `Space` to activate. `Tab` moves between controls.

### 2.7 Completion Indicator

When a habit's goal is met for the day:

- Progress bar fill changes from `--muted-foreground` to `--dd-quiet-sage`
- Progress label changes from `--muted-foreground` to `--dd-quiet-sage`
- A small checkmark appears: `Lucide Check` at `--icon-sm` (16px), color `--dd-quiet-sage`
- Position: between title and progress label (same line)
- No confetti, no celebration animation — the color change and checkmark are sufficient

**Binary habits** (yes/no):
- Toggle is a simple row tap or checkbox
- Unchecked: empty circle (16px, `--border` stroke)
- Checked: filled circle with checkmark (`--dd-quiet-sage` fill, white checkmark)

---

## 3. Progress Visualization

### 3.1 Hydration

**Habit type**: Count-based

**Unit**: glasses (or ml if user prefers)

**Default target**: 8 glasses

**Visual**:
- Progress bar: monochrome fill (`--muted-foreground`)
- Label: `4 / 8 glasses`
- Quick log: `+1 glass` per tap on `+`

**Special behavior**:
- No special visualization — consistent with all other habits
- The bar fills from left to right as glasses are logged
- Goal met at 8/8: bar turns `--dd-quiet-sage`, checkmark appears

### 3.2 Exercise

**Habit type**: Duration-based

**Unit**: minutes

**Default target**: 30 minutes

**Visual**:
- Progress bar: monochrome fill
- Label: `15 / 30 min`
- Quick log: `+5 min` per tap on `+` (increment by 5, not 1)

**Increment rules**:
- Default step: 5 minutes
- Long-press on `+`: accelerates to 10-minute increments after 500ms hold
- `−` step: 5 minutes (same)

### 3.3 Walking

**Habit type**: Count-based (large numbers)

**Unit**: steps

**Default target**: 8,000 steps

**Visual**:
- Progress bar: monochrome fill
- Label: `6,200 / 8,000 steps`
- Quick log: `+500 steps` per tap on `+`

**Number formatting**:
- Use comma separator for thousands: `6,200` not `6200`
- Font: IBM Plex Mono (tabular alignment)

**Increment rules**:
- Default step: 500 steps
- Long-press: accelerates to 1,000-step increments after 500ms hold

### 3.4 Custom Habits

**Habit type**: User-defined (count, duration, or binary)

**Default target**: User sets during creation

**Visual**:
- Same row structure as built-in habits
- User provides: name, unit, target, increment step
- Progress bar: monochrome fill
- Label: `[current] / [target] [unit]`

**Custom habit defaults**:

| Property | Default | User can change |
|---|---|---|
| Name | (required) | Yes |
| Unit | "times" | Yes |
| Target | 1 | Yes |
| Increment | 1 | Yes |
| Type | count | Yes (count / duration / binary) |

---

## 4. "Add Habit" Flow

### 4.1 Trigger

**Element**: Text button below the habit list

**Appearance**:
- Text: "+ Add habit"
- Font: Inter `--text-body` (16px), weight 500
- Color: `--muted-foreground`
- No background, no border, no icon
- Letter spacing: `0.02em`
- Padding: `--space-4` (16px) vertical, `--space-5` (20px) horizontal

**Hover (desktop)**:
- Color: `--foreground`
- Transition: color 150ms `--ease-out`

**Focus**:
- Ring: `2px solid var(--ring)` with 2px offset

**Position**: Centered below last habit row, `--space-6` (24px) gap from last divider

### 4.2 Form Layout

The add-habit form appears inline (below the trigger button), not in a modal or sheet. It expands in place, pushing the trigger button down.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Habit name                                      │
│  ┌──────────────────────────────────────────────┐│
│  │                                              ││  ← input
│  └──────────────────────────────────────────────┘│
│                                                  │
│  Type                                             │
│  ○ Count    ○ Duration    ○ Binary               │  ← radio group
│                                                  │
│  Unit                                              │
│  ┌──────────────────────────────────────────────┐│
│  │  e.g. cups, minutes, steps, pages            ││  ← input
│  └──────────────────────────────────────────────┘│
│                                                  │
│  Daily target                                     │
│  ┌──────────────────────────────────────────────┐│
│  │  8                                           ││  ← number input
│  └──────────────────────────────────────────────┘│
│                                                  │
│  Increment per tap                                │
│  ┌──────────────────────────────────────────────┐│
│  │  1                                           ││  ← number input
│  └──────────────────────────────────────────────┘│
│                                                  │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Cancel     │  │       Add Habit          │  │  ← action buttons
│  └──────────────┘  └──────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.3 Form Typography

| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Labels | Inter | 12px | 500 | `--muted-foreground` | Caption style |
| Input text | Inter | 16px | 400 | `--foreground` | Body |
| Placeholder | Inter | 16px | 400 | `--muted-foreground` | Body muted |
| Radio labels | Inter | 14px | 500 | `--foreground` | Body Small |
| Button text | Inter | 14px | 500 | — | Body Small |

### 4.4 Form Spacing

| Element | Spacing | Token |
|---|---|---|
| Form top padding | 24px | `--space-6` |
| Label → input gap | 4px | `--space-1` |
| Input → next label gap | 16px | `--space-4` |
| Radio group gap | 12px | `--space-3` |
| Input height | 40px | `--space-10` |
| Input padding | 0 12px | `0 --space-3` |
| Input border | 1px `--border` | — |
| Input radius | 8px | `--radius-md` |
| Button gap | 12px | `--space-3` |
| Cancel button | Ghost style | transparent bg |
| Add button | Primary style | `--primary` bg |

### 4.5 Validation

| Rule | Error message | Position |
|---|---|---|
| Name required | "Give your habit a name" | Below name input, `--destructive` color |
| Name max 32 chars | "Name must be 32 characters or fewer" | Below name input |
| Target required | "Set a daily target" | Below target input |
| Target > 0 | "Target must be at least 1" | Below target input |
| Unit required (if not binary) | "What unit are you tracking?" | Below unit input |
| Increment > 0 | "Increment must be at least 1" | Below increment input |

**Error typography**: Inter `--text-caption` (12px), weight 400, color `--destructive`. Letter spacing: 0.01em.

**Error animation**: Fade in (opacity 0→1, 150ms `--ease-out`). No slide, no shake.

### 4.6 Form Keyboard Interaction

- `Tab` moves through: name → type radios → unit → target → increment → cancel → add
- `Enter` on name input: moves to next field (does not submit)
- `Enter` on add button: submits form (if valid)
- `Escape`: cancels form, collapses back to trigger button
- `Space` on radio: selects type

### 4.7 Success Behavior

After successful add:
- Form collapses (opacity 0, 200ms `--ease-in-out`, then hidden)
- New habit row appears at bottom of list (fade in, 200ms `--ease-out`)
- Trigger button reappears below new row
- Focus moves to new habit's `+` button
- Screen reader: "Habit [name] added"

---

## 5. Empty State

### 5.1 When No Habits Exist

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│          (ListChecks icon, 48px)                 │
│                                                  │
│       Build your daily routine                   │  ← Fraunces h3, 20px
│                                                  │
│   Add habits to track your spiritual and         │  ← Inter body, 14px, muted
│   physical well-being each day.                  │
│                                                  │
│         + Add your first habit                   │  ← text button
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 5.2 Empty State Elements

| Element | Font | Size | Weight | Color | Token |
|---|---|---|---|---|---|
| Icon | Lucide `ListChecks` | 48px (`--icon-xl`) | — | `--muted-foreground` | Muted |
| Heading | Fraunces | 20px (`--text-h3`) | 600 | `--foreground` | Primary |
| Description | Inter | 14px (`--text-body-sm`) | 400 | `--muted-foreground` | Muted |
| CTA button | Inter | 16px (`--text-body`) | 500 | `--dd-dusk-teal` | Accent |

### 5.3 Empty State Spacing

| Element | Spacing | Token |
|---|---|---|
| Top padding | 96px | `--space-24` |
| Icon → heading | 16px | `--space-4` |
| Heading → description | 8px | `--space-2` |
| Description → CTA | 32px | `--space-8` |
| Horizontal padding | 20px | `--space-5` |
| Text alignment | Center | — |

---

## 6. Loading State

### 6.1 Skeleton Structure

When habits are loading from Dexie (IndexedDB):

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ◀  S  M  T  W  T  F  S  ▶                      │  ← week strip: all circles same color
│                                                  │
│  ─── 1px line ──────────────────────────────────│
│                                                  │
│  ████████████████          ████████████████████  │  ← skeleton row 1
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ···············································  │
│                                                  │
│  ─── 1px line ──────────────────────────────────│
│                                                  │
│  ████████████████          ████████████████████  │  ← skeleton row 2
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ···············································  │
│                                                  │
│  ─── 1px line ──────────────────────────────────│
│                                                  │
│  ████████████████          ████████████████████  │  ← skeleton row 3
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ···············································  │
│                                                  │
│  ─── 1px line ──────────────────────────────────│
│                                                  │
└──────────────────────────────────────────────────┘
```

### 6.2 Skeleton Elements

| Element | Dimensions | Background | Radius |
|---|---|---|---|
| Title line | 100px × 16px | `--muted` | `--radius-sm` (4px) |
| Progress label | 80px × 12px | `--muted` | `--radius-sm` (4px) |
| Progress bar | 100% × 4px | `--muted` | `--radius-full` |
| Control dots | 32px × 32px (circle) | `--muted` | `--radius-full` |

### 6.3 Skeleton Animation

- Pulse: `opacity 0.4 → 0.7 → 0.4`, 200ms cycle, `--ease-in-out`
- 3 skeleton rows visible
- Dividers between rows are real (1px `--border`), not skeleton

### 6.4 Reduced Motion

No pulse. Skeletons appear at `opacity: 0.5` and remain static.

---

## 7. Offline State

### 7.1 Offline Banner

Same as Journal offline banner:

- Position: below top bar, full width
- Background: `--dd-dusk-teal`
- Text color: `--accent-foreground`
- Height: `--space-10` (40px)
- Text: "Offline — habits saved locally"
- Icon: `Lucide WifiOff` at `--icon-sm` (16px)
- Z-index: `z-overlay` (30)

### 7.2 Offline Behavior

| Feature | Behavior |
|---|---|
| Habit logging | Saves to Dexie locally — no server sync |
| Add habit | Stored locally, synced when online |
| Progress values | Read from Dexie — fully available offline |
| Completion state | Stored locally |
| Sync on reconnect | Auto, no user action |

### 7.3 Unsynced Indicator

Habits logged while offline show a small dot indicator:

- Dot: 6px circle, `--dd-dusk-teal`, positioned right of progress label
- No text label — the dot is the only indicator
- Disappears after sync completes

---

## 8. Error State

### 8.1 Load Error

When habits fail to load from Dexie:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│          (AlertCircle icon, 32px)                │
│                                                  │
│       Couldn't load habits                       │  ← Fraunces h3, 20px
│                                                  │
│   Something went wrong. Tap to retry.            │  ← Inter body, 14px, muted
│                                                  │
│         Retry                                    │  ← text button, accent
│                                                  │
└──────────────────────────────────────────────────┘
```

- Icon: `Lucide AlertCircle` at `--icon-lg` (24px), color `--destructive`
- Heading: Fraunces `--text-h3` (20px), weight 600, color `--foreground`
- Description: Inter `--text-body-sm` (14px), color `--muted-foreground`
- Retry button: Inter 16px/500, color `--dd-dusk-teal`, no background
- Spacing: same as empty state (96px top padding, centered)

### 8.2 Save Error

When a habit log fails to save:

- The `+` / `−` button that was pressed flashes `--destructive` briefly (150ms)
- Progress value reverts to previous value
- Toast notification: "Couldn't save — tap to retry" at bottom of screen
- Toast: `--destructive` background, `--destructive-foreground` text, 40px height
- Auto-dismiss after 5 seconds

### 8.3 Network Error (Sync Failure)

When sync fails after reconnection:

- Offline banner reappears with text: "Sync failed — will retry"
- No user action required — exponential backoff handles retry
- Banner dismisses on successful sync

---

## 9. Keyboard Interactions

### 9.1 Global

| Key | Behavior |
|---|---|
| `Tab` | Move forward through focusable elements |
| `Shift+Tab` | Move backward |
| `Escape` | Close add-habit form (if open) |

### 9.2 Week Strip

| Key | Behavior |
|---|---|
| `Arrow Left/Right` | Navigate between days |
| `Enter` / `Space` | Select focused day |
| `Home` | Jump to first day of week (Sunday) |
| `End` | Jump to last day of week (Saturday) |

### 9.3 Habit Row

| Key | Behavior |
|---|---|
| `Tab` | Move to next habit's `−` button |
| `Enter` / `Space` | On `−`: decrement. On `+`: increment |
| `Arrow Up/Down` | Move between habit rows (when any control in row is focused) |
| `+` key (shortcut) | Increment focused habit (if not in input) |
| `-` key (shortcut) | Decrement focused habit (if not in input) |

### 9.4 Add Habit Form

| Key | Behavior |
|---|---|
| `Tab` | Move through form fields |
| `Enter` | On text inputs: move to next field. On buttons: activate |
| `Escape` | Cancel form, collapse |
| `Space` | On radio buttons: select option |

### 9.5 Focus Management

**Focus ring**: `2px solid var(--ring)` with `2px` offset — Dusk Teal.

**Focus order**:
1. Skip to content link
2. Back button (top bar)
3. Week strip (left arrow → days → right arrow)
4. Habit 1: `−` → `+`
5. Habit 2: `−` → `+`
6. ...
7. "+ Add habit" button
8. (If form open) Name → Type → Unit → Target → Increment → Cancel → Add
9. Bottom nav

---

## 10. Touch Interactions

### 10.1 Hit Areas

| Element | Minimum Size | Preferred Size |
|---|---|---|
| `−` / `+` buttons | 44px × 44px | 44px × 44px |
| Week day circles | 32px × 32px (with padding = 44px) | 44px × 44px |
| "+ Add habit" text | 44px height (full-width tap area) | 44px height |
| Habit row (for future swipe) | 44px height | — |

### 10.2 Tap Feedback

- `−` / `+` buttons: `--secondary` flash on tap (0ms transition, 150ms fade out)
- Week day: border color change on tap
- No haptic feedback (calm design language)

### 10.3 Long-Press (Increment Acceleration)

On `+` / `−` buttons:
- Tap: single increment step
- Long-press (500ms hold): double increment step
- Visual feedback: button opacity reduces to 0.8 during hold
- Release: returns to default opacity

### 10.4 Swipe (Future)

Habit rows may support swipe-to-delete in a future iteration:
- Swipe left: reveals red "Delete" background
- Swipe right: reveals green "Archive" background
- Not included in v1 — documented for future reference

---

## 11. Responsive Layouts

### 11.1 Mobile (<640px)

**Layout**: Single column, full width, 20px horizontal padding.

| Element | Mobile Value | Token |
|---|---|---|
| Page padding | 20px | `--space-5` |
| Week strip | Full width, horizontally scrollable if needed | — |
| Habit rows | Full width | — |
| Progress bar | Full width of row | — |
| `−` / `+` buttons | 32px visual, 44px hit area | — |
| "+ Add habit" | Full width, centered text | — |
| Bottom nav | Visible, 56px | `--space-14` |

**Habit row height**: Auto (title + bar + controls). Approximately 80–96px depending on content.

### 11.2 Tablet (640–1023px)

**Layout**: Single column, max 720px centered, 24px horizontal padding.

| Element | Tablet Value | Token |
|---|---|---|
| Page padding | 24px | `--space-6` |
| Week strip | Full width within 720px | — |
| Habit rows | Full width within 720px | — |
| Progress bar | Full width of row | — |
| "+ Add habit" | Full width within 720px | — |
| Bottom nav | Visible, 56px | `--space-14` |

**Hover states**: Enabled. `−` / `+` buttons respond to hover.

### 11.3 Desktop (≥1024px)

**Layout**: Single column, max 720px centered, 32–64px horizontal padding.

| Element | Desktop Value | Token |
|---|---|---|
| Page padding | 32px–64px | `--space-8` to `--space-16` |
| Week strip | Full width within 720px | — |
| Habit rows | Full width within 720px | — |
| Progress bar | Full width of row | — |
| "+ Add habit" | Full width within 720px | — |
| Bottom nav | Hidden (replaced by top bar nav) | — |

**Hover states**: Full hover/focus/active on all interactive elements. Cursor: `pointer` on buttons.

**Two-column layout (optional)**:
If ≥5 habits exist, consider a 2-column grid:
- Grid: 2 columns, `--space-4` (16px) gap
- Each habit row: `calc(50% - 8px)` width
- Only on desktop, only if ≥5 habits
- Default: single column (calm, focused)

### 11.4 Responsive Summary Table

| Property | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---|---|---|---|
| Padding | 20px | 24px | 32–64px |
| Max width | 100% | 720px | 720px |
| Columns | 1 | 1 | 1 (or 2 if ≥5 habits) |
| Bottom nav | Visible | Visible | Hidden |
| Hover states | No | Yes | Yes |
| Page padding horizontal | 20px | 24px | 32–64px |

---

## 12. Accessibility

### 12.1 Landmark Roles

| Element | HTML | ARIA |
|---|---|---|
| Skip link | `<a href="#habits">` | `class="sr-only"` (visible on focus) |
| Top bar | `<header>` | — |
| Main content | `<main id="habits">` | — |
| Week strip | `<nav>` | `aria-label="Week selector"` |
| Habit list | `<ul>` | `aria-label="Daily habits"` |
| Each habit | `<li>` | — |
| Add habit form | `<form>` | `aria-label="Add new habit"` |
| Bottom nav | `<nav>` | `aria-label="Main navigation"` |

### 12.2 Screen Reader Announcements

| Event | Element | `aria-live` | Text |
|---|---|---|---|
| Habit incremented | Habit row | `polite` | "[Habit]: [current] of [target] [unit]" |
| Habit decremented | Habit row | `polite` | "[Habit]: [current] of [target] [unit]" |
| Goal met | Habit row | `assertive` | "[Habit] goal reached for today" |
| Day changed | Week strip | `polite` | "Showing habits for [day], [date]" |
| Habit added | Habit list | `polite` | "Habit [name] added" |
| Habit deleted | Habit list | `polite` | "Habit [name] deleted" |
| Form error | Form | `assertive` | Error message text |
| Save failed | Toast | `assertive` | "Couldn't save — tap to retry" |

### 12.3 ARIA Attributes

| Element | Attribute | Value |
|---|---|---|
| Week strip | `role="tablist"` | — |
| Day circles | `role="tab"` | `aria-selected="true/false"`, `aria-label="[Day], [Date]"` |
| Habit `−` button | `aria-label="Decrement [habit]"` | — |
| Habit `+` button | `aria-label="Increment [habit]"` | — |
| Progress bar | `role="progressbar"` | `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="[target]"`, `aria-label="[habit]: [current] of [target]"` |
| Add habit trigger | `aria-expanded="false/true"` | Controls the form |
| Form fields | `aria-required="true"` | On name, target, unit (if not binary) |
| Error messages | `role="alert"` | — |

### 12.4 Color Independence

- Goal met: Quiet Sage color **+** checkmark icon **+** "goal reached" text — never color-only
- Offline: banner text **+** icon — never color-only
- Error: destructive color **+** error text **+** icon — never color-only
- Progress: bar fill **+** numeric label — never bar-only

### 12.5 Contrast Ratios

| Pair | Ratio | Standard |
|---|---|---|
| Title text on background | ≥ 4.5:1 | WCAG AA |
| Progress label on background | ≥ 4.5:1 | WCAG AA |
| Progress bar fill on track | ≥ 3:1 | WCAG AA |
| `−` / `+` on background | ≥ 3:1 | WCAG AA |
| Muted text on background | ≥ 3:1 | WCAG AA (large text) |
| Checkmark on background | ≥ 3:1 | WCAG AA |

---

## 13. Reduced Motion

### 13.1 Behavior

| Element | Normal | Reduced Motion |
|---|---|---|
| Progress bar fill | `width 200ms --ease-out` | Instant (no transition) |
| Goal met (bar color) | Color cross-fade 200ms | Instant color change |
| Checkmark appear | Opacity 0→1 150ms | Instant appear |
| `+` / `−` tap feedback | `--secondary` flash 150ms | No flash |
| Form expand/collapse | Opacity 200ms `--ease-in-out` | Instant show/hide |
| New habit appear | Fade 200ms | Instant appear |
| Skeleton pulse | Opacity 200ms cycle | Static at 0.5 opacity |
| Error toast | Slide up + fade 200ms | Instant appear |

### 13.2 Implementation

Inherited from global `prefers-reduced-motion` in `tokens.css`. No additional journal-specific rules needed.

---

## 14. Token Usage

### 14.1 Complete Token Map

Every token used in this spec, organized by category:

**Backgrounds & Surfaces**:
| Token | Where Used |
|---|---|
| `--background` | Page background |
| `--card` | (Not used — habits are rows, not cards) |
| `--muted` | Progress bar track, skeleton fill, input backgrounds |
| `--secondary` | Tap feedback flash |
| `--primary` | Add Habit button background |

**Text & Foreground**:
| Token | Where Used |
|---|---|
| `--foreground` | Habit titles, active text, headings |
| `--muted-foreground` | Progress labels, placeholders, descriptions, `−`/`+` buttons |
| `--primary-foreground` | Text on primary button (Add Habit) |
| `--accent-foreground` | Offline banner text |
| `--destructive` | Error text, save error flash |

**Accent & Status**:
| Token | Where Used |
|---|---|
| `--accent` (Dusk Teal) | Offline banner, focus rings, add habit trigger |
| `--ring` | Focus rings (`--focus-ring` composite) |
| `--success` / `--dd-quiet-sage` | Goal-met progress bar, goal-met label, checkmark |
| `--destructive` | Error states |

**Borders**:
| Token | Where Used |
|---|---|
| `--border` | Habit row dividers, input borders, week strip |
| `--input` | Form input borders |

**Typography**:
| Token | Where Used |
|---|---|
| `--font-display` (Fraunces) | Empty state heading, error heading |
| `--font-body` (Inter) | All body text, labels, buttons, inputs |
| `--font-mono` (IBM Plex Mono) | Progress labels, increment values |
| `--text-body` (16px) | Habit titles, button text |
| `--text-body-sm` (14px) | Radio labels, descriptions |
| `--text-caption` (12px) | Labels, error messages |
| `--text-mono-sm` (12px) | Progress labels |
| `--weight-regular` (400) | Body copy |
| `--weight-medium` (500) | Titles, labels, buttons |
| `--weight-semibold` (600) | Headings |

**Spacing**:
| Token | Where Used |
|---|---|
| `--space-1` (4px) | Label → input gap, progress bar height |
| `--space-2` (8px) | Heading → description gap, controls → bar gap |
| `--space-3` (12px) | Radio gap, button gap |
| `--space-4` (16px) | Input → next label gap, icon → heading gap |
| `--space-5` (20px) | Page padding (mobile) |
| `--space-6` (24px) | Section gaps, form top padding |
| `--space-8` (32px) | Description → CTA gap |
| `--space-10` (40px) | Input height, offline banner height |
| `--space-12` (48px) | Top bar height |
| `--space-14` (56px) | Bottom nav height |
| `--space-24` (96px) | Empty state top padding |

**Radius**:
| Token | Where Used |
|---|---|
| `--radius-md` (8px) | Input borders, form fields |
| `--radius-full` | Progress bar, skeleton circles, week day circles |

**Shadows**:
| Token | Where Used |
|---|---|
| `--shadow-xs` | (Not used — habits are flat rows) |

**Motion**:
| Token | Where Used |
|---|---|
| `--ease-out` | Progress bar fill, tap feedback, form animations |
| `--ease-in-out` | Form collapse |
| `--duration-fast` (150ms) | Button hover, focus ring, error flash |
| `--duration-normal` (200ms) | Progress bar, form expand/collapse |

**Z-Index**:
| Token | Where Used |
|---|---|
| `--z-overlay` (30) | Offline banner |

### 14.2 Color Budget

Maximum accent-colored uses per viewport:

| Color | Max Uses | Actual Uses |
|---|---|---|
| Dusk Teal | 2 | Offline banner (1), "+ Add habit" text (1) |
| Quiet Sage | 2 | Goal-met bar (N — counts as 1 pattern), checkmark (N — same pattern) |
| Lantern Gold | 0 | Not used in Habits (reserved for prayer/milestones) |
| Destructive | 2 | Error states (counted as 1 pattern) |

Total accent uses per viewport: ≤ 2 (Dusk Teal). ✓

---

*End of Habits specification. All values reference DESIGN.md tokens.*
