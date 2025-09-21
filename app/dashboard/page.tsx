"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BarChart3, Clock } from "lucide-react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface CoachSession {
  id: string
  title: string
  coach_id: string
  created_at: string
  coaches: {
    name: string
    emoji: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [recentSessions, setRecentSessions] = useState<CoachSession[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/login")
        return
      }

      setUser(user)

      // Get user profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        setUser({ ...user, profile })
      }

      // Get recent coach sessions
      const { data: sessions } = await supabase
        .from("coach_sessions")
        .select(`
          id,
          title,
          coach_id,
          created_at,
          coaches (
            name,
            emoji
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3)

      if (sessions) {
        setRecentSessions(sessions)
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  const firstName = user?.profile?.full_name?.split(" ")[0] || "Athlete"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Welcome */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Welcome back, {firstName}.</h2>
            <p className="text-muted-foreground">Ready to level up your training?</p>
          </div>

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Sessions</h3>
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <Card key={session.id} className="bg-card border-border rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{session.coaches.emoji}</span>
                          <div>
                            <p className="text-foreground font-medium">{session.title}</p>
                            <p className="text-muted-foreground text-sm flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(session.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Link href={`/coaches/${session.coach_id}`}>Continue</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid gap-6">
            <Card className="bg-card border-border rounded-2xl hover:bg-card/80 transition-colors">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary-foreground" />
                  </div>
                  Start a Session
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">
                  Connect with an AI coach for personalized guidance and training insights.
                </p>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                  <Link href="/coaches">Choose Your Coach</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Coming Soon Card */}
            <Card className="bg-card/50 border-border rounded-2xl opacity-75">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  Progress Insights
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Coming Soon</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground">
                  Detailed analytics and progress tracking across all your training areas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
