"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User, Users, Home, LogOut, LogIn, BookOpen, Trophy } from "lucide-react"
import { createClient } from "@/lib/azure/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[v0] Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  // Don't show navigation on login page
  if (pathname === "/login") return null

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/coaches", label: "Coaches", icon: Users },
    { href: "/cody-comets", label: "Cody Comets", icon: Trophy },
    { href: "/guide", label: "Guide", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="text-xl font-bold text-primary">Athletic Balance</div>
        </Link>

        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                asChild
                className={cn(
                  "text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            )
          })}

          {!loading &&
            (user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-sm text-foreground hover:text-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignIn}
                className="text-sm text-foreground hover:text-foreground hover:bg-muted"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sign In</span>
              </Button>
            ))}
        </nav>
      </div>
    </header>
  )
}
