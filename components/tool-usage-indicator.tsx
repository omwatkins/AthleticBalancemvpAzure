"use client"

import { Badge } from "@/components/ui/badge"
import { Code, Search, FileText } from "lucide-react"

interface ToolUsageIndicatorProps {
  toolsUsed?: string[]
  className?: string
}

export default function ToolUsageIndicator({ toolsUsed = [], className }: ToolUsageIndicatorProps) {
  if (toolsUsed.length === 0) return null

  return (
    <div className={`flex gap-1 ${className}`}>
      {toolsUsed.includes("code_interpreter") && (
        <Badge variant="secondary" className="text-xs">
          <Code className="h-3 w-3 mr-1" />
          Code
        </Badge>
      )}
      {toolsUsed.includes("file_search") && (
        <Badge variant="secondary" className="text-xs">
          <Search className="h-3 w-3 mr-1" />
          Search
        </Badge>
      )}
      {toolsUsed.includes("function") && (
        <Badge variant="secondary" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Function
        </Badge>
      )}
    </div>
  )
}
