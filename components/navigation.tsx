"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/habits", label: "Habits", icon: ListChecks },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background"
    >
      <div
        className="flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&:focus-visible]:outline-2 [&:focus-visible]:outline-offset-2 [&:focus-visible]:outline-ring"
              style={{ minHeight: "var(--space-14)" }}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className={isActive ? "text-dusk-teal" : ""}
              />
              <span
                className={`text-caption font-medium tracking-wide ${isActive ? "text-dusk-teal" : ""}`}
                style={{
                  fontSize: "var(--text-caption)",
                  fontWeight: 500,
                  letterSpacing: "var(--tracking-wide)",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className="mt-0.5 h-1 w-1 rounded-full bg-dusk-teal"
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

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Sidebar navigation"
      className="fixed top-0 left-0 z-20 hidden h-full w-50 flex-col border-r border-border bg-background pt-12 lg:flex"
      style={{ width: "200px", paddingTop: "var(--space-12)" }}
    >
      <div className="flex flex-1 flex-col px-6">
        <span
          className="mb-6 font-display text-foreground"
          style={{
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            fontFamily: "var(--font-display)",
          }}
        >
          Daily Deen
        </span>

        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex items-center gap-3 rounded-sm px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                style={{
                  fontSize: "var(--text-body-sm)",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {isActive && (
                  <span
                    className="mr-1 h-1 w-1 shrink-0 rounded-full bg-dusk-teal"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={isActive ? "text-dusk-teal" : ""}
                />
                <span
                  className={
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="border-t border-border px-6 pb-6 pt-6"
        style={{ marginTop: "var(--space-8)" }}
      >
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

  return (
    <>
      <BottomNav pathname={pathname} />
      <Sidebar pathname={pathname} />
    </>
  );
}
