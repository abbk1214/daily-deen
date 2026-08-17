import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import { getCSP } from "./lib/security/csp";

const withPWA = withPWAInit({
  dest: "public",
  register: false,
  reloadOnOnline: true,
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    skipWaiting: false,
    clientsClaim: false,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-api",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-webfonts",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "nominatim-geocoding",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/gh\/fawazahmed0\/quran-api\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "quran-data",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/api\.islamic\.app\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "quran-words",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/i,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /^https:\/\/cdn\.islamic\.network\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "quran-audio",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "weather-api",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/zenquotes\.io\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "daily-quotes",
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
});

const config: NextConfig = {
  output: "standalone",
  experimental: {
    ppr: false,
    optimizePackageImports: ["lucide-react"],
  },
  transpilePackages: ["workbox-sw"],
  turbopack: {},
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: getCSP() },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
      ],
    },
    {
      source: "/api/(.*)",
      headers: [
        { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        { key: "Pragma", value: "no-cache" },
      ],
    },
  ],
};

export default withPWA(config);
