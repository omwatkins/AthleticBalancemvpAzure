"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  GraduationCap,
  Heart,
  Zap,
  Calendar,
  Dumbbell,
  Flame,
  Brain,
  Target,
  RotateCcw,
  Focus,
  Apple,
  Waves,
  BookOpen,
  Navigation,
  Gamepad2,
  Bed,
  Eye,
  Trophy,
  Smartphone,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const coaches = [
  {
    name: "Coach A+",
    subtitle: "Homework Helper",
    icon: GraduationCap,
    personality: "Organized, patient, solution-focused",
    science: "Learning psychology, study strategy, retrieval practice",
    use: "Best for keeping grades up during the season",
    example: "Build a homework map for the week so nothing piles up",
    color: "bg-blue-500",
  },
  {
    name: "Coach Calm",
    subtitle: "The Inner Peace Plug",
    icon: Heart,
    personality: "Gentle, grounding, steadying presence",
    science: "Mindfulness, stress physiology, mental reset tools",
    use: "Best before competitions or after a stressful school day",
    example: "Practice box breathing and set a cue word for tomorrow's game",
    color: "bg-green-500",
  },
  {
    name: "Coach Clutch",
    subtitle: "Game-Time Grinder",
    icon: Zap,
    personality: "Energizing but composed; hype with focus",
    science: "Performance psychology, arousal control, pressure training",
    use: "Best pre-game or in high-pressure moments",
    example: "Script your 5-step pre-game routine",
    color: "bg-yellow-500",
  },
  {
    name: "Coach Baker",
    subtitle: "The Life Architect",
    icon: Calendar,
    personality: "No-nonsense planner, efficient, practical",
    science: "Time management, habit stacking, productivity science",
    use: "Best for athletes balancing practice, games, and school",
    example: "Build your weekly time-block schedule",
    color: "bg-purple-500",
  },
  {
    name: "Coach Strong",
    subtitle: "Strength Strategist",
    icon: Dumbbell,
    personality: "High-energy, form-first motivator",
    science: "Strength & conditioning, progressive overload",
    use: "Best for off-season growth or safe in-season maintenance",
    example: "Plan one progressive overload rep scheme with recovery cues",
    color: "bg-red-500",
  },
  {
    name: "Coach Mimii™",
    subtitle: "The Relentless Mentor",
    icon: Flame,
    personality: "Tough-love, no excuses, standards-driven",
    science: "Grit research, perseverance psychology",
    use: "Best when motivation dips",
    example: "Define two daily non-negotiables and act on one right now",
    color: "bg-orange-500",
  },
  {
    name: "Coach Mindset",
    subtitle: "The Optimist Operator",
    icon: Brain,
    personality: "Upbeat reframer, curious coach",
    science: "Growth mindset, positive psychology",
    use: "Best when dealing with setbacks or confidence dips",
    example: 'Reframe a "can\'t" into a "can\'t yet"',
    color: "bg-pink-500",
  },
  {
    name: "Coach Skills",
    subtitle: "The Mechanics Maestro",
    icon: Target,
    personality: "Precision teacher, one-cue focus",
    science: "Motor learning, deliberate practice, video feedback loops",
    use: "Best for skill development in drills or technique work",
    example: "Break one skill into a micro-drill with a clear cue",
    color: "bg-indigo-500",
  },
  {
    name: "The Reset™",
    subtitle: "The Comeback Coach",
    icon: RotateCcw,
    personality: "Compassionate but forward-focused",
    science: "Resilience, emotional regulation",
    use: "Best after losses, mistakes, or injuries",
    example: "Do a quick After-Action Review (What, Why, Next)",
    color: "bg-teal-500",
  },
  {
    name: "Coach Focus",
    subtitle: "The Distraction Destroyer",
    icon: Focus,
    personality: "Minimalist laser, no wasted motion",
    science: "Cognitive control, focus sprint science",
    use: "Best for schoolwork, film study, or deep practice",
    example: "Run a 7-minute deep-focus sprint with one task only",
    color: "bg-cyan-500",
  },
  {
    name: "Coach Fuel™",
    subtitle: "The Energy Expert",
    icon: Apple,
    personality: "Budget-aware, practical nutrition buddy",
    science: "Sports nutrition, hydration, sleep cycles",
    use: "Best for game-day fueling and sleep consistency",
    example: "Build a pre-game snack and post-game recovery plan",
    color: "bg-lime-500",
  },
  {
    name: "FlowState™",
    subtitle: "The Zone Guide",
    icon: Waves,
    personality: "Calm systems thinker, process-driven",
    science: "Flow theory, challenge-skill calibration",
    use: "Best for long practice sessions or studying",
    example: "Remove distractions, define success signals, and enter the zone",
    color: "bg-emerald-500",
  },
  {
    name: "The Lock-In™",
    subtitle: "The Reflection Coach",
    icon: BookOpen,
    personality: "Patient analyst, reflective and clear",
    science: "Self-regulated learning, journaling psychology",
    use: "Best at week's end for reflection",
    example: "Wins → Friction → Lesson → Next Action",
    color: "bg-violet-500",
  },
  {
    name: "Coach Watkins™",
    subtitle: "The Coaches' Coach",
    icon: Navigation,
    personality: "Wise builder, clear standards, practical templates",
    science: "Leadership science, pedagogy, culture development",
    use: "Best for captains, peer leaders, or future coaches",
    example: "Design a practice block with measurable outcomes",
    color: "bg-amber-500",
  },
  {
    name: "Coach Neuro",
    subtitle: "The Brain Trainer",
    icon: Gamepad2,
    personality: "Playful, puzzle-loving scientist",
    science: "Neuroplasticity, cognitive training",
    use: "Best for athletes who want sharper reactions and decision speed",
    example: "Dual-task drill (footwork + quick decision game)",
    color: "bg-rose-500",
  },
  {
    name: "Coach Recover",
    subtitle: "The Sleep Architect",
    icon: Bed,
    personality: "Spa-like calm, recovery first",
    science: "Sleep science, circadian rhythms",
    use: "Best for rest routines, in-season recovery",
    example: "Build a 3-step pre-sleep ritual",
    color: "bg-slate-500",
  },
  {
    name: "Coach Vision",
    subtitle: "The Mental Imagery Mentor",
    icon: Eye,
    personality: "Creative director, mental movie guide",
    science: "Sports imagery, mirror neurons",
    use: "Best before big games or skill sessions",
    example: "Multi-sensory run-through of tomorrow's event",
    color: "bg-fuchsia-500",
  },
  {
    name: "Coach ScholarFlow",
    subtitle: "The College Connector",
    icon: Trophy,
    personality: "Organized guidance counselor meets coach",
    science: "Recruiting process, eligibility requirements",
    use: "Best for high school athletes planning for college",
    example: "Build a recruiting timeline with outreach goals",
    color: "bg-sky-500",
  },
  {
    name: "Coach BrandHuddle",
    subtitle: "The NIL & Social Playmaker",
    icon: Smartphone,
    personality: "Social-savvy, business-minded big sibling",
    science: "NIL rules, personal branding, social media literacy",
    use: "Best for athletes building their image safely",
    example: "Clean up profiles and plan one weekly post",
    color: "bg-emerald-600",
  },
]

const schedules = [
  {
    title: "Game Day Excellence (in-season)",
    items: [
      "Pre-game: Coach Clutch (routine) + Coach Calm (lower nerves)",
      "Post-game: The Reset (bounce back)",
      "Weekly: Coach Focus for film study, Coach Fuel for energy",
    ],
  },
  {
    title: "Off-Season Growth",
    items: [
      "Strength: Coach Strong 3× week",
      "Skill: Coach Skills 3× week",
      "Mindset: Coach Mimii once per week for grit, Coach Flow before long drills",
    ],
  },
  {
    title: "Balance School + Sport",
    items: [
      "Homework: Coach A+ (2× week)",
      "Scheduling: Coach Baker (Sunday night)",
      "Energy: Coach Fuel (daily routines)",
      "Reflection: The Lock-In (weekly)",
    ],
  },
  {
    title: "Future Prep (Recruiting & NIL)",
    items: [
      "Coach ScholarFlow: recruiting plan",
      "Coach BrandHuddle: NIL/social habits",
      "Coach Watkins: leadership and culture training",
    ],
  },
]

const sciencePrinciples = [
  {
    name: "Flow Theory",
    description: 'Find "the zone" by matching skill and challenge',
  },
  {
    name: "Deliberate Practice",
    description: "Small, focused drills with feedback build mastery",
  },
  {
    name: "Growth Mindset",
    description: "Failures become stepping stones to skills",
  },
  {
    name: "Recovery Science",
    description: "Sleep, nutrition, and stress resets fuel performance",
  },
  {
    name: "Positive Psychology",
    description: "Gratitude, reframing, and focusing on strengths grow confidence",
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Athletic Balance AI – Usage Guide & Core Guarantee Advantage
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-3xl mx-auto">
            Science-based AI coaching to help student-athletes train their minds just like they train their bodies. Each
            15-minute session gives you clear insights, practical tools, and measurable next actions.
          </p>
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/coaches">
              Start Coaching Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Why Athletic Balance AI */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Why Athletic Balance AI?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Athletic Balance AI is built on sports science and psychology to help student-athletes train their minds
              just like they train their bodies. Each 15-minute session with a coach gives you clear insights, practical
              tools, and a measurable next action.
            </p>
            <p className="text-muted-foreground">
              While the NCAA Core Guarantees (effective Aug. 1, 2024) set a new standard for college athletes, Athletic
              Balance AI brings these resources down to middle school and high school athletes—so you're prepared before
              you even step on a college campus.
            </p>
          </CardContent>
        </Card>

        {/* Science Foundation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Part 1 – The Science in Simple Words</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sciencePrinciples.map((principle, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <h3 className="font-semibold mb-2">{principle.name}</h3>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6">
            Every Athletic Balance coach is built on one or more of these research-based foundations.
          </p>
        </div>

        <Separator className="my-12" />

        {/* Meet Your Coaches */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Part 2 – Meet Your Coaches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach, index) => {
              const IconComponent = coach.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${coach.color}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{coach.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{coach.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Personality
                      </Badge>
                      <p className="text-sm">{coach.personality}</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Science Base
                      </Badge>
                      <p className="text-sm">{coach.science}</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Best For
                      </Badge>
                      <p className="text-sm">{coach.use}</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Example Session
                      </Badge>
                      <p className="text-sm italic">"{coach.example}"</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Example Schedules */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Part 3 – Example Schedules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedules.map((schedule, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{schedule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {schedule.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* NCAA Comparison */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Part 4 – NCAA Core Guarantees vs. Athletic Balance AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">NCAA Core Guarantees (effective Aug. 1, 2024) promise:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Academic services</li>
                <li>• Career counseling</li>
                <li>
                  • Life skills training in 9 areas (mental health, DEI, sexual violence prevention, transfer rules,
                  S&C, nutrition, financial literacy, career prep, NIL)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Athletic Balance AI Advantage:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Middle and high school athletes get these same supports before college
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Instead of waiting until you're a D1 athlete, you build these habits now
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Coaches like Coach A+, Coach Fuel, Coach ScholarFlow, Coach BrandHuddle, and Coach Calm directly
                    align with NCAA's nine guarantees
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    This means: Athletic Balance AI is basically the NCAA Core Guarantees—delivered years earlier,
                    personalized, and on your phone
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/coaches">
              Choose Your Coach & Start Training
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
