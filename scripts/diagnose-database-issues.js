import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Using service role to bypass RLS

console.log("[v0] Starting database diagnostic...")
console.log("[v0] Supabase URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
console.log("[v0] Service Role Key:", supabaseKey ? "✓ Set" : "✗ Missing")

if (!supabaseUrl || !supabaseKey) {
  console.error("[v0] Missing required environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runDiagnostic() {
  try {
    // Test 1: Check if tables exist
    console.log("\n[v0] === TABLE EXISTENCE CHECK ===")

    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (tablesError) {
      console.error("[v0] Error checking tables:", tablesError)
    } else {
      const tableNames = tables.map((t) => t.table_name)
      console.log("[v0] Found tables:", tableNames)

      const expectedTables = ["coaches", "coach_sessions", "profiles"]
      expectedTables.forEach((table) => {
        console.log(`[v0] ${table}:`, tableNames.includes(table) ? "✓ Exists" : "✗ Missing")
      })
    }

    // Test 2: Check coaches table
    console.log("\n[v0] === COACHES TABLE CHECK ===")
    const {
      data: coaches,
      error: coachesError,
      count: coachCount,
    } = await supabase.from("coaches").select("*", { count: "exact" })

    if (coachesError) {
      console.error("[v0] Error reading coaches:", coachesError)
    } else {
      console.log(`[v0] Coaches count: ${coachCount}`)
      if (coaches && coaches.length > 0) {
        console.log("[v0] Sample coach:", coaches[0])
      } else {
        console.log("[v0] No coaches found - need to seed data")
      }
    }

    // Test 3: Check coach_sessions table
    console.log("\n[v0] === COACH SESSIONS TABLE CHECK ===")
    const {
      data: sessions,
      error: sessionsError,
      count: sessionCount,
    } = await supabase.from("coach_sessions").select("*", { count: "exact" })

    if (sessionsError) {
      console.error("[v0] Error reading sessions:", sessionsError)
    } else {
      console.log(`[v0] Sessions count: ${sessionCount}`)
      if (sessions && sessions.length > 0) {
        console.log("[v0] Sample session:", sessions[0])
      } else {
        console.log("[v0] No sessions found")
      }
    }

    // Test 4: Check profiles table
    console.log("\n[v0] === PROFILES TABLE CHECK ===")
    const {
      data: profiles,
      error: profilesError,
      count: profileCount,
    } = await supabase.from("profiles").select("*", { count: "exact" })

    if (profilesError) {
      console.error("[v0] Error reading profiles:", profilesError)
    } else {
      console.log(`[v0] Profiles count: ${profileCount}`)
    }

    // Test 5: Try to insert a test coach session
    console.log("\n[v0] === TEST INSERT ===")
    const testSession = {
      user_id: "test-user-" + Date.now(),
      coach_name: "Coach Test",
      session_data: { messages: [{ role: "user", content: "Test message" }] },
      created_at: new Date().toISOString(),
    }

    const { data: insertData, error: insertError } = await supabase.from("coach_sessions").insert(testSession).select()

    if (insertError) {
      console.error("[v0] Error inserting test session:", insertError)
      console.log("[v0] This might indicate RLS policy issues or missing columns")
    } else {
      console.log("[v0] ✓ Test insert successful:", insertData)

      // Clean up test data
      await supabase.from("coach_sessions").delete().eq("user_id", testSession.user_id)
      console.log("[v0] ✓ Test data cleaned up")
    }

    // Test 6: Check RLS policies
    console.log("\n[v0] === RLS POLICIES CHECK ===")
    const { data: policies, error: policiesError } = await supabase
      .from("pg_policies")
      .select("schemaname, tablename, policyname, permissive, roles, cmd, qual")
      .in("tablename", ["coaches", "coach_sessions", "profiles"])

    if (policiesError) {
      console.error("[v0] Error checking RLS policies:", policiesError)
    } else {
      console.log("[v0] RLS Policies:")
      policies.forEach((policy) => {
        console.log(`[v0] - ${policy.tablename}.${policy.policyname} (${policy.cmd})`)
      })
    }
  } catch (error) {
    console.error("[v0] Diagnostic failed:", error)
  }
}

runDiagnostic()
