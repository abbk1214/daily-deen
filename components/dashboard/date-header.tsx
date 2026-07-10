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
    <div className="flex flex-col gap-3">
      {/* Date row */}
      <div className="flex items-baseline gap-3 flex-wrap">
        {hijriDate && (
          <span
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-body)",
              fontWeight: 600,
            }}
          >
            {hijriDate}
          </span>
        )}
        <span
          className="text-muted-foreground"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          {gregorianDate}
        </span>
      </div>

      {/* Location + status row */}
      <div className="flex items-center gap-3 flex-wrap">
        {city && (
          <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            <MapPin size={12} strokeWidth={1.5} />
            {city}{country ? `, ${country}` : ""}
          </span>
        )}
        <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
          {isOnline ? (
            <>
              <Wifi size={12} strokeWidth={1.5} />
              Online
            </>
          ) : (
            <>
              <WifiOff size={12} strokeWidth={1.5} />
              Offline
            </>
          )}
        </span>
        {lastSyncStr && (
          <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
            <Clock size={12} strokeWidth={1.5} />
            Last sync {lastSyncStr}
          </span>
        )}
      </div>
    </div>
  )
})
