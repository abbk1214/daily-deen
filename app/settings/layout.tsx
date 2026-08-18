import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your Daily Deen experience — prayer times, notifications, appearance, and data management.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
