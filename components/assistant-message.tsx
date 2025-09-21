"use client"

import { User, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import PrimordialAvatar from "./primordial-avatar"
import type { Message } from "@/lib/types"

interface AssistantMessageProps {
  message: Message
}

export default function AssistantMessageComponent({ message }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 p-4 ${isUser ? "bg-muted/30" : "bg-background"}`}>
      {isUser ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
          <User className="h-4 w-4 text-white" />
        </div>
      ) : (
        <PrimordialAvatar />
      )}

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{isUser ? "You" : "Primordial Truth"}</span>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          {message.role === "data" ? (
            <div>
              {(message.data as any).description && <p>{(message.data as any).description}</p>}
              <pre className="bg-gray-200 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(message.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>

        {!isUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.content)}
            className="h-6 px-2 text-xs"
          >
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  )
}
