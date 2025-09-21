"use client"

import { BRAND } from "@/lib/brand-visual-system"
import { cn } from "@/lib/utils"
import { Star, Check, Zap } from "lucide-react"

interface BadgeProps {
  type?: "star" | "check" | "lightning"
  className?: string
}

export function Badge({ type = "star", className }: BadgeProps) {
  const Icon = type === "star" ? Star : type === "check" ? Check : Zap

  return (
    <div
      className={cn("inline-flex items-center justify-center w-8 h-8 rounded-full", className)}
      style={{
        backgroundColor: BRAND.color.primary,
        color: BRAND.color.offwhite,
      }}
    >
      <Icon size={16} fill="currentColor" />
    </div>
  )
}
