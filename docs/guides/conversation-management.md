# Conversation Management Guide

This guide explains how Athletic Balance AI implements conversation state management for AI coaching sessions.

## Our Implementation

Athletic Balance AI uses a hybrid approach combining local storage and Supabase database persistence for conversation state management.

### Key Components

1. **`lib/conversation-storage.ts`** - Core conversation state management
2. **`hooks/use-conversations.ts`** - React hook for managing conversation state
3. **Supabase Integration** - Database persistence for authenticated users

### Conversation Structure

\`\`\`typescript
interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  settings: {
    systemPrompt: string
    model: string
    temperature: number
    maxTokens: number
  }
}
\`\`\`

### State Management Flow

1. **Load Conversations**: Merge local storage and database conversations
2. **Create New**: Generate new conversation with unique ID
3. **Update Messages**: Append new messages and sync to storage
4. **Auto-save**: Persist to both local storage and database
5. **Context Preservation**: Maintain conversation history across sessions

### Best Practices

- **Automatic Titles**: Generate conversation titles from first user message
- **Dual Persistence**: Store locally for offline access, sync to database for cross-device
- **Context Window Management**: Monitor token usage to prevent truncation
- **Real-time Updates**: Update conversation state immediately on message changes

### Integration with OpenAI

Our implementation follows OpenAI's conversation state patterns:

- Manual state management through message history
- Context preservation across multiple turns
- Token usage optimization
- Proper error handling and fallbacks

See [OpenAI Conversation State Documentation](./api/openai-conversation-state.md) for detailed API patterns.
