import {
  Home,
  BookOpen,
  ListChecks,
  Heart,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly shortcutKey?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home", icon: Home, shortcutKey: "h" },
  { href: "/quran", label: "Quran", icon: BookOpen, shortcutKey: "q" },
  { href: "/habits", label: "Habits", icon: ListChecks, shortcutKey: "b" },
  { href: "/wellness", label: "Wellness", icon: Heart, shortcutKey: "w" },
  { href: "/timeline", label: "Journey", icon: Sparkles, shortcutKey: "j" },
  { href: "/settings", label: "Settings", icon: Settings, shortcutKey: "s" },
] as const;

export const SHORTCUT_MAP: Record<string, string> = {
  gh: "/",
  gq: "/quran",
  gb: "/habits",
  gw: "/wellness",
  gj: "/timeline",
  gi: "/insights",
  gs: "/settings",
  gc: "/companion",
};
