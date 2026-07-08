/**
 * Daily Deen — Design Tokens (TypeScript)
 *
 * Programmatic access to all design system tokens.
 * Use these in React components, theme configuration, and utility functions.
 *
 * See DESIGN.md for the full specification.
 */

// ===========================================================
// Brand Colors
// ===========================================================

export const brand = {
  inkNight: "oklch(0.22 0.02 250)",
  parchment: "oklch(0.93 0.02 80)",
  lanternGold: "oklch(0.76 0.14 85)",
  duskTeal: "oklch(0.46 0.06 175)",
  quietSage: "oklch(0.62 0.06 135)",
} as const;

// ===========================================================
// Semantic Colors — Light Mode
// ===========================================================

export const light = {
  background: brand.parchment,
  foreground: brand.inkNight,

  card: "oklch(0.96 0.01 80)",
  cardForeground: brand.inkNight,

  popover: "oklch(0.96 0.01 80)",
  popoverForeground: brand.inkNight,

  primary: brand.inkNight,
  primaryForeground: brand.parchment,

  achievement: brand.lanternGold,
  achievementForeground: "oklch(0.18 0.02 250)",

  secondary: "oklch(0.90 0.02 80)",
  secondaryForeground: brand.inkNight,

  muted: "oklch(0.90 0.02 80)",
  mutedForeground: "oklch(0.48 0.02 250)",

  accent: brand.duskTeal,
  accentForeground: "oklch(0.96 0.01 175)",

  destructive: "oklch(0.58 0.22 25)",
  destructiveForeground: "oklch(0.98 0 0)",

  success: brand.quietSage,
  successForeground: "oklch(0.18 0.02 135)",

  warning: brand.lanternGold,
  warningForeground: "oklch(0.18 0.02 85)",

  info: brand.duskTeal,
  infoForeground: "oklch(0.96 0.01 175)",

  border: "oklch(0.85 0.02 80)",
  input: "oklch(0.85 0.02 80)",
  ring: brand.duskTeal,

  chart1: brand.lanternGold,
  chart2: brand.duskTeal,
  chart3: brand.quietSage,
  chart4: "oklch(0.48 0.02 250)",
  chart5: "oklch(0.35 0.02 250)",
} as const;

// ===========================================================
// Semantic Colors — Dark Mode
// ===========================================================

export const dark = {
  background: "oklch(0.16 0.02 250)",
  foreground: "oklch(0.93 0.01 80)",

  card: "oklch(0.20 0.02 250)",
  cardForeground: "oklch(0.93 0.01 80)",

  popover: "oklch(0.20 0.02 250)",
  popoverForeground: "oklch(0.93 0.01 80)",

  primary: brand.parchment,
  primaryForeground: brand.inkNight,

  achievement: brand.lanternGold,
  achievementForeground: "oklch(0.16 0.02 250)",

  secondary: "oklch(0.24 0.02 250)",
  secondaryForeground: "oklch(0.93 0.01 80)",

  muted: "oklch(0.24 0.02 250)",
  mutedForeground: "oklch(0.62 0.02 250)",

  accent: "oklch(0.52 0.08 175)",
  accentForeground: "oklch(0.96 0.01 175)",

  destructive: "oklch(0.65 0.20 25)",
  destructiveForeground: "oklch(0.98 0 0)",

  success: brand.quietSage,
  successForeground: "oklch(0.93 0.01 135)",

  warning: brand.lanternGold,
  warningForeground: "oklch(0.16 0.02 85)",

  info: "oklch(0.52 0.08 175)",
  infoForeground: "oklch(0.96 0.01 175)",

  border: "oklch(1 0 0 / 8%)",
  input: "oklch(1 0 0 / 12%)",
  ring: brand.duskTeal,

  chart1: brand.lanternGold,
  chart2: "oklch(0.52 0.08 175)",
  chart3: brand.quietSage,
  chart4: "oklch(0.62 0.02 250)",
  chart5: "oklch(0.45 0.02 250)",
} as const;

// ===========================================================
// Typography
// ===========================================================

export const fontFamily = {
  display: "'Fraunces', Georgia, serif",
  body: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, Menlo, monospace",
} as const;

export const fontSize = {
  display: "clamp(40px, 6vw, 64px)",
  h1: "clamp(32px, 4vw, 48px)",
  h2: "clamp(24px, 3vw, 32px)",
  h3: "20px",
  h4: "18px",
  body: "16px",
  bodySm: "14px",
  caption: "12px",
  mono: "14px",
  monoSm: "12px",
} as const;

export const lineHeight = {
  display: "1.05",
  h1: "1.1",
  h2: "1.2",
  h3: "1.3",
  h4: "1.4",
  body: "1.6",
  tight: "1.2",
  snug: "1.375",
} as const;

export const letterSpacing = {
  display: "-0.025em",
  h1: "-0.02em",
  h2: "-0.015em",
  h3: "-0.01em",
  body: "0em",
  wide: "0.02em",
  caps: "0.06em",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ===========================================================
// Spacing (8px base)
// ===========================================================

export const space = {
  0: "0",
  px: "1px",
  "0.5": "2px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

// ===========================================================
// Border Radius
// ===========================================================

export const radius = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.625rem",
  full: "9999px",
} as const;

// ===========================================================
// Shadows
// ===========================================================

export const shadow = {
  none: "none",
  xs: "0 1px 2px oklch(0 0 0 / 0.03)",
  sm: "0 1px 3px oklch(0 0 0 / 0.04)",
  md: "0 2px 6px oklch(0 0 0 / 0.04)",
  lg: "0 4px 12px oklch(0 0 0 / 0.05)",
  xl: "0 8px 24px oklch(0 0 0 / 0.06)",
} as const;

export const shadowDark = {
  none: "none",
  xs: "0 1px 2px oklch(0 0 0 / 0.15)",
  sm: "0 1px 3px oklch(0 0 0 / 0.2)",
  md: "0 2px 6px oklch(0 0 0 / 0.25)",
  lg: "0 4px 12px oklch(0 0 0 / 0.3)",
  xl: "0 8px 24px oklch(0 0 0 / 0.35)",
} as const;

// ===========================================================
// Elevation (Z-Index)
// ===========================================================

export const zIndex = {
  base: 0,
  raised: 10,
  floating: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
} as const;

// ===========================================================
// Motion
// ===========================================================

export const easing = {
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const duration = {
  fast: "150ms",
  normal: "200ms",
} as const;

// ===========================================================
// Grid
// ===========================================================

export const grid = {
  columns: 12,
  gutter: space[6],
  margin: space[8],
  maxWidth: "1200px",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ===========================================================
// Icons
// ===========================================================

export const icon = {
  sm: "16px",
  md: "20px",
  lg: "24px",
  xl: "32px",
  strokeWidth: 1.5,
} as const;

// ===========================================================
// Content Widths
// ===========================================================

export const contentWidth = {
  narrow: "480px",
  reading: "720px",
  wide: "960px",
  max: grid.maxWidth,
} as const;

// ===========================================================
// Focus Ring
// ===========================================================

export const focusRing = {
  outline: `2px solid var(--ring)`,
  outlineOffset: "2px",
  boxShadow: "0 0 0 2px var(--background), 0 0 0 4px var(--ring)",
} as const;

// ===========================================================
// Export All Tokens (for programmatic access)
// ===========================================================

export const tokens = {
  brand,
  light,
  dark,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight,
  space,
  radius,
  shadow,
  shadowDark,
  zIndex,
  easing,
  duration,
  grid,
  breakpoints,
  icon,
  contentWidth,
  focusRing,
} as const;

export type Tokens = typeof tokens;
