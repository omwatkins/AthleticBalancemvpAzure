"use client"

import { useState, useEffect, useCallback } from "react"
import type { Message } from "@/lib/types"
import {
  type Conversation,
  saveConversations,
  loadConversations,
  saveCurrentConversationId,
  loadCurrentConversationId,
  generateConversationTitle,
  createNewConversation,
  saveConversationToDatabase,
  loadConversationsFromDatabase,
} from "@/lib/conversation-storage"

export function useConversations(initialSettings: Conversation["settings"], coachId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load conversations from both localStorage and database on mount
  useEffect(() => {
    const loadAllConversations = async () => {
      const localConversations = loadConversations()
      const dbConversations = await loadConversationsFromDatabase()

      // Merge conversations, preferring database versions
      const mergedConversations = [...dbConversations]
      localConversations.forEach((local) => {
        if (!mergedConversations.find((db) => db.id === local.id)) {
          mergedConversations.push(local)
        }
      })

      const currentId = loadCurrentConversationId()
      setConversations(mergedConversations)

      if (currentId && mergedConversations.find((c) => c.id === currentId)) {
        setCurrentConversationId(currentId)
      } else if (mergedConversations.length > 0) {
        setCurrentConversationId(mergedConversations[0].id)
      }

      setIsLoaded(true)
    }

    loadAllConversations()
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveConversations(conversations)
    }
  }, [conversations, isLoaded])

  // Save current conversation ID whenever it changes
  useEffect(() => {
    if (currentConversationId && isLoaded) {
      saveCurrentConversationId(currentConversationId)
    }
  }, [currentConversationId, isLoaded])

  const getCurrentConversation = useCallback((): Conversation | null => {
    if (!currentConversationId) return null
    return conversations.find((c) => c.id === currentConversationId) || null
  }, [conversations, currentConversationId])

  const createConversation = useCallback((settings: Conversation["settings"]) => {
    const newConversation = createNewConversation(settings)
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
    return newConversation
  }, [])

  const updateConversation = useCallback(
    (id: string, updates: Partial<Conversation>) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === id) {
            const updated = { ...conv, ...updates, updatedAt: new Date() }
            if (coachId) {
              saveConversationToDatabase(updated, coachId)
            }
            return updated
          }
          return conv
        }),
      )
    },
    [coachId],
  )

  const updateMessages = useCallback(
    (messages: Message[]) => {
      if (!currentConversationId) return

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === currentConversationId) {
            // Only update if messages have actually changed
            const messagesChanged = JSON.stringify(conv.messages) !== JSON.stringify(messages)

            if (!messagesChanged) return conv

            const title =
              messages.length > 0 && conv.title === "New Conversation"
                ? generateConversationTitle(messages)
                : conv.title

            const updated = {
              ...conv,
              messages,
              title,
              updatedAt: new Date(),
            }

            if (coachId) {
              saveConversationToDatabase(updated, coachId)
            }

            return updated
          }
          return conv
        }),
      )
    },
    [currentConversationId, coachId], // Added coachId dependency
  )

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id)

        // If we're deleting the current conversation, switch to another one
        if (currentConversationId === id) {
          const nextConversation = filtered[0]
          setCurrentConversationId(nextConversation?.id || null)
        }

        return filtered
      })
    },
    [currentConversationId],
  )

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id)
  }, [])

  return {
    conversations,
    currentConversationId,
    currentConversation: getCurrentConversation(),
    isLoaded,
    createConversation,
    updateConversation,
    updateMessages,
    deleteConversation,
    selectConversation,
  }
}
