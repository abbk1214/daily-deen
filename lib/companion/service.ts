import type {
  CompanionMessage,
  CompanionConversation,
  CompanionConfig,
} from "./types"
import { DEFAULT_SYSTEM_PROMPT, GREETING_RESPONSES, CHECK_IN_RESPONSES } from "./types"

const STORAGE_PREFIX = "companion"
const MAX_MESSAGES_PER_CONVERSATION = 100

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getConversations(): CompanionConversation[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:conversations`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveConversations(convs: CompanionConversation[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:conversations`, JSON.stringify(convs))
  } catch {
    // Storage full
  }
}

function getConfig(): CompanionConfig {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:config`)
    return raw ? JSON.parse(raw) : {
      enabled: true,
      provider: "local",
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
    }
  } catch {
    return {
      enabled: true,
      provider: "local",
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
    }
  }
}

export function saveConfig(config: CompanionConfig): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:config`, JSON.stringify(config))
  } catch {
    // Storage full
  }
}

export function createConversation(): CompanionConversation {
  const conv: CompanionConversation = {
    id: generateId(),
    title: "New Conversation",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const convs = getConversations()
  convs.unshift(conv)
  saveConversations(convs)
  return conv
}

export function getConversation(id: string): CompanionConversation | undefined {
  return getConversations().find((c) => c.id === id)
}

export function listConversations(): CompanionConversation[] {
  return getConversations()
}

export function deleteConversation(id: string): void {
  const convs = getConversations().filter((c) => c.id !== id)
  saveConversations(convs)
}

export function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): CompanionMessage {
  const convs = getConversations()
  const conv = convs.find((c) => c.id === conversationId)
  if (!conv) throw new Error("Conversation not found")

  const msg: CompanionMessage = {
    id: generateId(),
    role,
    content,
    timestamp: Date.now(),
  }

  conv.messages.push(msg)
  if (conv.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
    conv.messages = conv.messages.slice(-MAX_MESSAGES_PER_CONVERSATION)
  }

  // Update title from first user message
  if (role === "user" && conv.messages.filter((m) => m.role === "user").length === 1) {
    conv.title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
  }

  conv.updatedAt = Date.now()
  saveConversations(convs)
  return msg
}

/**
 * Generate a response. In "local" mode, uses pattern matching for common
 * Islamic topics. In "openai"/"anthropic" mode, delegates to the API route.
 */
export async function generateResponse(
  conversationId: string,
  userMessage: string,
): Promise<string> {
  const config = getConfig()

  if (config.provider === "local") {
    return generateLocalResponse(userMessage)
  }

  // For cloud providers, call the API route
  const conv = getConversation(conversationId)
  if (!conv) return "I couldn't find our conversation. Could you start fresh?"

  try {
    const res = await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conv.messages.slice(-20).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        config,
      }),
    })

    if (!res.ok) throw new Error("API error")
    const data = await res.json()
    return data.response || "I'm not sure how to respond to that."
  } catch {
    return generateLocalResponse(userMessage)
  }
}

function generateLocalResponse(message: string): string {
  const lower = message.toLowerCase()

  // Greetings
  if (/^(assalam|salam|hello|hi|hey)/i.test(lower)) {
    return GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)]
  }

  // Check-in responses
  if (/feeling.*(great|good|amazing|wonderful|mashaall)/i.test(lower)) {
    return CHECK_IN_RESPONSES.great
  }
  if (/feeling.*(good|fine|alright|okay|not bad)/i.test(lower)) {
    return CHECK_IN_RESPONSES.good
  }
  if (/feeling.*(okay|average|meh|so-so)/i.test(lower)) {
    return CHECK_IN_RESPONSES.okay
  }
  if (/feeling.*(low|tired|sad|down|stressed)/i.test(lower)) {
    return CHECK_IN_RESPONSES.low
  }
  if (/feeling.*(bad|terrible|awful|depressed|anxious)/i.test(lower)) {
    return CHECK_IN_RESPONSES.bad
  }

  // Prayer-related
  if (/prayer|salah|salat|pray/i.test(lower)) {
    const responses = [
      "Prayer is the cornerstone of our day. The Prophet (ﷺ) said: 'The first matter that the servant will be brought to account for on the Day of Judgment is his prayers.' (Tirmidhi) Have you prayed today?",
      "Establishing prayer on time brings barakah to your day. Which prayer are you thinking about?",
      "If you've missed any prayers, don't worry — start fresh with the next one. Allah's mercy is vast.",
      "The Prophet (ﷺ) used to say to Bilal: 'Relieve us with the adhan, O Bilal.' Prayer was a joy, not a burden. How can I help you with yours?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Quran-related
  if (/quran|koran|qur'an|recit|read.*quran|memoriz|hifz/i.test(lower)) {
    const responses = [
      "The Quran is a healing for what is in the hearts. Allah says: 'And We send down of the Quran that which is a healing and a mercy.' (17:82) How is your recitation going?",
      "Even one ayah a day is a beautiful start. The Prophet (ﷺ) said: 'The one who is proficient with the Quran will be with the noble angels.' (Bukhari) Would you like to continue reading?",
      "Reading Quran with reflection (tadabbur) transforms the heart. Take your time with each ayah. What surah are you reading?",
      "MashaAllah! Consistency with the Quran is key. Even a few minutes after each prayer adds up beautifully.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Hadith-related
  if (/hadith|sunnah|prophet.*said|rasul/i.test(lower)) {
    const responses = [
      "The Prophet (ﷺ) said: 'The best of you are those who learn the Quran and teach it.' (Bukhari) Is there a specific hadith topic you're interested in?",
      "The Sunnah is our guide alongside the Quran. Would you like to discuss a particular aspect of the Prophet's practice?",
      "Learning the Prophet's way is a lifelong journey. What aspect of his life would you like to reflect on today?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Dua/supplication
  if (/dua|supplicat|ask.*all|pray.*for|make.*dua/i.test(lower)) {
    const responses = [
      "Dua is one of the most powerful forms of worship. The Prophet (ﷺ) said: 'The supplication of a Muslim for his brother in his absence is answered.' (Muslim) Would you like me to share some duas?",
      "Allah loves to be asked. 'And your Lord says: Call upon Me; I will respond to you.' (40:60) What would you like to make dua about?",
      "Never underestimate the power of your dua, even if it seems small. Every sincere call is heard.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Dhikr/remembrance
  if (/dhikr|rememb|tasbih|subhan|alhamd|allahu|astaghfir/i.test(lower)) {
    const responses = [
      "Dhikr is the polish of the heart. 'Verily, in the remembrance of Allah do hearts find rest.' (13:28) Would you like to do some dhikr together?",
      "The Prophet (ﷺ) said: 'Shall I not tell you of the best of your deeds, the purest in the sight of your Lord, and that which raises your ranks more?' They said: 'Yes, O Messenger of Allah.' He said: 'It is dhikr of Allah.' (Tirmidhi)",
      "Even saying 'SubhanAllah' and 'Alhamdulillah' throughout your day transforms your state. How is your dhikr practice?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Fasting
  if (/fast|sawm|ramadan|roza/i.test(lower)) {
    const responses = [
      "Fasting is a shield and a means of taqwa. The Prophet (ﷺ) said: 'Whoever fasts during Ramadan out of sincere faith and hoping for reward, all his past sins will be forgiven.' (Bukhari) Are you thinking about voluntary fasts?",
      "Monday and Thursday are recommended days for fasting. Even one day of fasting brings you closer to Allah.",
      "Fasting teaches patience and gratitude. How has fasting been for you recently?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Zakat/charity
  if (/zakat|charit|sadaqah|give|donate|wealth/i.test(lower)) {
    const responses = [
      "Charity does not decrease wealth. The Prophet (ﷺ) said: 'No Muslim ever plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, but it is regarded as a charitable gift for him.' (Bukhari) How can you give today?",
      "Zakat purifies our wealth and blessings. Have you calculated your zakat recently?",
      "Even a smile is charity. The Prophet (ﷺ said: 'Every good deed is charity.' (Bukhari) What kind of giving are you reflecting on?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Habit/accountability
  if (/habit|routine|consist|streak|disciplin|goal|improve/i.test(lower)) {
    const responses = [
      "Consistency is key! The Prophet (ﷺ) said: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.' (Bukhari) What habit are you working on?",
      "Building good habits is a form of jihad an-nafs (struggle against the self). Be patient with yourself — progress over perfection.",
      "MashaAllah that you're thinking about improvement! What's one small step you can take today?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Mood/emotional support
  if (/sad|depressed|anxious|worried|stressed|overwhelm|lonely|hurt/i.test(lower)) {
    const responses = [
      "I hear you, and your feelings are valid. Allah says: 'Verily, with hardship comes ease.' (94:6) — and this ease is promised, not just possible. Would you like to talk about what's weighing on you?",
      "The Prophet (ﷺ) himself experienced moments of sadness. You're not alone in this. 'And We have not sent you, [O Muhammad], except as a mercy to the worlds.' (21:107) — including you, right now.",
      "Take a deep breath. Say 'Hasbunallahu wa ni'mal wakil' — Allah is sufficient for us and the best Disposer of affairs. This too shall pass.",
      "It's okay to feel this way. Islam doesn't ask us to suppress emotions — the Prophet (ﷺ) wept. Would you like me to share a comforting verse or dua?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Gratitude/thankful
  if (/thank|grateful|alhamdulillah|bless|gratitud/i.test(lower)) {
    const responses = [
      "Alhamdulillah! Gratitude is worship itself. Allah says: 'If you are grateful, I will surely increase you.' (14:7) What are you grateful for today?",
      "MashaAllah, a grateful heart is a sign of faith. Even counting your blessings is a form of dhikr.",
      "The Prophet (ﷺ) would pray at night until his feet would swell, and when asked why, he said: 'Should I not be a grateful servant?' (Bukhari) Your gratitude is beautiful.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Generic Islamic encouragement
  if (/islam|muslim|deen|faith|iman|belief/i.test(lower)) {
    const responses = [
      "Your deen is your compass. 'Indeed, Allah is the only One worthy of worship.' (3:62) How can I help you strengthen your practice today?",
      "Being Muslim is a journey, not a destination. Every step counts, no matter how small. What would you like to work on?",
      "The beauty of Islam is that it encompasses every aspect of life. What part of your deen would you like to explore?",
    ]
  }

  // Default responses
  const defaults = [
    "That's a great question. I'm here to help with spiritual check-ins, Islamic knowledge, and daily reflections. Could you tell me more about what you're looking for?",
    "I appreciate you sharing. In Islam, every conversation is a chance to learn and grow. What would you like to explore together?",
    "JazakAllahu khairan for reaching out. How can I support you in your spiritual journey today?",
    "That's an interesting thought. The Prophet (ﷺ) said: 'Seek knowledge from the cradle to the grave.' What aspect of knowledge or practice are you curious about?",
  ]
  return defaults[Math.floor(Math.random() * defaults.length)]
}

export function getConfig_(): CompanionConfig {
  return getConfig()
}
