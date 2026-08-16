import { NextResponse } from "next/server"
import type { CompanionConfig } from "@/lib/companion/types"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/companion/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, config } = body as {
      messages: { role: string; content: string }[]
      config: CompanionConfig
    }

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages" }, { status: 400 })
    }

    // Validate message content lengths
    const MAX_MESSAGE_LENGTH = 4000
    const MAX_MESSAGES = 50
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

    const systemPrompt = config.systemPrompt || DEFAULT_SYSTEM_PROMPT
    const provider = config.provider || "openai"

    // Use server-side environment variables for API keys — never accept from client
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
          model: config.model || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })

      if (!res.ok) {
        return NextResponse.json({ error: "OpenAI API error" }, { status: 502 })
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
          model: config.model || "claude-3-5-sonnet-20241022",
          max_tokens: 300,
          system: systemPrompt,
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      })

      if (!res.ok) {
        return NextResponse.json({ error: "Anthropic API error" }, { status: 502 })
      }

      const data = await res.json()
      return NextResponse.json({
        response: data.content?.[0]?.text || "I couldn't generate a response.",
      })
    }

    // Fallback: no provider configured
    return NextResponse.json({
      response: "AI provider not configured. Using local responses.",
    })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
