"use client"

import { memo, useMemo } from "react"
import type { DailyStats } from "@/lib/prayer/statistics"

interface BarChartProps {
  data: DailyStats[]
  height?: number
  label?: string
}

interface LineChartProps {
  values: number[]
  labels: string[]
  height?: number
  color?: string
  label?: string
}

interface DonutChartProps {
  completed: number
  total: number
  size?: number
  label?: string
}

export const BarChart = memo(function BarChart({ data, height = 120, label }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.total), 1)

  return (
    <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
      {label && (
        <h3
          className="text-foreground"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            marginBottom: 'var(--space-3)',
          }}
        >
          {label}
        </h3>
      )}
      <svg
        role="img"
        aria-label={label || 'Bar chart'}
        viewBox={`0 0 ${data.length * 20} ${height}`}
        style={{ width: '100%', height: `${height}px` }}
      >
        {data.map((d, i) => {
          const barHeight = (d.completed / maxVal) * (height - 20)
          const x = i * 20 + 4
          const y = height - barHeight - 10
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={12}
                height={barHeight}
                rx={2}
                fill="var(--dd-lantern-gold)"
                opacity={0.85}
              />
              {d.percent > 0 && (
                <text
                  x={x + 6}
                  y={y - 4}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                >
                  {d.percent}%
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
})

export const LineChart = memo(function LineChart({
  values,
  labels,
  height = 120,
  color = 'var(--dd-lantern-gold)',
  label,
}: LineChartProps) {
  const maxVal = Math.max(...values, 1)
  const padding = 10

  const points = useMemo(() => {
    return values.map((v, i) => {
      const x = padding + (i / (values.length - 1 || 1)) * (100 - padding * 2)
      const y = padding + (1 - v / maxVal) * (height - padding * 2)
      return { x, y, value: v, label: labels[i] }
    })
  }, [values, labels, maxVal, height])

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="rounded-lg border border-border bg-card" style={{ padding: 'var(--space-4)' }}>
      {label && (
        <h3
          className="text-foreground"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-body)',
            fontWeight: 600,
            marginBottom: 'var(--space-3)',
          }}
        >
          {label}
        </h3>
      )}
      <svg
        role="img"
        aria-label={label || 'Line chart'}
        viewBox={`0 0 100 ${height}`}
        style={{ width: '100%', height: `${height}px` }}
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill={color}
            aria-label={`${labels[i]}: ${p.value}%`}
          />
        ))}
      </svg>
    </div>
  )
})

export const DonutChart = memo(function DonutChart({
  completed,
  total,
  size = 80,
  label,
}: DonutChartProps) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const percent = total > 0 ? completed / total : 0
  const dashOffset = circumference * (1 - percent)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        role="img"
        aria-label={label || `${completed} of ${total}`}
        width={size}
        height={size}
        viewBox="0 0 80 80"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="var(--dd-lantern-gold)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
        <text
          x="40"
          y="40"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--foreground)"
          fontSize="16"
          fontFamily="var(--font-mono)"
          fontWeight="600"
        >
          {Math.round(percent * 100)}%
        </text>
      </svg>
      {label && (
        <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
          {label}
        </span>
      )}
    </div>
  )
})
