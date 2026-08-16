"use client";

import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { NavigationList } from "@/components/navigation-list";
import { LoadingBar } from "@/components/loading-bar";
import { Tooltip } from "@/components/tooltip";

function BottomNav({
  activeIndex,
  onNavigate,
  onKeyDown,
  tabRefs,
}: {
  activeIndex: number;
  onNavigate: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  tabRefs: React.MutableRefObject<(HTMLElement | null)[]>;
}) {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <NavigationList
        items={NAV_ITEMS}
        activeIndex={activeIndex}
        onNavigate={onNavigate}
        onKeyDown={onKeyDown}
        tabRefs={tabRefs}
        orientation="horizontal"
        ariaLabel="Primary navigation"
        renderItem={(item, _index, isActive) => {
          const Icon = item.icon;
          return (
            <>
              <div
                className="flex flex-1 flex-col items-center justify-center gap-1"
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
              </div>
            </>
          );
        }}
      />
    </nav>
  );
}

function Sidebar({
  isCollapsed,
  activeIndex,
  onToggle,
  onNavigate,
  onKeyDown,
  tabRefs,
}: {
  isCollapsed: boolean;
  activeIndex: number;
  onToggle: () => void;
  onNavigate: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  tabRefs: React.MutableRefObject<(HTMLElement | null)[]>;
}) {
  const handleSidebarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onToggle();
      return;
    }
    onKeyDown(e);
  };

  return (
    <nav
      aria-label="Sidebar navigation"
      className="fixed top-0 left-0 z-20 hidden h-full flex-col border-r border-border bg-background lg:flex"
      style={{
        width: isCollapsed ? "64px" : "200px",
        padding: "var(--space-6)",
        transition: "width 200ms ease-in-out",
      }}
    >
      <div className="flex flex-1 flex-col">
        {/* Toggle button */}
        <div
          className="flex items-center"
          style={{ height: "36px", marginBottom: "var(--space-6)" }}
        >
          <Tooltip
            content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            disabled={!isCollapsed}
          >
            <button
              type="button"
              onClick={onToggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              className="flex items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{ width: "44px", height: "44px" }}
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
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              marginBottom: "var(--space-6)",
            }}
          >
            Daily Deen
          </span>
        )}

        {/* Divider */}
        <div
          className="border-t border-border"
          style={{ marginBottom: "var(--space-6)" }}
        />

        {/* Navigation links */}
        <NavigationList
          items={NAV_ITEMS}
          activeIndex={activeIndex}
          onNavigate={onNavigate}
          onKeyDown={handleSidebarKeyDown}
          tabRefs={tabRefs}
          orientation="vertical"
          ariaLabel="Sidebar navigation"
          wrapItem={
            isCollapsed
              ? (item, children) => (
                  <Tooltip key={item.href} content={item.label}>
                    {children}
                  </Tooltip>
                )
              : undefined
          }
          renderItem={(item, _index, isActive) => {
            const Icon = item.icon;
            return (
              <div
                className="flex items-center"
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
              </div>
            );
          }}
        />
      </div>

      {/* Version footer */}
      <div style={{ marginTop: "var(--space-8)" }}>
        <div
          className="border-t border-border"
          style={{ marginBottom: "var(--space-6)" }}
        />
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
  const {
    isCollapsed,
    isDesktop,
    isLoading,
    activeIndex,
    tabRefs,
    toggleSidebar,
    startLoading,
    handleHorizontalKeyDown,
    handleVerticalKeyDown,
  } = useNavigation();

  return (
    <>
      <LoadingBar isLoading={isLoading} />

      {/* Mobile bottom nav */}
      {!isDesktop && (
        <BottomNav
          activeIndex={activeIndex}
          onNavigate={startLoading}
          onKeyDown={handleHorizontalKeyDown}
          tabRefs={tabRefs}
        />
      )}

      {/* Desktop sidebar */}
      {isDesktop && (
        <Sidebar
          isCollapsed={isCollapsed}
          activeIndex={activeIndex}
          onToggle={toggleSidebar}
          onNavigate={startLoading}
          onKeyDown={handleVerticalKeyDown}
          tabRefs={tabRefs}
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
