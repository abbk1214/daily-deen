"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

interface SuccessToastProps {
  message: string
  duration?: number
  onDone?: () => void
}

export function SuccessToast({ message, duration = 2500, onDone }: SuccessToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onDone])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 animate-[slideUp_0.3s_ease-out]"
      style={{
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <div className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 shadow-lg">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
          <Check size={12} strokeWidth={2.5} className="text-white" />
        </div>
        <span className="text-white whitespace-nowrap" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
          {message}
        </span>
      </div>
    </div>
  )
}
