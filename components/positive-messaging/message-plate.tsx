"use client"

import type React from "react"

import { BRAND } from "@/lib/brand-visual-system"
import { accessibilityChecker } from "@/lib/accessibility-checker"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface MessagePlateProps {
  children: React.ReactNode
  className?: string
  opacity?: number
}

export function MessagePlate({ children, className, opacity = 0.95 }: MessagePlateProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const contrast = accessibilityChecker.calculateContrastRatio(BRAND.color.offwhite, BRAND.color.graphite)

      if (!contrast.passes) {
        console.warn("[Accessibility] MessagePlate contrast ratio insufficient:", contrast)
      }
    }
  }, [])

  return (
    <div
      className={cn("rounded-lg p-6 backdrop-blur-sm", className)}
      style={{
        backgroundColor: `${BRAND.color.graphite}${Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`,
        color: BRAND.color.offwhite,
      }}
      role="region"
      aria-label="Message content"
    >
      {children}
    </div>
  )
}
