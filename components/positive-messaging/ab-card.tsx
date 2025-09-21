"use client"

import type React from "react"

import { type PositiveVisual, TEMPLATES } from "@/lib/brand-visual-system"
import { accessibilityChecker } from "@/lib/accessibility-checker"
import { MessagePlate } from "./message-plate"
import { AccentBar } from "./accent-bar"
import { CTAChip } from "./cta-chip"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ABCardProps {
  visualType: PositiveVisual
  h1: string
  support: string
  chips?: string[]
  badge?: React.ReactNode
  className?: string
}

export function ABCard({ visualType, h1, support, chips = [], badge, className }: ABCardProps) {
  const template = TEMPLATES[visualType]
  const isPortrait = template.aspect === "portrait"
  const [accessibilityReport, setAccessibilityReport] = useState<any>(null)

  useEffect(() => {
    const report = accessibilityChecker.generateAccessibilityReport({
      type: visualType,
      h1,
      support,
      backgroundColor: "#1A1D1E", // Dark Graphite
      textColor: "#F7F7F7", // Off-white
      fontSize: 32, // Approximate clamp result
      isBold: true,
    })

    setAccessibilityReport(report)

    // Log accessibility warnings in development
    if (process.env.NODE_ENV === "development" && report.overall !== "PASS") {
      console.warn(`[Accessibility] ${visualType} has issues:`, report.recommendations)
    }
  }, [visualType, h1, support])

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-500 to-green-600",
        isPortrait ? "aspect-[9/16]" : "aspect-square",
        className,
      )}
      style={{ minHeight: isPortrait ? "400px" : "300px" }}
      role="img"
      aria-label={accessibilityReport?.altText || `${visualType} with message: ${h1}. ${support}`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4" aria-hidden="true">
          {badge}
        </div>
      )}

      {/* Main Content */}
      <MessagePlate className="text-center max-w-sm">
        <div className="space-y-4">
          {/* H1 with accent bar for certain types */}
          <div className="space-y-2">
            <h1
              className="font-bold leading-tight"
              style={{
                fontSize: "clamp(24px, 5vw, 40px)",
                minFontSize: "24px",
              }}
            >
              {h1}
            </h1>
            {(visualType === "affirmation_card" || visualType === "confidence_boost") && (
              <div className="flex justify-center" aria-hidden="true">
                <AccentBar />
              </div>
            )}
          </div>

          {/* Support text */}
          <p
            className="font-medium opacity-90"
            style={{
              fontSize: "clamp(16px, 3vw, 20px)",
              minFontSize: "16px",
            }}
          >
            {support}
          </p>

          {/* CTA Chips for autonomy choice */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center pt-2" role="group" aria-label="Action choices">
              {chips.map((chip, index) => (
                <CTAChip
                  key={index}
                  variant={index === 0 ? "primary" : "secondary"}
                  aria-label={`Choice ${index + 1}: ${chip}`}
                >
                  {chip}
                </CTAChip>
              ))}
            </div>
          )}
        </div>
      </MessagePlate>

      <div className="sr-only">
        Motivational card with high contrast design optimized for mobile viewing.
        {accessibilityReport?.contrast.passes
          ? `Meets accessibility contrast standards with ratio ${accessibilityReport.contrast.ratio}:1.`
          : "May have contrast issues for some users."}
      </div>
    </div>
  )
}
