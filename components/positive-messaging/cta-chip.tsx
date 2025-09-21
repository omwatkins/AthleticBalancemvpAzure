"use client"

import type React from "react"

import { BRAND } from "@/lib/brand-visual-system"
import { cn } from "@/lib/utils"

interface CTAChipProps {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary"
}

export function CTAChip({ children, className, variant = "primary" }: CTAChipProps) {
  const isPrimary = variant === "primary"

  return (
    <div
      className={cn("inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium", className)}
      style={{
        backgroundColor: isPrimary ? BRAND.color.primary : BRAND.color.accent,
        color: isPrimary ? BRAND.color.offwhite : BRAND.color.graphite,
      }}
    >
      {children}
    </div>
  )
}
