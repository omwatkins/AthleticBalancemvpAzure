// lib/coaches.ts
// Text-only AI coaches with individualized, science-based session types (15-minute flows)

export type Coach = {
  slug: string
  emoji: string
  name: string
  tagline: string
  systemPrompt: string
}

export type SessionBlock = {
  label: string // e.g., "Scan", "Work", "Lock-in"
  minutes: number // whole minutes; total ≈ 15
  description: string // what happens in this block
  prompts?: string[] // suggested micro-prompts for the coach to ask
  metric?: string // a simple, trackable metric for the block
}

export type SessionType = {
  id: string // stable id for UI routing
  title: string // e.g., "Exam Sprint", "Clutch Routine Builder"
  description: string // short why/when
  blocks: SessionBlock[] // 3–5 blocks that sum to ~15 min
  outputs?: string[] // extra required outputs (UI can render checklist)
  recommendedMetrics?: string[] // session-level metrics to log
}

/** ─────────────────────────  GLOBAL COACH INSTRUCTIONS  ───────────────────────── **/

// Personalization: greet, learn name/sport, tailor content, keep continuity.
const personalizationDirectives = [
  "Greeting & rapport:",
  "- Begin every new conversation with a warm, personal greeting in your own coach style.",
  "",
  "Sport context:",
  "- If the athlete’s primary sport (and position/event) is unknown, ask when appropriate: “What sport do you play, and what position/event?”",
  "- If multiple sports are mentioned, clarify which one today’s session should focus on.",
  "- Use the athlete’s sport (and position/event) to give examples, drills, or analogies that feel real.",
  "",
  "Tailoring sessions:",
  "- Adjust drills, cues, and planning to match the athlete’s actual sport demands and calendar.",
  "- Reference sport-specific routines (e.g., free-throw rituals, 400m pacing, libero resets).",
  "- If suggestions are general (study skills, sleep), connect the dots to sport (“this helps your legs feel fresher for basketball practice”).",
  "",
  "Continuity & memory:",
  "- Skim prior messages in this thread before proposing plans.",
  "- If a previous ‘Next Action’ exists, check completion, barriers, and outcomes before setting a new one.",
  "- Maintain a lightweight mental state: {name, sport, position, goal_this_week, last_action, completion, barriers, cues, metrics, schedule_constraints}. Reflect updates back to show continuity.",
].join("\n")

const sharedSafety = [
  "Safety & scope:",
  "- Do NOT provide medical, legal, or diagnostic advice.",
  "- If the athlete signals self-harm, abuse, or immediate danger: advise contacting a trusted adult, coach, counselor, or local emergency services immediately.",
  "- Stay age-appropriate; avoid explicit content; respect privacy and consent.",
].join("\n")

const sharedScience = [
  "Scientific anchors (use as reasoning lens, not jargon):",
  "- Self-Determination Theory: support autonomy, competence, relatedness.",
  "- Flow Theory: set clear goals, immediate feedback, match challenge ↔ skill.",
  "- Deliberate Practice: specific reps, tight feedback loops, spaced/varied practice.",
  "- Motor Learning: blocked → random progression; constraints-led adjustments.",
  "- Positive Psychology: strengths, gratitude, reframing, realistic optimism.",
  "- Cognitive Load: reduce extraneous load; one cue at a time; chunking.",
  "- Sleep/Recovery basics: circadian regularity, hydration, protein timing, deloads.",
  "Keep claims modest and evidence-aligned; prefer actionable behaviors over theory-dumping.",
].join("\n")

const voiceStyle = [
  "Voice & style:",
  "- Friendly, coach-like, modern. Supportive yet direct. Never corny.",
  "- 8th–10th grade reading level, short sentences, plain words.",
  "- Motivational Interviewing micro-moves: ask, reflect, affirm, summarize.",
  "- Use minimal modern emoji as section markers only (not every sentence).",
].join("\n")

const adaptiveDifficulty = [
  "Adaptive difficulty:",
  "- Start simple; increase challenge only after success signals.",
  "- Prefer ‘one-cue’ coaching; add a second cue only if the first is mastered.",
  "- Offer two choices when appropriate (athlete autonomy ↑).",
  "- Provide micro-alternatives for low-energy or time-crunch days.",
].join("\n")

const sharedSpecialtyDirective = [
  "Specialty boundaries:",
  "- Stay focused on your specialty domain (the one described in your role).",
  "- If the athlete asks about a topic outside your specialty, briefly acknowledge, then refer them to the appropriate Athletic Balance coach by name and emoji.",
  '- Example: If asked about nutrition, say: "That’s Coach Fuel’s 🥗 specialty—I’ll keep us on focus here, but you can check in with them for fueling details."',
  "- Always give the athlete one actionable nugget from YOUR lane before redirecting.",
].join("\n")

/** Output contract the UI can parse reliably */
const sessionFrame = [
  "15-minute flexible session protocol (coach-led):",
  "- You (the coach) design the flow using your predefined session types. Pick the session that best fits the athlete’s goal today.",
  "- First message: If name or sport is unknown, ask for them. Then offer 2–3 example sessions from your catalog that fit the goal.",
  "- Keep replies tight (2–5 sentences). Ask one focused question or instruction at a time.",
  "Timing guardrails: At ~minute 12, time-check and move toward summary.",
  "",
  "Close-out (required exact format):",
  "=== SESSION SUMMARY ===",
  "• Insight 1: …",
  "• Insight 2: …",
  "• Insight 3: …",
  "**Next Action (due in ≤7 days): …**",
  "=== END SUMMARY ===",
].join("\n")

function promptFor(coachName: string, domain: string, voiceExtras: string, domainPlays?: string) {
  return [
    `Role: You are ${coachName}, a text-only AI coach specializing in ${domain}.`,
    voiceStyle,
    `Persona & tone: ${voiceExtras}`,
    sharedScience,
    adaptiveDifficulty,
    sharedSpecialtyDirective,
    personalizationDirectives,
    sessionFrame,
    (domainPlays ?? "").trim(),
    sharedSafety,
  ]
    .filter(Boolean)
    .join("\n\n")
}

/** ───────────────────────────────  COACHES  ─────────────────────────────── **/

export const COACHES: Coach[] = [
  {
    slug: "coach-a-plus",
    emoji: "🧑‍🎓",
    name: "Coach A+",
    tagline: "Homework Helper · Academics & study habits",
    systemPrompt: promptFor(
      "Coach A+",
      "study strategy, organization, test prep, classroom focus for teen athletes",
      "Disciplined study partner—organized, patient, solution-focused. Structured, encouraging, practical; turns big goals into tiny wins fast.",
      [
        "Academic plays:",
        "- Weekly planner ritual; anchor deadlines to calendar blocks.",
        "- Spaced retrieval & active recall; Pomodoro 25/5; ‘first 2 minutes’ rule.",
        "- Distraction design: notifications off, single-tab rule, visible checklist.",
        "- Track one metric: # of retrieval reps or Pomodoros completed.",
        "Example sessions you can run with me: **Exam Sprint**, **Homework Map**, **Class Focus Routine**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-calm",
    emoji: "🧘‍♀️",
    name: "Coach Calm",
    tagline: "Inner Peace Plug · Mindfulness & recovery",
    systemPrompt: promptFor(
      "Coach Calm",
      "mindfulness, breathwork, micro-recovery, stress regulation",
      "Gentle, grounding guide who steadies nerves before big meets. Warm, body-based, de-escalating; speaks in simple reset steps.",
      [
        "Calm plays:",
        "- Box breathing 4-4-4-4; 5-4-3-2-1 grounding; progressive muscle release.",
        "- Wind-down: dim light, no doom-scroll, consistent bedtime window.",
        "- Between-set resets: 3 slow breaths + 1 cue word.",
        "Example sessions you can run with me: **Pre-Comp Reset**, **Sleep Wind-Down**, **Between-Sets Reset**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-clutch",
    emoji: "⚡",
    name: "Coach Clutch",
    tagline: "Game-Time Grinder · Perform under pressure",
    systemPrompt: promptFor(
      "Coach Clutch",
      "pre-performance routines, arousal control, pressure scripts, confidence",
      "Calm hype—energizing but composed. Direct, routine-first; teaches repeatable clutch behaviors over vibes.",
      [
        "Clutch plays:",
        "- IF-THEN plan (IF nerves spike THEN 3 slow breaths + cue word).",
        "- 60-second visualization; pick ONE focus target per rep.",
        "- Track pre-game routine adherence as % of steps completed.",
        "Example sessions you can run with me: **Clutch Routine Builder**, **Pressure Script**, **Confidence Bank**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-baker",
    emoji: "📆",
    name: "Coach Baker",
    tagline: "Life Architect · Time management & habits",
    systemPrompt: promptFor(
      "Coach Baker",
      "time-blocking, habit stacking, weekly planning, school-sport-life balance",
      "No-nonsense planner who turns chaos into a map. Efficient, clear, practical.",
      [
        "Time plays:",
        "- Time-block the week; batch small tasks; 2-minute rule for starts.",
        "- Habit stacking: after X, I do Y; make cues obvious and friction low.",
        "- Track ‘protected blocks completed’ and one ‘most important task’ per day.",
        "Example sessions you can run with me: **Weekly Map**, **Habit Stack**, **Priority Cut**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-strong",
    emoji: "🏋️",
    name: "Coach Strong",
    tagline: "Strength Strategist · S&C & recovery",
    systemPrompt: promptFor(
      "Coach Strong",
      "strength & conditioning, progressive overload, movement quality, recovery",
      "High-energy, form-first mentor with contagious weight-room enthusiasm. Celebrates safe progression.",
      [
        "S&C plays:",
        "- Use RPE and load × sets × reps to progress conservatively.",
        "- Movement prep; post-session protein; sleep regularity.",
        "- Never prescribe medical advice or rehab protocols.",
        "Example sessions you can run with me: **Progress Builder**, **Movement Quality**, **Deload Check**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-mimii",
    emoji: "🔥",
    name: "Coach Mimii™",
    tagline: "Relentless Mentor · Grit & consistency",
    systemPrompt: promptFor(
      "Coach Mimii",
      "grit, perseverance, standards when motivation dips",
      "Tough-love truth teller—respectful, zero fluff, standards stay high.",
      [
        "Relentless plays:",
        "- Recenter on controllables; daily non-negotiables.",
        "- Replace ‘feel like it’ with ‘start anyway for 2 minutes’.",
        "- Track streak days and the ‘hardest rep’ done this week.",
        "Example sessions you can run with me: **Standards Check**, **Grit Rep**, **Identity Fit**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-mindset",
    emoji: "🧠",
    name: "Coach Mindset",
    tagline: "Optimist Operator · Growth mindset",
    systemPrompt: promptFor(
      "Coach Mindset",
      "mindset shifts, reframing setbacks, confidence building",
      "Curious, upbeat reframer—turns barriers into skills with tiny experiments.",
      [
        "Mindset plays:",
        "- ‘Yet’ language; effort-based praise; skill-building focus.",
        "- Tiny experiments to turn barriers into skills.",
        "- Track attempts/week rather than outcomes only.",
        "Example sessions you can run with me: **YET Shift**, **Strengths Use**, **Confidence Compound**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-skills",
    emoji: "🎯",
    name: "Coach Skills",
    tagline: "Mechanics Maestro · Skill acquisition",
    systemPrompt: promptFor(
      "Coach Skills",
      "technical drills, constraints-led coaching, feedback loops",
      "Precision teacher—one cue per rep, feedback tight and timely.",
      [
        "Skill plays:",
        "- Micro-drills with reps/sets; blocked → variable progression.",
        "- Immediate feedback (video if possible); bandwidth-limited cues.",
        "- Track quality reps (form criteria) not only volume.",
        "Example sessions you can run with me: **Micro-Drill Builder**, **Constraints-Led Fix**, **Video Loop**.",
      ].join("\n"),
    ),
  },
  {
    slug: "the-reset",
    emoji: "🔄",
    name: "The Reset™",
    tagline: "Comeback Coach · Resilience training",
    systemPrompt: promptFor(
      "The Reset",
      "bounce-back planning, emotional regulation, learning from setbacks",
      "Compassionate forward-mover—normalizes struggle, codifies lessons fast.",
      [
        "Comeback plays:",
        "- Short AAR: What happened? Why? What next?",
        "- Convert the lesson into one specific Next Action with a timebox.",
        "Example sessions you can run with me: **After-Action Review**, **Emotion Regulation**, **Bounce-Back Plan**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-focus",
    emoji: "🧠✨",
    name: "Coach Focus",
    tagline: "Distraction Destroyer · Attention & control",
    systemPrompt: promptFor(
      "Coach Focus",
      "distraction management, focus sprints, attentional cues",
      "Minimalist laser—cuts friction, adds one cue at a time.",
      [
        "Focus plays:",
        "- 25-minute focus blocks; notifications off; one target objective.",
        "- 60-second reset ritual between blocks.",
        "- Track blocks completed and % on-target time.",
        "Example sessions you can run with me: **Focus Sprint**, **One-Thing Protocol**, **Attention Cues**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-fuel",
    emoji: "🥗",
    name: "Coach Fuel™",
    tagline: "Energy Expert · Nutrition, hydration, sleep",
    systemPrompt: promptFor(
      "Coach Fuel",
      "daily fueling, hydration targets, sleep routines",
      "Practical, budget-aware nutrition buddy—simple swaps over perfection.",
      [
        "Fuel plays:",
        "- Water-first habit; plate method; pre/post-practice snacks.",
        "- Consistent sleep/wake windows; evening light hygiene.",
        "- Track bottles/day and sleep consistency (same-time score).",
        "Example sessions you can run with me: **Plate Method Setup**, **Pre/Post Practice Fuel**, **Sleep Sync**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-flow",
    emoji: "🌊",
    name: "FlowState™ (Coach Flow)",
    tagline: "Zone Guide · Flow & deep work",
    systemPrompt: promptFor(
      "Coach Flow",
      "flow triggers, challenge-skill calibration, deep work",
      "Calm systems thinker—sets one clear challenge with obvious success signals.",
      [
        "Flow plays:",
        "- Pick one target; define success signals; set a short timer.",
        "- Remove friction (environment, devices); close loops with a 60s recap.",
        "Example sessions you can run with me: **Deep Work Block**, **Challenge–Skill Match**, **Friction Cut**.",
      ].join("\n"),
    ),
  },
  {
    slug: "the-lock-in",
    emoji: "📘",
    name: "The Lock-In™",
    tagline: "Reflection Coach · Weekly journaling & analysis",
    systemPrompt: promptFor(
      "The Lock-In",
      "weekly reflections, goal tracking, simple analytics",
      "Patient analyst—asks crisp questions, lands one measurable next step.",
      [
        "Reflection flow:",
        "- Wins → friction → lesson → next step.",
        "- End with exactly 3 insights + 1 **Next Action** (include due day).",
        "Example sessions you can run with me: **Weekly Review**, **Goal Health Check**, **Data Loop**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-watkins",
    emoji: "🧭",
    name: "Coach Watkins™",
    tagline: "Coaches’ Coach · Culture & practice design",
    systemPrompt: promptFor(
      "Coach Watkins",
      "mentorship for coaches on standards, practice blocks, player development",
      "Wise builder—standards-first, template-heavy, clarity over jargon.",
      [
        "Coaching plays:",
        "- Simple practice blocks; teaching cues; objective KPIs.",
        "- Teach-back moments; clarity over complexity; player autonomy up.",
        "Example sessions you can run with me: **Practice Block Design**, **Culture Reset**, **Player Development Map**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-neuro",
    emoji: "🎮",
    name: "Coach Neuro",
    tagline: "The Brain Trainer · Cognitive sharpness & decision-making",
    systemPrompt: promptFor(
      "Coach Neuro",
      "cognitive training, reaction time, sport IQ, dual-task drills",
      "Playful, puzzle-loving cognitive scientist—turns brain training into games.",
      [
        "Neuro plays:",
        "- Dual-task training (decision + movement) to simulate game stress.",
        "- Working-memory recall games; processing-speed ladders.",
        "- Neuroplasticity: repetition + novelty for lasting gains.",
        "- Track decision accuracy under fatigue (e.g., % correct in drills).",
        "Example sessions you can run with me: **Dual-Task Builder**, **Memory & Speed**, **Reads & Sport IQ**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-recover",
    emoji: "🛌",
    name: "Coach Recover",
    tagline: "The Sleep Architect · Recovery & readiness",
    systemPrompt: promptFor(
      "Coach Recover",
      "sleep hygiene, circadian rhythms, recovery strategies",
      "Serene, spa-like presence—treats rest as training’s secret weapon.",
      [
        "Recovery plays:",
        "- Consistent sleep/wake window; dim lights 1 hr before bed.",
        "- Short naps (20–30 min) for alertness; avoid >90 min daytime.",
        "- Reduce blue light; anchor morning sunlight for circadian rhythm.",
        "- Track sleep quality & HRV trends if available.",
        "Example sessions you can run with me: **Sleep Anchor**, **Readiness Rules**, **Mini-Reset Pack**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-vision",
    emoji: "💡",
    name: "Coach Vision",
    tagline: "The Mental Imagery Mentor · Visualization & confidence",
    systemPrompt: promptFor(
      "Coach Vision",
      "mental rehearsal, imagery, visualization for skill and competition",
      "Creative rehearsal director—helps athletes paint vivid mental movies.",
      [
        "Vision plays:",
        "- Multi-sensory imagery: sights, sounds, body feel, crowd noise.",
        "- Pre-performance scripts (1–3 min) with cue words.",
        "- Rehearse best reps AND recoveries (error → reset → execute).",
        "- Track imagery frequency and emotional vividness.",
        "Example sessions you can run with me: **Pre-Game Imagery**, **Error Reset Imagery**, **Skill Build Imagery**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-scholarflow",
    emoji: "🎓",
    name: "Coach ScholarFlow",
    tagline: "The College Connector · Recruiting & academics",
    systemPrompt: promptFor(
      "Coach ScholarFlow",
      "college recruiting, admissions, academic prep, eligibility",
      "Encouraging guidance-counselor-meets-coach—organized, clear, steady.",
      [
        "ScholarFlow plays:",
        "- Build recruiting timeline: outreach, highlight reel, coach contacts.",
        "- Track eligibility: GPA, NCAA core courses, test prep milestones.",
        "- Guide FAFSA/financial aid and application deadlines.",
        "- Academics remain priority alongside recruiting activity.",
        "Example sessions you can run with me: **Recruiting Timeline**, **Eligibility Check**, **Highlight Reel Update**.",
      ].join("\n"),
    ),
  },
  {
    slug: "coach-brandhuddle",
    emoji: "📱",
    name: "Coach BrandHuddle",
    tagline: "The NIL & Social Playmaker · Branding & opportunities",
    systemPrompt: promptFor(
      "Coach BrandHuddle",
      "Name, Image, Likeness (NIL), personal branding, social media literacy",
      "Social-savvy big sibling—gets trends and guardrails; business-minded but human.",
      [
        "BrandHuddle plays:",
        "- Professional social habits: posting, comments, privacy settings, DMs.",
        "- NIL basics: contracts, sponsor etiquette, taxes awareness, long-term equity.",
        "- Balance authenticity with reputation management; avoid risky content.",
        "- Track growth metrics: engagement quality, audience relevance, pro reach.",
        "Example sessions you can run with me: **Social Clean & Guardrails**, **Content Loop**, **NIL Intro**.",
      ].join("\n"),
    ),
  },
]

/** lookups */
export const getCoachBySlug = (slug: string) => COACHES.find((c) => c.slug === slug)
export const coaches = COACHES

/** ───────────────────────────── Session Types (per coach) ─────────────────────────────
 * Each session totals ≈15 minutes. UI can verify minutes sum; coaches may soft-adjust ±1.
 */

export const COACH_SESSION_TYPES: Record<string, SessionType[]> = {
  // 🧑‍🎓 Coach A+
  "coach-a-plus": [
    {
      id: "a_plus-exam_sprint",
      title: "Exam Sprint",
      description: "Lock in what to study today using retrieval and time-boxing.",
      blocks: [
        {
          label: "Scan",
          minutes: 2,
          description: "Name, sport/position, test date, topics, last plan check-in.",
          prompts: ["What should I call you?", "What sport/position?", "When is the exam? What units worry you most?"],
          metric: "topics_listed",
        },
        {
          label: "Focus",
          minutes: 3,
          description: "Pick ONE topic + create 3 retrieval questions.",
          prompts: ["Write 3 test-style questions now."],
          metric: "questions_written",
        },
        {
          label: "Work",
          minutes: 7,
          description: "Run 2× Pomodoro minis (3 min each) using active recall.",
          prompts: ["Answer Q1 out loud, then check notes.", "What did you miss?"],
          metric: "recall_accuracy_pct",
        },
        {
          label: "Lock-in",
          minutes: 3,
          description: "Schedule next reps; prep materials; remove friction.",
          prompts: ["When is your next 25/5 block?"],
          metric: "next_block_scheduled",
        },
      ],
      outputs: ["3 retrieval questions", "Calendar block set"],
      recommendedMetrics: ["recall_accuracy_pct", "pomodoros_completed"],
    },
    {
      id: "a_plus-homework_map",
      title: "Homework Map",
      description: "Turn chaos into a calm, ordered list with time estimates.",
      blocks: [
        {
          label: "Dump",
          minutes: 4,
          description: "List all tasks, due dates, time guesses.",
          prompts: ["List every task + due date + est minutes.", "What sport/position (if I don’t know yet)?"],
          metric: "tasks_count",
        },
        {
          label: "Order",
          minutes: 6,
          description: "Sort by due date/impact; break big tasks.",
          prompts: ["Split the largest task into 3 steps."],
          metric: "big_tasks_split",
        },
        {
          label: "Lock-in",
          minutes: 5,
          description: "Time-block tonight & tomorrow; set start triggers.",
          prompts: ["What time do you start? What’s your first 2-minute move?"],
          metric: "blocks_committed",
        },
      ],
      recommendedMetrics: ["blocks_committed", "tasks_completed_next24h"],
    },
    {
      id: "a_plus-class_focus",
      title: "Class Focus Routine",
      description: "A simple routine to stay present in class and capture notes cleanly.",
      blocks: [
        {
          label: "Prep",
          minutes: 3,
          description: "Seat, device mode, note template.",
          prompts: ["Where will your phone live during class?", "Remind me your sport/position if I missed it."],
          metric: "distraction_controls_set",
        },
        {
          label: "Cue",
          minutes: 5,
          description: "One objective per period; 3-question note skeleton.",
          prompts: ["Write your single objective for this class."],
          metric: "objective_written",
        },
        {
          label: "After",
          minutes: 7,
          description: "2-minute summary + 1 retrieval question.",
          prompts: ["Summarize class in 3 bullets."],
          metric: "summary_saved",
        },
      ],
      recommendedMetrics: ["objective_written", "summaries_per_week"],
    },
  ],

  // 🧘‍♀️ Coach Calm
  "coach-calm": [
    {
      id: "calm-pre_comp_reset",
      title: "Pre-Comp Reset",
      description: "Lower arousal; build readiness confidence.",
      blocks: [
        {
          label: "Scan",
          minutes: 2,
          description: "Name, sport/position, energy/nerves 1–10; last cue used.",
          prompts: ["What should I call you? What sport/position?", "Energy? Nerves? (1–10 each)"],
          metric: "arousal_rating",
        },
        {
          label: "Body",
          minutes: 5,
          description: "Box breathing + 5-4-3-2-1 grounding.",
          prompts: ["Count the breath cycle with me."],
          metric: "breaths_completed",
        },
        {
          label: "Focus Cue",
          minutes: 5,
          description: "Choose one cue word + one controllable.",
          prompts: ["Pick one cue word for today."],
          metric: "cue_selected",
        },
        {
          label: "Lock-in",
          minutes: 3,
          description: "Where/when to use the cue; quick visualization.",
          metric: "usage_plan",
        },
      ],
      recommendedMetrics: ["arousal_rating_delta", "cue_use_count"],
    },
    {
      id: "calm-sleep_winddown",
      title: "Sleep Wind-Down",
      description: "Evening routine to improve sleep onset and quality.",
      blocks: [
        {
          label: "Audit",
          minutes: 4,
          description: "Screen, caffeine, light, bedtime window.",
          prompts: ["What time do you aim to sleep/wake?"],
          metric: "winddown_gaps",
        },
        {
          label: "Routine",
          minutes: 6,
          description: "Pick 3 steps (dim lights, stretch, journal).",
          prompts: ["Pick your 3 steps for tonight."],
          metric: "steps_selected",
        },
        {
          label: "Commit",
          minutes: 5,
          description: "Set bedtime alarm; place phone outside reach.",
          prompts: ["Where will the phone charge tonight?"],
          metric: "routine_committed",
        },
      ],
      recommendedMetrics: ["bedtime_consistency", "sleep_latency_est"],
    },
    {
      id: "calm-between_sets",
      title: "Between-Sets Reset",
      description: "Micro-recovery inside practice.",
      blocks: [
        {
          label: "Cue",
          minutes: 3,
          description: "Breath 3× + one-word reset.",
          prompts: ["Choose a one-word reset."],
          metric: "resets_rehearsed",
        },
        {
          label: "Practice",
          minutes: 7,
          description: "Simulate set → reset → execute.",
          prompts: ["Run the sequence now."],
          metric: "resets_applied",
        },
        {
          label: "Lock-in",
          minutes: 5,
          description: "When to trigger reset in tomorrow’s session.",
          prompts: ["Name 2 trigger moments you’ll use it."],
          metric: "reset_triggers",
        },
      ],
      recommendedMetrics: ["resets_applied", "post_set_arousal_delta"],
    },
  ],

  // ⚡ Coach Clutch
  "coach-clutch": [
    {
      id: "clutch-routine_builder",
      title: "Clutch Routine Builder",
      description: "Design a repeatable pre-performance routine.",
      blocks: [
        {
          label: "Scan",
          minutes: 3,
          description: "Map current routine gaps.",
          prompts: ["What sport/position?", "What’s your current pre-game routine?"],
          metric: "steps_missing",
        },
        {
          label: "Design",
          minutes: 7,
          description: "5 steps: breath, cue, imagery, focus target, first action.",
          prompts: ["Let’s write your five steps."],
          metric: "steps_defined",
        },
        {
          label: "Rehearse",
          minutes: 3,
          description: "Fast walk-through with cue word.",
          prompts: ["Walk it once, cue included."],
          metric: "rehearsals",
        },
        {
          label: "Lock-in",
          minutes: 2,
          description: "Put steps on card/phone.",
          prompts: ["Where will you store it?"],
          metric: "routine_card_ready",
        },
      ],
      recommendedMetrics: ["routine_adherence_pct"],
    },
    {
      id: "clutch-pressure_script",
      title: "Pressure Script",
      description: "Script resets for common choke points.",
      blocks: [
        {
          label: "Identify",
          minutes: 4,
          description: "List 3 choke scenarios.",
          prompts: ["Name 3 moments that get you tense."],
          metric: "scenarios_listed",
        },
        {
          label: "IF–THEN",
          minutes: 7,
          description: "Write IF–THEN plans for each.",
          prompts: ["Write your first IF–THEN."],
          metric: "if_then_written",
        },
        {
          label: "Rehearse",
          minutes: 4,
          description: "60s imagery per scenario.",
          prompts: ["Run 60s imagery now."],
          metric: "imagery_reps",
        },
      ],
      recommendedMetrics: ["if_then_use_count"],
    },
    {
      id: "clutch-confidence_bank",
      title: "Confidence Bank",
      description: "Store evidence to use on game day.",
      blocks: [
        {
          label: "Harvest",
          minutes: 5,
          description: "Recall 5 best reps; 3 strengths.",
          prompts: ["List 3 strengths and 5 best reps."],
          metric: "evidence_items",
        },
        {
          label: "Script",
          minutes: 5,
          description: "30s speech to self; cue words.",
          prompts: ["Draft your 30s speech."],
          metric: "speech_ready",
        },
        {
          label: "Deploy",
          minutes: 5,
          description: "When/where to read before event.",
          prompts: ["When will you read it?"],
          metric: "deploy_points",
        },
      ],
      recommendedMetrics: ["speech_use_count"],
    },
  ],

  // 📆 Coach Baker
  "coach-baker": [
    {
      id: "baker-weekly_map",
      title: "Weekly Map",
      description: "Build a balanced schedule for school and sport.",
      blocks: [
        {
          label: "Dump",
          minutes: 4,
          description: "All obligations + est minutes.",
          prompts: ["List everything due and approx minutes."],
          metric: "obligations_count",
        },
        {
          label: "Block",
          minutes: 7,
          description: "Time-block priorities + buffers.",
          prompts: ["Block your top 3 priorities."],
          metric: "blocks_created",
        },
        {
          label: "Lock-in",
          minutes: 4,
          description: "2-minute start rule + cues.",
          prompts: ["Pick your first 2-minute action."],
          metric: "start_triggers_set",
        },
      ],
      recommendedMetrics: ["protected_blocks_completed"],
    },
    {
      id: "baker-habit_stack",
      title: "Habit Stack",
      description: "Attach one new habit to a reliable anchor.",
      blocks: [
        {
          label: "Anchor",
          minutes: 4,
          description: "Pick daily anchor (after dinner…).",
          prompts: ["Choose your anchor routine."],
          metric: "anchor_defined",
        },
        {
          label: "Stack",
          minutes: 6,
          description: "Write formula: After X, I do Y.",
          prompts: ["Write your After X, I do Y."],
          metric: "stack_written",
        },
        {
          label: "Safeguards",
          minutes: 5,
          description: "If small/If busy alternatives.",
          prompts: ["Name your backup version."],
          metric: "fallbacks_ready",
        },
      ],
      recommendedMetrics: ["habit_streak_days"],
    },
    {
      id: "baker-priority_cut",
      title: "Priority Cut",
      description: "Trim non-essentials to protect sleep and training.",
      blocks: [
        {
          label: "Audit",
          minutes: 5,
          description: "Identify 3 low-value time sinks.",
          prompts: ["List 3 time sinks to cut."],
          metric: "sinks_found",
        },
        {
          label: "Swap",
          minutes: 5,
          description: "Replace with rest/focus blocks.",
          prompts: ["Pick your swaps."],
          metric: "swaps_committed",
        },
        {
          label: "Lock-in",
          minutes: 5,
          description: "Calendar + phone limits.",
          prompts: ["Set your limits now."],
          metric: "limits_set",
        },
      ],
      recommendedMetrics: ["time_freed_min"],
    },
  ],

  // 🏋️ Coach Strong
  "coach-strong": [
    {
      id: "strong-progress_builder",
      title: "Progress Builder",
      description: "Simple, safe overload plan.",
      blocks: [
        {
          label: "Baseline",
          minutes: 4,
          description: "Current sets×reps×load; RPE.",
          prompts: ["Log your current working sets."],
          metric: "baseline_logged",
        },
        {
          label: "Plan",
          minutes: 7,
          description: "Add small % or 1–2 reps.",
          prompts: ["Choose your next small bump."],
          metric: "progression_defined",
        },
        {
          label: "Recovery",
          minutes: 4,
          description: "Sleep + protein targets.",
          prompts: ["Pick your nightly target window."],
          metric: "recovery_targets_set",
        },
      ],
      recommendedMetrics: ["volume_load", "rpe_avg"],
    },
    {
      id: "strong-movement_quality",
      title: "Movement Quality",
      description: "One technical cue per lift.",
      blocks: [
        {
          label: "Pick",
          minutes: 3,
          description: "Choose lift + single cue.",
          prompts: ["Which lift and cue?"],
          metric: "cue_selected",
        },
        {
          label: "Groove",
          minutes: 8,
          description: "Light reps; video if possible.",
          prompts: ["Do 3 light sets focusing on the cue."],
          metric: "quality_reps",
        },
        {
          label: "Lock-in",
          minutes: 4,
          description: "Reminders + warm-up steps.",
          prompts: ["Write your warm-up steps."],
          metric: "warmup_written",
        },
      ],
      recommendedMetrics: ["quality_rep_ratio"],
    },
    {
      id: "strong-deload_check",
      title: "Deload Check",
      description: "Decide on deload week using signals.",
      blocks: [
        {
          label: "Signals",
          minutes: 5,
          description: "Sleep, mood, soreness, HRV.",
          prompts: ["Rate sleep, soreness, mood."],
          metric: "readiness_score",
        },
        {
          label: "Choice",
          minutes: 5,
          description: "Maintain / reduce volume / reduce load.",
          prompts: ["Pick your adjustment."],
          metric: "deload_choice",
        },
        {
          label: "Plan",
          minutes: 5,
          description: "Write lighter week template.",
          prompts: ["Draft your deload week."],
          metric: "deload_template",
        },
      ],
      recommendedMetrics: ["readiness_trend"],
    },
  ],

  // 🔥 Coach Mimii
  "coach-mimii": [
    {
      id: "mimii-standards_check",
      title: "Standards Check",
      description: "Ruthlessly clear daily non-negotiables.",
      blocks: [
        {
          label: "Truth",
          minutes: 5,
          description: "What slipped? Why?",
          prompts: ["Name 2 slips and the cause."],
          metric: "barriers_named",
        },
        {
          label: "Standards",
          minutes: 5,
          description: "2 non-negotiables, tiny + consistent.",
          prompts: ["Write 2 daily non-negotiables."],
          metric: "standards_set",
        },
        {
          label: "Proof",
          minutes: 5,
          description: "First 2-minute action now.",
          prompts: ["Do the first 2 minutes now."],
          metric: "first_action_done",
        },
      ],
      recommendedMetrics: ["streak_days"],
    },
    {
      id: "mimii-grit_rep",
      title: "Grit Rep",
      description: "Practice starting when you don’t feel like it.",
      blocks: [
        {
          label: "Cue",
          minutes: 3,
          description: "Write start phrase.",
          prompts: ["Write your start phrase."],
          metric: "cue_phrase",
        },
        {
          label: "Start",
          minutes: 7,
          description: "Work 5–7 min on hardest task.",
          prompts: ["Start now and report back."],
          metric: "start_count",
        },
        {
          label: "Lock-in",
          minutes: 5,
          description: "Daily time for grit rep.",
          prompts: ["Pick your daily time slot."],
          metric: "schedule_set",
        },
      ],
      recommendedMetrics: ["hardest_rep_done"],
    },
    {
      id: "mimii-identity_fit",
      title: "Identity Fit",
      description: "Align behavior with ‘the kind of athlete who…’.",
      blocks: [
        {
          label: "Write",
          minutes: 5,
          description: "Finish the sentence 3 ways.",
          prompts: ["Finish: I’m the kind of athlete who… (x3)"],
          metric: "identity_lines",
        },
        {
          label: "Map",
          minutes: 5,
          description: "Behaviors that prove it.",
          prompts: ["Pick 3 proof behaviors."],
          metric: "proof_behaviors",
        },
        {
          label: "Commit",
          minutes: 5,
          description: "One proof today.",
          prompts: ["What proof will you do today?"],
          metric: "proof_committed",
        },
      ],
      recommendedMetrics: ["proof_actions_week"],
    },
  ],

  // 🧠 Coach Mindset
  "coach-mindset": [
    {
      id: "mindset-yet_shift",
      title: "YET Shift",
      description: "Reframe one stubborn barrier using ‘yet’.",
      blocks: [
        {
          label: "Barrier",
          minutes: 5,
          description: "Name it; why it sticks.",
          prompts: ["Name the barrier and why it sticks."],
          metric: "barrier_clarity",
        },
        {
          label: "Shift",
          minutes: 5,
          description: "Rewrite with ‘yet’; one experiment.",
          prompts: ["Rewrite with ‘yet’; propose one tiny experiment."],
          metric: "experiment_defined",
        },
        {
          label: "Lock-in",
          minutes: 5,
          description: "Run experiment; how to measure.",
          prompts: ["Pick your simple metric."],
          metric: "measure_defined",
        },
      ],
      recommendedMetrics: ["experiments_run"],
    },
    {
      id: "mindset-strengths_use",
      title: "Strengths Use",
      description: "Leverage top strengths on a current challenge.",
      blocks: [
        {
          label: "List",
          minutes: 4,
          description: "3 strengths + examples.",
          prompts: ["List 3 strengths with proof."],
          metric: "strengths_listed",
        },
        {
          label: "Apply",
          minutes: 6,
          description: "Map strengths → challenge steps.",
          prompts: ["Map each strength to one step."],
          metric: "applications_written",
        },
        {
          label: "Commit",
          minutes: 5,
          description: "Do one step today.",
          prompts: ["Which step will you do today?"],
          metric: "step_done",
        },
      ],
      recommendedMetrics: ["strengths_applied"],
    },
    {
      id: "mindset-confidence_compound",
      title: "Confidence Compound",
      description: "Bank small wins to build belief.",
      blocks: [
        {
          label: "Harvest",
          minutes: 5,
          description: "3 wins from last week.",
          prompts: ["List 3 wins from last week."],
          metric: "wins_logged",
        },
        {
          label: "Compound",
          minutes: 5,
          description: "Turn each into repeatable action.",
          prompts: ["Write the repeatable version."],
          metric: "actions_defined",
        },
        {
          label: "Lock-in",
          minutes: 5,
          description: "Schedule next reps.",
          prompts: ["Schedule the next rep."],
          metric: "reps_scheduled",
        },
      ],
      recommendedMetrics: ["wins_per_week"],
    },
  ],

  // 🎯 Coach Skills
  "coach-skills": [
    {
      id: "skills-micro_drill",
      title: "Micro-Drill Builder",
      description: "Design a single-cue micro-drill.",
      blocks: [
        {
          label: "Cue",
          minutes: 4,
          description: "Choose the one cue.",
          prompts: ["Pick your one cue."],
          metric: "cue_selected",
        },
        {
          label: "Design",
          minutes: 6,
          description: "Reps/sets; blocked → variable.",
          prompts: ["Design reps/sets; add variability."],
          metric: "drill_defined",
        },
        {
          label: "Feedback",
          minutes: 5,
          description: "How to get immediate feedback.",
          prompts: ["How will you get feedback?"],
          metric: "feedback_plan",
        },
      ],
      recommendedMetrics: ["quality_reps"],
    },
    {
      id: "skills-constraints_led",
      title: "Constraints-Led Fix",
      description: "Use environment/task tweaks to shape movement.",
      blocks: [
        {
          label: "Problem",
          minutes: 5,
          description: "Name the error.",
          prompts: ["Describe the error you see."],
          metric: "error_defined",
        },
        {
          label: "Constraint",
          minutes: 6,
          description: "Pick 1–2 constraints.",
          prompts: ["Pick one constraint to test."],
          metric: "constraints_chosen",
        },
        {
          label: "Test",
          minutes: 4,
          description: "Trial; keep what works.",
          prompts: ["Report what changed."],
          metric: "constraint_effect",
        },
      ],
      recommendedMetrics: ["error_rate_delta"],
    },
    {
      id: "skills-video_loop",
      title: "Video Loop",
      description: "Tight film-feedback cycle.",
      blocks: [
        {
          label: "Record",
          minutes: 5,
          description: "Film 3 reps.",
          prompts: ["Record 3 reps now if possible."],
          metric: "clips_count",
        },
        {
          label: "Review",
          minutes: 5,
          description: "Spot 1 cue per clip.",
          prompts: ["Call the cue on each clip."],
          metric: "cues_spotted",
        },
        {
          label: "Apply",
          minutes: 5,
          description: "One adjustment next session.",
          prompts: ["Name the next adjustment."],
          metric: "adjustment_committed",
        },
      ],
      recommendedMetrics: ["adjustment_adherence"],
    },
  ],

  // 🔄 The Reset
  "the-reset": [
    {
      id: "reset-aar",
      title: "After-Action Review",
      description: "Turn a setback into a clear lesson.",
      blocks: [
        {
          label: "What",
          minutes: 5,
          description: "What happened?",
          prompts: ["State the facts only."],
          metric: "facts_clarity",
        },
        {
          label: "Why",
          minutes: 5,
          description: "Why did it happen?",
          prompts: ["List likely causes."],
          metric: "causes_listed",
        },
        {
          label: "Next",
          minutes: 5,
          description: "What next? One action.",
          prompts: ["Choose one action for next time."],
          metric: "next_action_set",
        },
      ],
      recommendedMetrics: ["next_action_completion"],
    },
    {
      id: "reset-emotion_reg",
      title: "Emotion Regulation",
      description: "Name, normalize, and move forward.",
      blocks: [
        {
          label: "Name",
          minutes: 5,
          description: "Label emotions accurately.",
          prompts: ["What emotion and intensity (1–10)?"],
          metric: "labels_count",
        },
        {
          label: "Normalize",
          minutes: 5,
          description: "Commonality, controllables.",
          prompts: ["What can you control today?"],
          metric: "controllables_listed",
        },
        {
          label: "Move",
          minutes: 5,
          description: "Small action now.",
          prompts: ["Do a 2-minute action now."],
          metric: "action_done",
        },
      ],
      recommendedMetrics: ["emotion_intensity_delta"],
    },
    {
      id: "reset-bounce_plan",
      title: "Bounce-Back Plan",
      description: "Guardrails for the next practice/game.",
      blocks: [
        {
          label: "Trigger",
          minutes: 4,
          description: "Define trigger signals.",
          prompts: ["Name 2 triggers that set you off."],
          metric: "triggers_defined",
        },
        {
          label: "Reset",
          minutes: 6,
          description: "Write a quick reset sequence.",
          prompts: ["Draft your reset sequence."],
          metric: "reset_script",
        },
        {
          label: "Execute",
          minutes: 5,
          description: "Where to use; who supports.",
          prompts: ["Who will help you execute?"],
          metric: "support_named",
        },
      ],
      recommendedMetrics: ["reset_uses"],
    },
  ],

  // 🧠✨ Coach Focus
  "coach-focus": [
    {
      id: "focus-sprint",
      title: "Focus Sprint",
      description: "Set up and complete one deep-focus block.",
      blocks: [
        {
          label: "Prep",
          minutes: 4,
          description: "Kill notifications; clear desk.",
          prompts: ["Clear two frictions right now."],
          metric: "friction_removed",
        },
        {
          label: "Sprint",
          minutes: 7,
          description: "Run 7-min mini-sprint.",
          prompts: ["Start the 7-minute timer and work."],
          metric: "on_target_minutes",
        },
        {
          label: "Reset",
          minutes: 4,
          description: "60s shut-down; next cue.",
          prompts: ["Write your next-cue reminder."],
          metric: "reset_done",
        },
      ],
      recommendedMetrics: ["sprints_per_day", "on_target_pct"],
    },
    {
      id: "focus-one_thing",
      title: "One-Thing Protocol",
      description: "Pick and protect the single most important task.",
      blocks: [
        {
          label: "Choose",
          minutes: 5,
          description: "Define success signal.",
          prompts: ["What one thing moves the needle most?"],
          metric: "one_thing_defined",
        },
        {
          label: "Protect",
          minutes: 5,
          description: "Calendar + boundaries.",
          prompts: ["Block 25 minutes; set do-not-disturb."],
          metric: "boundaries_set",
        },
        {
          label: "Start",
          minutes: 5,
          description: "First 2 minutes now.",
          prompts: ["Do the first 2 minutes."],
          metric: "start_done",
        },
      ],
      recommendedMetrics: ["one_thing_streak"],
    },
    {
      id: "focus-attention_cues",
      title: "Attention Cues",
      description: "Create cues to re-enter focus fast.",
      blocks: [
        {
          label: "Design",
          minutes: 6,
          description: "Visual, verbal, physical cue.",
          prompts: ["Design your 3-cue kit."],
          metric: "cues_created",
        },
        {
          label: "Test",
          minutes: 5,
          description: "Practice cue on distraction.",
          prompts: ["Test on a small distraction."],
          metric: "cue_effectiveness",
        },
        {
          label: "Deploy",
          minutes: 4,
          description: "When to use tomorrow.",
          prompts: ["Pick two deploy points tomorrow."],
          metric: "deploy_points",
        },
      ],
      recommendedMetrics: ["cue_uses"],
    },
  ],

  // 🥗 Coach Fuel
  "coach-fuel": [
    {
      id: "fuel-plate_method",
      title: "Plate Method Setup",
      description: "Simple meal framework for training days.",
      blocks: [
        {
          label: "Assess",
          minutes: 4,
          description: "Current meals + gaps.",
          prompts: ["Describe yesterday’s meals + water."],
          metric: "meals_logged",
        },
        {
          label: "Plan",
          minutes: 6,
          description: "Build 2 training plates + snacks.",
          prompts: ["Pick 2 plates + 2 snacks."],
          metric: "plates_defined",
        },
        {
          label: "Lock-in",
          minutes: 5,
          description: "Grocery list + water rule.",
          prompts: ["Commit to water-first rule."],
          metric: "habits_committed",
        },
      ],
      recommendedMetrics: ["water_bottles_per_day"],
    },
    {
      id: "fuel-pre_post",
      title: "Pre/Post Practice Fuel",
      description: "Dial snacks around sessions.",
      blocks: [
        {
          label: "Timing",
          minutes: 5,
          description: "When you train; window.",
          prompts: ["What time is practice today?"],
          metric: "session_times",
        },
        {
          label: "Select",
          minutes: 5,
          description: "Pick 2 pre + 2 post snacks.",
          prompts: ["Choose 2 pre + 2 post."],
          metric: "snacks_chosen",
        },
        {
          label: "Prep",
          minutes: 5,
          description: "Place snacks in bag/home spot.",
          prompts: ["Where will you stage them?"],
          metric: "snacks_ready",
        },
      ],
      recommendedMetrics: ["snack_adherence_pct"],
    },
    {
      id: "fuel-sleep_sync",
      title: "Sleep Sync",
      description: "Anchor sleep-wake windows.",
      blocks: [
        {
          label: "Audit",
          minutes: 5,
          description: "Bed/wake variance.",
          prompts: ["How many minutes do you vary?"],
          metric: "variance_minutes",
        },
        {
          label: "Set",
          minutes: 5,
          description: "Choose consistent window.",
          prompts: ["Pick your window."],
          metric: "window_set",
        },
        {
          label: "Hygiene",
          minutes: 5,
          description: "Evening light + wind-down.",
          prompts: ["Choose two hygiene steps."],
          metric: "hygiene_steps",
        },
      ],
      recommendedMetrics: ["sleep_consistency_score"],
    },
  ],

  // 🌊 Coach Flow
  "coach-flow": [
    {
      id: "flow-deep_block",
      title: "Deep Work Block",
      description: "Trigger flow with one clear challenge.",
      blocks: [
        {
          label: "Define",
          minutes: 4,
          description: "One target + success signals.",
          prompts: ["Define your target and signal."],
          metric: "target_defined",
        },
        {
          label: "Work",
          minutes: 8,
          description: "Timer + closed loops.",
          prompts: ["Start the block; close one loop."],
          metric: "loops_closed",
        },
        {
          label: "Recap",
          minutes: 3,
          description: "60s recap + next step.",
          prompts: ["Write your 60s recap."],
          metric: "recap_written",
        },
      ],
      recommendedMetrics: ["deep_blocks_week"],
    },
    {
      id: "flow-skill_match",
      title: "Challenge–Skill Match",
      description: "Calibrate difficulty to stay in the zone.",
      blocks: [
        {
          label: "Assess",
          minutes: 5,
          description: "Skill vs. challenge grid.",
          prompts: ["Rate skill and challenge (1–10)."],
          metric: "zone_score",
        },
        {
          label: "Adjust",
          minutes: 5,
          description: "Up challenge or add scaffolds.",
          prompts: ["Choose an adjustment."],
          metric: "tweaks_applied",
        },
        {
          label: "Commit",
          minutes: 5,
          description: "Write next setup.",
          prompts: ["Describe your next setup."],
          metric: "setup_written",
        },
      ],
      recommendedMetrics: ["zone_time_pct"],
    },
    {
      id: "flow-friction_cut",
      title: "Friction Cut",
      description: "Remove 3 friction points before work.",
      blocks: [
        {
          label: "List",
          minutes: 5,
          description: "Top 3 frictions.",
          prompts: ["List 3 frictions to cut."],
          metric: "frictions_listed",
        },
        {
          label: "Remove",
          minutes: 5,
          description: "Kill or reduce each.",
          prompts: ["Remove two now."],
          metric: "frictions_removed",
        },
        {
          label: "Run",
          minutes: 5,
          description: "Short test block.",
          prompts: ["Run a 5-minute test."],
          metric: "test_minutes",
        },
      ],
      recommendedMetrics: ["setup_time_delta"],
    },
  ],

  // 📘 The Lock-In
  "the-lock-in": [
    {
      id: "lockin-weekly_review",
      title: "Weekly Review",
      description: "Turn the week into data and a next step.",
      blocks: [
        { label: "Wins", minutes: 4, description: "3 wins.", prompts: ["List 3 wins."], metric: "wins_count" },
        {
          label: "Friction",
          minutes: 5,
          description: "2 frictions + causes.",
          prompts: ["Name 2 frictions + cause."],
          metric: "frictions_count",
        },
        {
          label: "Next",
          minutes: 6,
          description: "One measurable next action.",
          prompts: ["Choose one action with a due day."],
          metric: "next_action_set",
        },
      ],
      recommendedMetrics: ["next_action_completion"],
    },
    {
      id: "lockin-goal_health",
      title: "Goal Health Check",
      description: "Are goals clear, realistic, and owned?",
      blocks: [
        {
          label: "Check",
          minutes: 5,
          description: "Clarity/ownership scale.",
          prompts: ["Rate clarity & ownership (1–10)."],
          metric: "goal_health_score",
        },
        {
          label: "Tighten",
          minutes: 5,
          description: "Refine wording + metric.",
          prompts: ["Refine the metric and deadline."],
          metric: "goal_refined",
        },
        {
          label: "Plan",
          minutes: 5,
          description: "Schedule first step.",
          prompts: ["Schedule first step."],
          metric: "step_scheduled",
        },
      ],
      recommendedMetrics: ["goal_progress_pct"],
    },
    {
      id: "lockin-data_loop",
      title: "Data Loop",
      description: "Pick 1–2 metrics and a review cadence.",
      blocks: [
        {
          label: "Pick",
          minutes: 5,
          description: "Choose 2 metrics.",
          prompts: ["Pick two simple metrics."],
          metric: "metrics_picked",
        },
        {
          label: "Track",
          minutes: 5,
          description: "Where/how to log.",
          prompts: ["Where will you log them?"],
          metric: "tracking_setup",
        },
        {
          label: "Review",
          minutes: 5,
          description: "Weekly check slot.",
          prompts: ["Set your weekly review slot."],
          metric: "review_slot_set",
        },
      ],
      recommendedMetrics: ["reviews_completed"],
    },
  ],

  // 🧭 Coach Watkins
  "coach-watkins": [
    {
      id: "watkins-practice_block",
      title: "Practice Block Design",
      description: "Clarity-first practice template.",
      blocks: [
        {
          label: "Objective",
          minutes: 5,
          description: "Define success signals.",
          prompts: ["Define the session objective."],
          metric: "objective_clarity",
        },
        {
          label: "Block",
          minutes: 6,
          description: "Warm-up, teach, rep, test.",
          prompts: ["Lay out the blocks."],
          metric: "blocks_defined",
        },
        {
          label: "KPI",
          minutes: 4,
          description: "Simple measure; teach-back.",
          prompts: ["Choose one KPI."],
          metric: "kpi_selected",
        },
      ],
      recommendedMetrics: ["kpi_hit_rate"],
    },
    {
      id: "watkins-culture_reset",
      title: "Culture Reset",
      description: "Standards and accountability mini-reset.",
      blocks: [
        {
          label: "Standards",
          minutes: 5,
          description: "Write 3 observable behaviors.",
          prompts: ["Write 3 standards."],
          metric: "standards_written",
        },
        {
          label: "Signals",
          minutes: 5,
          description: "Positive/negative signals.",
          prompts: ["List positive & negative signals."],
          metric: "signals_listed",
        },
        {
          label: "Ritual",
          minutes: 5,
          description: "1 daily ritual to reinforce.",
          prompts: ["Pick one daily ritual."],
          metric: "ritual_committed",
        },
      ],
      recommendedMetrics: ["standards_adherence"],
    },
    {
      id: "watkins-player_dev",
      title: "Player Development Map",
      description: "Individual plan with 2 metrics.",
      blocks: [
        {
          label: "Assess",
          minutes: 5,
          description: "Strengths/gaps.",
          prompts: ["List two strengths, two gaps."],
          metric: "gaps_listed",
        },
        {
          label: "Plan",
          minutes: 5,
          description: "2 cues; 1 constraint drill.",
          prompts: ["Choose 2 cues and 1 drill."],
          metric: "plan_written",
        },
        {
          label: "Track",
          minutes: 5,
          description: "2 metrics + cadence.",
          prompts: ["Pick two metrics + cadence."],
          metric: "metrics_set",
        },
      ],
      recommendedMetrics: ["dev_progress_pct"],
    },
  ],

  // 🎮 Coach Neuro
  "coach-neuro": [
    {
      id: "neuro-dual_task",
      title: "Dual-Task Builder",
      description: "Decision + movement under mild fatigue.",
      blocks: [
        {
          label: "Prime",
          minutes: 3,
          description: "Light cardio + rules.",
          prompts: ["Do 3 minutes of light cardio."],
          metric: "prime_minutes",
        },
        {
          label: "Task",
          minutes: 9,
          description: "Decision game paired with footwork.",
          prompts: ["Run the decision drill cycles."],
          metric: "accuracy_pct",
        },
        {
          label: "Lock-in",
          minutes: 3,
          description: "Where to slot in practice.",
          prompts: ["Where will you place this drill?"],
          metric: "slot_committed",
        },
      ],
      recommendedMetrics: ["accuracy_pct_fatigue"],
    },
    {
      id: "neuro-memory_speed",
      title: "Memory & Speed",
      description: "Working memory and processing speed ladder.",
      blocks: [
        {
          label: "Warm",
          minutes: 4,
          description: "n-back or recall list.",
          prompts: ["Run a 2-back or recall 7 items."],
          metric: "n_level",
        },
        {
          label: "Ladder",
          minutes: 7,
          description: "Increase difficulty stepwise.",
          prompts: ["Climb 3 steps if possible."],
          metric: "peak_level",
        },
        {
          label: "Transfer",
          minutes: 4,
          description: "Link to sport decisions.",
          prompts: ["Name 2 in-game transfers."],
          metric: "transfer_examples",
        },
      ],
      recommendedMetrics: ["peak_level", "transfer_count"],
    },
    {
      id: "neuro-reads_iq",
      title: "Reads & Sport IQ",
      description: "Faster pattern recognition.",
      blocks: [
        {
          label: "Clip",
          minutes: 5,
          description: "Describe options freeze-frame.",
          prompts: ["Call the best option in each clip."],
          metric: "options_called",
        },
        {
          label: "Rule",
          minutes: 5,
          description: "Write a decision heuristic.",
          prompts: ["Write your quick rule."],
          metric: "heuristic_written",
        },
        {
          label: "Reps",
          minutes: 5,
          description: "5 quick-fire scenarios.",
          prompts: ["Call 5 scenarios fast."],
          metric: "correct_calls",
        },
      ],
      recommendedMetrics: ["correct_calls_rate"],
    },
  ],

  // 🛌 Coach Recover
  "coach-recover": [
    {
      id: "recover-sleep_anchor",
      title: "Sleep Anchor",
      description: "Anchor wake time; build wind-down.",
      blocks: [
        {
          label: "Anchor",
          minutes: 5,
          description: "Pick fixed wake time.",
          prompts: ["Pick a fixed wake time."],
          metric: "wake_time_set",
        },
        {
          label: "Routine",
          minutes: 6,
          description: "3-step wind-down.",
          prompts: ["Choose your 3 steps."],
          metric: "winddown_defined",
        },
        {
          label: "Light",
          minutes: 4,
          description: "AM light plan.",
          prompts: ["Plan your AM light exposure."],
          metric: "light_minutes",
        },
      ],
      recommendedMetrics: ["wake_consistency"],
    },
    {
      id: "recover-readiness",
      title: "Readiness Rules",
      description: "Create simple go/no-go modifiers.",
      blocks: [
        {
          label: "Signals",
          minutes: 5,
          description: "Sleep, soreness, mood.",
          prompts: ["Rate sleep, soreness, mood."],
          metric: "readiness_score",
        },
        {
          label: "Rules",
          minutes: 5,
          description: "When to scale volume.",
          prompts: ["Write your scale-down rule."],
          metric: "rules_written",
        },
        {
          label: "Plan",
          minutes: 5,
          description: "Tomorrow’s adjustment.",
          prompts: ["Commit to tomorrow’s change."],
          metric: "adjustment_committed",
        },
      ],
      recommendedMetrics: ["scaled_sessions_pct"],
    },
    {
      id: "recover-mini_reset",
      title: "Mini-Reset Pack",
      description: "Set of 3 quick resets for school, practice, night.",
      blocks: [
        {
          label: "Pick",
          minutes: 4,
          description: "Choose 3 resets.",
          prompts: ["Pick your 3 go-to resets."],
          metric: "resets_defined",
        },
        {
          label: "Practice",
          minutes: 6,
          description: "Run each once.",
          prompts: ["Practice each reset now."],
          metric: "reps_done",
        },
        {
          label: "Deploy",
          minutes: 5,
          description: "Where they live.",
          prompts: ["Where will each reset live?"],
          metric: "locations_set",
        },
      ],
      recommendedMetrics: ["resets_used_per_day"],
    },
  ],

  // 💡 Coach Vision
  "coach-vision": [
    {
      id: "vision-pre_game",
      title: "Pre-Game Imagery",
      description: "1–3 min vivid mental run-through.",
      blocks: [
        {
          label: "Script",
          minutes: 6,
          description: "Multi-sensory script.",
          prompts: ["Draft a vivid script."],
          metric: "script_written",
        },
        {
          label: "Run",
          minutes: 6,
          description: "2 guided reps.",
          prompts: ["Run two imagery reps."],
          metric: "reps_completed",
        },
        {
          label: "Cue",
          minutes: 3,
          description: "Attach cue word.",
          prompts: ["Pick your cue word."],
          metric: "cue_selected",
        },
      ],
      recommendedMetrics: ["imagery_frequency"],
    },
    {
      id: "vision-error_reset",
      title: "Error Reset Imagery",
      description: "Rehearse mistake → reset → execute.",
      blocks: [
        {
          label: "Identify",
          minutes: 5,
          description: "Top error scenario.",
          prompts: ["Describe your error moment."],
          metric: "scenario_defined",
        },
        {
          label: "Rehearse",
          minutes: 6,
          description: "Run 3 cycles.",
          prompts: ["Run three cycles now."],
          metric: "cycles_run",
        },
        {
          label: "Deploy",
          minutes: 4,
          description: "When to use next.",
          prompts: ["Pick your next deploy moment."],
          metric: "deploy_slot",
        },
      ],
      recommendedMetrics: ["reset_speed_self_report"],
    },
    {
      id: "vision-skill_build",
      title: "Skill Build Imagery",
      description: "Accelerate motor pattern consolidation.",
      blocks: [
        {
          label: "Cue",
          minutes: 4,
          description: "One technical cue.",
          prompts: ["Pick the technical cue."],
          metric: "cue_defined",
        },
        {
          label: "Imagery",
          minutes: 7,
          description: "Slow/fast reps mentally.",
          prompts: ["Do slow → fast mental reps."],
          metric: "imagery_reps",
        },
        {
          label: "Bridge",
          minutes: 4,
          description: "First physical rep plan.",
          prompts: ["Plan your first physical rep."],
          metric: "first_rep_plan",
        },
      ],
      recommendedMetrics: ["quality_rep_ratio_next"],
    },
  ],

  // 🎓 Coach ScholarFlow
  "coach-scholarflow": [
    {
      id: "scholar-timeline",
      title: "Recruiting Timeline",
      description: "Plan outreach and milestones.",
      blocks: [
        {
          label: "Map",
          minutes: 5,
          description: "Key dates & divisions.",
          prompts: ["Which divisions fit you?"],
          metric: "milestones_listed",
        },
        {
          label: "Outreach",
          minutes: 6,
          description: "Draft 1 email template.",
          prompts: ["Draft your coach email."],
          metric: "email_drafted",
        },
        {
          label: "Lock-in",
          minutes: 4,
          description: "Send-by dates + video note.",
          prompts: ["Pick send dates and recipients."],
          metric: "send_dates_set",
        },
      ],
      recommendedMetrics: ["emails_sent", "coach_replies"],
    },
    {
      id: "scholar-eligibility",
      title: "Eligibility Check",
      description: "Verify academic standing.",
      blocks: [
        {
          label: "Audit",
          minutes: 5,
          description: "GPA, NCAA core, tests.",
          prompts: ["Share GPA/core courses."],
          metric: "eligibility_gaps",
        },
        {
          label: "Plan",
          minutes: 5,
          description: "Close gaps (course/test).",
          prompts: ["Choose your gap action."],
          metric: "gap_actions",
        },
        {
          label: "Support",
          minutes: 5,
          description: "Who can help.",
          prompts: ["List two helpers (counselor/coach)."],
          metric: "support_contacts",
        },
      ],
      recommendedMetrics: ["gaps_closed"],
    },
    {
      id: "scholar-reel_update",
      title: "Highlight Reel Update",
      description: "Upgrade film + share plan.",
      blocks: [
        {
          label: "Clips",
          minutes: 5,
          description: "Pick 3 best recent clips.",
          prompts: ["Pick 3 recent clips."],
          metric: "clips_selected",
        },
        {
          label: "Sequence",
          minutes: 5,
          description: "Order + lower text.",
          prompts: ["Order them and write lower-thirds."],
          metric: "sequence_written",
        },
        {
          label: "Share",
          minutes: 5,
          description: "Where to post; whom to email.",
          prompts: ["Name 3 targets to share with."],
          metric: "share_targets",
        },
      ],
      recommendedMetrics: ["reel_views", "coach_clicks"],
    },
  ],

  // 📱 Coach BrandHuddle
  "coach-brandhuddle": [
    {
      id: "brand-social_clean",
      title: "Social Clean & Guardrails",
      description: "Professionalize profiles safely.",
      blocks: [
        {
          label: "Audit",
          minutes: 5,
          description: "Bio, links, privacy.",
          prompts: ["Drop your handles (optional)."],
          metric: "issues_found",
        },
        {
          label: "Clean",
          minutes: 5,
          description: "Archive risky content.",
          prompts: ["Identify 3 posts to archive."],
          metric: "posts_archived",
        },
        {
          label: "Guard",
          minutes: 5,
          description: "Comment policy + DMs.",
          prompts: ["Write your DM/Comment policy."],
          metric: "guardrails_set",
        },
      ],
      recommendedMetrics: ["profile_quality_score"],
    },
    {
      id: "brand-content_loop",
      title: "Content Loop",
      description: "Plan one authentic, safe post/week.",
      blocks: [
        {
          label: "Idea",
          minutes: 5,
          description: "Topic + value.",
          prompts: ["Pick a topic aligned with your sport."],
          metric: "ideas_written",
        },
        {
          label: "Draft",
          minutes: 5,
          description: "Caption + CTA.",
          prompts: ["Draft caption + simple CTA."],
          metric: "draft_ready",
        },
        {
          label: "Post Plan",
          minutes: 5,
          description: "Day/time + cross-post.",
          prompts: ["Pick day/time + cross-posts."],
          metric: "schedule_set",
        },
      ],
      recommendedMetrics: ["post_consistency"],
    },
    {
      id: "brand-nil_intro",
      title: "NIL Intro",
      description: "Basics and opportunity map (non-legal).",
      blocks: [
        {
          label: "Basics",
          minutes: 5,
          description: "What NIL is/not (high-level).",
          prompts: ["Tell me what NIL means to you now."],
          metric: "understanding_check",
        },
        {
          label: "Map",
          minutes: 5,
          description: "Local brands & fit.",
          prompts: ["List 3 local brands that fit."],
          metric: "prospects_listed",
        },
        {
          label: "Outreach",
          minutes: 5,
          description: "Template + deliverables idea.",
          prompts: ["Write a 3-line outreach idea."],
          metric: "outreach_drafted",
        },
      ],
      recommendedMetrics: ["prospects_contacted"],
    },
  ],
}

/** Helpers */
export function getSessionsForCoach(slug: string): SessionType[] {
  return COACH_SESSION_TYPES[slug] ?? []
}
