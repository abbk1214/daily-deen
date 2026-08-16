"use client"

import { memo } from "react"
import { MapPin, Wifi, WifiOff, Clock } from "lucide-react"

interface DateHeaderProps {
  hijriDate: string | null
  gregorianDate: string
  city: string
  country: string
  isOnline: boolean
  lastSync?: number
}

export const DateHeader = memo(function DateHeader({
  hijriDate,
  gregorianDate,
  city,
  country,
  isOnline,
  lastSync,
}: DateHeaderProps) {
  const lastSyncStr = lastSync
    ? new Date(lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
      {/* Hijri date — prominent, editorial */}
      {hijriDate && (
        <p
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h2)",
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {hijriDate}
        </p>
      )}

      {/* Gregorian date — refined, smaller */}
      <p
        className="text-muted-foreground"
        style={{
          fontSize: "var(--text-body-sm)",
          fontWeight: 400,
          letterSpacing: "var(--tracking-wide)",
        }}
      >
        {gregorianDate}
      </p>

      {/* Location + status row — compact metadata */}
      <div
        className="flex items-center flex-wrap"
        style={{ gap: "var(--space-3)", marginTop: "var(--space-1)" }}
      >
        {city && (
          <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            <MapPin size={11} strokeWidth={1.5} />
            {city}{country ? `, ${country}` : ""}
          </span>
        )}
        <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          {isOnline ? (
            <>
              <Wifi size={11} strokeWidth={1.5} />
              Online
            </>
          ) : (
            <>
              <WifiOff size={11} strokeWidth={1.5} />
              Offline
            </>
          )}
        </span>
        {lastSyncStr && (
          <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            <Clock size={11} strokeWidth={1.5} />
            Last sync {lastSyncStr}
          </span>
        )}
      </div>
    </div>
  )
})
