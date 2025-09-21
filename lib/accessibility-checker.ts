import { BRAND } from "./brand-visual-system"

export interface ContrastResult {
  ratio: number
  passes: boolean
  level: "AA" | "AAA" | "FAIL"
}

export class AccessibilityChecker {
  private static instance: AccessibilityChecker

  static getInstance(): AccessibilityChecker {
    if (!AccessibilityChecker.instance) {
      AccessibilityChecker.instance = new AccessibilityChecker()
    }
    return AccessibilityChecker.instance
  }

  // Convert hex color to RGB
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  // Calculate relative luminance
  private getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  // Calculate contrast ratio between two colors
  calculateContrastRatio(color1: string, color2: string): ContrastResult {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)

    if (!rgb1 || !rgb2) {
      return { ratio: 0, passes: false, level: "FAIL" }
    }

    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    const ratio = (brightest + 0.05) / (darkest + 0.05)

    return {
      ratio: Math.round(ratio * 100) / 100,
      passes: ratio >= BRAND.minContrast,
      level: ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "FAIL",
    }
  }

  // Check all brand color combinations
  checkBrandContrast(): Record<string, ContrastResult> {
    const results: Record<string, ContrastResult> = {}

    // Text on backgrounds
    results["text_on_graphite"] = this.calculateContrastRatio(BRAND.color.offwhite, BRAND.color.graphite)
    results["text_on_primary"] = this.calculateContrastRatio(BRAND.color.offwhite, BRAND.color.primary)
    results["graphite_on_offwhite"] = this.calculateContrastRatio(BRAND.color.graphite, BRAND.color.offwhite)
    results["primary_on_offwhite"] = this.calculateContrastRatio(BRAND.color.primary, BRAND.color.offwhite)
    results["accent_on_graphite"] = this.calculateContrastRatio(BRAND.color.accent, BRAND.color.graphite)
    results["graphite_on_accent"] = this.calculateContrastRatio(BRAND.color.graphite, BRAND.color.accent)

    return results
  }

  // Validate font sizes meet accessibility standards
  validateFontSize(
    fontSize: number,
    isBold = false,
  ): {
    valid: boolean
    recommendation: string
  } {
    const minSize = isBold ? BRAND.type.h1Min : BRAND.type.bodyMin

    if (fontSize >= minSize) {
      return {
        valid: true,
        recommendation: `Font size ${fontSize}px meets accessibility standards.`,
      }
    }

    return {
      valid: false,
      recommendation: `Font size ${fontSize}px is too small. Minimum recommended: ${minSize}px.`,
    }
  }

  // Generate accessible alt text for positive messaging visuals
  generateAltText(
    visualType: string,
    h1Text: string,
    supportText: string,
    hasAccentBar = false,
    hasBadge = false,
  ): string {
    const elements = []

    // Visual type description
    const typeDescriptions: Record<string, string> = {
      affirmation_card: "Affirmation card",
      confidence_boost: "Confidence boost card",
      process_cue: "Process reminder card",
      belonging_tile: "Community support tile",
      autonomy_choice: "Choice empowerment card",
      mindset_micro: "Mindset growth card",
    }

    elements.push(typeDescriptions[visualType] || "Motivational card")

    // Main message
    elements.push(`reading '${h1Text}'`)

    // Support text if different and meaningful
    if (supportText && supportText !== h1Text) {
      elements.push(`with supporting text '${supportText}'`)
    }

    // Visual elements
    if (hasAccentBar) {
      elements.push("featuring Electric Lime accent bar")
    }

    if (hasBadge) {
      elements.push("with achievement badge")
    }

    // Accessibility note
    elements.push("high-contrast text on dark message plate")

    return elements.join("; ") + "."
  }

  // Check if text meets readability guidelines
  checkReadability(text: string): {
    wordCount: number
    valid: boolean
    issues: string[]
    suggestions: string[]
  } {
    const words = text.trim().split(/\s+/)
    const wordCount = words.length
    const issues: string[] = []
    const suggestions: string[] = []

    // Word count check (12 word max for brand guidelines)
    if (wordCount > 12) {
      issues.push(`Text exceeds 12-word limit (${wordCount} words)`)
      suggestions.push("Shorten message for mobile readability")
    }

    // Sentence complexity
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgWordsPerSentence = wordCount / sentences.length

    if (avgWordsPerSentence > 8) {
      issues.push("Sentences may be too complex")
      suggestions.push("Break into shorter, clearer statements")
    }

    // Check for jargon or complex words
    const complexWords = words.filter((word) => word.length > 8)
    if (complexWords.length > wordCount * 0.3) {
      issues.push("May contain too many complex words")
      suggestions.push("Use simpler, more accessible language")
    }

    return {
      wordCount,
      valid: issues.length === 0,
      issues,
      suggestions,
    }
  }

  // Generate accessibility report for a visual
  generateAccessibilityReport(visual: {
    type: string
    h1: string
    support: string
    backgroundColor: string
    textColor: string
    fontSize: number
    isBold: boolean
  }): {
    overall: "PASS" | "WARNING" | "FAIL"
    contrast: ContrastResult
    fontSize: { valid: boolean; recommendation: string }
    readability: ReturnType<typeof this.checkReadability>
    altText: string
    recommendations: string[]
  } {
    const contrast = this.calculateContrastRatio(visual.textColor, visual.backgroundColor)
    const fontSize = this.validateFontSize(visual.fontSize, visual.isBold)
    const readability = this.checkReadability(visual.h1 + " " + visual.support)
    const altText = this.generateAltText(visual.type, visual.h1, visual.support)

    const recommendations: string[] = []

    if (!contrast.passes) {
      recommendations.push("Increase color contrast for better readability")
    }

    if (!fontSize.valid) {
      recommendations.push(fontSize.recommendation)
    }

    if (!readability.valid) {
      recommendations.push(...readability.suggestions)
    }

    // Determine overall status
    let overall: "PASS" | "WARNING" | "FAIL" = "PASS"

    if (!contrast.passes || !fontSize.valid) {
      overall = "FAIL"
    } else if (!readability.valid || contrast.level === "AA") {
      overall = "WARNING"
    }

    return {
      overall,
      contrast,
      fontSize,
      readability,
      altText,
      recommendations,
    }
  }
}

// Export singleton instance
export const accessibilityChecker = AccessibilityChecker.getInstance()
