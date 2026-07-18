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

    const systemPrompt = config.systemPrompt || DEFAULT_SYSTEM_PROMPT

    if (config.provider === "openai" && config.apiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
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

    if (config.provider === "anthropic" && config.apiKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
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
