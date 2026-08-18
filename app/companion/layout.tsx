import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deen Guide",
  description: "Your AI-powered Islamic companion. Ask questions about deen, get guidance, and reflect on your journey.",
};

export default function CompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
