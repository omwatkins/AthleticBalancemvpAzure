# Athletic Balance AI - MVP

*AI-powered athletic coaching platform for mental performance training*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/orlando-watkins-projects/v0-open-ai-chatbot-website-oo)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/dsYTMunQ45I)

## Overview

Athletic Balance AI is a specialized coaching platform that combines sports psychology, flow theory, and deliberate practice research to help athletes develop mental performance skills. The platform features AI-powered coaches that provide personalized guidance through text-based conversations.

### Key Features

- **Specialized AI Coaches**: Multiple coaching personalities focused on different aspects of athletic performance
- **Science-Based Approach**: Grounded in sports psychology and performance research
- **Text-Based Coaching**: Simple, accessible conversations with AI coaches
- **User Authentication**: Secure login and profile management via Supabase
- **Progress Tracking**: Weekly progress monitoring (coming soon)

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT models
- **Deployment**: Vercel

## Documentation

- [OpenAI Conversation State Management](./docs/api/openai-conversation-state.md)
- [Conversation Management Guide](./docs/guides/conversation-management.md)

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User profile information
- `coaches` - AI coach configurations
- `coach_sessions` - User coaching session data

## Deployment

The application is deployed on Vercel and automatically syncs with v0.app deployments.

**Live URL**: [https://vercel.com/orlando-watkins-projects/v0-open-ai-chatbot-website-oo](https://vercel.com/orlando-watkins-projects/v0-open-ai-chatbot-website-oo)

## Development

Continue building and modifying the application on v0.app:
**[https://v0.app/chat/projects/dsYTMunQ45I](https://v0.app/chat/projects/dsYTMunQ45I)**
