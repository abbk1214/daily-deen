"use client";

import { SettingsProvider } from "@/hooks/use-settings";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}
