"use client"

import { User, Copy, Check, Brain, Search, Key } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PrimordialAvatar from "./primordial-avatar"
import ToolUsageIndicator from "./tool-usage-indicator"

interface DualAssistantMessage {
  id: string
  role: "user" | "assistant" | "reflection"
  content: string
  timestamp: Date
  reflection?: {
    notes: string
  }
  metadata?: {
    executionAssistant: string
    reflectionAssistant: string
    timestamp: string
    toolsEnabled?: string[]
    apiKeys?: {
      execution: string
      reflection: string
    }
    assistantIds?: {
      execution: string
      reflection: string
    }
  }
}

interface DualAssistantMessageProps {
  message: DualAssistantMessage
}

export default function DualAssistantMessageComponent({ message }: DualAssistantMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"
  const isReflection = message.role === "reflection"

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

  if (isReflection) {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400">
        <Card className="bg-amber-100/50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-amber-600" />
              Reflection Analysis
              <Badge variant="secondary" className="text-xs">
                Integrity Check
              </Badge>
              {message.metadata?.apiKeys?.reflection && (
                <Badge variant="outline" className="text-xs">
                  <Key className="h-3 w-3 mr-1" />
                  {message.metadata.apiKeys.reflection}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Assistant:{" "}
                  {message.metadata?.assistantIds?.reflection?.slice(-8) ||
                    message.metadata?.reflectionAssistant?.slice(-8)}
                </span>
                {message.metadata?.apiKeys?.reflection && <span>• API: {message.metadata.apiKeys.reflection}</span>}
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

  // Assistant response
  return (
    <div className="flex gap-3 p-4 bg-background">
      <PrimordialAvatar />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Primordial Truth</span>
          <Badge variant="outline" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            Execution
          </Badge>
          {message.metadata?.apiKeys?.execution && (
            <Badge variant="outline" className="text-xs">
              <Key className="h-3 w-3 mr-1" />
              {message.metadata.apiKeys.execution}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Assistant:{" "}
              {message.metadata?.assistantIds?.execution?.slice(-8) || message.metadata?.executionAssistant?.slice(-8)}
            </span>
            {message.metadata?.apiKeys?.execution && (
              <span className="text-xs text-muted-foreground">• API: {message.metadata.apiKeys.execution}</span>
            )}
            <ToolUsageIndicator toolsUsed={message.metadata?.toolsEnabled} />
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
      </div>
    </div>
  )
}
