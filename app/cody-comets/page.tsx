"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, Zap, GraduationCap, Target, Brain, Fuel, Moon, BookOpen, Star } from "lucide-react"
import { useState } from "react"

export default function CodyCometsPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary text-primary-foreground text-sm px-4 py-2">Beta Launch</Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Welcome <span className="text-green-500">Cody</span> <span className="text-green-500">Comets</span> — First
            Beta Users of Athletic Balance
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-4">
            It's not Artificial Intelligence. It's Athletic Intelligence™.
          </p>

          <p className="text-lg font-semibold text-lime-400 mb-8">
            Special shout-out to the <span className="text-green-500">Cody</span>{" "}
            <span className="text-green-500">Comets</span> Girls Basketball Team for leading the nation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("athlete-welcome")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-2xl font-semibold"
              aria-label="Open Athlete Daily Plan"
            >
              Open Your Daily Plan
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("parent-science")}
              className="border-slate-600 text-white hover:bg-slate-800 hover:text-white text-lg px-8 py-6 rounded-2xl bg-transparent"
              aria-label="View Parent Science Information"
            >
              Parent Science
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => scrollToSection("coach-guide")}
              className="text-white hover:bg-slate-800 text-lg px-8 py-6 rounded-2xl"
              aria-label="Access Coach Guide"
            >
              Coach Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Why This Matters - 3-up Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card border-border p-6 rounded-2xl">
              <CardContent className="p-0 text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">More Focus, Less Stress</h3>
                <p className="text-muted-foreground">Breathing, visualization, and one-word cues help lock in.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border p-6 rounded-2xl">
              <CardContent className="p-0 text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Recover Faster, Play Stronger</h3>
                <p className="text-muted-foreground">Water-first, protein + sleep = better energy.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border p-6 rounded-2xl">
              <CardContent className="p-0 text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Grades Up, Pressure Down</h3>
                <p className="text-muted-foreground">Short study sprints and planning keep school on track.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Athlete Welcome & Schedule */}
      <section id="athlete-welcome" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Your Quick Start</h2>

            <div className="text-center mb-12">
              <p className="text-xl text-muted-foreground mb-4">Short sessions. Big gains. Do these most days.</p>
            </div>

            {/* Daily Core Checklist */}
            <Card className="mb-12 p-6 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-6 text-center">Daily Core</h3>
              <div className="space-y-4">
                {[
                  {
                    id: "morning",
                    icon: Brain,
                    text: "Morning (2–3 min) — Coach Calm: 3 deep breaths + one-word cue for the day.",
                  },
                  {
                    id: "practice",
                    icon: Target,
                    text: "Before Practice (5 min) — Coach Clutch: imagine one good play (steal, rebound, finish).",
                  },
                  {
                    id: "after",
                    icon: Fuel,
                    text: "After Practice (5 min) — Coach Fuel: water + protein snack; app gives ideas.",
                  },
                  {
                    id: "night",
                    icon: Moon,
                    text: "Night (3 min) — The Lock-In™: 1 win, 1 thing to improve tomorrow.",
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <button
                        onClick={() => toggleCheck(item.id)}
                        className="mt-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                        aria-label={`Mark ${item.id} as complete`}
                      >
                        <CheckCircle
                          className={`h-6 w-6 transition-colors ${
                            checkedItems[item.id] ? "text-green-500" : "text-muted-foreground hover:text-primary"
                          }`}
                        />
                      </button>
                      <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <p className="text-foreground">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Game Week Plan */}
            <Card className="mb-8 p-6 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-6 text-center">Game Week Plan</h3>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { day: "Monday", title: "Reset & Homework Map", content: "Calm, A+, Fuel (sleep plan)." },
                  {
                    day: "Tuesday",
                    title: "Pressure Reps",
                    content: "Calm, A+ 15-min sprint, Lock-In (2 wins + 1 fix).",
                  },
                  {
                    day: "Wednesday",
                    title: "Game Day",
                    content: 'Calm cue ("Poise"), Clutch routine pregame; Reset + Fuel postgame.',
                  },
                  { day: "Thursday", title: "Adjustments + Study", content: "Calm, A+, Fuel." },
                  {
                    day: "Friday",
                    title: "Game Day",
                    content: 'Calm cue ("Energy"), Clutch pregame; Reset, Lock-In, Recover.',
                  },
                  {
                    day: "Saturday",
                    title: "Recover + School",
                    content: "Recover check, FlowState 20-min, Lock-In lesson.",
                  },
                  {
                    day: "Sunday",
                    title: "Weekly Review",
                    content: 'Lock-In (Wins→Friction→Lesson→Next), Mindset "YET," Fuel prep.',
                  },
                ].map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-semibold">{item.day}:</span> {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Coach O handles Coach Skills in practice. You focus on Calm, Clutch, Fuel,
                Lock-In, A+, Recover.
              </p>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground italic">
                Short daily reps train your brain and body to show up calm, confident, and ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Coaches */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Meet Your Coaches</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Coach Calm",
                  icon: Brain,
                  description: "Breathe, reset, chill.",
                  science: "Science: slows heart, clears mind.",
                },
                {
                  name: "Coach Clutch",
                  icon: Target,
                  description: "Confidence and game focus.",
                  science: "Science: visualization makes moves feel familiar.",
                },
                {
                  name: "Coach Fuel",
                  icon: Fuel,
                  description: "Food, water, sleep.",
                  science: "Science: body runs better with the right fuel and rest.",
                },
                {
                  name: "Coach Recover",
                  icon: Moon,
                  description: "Readiness + sleep anchor.",
                  science: "Science: you improve while recovering.",
                },
                {
                  name: "Coach A+",
                  icon: BookOpen,
                  description: "Homework map + study sprints.",
                  science: "Science: short focused bursts stick better.",
                },
                {
                  name: "The Lock-In™",
                  icon: Star,
                  description: "Write wins and next steps.",
                  science: "Science: reflection locks in learning.",
                },
              ].map((coach, index) => {
                const Icon = coach.icon
                return (
                  <Card key={index} className="p-6 rounded-2xl hover:shadow-lg transition-shadow">
                    <CardContent className="p-0 text-center space-y-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">{coach.name}</h3>
                      <p className="text-muted-foreground text-sm">{coach.description}</p>
                      <p className="text-xs text-muted-foreground italic">{coach.science}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Parent Science */}
      <section id="parent-science" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              For Parents: How the Coaches Work (and the Science Behind Them)
            </h2>

            <div className="text-center mb-12">
              <p className="text-lg text-muted-foreground">
                Athletic Balance gives your athlete short, guided routines (5–15 minutes) that build focus, healthy
                habits, and confidence. Below you'll find every coach, explained in plain language, with the why behind
                it and what you'll notice at home.
              </p>
            </div>

            {/* Accordion Group A - Meet Every Coach */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Meet Every Coach</h3>
              <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                {[
                  {
                    name: "Coach Calm — breathe, reset, focus",
                    whatItDoes:
                      "Teaches quick breathing and grounding to settle nerves before games, tests, and tough days.",
                    whyItWorks:
                      'Slow breathing lowers heart rate and shifts the body from "fight or flight" to "calm + focused," so thinking and reaction time improve.',
                    whatYoullNotice: "Fewer pre-game jitters, quicker cool-down after mistakes, calmer homework time.",
                  },
                  {
                    name: "Coach Clutch — confidence under pressure",
                    whatItDoes:
                      "Uses short visualizations and simple self-talk to prep big moments (free throws, last plays, tough matchups).",
                    whyItWorks:
                      "The brain fires similar pathways when we vividly imagine a skill—so the moment feels familiar instead of scary.",
                    whatYoullNotice: "More steady body language, less freezing up, better late-game decisions.",
                  },
                  {
                    name: "Coach Mindset — growth mindset & grit",
                    whatItDoes: 'Turns "I can\'t" into "I can\'t yet," logs wins, and reframes setbacks into lessons.',
                    whyItWorks: "Naming wins builds confidence; reframing keeps effort high, which drives improvement.",
                    whatYoullNotice: 'Less negative talk, more "I\'ll try again," and stronger follow-through.',
                  },
                  {
                    name: "Coach Fuel — nutrition, hydration, and sleep basics",
                    whatItDoes:
                      'Gives quick "what to eat/drink and when" (water-first, carb+protein after practice, steady sleep window).',
                    whyItWorks: "Muscles and the brain need fuel to adapt; sleep cements learning and speeds recovery.",
                    whatYoullNotice: "Smarter snack choices, consistent bedtime, better morning energy.",
                  },
                  {
                    name: "Coach Recover — readiness & load management",
                    whatItDoes: "Simple check-ins (energy 1–5), mini-resets, and sleep anchors to prevent burnout.",
                    whyItWorks:
                      "Small adjustments (earlier bedtime, short stretch) protect against overuse and keep energy steady.",
                    whatYoullNotice: 'Fewer "I\'m exhausted" days, smoother bounce-back after hard practices.',
                  },
                  {
                    name: "Coach Baker — time & habit builder",
                    whatItDoes:
                      'Creates small, repeatable routines ("After practice → snack + stretch + shower + homework block").',
                    whyItWorks: "Habit stacking removes decision fatigue so good choices happen automatically.",
                    whatYoullNotice: "More on-time routines, less chaos between practice and homework.",
                  },
                  {
                    name: "Coach Mimii™ — standards & consistency",
                    whatItDoes:
                      'Daily non-negotiables (water bottle, shoes packed, 10-minute study sprint) and identity statements ("I\'m the teammate who finishes strong").',
                    whyItWorks: 'Clear standards + identity drive consistent effort even on "off" days.',
                    whatYoullNotice: "Fewer reminders needed, steadier effort across the week.",
                  },
                  {
                    name: "Coach A+ — study skills & homework maps",
                    whatItDoes: "Breaks assignments into small pieces, plans study sprints, and teaches active recall.",
                    whyItWorks: "Short, focused blocks with testing-yourself beat long, distracted cramming.",
                    whatYoullNotice: "Less procrastination, quicker starts, fewer late-night scrambles.",
                  },
                  {
                    name: "FlowState™ — deep focus blocks",
                    whatItDoes:
                      "Sets a single target (one drill, one subject), removes distractions, and uses a timer.",
                    whyItWorks: 'One clear goal + immediate feedback = "in the zone" more often.',
                    whatYoullNotice: "Faster homework sessions and more purposeful practice.",
                  },
                  {
                    name: "The Lock-In™ — nightly reflection & weekly review",
                    whatItDoes: '"Wins → Friction → Lesson → Next step" in 2–5 minutes; weekly reset on Sundays.',
                    whyItWorks: "Small reflections lock in learning and keep momentum across the season.",
                    whatYoullNotice: "More gratitude, clearer plans, and fewer repeated mistakes.",
                  },
                  {
                    name: "The Reset™ — bounce-back after mistakes",
                    whatItDoes: 'Quick "Facts → Why → Next" routine to close the book on errors.',
                    whyItWorks: "Labeling what happened reduces stress; immediate next step prevents rumination.",
                    whatYoullNotice: "Shorter sulk time, quicker return to effort.",
                  },
                  {
                    name: "Coach Strong — strength & conditioning cues (optional at home)",
                    whatItDoes: "Simple warm-up priming and RPE (effort) checks to keep work safe and effective.",
                    whyItWorks: "Quality movement + gradual load = fewer injuries, better gains.",
                    whatYoullNotice: 'More consistent warm-ups, smarter pacing (not "all gas, no brakes").',
                  },
                  {
                    name: "Coach Skills — run on-court by Coach O",
                    whatItDoes: "Micro-drills and form cues (your coaching staff handles this in practice).",
                    whyItWorks: "One cue at a time; quality reps beat rushed reps.",
                    whatYoullNotice: "Cleaner footwork and decisions as the season progresses.",
                  },
                  {
                    name: "Coach ScholarFlow / BrandHuddle (as needed)",
                    whatItDoes: "College/recruiting basics; safe/social brand habits.",
                    whyItWorks: "Organized timelines and guardrails reduce stress and mistakes online.",
                    whatYoullNotice: "More thoughtful posts, better email/text etiquette with adults.",
                  },
                ].map((coach, index) => (
                  <AccordionItem key={index} value={`coach-${index}`}>
                    <AccordionTrigger className="text-left font-semibold">{coach.name}</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <strong className="text-foreground">What it does:</strong>
                        <span className="text-muted-foreground ml-2">{coach.whatItDoes}</span>
                      </div>
                      <div>
                        <strong className="text-foreground">Why it works (science):</strong>
                        <span className="text-muted-foreground ml-2">{coach.whyItWorks}</span>
                      </div>
                      <div>
                        <strong className="text-foreground">What you'll notice:</strong>
                        <span className="text-muted-foreground ml-2">{coach.whatYoullNotice}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Accordion Group B - The Core Science */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">The Core Science, Explained Simply</h3>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    name: "Flow & Focus",
                    whatItIs: 'The "in the zone" feeling when challenge matches skill.',
                    howWeUseIt: "One clear goal, short timers, quick feedback (FlowState™, Clutch, Calm).",
                    looksLike: "Headphones in, 15–20 minutes of schoolwork without phone hopping.",
                  },
                  {
                    name: "Habit Stacking",
                    whatItIs: "Attach a new habit to an existing one to make it stick.",
                    howWeUseIt: '"After practice → snack + stretch + shower + 15-minute study."',
                    looksLike: "Same routine every afternoon; fewer prompts from parents.",
                  },
                  {
                    name: "Recovery (Sleep, Fuel, Hydration)",
                    whatItIs: "The body improves between workouts if it has rest and nutrients.",
                    howWeUseIt: "Water-first, carb+protein after practice, steady sleep window.",
                    looksLike: "Night snack planned, water bottle refilled, lights-out target met.",
                  },
                  {
                    name: "Active Recall & Spaced Practice",
                    whatItIs: "Testing yourself in short bursts beats rereading; spacing beats cramming.",
                    howWeUseIt: "10–15 minute study sprints, quick quiz prompts (Coach A+).",
                    looksLike: "Flashcards or self-quizzing after dinner; less last-minute panic.",
                  },
                  {
                    name: "Emotion Labeling & Reframing",
                    whatItIs: 'Naming feelings lowers their intensity; "yet" turns blocks into goals.',
                    howWeUseIt: 'The Reset™ script and Coach Mindset\'s "YET" routine.',
                    looksLike: "\"I'm nervous → breathe → I'm ready\"; shorter cool-off after tough games.",
                  },
                  {
                    name: "One-Cue Learning",
                    whatItIs: "Focusing on one simple cue at a time improves skill faster.",
                    howWeUseIt: "Coach O handles on-court cues; app reinforces mental and recovery cues off-court.",
                    looksLike: 'Player mentions a single focus ("two feet on landings") for the week.',
                  },
                  {
                    name: "Autonomy & Ownership",
                    whatItIs: "Kids try harder when the plan feels like their plan.",
                    howWeUseIt: "The Lock-In™ has athletes choose their own small next step nightly.",
                    looksLike: "More initiative—homework started without being told; routine followed unprompted.",
                  },
                ].map((principle, index) => (
                  <AccordionItem key={index} value={`science-${index}`}>
                    <AccordionTrigger className="text-left font-semibold">{principle.name}</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <strong className="text-foreground">What it is:</strong>
                        <span className="text-muted-foreground ml-2">{principle.whatItIs}</span>
                      </div>
                      <div>
                        <strong className="text-foreground">How we use it:</strong>
                        <span className="text-muted-foreground ml-2">{principle.howWeUseIt}</span>
                      </div>
                      <div>
                        <strong className="text-foreground">Looks like:</strong>
                        <span className="text-muted-foreground ml-2">{principle.looksLike}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Closing Content */}
            <div className="text-center mb-8">
              <p className="text-lg text-muted-foreground mb-4">
                <strong>What improves with steady use:</strong> calmer pre-game nerves, faster recovery, better sleep,
                smarter food choices, shorter homework time, stronger confidence, and steadier grades.
              </p>
              <p className="text-muted-foreground italic">
                This isn't screen time—it's skill time. It supports your child as an athlete and a student.
              </p>
            </div>

            {/* How to Help at Home */}
            <Card className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">How to Help at Home</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Refill water bottle after dinner.",
                  "Keep a protein snack in the fridge.",
                  "Help protect a consistent bedtime.",
                  'Ask: "What was tonight\'s win and next step?"',
                ].map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Coach Guide */}
      <section id="coach-guide" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">For Coaches: Amplify Your Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { title: "Calm/Clutch", benefit: "Fewer meltdowns, better focus in drills." },
                { title: "Mimii/Baker (habits)", benefit: "On-time, prepared, accountable athletes." },
                { title: "Fuel/Recover", benefit: "Less fatigue, better late-game legs." },
                { title: "A+/FlowState", benefit: "Eligibility and fewer classroom issues." },
                { title: "Reset/Mindset/Lock-In", benefit: "Faster bounce-back = tougher team." },
              ].map((item, index) => (
                <Card key={index} className="p-6 rounded-2xl">
                  <CardContent className="p-0 space-y-3">
                    <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">How to Use</h3>
              <div className="space-y-3">
                {[
                  "Start practice with Calm (2–3 min).",
                  "End practice with Lock-In (1 win, 1 fix).",
                  "Game day: Clutch pre, Reset post.",
                  "Study blocks: A+ and FlowState once or twice a week.",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> You coach Skills on-court; the app coaches focus, fuel, recovery, and school.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact CTA Strip */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Why this helps the <span className="text-green-300">Cody</span>{" "}
            <span className="text-green-300">Comets</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
            {[
              { icon: Brain, text: "Show up calm and focused." },
              { icon: Zap, text: "Recover faster; play stronger." },
              { icon: Target, text: "Make smarter decisions under pressure." },
              { icon: GraduationCap, text: "Keep grades solid with less stress." },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex flex-col items-center space-y-3">
                  <Icon className="h-8 w-8" />
                  <p className="text-sm">{item.text}</p>
                </div>
              )
            })}
          </div>

          <Button
            size="lg"
            onClick={() => scrollToSection("athlete-welcome")}
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-2xl font-semibold"
            aria-label="Start My Daily Plan"
          >
            Start My Daily Plan
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How much time?",
                  answer: "5–15 minutes a day.",
                },
                {
                  question: "Does this replace coaches?",
                  answer: "No, it supports them.",
                },
                {
                  question: "What about privacy?",
                  answer: "Uses school-safe practices; no public sharing.",
                },
                {
                  question: "What if I miss a day?",
                  answer: "No problem. Start again tomorrow.",
                },
              ].map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Proudly launching with the <span className="text-green-500">Cody</span>{" "}
            <span className="text-green-500">Comets</span> Girls Basketball Team.
          </p>
          <p className="text-sm text-muted-foreground">
            It's not Artificial Intelligence. It's Athletic Intelligence™.
          </p>
        </div>
      </footer>
    </div>
  )
}
