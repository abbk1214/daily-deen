"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getSettings, type AppSettings } from "@/lib/db";
import { formatTimeFromMinutes, getToday } from "@/lib/utils";

interface OfflineData {
  settings: AppSettings | null;
  prayerTimes: { name: string; time: string }[];
  hijriDate: string;
}

async function loadOfflineData(): Promise<OfflineData> {
  const settings = await getSettings();
  const today = getToday();

  let prayerTimes: { name: string; time: string }[] = [];
  if (settings.latitude !== 0 && settings.longitude !== 0) {
    try {
      const { getPrayerTimes } = await import("@/lib/prayer/service");
      const times = getPrayerTimes({
        date: new Date(),
        latitude: settings.latitude,
        longitude: settings.longitude,
        timezone: settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        method: settings.calculationMethod,
        school: settings.school,
        adjustments: settings.prayerAdjustments,
      });
      prayerTimes = [
        { name: "Fajr", time: formatTimeFromMinutes(times.fajr) },
        { name: "Sunrise", time: formatTimeFromMinutes(times.sunrise) },
        { name: "Dhuhr", time: formatTimeFromMinutes(times.dhuhr) },
        { name: "Asr", time: formatTimeFromMinutes(times.asr) },
        { name: "Maghrib", time: formatTimeFromMinutes(times.maghrib) },
        { name: "Isha", time: formatTimeFromMinutes(times.isha) },
      ];
    } catch {}
  }

  let hijriDate = "";
  try {
    const { formatHijriDate } = await import("@/lib/hijri-date");
    hijriDate = formatHijriDate(today);
  } catch {}

  return { settings, prayerTimes, hijriDate };
}

export default function OfflinePage() {
  const [data, setData] = useState<OfflineData | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadOfflineData().then((d) => {
      if (mountedRef.current) setData(d);
    });
    return () => { mountedRef.current = false; };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-6 text-center font-sans">
      <div className="flex flex-col items-center gap-6 max-w-md pt-24">
        <h1
          className="font-display text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          You&apos;re Offline
        </h1>

        {data?.hijriDate && (
          <p
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            {data.hijriDate}
          </p>
        )}

        {data?.settings && data.settings.city && (
          <p
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            {data.settings.city}, {data.settings.country}
          </p>
        )}

        {data && data.prayerTimes.length > 0 && (
          <div
            className="w-full rounded-lg border border-border bg-card"
            style={{ padding: "var(--space-4)" }}
          >
            <h2
              className="text-muted-foreground mb-3"
              style={{
                fontSize: "var(--text-caption)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              TODAY&apos;S PRAYERS
            </h2>
            <div className="flex flex-col gap-2">
              {data.prayerTimes.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between"
                >
                  <span
                    className="text-foreground"
                    style={{
                      fontSize: "var(--text-body-sm)",
                      fontWeight: 500,
                    }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="font-mono text-muted-foreground"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-body-sm)",
                    }}
                  >
                    {p.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-body-sm)",
            lineHeight: "var(--leading-body)",
          }}
        >
          Showing cached data. Connect to the internet for updates.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{
            fontSize: "var(--text-body)",
            fontWeight: 500,
          }}
        >
          <RefreshCw size={16} strokeWidth={1.5} />
          Retry Connection
        </button>
      </div>
    </div>
  );
}
