"use client"

import { memo } from "react"
import {
  Sun,
  Cloud,
  CloudSun,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudFog,
} from "lucide-react"
import { DashboardCard } from "./dashboard-card"
import type { WeatherData } from "@/lib/weather"

function getWeatherIcon(icon: string) {
  switch (icon) {
    case "sun": return Sun
    case "cloud": return Cloud
    case "cloud-sun": return CloudSun
    case "cloud-drizzle": return CloudDrizzle
    case "cloud-rain": return CloudRain
    case "snowflake": return Snowflake
    case "cloud-lightning": return CloudLightning
    case "cloud-fog": return CloudFog
    default: return Cloud
  }
}

interface WeatherCardProps {
  weather: WeatherData | null
  city?: string
  loading?: boolean
}

export const WeatherCard = memo(function WeatherCard({
  weather,
  city,
  loading,
}: WeatherCardProps) {
  if (loading && !weather) {
    return (
      <DashboardCard title="Weather" ariaLabel="Weather loading">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
          <div className="flex flex-col gap-1.5">
            <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </DashboardCard>
    )
  }

  if (!weather) return null

  const Icon = getWeatherIcon(weather.icon)

  return (
    <DashboardCard title="Weather" ariaLabel={`Weather: ${weather.description}`}>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 48,
            height: 48,
            backgroundColor: "var(--muted)",
          }}
        >
          <Icon size={24} strokeWidth={1.5} className="text-foreground" />
        </div>
        <div className="flex flex-col">
          <span
            className="font-mono text-foreground"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-h3)",
              fontWeight: 600,
              lineHeight: "var(--leading-tight)",
            }}
          >
            {weather.temperature}°C
          </span>
          <span
            className="text-muted-foreground"
            style={{ fontSize: "var(--text-caption)" }}
          >
            {weather.description}
            {city ? ` · ${city}` : ""}
          </span>
        </div>
      </div>
    </DashboardCard>
  )
})
