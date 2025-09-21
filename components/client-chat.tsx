"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { getCoachBySlug } from "@/lib/coaches"

type Message = {
  role: "user" | "assistant"
  content: string
  imageUrl?: string
  timestamp?: Date
  id?: string
}

type ConversationContext = {
  sessionId?: string
  conversationSummary?: string
  keyTopics: string[]
  userPreferences: Record<string, any>
  lastActivity: Date
}

export default function ClientChat({ coachSlug, coachName }: { coachSlug: string; coachName: string }) {
  const coach = getCoachBySlug(coachSlug)!
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)

  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    keyTopics: [],
    userPreferences: {},
    lastActivity: new Date(),
  })

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat-${coachSlug}`)
    const savedContext = localStorage.getItem(`context-${coachSlug}`)

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(
          parsed.map((m: any) => ({
            ...m,
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
          })),
        )
      } catch (error) {
        console.error("[v0] Failed to load saved messages:", error)
      }
    }

    if (savedContext) {
      try {
        const parsed = JSON.parse(savedContext)
        setConversationContext({
          ...parsed,
          lastActivity: new Date(parsed.lastActivity),
        })
      } catch (error) {
        console.error("[v0] Failed to load saved context:", error)
      }
    }
  }, [coachSlug])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat-${coachSlug}`, JSON.stringify(messages))
      setConversationContext((prev) => ({
        ...prev,
        lastActivity: new Date(),
      }))
    }
  }, [messages, coachSlug])

  useEffect(() => {
    localStorage.setItem(`context-${coachSlug}`, JSON.stringify(conversationContext))
  }, [conversationContext, coachSlug])

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const extractConversationContext = (messages: Message[]) => {
    const recentMessages = messages.slice(-10) // Keep last 10 messages for context
    const topics = new Set<string>()
    const preferences: Record<string, any> = {}

    recentMessages.forEach((msg) => {
      const content = msg.content.toLowerCase()

      // Extract sports/activities mentioned
      const sports = ["basketball", "football", "soccer", "tennis", "volleyball", "track", "swimming"]
      sports.forEach((sport) => {
        if (content.includes(sport)) topics.add(sport)
      })

      // Extract preferences
      if (content.includes("prefer") || content.includes("like")) {
        // Simple preference extraction
        if (content.includes("morning")) preferences.timePreference = "morning"
        if (content.includes("evening")) preferences.timePreference = "evening"
      }
    })

    return {
      keyTopics: Array.from(topics),
      userPreferences: preferences,
      recentMessages,
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput("")

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
      id: crypto.randomUUID(),
    }
    setMessages((m) => [...m, userMsg])

    setLoading(true)
    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      id: crypto.randomUUID(),
    }
    setMessages((m) => [...m, assistantMsg])

    try {
      const contextData = extractConversationContext([...messages, userMsg])
      setConversationContext((prev) => ({
        ...prev,
        keyTopics: [...new Set([...prev.keyTopics, ...contextData.keyTopics])],
        userPreferences: { ...prev.userPreferences, ...contextData.userPreferences },
        lastActivity: new Date(),
      }))

      console.log("[v0] Sending enhanced chat request with context")
      console.log("[v0] Context data:", contextData)

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachSlug,
          messages: [...messages, userMsg],
          conversationContext: {
            sessionId: conversationContext.sessionId,
            keyTopics: conversationContext.keyTopics,
            userPreferences: conversationContext.userPreferences,
            messageCount: messages.length + 1,
            conversationAge: Date.now() - (messages[0]?.timestamp?.getTime() || Date.now()),
          },
        }),
      })

      console.log("[v0] Chat API response status:", resp.status)

      if (!resp.ok) {
        const errorText = await resp.text()
        console.error("[v0] Chat API error response:", errorText)
        let errorMessage = "Connection hiccup—try that last message again and we'll keep rolling."
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            errorMessage = `Error: ${errorData.error}`
          }
        } catch {
          // Use default message if can't parse error
        }

        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: errorMessage,
          }
          return copy
        })
        return
      }

      const data = await resp.json()
      console.log("[v0] Chat API response data:", data)
      const assistantText = data.message || "No response generated"
      const imageUrl = data.image?.url || (data.image?.b64 ? `data:image/png;base64,${data.image.b64}` : undefined)

      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: assistantText,
          imageUrl,
        }
        return copy
      })

      if (data.sessionId && !conversationContext.sessionId) {
        setConversationContext((prev) => ({
          ...prev,
          sessionId: data.sessionId,
        }))
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: "Connection hiccup—try that last message again and we'll keep rolling.",
        }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const clearConversation = () => {
    if (messages.length > 0 && confirm("Clear this conversation? This cannot be undone.")) {
      setMessages([])
      setConversationContext({
        keyTopics: [],
        userPreferences: {},
        lastActivity: new Date(),
      })
      localStorage.removeItem(`chat-${coachSlug}`)
      localStorage.removeItem(`context-${coachSlug}`)
    }
  }

  return (
    <>
      <div className="px-3 sm:px-4 py-3 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">{coach.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="text-base sm:text-lg font-semibold truncate">{coachName}</div>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">{coach.tagline}</div>
            {conversationContext.keyTopics.length > 0 && (
              <div className="flex gap-1 mt-1">
                {conversationContext.keyTopics.slice(0, 3).map((topic) => (
                  <span key={topic} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearConversation}
                className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground font-medium whitespace-nowrap transition-colors"
              >
                Clear
              </button>
            )}
            <span className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
              Voice coming soon
            </span>
          </div>
        </div>
      </div>

      <div ref={viewportRef} className="flex-1 overflow-y-auto px-3 sm:px-4 pt-2 pb-2 bg-background min-h-0">
        <ul className="space-y-4 pb-20">
          {messages.map((m, i) => (
            <li key={m.id || i} className="flex">
              <div
                className={
                  m.role === "assistant"
                    ? "ml-0 mr-auto max-w-[85%] sm:max-w-[90%] rounded-2xl rounded-tl-sm bg-card px-4 py-3 text-base leading-relaxed shadow-sm border border-border"
                    : "ml-auto mr-0 max-w-[85%] sm:max-w-[90%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-3 text-base leading-relaxed shadow-sm"
                }
              >
                {m.role === "assistant" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{coach.emoji}</span>
                      <span className="text-sm font-semibold text-muted-foreground">{coachName}</span>
                    </div>

                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap text-foreground leading-7">{m.content}</div>
                    </div>

                    {m.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border">
                        <img
                          src={m.imageUrl || "/placeholder.svg"}
                          alt="Generated visual content"
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground mt-2 opacity-70">
                      {m.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ||
                        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-7">{m.content}</div>
                )}
              </div>
            </li>
          ))}
          {loading && (
            <li className="ml-0 mr-auto max-w-[85%] sm:max-w-[90%] rounded-2xl rounded-tl-sm bg-card px-4 py-3 text-base shadow-sm border border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">{coach.emoji}</span>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>

      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur safe-area-inset-bottom">
        <div className="p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Type to your coach…"
              className="min-h-[40px] sm:min-h-[44px] w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="h-[40px] sm:h-[44px] shrink-0 rounded-xl bg-primary px-3 sm:px-4 text-lg font-semibold text-primary-foreground disabled:opacity-50 transition-opacity"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-[10px] sm:text-[11px] text-muted-foreground">
            Enter to send • Shift+Enter for newline
          </p>
        </div>
      </div>
    </>
  )
}
