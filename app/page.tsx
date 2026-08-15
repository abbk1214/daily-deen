"use client";

import { Navigation } from "@/components/navigation";
import { Dashboard } from "@/features/dashboard";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function Home() {
  useKeyboardShortcuts();

  return (
    <div className="flex min-h-dvh flex-col">
      <Navigation />
      <Dashboard />
    </div>
  );
}
