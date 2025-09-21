import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("🔍 Testing database connections...")
console.log("Supabase URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
console.log("Service Role Key:", supabaseKey ? "✅ Set" : "❌ Missing")

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing required environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  let testsPassed = 0
  let totalTests = 0
  const errors = []

  try {
    console.log("\n📊 Running automated database tests...")

    // Test 1: Check if tables exist
    totalTests++
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (tablesError) {
      errors.push(`Tables query failed: ${tablesError.message}`)
      console.error("❌ Test 1 FAILED: Error fetching tables:", tablesError.message)
    } else {
      const tableNames = tables.map((t) => t.table_name)
      const requiredTables = ["coaches", "profiles", "coach_sessions"]
      const missingTables = requiredTables.filter((table) => !tableNames.includes(table))

      if (missingTables.length > 0) {
        errors.push(`Missing required tables: ${missingTables.join(", ")}`)
        console.error("❌ Test 1 FAILED: Missing tables:", missingTables)
      } else {
        testsPassed++
        console.log("✅ Test 1 PASSED: All required tables exist")
        console.log("📋 Found tables:", tableNames)
      }
    }

    // Test 2: Check coaches table has data and expected structure
    totalTests++
    const { data: coaches, error: coachesError } = await supabase
      .from("coaches")
      .select("id, name, emoji, slug")
      .limit(5)

    if (coachesError) {
      errors.push(`Coaches table query failed: ${coachesError.message}`)
      console.error("❌ Test 2 FAILED: Error fetching coaches:", coachesError.message)
    } else if (!coaches || coaches.length === 0) {
      errors.push("Coaches table is empty - no coaches found")
      console.error("❌ Test 2 FAILED: No coaches found in database")
    } else {
      const hasRequiredFields = coaches.every((coach) => coach.id && coach.name && coach.emoji)
      if (!hasRequiredFields) {
        errors.push("Coaches missing required fields (id, name, emoji)")
        console.error("❌ Test 2 FAILED: Coaches missing required fields")
      } else {
        testsPassed++
        console.log(`✅ Test 2 PASSED: Found ${coaches.length} coaches with required fields`)
        coaches.forEach((coach) => {
          console.log(`   ${coach.emoji} ${coach.name} (${coach.id})`)
        })
      }
    }

    // Test 3: Check profiles table accessibility and structure
    totalTests++
    const { data: profilesTest, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, created_at")
      .limit(1)

    if (profilesError && !profilesError.message.includes("0 rows")) {
      errors.push(`Profiles table access failed: ${profilesError.message}`)
      console.error("❌ Test 3 FAILED: Error accessing profiles:", profilesError.message)
    } else {
      testsPassed++
      console.log("✅ Test 3 PASSED: Profiles table accessible with correct structure")
    }

    // Test 4: Check coach_sessions table accessibility and structure
    totalTests++
    const { data: sessionsTest, error: sessionsError } = await supabase
      .from("coach_sessions")
      .select("id, user_id, coach_id, created_at")
      .limit(1)

    if (sessionsError && !sessionsError.message.includes("0 rows")) {
      errors.push(`Coach sessions table access failed: ${sessionsError.message}`)
      console.error("❌ Test 4 FAILED: Error accessing coach_sessions:", sessionsError.message)
    } else {
      testsPassed++
      console.log("✅ Test 4 PASSED: Coach sessions table accessible with correct structure")
    }

    console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`)

    if (errors.length > 0) {
      console.error("\n❌ TEST FAILURES:")
      errors.forEach((error, index) => {
        console.error(`   ${index + 1}. ${error}`)
      })
      console.error("\n💥 Database tests FAILED - fix the above issues before proceeding")
      process.exit(1)
    } else {
      console.log("\n🎉 All database tests PASSED - database is ready for use!")
      process.exit(0)
    }
  } catch (error) {
    console.error("❌ CRITICAL ERROR during testing:", error.message)
    console.error("💥 Database tests FAILED with unexpected error")
    process.exit(1)
  }
}

testConnection()
