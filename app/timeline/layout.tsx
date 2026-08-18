import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey",
  description: "Your spiritual journey timeline. Track milestones, streaks, and memories.",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
