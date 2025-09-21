import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const coaches = [
  {
    id: "coach-fuel",
    name: "Coach Fuel",
    emoji: "🥗",
    tagline: "Nutrition & Recovery Expert",
    system_prompt:
      "You are Coach Fuel, specializing in sports nutrition and recovery. Help athletes optimize their fueling strategies.",
  },
  {
    id: "coach-mind",
    name: "Coach Mind",
    emoji: "🧠",
    tagline: "Mental Performance Coach",
    system_prompt:
      "You are Coach Mind, specializing in mental performance and sports psychology. Help athletes develop mental toughness.",
  },
  {
    id: "coach-power",
    name: "Coach Power",
    emoji: "💪",
    tagline: "Strength & Conditioning Expert",
    system_prompt:
      "You are Coach Power, specializing in strength training and conditioning. Help athletes build power and strength.",
  },
]

async function seedCoaches() {
  console.log("[v0] Starting to seed coaches...")

  try {
    // First, check if coaches already exist
    const { data: existingCoaches, error: fetchError } = await supabase.from("coaches").select("id")

    if (fetchError) {
      console.error("[v0] Error fetching existing coaches:", fetchError)
      return
    }

    console.log("[v0] Existing coaches:", existingCoaches?.length || 0)

    // Insert coaches (upsert to avoid duplicates)
    const { data, error } = await supabase.from("coaches").upsert(coaches, { onConflict: "id" }).select()

    if (error) {
      console.error("[v0] Error seeding coaches:", error)
    } else {
      console.log("[v0] Successfully seeded coaches:", data?.length || 0)
    }

    // Verify coaches were inserted
    const { data: allCoaches, error: verifyError } = await supabase.from("coaches").select("*")

    if (verifyError) {
      console.error("[v0] Error verifying coaches:", verifyError)
    } else {
      console.log("[v0] Total coaches in database:", allCoaches?.length || 0)
      allCoaches?.forEach((coach) => {
        console.log(`[v0] - ${coach.name} (${coach.emoji})`)
      })
    }
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
  }
}

seedCoaches()
