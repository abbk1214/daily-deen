"use client"

import { memo } from "react"
import {
  Check,
  Compass,
  PenLine,
  Plus,
  RefreshCw,
  Settings,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "./dashboard-card"

interface QuickActionsCardProps {
  onRefreshLocation?: () => void
  onRefreshPrayers?: () => void
}

interface QuickAction {
  icon: typeof Check
  label: string
  onClick: () => void
  color?: string
}

export const QuickActionsCard = memo(function QuickActionsCard({
  onRefreshLocation,
  onRefreshPrayers,
}: QuickActionsCardProps) {
  const router = useRouter()

  const actions: QuickAction[] = [
    {
      icon: Compass,
      label: "Qibla",
      onClick: () => {
        document.querySelector<HTMLButtonElement>("[aria-label='Qibla compass']")?.click()
      },
      color: "var(--dd-lantern-gold)",
    },
    {
      icon: PenLine,
      label: "Journal",
      onClick: () => router.push("/journal"),
      color: "var(--dd-dusk-teal)",
    },
    {
      icon: Plus,
      label: "Add Habit",
      onClick: () => router.push("/habits"),
      color: "var(--dd-quiet-sage)",
    },
    {
      icon: RefreshCw,
      label: "Refresh",
      onClick: () => {
        onRefreshLocation?.()
        onRefreshPrayers?.()
      },
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => router.push("/settings"),
    },
  ]

  return (
    <DashboardCard title="Quick Actions" ariaLabel="Quick actions">
      <div className="flex gap-2 flex-wrap">
        {actions.map(({ icon: Icon, label, onClick, color }) => (
          <button
            key={label}
            onClick={onClick}
            aria-label={label}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            style={{
              fontSize: "var(--text-caption)",
              fontWeight: 500,
              minHeight: 40,
            }}
          >
            <Icon
              size={16}
              strokeWidth={1.5}
              style={{ color: color ?? "currentColor" }}
            />
            {label}
          </button>
        ))}
      </div>
    </DashboardCard>
  )
})
