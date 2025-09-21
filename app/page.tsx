"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MessageSquare, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Condition your mind like your body. <span className="text-lime-400">Athletic Balance AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 text-balance">
            It's not artificial intelligence, it's athletic intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-2xl font-semibold"
            >
              <Link href="/coaches">
                Choose Your Coach
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-600 text-white hover:bg-slate-800 hover:text-white text-lg px-8 py-6 rounded-2xl bg-transparent"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <Card className="bg-card border-border p-6 rounded-2xl">
            <CardContent className="p-0 text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Text-Based Coaching</h3>
              <p className="text-muted-foreground">
                Get personalized guidance through simple text conversations with specialized AI coaches.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border p-6 rounded-2xl">
            <CardContent className="p-0 text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Science-Based</h3>
              <p className="text-muted-foreground">
                Grounded in sports psychology, flow theory, and deliberate practice research.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border p-6 rounded-2xl">
            <CardContent className="p-0 text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Weekly Progress</h3>
              <p className="text-muted-foreground">Coming Soon</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="mt-4 text-sm">© 2024 Athletic Balance. Condition your mind like your body.</p>
        </div>
      </footer>
    </div>
  )
}
