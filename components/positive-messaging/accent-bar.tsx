"use client"

import { BRAND } from "@/lib/brand-visual-system"
import { cn } from "@/lib/utils"

interface AccentBarProps {
  className?: string
  height?: number
}

export function AccentBar({ className, height = 8 }: AccentBarProps) {
  return (
    <div
      className={cn("rounded-full", className)}
      style={{
        backgroundColor: BRAND.color.accent,
        height: `${height}px`,
        width: "60px",
      }}
    />
  )
}
