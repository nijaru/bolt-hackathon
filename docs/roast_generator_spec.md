# AI Roast Generator - Project Spec & Roadmap

## Project Overview
**Constructive AI-powered roasting tool that provides brutally honest feedback with actionable improvement suggestions**

### Core Value Proposition
- Transform professional feedback from generic to memorable
- Multi-personality AI roasting (Gordon Ramsay, Simon Cowell, etc.)
- Voice-enabled roasts with distinct personalities
- Viral sharing mechanics built-in
- Freemium monetization model

---

## Research Requirements

### Hackathon Specifics
- [ ] **Challenge Prize Details**: Review exact requirements for each $25K challenge
- [ ] **Bolt.new Badge Requirements**: Implementation specifications for "Built with Bolt.new" badge
- [ ] **Submission Format**: Video requirements, deployment specs, email verification process
- [ ] **Judging Timeline**: When/how judges will evaluate (affects demo strategy)
- [ ] **Technical Restrictions**: Any limitations on external APIs or services

### Technical Research
- [ ] **Bolt.new Capabilities**: What can/cannot be built, deployment options, limitations
- [ ] **ElevenLabs API**: Voice generation limits, pricing, quality options, personality voices
- [ ] **RevenueCat Integration**: Mobile vs web implementation, paywall builder specifics
- [ ] **Reddit API**: Posting limits, subreddit rules, authentication requirements
- [ ] **Supabase Capabilities**: Real-time features, scaling limits, pricing tiers
- [ ] **IONOS Domain Integration**: Domain registration process, DNS setup requirements
- [ ] **Netlify Deployment**: Serverless function limits, build requirements

### Content & Legal Research
- [ ] **LinkedIn Scraping**: Legal methods, rate limits, ToS compliance
- [ ] **Content Moderation**: AI toxicity detection tools, bias prevention methods
- [ ] **Privacy Compliance**: GDPR requirements, data retention policies
- [ ] **Roasting Ethics**: Boundaries for constructive vs harmful feedback

---

## Technical Architecture

### Recommended Tech Stack
**Frontend (Bolt.new)**
- **Primary**: React/TypeScript (chosen over SolidJS for ecosystem/integration speed)
- **Build**: Vite (fast development)
- **Styling**: Tailwind CSS + Shadcn components (Bolt.new compatible)
- **State Management**: React Context/useState

**Backend Services**
- **API Gateway**: Netlify Functions (serverless, easy deployment)
- **AI Processing**: OpenAI GPT-4 API + Claude API (fallback)
- **Voice Generation**: ElevenLabs API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: RevenueCat SDK

**Supporting Services**
- **Web Scraping**: Python service (managed with uv) deployed as microservice
- **Content Analysis**: Go service for performance-critical parsing
- **File Processing**: Python + libraries for resume/portfolio analysis

### Data Flow Architecture
```
User Input → Content Parser → AI Analysis Engine → Personality Generator → Output (Text/Voice) → Sharing/Storage
```

---

## Implementation Roadmap

### Phase 1: Core Functionality
- [ ] **Bolt.new Setup**: Initialize React app with basic UI
- [ ] **Input Processing**: URL parsing, text analysis, file upload
- [ ] **Basic AI Integration**: OpenAI API for roast generation
- [ ] **Personality Engine**: 3-4 distinct roasting personalities
- [ ] **Output Display**: Clean text formatting, basic sharing

### Phase 2: Challenge Integrations
- [ ] **Voice AI (ElevenLabs)**: Audio roast generation with personality voices
- [ ] **RevenueCat**: Freemium model implementation
- [ ] **Supabase**: User accounts, roast history, analytics
- [ ] **Reddit Integration**: One-click sharing to relevant subreddits
- [ ] **Custom Domains (IONOS)**: Personal roast page generation

### Phase 3: Advanced Features
- [ ] **Improvement Suggestions**: Actionable advice generation
- [ ] **Multi-Input Support**: LinkedIn, portfolios, resumes, startup pitches
- [ ] **Viral Mechanics**: Leaderboards, comparison modes, social sharing
- [ ] **Content Moderation**: Safety filters, bias detection

### Phase 4: Polish & Submission
- [ ] **Performance Optimization**: Caching, error handling, loading states
- [ ] **Demo Preparation**: Live demo scripting, backup plans
- [ ] **Video Production**: 3-minute demo video
- [ ] **Documentation**: README, usage guides, technical specs

---

## Challenge Prize Strategy

### Target Challenges ($150K Potential)
1. **Voice AI Challenge** ($25K) - ElevenLabs personality voices
2. **Make More Money Challenge** ($25K) - RevenueCat premium tiers
3. **Silly Sh!t Challenge** ($25K) - Reddit sharing integration
4. **Custom Domain Challenge** ($25K) - IONOS personal roast pages
5. **Deploy Challenge** ($25K) - Netlify full-stack deployment
6. **Startup Challenge** ($25K) - Supabase scaling infrastructure

### Integration Requirements
- Each challenge needs clear demonstration in demo video
- Badge/logo placement for partner services
- Documentation of how each service enhances the product
- Usage metrics/analytics for business case

---

## Technical Implementation Reference

**Detailed technical specifications available in `docs/architecture.md`:**
- Complete database schema and API design
- Microservices architecture and deployment details  
- Security implementation and environment configuration
- Performance optimization and scaling strategies

---

## Demo Strategy

### Live Demonstration Flow
1. **Hook**: "Who wants to get roasted first?" (judge participation)
2. **Input**: Live LinkedIn/portfolio analysis
3. **Personality Showcase**: Multiple roasting styles
4. **Voice Demo**: Audio roast with personality
5. **Improvement Focus**: Show constructive suggestions
6. **Viral Proof**: Sharing mechanics demonstration
7. **Business Model**: Revenue streams and scaling

### Backup Plans
- Pre-generated roasts of famous tech figures
- Offline demo video if live fails
- Multiple personality examples ready
- Screenshot evidence of integrations working

---

## Success Metrics

### Technical KPIs
- Response time < 10 seconds for roast generation
- 99% uptime during demo period
- Support for 10+ concurrent users
- All 6 challenge integrations functional

### Business KPIs
- Clear monetization path demonstration
- Viral sharing mechanics proof
- User retention strategy
- Scalability evidence (Supabase analytics)

### Judge Appeal Factors
- **Memorable**: Live roasting creates lasting impression
- **Technical Depth**: Multi-service architecture showcases skills
- **Business Viability**: Clear revenue model and scaling path
- **Social Impact**: Constructive feedback improves professional development

---

## Risk Mitigation

### Technical Risks
- **API Rate Limits**: Implement caching and fallback services
- **Content Quality**: Multiple prompt strategies, human oversight
- **Performance**: Load testing, CDN deployment
- **Integration Failures**: Backup plans for each challenge service

### Business Risks
- **Content Moderation**: Robust filtering to prevent harmful roasts
- **Legal Issues**: Clear ToS, privacy policy, ethical guidelines
- **Scaling Costs**: Freemium model to offset API costs
- **Competition**: Focus on unique personality + improvement angle

---

## Next Steps

### Immediate Actions (Next 24 Hours)
1. Research all challenge prize requirements in detail
2. Set up Bolt.new development environment
3. Create accounts for all integration services
4. Design basic UI mockups and user flow
5. Test OpenAI API for roast generation quality

### Weekly Priorities
- Day 1-2: Core roasting engine and basic UI
- Day 2-3: Challenge integrations (prioritize highest value)
- Day 3-4: Polish, testing, demo preparation

### Pre-Submission Checklist
- [ ] All challenge requirements met and documented
- [ ] Demo video under 3 minutes, uploaded publicly
- [ ] Live deployment with Bolt.new badge
- [ ] Email verification provided
- [ ] Backup demo materials prepared