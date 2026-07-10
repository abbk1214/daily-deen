"use client";

import Link from "next/link";
import type { NavItem } from "@/constants/navigation";

interface NavigationListProps {
  items: readonly NavItem[];
  activeIndex: number;
  onNavigate: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  tabRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  orientation: "horizontal" | "vertical";
  ariaLabel: string;
  renderItem: (item: NavItem, index: number, isActive: boolean) => React.ReactNode;
  wrapItem?: (item: NavItem, children: React.ReactNode) => React.ReactNode;
}

export function NavigationList({
  items,
  activeIndex,
  onNavigate,
  onKeyDown,
  tabRefs,
  orientation,
  ariaLabel,
  renderItem,
  wrapItem,
}: NavigationListProps) {
  return (
    <ul
      role="menubar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={
        orientation === "horizontal"
          ? "flex items-stretch"
          : "flex flex-col"
      }
      style={orientation === "vertical" ? { gap: "var(--space-1)" } : undefined}
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const link = (
          <li key={item.href} role="none">
            <Link
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="menuitem"
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={onNavigate}
              className="flex items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {renderItem(item, index, isActive)}
            </Link>
          </li>
        );

        return wrapItem ? wrapItem(item, link) : link;
      })}
    </ul>
  );
}
