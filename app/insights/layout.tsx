import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",
  description: "Discover patterns and insights from your prayer, habit, and wellness data.",
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
