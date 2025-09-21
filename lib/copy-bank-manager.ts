import { COPY_BANKS, type PositiveVisual } from "./brand-visual-system"

export interface CopySelection {
  h1: string
  support: string
  category: keyof typeof COPY_BANKS
  visualType: PositiveVisual
}

export class CopyBankManager {
  private static instance: CopyBankManager

  static getInstance(): CopyBankManager {
    if (!CopyBankManager.instance) {
      CopyBankManager.instance = new CopyBankManager()
    }
    return CopyBankManager.instance
  }

  // Get contextually appropriate copy based on situation and needs
  selectCopy(
    visualType: PositiveVisual,
    context: {
      emotion?: "struggling" | "confident" | "unmotivated" | "neutral"
      situation?: "post_game" | "practice" | "studying" | "general"
      needs?: {
        autonomy?: boolean
        competence?: boolean
        relatedness?: boolean
      }
    },
  ): CopySelection {
    // Determine primary psychological need
    let primaryCategory: keyof typeof COPY_BANKS = "selfAffirmation"

    if (context.needs?.autonomy) {
      primaryCategory = "autonomy"
    } else if (context.needs?.competence) {
      primaryCategory = "competence"
    } else if (context.needs?.relatedness) {
      primaryCategory = "relatedness"
    } else if (context.emotion === "struggling" || context.emotion === "unmotivated") {
      primaryCategory = "mindset"
    }

    // Get appropriate copy from the selected category
    const copyOptions = COPY_BANKS[primaryCategory]
    const selectedCopy = this.getRandomCopy(copyOptions)

    // Generate H1 and support text based on visual type and copy
    const { h1, support } = this.formatCopyForVisualType(selectedCopy, visualType, context)

    return {
      h1,
      support,
      category: primaryCategory,
      visualType,
    }
  }

  // Format copy appropriately for different visual types
  private formatCopyForVisualType(
    baseCopy: string,
    visualType: PositiveVisual,
    context: any,
  ): { h1: string; support: string } {
    switch (visualType) {
      case "affirmation_card":
        return this.formatAffirmationCard(baseCopy, context)
      case "confidence_boost":
        return this.formatConfidenceBoost(baseCopy, context)
      case "process_cue":
        return this.formatProcessCue(baseCopy, context)
      case "belonging_tile":
        return this.formatBelongingTile(baseCopy, context)
      case "autonomy_choice":
        return this.formatAutonomyChoice(baseCopy, context)
      case "mindset_micro":
        return this.formatMindsetMicro(baseCopy, context)
      default:
        return { h1: baseCopy.split(" ").slice(0, 3).join(" "), support: baseCopy }
    }
  }

  private formatAffirmationCard(baseCopy: string, context: any): { h1: string; support: string } {
    const words = baseCopy.split(" ")
    if (words.length <= 4) {
      return { h1: baseCopy, support: "You've got this." }
    }

    const h1 = words.slice(0, 3).join(" ")
    const support = words.slice(3).join(" ") + "."
    return { h1, support }
  }

  private formatConfidenceBoost(baseCopy: string, context: any): { h1: string; support: string } {
    if (context.situation === "post_game") {
      return { h1: "Found a Way", support: "We adjust, we improve." }
    }

    const words = baseCopy.split(" ")
    const h1 = words.slice(0, 2).join(" ")
    const support = "Evidence beats doubt."
    return { h1, support }
  }

  private formatProcessCue(baseCopy: string, context: any): { h1: string; support: string } {
    if (context.situation === "practice") {
      return { h1: "Form, Then Force", support: "Footwork first, speed later." }
    }

    return { h1: "Progress Over Perfect", support: baseCopy }
  }

  private formatBelongingTile(baseCopy: string, context: any): { h1: string; support: string } {
    return { h1: "We Got Us", support: baseCopy }
  }

  private formatAutonomyChoice(baseCopy: string, context: any): { h1: string; support: string } {
    return {
      h1: "Choose Your Win",
      support: "Film / Form / Fuel", // Three choice chips
    }
  }

  private formatMindsetMicro(baseCopy: string, context: any): { h1: string; support: string } {
    if (baseCopy.includes("=")) {
      const parts = baseCopy.split("=")
      return { h1: parts[0].trim() + " =", support: parts[1].trim() }
    }

    return { h1: "Not Yet ≠ No", support: baseCopy }
  }

  private getRandomCopy(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)]
  }

  // Get all available copy for a specific category
  getCopyByCategory(category: keyof typeof COPY_BANKS): string[] {
    return COPY_BANKS[category]
  }

  // Add new copy to a category (for future expansion)
  addCopy(category: keyof typeof COPY_BANKS, newCopy: string): void {
    if (!COPY_BANKS[category].includes(newCopy)) {
      COPY_BANKS[category].push(newCopy)
    }
  }

  // Get copy suggestions based on keywords
  suggestCopy(keywords: string[]): { category: keyof typeof COPY_BANKS; copies: string[] }[] {
    const suggestions: { category: keyof typeof COPY_BANKS; copies: string[] }[] = []

    Object.entries(COPY_BANKS).forEach(([category, copies]) => {
      const matchingCopies = copies.filter((copy) =>
        keywords.some((keyword) => copy.toLowerCase().includes(keyword.toLowerCase())),
      )

      if (matchingCopies.length > 0) {
        suggestions.push({
          category: category as keyof typeof COPY_BANKS,
          copies: matchingCopies,
        })
      }
    })

    return suggestions
  }

  // Validate copy meets brand guidelines (12 words max)
  validateCopy(h1: string, support: string): { valid: boolean; issues: string[] } {
    const issues: string[] = []
    const totalWords = (h1 + " " + support).split(" ").length

    if (totalWords > 12) {
      issues.push(`Total word count (${totalWords}) exceeds 12-word limit`)
    }

    if (h1.split(" ").length > 4) {
      issues.push("H1 should be 4 words or fewer")
    }

    if (support.split(" ").length > 8) {
      issues.push("Support text should be 8 words or fewer")
    }

    return {
      valid: issues.length === 0,
      issues,
    }
  }
}

// Export singleton instance
export const copyBankManager = CopyBankManager.getInstance()
