/** ───────────────────────── POSITIVE MESSAGING VISUAL SYSTEM ───────────────────────── **/

export type PositiveVisual =
  | "affirmation_card"
  | "confidence_boost"
  | "process_cue"
  | "belonging_tile"
  | "autonomy_choice"
  | "mindset_micro"

export const BRAND = {
  color: {
    primary: "#0FA958", // Kelly Green
    graphite: "#1A1D1E", // Dark Graphite
    offwhite: "#F7F7F7", // Off-white
    accent: "#B5FF3D", // Electric Lime
  },
  minContrast: 4.5, // enforce in checks
  type: { h1Min: 24, bodyMin: 16 }, // px
}

export const TEMPLATES: Record<PositiveVisual, { aspect: "square" | "portrait"; maxWords: number }> = {
  affirmation_card: { aspect: "square", maxWords: 12 },
  confidence_boost: { aspect: "square", maxWords: 12 },
  process_cue: { aspect: "square", maxWords: 12 },
  belonging_tile: { aspect: "portrait", maxWords: 12 },
  autonomy_choice: { aspect: "square", maxWords: 12 },
  mindset_micro: { aspect: "portrait", maxWords: 12 },
}

type Aspect = "square" | "portrait"
const ASPECT_TO_SIZE: Record<Aspect, "1024x1024" | "1024x1792"> = {
  square: "1024x1024",
  portrait: "1024x1792",
}

// Copy banks organized by psychological principle
export const COPY_BANKS = {
  autonomy: [
    "Pick your next 1%.",
    "Choose effort you control.",
    "Your choices, your power.",
    "Own your process.",
    "Control what matters.",
  ],
  competence: [
    "Skills grow under reps.",
    "Evidence beats doubt.",
    "Progress over perfection.",
    "You're getting stronger.",
    "Small wins add up.",
  ],
  relatedness: [
    "Your team, your scaffold.",
    "We train together.",
    "Ask. Learn. Level up.",
    "Community over competition.",
    "We got us.",
  ],
  selfAffirmation: [
    "You are bigger than one result.",
    "Values travel with you.",
    "Character shows in challenges.",
    "Your worth isn't your score.",
    "Identity beyond outcomes.",
  ],
  mindset: [
    "Mistakes = data.",
    "Effort + strategy + help.",
    "Not yet ≠ no.",
    "Try new strategy.",
    "Growth through struggle.",
  ],
}

// Visual type definitions with messaging focus
const VISUAL_SPECS: Record<
  PositiveVisual,
  {
    h1Words: number
    supportWords: number
    description: string
    examples: { h1: string; support: string }[]
  }
> = {
  affirmation_card: {
    h1Words: 4,
    supportWords: 8,
    description: "H1 (2–4 words), Support (≤8 words), subtle accent underline",
    examples: [
      { h1: "Own Your Next Rep", support: "Tiny gains = big seasons." },
      { h1: "Values Travel", support: "Character shows in challenges." },
    ],
  },
  confidence_boost: {
    h1Words: 3,
    supportWords: 6,
    description: "Post-game confidence builder",
    examples: [
      { h1: "Found a Way", support: "We adjust, we improve." },
      { h1: "Evidence Beats Doubt", support: "You showed up today." },
    ],
  },
  process_cue: {
    h1Words: 3,
    supportWords: 6,
    description: "Practice-focused process reminder",
    examples: [
      { h1: "Form, Then Force", support: "Footwork first, speed later." },
      { h1: "Progress Over Perfect", support: "Small wins add up." },
    ],
  },
  belonging_tile: {
    h1Words: 3,
    supportWords: 6,
    description: "Relatedness and team connection",
    examples: [
      { h1: "We Got Us", support: "Ask. Learn. Level up." },
      { h1: "Your Team Scaffold", support: "Community over competition." },
    ],
  },
  autonomy_choice: {
    h1Words: 3,
    supportWords: 9,
    description: "Choice-focused empowerment with pill chips",
    examples: [
      { h1: "Choose Your Win", support: "Film / Form / Fuel" },
      { h1: "Pick Your 1%", support: "Effort / Strategy / Recovery" },
    ],
  },
  mindset_micro: {
    h1Words: 4,
    supportWords: 4,
    description: "Growth mindset micro-lesson",
    examples: [
      { h1: "Not Yet ≠ No", support: "Try new strategy." },
      { h1: "Mistakes = Data", support: "Growth through struggle." },
    ],
  },
}

// Brand-consistent style system
const BRAND_STYLE = [
  "Athletic Balance Positive Messaging style:",
  "Kelly Green (#0FA958) and Dark Graphite (#1A1D1E) palette;",
  "high-contrast text on solid message plate (90-95% opacity);",
  "clean geometric sans-serif typography (Inter/Manrope style);",
  "flat or subtle grain backgrounds; no busy photos;",
  "6-8% safe margins; plenty of negative space;",
  "accessibility-first: 4.5:1 contrast minimum;",
  "mobile-optimized: 24px+ headlines, 16px+ body text;",
  "evidence-based motivation; youth-appropriate; inclusive.",
].join(" ")

const LAYOUT_SPECS: Record<PositiveVisual, string> = {
  affirmation_card:
    "Square card: H1 top-left with Electric Lime accent bar underneath, support line below, optional badge top-right.",
  confidence_boost: "Square card: centered H1 with support below, subtle Kelly Green accent elements.",
  process_cue: "Square card: H1 with process-focused layout, support text emphasizing technique progression.",
  belonging_tile: "Portrait format: H1 center-aligned, support below, community-focused visual elements.",
  autonomy_choice: "Square card: H1 with three pill-shaped CTA chips below showing choices.",
  mindset_micro: "Portrait format: H1 center-aligned, concise support line, growth-focused accent.",
}

import { copyBankManager } from "./copy-bank-manager"
import { accessibilityChecker } from "./accessibility-checker"

// Generate messaging based on context and visual type
export function generatePositiveMessage(
  visualType: PositiveVisual,
  context: {
    sport?: string
    situation?: string
    emotion?: string
    needs?: {
      autonomy?: boolean
      competence?: boolean
      relatedness?: boolean
    }
  },
): { h1: string; support: string } {
  // Use copy bank manager for contextually appropriate messaging
  const copySelection = copyBankManager.selectCopy(visualType, {
    emotion: context.emotion as any,
    situation: context.situation as any,
    needs: context.needs,
  })

  return {
    h1: copySelection.h1,
    support: copySelection.support,
  }
}

// Extract context for positive messaging
export function extractPositiveContext(messages: Array<{ role: string; content: string }>) {
  const joined = messages
    .map((m) => m.content)
    .join("\n")
    .toLowerCase()

  // Detect emotional state
  const isStruggling = /struggling|difficult|hard|frustrated|stuck|failing|can't|unable/.test(joined)
  const isConfident = /good|great|awesome|nailed|crushed|killed it|confident|strong/.test(joined)
  const needsMotivation = /tired|exhausted|unmotivated|don't want|can't do|giving up/.test(joined)

  // Detect situation context
  const isPostGame = /game|match|competition|played|lost|won|scored|performance/.test(joined)
  const isPractice = /practice|training|drill|workout|session|exercise/.test(joined)
  const isStudying = /study|exam|test|homework|class|assignment|grade/.test(joined)

  // Detect psychological needs (SDT)
  const needsAutonomy = /choice|control|decide|pick|choose|freedom|independence|own/.test(joined)
  const needsCompetence = /improve|better|skill|progress|growth|learn|master|achieve/.test(joined)
  const needsRelatedness = /team|together|support|help|alone|friends|community|belong/.test(joined)

  return {
    emotion: isStruggling ? "struggling" : isConfident ? "confident" : needsMotivation ? "unmotivated" : "neutral",
    situation: isPostGame ? "post_game" : isPractice ? "practice" : isStudying ? "studying" : "general",
    needs: {
      autonomy: needsAutonomy,
      competence: needsCompetence,
      relatedness: needsRelatedness,
    },
  }
}

// Choose appropriate visual type based on context
export function choosePositiveVisualType(context: ReturnType<typeof extractPositiveContext>): PositiveVisual {
  // Post-game situations
  if (context.situation === "post_game") {
    return context.emotion === "struggling" ? "confidence_boost" : "affirmation_card"
  }

  // Practice situations
  if (context.situation === "practice") {
    return "process_cue"
  }

  // Study situations
  if (context.situation === "studying") {
    return "mindset_micro"
  }

  // Based on psychological needs
  if (context.needs.autonomy) return "autonomy_choice"
  if (context.needs.relatedness) return "belonging_tile"
  if (context.needs.competence) return "confidence_boost"

  // Default
  return "affirmation_card"
}

// Build image prompt for positive messaging
export function buildPositiveImagePrompt(
  visualType: PositiveVisual,
  userMessage: string,
  coachResponse: string,
  context: ReturnType<typeof extractPositiveContext>,
): { prompt: string; alt: string; size: "1024x1024" | "1024x1792" } {
  const template = TEMPLATES[visualType]
  const layoutSpec = LAYOUT_SPECS[visualType]
  const message = generatePositiveMessage(visualType, context)

  const accessibilityReport = accessibilityChecker.generateAccessibilityReport({
    type: visualType,
    h1: message.h1,
    support: message.support,
    backgroundColor: BRAND.color.graphite,
    textColor: BRAND.color.offwhite,
    fontSize: BRAND.type.h1Min,
    isBold: true,
  })

  // Log accessibility warnings in development
  if (process.env.NODE_ENV === "development" && accessibilityReport.overall !== "PASS") {
    console.warn(`[Accessibility] Generated visual may have issues:`, accessibilityReport.recommendations)
  }

  // Build the prompt with enhanced accessibility requirements
  const prompt = [
    `[${visualType}]`,
    BRAND_STYLE,
    layoutSpec,
    `Message content: H1 "${message.h1}" with support text "${message.support}".`,
    "Layout requirements: one focal H1 phrase, one support line, optional CTA chip;",
    "maximum 12 words total; 6-8% safe margins; plenty of negative space;",
    "Text overlay: solid message plate (Dark Graphite #1A1D1E, 90-95% opacity) behind all text;",
    "Typography: clean geometric sans-serif; H1 24-40px bold; support 16-20px medium;",
    "Accent elements: Electric Lime (#B5FF3D) accent bar under H1 when specified;",
    "Background: flat Kelly Green (#0FA958) or subtle grain; no busy photos; no logos;",
    "Accessibility: ensure 4.5:1 contrast ratio minimum; mobile-optimized sizing; clear text hierarchy;",
    "Text readability: high contrast, clear fonts, adequate spacing, no decorative elements that interfere with text;",
    "Screen reader friendly: clear visual hierarchy, meaningful color use beyond decoration;",
    "Style: evidence-based motivation; youth-appropriate; inclusive; brand-consistent.",
  ]
    .filter(Boolean)
    .join(" ")

  const alt = accessibilityChecker.generateAltText(
    visualType,
    message.h1,
    message.support,
    visualType === "affirmation_card" || visualType === "confidence_boost",
    false,
  )

  return {
    prompt,
    alt,
    size: ASPECT_TO_SIZE[template.aspect],
  }
}

// Detect if user wants positive messaging visual
export function wantsPositiveVisual(text: string): boolean {
  const t = text.toLowerCase()

  const positiveKeywords = [
    "motivate",
    "inspire",
    "encourage",
    "boost",
    "confidence",
    "affirmation",
    "positive",
    "mindset",
    "growth",
    "believe",
    "support",
    "strength",
    "power",
    "capable",
    "worthy",
    "progress",
    "improve",
    "better",
    "stronger",
    "resilient",
  ]

  const visualKeywords = [
    "card",
    "post",
    "image",
    "visual",
    "graphic",
    "design",
    "create",
    "make",
    "generate",
    "show",
    "picture",
  ]

  const hasPositiveIntent = positiveKeywords.some((keyword) => t.includes(keyword))
  const hasVisualIntent = visualKeywords.some((keyword) => t.includes(keyword))

  return hasPositiveIntent && hasVisualIntent
}
