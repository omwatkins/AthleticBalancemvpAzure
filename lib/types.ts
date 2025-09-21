export interface Message {
  id: string
  role: "user" | "assistant" | "system" | "data"
  content: string
  createdAt?: Date
  data?: any
  parts?: Array<{ type: string; text: string }>
}
