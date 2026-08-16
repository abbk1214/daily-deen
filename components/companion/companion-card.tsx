"use client"

import { memo, useEffect, useState } from "react"
import Link from "next/link"
import { MessageCircle, ChevronRight } from "lucide-react"
import { listConversations } from "@/lib/companion/service"

export const CompanionCard = memo(function CompanionCard() {
  const [hasConversations, setHasConversations] = useState(false)

  useEffect(() => {
    const convs = listConversations()
    setHasConversations(convs.length > 0)
  }, [])

  return (
    <Link
      href="/companion"
      aria-label="Open Deen Guide companion"
      className="flex items-center gap-4 rounded-2xl border border-border bg-card transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      style={{ padding: "var(--space-4)", boxShadow: "var(--shadow-xs)" }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: 44,
          height: 44,
          background: "color-mix(in srgb, var(--dd-dusk-teal) 8%, transparent)",
        }}
      >
        <MessageCircle size={18} className="text-dusk-teal" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
          Deen Guide
        </p>
        <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
          {hasConversations ? "Continue your conversation" : "Your Islamic companion"}
        </p>
      </div>
      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
    </Link>
  )
})
