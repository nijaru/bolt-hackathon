# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES

- **Hackathon Timeline**: Extremely time-sensitive project for Bolt.new hackathon with $150K potential
- **Prize Strategy**: Target ALL 6 challenges worth $25K each (Voice AI, Make More Money, Silly Sh!t, Custom Domain, Deploy, Startup)
- **Required Integrations**: ALL 6 services must be functional (ElevenLabs, RevenueCat, Reddit, IONOS, Supabase, Netlify)
- **Content Safety**: Implement toxicity detection - roasts must be constructive, not harmful
- **Demo Ready**: Every feature must work in live demo environment with backup plans
- **Task Flow**: Use TodoWrite/TodoRead tools proactively for multi-step work

## Project Context

**What**: AI Roast Generator - constructive AI-powered roasting tool with personality voices and improvement suggestions
**Why**: Bolt.new hackathon project targeting 6 challenge prizes ($25K each = $150K potential)
**Status**: Initial setup phase - no code yet, planning complete (see docs/roast_generator_spec.md)

## Quick Commands

**Setup Phase**:
```bash
# Python microservices setup (when ready)
uv sync                    # Install dependencies
uv run python main.py     # Run Python services
uv add <package>          # Add new package

# Frontend setup (via Bolt.new)
npm install               # Install dependencies  
npm run dev              # Development server
npm run build            # Production build
```

**Task Management**:
- Always start with: TodoRead (check current tasks)
- For multi-step work: TodoWrite (create task breakdown)

## Task Management

**Current Focus**: Check `docs/tasks.json` for current tasks and priorities
**System Architecture**: See `docs/architecture.md` for technical design and patterns
**AI Context**: Check `.ai/context.md` for project patterns, troubleshooting, and constraints

## Essential Sources

**Project Planning**: `docs/roast_generator_spec.md` - Complete project specification and roadmap
**System Design**: `docs/architecture.md` - Technical architecture, database schema, API design
**Development Context**: `.ai/context.md` - Patterns, common issues, integration notes
**API Design**: 
```javascript
POST /api/roast           # Generate new roast
GET /api/roast/:id        # Retrieve saved roast
POST /api/voice/:roastId  # Generate audio version
POST /api/share/reddit    # Share to Reddit
GET /api/user/history     # User's roast history
```

## Development Essentials

**Tech Stack**:
- **Frontend**: React/TypeScript via Bolt.new, Tailwind CSS + Shadcn components, Vite build
- **Backend**: Netlify Functions (serverless)
- **Database**: Supabase (PostgreSQL + Auth)
- **Python**: Managed with `uv` for microservices
- **Key APIs**: OpenAI GPT-4, ElevenLabs (voice), RevenueCat (payments)

**Core Data Flow**: User Input → Content Parser → AI Analysis → Personality Generator → Output (Text/Voice)

**Required Integrations**: ElevenLabs, RevenueCat, Reddit API, IONOS, Supabase, Netlify

## Error Recovery

**Common Issues**:
- API rate limits: Implement caching and fallbacks
- Integration failures: Have backup demo materials ready
- Content moderation: Multiple validation layers
- Performance: Cache responses, optimize for demo environment

**Troubleshooting**: Check `.ai/context.md` for detailed solutions and recovery strategies