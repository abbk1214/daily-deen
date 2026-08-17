"use client";

import { SettingsProvider } from "@/hooks/use-settings";
import { AuthProvider } from "@/lib/supabase/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </AuthProvider>
  );
}
