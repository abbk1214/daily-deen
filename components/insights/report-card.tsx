"use client"

import { memo } from "react"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import type { ReportInsight } from "@/lib/insights/types"

interface ReportCardProps {
  report: ReportInsight
}

export const ReportCard = memo(function ReportCard({
  report,
}: ReportCardProps) {
  const stats = report.metadata.stats
  const period = report.metadata.period

  return (
    <DashboardCard
      title={report.title}
      ariaLabel={report.title}
    >
      <p
        className="text-muted-foreground"
        style={{
          fontSize: 'var(--text-caption)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {report.description}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {stats.prayersTotal !== undefined && (
          <StatItem
            label="Prayers"
            value={`${stats.prayersCompleted}/${stats.prayersTotal}`}
            percent={stats.prayerPercent}
          />
        )}
        {stats.perfectDays !== undefined && (
          <StatItem
            label="Perfect days"
            value={String(stats.perfectDays)}
            percent={Math.round((stats.perfectDays / (period === 'weekly' ? 7 : 30)) * 100)}
          />
        )}
        {stats.journalEntries !== undefined && (
          <StatItem
            label="Journal"
            value={`${stats.journalEntries} entries`}
            percent={Math.round((stats.journalEntries / (period === 'weekly' ? 7 : 30)) * 100)}
          />
        )}
        {stats.quranPages !== undefined && (
          <StatItem
            label="Quran"
            value={`${stats.quranPages} pages`}
            percent={Math.min(100, Math.round((stats.quranPages / (period === 'weekly' ? 21 : 90)) * 100))}
          />
        )}
        {stats.habitsCompleted !== undefined && (
          <StatItem
            label="Habits"
            value={`${stats.habitsCompleted} completed`}
            percent={0}
          />
        )}
        {stats.waterGlasses !== undefined && (
          <StatItem
            label="Water"
            value={`${stats.waterGlasses} glasses`}
            percent={Math.min(100, Math.round((stats.waterGlasses / (period === 'weekly' ? 56 : 240)) * 100))}
          />
        )}
      </div>
    </DashboardCard>
  )
})

function StatItem({
  label,
  value,
  percent,
}: {
  label: string
  value: string
  percent: number
}) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
      <div className="flex items-center justify-between">
        <span
          className="text-muted-foreground"
          style={{ fontSize: 'var(--text-caption)' }}
        >
          {label}
        </span>
        <span
          className="text-foreground"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono-sm)',
            fontWeight: 500,
          }}
        >
          {value}
        </span>
      </div>
      {percent > 0 && (
        <div
          className="w-full rounded-full"
          style={{
            height: 3,
            background: 'var(--muted)',
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percent}%`,
              background: percent >= 80
                ? 'var(--dd-quiet-sage)'
                : percent >= 50
                  ? 'var(--dd-lantern-gold)'
                  : 'var(--muted-foreground)',
            }}
          />
        </div>
      )}
    </div>
  )
}
