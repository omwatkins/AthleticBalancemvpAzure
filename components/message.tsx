"use client"

import type { Message } from "@/lib/types"
import { User, Bot, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MessageProps {
  message: Message
}

export default function MessageComponent({ message }: MessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 p-6 ${isUser ? "bg-muted/30" : "bg-background"}`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-base">{isUser ? "You" : "AI Coach"}</span>
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="prose prose-base max-w-none dark:prose-invert">
          {message.parts?.map((part, index) => {
            if (part.type === "text") {
              return (
                <div key={index} className="whitespace-pre-wrap leading-7 text-foreground">
                  {part.text}
                </div>
              )
            }
            return null
          }) || <div className="whitespace-pre-wrap leading-7 text-foreground">{message.content}</div>}
        </div>

        {!isUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.content)}
            className="h-8 px-3 text-xs hover:bg-muted/50 transition-colors"
          >
            {copied ? <Check className="h-3 w-3 mr-2" /> : <Copy className="h-3 w-3 mr-2" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  )
}
