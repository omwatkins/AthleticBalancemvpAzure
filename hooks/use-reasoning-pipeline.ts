"use client"

import { useState, useCallback } from "react"

interface ReasoningPipelineMessage {
  id: string
  role:
    | "user"
    | "initial_execution"
    | "reflection_on_initial"
    | "final_response"
    | "final_evaluation"
    | "reasoning_complete"
  content: string
  timestamp: Date
  metadata?: {
    phase: number
    phaseTitle: string
    integrityScore?: number
    rewardComponents?: {
      honest_uncertainty_bonus: number
      self_correction_bonus: number
      bias_avoidance_penalty: number
      logic_drift_penalty: number
    }
    assistantId?: string
    apiKey?: string
    reasoningData?: {
      initial_execution: string
      reflection_on_initial: string
      final_response: string
      final_evaluation: any
    }
  }
}

interface ReasoningPipelineResult {
  initial_execution: string
  reflection_on_initial: string
  final_response: string
  final_evaluation: {
    integrity_score: number
    reward_components: {
      honest_uncertainty_bonus: number
      self_correction_bonus: number
      bias_avoidance_penalty: number
      logic_drift_penalty: number
    }
    comment: string
    raw_evaluation: string
  }
  metadata: {
    requestId: string
    timestamp: string
    assistantIds: {
      execution: string
      reflection: string
    }
    apiKeys: {
      execution: string
      reflection: string
    }
    phases_completed: number
  }
}

export function useReasoningPipeline() {
  const [messages, setMessages] = useState<ReasoningPipelineMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<number>(0)

  const testConnection = useCallback(async () => {
    try {
      console.log("[useReasoningPipeline] Testing connection...")
      const response = await fetch("/api/reasoning-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "test connection" }),
      })

      const data = await response.json()
      console.log("[useReasoningPipeline] Test result:", data)
      return data
    } catch (error) {
      console.error("[useReasoningPipeline] Test failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
      }
    }
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      console.error("[useReasoningPipeline] Empty message content")
      return
    }

    const requestId = Math.random().toString(36).substring(7)
    console.log(`[useReasoningPipeline-${requestId}] Starting 4-phase reasoning...`)

    const userMessage: ReasoningPipelineMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages([userMessage])
    setIsLoading(true)
    setCurrentPhase(1)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 55000) // Changed from 300000 to 55000 (55 seconds, slightly less than API timeout)

      const response = await fetch("/api/reasoning-pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: content }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseText = await response.text()
      console.log(`[useReasoningPipeline-${requestId}] Response length: ${responseText.length}`)

      let data: ReasoningPipelineResult & { success: boolean }
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Invalid response format: ${responseText.substring(0, 200)}...`)
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      // Create a single "reasoning complete" message with all the data
      const reasoningCompleteMessage: ReasoningPipelineMessage = {
        id: crypto.randomUUID(),
        role: "reasoning_complete",
        content: data.final_response, // This will be the main content shown
        timestamp: new Date(),
        metadata: {
          phase: 4,
          phaseTitle: "Reasoning Complete",
          integrityScore: data.final_evaluation.integrity_score,
          rewardComponents: data.final_evaluation.reward_components,
          assistantId: data.metadata.assistantIds.execution,
          apiKey: data.metadata.apiKeys.execution,
          reasoningData: {
            initial_execution: data.initial_execution,
            reflection_on_initial: data.reflection_on_initial,
            final_response: data.final_response,
            final_evaluation: data.final_evaluation,
          },
        },
      }

      setMessages((prev) => [...prev, reasoningCompleteMessage])
      setCurrentPhase(4)
      console.log(`[useReasoningPipeline-${requestId}] Success! 4-phase reasoning completed with collapsible view.`)
    } catch (error) {
      console.error(`[useReasoningPipeline-${requestId}] Error:`, error)

      let errorContent = "❌ An error occurred during the 4-phase reasoning process."

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorContent = "❌ Request timed out. The 4-phase reasoning process takes longer than usual."
        } else {
          errorContent = `❌ Error: ${error.message}

🔧 **4-Phase Reasoning Pipeline Error:**
1. Check if both API keys are configured correctly
2. Verify assistant IDs are valid
3. Ensure sufficient API quota
4. Try with a shorter prompt`
        }
      }

      const errorMessage: ReasoningPipelineMessage = {
        id: crypto.randomUUID(),
        role: "final_evaluation",
        content: errorContent,
        timestamp: new Date(),
        metadata: {
          phase: 0,
          phaseTitle: "Error",
        },
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setCurrentPhase(0)
    }
  }, [])

  const clearMessages = useCallback(() => {
    console.log("[useReasoningPipeline] Clearing messages")
    setMessages([])
    setCurrentPhase(0)
  }, [])

  return {
    messages,
    isLoading,
    currentPhase,
    sendMessage,
    clearMessages,
    testConnection,
  }
}
