"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { ChatBubble } from "./chat-bubble"
import { ChatInput } from "./chat-input"
import {
  createConversation,
  listConversations,
  getConversation,
  addMessage,
  generateResponse,
  deleteConversation,
} from "@/lib/companion/service"
import type { CompanionConversation } from "@/lib/companion/types"

export function CompanionPanel() {
  const [conversations, setConversations] = useState<CompanionConversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = activeId ? getConversation(activeId) : null

  useEffect(() => {
    queueMicrotask(() => {
      setConversations(listConversations())
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages.length])

  const handleNew = useCallback(() => {
    const conv = createConversation()
    setConversations(listConversations())
    setActiveId(conv.id)
  }, [])

  const handleSend = useCallback(async (content: string) => {
    if (!activeId) return

    addMessage(activeId, "user", content)
    setConversations(listConversations())
    setIsLoading(true)

    try {
      const response = await generateResponse(activeId, content)
      addMessage(activeId, "assistant", response)
    } catch {
      addMessage(activeId, "assistant", "I'm sorry, I couldn't process that. Could you try again?")
    }

    setConversations(listConversations())
    setIsLoading(false)
  }, [activeId])

  const handleDelete = useCallback((id: string) => {
    deleteConversation(id)
    setConversations(listConversations())
    if (activeId === id) setActiveId(null)
  }, [activeId])

  const handleBack = useCallback(() => {
    setActiveId(null)
  }, [])

  // Conversation list view
  if (!activeId) {
    return (
      <div className="flex min-h-dvh flex-col">
        <header
          className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
          style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}
        >
          <Link
            href="/"
            aria-label="Back to home"
            className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </Link>
          <h1
            className="ml-3 text-foreground"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h5)", fontWeight: 600 }}
          >
            Deen Guide
          </h1>
          <button
            type="button"
            onClick={handleNew}
            aria-label="New conversation"
            className="ml-auto flex h-9 items-center gap-1.5 rounded-md px-2.5 text-foreground transition-colors hover:bg-secondary"
            style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
          >
            <Plus size={16} strokeWidth={1.5} />
            <span className="hidden sm:inline">New</span>
          </button>
        </header>

        <main className="flex-1 pb-24 lg:pb-8">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dusk-teal/10 mb-4">
                <span className="text-2xl">Deen</span>
              </div>
              <p className="text-foreground mb-1" style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
                Welcome to Deen Guide
              </p>
              <p className="text-muted-foreground mb-6" style={{ fontSize: "var(--text-body-sm)" }}>
                Your Islamic companion for daily check-ins, reflections, and knowledge.
              </p>
              <button
                type="button"
                onClick={handleNew}
                className="rounded-xl bg-dusk-teal px-6 py-3 text-white transition-colors hover:opacity-90"
                style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
              >
                Start a Conversation
              </button>
            </div>
          ) : (
            <ul aria-label="Conversations" className="flex flex-col">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <div className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary">
                    <button
                      type="button"
                      onClick={() => setActiveId(conv.id)}
                      className="flex-1 text-left"
                    >
                      <p className="text-foreground truncate" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
                        {conv.title}
                      </p>
                      <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
                        {conv.messages.length} messages · {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(conv.id)}
                      aria-label="Delete conversation"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    )
  }

  // Active conversation view
  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{ height: "var(--space-12)", padding: "var(--space-3) var(--space-5)" }}
      >
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to conversations"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div className="ml-3 flex-1 min-w-0">
          <h1
            className="text-foreground truncate"
            style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h5)", fontWeight: 600 }}
          >
            Deen Guide
          </h1>
          <p className="text-muted-foreground truncate" style={{ fontSize: "var(--text-caption)" }}>
            {activeConversation?.title}
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          aria-label="New conversation"
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary"
        >
          <Plus size={18} strokeWidth={1.5} />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-auto px-4 py-4" style={{ paddingBottom: "100px" }}>
        {activeConversation?.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground mb-1" style={{ fontSize: "var(--text-body-sm)" }}>
              Assalamu alaykum! I&apos;m your Deen Guide.
            </p>
            <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
              Ask me anything about your spiritual journey, or just check in.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-4" role="log" aria-live="polite" aria-label="Chat messages">
          {activeConversation?.messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex gap-3" role="status" aria-live="polite" aria-label="Companion is thinking">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <span className="text-xs">AI</span>
              </div>
              <div className="rounded-2xl bg-card border border-border px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
