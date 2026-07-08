# Daily Deen — Design System

> A calm, minimal, premium design system for an Islamic daily companion.
> Japanese editorial influence. Paper texture. Quiet luxury. No clichés.

---

## 1. Design Philosophy

### Core Principles

| Principle | Meaning |
|---|---|
| **Calm** | Every element earns its presence. No visual noise, no competing focal points. |
| **Minimal** | Maximum whitespace, minimum decoration. Typography carries the hierarchy. |
| **Premium** | Quiet luxury — refined materials, precise spacing, restrained color. |
| **Islamic without clichés** | Spiritual depth through atmosphere and ritual rhythm, not arabesque patterns or mosque silhouettes. |
| **Japanese editorial** | Tight vertical rhythm, generous horizontal whitespace, asymmetric balance, text-as-image. |
| **Paper texture** | Subtle grain overlays evoke tactile warmth — the digital equivalent of fine stationery. |

### Anti-patterns (never do these)

- ❌ Dashboard-card aesthetic (rounded cards with colored left borders)
- ❌ Gradient backgrounds (purple→blue, any two-stop trust gradients)
- ❌ Emoji as icons (use Lucide SVG at 1.5px stroke)
- ❌ Generic hero sections with centered text + CTA button
- ❌ Warm beige/peach/pink/orange-brown page washes
- ❌ Decorative blob/wave SVG backgrounds
- ❌ Glassmorphism (except where functionally justified, like a backdrop-filter nav)
- ❌ More than 2 accent-color uses per viewport
- ❌ Indigo (#6366f1) as primary — use Ink Night/Parchment for default actions, Dusk Teal for links

---

## 2. Color System

All colors are specified in OKLCh for perceptual uniformity. Hex equivalents are provided for reference.

### 2.1 Brand Palette

| Name | Hex | OKLCh | Role |
|---|---|---|---|
| **Ink Night** | `#1B2430` | `oklch(0.22 0.02 250)` | Primary dark — text, backgrounds, deep surfaces, default primary actions (light mode) |
| **Parchment** | `#EFE6D8` | `oklch(0.93 0.02 80)` | Primary light — backgrounds, surfaces, paper feel, default primary actions (dark mode) |
| **Lantern Gold** | `#C9A227` | `oklch(0.76 0.14 85)` | Achievement accent — prayer completion, milestones, spiritual progress only |
| **Dusk Teal** | `#2F6F6B` | `oklch(0.46 0.06 175)` | Secondary accent — links, secondary actions, info, focus rings |
| **Quiet Sage** | `#7C9070` | `oklch(0.62 0.06 135)` | Tertiary — success states, nature, growth |

### 2.2 Semantic Tokens — Light Mode

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.93 0.02 80)` | Page background (Parchment) |
| `--foreground` | `oklch(0.22 0.02 250)` | Primary text (Ink Night) |
| `--card` | `oklch(0.96 0.01 80)` | Card surface (lighter Parchment) |
| `--card-foreground` | `oklch(0.22 0.02 250)` | Card text |
| `--popover` | `oklch(0.96 0.01 80)` | Popover/dropdown surface |
| `--popover-foreground` | `oklch(0.22 0.02 250)` | Popover text |
| `--primary` | `oklch(0.22 0.02 250)` | Primary action (Ink Night — dark button on light bg) |
| `--primary-foreground` | `oklch(0.93 0.02 80)` | Text on primary (Parchment) |
| `--secondary` | `oklch(0.90 0.02 80)` | Secondary surface |
| `--secondary-foreground` | `oklch(0.22 0.02 250)` | Secondary text |
| `--muted` | `oklch(0.90 0.02 80)` | Muted background |
| `--muted-foreground` | `oklch(0.48 0.02 250)` | Muted/secondary text |
| `--accent` | `oklch(0.46 0.06 175)` | Accent action (Dusk Teal) |
| `--accent-foreground` | `oklch(0.96 0.01 175)` | Text on accent |
| `--destructive` | `oklch(0.58 0.22 25)` | Error/destructive action |
| `--border` | `oklch(0.85 0.02 80)` | Borders |
| `--input` | `oklch(0.85 0.02 80)` | Input borders |
| `--ring` | `oklch(0.46 0.06 175)` | Focus rings (Dusk Teal) |
| `--success` | `oklch(0.62 0.06 135)` | Success state (Quiet Sage) |
| `--warning` | `oklch(0.76 0.14 85)` | Warning state (Lantern Gold) |

### 2.3 Semantic Tokens — Dark Mode

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.16 0.02 250)` | Page background (deep Ink Night) |
| `--foreground` | `oklch(0.93 0.01 80)` | Primary text (soft Parchment) |
| `--card` | `oklch(0.20 0.02 250)` | Card surface |
| `--card-foreground` | `oklch(0.93 0.01 80)` | Card text |
| `--popover` | `oklch(0.20 0.02 250)` | Popover surface |
| `--popover-foreground` | `oklch(0.93 0.01 80)` | Popover text |
| `--primary` | `oklch(0.93 0.02 80)` | Primary action (Parchment — light button on dark bg) |
| `--primary-foreground` | `oklch(0.22 0.02 250)` | Text on primary (Ink Night) |
| `--secondary` | `oklch(0.24 0.02 250)` | Secondary surface |
| `--secondary-foreground` | `oklch(0.93 0.01 80)` | Secondary text |
| `--muted` | `oklch(0.24 0.02 250)` | Muted background |
| `--muted-foreground` | `oklch(0.62 0.02 250)` | Muted/secondary text |
| `--accent` | `oklch(0.52 0.08 175)` | Accent action (Dusk Teal, brighter for dark) |
| `--accent-foreground` | `oklch(0.96 0.01 175)` | Text on accent |
| `--destructive` | `oklch(0.65 0.20 25)` | Error/destructive action |
| `--border` | `oklch(1 0 0 / 8%)` | Borders (semi-transparent white) |
| `--input` | `oklch(1 0 0 / 12%)` | Input borders |
| `--ring` | `oklch(0.52 0.08 175)` | Focus rings (Dusk Teal, brighter for dark) |
| `--success` | `oklch(0.62 0.06 135)` | Success state (Quiet Sage) |
| `--warning` | `oklch(0.76 0.14 85)` | Warning state (Lantern Gold) |

### 2.4 Chart Colors

| Token | Light | Dark | Role |
|---|---|---|---|
| `--chart-1` | `oklch(0.76 0.14 85)` | `oklch(0.76 0.14 85)` | Lantern Gold |
| `--chart-2` | `oklch(0.46 0.06 175)` | `oklch(0.52 0.08 175)` | Dusk Teal |
| `--chart-3` | `oklch(0.62 0.06 135)` | `oklch(0.62 0.06 135)` | Quiet Sage |
| `--chart-4` | `oklch(0.48 0.02 250)` | `oklch(0.62 0.02 250)` | Ink Night |
| `--chart-5` | `oklch(0.35 0.02 250)` | `oklch(0.45 0.02 250)` | Deep Ink |

### 2.5 Color Usage Rules

1. **Default primary actions** use Ink Night (light mode) or Parchment (dark mode) — high-contrast, neutral, always appropriate.
2. **Lantern Gold** is the achievement accent. Use **only** for prayer completion, milestones, streaks, and important spiritual progress. Never use for generic CTAs, navigation, or standard buttons.
3. **Dusk Teal** is the secondary accent for links, info states, secondary actions, and focus rings.
4. **Quiet Sage** is reserved for success/growth states only.
5. **Never use raw hex** outside `:root`. Always reference `var(--token)`.
6. **Dark mode borders**: use `rgba(255,255,255,0.08)` (semi-transparent white), never solid dark borders.
7. **Contrast minimums**:
   - Body text (≤16px) on background: **4.5:1**
   - Large text (>18px or 14px bold): **3:1**
   - UI components against adjacent surfaces: **3:1**

---

## 3. Typography

### 3.1 Font Families

| Role | Font Stack | Fallback |
|---|---|---|
| **Display** | `'Fraunces'` | `Georgia, serif` |
| **Body** | `'Inter'` | `system-ui, -apple-system, sans-serif` |
| **Mono** | `'IBM Plex Mono'` | `ui-monospace, Menlo, monospace` |

**Rules:**
- Display (`Fraunces`) is for headlines, hero text, and pull quotes only. Never use for body.
- Body (`Inter`) is for all running text, UI labels, navigation, buttons.
- Mono (`IBM Plex Mono`) is for timestamps, prayer times, code, metadata, tabular data.
- Never use `system-ui` alone on a heading — always pair with Fraunces.

### 3.2 Type Scale

| Role | Size | Line Height | Letter Spacing | Font |
|---|---|---|---|---|
| Display | `clamp(40px, 6vw, 64px)` | `1.05` | `-0.025em` | Fraunces 600 |
| H1 | `clamp(32px, 4vw, 48px)` | `1.1` | `-0.02em` | Fraunces 600 |
| H2 | `clamp(24px, 3vw, 32px)` | `1.2` | `-0.015em` | Fraunces 600 |
| H3 | `20px` | `1.3` | `-0.01em` | Inter 600 |
| H4 | `18px` | `1.4` | `0` | Inter 600 |
| Body | `16px` | `1.6` | `0` | Inter 400 |
| Body Small | `14px` | `1.5` | `0.01em` | Inter 400 |
| Caption | `12px` | `1.5` | `0.02em` | Inter 500 |
| Mono | `14px` | `1.5` | `0` | IBM Plex Mono 400 |
| Mono Small | `12px` | `1.5` | `0.02em` | IBM Plex Mono 500 |

### 3.3 Letter-Spacing Rules (Non-negotiable)

| Context | Spacing | Why |
|---|---|---|
| Display text (≥40px) | `-0.025em` | Tight tracking for impact |
| Headings (24–48px) | `-0.02em` to `-0.015em` | Controlled tightness |
| Body text (14–18px) | `0` (default) | Natural reading rhythm |
| Small text (≤13px) | `+0.01em` to `+0.02em` | Improved legibility at small sizes |
| UI labels, buttons | `+0.02em` | Crisp, deliberate |
| ALL CAPS | `+0.06em` to `+0.1em` | **Required** — caps without tracking looks cramped |

### 3.4 Weight System

| Weight | Value | Usage |
|---|---|---|
| Regular | `400` | Body copy, running text |
| Medium | `500` | UI labels, navigation, button text |
| Semibold | `600` | Headlines, emphasis, active states |
| Bold | `700` | Sparingly — only for critical emphasis |

### 3.5 Typography Rules

- **Max line length**: 65ch for body copy (`max-width: 65ch`).
- **No `text-align: justify`** on the web — it creates rivers.
- **One display face + one body face** per artifact. Fraunces + Inter is the pair.
- **Body text is never smaller than 14px** on mobile, 16px on desktop.
- **Headlines ≥ 24px** — nothing between 18–24px should be a heading.

---

## 4. Spacing Scale

Base unit: **8px**. All spacing is a multiple of 8, with 4px used for tight internal padding only.

| Token | Value | Usage |
|---|---|---|
| `--space-0` | `0` | Reset |
| `--space-px` | `1px` | Hairline borders |
| `--space-0.5` | `2px` | Tightest internal spacing |
| `--space-1` | `4px` | Compact padding, icon gaps |
| `--space-2` | `8px` | Default small gap |
| `--space-3` | `12px` | Input padding, small card padding |
| `--space-4` | `16px` | Standard padding, card padding |
| `--space-5` | `20px` | Medium spacing |
| `--space-6` | `24px` | Section gap, large card padding |
| `--space-8` | `32px` | Section spacing |
| `--space-10` | `40px` | Large section spacing |
| `--space-12` | `48px` | Major section break |
| `--space-16` | `64px` | Hero spacing, page margins |
| `--space-20` | `80px` | Extra large whitespace |
| `--space-24` | `96px` | Maximum whitespace |

### Spacing Rules

- **Mobile page padding**: `--space-4` (16px) minimum, `--space-5` (20px) preferred.
- **Desktop page padding**: `--space-8` (32px) to `--space-16` (64px).
- **Section vertical spacing**: `--space-12` (48px) to `--space-20` (80px).
- **Component internal spacing**: `--space-3` (12px) to `--space-6` (24px).
- **Between related elements**: `--space-2` (8px).
- **Between unrelated elements**: `--space-4` (16px) or more.

---

## 5. Border Radius

Base radius: **0.5rem** (8px). Radii are restrained — this is not a rounded-SaaS aesthetic.

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `0.25rem` (4px) | Small elements: badges, tags |
| `--radius-md` | `0.5rem` (8px) | Buttons, inputs, cards |
| `--radius-lg` | `0.625rem` (10px) | Modals, large cards |
| `--radius-full` | `9999px` | Pills, avatars, circular only |

### Radius Rules

- **Default**: `--radius-md` (8px) — buttons, inputs, cards.
- **Modals**: `--radius-lg` (10px) — slightly larger for floating surfaces.
- **Avatars / pills**: `--radius-full` — always.
- **Never use radius > 10px** on content elements.
- **No rounded-SaaS look** — radii are functional (catch radius for touch), not decorative.

---

## 6. Elevation & Shadows

### 6.1 Shadow Tokens

Shadows are editorial — barely visible, purely functional. They suggest depth without decoration.

| Level | Token | Light Mode | Dark Mode |
|---|---|---|---|
| 0 | `--shadow-none` | `none` | `none` |
| 1 | `--shadow-xs` | `0 1px 2px oklch(0 0 0 / 0.03)` | `0 1px 2px oklch(0 0 0 / 0.15)` |
| 2 | `--shadow-sm` | `0 1px 3px oklch(0 0 0 / 0.04)` | `0 1px 3px oklch(0 0 0 / 0.2)` |
| 3 | `--shadow-md` | `0 2px 6px oklch(0 0 0 / 0.04)` | `0 2px 6px oklch(0 0 0 / 0.25)` |
| 4 | `--shadow-lg` | `0 4px 12px oklch(0 0 0 / 0.05)` | `0 4px 12px oklch(0 0 0 / 0.3)` |
| 5 | `--shadow-xl` | `0 8px 24px oklch(0 0 0 / 0.06)` | `0 8px 24px oklch(0 0 0 / 0.35)` |

### 6.2 Elevation System

| Level | Shadow | Z-Index | Usage |
|---|---|---|---|
| **Flat** | `none` | `0` | Base content, static text |
| **Raised** | `--shadow-xs` | `10` | Cards at rest, subtle lift |
| **Floating** | `--shadow-sm` | `20` | Hovered cards, dropdowns |
| **Overlay** | `--shadow-md` | `30` | Sticky nav, side panels |
| **Modal** | `--shadow-lg` | `40` | Dialogs, modals |
| **Dramatic** | `--shadow-xl` | `50` | Hero elements, featured content |

### 6.3 Elevation Rules

- **Cards at rest**: `--shadow-xs` or no shadow — never `--shadow-md` at rest.
- **Hover state**: promote one level (xs → sm, sm → md).
- **Modals/dialogs**: `--shadow-lg` minimum, with a backdrop overlay.
- **Sticky navigation**: `--shadow-sm` + backdrop-blur.
- **Never stack shadows** — one shadow per element.
- **Dark mode**: shadows are subtler; use elevation through surface color differences, not shadow intensity.

---

## 7. Grid System

### 7.1 Layout Grid

| Property | Mobile (<640px) | Tablet (640–1024px) | Desktop (>1024px) |
|---|---|---|---|
| Columns | 4 | 8 | 12 |
| Gutter | `--space-4` (16px) | `--space-5` (20px) | `--space-6` (24px) |
| Margin | `--space-4` (16px) | `--space-6` (24px) | `--space-8` (32px) |
| Max Width | `100%` | `640px` | `1200px` |

### 7.2 Content Width Constraints

| Context | Max Width | Token |
|---|---|---|
| Reading content | `65ch` | `max-width: 65ch` |
| Narrow forms | `480px` | `max-width: 480px` |
| Standard content | `720px` | `max-width: 720px` |
| Wide content | `960px` | `max-width: 960px` |
| Full-bleed | `100%` | No constraint |

### 7.3 Breakpoints

| Name | Min Width | CSS |
|---|---|---|
| Mobile | `0px` | Default |
| Small | `640px` | `@media (min-width: 640px)` |
| Tablet | `768px` | `@media (min-width: 768px)` |
| Laptop | `1024px` | `@media (min-width: 1024px)` |
| Desktop | `1280px` | `@media (min-width: 1280px)` |
| Wide | `1536px` | `@media (min-width: 1536px)` |

### 7.4 Grid Rules

- **Mobile-first**: always start with mobile styles, add complexity at larger breakpoints.
- **No horizontal scroll** at any breakpoint — verify at 360px, 390px, 430px, 768px, 1024px, 1440px.
- **Content max-width**: never exceed `720px` for reading text, `960px` for media-rich content.
- **Vertical spacing scales up** at larger breakpoints — `--space-12` on mobile becomes `--space-20` on desktop.

---

## 8. Iconography

### 8.1 Icon Library

**Lucide React** (`lucide-react`) — monoline SVG icons at 1.5px stroke.

### 8.2 Icon Sizes

| Size | Pixels | Usage |
|---|---|---|
| `--icon-sm` | `16px` | Inline text icons, badges |
| `--icon-md` | `20px` | Button icons, navigation |
| `--icon-lg` | `24px` | Feature icons, standalone |
| `--icon-xl` | `32px` | Hero icons, empty states |

### 8.3 Icon Rules

- **Stroke width**: always `1.5` (Lucide default). Never use filled icons.
- **Color**: icons inherit `currentColor` — never hardcode icon colors.
- **No emoji as icons** — use Lucide SVG. Emoji are text, not iconography.
- **Icon + label pairing**: icon should be `--icon-md` (20px) alongside 14–16px text.
- **Touch targets**: icon-only buttons must be at least `44px × 44px` (include padding).
- **No decorative icons** next to every heading — use icons only when they add functional clarity.

---

## 9. Motion Principles

### 9.1 Allowed Animations

Only two animation types are permitted:

| Type | Properties | Usage |
|---|---|---|
| **Fade** | `opacity` | Enter/exit elements, show/hide panels |
| **Translate** | `transform: translateY()` | Subtle vertical shift on enter (4–8px) |

Never animate: `scale`, `rotate`, `width`, `height`, `left`, `right`, `margin`, `padding`, `border-radius`, `box-shadow`, or `filter`.

### 9.2 Easing Curves

| Name | Value | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (default) |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Elements exiting, layout shifts |

No spring, no elastic, no bounce.

### 9.3 Duration

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | `150ms` | Hover states, focus rings, toggles |
| `--duration-normal` | `200ms` | Panel open/close, page transitions |

No animation should exceed 200ms. If it feels slow at 200ms, the animation is wrong — remove it.

### 9.4 Motion Rules

1. **Fade + translate only** — opacity and vertical shift, nothing else.
2. **150–200ms max** — anything longer feels sluggish.
3. **4–8px translate** — just enough to register movement, never theatrical.
4. **Reduced motion**: always respect `prefers-reduced-motion: reduce` — disable all animation.
5. **One animation per interaction** — don't animate opacity + transform simultaneously on enter; pick one.
6. **Framer Motion** is the animation library — use `motion` components for enter/exit.

---

## 10. Accessibility

### 10.1 Contrast Requirements

| Element | Minimum Ratio | Standard |
|---|---|---|
| Body text (≤16px) | **4.5:1** | WCAG AA |
| Large text (>18px or 14px bold) | **3:1** | WCAG AA |
| UI components | **3:1** | WCAG AA |
| Focus indicators | **3:1** | WCAG AA |

### 10.2 Touch Targets

| Element | Minimum Size |
|---|---|
| Buttons | `44px × 44px` |
| Links (mobile) | `44px × 44px` hit area |
| Form inputs | `44px` height minimum |
| Tab triggers | `44px × 44px` |

### 10.3 Focus Management

- **Focus ring**: `2px solid var(--ring)` with `2px` offset.
- **Never remove outlines** without providing an alternative.
- **Keyboard navigation**: all interactive elements must be reachable via Tab.
- **Skip links**: include a "Skip to main content" link as the first focusable element.

### 10.4 Semantic HTML

- Use `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` for landmarks.
- Use `<h1>`–`<h6>` in hierarchical order — never skip levels.
- Use `aria-label` for icon-only buttons.
- Use `aria-current="page"` for active navigation items.
- Use `role="alert"` for error messages.

### 10.5 Color Independence

- Never convey information through color alone — pair with text, icons, or patterns.
- Error states: red icon + red text + descriptive message (not just a red border).
- Success states: same principle — icon + text, not just green.

### 10.6 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Mobile-First Responsive Rules

### 11.1 Responsive Approach

All styles are written mobile-first. Complexity is added at breakpoints via `@media (min-width: ...)`.

### 11.2 Fluid Typography

Display and H1 use `clamp()` for fluid scaling:

```css
--font-size-display: clamp(40px, 6vw, 64px);
--font-size-h1: clamp(32px, 4vw, 48px);
--font-size-h2: clamp(24px, 3vw, 32px);
```

### 11.3 Mobile-Specific Rules

| Rule | Value |
|---|---|
| Page padding | `16px` minimum, `20px` preferred |
| Minimum font size | `14px` (body), `16px` (reading) |
| Touch target minimum | `44px × 44px` |
| No hover-only interactions | Every hover state must have a tap equivalent |
| Bottom safe area | Respect `env(safe-area-inset-bottom)` for PWA |

### 11.4 Tablet-Specific Rules

| Rule | Value |
|---|---|
| Page padding | `24px` |
| Max content width | `720px` for reading, `960px` for media |
| Two-column layouts | Begin at `768px` |
| Larger touch targets | `48px` preferred |

### 11.5 Desktop-Specific Rules

| Rule | Value |
|---|---|
| Page padding | `32px` to `64px` |
| Max content width | `1200px` |
| Multi-column layouts | 2–3 columns at `1024px+` |
| Hover states | Full hover/focus/active states |
| Cursor | `pointer` on interactive elements |

### 11.6 Responsive Patterns

- **Stack → Grid**: single column on mobile, 2–3 columns on tablet/desktop.
- **Hidden → Visible**: secondary content hidden on mobile, visible on tablet+.
- **Full-bleed → Contained**: hero sections go full-bleed on mobile, contained on desktop.
- **Bottom nav → Side nav**: navigation adapts to surface constraints.

---

## 12. Paper Texture

The paper texture adds tactile warmth — the digital equivalent of fine stationery. It is **opt-in** and must never reduce readability.

### 12.1 Implementation

Apply only to page-level background surfaces via the `.paper-texture` utility class:

```css
.paper-texture::before {
  opacity: 0.02;       /* felt, not seen */
  mix-blend-mode: multiply;
}
```

### 12.2 Rules

- **Opt-in only**: apply `.paper-texture` explicitly to `--background` surfaces. Never apply to cards, modals, inputs, or text containers.
- **Opacity ceiling**: never exceed `0.03` in light mode, `0.015` in dark mode.
- **Readability gate**: if any text on a textured surface fails WCAG AA contrast, remove the texture from that surface.
- **Performance**: use a small repeating SVG pattern (< 10KB), not a full-size image.
- **Dark mode**: reduce to `0.015` or disable — dark surfaces amplify grain.

---

## 13. Component Token Mapping (shadcn/ui)

The existing shadcn/ui tokens in `globals.css` should be remapped to the Daily Deen palette. This is the canonical mapping:

### Light Mode Mapping

```css
:root {
  /* Background & foreground */
  --background: var(--dd-parchment);
  --foreground: var(--dd-ink-night);

  /* Cards & popovers */
  --card: oklch(0.96 0.01 80);
  --card-foreground: var(--dd-ink-night);
  --popover: oklch(0.96 0.01 80);
  --popover-foreground: var(--dd-ink-night);

  /* Primary = Ink Night (default action) */
  --primary: var(--dd-ink-night);
  --primary-foreground: var(--dd-parchment);

  /* Secondary = soft parchment */
  --secondary: oklch(0.90 0.02 80);
  --secondary-foreground: var(--dd-ink-night);

  /* Muted = parchment wash */
  --muted: oklch(0.90 0.02 80);
  --muted-foreground: oklch(0.48 0.02 250);

  /* Accent = Dusk Teal */
  --accent: var(--dd-dusk-teal);
  --accent-foreground: oklch(0.96 0.01 175);

  /* Destructive */
  --destructive: oklch(0.58 0.22 25);

  /* Borders & inputs */
  --border: oklch(0.85 0.02 80);
  --input: oklch(0.85 0.02 80);
  --ring: var(--dd-dusk-teal);
}
```

### Dark Mode Mapping

```css
.dark {
  --background: oklch(0.16 0.02 250);
  --foreground: oklch(0.93 0.01 80);

  --card: oklch(0.20 0.02 250);
  --card-foreground: oklch(0.93 0.01 80);
  --popover: oklch(0.20 0.02 250);
  --popover-foreground: oklch(0.93 0.01 80);

  --primary: var(--dd-parchment);
  --primary-foreground: var(--dd-ink-night);

  --secondary: oklch(0.24 0.02 250);
  --secondary-foreground: oklch(0.93 0.01 80);

  --muted: oklch(0.24 0.02 250);
  --muted-foreground: oklch(0.62 0.02 250);

  --accent: oklch(0.52 0.08 175);
  --accent-foreground: oklch(0.96 0.01 175);

  --destructive: oklch(0.65 0.20 25);

  --border: oklch(1 0 0 / 8%);
  --input: oklch(1 0 0 / 12%);
  --ring: var(--dd-dusk-teal);
}
```

### Brand Color Tokens (add to `:root`)

```css
:root {
  --dd-ink-night: oklch(0.22 0.02 250);
  --dd-parchment: oklch(0.93 0.02 80);
  --dd-lantern-gold: oklch(0.76 0.14 85);
  --dd-dusk-teal: oklch(0.46 0.06 175);
  --dd-quiet-sage: oklch(0.62 0.06 135);
}
```

---

## 14. File Reference

| File | Purpose |
|---|---|
| `DESIGN.md` | This document — the complete design system specification |
| `tokens.css` | CSS custom properties with all tokens (light + dark mode) |
| `lib/tokens.ts` | TypeScript constants for programmatic access to all tokens |
| `app/globals.css` | Existing shadcn/ui theme — should be updated to reference `tokens.css` |

---

## 15. Implementation Checklist

When integrating this design system:

1. [ ] Import `tokens.css` in `globals.css` (before shadcn imports)
2. [ ] Replace shadcn neutral tokens with Daily Deen brand-mapped tokens
3. [ ] Add `--dd-*` brand color tokens to `:root`
4. [ ] Update typography CSS to use Fraunces/Inter/IBM Plex Mono scale
5. [ ] Add paper texture utility class
6. [ ] Add `prefers-reduced-motion` media query
7. [ ] Verify all contrast ratios pass WCAG AA
8. [ ] Test at 360px, 390px, 768px, 1024px, 1440px viewports
9. [ ] Import `lib/tokens.ts` in components that need programmatic token access
