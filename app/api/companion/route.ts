import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/companion/types"

// ─── Rate limiting (in-memory, per-user) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 15 // requests per window

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

// ─── Allowed models (server-side whitelist) ───
const ALLOWED_MODELS: Record<string, string[]> = {
  openai: ["gpt-4o-mini"],
  anthropic: ["claude-3-5-sonnet-20241022"],
}

export async function POST(request: Request) {
  try {
    // ─── Auth check ───
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ─── Rate limit ───
    if (!checkRateLimit(user.id)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 })
    }

    const body = await request.json()
    const { messages, config } = body as {
      messages: { role: string; content: string }[]
      config: { provider?: string; model?: string }
    }

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages" }, { status: 400 })
    }

    // ─── Input validation ───
    const MAX_MESSAGE_LENGTH = 2000
    const MAX_MESSAGES = 20
    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: "Too many messages" }, { status: 400 })
    }
    for (const msg of messages) {
      if (!msg.content || typeof msg.content !== "string") {
        return NextResponse.json({ error: "Invalid message content" }, { status: 400 })
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json({ error: "Message too long" }, { status: 400 })
      }
    }

    // ─── NEVER trust client system prompt — use server-side constant only ───
    const systemPrompt = DEFAULT_SYSTEM_PROMPT

    // ─── Whitelist provider and model ───
    const provider = config?.provider === "anthropic" ? "anthropic" : "openai"
    const allowedModels = ALLOWED_MODELS[provider]
    const model = allowedModels.includes(config?.model || "") ? config.model! : allowedModels[0]

    // ─── Sanitize message roles (prevent system-role injection) ───
    const sanitizedMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }))

    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 })
      }

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...sanitizedMessages,
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })

      if (!res.ok) {
        return NextResponse.json({ error: "AI service error" }, { status: 502 })
      }

      const data = await res.json()
      return NextResponse.json({
        response: data.choices?.[0]?.message?.content || "I couldn't generate a response.",
      })
    }

    if (provider === "anthropic") {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        return NextResponse.json({ error: "Anthropic not configured" }, { status: 503 })
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 300,
          system: systemPrompt,
          messages: sanitizedMessages,
        }),
      })

      if (!res.ok) {
        return NextResponse.json({ error: "AI service error" }, { status: 502 })
      }

      const data = await res.json()
      return NextResponse.json({
        response: data.content?.[0]?.text || "I couldn't generate a response.",
      })
    }

    return NextResponse.json({ error: "AI provider not configured" }, { status: 503 })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
