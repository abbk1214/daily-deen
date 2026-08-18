import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quran",
  description: "Read, listen, and reflect on the Holy Quran. Browse by surah, juz, or page with audio recitation and translations.",
};

export default function QuranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
