import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1B2430",
};

export const metadata: Metadata = {
  title: {
    default: "Daily Deen",
    template: "%s | Daily Deen",
  },
  description: "Prayer times, Quran, habits, journal, and insights. All offline.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Deen",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "Daily Deen",
    description: "Prayer times, Quran, habits, journal, and insights.",
    type: "website",
    locale: "en_US",
    siteName: "Daily Deen",
  },
  twitter: {
    card: "summary",
    title: "Daily Deen",
    description: "Prayer times, Quran, habits, journal, and insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=IBM+Plex+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="skip-to-content">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
