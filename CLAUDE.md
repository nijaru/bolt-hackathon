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
**Status**: COMPLETE - All 6 integrations built and functional, ready for submission

## Quick Commands

**Development**:
```bash
# Frontend setup
npm install               # Install dependencies  
npm run dev              # Development server (localhost:5173)
npm run build            # Production build

# Database management
npx supabase db push     # Apply migrations
npx supabase db reset    # Reset database

# Deployment
netlify deploy           # Deploy to staging
netlify deploy --prod    # Deploy to production
```

**Demo Commands**:
```bash
# Quick demo setup
npm run demo:setup       # Setup demo environment
npm run demo:reset       # Reset demo data
npm run demo:test        # Test all integrations
```

## Project Status

**🏆 HACKATHON READY**: All 6 challenges complete and functional
**Demo Strategy**: See `docs/demo_strategy.md` for 3-minute presentation plan
**System Architecture**: See `docs/architecture.md` for technical design and patterns
**Manual Tasks**: See `docs/hackathon_submission_checklist.md` for demo prep checklist
**Submission Materials**: README.md updated with complete project overview

## Challenge Integrations (ALL COMPLETE ✅)

**1. Voice AI - ElevenLabs ($25K)**
- ✅ Personality-matched voice generation
- ✅ 4 distinct AI voices (Gordon Ramsay, Simon Cowell, etc.)
- ✅ Real-time audio streaming

**2. Make More Money - RevenueCat ($25K)**  
- ✅ Freemium subscription model
- ✅ Usage tracking and limits
- ✅ 3-tier pricing (Free/Premium/Enterprise)

**3. Silly Sh!t - Reddit ($25K)**
- ✅ Viral sharing mechanics
- ✅ Auto-generated post titles  
- ✅ Subreddit integration

**4. Custom Domain - IONOS ($25K)**
- ✅ Personal roast pages (username.roastme.io)
- ✅ SSL certificates and DNS management
- ✅ Branded public sharing

**5. Deploy - Netlify ($25K)**
- ✅ Serverless functions architecture
- ✅ Auto-scaling infrastructure
- ✅ Edge computing deployment

**6. Startup - Business Plan ($25K)**
- ✅ Complete business model ($50B TAM)
- ✅ Revenue projections ($1M ARR Year 2)
- ✅ Demo traction metrics

## Development Essentials

**Tech Stack**:
- **Frontend**: React/TypeScript via Bolt.new, Tailwind CSS + Shadcn components, Vite build
- **Backend**: Netlify Functions (serverless)
- **Database**: Supabase (PostgreSQL + Auth)
- **Python**: Managed with `uv` for microservices
- **Key APIs**: Google Gemini 2.5 Flash (primary), ElevenLabs (voice), RevenueCat (payments)

**Core Data Flow**: User Input → Content Parser → AI Analysis → Personality Generator → Output (Text/Voice)

**Required Integrations**: ElevenLabs, RevenueCat, Reddit API, IONOS, Supabase, Netlify

## Error Recovery

**Common Issues**:
- API rate limits: Implement caching and fallbacks
- Integration failures: Have backup demo materials ready
- Content moderation: Multiple validation layers
- Performance: Cache responses, optimize for demo environment

**Troubleshooting**: Check `.ai/context.md` for detailed solutions and recovery strategies