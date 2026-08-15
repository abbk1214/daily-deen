"use client"

import { memo } from "react"

interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
}

export const ProgressRing = memo(function ProgressRing({
  value,
  max = 100,
  size = 48,
  strokeWidth = 3,
  className = "",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  const offset = circumference - (percent / 100) * circumference

  const color =
    percent >= 80
      ? "var(--dd-quiet-sage)"
      : percent >= 50
        ? "var(--dd-lantern-gold)"
        : "var(--muted-foreground)"

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
      />
    </svg>
  )
})
