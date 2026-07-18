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
      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dusk-teal/10">
        <MessageCircle size={20} className="text-dusk-teal" strokeWidth={1.5} />
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
