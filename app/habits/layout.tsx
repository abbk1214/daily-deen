import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habits",
  description: "Build and track your daily spiritual and physical habits. Stay consistent with your routines.",
};

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
