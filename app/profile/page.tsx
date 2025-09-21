import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Calendar, Trophy, School } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="bg-slate-800 border-slate-700 rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-slate-900" />
              </div>
              {profile?.full_name || "Athlete"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{user.email}</span>
            </div>
            {profile?.age && (
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{profile.age} years old</span>
              </div>
            )}
            {profile?.sport && (
              <div className="flex items-center gap-3 text-slate-300">
                <Trophy className="h-4 w-4 text-slate-400" />
                <span>{profile.sport}</span>
              </div>
            )}
            {profile?.school && (
              <div className="flex items-center gap-3 text-slate-300">
                <School className="h-4 w-4 text-slate-400" />
                <span>{profile.school}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Coming Soon</h2>

          <Card className="bg-slate-800/50 border-slate-700 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-2">Edit Profile</h3>
              <p className="text-slate-400 text-sm">Update your personal information, sport, and school details.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-slate-400 text-sm">
                View your coaching session history and track your improvement over time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-2">Goal Setting</h3>
              <p className="text-slate-400 text-sm">
                Set and track athletic and personal development goals with your coaches.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
