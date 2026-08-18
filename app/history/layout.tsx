import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer History",
  description: "View your prayer history with detailed statistics, streaks, and completion rates.",
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
