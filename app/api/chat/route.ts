import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCoachBySlug } from "@/lib/coaches"
import { handleApiError, validateRequired, AppError } from "@/lib/error-handler"
import {
  buildPositiveImagePrompt,
  extractPositiveContext,
  choosePositiveVisualType,
  wantsPositiveVisual,
  type PositiveVisual,
} from "@/lib/brand-visual-system"

/** ───────────────────────── VISUAL INTENT + PROMPT ENGINE ───────────────────────── **/

type VisualType = PositiveVisual

const VISUAL_KEYWORDS = [
  "play",
  "set",
  "formation",
  "scheme",
  "diagram",
  "draw",
  "sketch",
  "visualize",
  "chart",
  "graph",
  "menu",
  "plate",
  "drill",
  "steps",
  "how to",
  "layout",
  "template",
  "poster",
  "infographic",
  "illustration",
  "picture of",
  "image of",
  "show me",
  "can you show",
  "what does it look like",
  "generate an image",
  "make a graphic",
  "mockup",
  "design",
  // Positive messaging keywords
  "motivate",
  "inspire",
  "encourage",
  "boost",
  "confidence",
  "affirmation",
  "positive",
  "mindset",
  "card",
  "message",
]

const COACH_VISUAL_HINTS: Record<string, VisualType[]> = {
  "coach-skills": ["process_cue", "confidence_boost"],
  "coach-strong": ["confidence_boost", "affirmation_card"],
  "coach-focus": ["mindset_micro", "process_cue"],
  "coach-a-plus": ["affirmation_card", "mindset_micro"],
  "coach-calm": ["belonging_tile", "mindset_micro"],
  "coach-flow": ["process_cue", "mindset_micro"],
  "coach-fuel": ["confidence_boost", "process_cue"],
  "coach-clutch": ["confidence_boost", "affirmation_card"],
  "the-reset": ["mindset_micro", "process_cue"],
  "the-lock-in": ["affirmation_card", "confidence_boost"],
  "coach-watkins": ["confidence_boost", "process_cue"],
  "coach-neuro": ["process_cue", "mindset_micro"],
  "coach-recover": ["belonging_tile", "mindset_micro"],
  "coach-vision": ["confidence_boost", "affirmation_card"],
  "coach-scholarflow": ["mindset_micro", "affirmation_card"],
  "coach-brandhuddle": ["affirmation_card", "confidence_boost"],
}

function userExplicitlyAskedForImage(text: string) {
  const t = text.toLowerCase()
  return VISUAL_KEYWORDS.some((k) => t.includes(k))
}

function coachClearlyOfferedVisual(text: string) {
  const t = text.toLowerCase()
  console.log("[v0] Checking coach visual offer for text:", t.slice(0, 100))

  const hasVisualOffer =
    t.includes("i'll create a diagram") ||
    t.includes("i'll draw") ||
    t.includes("i'll make a diagram") ||
    t.includes("i'll generate") ||
    t.includes("let me create a visual") ||
    t.includes("let me draw") ||
    t.includes("let me make a diagram") ||
    t.includes("let me generate that visual") ||
    t.includes("here's a diagram") ||
    t.includes("here's a visual") ||
    t.includes("creating a diagram") ||
    t.includes("generating a visual") ||
    // Positive messaging offers
    t.includes("i'll create a motivational") ||
    t.includes("let me make an affirmation") ||
    t.includes("here's an encouraging") ||
    t.includes("i'll design a confidence") ||
    (t.includes("visual") && (t.includes("create") || t.includes("generate") || t.includes("make"))) ||
    (t.includes("diagram") && (t.includes("create") || t.includes("generate") || t.includes("make"))) ||
    (t.includes("card") && (t.includes("motivational") || t.includes("positive") || t.includes("affirmation")))

  console.log("[v0] Coach visual offer detected:", hasVisualOffer)
  return hasVisualOffer
}

function extractContext(messages: Array<{ role: string; content: string }>) {
  return extractPositiveContext(messages)
}

function chooseVisualType(coachSlug: string | null, ctx: ReturnType<typeof extractContext>): VisualType {
  // Use positive messaging visual selection
  const visualType = choosePositiveVisualType(ctx)

  // Consider coach preferences as a secondary factor
  const coachPrefs = coachSlug ? COACH_VISUAL_HINTS[coachSlug] : null
  if (coachPrefs && coachPrefs.includes(visualType)) {
    return visualType
  }

  return visualType
}

function buildImagePrompt(
  visualType: VisualType,
  userMessage: string,
  coachResponse: string,
  ctx: ReturnType<typeof extractContext>,
): { prompt: string; alt: string; size: "1024x1024" | "1024x1792" } {
  // All visual types are now positive messaging types
  const messages = [
    { role: "user", content: userMessage },
    { role: "assistant", content: coachResponse },
  ]
  const positiveCtx = extractPositiveContext(messages)
  return buildPositiveImagePrompt(visualType, userMessage, coachResponse, positiveCtx)
}

function maybeBuildVisualPrompt(
  coachSlug: string | null,
  messages: Array<{ role: string; content: string }>,
  coachResponse: string,
) {
  console.log("[v0] Checking if should build visual prompt")
  console.log("[v0] Coach response:", coachResponse.slice(0, 100))

  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || ""
  const userWantsImage = userExplicitlyAskedForImage(lastUser)
  const coachOffersVisual = coachClearlyOfferedVisual(coachResponse)
  const userWantsPositive = wantsPositiveVisual(lastUser)

  console.log("[v0] User wants image:", userWantsImage)
  console.log("[v0] Coach offers visual:", coachOffersVisual)
  console.log("[v0] User wants positive:", userWantsPositive)

  const wantsImage = userWantsImage || coachOffersVisual || userWantsPositive
  console.log("[v0] Final wants image decision:", wantsImage)

  if (!wantsImage) return null

  const ctx = extractContext(messages)
  const type = chooseVisualType(coachSlug, ctx)
  console.log("[v0] Visual type chosen:", type)

  const imageData = buildImagePrompt(type, lastUser, coachResponse, ctx)
  return { type, ...imageData }
}

async function generateImageB64(prompt: string, size: "1024x1024" | "1024x1792" = "1024x1024"): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size, // ← use smart size
        quality: "standard",
        style: "natural",
        response_format: "b64_json",
      }),
    })
    if (!res.ok) {
      console.error("[visuals] Image gen failed:", res.status, await res.text())
      return null
    }
    const data = await res.json()
    return data?.data?.[0]?.b64_json ?? null
  } catch (e) {
    console.error("[visuals] Image gen error:", e)
    return null
  }
}

async function uploadToSupabasePNG(supabase: any, b64: string): Promise<string | null> {
  try {
    if (!supabase) return null
    const bytes = Buffer.from(b64, "base64")
    const filePath = `coach-images/${Date.now()}-${Math.random().toString(36).slice(2)}.png`
    const { data: up, error } = await supabase.storage.from("coach_images").upload(filePath, bytes, {
      contentType: "image/png",
      upsert: false,
    })
    if (error) {
      console.log("[visuals] supabase upload error", error)
      return null
    }
    const { data: urlData } = await supabase.storage.from("coach_images").getPublicUrl(up.path)
    return urlData?.publicUrl || null
  } catch (e) {
    console.log("[visuals] supabase upload exception", e)
    return null
  }
}

/** ─────────────────────────────────── CHAT ROUTE ─────────────────────────────────── **/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => {
      throw new AppError("Invalid JSON in request body", 400)
    })

    const { systemPrompt, messages, coachSlug, sessionId, conversationContext } = body

    if (!Array.isArray(messages)) throw new AppError("Messages must be an array", 400)
    if (messages.length === 0) throw new AppError("At least one message is required", 400)
    if (!process.env.OPENAI_API_KEY) throw new AppError("AI service temporarily unavailable", 503)

    let finalSystemPrompt = systemPrompt
    let coach: any = null
    let supabase: any = null
    let user: any = null

    try {
      supabase = await createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) user = authUser
    } catch {
      // best effort
    }

    if (coachSlug) {
      const validatedCoachSlug = validateRequired(coachSlug, "coachSlug")
      coach = getCoachBySlug(validatedCoachSlug)
      if (!coach) throw new AppError("Coach not found", 404)
      finalSystemPrompt = coach.systemPrompt
    }

    if (!finalSystemPrompt?.trim()) throw new AppError("System prompt is required", 400)

    let enhancedSystemPrompt = finalSystemPrompt
    if (conversationContext) {
      const contextInfo = []

      if (conversationContext.keyTopics?.length > 0) {
        contextInfo.push(`Previous topics discussed: ${conversationContext.keyTopics.join(", ")}`)
      }

      if (conversationContext.userPreferences && Object.keys(conversationContext.userPreferences).length > 0) {
        contextInfo.push(`User preferences: ${JSON.stringify(conversationContext.userPreferences)}`)
      }

      if (conversationContext.messageCount > 5) {
        contextInfo.push(`This is an ongoing conversation with ${conversationContext.messageCount} messages`)
      }

      if (contextInfo.length > 0) {
        enhancedSystemPrompt += `\n\nConversation Context:\n${contextInfo.join("\n")}\n\nUse this context to provide more personalized and relevant responses while maintaining conversation continuity.`
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const preparedMessages = messages
      .map((m: any) => ({ role: m.role || "user", content: String(m.content || "").trim() }))
      .filter((m: any) => m.content.length > 0)

    const maxContextMessages = 20 // Limit to prevent context window overflow
    const contextMessages =
      preparedMessages.length > maxContextMessages
        ? [
            ...preparedMessages.slice(0, 2), // Keep first 2 messages for context
            { role: "system", content: "[Previous conversation context summarized above]" },
            ...preparedMessages.slice(-maxContextMessages + 3), // Keep recent messages
          ]
        : preparedMessages

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: enhancedSystemPrompt }, ...contextMessages],
        stream: false,
        max_tokens: 1000,
        temperature: 0.7,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId))

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text().catch(() => "Unknown error")
      const code = openaiResponse.status
      console.error("[chat] OpenAI error", code, errText)
      if (code === 401) throw new AppError("AI service authentication failed", 503)
      if (code === 429) throw new AppError("AI service rate limit exceeded, please try again later", 429)
      if (code >= 500) throw new AppError("AI service temporarily unavailable", 503)
      throw new AppError("Failed to generate response", 500)
    }

    const data = await openaiResponse.json().catch(() => {
      throw new AppError("Invalid response from AI service", 500)
    })

    const responseMessage: string = data.choices?.[0]?.message?.content?.trim()
    if (!responseMessage) throw new AppError("No response generated by AI service", 500)

    let image: { url?: string; b64?: string; alt: string; prompt: string; type: VisualType } | null = null
    console.log("[v0] About to check for visual generation")
    const visualPlan = maybeBuildVisualPrompt(coachSlug || null, messages, responseMessage)
    console.log("[v0] Visual plan result:", visualPlan ? "WILL GENERATE" : "NO VISUAL")

    if (visualPlan) {
      const { prompt, alt, size } = buildImagePrompt(
        visualPlan.type,
        [...messages].reverse().find((m) => m.role === "user")?.content || "",
        responseMessage,
        extractContext(messages),
      )

      console.log("[v0] Starting image generation with prompt:", prompt.slice(0, 100))

      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size, // 👈 use computed size
          quality: "standard",
          style: "natural",
          response_format: "b64_json",
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const b64 = data?.data?.[0]?.b64_json

        if (b64) {
          console.log("[v0] Image generation result: SUCCESS")
          const publicUrl = await uploadToSupabasePNG(supabase, b64)
          console.log("[v0] Image upload result:", publicUrl ? "SUCCESS" : "USING_B64")

          image = publicUrl
            ? { url: publicUrl, alt, prompt, type: visualPlan.type }
            : { b64, alt, prompt, type: visualPlan.type }
        }
      } else {
        console.error("[v0] Image generation failed:", res.status, await res.text())
      }
    }

    if (supabase && user && coach && coachSlug) {
      try {
        const assistantMessage: any = image
          ? {
              role: "assistant",
              content: responseMessage,
              imageUrl: image.url,
              imageType: image.type,
              imageB64: image.b64,
              timestamp: new Date().toISOString(),
            }
          : { role: "assistant", content: responseMessage, timestamp: new Date().toISOString() }

        const updatedMessages = [...messages, assistantMessage]
        const title = (messages[0]?.content || "New Session").toString().slice(0, 50) + "..."

        const sessionData = {
          messages: updatedMessages,
          title,
          updated_at: new Date().toISOString(),
          conversation_context: conversationContext || {},
          message_count: updatedMessages.length,
        }

        if (sessionId) {
          await supabase.from("coach_sessions").update(sessionData).eq("id", sessionId).eq("user_id", user.id)
        } else {
          const { data: newSession } = await supabase
            .from("coach_sessions")
            .insert({
              user_id: user.id,
              coach_id: coach.id,
              ...sessionData,
            })
            .select("id")
            .single()

          if (newSession) {
            return Response.json({
              message: responseMessage,
              image,
              usage: data.usage || null,
              sessionId: newSession.id,
            })
          }
        }
      } catch (e) {
        console.log("[chat] Non-fatal session save error:", e)
      }
    }

    return Response.json({
      message: responseMessage,
      image,
      usage: data.usage || null,
      sessionId: sessionId || null,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return handleApiError(new AppError("Request timeout, please try again", 408))
    }
    return handleApiError(error)
  }
}
