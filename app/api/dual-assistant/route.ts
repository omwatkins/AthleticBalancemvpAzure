// Allow longer processing time for dual assistant calls
export const maxDuration = 60

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

async function runAssistant(
  apiKey: string,
  assistantId: string,
  input: string,
  assistantType: "execution" | "reflection",
): Promise<string> {
  const logPrefix = `[${assistantType.toUpperCase()}]`

  try {
    console.log(`${logPrefix} Starting assistant ${assistantId}`)

    // Create thread
    console.log(`${logPrefix} Creating thread...`)
    const threadId = await createThread(apiKey)
    console.log(`${logPrefix} Thread created: ${threadId}`)

    // Add message
    console.log(`${logPrefix} Adding message...`)
    await addMessage(apiKey, threadId, input)

    // Create run
    console.log(`${logPrefix} Creating run...`)
    const runId = await createRun(apiKey, threadId, assistantId)
    console.log(`${logPrefix} Run created: ${runId}`)

    // Wait for completion
    let attempts = 0
    const maxAttempts = 20
    let runResult

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      attempts++

      runResult = await checkRunStatus(apiKey, threadId, runId)
      console.log(`${logPrefix} Attempt ${attempts}: ${runResult.status}`)

      if (runResult.status === "completed") {
        break
      } else if (runResult.status === "failed") {
        throw new Error(`Run failed: ${runResult.last_error?.message || "Unknown error"}`)
      }
    }

    if (runResult.status !== "completed") {
      throw new Error(`Run did not complete after ${attempts} attempts. Final status: ${runResult.status}`)
    }

    // Get messages
    console.log(`${logPrefix} Retrieving messages...`)
    const messages = await getMessages(apiKey, threadId)
    const assistantMessage = messages.data.find((msg: any) => msg.role === "assistant")

    if (!assistantMessage || !assistantMessage.content || assistantMessage.content.length === 0) {
      throw new Error("No assistant response found")
    }

    let responseText = ""
    for (const content of assistantMessage.content) {
      if (content.type === "text") {
        responseText += content.text.value + "\n"
      }
    }

    const finalResponse = responseText.trim()
    console.log(`${logPrefix} Success! Response length: ${finalResponse.length}`)
    return finalResponse || `[Empty ${assistantType} response]`
  } catch (error) {
    console.error(`${logPrefix} Error:`, error)
    throw new Error(`${assistantType} assistant failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7)
  console.log(`[API-${requestId}] === DUAL ASSISTANT REQUEST START ===`)

  try {
    // Parse request first
    console.log(`[API-${requestId}] Parsing request...`)
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
      console.error(`[API-${requestId}] Parse error:`, parseError)
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
          received: { prompt, type: typeof prompt },
          requestId,
        },
        400,
      )
    }

    console.log(`[API-${requestId}] Processing prompt: "${prompt.substring(0, 100)}..."`)

    // Check environment variables
    const primaryKey = process.env.OPENAI_API_KEY
    const secondaryKey = process.env.OPENAI_API_KEY_SECONDARY
    const execAssistantId = process.env.EXECUTION_ASSISTANT_ID || "asst_hUC1KmMkIOKOx9OhE2P5GRBa"
    const reflAssistantId = process.env.REFLECTION_ASSISTANT_ID || "asst_10A35sa3kEsM7jS1EvdYAmBm"

    console.log(`[API-${requestId}] Environment check:`)
    console.log(`[API-${requestId}] - Primary key: ${primaryKey ? "✓" : "✗"}`)
    console.log(`[API-${requestId}] - Secondary key: ${secondaryKey ? "✓" : "✗ (will use primary)"}`)
    console.log(`[API-${requestId}] - Exec assistant: ${execAssistantId}`)
    console.log(`[API-${requestId}] - Refl assistant: ${reflAssistantId}`)

    if (!primaryKey || typeof primaryKey !== "string" || !primaryKey.trim()) {
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

    if (!primaryKey.startsWith("sk-")) {
      return createJsonResponse(
        {
          success: false,
          error: "Invalid primary API key format",
          details: "API key must start with 'sk-'",
          requestId,
        },
        500,
      )
    }

    // Test connection with direct API call
    console.log(`[API-${requestId}] Testing connection...`)
    try {
      const testResponse = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${primaryKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!testResponse.ok) {
        throw new Error(`API test failed: ${testResponse.status}`)
      }

      console.log(`[API-${requestId}] Connection test passed`)
    } catch (connectionError) {
      console.error(`[API-${requestId}] Connection test failed:`, connectionError)
      return createJsonResponse(
        {
          success: false,
          error: "OpenAI connection failed",
          details: connectionError instanceof Error ? connectionError.message : "Unknown connection error",
          requestId,
        },
        500,
      )
    }

    // Run execution assistant
    console.log(`[API-${requestId}] Running execution assistant...`)
    let executionResponse
    try {
      executionResponse = await runAssistant(primaryKey, execAssistantId, prompt, "execution")
    } catch (execError) {
      console.error(`[API-${requestId}] Execution failed:`, execError)
      return createJsonResponse(
        {
          success: false,
          error: "Execution assistant failed",
          details: execError instanceof Error ? execError.message : "Unknown execution error",
          assistantId: execAssistantId,
          requestId,
        },
        500,
      )
    }

    // Prepare reflection input
    const reflectionInput = `Analyze this response for accuracy and integrity:

Question: "${prompt}"
Response: "${executionResponse}"

Provide:
1. Integrity Score (0.0-1.0)
2. Key strengths
3. Areas for improvement
4. Overall assessment

Keep it concise.`

    // Run reflection assistant
    console.log(`[API-${requestId}] Running reflection assistant...`)
    let reflectionResponse
    try {
      const reflectionApiKey = secondaryKey || primaryKey
      reflectionResponse = await runAssistant(reflectionApiKey, reflAssistantId, reflectionInput, "reflection")
    } catch (reflError) {
      console.error(`[API-${requestId}] Reflection failed:`, reflError)
      reflectionResponse = `Reflection analysis unavailable: ${reflError instanceof Error ? reflError.message : "Unknown error"}`
    }

    // Success response
    const response = {
      success: true,
      response: executionResponse,
      reflection: {
        notes: reflectionResponse,
      },
      metadata: {
        executionAssistant: execAssistantId,
        reflectionAssistant: reflAssistantId,
        timestamp: new Date().toISOString(),
        toolsEnabled: ["file_search", "code_interpreter"],
        apiKeys: {
          execution: "PRIMARY",
          reflection: secondaryKey ? "SECONDARY" : "PRIMARY (fallback)",
        },
        method: "direct_api_calls",
        requestId,
      },
    }

    console.log(`[API-${requestId}] === SUCCESS ===`)
    return createJsonResponse(response, 200)
  } catch (error) {
    console.error(`[API-${requestId}] UNEXPECTED ERROR:`, error)
    console.error(`[API-${requestId}] Error stack:`, error instanceof Error ? error.stack : "No stack trace")

    return createJsonResponse(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
        requestId,
      },
      500,
    )
  }
}
