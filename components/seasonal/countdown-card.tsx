"use client"

import { memo, useEffect, useState } from "react"
import { Sunrise, Sunset } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/dashboard-card"

interface CountdownCardProps {
  type: 'suhoor' | 'iftar'
  targetTime: string
}

export const CountdownCard = memo(function CountdownCard({
  type,
  targetTime,
}: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const [hours, minutes] = targetTime.split(':').map(Number)
      const target = new Date()
      target.setHours(hours, minutes, 0, 0)

      if (target < now) {
        setIsPast(true)
        setTimeLeft(type === 'iftar' ? 'Iftar time has passed' : 'Suhoor time has passed')
        return
      }

      const diff = target.getTime() - now.getTime()
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)

      if (h > 0) {
        setTimeLeft(`${h}h ${m}m ${s}s`)
      } else if (m > 0) {
        setTimeLeft(`${m}m ${s}s`)
      } else {
        setTimeLeft(`${s}s`)
      }
      setIsPast(false)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetTime, type])

  const Icon = type === 'suhoor' ? Sunrise : Sunset
  const label = type === 'suhoor' ? 'Suhoor' : 'Iftar'

  return (
    <DashboardCard title={label} ariaLabel={`${label} countdown`}>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 40,
            height: 40,
            backgroundColor: type === 'iftar' ? 'var(--dd-lantern-gold)' : 'var(--dd-dusk-teal)',
            color: 'white',
          }}
        >
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div>
          <p
            className="text-foreground"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-body)',
              fontWeight: 600,
            }}
          >
            {isPast ? '—' : timeLeft}
          </p>
          <p
            className="text-muted-foreground"
            style={{ fontSize: 'var(--text-caption)' }}
          >
            {isPast ? '' : `Until ${label}`}
          </p>
        </div>
      </div>
    </DashboardCard>
  )
})
