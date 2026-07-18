"use client"

import { memo } from "react"
import { Moon, Star } from "lucide-react"
import type { SeasonalConfig } from "@/lib/seasonal/types"

interface RamadanBannerProps {
  config: SeasonalConfig
}

export const RamadanBanner = memo(function RamadanBanner({
  config,
}: RamadanBannerProps) {
  if (!config.isActive || (config.mode !== 'ramadan' && config.mode !== 'last-ten-nights')) {
    return null
  }

  const isLaylatulQadr = config.mode === 'last-ten-nights'

  return (
    <section
      aria-label="Ramadan mode"
      className="rounded-2xl border p-4"
      style={{
        borderColor: 'var(--dd-lantern-gold)',
        background: 'linear-gradient(135deg, oklch(0.25 0.02 80 / 0.05), oklch(0.76 0.14 85 / 0.08))',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 44,
            height: 44,
            backgroundColor: 'var(--dd-lantern-gold)',
            color: 'white',
          }}
        >
          {isLaylatulQadr ? <Star size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </div>
        <div className="flex-1">
          <h2
            className="text-foreground"
            style={{
              fontSize: 'var(--text-body)',
              fontWeight: 600,
            }}
          >
            {isLaylatulQadr ? 'Laylatul Qadr' : 'Ramadan Mubarak'}
          </h2>
          <p
            className="text-muted-foreground"
            style={{ fontSize: 'var(--text-caption)' }}
          >
            {isLaylatulQadr
              ? `Night ${config.hijriDay - 20} of the last 10 nights`
              : `Day ${config.hijriDay} — ${config.daysRemaining} days remaining`}
          </p>
        </div>
      </div>
    </section>
  )
})
