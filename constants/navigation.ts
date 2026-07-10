import {
  Home,
  ListChecks,
  BookOpen,
  Settings,
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
  { href: "/habits", label: "Habits", icon: ListChecks, shortcutKey: "b" },
  { href: "/journal", label: "Journal", icon: BookOpen, shortcutKey: "j" },
  { href: "/settings", label: "Settings", icon: Settings, shortcutKey: "s" },
] as const;

export const SHORTCUT_MAP: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.filter((item) => item.shortcutKey != null).map((item) => [
    item.shortcutKey!,
    item.href,
  ]),
);
