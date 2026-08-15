"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 800, className = "" }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const fromRef = useRef(0)

  useEffect(() => {
    fromRef.current = display
    startRef.current = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(fromRef.current + (value - fromRef.current) * eased)
      setDisplay(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </span>
  )
}
