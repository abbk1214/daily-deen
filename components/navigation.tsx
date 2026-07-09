"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ListChecks,
  BookOpen,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";
import { LoadingBar } from "@/components/loading-bar";
import { Tooltip } from "@/components/tooltip";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/habits", label: "Habits", icon: ListChecks },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function BottomNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const moveFocus = useCallback(
    (index: number) => {
      tabRefs.current[index]?.focus();
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = NAV_ITEMS.findIndex((item) => item.href === pathname);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % NAV_ITEMS.length;
          break;
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + NAV_ITEMS.length) % NAV_ITEMS.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = NAV_ITEMS.length - 1;
          break;
        default:
          return;
      }

      moveFocus(nextIndex);
    },
    [pathname, moveFocus],
  );

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="flex items-stretch"
        onKeyDown={handleKeyDown}
      >
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              ref={(el) => { tabRefs.current[index] = el; }}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={onNavigate}
              className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                minHeight: "var(--space-14)",
                paddingTop: "var(--space-2)",
                paddingBottom: "var(--space-2)",
              }}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className={isActive ? "text-dusk-teal" : ""}
              />
              <span
                className="max-w-16 truncate"
                style={{
                  fontSize: "var(--text-caption)",
                  fontWeight: 500,
                  letterSpacing: "var(--tracking-wide)",
                  color: isActive ? "var(--dd-dusk-teal)" : undefined,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className="rounded-full bg-dusk-teal"
                  style={{
                    width: "4px",
                    height: "4px",
                    marginTop: "var(--space-0-5)",
                  }}
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function Sidebar({
  pathname,
  isCollapsed,
  onToggle,
  onNavigate,
}: {
  pathname: string;
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const moveFocus = useCallback(
    (index: number) => {
      linkRefs.current[index]?.focus();
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onToggle();
        return;
      }

      const currentIndex = NAV_ITEMS.findIndex((item) => item.href === pathname);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % NAV_ITEMS.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + NAV_ITEMS.length) % NAV_ITEMS.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = NAV_ITEMS.length - 1;
          break;
        default:
          return;
      }

      moveFocus(nextIndex);
    },
    [pathname, onToggle, moveFocus],
  );

  return (
    <nav
      aria-label="Sidebar navigation"
      className="fixed top-0 left-0 z-20 hidden h-full flex-col border-r border-border bg-background lg:flex"
      style={{
        width: isCollapsed ? "64px" : "200px",
        padding: "var(--space-6)",
        transition: "none",
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-1 flex-col">
        {/* Toggle button */}
        <div className="flex items-center" style={{ height: "36px", marginBottom: "var(--space-6)" }}>
          <Tooltip content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} disabled={!isCollapsed}>
            <button
              type="button"
              onClick={onToggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              className="flex items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                width: "44px",
                height: "44px",
              }}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={20} strokeWidth={1.5} />
              ) : (
                <PanelLeftClose size={20} strokeWidth={1.5} />
              )}
            </button>
          </Tooltip>
        </div>

        {/* App name (expanded only) */}
        {!isCollapsed && (
          <span
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              marginBottom: "var(--space-6)",
            }}
          >
            Daily Deen
          </span>
        )}

        {/* Divider */}
        <div className="border-t border-border" style={{ marginBottom: "var(--space-6)" }} />

        {/* Navigation links */}
        <div className="flex flex-col" style={{ gap: "var(--space-1)" }}>
          {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <Link
                key={item.href}
                ref={(el) => { linkRefs.current[index] = el; }}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={onNavigate}
                className="flex items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                style={{
                  gap: isCollapsed ? 0 : "var(--space-3)",
                  padding: isCollapsed
                    ? "var(--space-2)"
                    : "var(--space-1) var(--space-2)",
                  minHeight: "36px",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  fontSize: isCollapsed ? undefined : "var(--text-body-sm)",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {isActive && !isCollapsed && (
                  <span
                    className="h-1 w-1 shrink-0 rounded-full bg-dusk-teal"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={isActive ? "text-dusk-teal" : ""}
                  style={isCollapsed && isActive ? { marginLeft: "-12px" } : undefined}
                />
                {!isCollapsed && (
                  <span
                    className={isActive ? "text-foreground" : "text-muted-foreground"}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} content={item.label} disabled={!isCollapsed}>
                  {linkContent}
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </div>
      </div>

      {/* Version footer */}
      <div style={{ marginTop: "var(--space-8)" }}>
        <div className="border-t border-border" style={{ marginBottom: "var(--space-6)" }} />
        <span
          className="text-muted-foreground"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-mono-sm)",
            fontWeight: 400,
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          v1.0.0
        </span>
      </div>
    </nav>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const { isCollapsed, isDesktop, toggle } = useSidebarState();
  const { isLoading, startLoading } = useNavigationLoading();

  return (
    <>
      <LoadingBar isLoading={isLoading} />

      {/* Mobile bottom nav */}
      {!isDesktop && (
        <BottomNav pathname={pathname} onNavigate={startLoading} />
      )}

      {/* Desktop sidebar */}
      {isDesktop && (
        <Sidebar
          pathname={pathname}
          isCollapsed={isCollapsed}
          onToggle={toggle}
          onNavigate={startLoading}
        />
      )}

      {/* Screen reader announcements */}
      <div aria-live="polite" className="sr-only">
        {isDesktop && isCollapsed && "Sidebar collapsed"}
        {isDesktop && !isCollapsed && "Sidebar expanded"}
      </div>
    </>
  );
}
