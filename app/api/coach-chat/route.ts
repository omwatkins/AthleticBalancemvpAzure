import { createClient } from "@/lib/azure/server"
import type { NextRequest } from "next/server"
import { COACHES } from "@/lib/coaches"

// export const runtime = "edge" // Disabled for Azure auth compatibility

export async function POST(req: NextRequest) {
  try {
    const { messages, coachId, sessionId } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages array is required" }, { status: 400 })
    }

    if (!coachId) {
      return Response.json({ error: "Coach ID is required" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server operations
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] User authentication status:", user ? "authenticated" : "anonymous")
    console.log("[v0] Coach ID requested:", coachId)

    let coach = null
    const { data: dbCoach, error: coachError } = await supabase.from("coaches").select("*").eq("id", coachId).single()

    if (dbCoach && !coachError) {
      coach = dbCoach
      console.log("[v0] Coach found in database:", coach.name)
    } else {
      // Fall back to hardcoded coaches
      coach = COACHES.find((c) => c.id === coachId)
      if (coach) {
        console.log("[v0] Coach found in hardcoded data:", coach.name)
      } else {
        console.log("[v0] Coach not found in database or hardcoded data")
        return Response.json({ error: "Coach not found" }, { status: 404 })
      }
    }

    const openaiResponse = await fetch(
      process.env.AZURE_OPENAI_ENDPOINT
        ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`
        : "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY}`,
          ...(process.env.AZURE_OPENAI_API_KEY && { "api-key": process.env.AZURE_OPENAI_API_KEY }),
        },
        body: JSON.stringify({
          model: process.env.AZURE_OPENAI_ENDPOINT ? undefined : "gpt-4o-mini",
          messages: [{ role: "system", content: coach.system_prompt }, ...messages],
          stream: true,
        }),
      },
    )

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    let fullResponse = ""
    let sessionSaved = false

    const stream = new ReadableStream({
      start(controller) {
        const reader = openaiResponse.body!.getReader()
        const encoder = new TextEncoder()
        ;(function pump() {
          reader
            .read()
            .then(async ({ done, value }) => {
              if (done) {
                if (!sessionSaved && fullResponse.trim() && user) {
                  try {
                    console.log("[v0] Attempting to save session for user:", user.id)
                    const updatedMessages = [...messages, { role: "assistant", content: fullResponse }]
                    const title = messages[0]?.content?.substring(0, 50) + "..." || "New Session"

                    if (sessionId) {
                      // Update existing session
                      console.log("[v0] Updating existing session:", sessionId)
                      const { error: updateError } = await supabase
                        .from("coach_sessions")
                        .update({
                          messages: updatedMessages,
                          title,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", sessionId)
                        .eq("user_id", user.id)

                      if (updateError) {
                        console.log("[v0] Session update error:", updateError)
                      } else {
                        console.log("[v0] Session updated successfully")
                        sessionSaved = true
                      }
                    } else {
                      // Create new session
                      console.log("[v0] Creating new session for coach:", coachId)
                      const { data: newSession, error: insertError } = await supabase
                        .from("coach_sessions")
                        .insert({
                          user_id: user.id,
                          coach_id: coachId,
                          title,
                          messages: updatedMessages,
                        })
                        .select()
                        .single()

                      if (insertError) {
                        console.log("[v0] Session insert error:", insertError)
                      } else {
                        console.log("[v0] New session created successfully:", newSession?.id)
                        sessionSaved = true
                      }
                    }
                  } catch (error) {
                    console.error("[v0] Failed to save session:", error)
                  }
                } else if (!user) {
                  console.log("[v0] Anonymous user - session not saved to database")
                } else if (!fullResponse.trim()) {
                  console.log("[v0] Empty response - session not saved")
                }

                controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                controller.close()
                return
              }

              const chunk = new TextDecoder().decode(value)
              const lines = chunk.split("\n")
              for (const line of lines) {
                if (line.startsWith("data: ") && !line.includes("[DONE]")) {
                  try {
                    const data = JSON.parse(line.slice(6))
                    const content = data.choices?.[0]?.delta?.content
                    if (content) {
                      fullResponse += content
                    }
                  } catch (e) {
                    // Ignore parsing errors for streaming chunks
                  }
                }
              }

              controller.enqueue(value)
              pump()
            })
            .catch((e) => controller.error(e))
        })()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error) {
    console.error("[v0] Coach chat API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
