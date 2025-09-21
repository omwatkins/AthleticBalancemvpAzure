"use client"

import { User, Copy, Check, Brain, Search, Target, Award, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ReasoningPipelineMessage {
  id: string
  role:
    | "user"
    | "initial_execution"
    | "reflection_on_initial"
    | "final_response"
    | "final_evaluation"
    | "reasoning_complete"
  content: string
  timestamp: Date
  metadata?: {
    phase: number
    phaseTitle: string
    integrityScore?: number
    rewardComponents?: {
      honest_uncertainty_bonus: number
      self_correction_bonus: number
      bias_avoidance_penalty: number
      logic_drift_penalty: number
    }
    assistantId?: string
    apiKey?: string
    // Complete reasoning data for the collapsible view
    reasoningData?: {
      initial_execution: string
      reflection_on_initial: string
      final_response: string
      final_evaluation: any
    }
  }
}

interface ReasoningPipelineMessageProps {
  message: ReasoningPipelineMessage
  allMessages?: ReasoningPipelineMessage[]
}

export default function ReasoningPipelineMessageComponent({
  message,
  allMessages = [],
}: ReasoningPipelineMessageProps) {
  const [copied, setCopied] = useState(false)
  const [isReasoningOpen, setIsReasoningOpen] = useState(false)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex gap-3 p-4 bg-muted/30">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">You</span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        </div>
      </div>
    )
  }

  // Check if this is the final response in a reasoning sequence
  const isFinalResponse = message.role === "final_response"
  const isReasoningComplete = message.role === "reasoning_complete"

  // If this is a reasoning complete message, show the new collapsible format
  if (isReasoningComplete && message.metadata?.reasoningData) {
    const { reasoningData } = message.metadata

    return (
      <div className="p-4 bg-background">
        <div className="space-y-4">
          {/* 💬 Output Utama ke User (Selalu Tampil) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
                <div className="text-white font-bold text-sm">PT</div>
              </div>
              <span className="font-semibold text-sm">Primordial Truth</span>
              <Badge className="bg-green-500 text-white text-xs">Final Answer</Badge>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap font-medium text-base leading-relaxed">
                    {reasoningData.final_response}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      by Executor v2
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(reasoningData.final_response)}
                    className="h-6 px-2 text-xs"
                  >
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 🔽 [Lihat Proses Berpikir AI] (Collapsible section) */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-lg"
              onClick={() => setIsReasoningOpen(!isReasoningOpen)}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                {isReasoningOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Brain className="h-4 w-4" />
                <span>Lihat Proses Berpikir AI</span>
                <Badge variant="outline" className="text-xs">
                  4 Phases
                </Badge>
              </div>
            </Button>

            {isReasoningOpen && (
              <Card className="border-l-4 border-l-blue-500 bg-gray-50/50 dark:bg-gray-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Reasoning Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Phase 1 – Initial Thought */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500 text-white text-xs">Phase 1</Badge>
                      <h4 className="font-semibold text-sm">🌀 Initial Thought</h4>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border">
                      <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300">
                        {reasoningData.initial_execution}
                      </pre>
                    </div>
                  </div>

                  {/* Phase 2 – Reflection on Initial */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500 text-white text-xs">Phase 2</Badge>
                      <h4 className="font-semibold text-sm">🔍 Reflection on Initial</h4>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border">
                      <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300">
                        {reasoningData.reflection_on_initial}
                      </pre>
                    </div>
                  </div>

                  {/* Phase 3 is the final response shown above, so we reference it */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white text-xs">Phase 3</Badge>
                      <h4 className="font-semibold text-sm">🎯 Final Execution</h4>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300 italic">
                        ↑ This answer shown above (revised based on reflection feedback)
                      </p>
                    </div>
                  </div>

                  {/* Phase 4 – Integrity Evaluation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500 text-white text-xs">Phase 4</Badge>
                      <h4 className="font-semibold text-sm">🧾 Final Evaluation</h4>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border">
                      {reasoningData.final_evaluation?.integrity_score !== undefined ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">Integrity Score</span>
                            <span className="text-lg font-bold">
                              {(reasoningData.final_evaluation.integrity_score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={reasoningData.final_evaluation.integrity_score * 100} className="h-2" />

                          {reasoningData.final_evaluation.reward_components && (
                            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                              <div className="flex justify-between">
                                <span>Uncertainty Bonus:</span>
                                <span
                                  className={
                                    reasoningData.final_evaluation.reward_components.honest_uncertainty_bonus >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {reasoningData.final_evaluation.reward_components.honest_uncertainty_bonus >= 0
                                    ? "+"
                                    : ""}
                                  {reasoningData.final_evaluation.reward_components.honest_uncertainty_bonus.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Correction Bonus:</span>
                                <span
                                  className={
                                    reasoningData.final_evaluation.reward_components.self_correction_bonus >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {reasoningData.final_evaluation.reward_components.self_correction_bonus >= 0
                                    ? "+"
                                    : ""}
                                  {reasoningData.final_evaluation.reward_components.self_correction_bonus.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bias Penalty:</span>
                                <span
                                  className={
                                    reasoningData.final_evaluation.reward_components.bias_avoidance_penalty >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {reasoningData.final_evaluation.reward_components.bias_avoidance_penalty >= 0
                                    ? "+"
                                    : ""}
                                  {reasoningData.final_evaluation.reward_components.bias_avoidance_penalty.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Logic Drift Penalty:</span>
                                <span
                                  className={
                                    reasoningData.final_evaluation.reward_components.logic_drift_penalty >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {reasoningData.final_evaluation.reward_components.logic_drift_penalty >= 0 ? "+" : ""}
                                  {reasoningData.final_evaluation.reward_components.logic_drift_penalty.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {reasoningData.final_evaluation.comment && (
                            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                              <strong>Assessment:</strong> {reasoningData.final_evaluation.comment}
                            </div>
                          )}
                        </div>
                      ) : (
                        <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300">
                          {JSON.stringify(reasoningData.final_evaluation, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  // For individual phase messages (fallback for old format)
  const getPhaseConfig = (role: string, phase: number) => {
    switch (role) {
      case "initial_execution":
        return {
          icon: <Brain className="h-4 w-4" />,
          color: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
          badgeColor: "bg-blue-500",
          title: "Phase 1: Initial Execution",
        }
      case "reflection_on_initial":
        return {
          icon: <Search className="h-4 w-4" />,
          color: "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
          badgeColor: "bg-amber-500",
          title: "Phase 2: Reflection on Initial",
        }
      case "final_response":
        return {
          icon: <Target className="h-4 w-4" />,
          color: "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
          badgeColor: "bg-green-500",
          title: "Phase 3: Final Response",
        }
      case "final_evaluation":
        return {
          icon: <Award className="h-4 w-4" />,
          color: "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
          badgeColor: "bg-purple-500",
          title: "Phase 4: Final Evaluation",
        }
      default:
        return {
          icon: <Brain className="h-4 w-4" />,
          color: "bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800",
          badgeColor: "bg-gray-500",
          title: "Processing...",
        }
    }
  }

  const phaseConfig = getPhaseConfig(message.role, message.metadata?.phase || 0)

  return (
    <div className={`p-4 ${phaseConfig.color} border-l-4`}>
      <Card className={`${phaseConfig.color} border-2`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {phaseConfig.icon}
            {phaseConfig.title}
            <Badge className={`text-xs text-white ${phaseConfig.badgeColor}`}>
              Phase {message.metadata?.phase || "?"}
            </Badge>
            {message.metadata?.apiKey && (
              <Badge variant="outline" className="text-xs">
                {message.metadata.apiKey}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {message.metadata?.assistantId && <span>Assistant: {message.metadata.assistantId.slice(-8)}</span>}
              <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="h-6 px-2 text-xs"
            >
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
