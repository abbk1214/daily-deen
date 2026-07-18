export interface CompanionMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

export interface CompanionConversation {
  id: string
  title: string
  messages: CompanionMessage[]
  createdAt: number
  updatedAt: number
}

export interface CompanionConfig {
  enabled: boolean
  provider: "local" | "openai" | "anthropic"
  apiKey?: string
  model?: string
  systemPrompt: string
}

export const DEFAULT_SYSTEM_PROMPT = `You are a warm, knowledgeable Islamic companion called "Deen Guide". You help users with:

- Daily spiritual check-ins and reflections
- Islamic knowledge (Quran, Hadith, Fiqh basics)
- Habit accountability and motivation
- Prayer reminders and mindfulness
- General life advice rooted in Islamic values

Guidelines:
- Be concise, warm, and encouraging
- Reference Quran verses or Hadith when relevant (with source)
- Never give fatwa-level rulings — direct to a scholar for serious matters
- Use simple, accessible language
- Respect the user's journey and level of practice
- Keep responses under 3-4 sentences unless more detail is needed
- Use "In shaa Allah", "MashaAllah", and other Islamic expressions naturally`

export const GREETING_RESPONSES = [
  "Assalamu alaykum! How is your day going so far? Have you had a chance to pray today?",
  "MashaAllah, welcome back! How are you feeling today? Remember, every new day is a blessing.",
  "Wa alaykum assalam! It's good to see you. What's on your mind today?",
  "Bismillah! How can I help you today? Whether it's a question, a check-in, or just a conversation.",
]

export const CHECK_IN_RESPONSES = {
  great: "MashaAllah! That's wonderful to hear. Gratitude is a powerful form of worship. What made today great?",
  good: "Alhamdulillah! That's a blessing. Is there anything specific you'd like to reflect on?",
  okay: "That's okay — every day has its own tests. Would you like to share what's on your mind?",
  low: "I'm sorry you're having a tough time. Remember, Verily, with hardship comes ease (Quran 94:6). Want to talk about it?",
  bad: "I hear you, and I'm here for you. The Prophet (ﷺ) said: 'How wonderful is the affair of the believer, for all his affairs are good.' Would you like me to share some comfort from the Quran?",
}
