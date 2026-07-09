"use client";

import { Navigation } from "@/components/navigation";
import { Dashboard } from "@/features/dashboard";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function Home() {
  useKeyboardShortcuts();

  return (
    <div className="flex min-h-dvh flex-col paper-texture">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to main content
      </a>
      <Navigation />
      <Dashboard />
    </div>
  );
}
