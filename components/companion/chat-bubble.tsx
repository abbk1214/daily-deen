"use client"

import { memo } from "react"
import { User, Bot } from "lucide-react"
import type { CompanionMessage } from "@/lib/companion/types"

interface ChatBubbleProps {
  message: CompanionMessage
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export const ChatBubble = memo(function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      role="article"
      aria-label={`${isUser ? "You" : "Companion"} said`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-dusk-teal text-white"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        {isUser ? <User size={14} strokeWidth={1.5} /> : <Bot size={14} strokeWidth={1.5} />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-dusk-teal text-white"
            : "bg-card border border-border text-foreground"
        }`}
        style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.6 }}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={`mt-1 ${isUser ? "text-white/60" : "text-muted-foreground"}`}
          style={{ fontSize: "var(--text-caption)" }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
})
