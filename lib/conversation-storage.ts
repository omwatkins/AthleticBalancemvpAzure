import type { Message } from "@/lib/types"
import { createClient } from "@/lib/azure/client"

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  settings: {
    systemPrompt: string
    model: string
    temperature: number
    maxTokens: number
  }
}

const STORAGE_KEY = "chatbot-conversations"
const CURRENT_CONVERSATION_KEY = "current-conversation-id"

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch (error) {
    console.error("Failed to save conversations:", error)
  }
}

export function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const conversations = JSON.parse(stored)
    return conversations.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
    }))
  } catch (error) {
    console.error("Failed to load conversations:", error)
    return []
  }
}

export async function saveConversationToDatabase(conversation: Conversation, coachId: string): Promise<void> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("coach_sessions").upsert({
        id: conversation.id,
        user_id: user.id,
        coach_id: coachId,
        title: conversation.title,
        messages: conversation.messages,
        updated_at: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Failed to save conversation to database:", error)
  }
}

export async function loadConversationsFromDatabase(): Promise<Conversation[]> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: sessions } = await supabase
        .from("coach_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (sessions) {
        return sessions.map((session) => ({
          id: session.id,
          title: session.title,
          messages: session.messages || [],
          createdAt: new Date(session.created_at),
          updatedAt: new Date(session.updated_at),
          settings: {
            systemPrompt: "",
            model: "gpt-4o-mini",
            temperature: 0.7,
            maxTokens: 1000,
          },
        }))
      }
    }

    return []
  } catch (error) {
    console.error("Failed to load conversations from database:", error)
    return []
  }
}

export function saveCurrentConversationId(id: string): void {
  try {
    localStorage.setItem(CURRENT_CONVERSATION_KEY, id)
  } catch (error) {
    console.error("Failed to save current conversation ID:", error)
  }
}

export function loadCurrentConversationId(): string | null {
  try {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY)
  } catch (error) {
    console.error("Failed to load current conversation ID:", error)
    return null
  }
}

export function generateConversationTitle(messages: Message[], isAssistant = false): string {
  const firstUserMessage = messages.find((m) => m.role === "user")
  if (!firstUserMessage) return isAssistant ? "New Primordial Truth Session" : "New Conversation"

  // Handle both standard messages and reasoning pipeline messages
  const content =
    typeof firstUserMessage.content === "string" ? firstUserMessage.content : (firstUserMessage as any).content || ""

  const title = content.length > 50 ? content.substring(0, 50) + "..." : content
  return isAssistant ? `PT: ${title}` : title
}

export function createNewConversation(settings: Conversation["settings"]): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "New Conversation",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    settings,
  }
}
