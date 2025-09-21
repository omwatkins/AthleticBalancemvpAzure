"use client"

import { useState, useCallback } from "react"

interface DualAssistantMessage {
  id: string
  role: "user" | "assistant" | "reflection"
  content: string
  timestamp: Date
  reflection?: {
    notes: string
  }
  metadata?: {
    executionAssistant: string
    reflectionAssistant: string
    timestamp: string
    toolsEnabled?: string[]
    apiKeys?: {
      execution: string
      reflection: string
    }
    assistantIds?: {
      execution: string
      reflection: string
    }
    requestId?: string
  }
}

export function useDualAssistant() {
  const [messages, setMessages] = useState<DualAssistantMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = useCallback(async () => {
    try {
      console.log("[useDualAssistant] Testing connection...")
      const response = await fetch("/api/dual-assistant-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      })

      const responseText = await response.text()
      console.log("[useDualAssistant] Test response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[useDualAssistant] Failed to parse test response:", parseError)
        return {
          success: false,
          error: "Invalid response format",
          details: responseText.substring(0, 200),
        }
      }

      console.log("[useDualAssistant] Test result:", data)
      return data
    } catch (error) {
      console.error("[useDualAssistant] Test failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
        details: "Network or server error during connection test",
      }
    }
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        console.error("[useDualAssistant] Empty message content")
        return
      }

      const requestId = Math.random().toString(36).substring(7)
      console.log(`[useDualAssistant-${requestId}] Sending message: "${content.substring(0, 50)}..."`)

      const userMessage: DualAssistantMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // First, test the connection
        console.log(`[useDualAssistant-${requestId}] Running connection test...`)
        const testResult = await testConnection()
        if (!testResult.success) {
          console.error(`[useDualAssistant-${requestId}] Connection test failed:`, testResult)
          throw new Error(
            `Connection test failed: ${testResult.error}${testResult.details ? ` - ${testResult.details}` : ""}`,
          )
        }

        console.log(`[useDualAssistant-${requestId}] Connection test passed, making main request...`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 180000) // 3 minute timeout

        const response = await fetch("/api/dual-assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: content }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        console.log(`[useDualAssistant-${requestId}] Response status: ${response.status}`)
        console.log(`[useDualAssistant-${requestId}] Response headers:`, Object.fromEntries(response.headers.entries()))

        // Get response text
        const responseText = await response.text()
        console.log(`[useDualAssistant-${requestId}] Response length: ${responseText.length}`)
        console.log(`[useDualAssistant-${requestId}] Response preview: ${responseText.substring(0, 500)}...`)

        // Parse response
        let data
        try {
          data = JSON.parse(responseText)
          console.log(`[useDualAssistant-${requestId}] JSON parsed successfully`)
        } catch (parseError) {
          console.error(`[useDualAssistant-${requestId}] JSON parse failed:`, parseError)
          throw new Error(`Invalid response format. Server returned: ${responseText.substring(0, 200)}...`)
        }

        if (!response.ok) {
          console.error(`[useDualAssistant-${requestId}] API error:`, data)
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        if (!data.success) {
          throw new Error(data.error || "Request failed")
        }

        // Add messages
        const executionMessage: DualAssistantMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response || "[No response]",
          timestamp: new Date(),
          reflection: data.reflection,
          metadata: data.metadata,
        }

        const reflectionMessage: DualAssistantMessage = {
          id: crypto.randomUUID(),
          role: "reflection",
          content: data.reflection?.notes || "[No reflection]",
          timestamp: new Date(),
          metadata: data.metadata,
        }

        setMessages((prev) => [...prev, executionMessage, reflectionMessage])
        console.log(`[useDualAssistant-${requestId}] Success!`)
      } catch (error) {
        console.error(`[useDualAssistant-${requestId}] Error:`, error)

        let errorContent = "❌ An error occurred while processing your request."

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorContent = "❌ Request timed out. Please try again with a shorter message."
          } else if (error.message.includes("Connection test failed")) {
            errorContent = `❌ System Configuration Error: ${error.message}

🔧 **Possible Issues:**
1. **API Key Missing**: Check if OPENAI_API_KEY is set in your .env.local file
2. **API Key Invalid**: Verify your API key is correct and starts with 'sk-'
3. **Network Issues**: Check your internet connection
4. **Server Error**: The server may be experiencing issues

📋 **Next Steps:**
1. Click the "Test Connection" button in the Debug panel
2. Check your .env.local file configuration
3. Restart your development server
4. Try again in a few minutes`
          } else {
            errorContent = `❌ Error: ${error.message}

🔧 **Troubleshooting:**
1. Check the Debug panel for system status
2. Verify your API keys are configured correctly
3. Try a shorter message
4. Check browser console for detailed error logs`
          }
        }

        const errorMessage: DualAssistantMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: errorContent,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [testConnection],
  )

  const clearMessages = useCallback(() => {
    console.log("[useDualAssistant] Clearing messages")
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    testConnection,
  }
}
