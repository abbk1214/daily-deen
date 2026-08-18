import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Reflect on your day with guided journaling. Track your mood, write thoughts, and save memories.",
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
