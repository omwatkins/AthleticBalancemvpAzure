"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Search, Target, Award } from "lucide-react"

interface ReasoningPhaseIndicatorProps {
  currentPhase: number
}

export default function ReasoningPhaseIndicator({ currentPhase }: ReasoningPhaseIndicatorProps) {
  if (currentPhase === 0) return null

  const phases = [
    { name: "Initial Execution", icon: <Brain className="h-3 w-3" />, color: "bg-blue-500" },
    { name: "Reflection", icon: <Search className="h-3 w-3" />, color: "bg-amber-500" },
    { name: "Final Response", icon: <Target className="h-3 w-3" />, color: "bg-green-500" },
    { name: "Evaluation", icon: <Award className="h-3 w-3" />, color: "bg-purple-500" },
  ]

  return (
    <div className="space-y-2 w-full max-w-xs mx-auto">
      <Progress value={(currentPhase / 4) * 100} className="h-2" />
      <div className="flex justify-between">
        {phases.map((phase, index) => (
          <div key={index} className="flex flex-col items-center">
            <Badge
              variant={currentPhase > index ? "default" : "outline"}
              className={`w-5 h-5 rounded-full p-0 flex items-center justify-center ${
                currentPhase > index ? phase.color : ""
              }`}
            >
              {index + 1}
            </Badge>
            <span className={`text-[10px] mt-1 ${currentPhase > index ? "text-foreground" : "text-muted-foreground"}`}>
              {phase.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
