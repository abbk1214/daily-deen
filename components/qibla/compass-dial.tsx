"use client"

import { memo } from "react"
import { CARDINAL_DIRECTIONS } from "@/lib/qibla/constants"

interface CompassDialProps {
  heading: number
  showDegrees: boolean
}

export const CompassDial = memo(function CompassDial({ heading, showDegrees }: CompassDialProps) {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80">
      {/* Outer ring — counter-rotate so north always points up visually */}
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full"
        style={{ transform: `rotate(${-heading}deg)` }}
      >
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[var(--color-stone-300)] dark:text-[var(--color-stone-700)]"
        />

        {/* Tick marks */}
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = i * 5
          const isCardinal = angle % 90 === 0
          const isMajor = angle % 30 === 0
          const length = isCardinal ? 12 : isMajor ? 8 : 4
          const r1 = 150 - length
          const r2 = 150
          const rad = (angle - 90) * (Math.PI / 180)
          return (
            <line
              key={i}
              x1={160 + r1 * Math.cos(rad)}
              y1={160 + r1 * Math.sin(rad)}
              x2={160 + r2 * Math.cos(rad)}
              y2={160 + r2 * Math.sin(rad)}
              stroke="currentColor"
              strokeWidth={isCardinal ? 2 : isMajor ? 1.5 : 0.5}
              className={
                isCardinal
                  ? "text-[var(--color-ink)] dark:text-[var(--color-parchment)]"
                  : "text-[var(--color-stone-400)] dark:text-[var(--color-stone-600)]"
              }
            />
          )
        })}

        {/* Cardinal labels */}
        {CARDINAL_DIRECTIONS.map(({ angle, label }) => {
          const rad = (angle - 90) * (Math.PI / 180)
          const r = 130
          const isNorth = label === "N"
          return (
            <text
              key={label}
              x={160 + r * Math.cos(rad)}
              y={160 + r * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="central"
              className={`text-xs font-medium ${
                isNorth
                  ? "fill-[var(--color-lantern)] dark:fill-[var(--color-lantern)]"
                  : "fill-[var(--color-stone-500)] dark:fill-[var(--color-stone-400)]"
              }`}
            >
              {label}
            </text>
          )
        })}

        {/* Degree ticks every 30° */}
        {showDegrees &&
          [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle - 90) * (Math.PI / 180)
            const r = 118
            return (
              <text
                key={`deg-${angle}`}
                x={160 + r * Math.cos(rad)}
                y={160 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[8px] fill-[var(--color-stone-400)] dark:fill-[var(--color-stone-500)]"
              >
                {angle}°
              </text>
            )
          })}
      </svg>
    </div>
  )
})
