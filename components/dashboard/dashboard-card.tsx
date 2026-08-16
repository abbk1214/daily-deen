"use client"

import { memo, type ReactNode } from "react"

interface DashboardCardProps {
  title: string
  children: ReactNode
  className?: string
  action?: ReactNode
  ariaLabel?: string
}

export const DashboardCard = memo(function DashboardCard({
  title,
  children,
  className = "",
  action,
  ariaLabel,
}: DashboardCardProps) {
  return (
    <section
      role="region"
      aria-label={ariaLabel || title}
      className={`rounded-2xl border border-border bg-card ${className}`}
      style={{
        padding: "var(--space-5)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
        <h2
          className="text-muted-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-body-sm)",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
})
