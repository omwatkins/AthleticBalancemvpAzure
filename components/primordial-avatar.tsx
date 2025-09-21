"use client"

import { cn } from "@/lib/utils"

interface PrimordialAvatarProps {
  className?: string
}

export default function PrimordialAvatar({ className }: PrimordialAvatarProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 shadow-lg",
        className,
      )}
    >
      <div className="text-white font-bold text-sm">PT</div>
    </div>
  )
}
