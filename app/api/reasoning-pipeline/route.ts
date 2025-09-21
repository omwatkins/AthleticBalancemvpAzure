// 4-Phase Reasoning Pipeline Implementation
export const maxDuration = 60 // Changed from 120 to 60 (Vercel's maximum)

// Helper function to ensure JSON response
function createJsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  })
}

// Direct API call to create thread
async function createThread(apiKey: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/threads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create thread: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.id
}

// Direct API call to add message to thread
async function addMessage(apiKey: string, threadId: string, content: string): Promise<void> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    },
    body: JSON.stringify({
      role: "user",
      content: content,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to add message: ${response.status} - ${errorText}`)
  }
}

// Direct API call to create run
async function createRun(apiKey: string, threadId: string, assistantId: string): Promise<string> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    },
    body: JSON.stringify({
      assistant_id: assistantId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create run: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.id
}

// Direct API call to check run status
async function checkRunStatus(apiKey: string, threadId: string, runId: string): Promise<any> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to check run status: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// Direct API call to get messages
async function getMessages(apiKey: string, threadId: string): Promise<any> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get messages: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// 🔧 Helper Function: runExecutionAssistant()
async function runExecutionAssistant(assistantId: string, prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("EXECUTION API key not configured")
  }

  console.log(`[EXEC] Starting execution assistant ${assistantId}`)
  console.log(`[EXEC] Prompt: ${prompt.substring(0, 100)}...`)

  try {
    // 1. Create thread
    const threadId = await createThread(apiKey)
    console.log(`[EXEC] Thread created: ${threadId}`)

    // 2. Add user message
    await addMessage(apiKey, threadId, prompt)
    console.log(`[EXEC] Message added`)

    // 3. Run assistant (execution)
    const runId = await createRun(apiKey, threadId, assistantId)
    console.log(`[EXEC] Run created: ${runId}`)

    // 4. Poll until run.status == 'completed'
    let attempts = 0
    const maxAttempts = 30
    let runResult

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      attempts++

      runResult = await checkRunStatus(apiKey, threadId, runId)
      console.log(`[EXEC] Attempt ${attempts}: ${runResult.status}`)

      if (runResult.status === "completed") {
        break
      } else if (runResult.status === "failed") {
        throw new Error(`Execution run failed: ${runResult.last_error?.message || "Unknown error"}`)
      }
    }

    if (runResult.status !== "completed") {
      throw new Error(`Execution run did not complete after ${attempts} attempts. Status: ${runResult.status}`)
    }

    // 5. Get assistant reply
    const messages = await getMessages(apiKey, threadId)
    const assistantMessage = messages.data.find((msg: any) => msg.role === "assistant")

    if (!assistantMessage || !assistantMessage.content || assistantMessage.content.length === 0) {
      throw new Error("No execution assistant response found")
    }

    let responseText = ""
    for (const content of assistantMessage.content) {
      if (content.type === "text") {
        responseText += content.text.value + "\n"
      }
    }

    const finalResponse = responseText.trim()
    console.log(`[EXEC] Success! Response length: ${finalResponse.length}`)
    return finalResponse
  } catch (error) {
    console.error(`[EXEC] Error:`, error)
    throw new Error(`Execution assistant failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// 🔧 Helper Function: runReflectionAssistant()
async function runReflectionAssistant(assistantId: string, prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY_SECONDARY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("REFLECTION API key not configured")
  }

  console.log(`[REFL] Starting reflection assistant ${assistantId}`)
  console.log(`[REFL] Prompt: ${prompt.substring(0, 100)}...`)

  try {
    // 1. Create thread
    const threadId = await createThread(apiKey)
    console.log(`[REFL] Thread created: ${threadId}`)

    // 2. Add user message
    await addMessage(apiKey, threadId, prompt)
    console.log(`[REFL] Message added`)

    // 3. Run assistant (reflection)
    const runId = await createRun(apiKey, threadId, assistantId)
    console.log(`[REFL] Run created: ${runId}`)

    // 4. Poll until run.status == 'completed'
    let attempts = 0
    const maxAttempts = 30
    let runResult

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      attempts++

      runResult = await checkRunStatus(apiKey, threadId, runId)
      console.log(`[REFL] Attempt ${attempts}: ${runResult.status}`)

      if (runResult.status === "completed") {
        break
      } else if (runResult.status === "failed") {
        throw new Error(`Reflection run failed: ${runResult.last_error?.message || "Unknown error"}`)
      }
    }

    if (runResult.status !== "completed") {
      throw new Error(`Reflection run did not complete after ${attempts} attempts. Status: ${runResult.status}`)
    }

    // 5. Get assistant reply
    const messages = await getMessages(apiKey, threadId)
    const assistantMessage = messages.data.find((msg: any) => msg.role === "assistant")

    if (!assistantMessage || !assistantMessage.content || assistantMessage.content.length === 0) {
      throw new Error("No reflection assistant response found")
    }

    let responseText = ""
    for (const content of assistantMessage.content) {
      if (content.type === "text") {
        responseText += content.text.value + "\n"
      }
    }

    const finalResponse = responseText.trim()
    console.log(`[REFL] Success! Response length: ${finalResponse.length}`)
    return finalResponse
  } catch (error) {
    console.error(`[REFL] Error:`, error)
    throw new Error(`Reflection assistant failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// 🔁 Overall Function: reasoningPipeline(prompt)
async function reasoningPipeline(prompt: string) {
  const requestId = Math.random().toString(36).substring(7)
  console.log(`[PIPELINE-${requestId}] === 4-PHASE REASONING START ===`)
  console.log(`[PIPELINE-${requestId}] Input: "${prompt.substring(0, 100)}..."`)

  const execAssistantId = process.env.EXECUTION_ASSISTANT_ID || "asst_hUC1KmMkIOKOx9OhE2P5GRBa"
  const reflAssistantId = process.env.REFLECTION_ASSISTANT_ID || "asst_10A35sa3kEsM7jS1EvdYAmBm"

  try {
    // Phase 1: Initial Execution (via EXECUTION_ASSISTANT with API_KEY_EXEC)
    console.log(`[PIPELINE-${requestId}] === PHASE 1: INITIAL EXECUTION ===`)
    const initialExecution = await runExecutionAssistant(execAssistantId, prompt)

    // Phase 2: Reflection on Initial Execution (via REFLECTION_ASSISTANT with API_KEY_REFL)
    console.log(`[PIPELINE-${requestId}] === PHASE 2: REFLECTION ON INITIAL ===`)
    const reflection1Prompt = `Evaluate the following initial response for logical integrity, clarity, and bias.
Suggest improvements if needed.

Response:
${initialExecution}`

    const reflectionOnInitial = await runReflectionAssistant(reflAssistantId, reflection1Prompt)

    // Phase 3: Final Execution Based on Reflection (EXEC again)
    console.log(`[PIPELINE-${requestId}] === PHASE 3: FINAL EXECUTION ===`)
    const finalExecutionPrompt = `Revise your previous answer based on this feedback:

Original Question: ${prompt}

Your Previous Answer:
${initialExecution}

Feedback for Improvement:
${reflectionOnInitial}

Please provide a revised and improved response.`

    const finalResponse = await runExecutionAssistant(execAssistantId, finalExecutionPrompt)

    // Phase 4: Final Reflection (REFL again) — scoring + IRHF breakdown
    console.log(`[PIPELINE-${requestId}] === PHASE 4: FINAL EVALUATION ===`)
    const finalReflectionPrompt = `Evaluate this final response and assign:

- Final Integrity Score (0.0–1.0)
- Reward breakdown (uncertainty, bias, logic drift, correction)

Original Question: ${prompt}

Final Answer:
${finalResponse}

Please provide your evaluation in this format:
INTEGRITY_SCORE: [0.0-1.0]
HONEST_UNCERTAINTY_BONUS: [+/- value]
SELF_CORRECTION_BONUS: [+/- value]  
BIAS_AVOIDANCE_PENALTY: [+/- value]
LOGIC_DRIFT_PENALTY: [+/- value]
COMMENT: [your assessment]`

    const finalEvaluation = await runReflectionAssistant(reflAssistantId, finalReflectionPrompt)

    // Parse final evaluation for structured output
    let parsedEvaluation
    try {
      const lines = finalEvaluation.split("\n")
      const integrityMatch = finalEvaluation.match(/INTEGRITY_SCORE:\s*([\d.]+)/)
      const uncertaintyMatch = finalEvaluation.match(/HONEST_UNCERTAINTY_BONUS:\s*([-+]?[\d.]+)/)
      const correctionMatch = finalEvaluation.match(/SELF_CORRECTION_BONUS:\s*([-+]?[\d.]+)/)
      const biasMatch = finalEvaluation.match(/BIAS_AVOIDANCE_PENALTY:\s*([-+]?[\d.]+)/)
      const logicMatch = finalEvaluation.match(/LOGIC_DRIFT_PENALTY:\s*([-+]?[\d.]+)/)
      const commentMatch = finalEvaluation.match(/COMMENT:\s*(.+)/)

      parsedEvaluation = {
        integrity_score: integrityMatch ? Number.parseFloat(integrityMatch[1]) : 0.5,
        reward_components: {
          honest_uncertainty_bonus: uncertaintyMatch ? Number.parseFloat(uncertaintyMatch[1]) : 0,
          self_correction_bonus: correctionMatch ? Number.parseFloat(correctionMatch[1]) : 0,
          bias_avoidance_penalty: biasMatch ? Number.parseFloat(biasMatch[1]) : 0,
          logic_drift_penalty: logicMatch ? Number.parseFloat(logicMatch[1]) : 0,
        },
        comment: commentMatch ? commentMatch[1].trim() : finalEvaluation,
        raw_evaluation: finalEvaluation,
      }
    } catch (parseError) {
      console.warn(`[PIPELINE-${requestId}] Failed to parse evaluation, using raw text`)
      parsedEvaluation = {
        integrity_score: 0.5,
        reward_components: {
          honest_uncertainty_bonus: 0,
          self_correction_bonus: 0,
          bias_avoidance_penalty: 0,
          logic_drift_penalty: 0,
        },
        comment: finalEvaluation,
        raw_evaluation: finalEvaluation,
      }
    }

    console.log(`[PIPELINE-${requestId}] === PIPELINE COMPLETE ===`)

    return {
      initial_execution: initialExecution,
      reflection_on_initial: reflectionOnInitial,
      final_response: finalResponse,
      final_evaluation: parsedEvaluation,
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
        assistantIds: {
          execution: execAssistantId,
          reflection: reflAssistantId,
        },
        apiKeys: {
          execution: "PRIMARY",
          reflection: process.env.OPENAI_API_KEY_SECONDARY ? "SECONDARY" : "PRIMARY (fallback)",
        },
        phases_completed: 4,
      },
    }
  } catch (error) {
    console.error(`[PIPELINE-${requestId}] Pipeline failed:`, error)
    throw new Error(`Reasoning pipeline failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7)
  console.log(`[API-${requestId}] === REASONING PIPELINE REQUEST ===`)

  try {
    // Parse request
    let requestData
    try {
      const requestText = await req.text()
      if (!requestText.trim()) {
        return createJsonResponse(
          {
            success: false,
            error: "Empty request body",
            requestId,
          },
          400,
        )
      }
      requestData = JSON.parse(requestText)
    } catch (parseError) {
      return createJsonResponse(
        {
          success: false,
          error: "Invalid JSON in request",
          details: parseError instanceof Error ? parseError.message : "Unknown parse error",
          requestId,
        },
        400,
      )
    }

    const { prompt } = requestData
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return createJsonResponse(
        {
          success: false,
          error: "Invalid prompt",
          details: "Prompt must be a non-empty string",
          requestId,
        },
        400,
      )
    }

    // Validate environment
    const primaryKey = process.env.OPENAI_API_KEY
    if (!primaryKey) {
      return createJsonResponse(
        {
          success: false,
          error: "Primary OpenAI API key not configured",
          details: "Please set OPENAI_API_KEY environment variable",
          requestId,
        },
        500,
      )
    }

    // Run the 4-phase reasoning pipeline
    const result = await reasoningPipeline(prompt)

    return createJsonResponse({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error(`[API-${requestId}] Error:`, error)
    return createJsonResponse(
      {
        success: false,
        error: "Reasoning pipeline failed",
        details: error instanceof Error ? error.message : "Unknown error",
        requestId,
      },
      500,
    )
  }
}
