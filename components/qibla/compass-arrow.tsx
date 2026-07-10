"use client"

import { memo } from "react"

interface CompassArrowProps {
  qiblaBearing: number
  deviceHeading: number
}

export const CompassArrow = memo(function CompassArrow({
  qiblaBearing,
  deviceHeading,
}: CompassArrowProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ transform: `rotate(${-deviceHeading}deg)` }}
    >
      {/* Kaaba indicator - gold arrow pointing to Qibla */}
      <div
        className="absolute"
        style={{
          transform: `rotate(${qiblaBearing}deg)`,
          transformOrigin: "center",
        }}
      >
        {/* Arrow shaft */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-28 sm:-top-32">
          <div className="w-0.5 h-20 bg-gradient-to-t from-transparent to-[var(--color-lantern)] mx-auto" />
          {/* Arrow head */}
          <div
            className="w-0 h-0 mx-auto"
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "10px solid oklch(0.55 0.14 85)",
            }}
          />
        </div>

        {/* Kaaba icon at center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-lantern)] flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
})
