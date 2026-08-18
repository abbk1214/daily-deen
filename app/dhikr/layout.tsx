import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dhikr",
  description: "Track your daily dhikr and tasbeeh. Morning and evening adhkar with counters and progress.",
};

export default function DhikrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
