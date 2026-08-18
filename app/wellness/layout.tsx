import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wellness",
  description: "Track your daily wellness — mood, water intake, sleep, and exercise. Build healthy habits.",
};

export default function WellnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
