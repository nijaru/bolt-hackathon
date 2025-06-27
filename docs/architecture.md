# AI Roast Generator - System Architecture

## Overview

The AI Roast Generator is a full-stack application designed for the Bolt.new hackathon, targeting 6 prize challenges worth $150K total. The architecture emphasizes rapid development, robust integrations, and demo-ready functionality.

## Core Architecture

### Frontend (Bolt.new)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (fast development, hot reload)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Context + useState
- **Routing**: React Router v6

### Backend Services
- **API Layer**: Netlify Functions (serverless)
- **Database**: Supabase (PostgreSQL + real-time)
- **Authentication**: Supabase Auth (JWT-based)
- **File Storage**: Supabase Storage

### AI & Voice Services
- **Primary AI**: Google Gemini 2.5 Flash (ultra-affordable ~$0.30/1M tokens)
- **Fallback AI**: GPT-4o-mini (different provider redundancy)
- **Voice Generation**: ElevenLabs API (3 months free from Builder Pack)
- **Content Moderation**: OpenAI Moderation API (free)
- **Content Analysis**: Gemini 2.5 Flash (same model for consistency)

### Integration Services
- **Payments**: RevenueCat SDK
- **Social Sharing**: Reddit API
- **Custom Domains**: IONOS API
- **Deployment**: Netlify

## Data Flow Architecture

```
User Input → Content Parser → AI Analysis → Personality Engine → Output Generation → Storage/Sharing
     ↓              ↓              ↓              ↓                ↓                    ↓
  URL/Text →    Extraction →   Weakness ID →  Roast Gen →    Text/Voice →      DB/Reddit
```

## Database Schema (Supabase)

### Core Tables
```sql
-- Users (handled by Supabase Auth)
users (
  id uuid primary key,
  email text,
  created_at timestamp
)

-- Roasts
roasts (
  id uuid primary key,
  user_id uuid references users(id),
  input_type text, -- 'url', 'text', 'file'
  input_content text,
  personality text, -- 'gordon_ramsay', 'simon_cowell', etc.
  roast_text text,
  voice_url text,
  created_at timestamp,
  is_public boolean default false
)

-- User subscriptions (RevenueCat)
subscriptions (
  id uuid primary key,
  user_id uuid references users(id),
  tier text, -- 'free', 'premium', 'enterprise'
  status text,
  updated_at timestamp
)
```

## API Design

### Core Endpoints
```javascript
// Roast Management
POST /api/roast              // Generate new roast
GET /api/roast/:id           // Retrieve specific roast
GET /api/user/roasts         // User's roast history

// Voice Generation
POST /api/voice/:roastId     // Generate audio version
GET /api/voice/:roastId      // Get audio URL

// Social Sharing
POST /api/share/reddit       // Share to Reddit
POST /api/share/link         // Generate shareable link

// User Management
GET /api/user/profile        // User profile data
POST /api/user/subscription  // Update subscription
```

## Personality System

### Available Personalities
1. **Gordon Ramsay**: Culinary-focused, passionate criticism
2. **Simon Cowell**: Entertainment industry, blunt feedback  
3. **Gordon Gekko**: Business/finance, ruthless analysis
4. **Sherlock Holmes**: Analytical, deductive reasoning

### Personality Engine
```python
class PersonalityEngine:
    def __init__(self):
        self.gemini_client = genai.GenerativeModel('gemini-2.5-flash')
        self.personalities = {
            'gordon_ramsay': 'Passionate culinary expert with fiery criticism',
            'simon_cowell': 'Blunt entertainment industry veteran',
            'gordon_gekko': 'Ruthless business analysis focused on profit',
            'sherlock_holmes': 'Deductive reasoning with analytical precision'
        }
    
    def generate_roast(self, content, personality):
        # Single Gemini call for consistency and cost efficiency
        prompt = self.build_personality_prompt(content, personality)
        response = self.gemini_client.generate_content(prompt)
        
        return self.parse_roast_and_improvements(response.text)
```

## Security & Content Safety

### Content Moderation Pipeline
1. **Input Validation**: Sanitize all user inputs
2. **Toxicity Detection**: OpenAI Moderation API
3. **Bias Prevention**: Multiple prompt strategies
4. **Output Filtering**: Final safety check before display

### Data Protection
- All API keys in environment variables
- User data encrypted at rest (Supabase)
- HTTPS everywhere
- Rate limiting on all endpoints

## Performance Considerations

### Caching Strategy
- **AI Responses**: Cache similar inputs (1 hour TTL)
- **Voice Generation**: Permanent storage in Supabase
- **User Data**: Real-time with Supabase subscriptions

### Optimization
- Code splitting with Vite
- Image optimization
- API response compression
- CDN deployment via Netlify

## Deployment Architecture

### Netlify Deployment
```
├── Frontend (SPA)
│   ├── React build output
│   └── Static assets
├── Netlify Functions
│   ├── /api/roast
│   ├── /api/voice  
│   └── /api/share
└── Environment Config
    ├── OpenAI API keys
    ├── ElevenLabs keys
    └── Service credentials
```

### Environment Variables
```bash
# AI Services
GOOGLE_GEMINI_API_KEY=
OPENAI_API_KEY=              # For moderation API (free) and fallback
ELEVENLABS_API_KEY=          # 3 months free from Builder Pack

# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Integrations
REVENUECART_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
IONOS_API_KEY=
```

## Error Handling & Recovery

### Fallback Strategies
- **Gemini Failure**: GPT-4o-mini backup model
- **All AI Failure**: Pre-generated roasting templates for demo
- **ElevenLabs Failure**: Browser text-to-speech fallback
- **Database Issues**: Local storage backup
- **Network Issues**: Offline mode with cached roasts

### Monitoring
- API response times
- Error rates by service
- User engagement metrics
- Revenue tracking (RevenueCat)

## Development Workflow

### Local Development
```bash
# Frontend development
npm run dev              # Start Vite dev server

# Backend testing  
netlify dev             # Run functions locally

# Database management
supabase start          # Local Supabase instance
```

### Testing Strategy
- Unit tests for core roasting logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Load testing for demo scenarios

## Scalability Considerations

### Current Limits
- Netlify Functions: 10s execution limit
- Gemini: Rate limits (15 RPM free tier, 1000 RPM paid)
- ElevenLabs: Character limits (10k/month free via Builder Pack)
- Supabase: Connection pooling

### Cost Projections (Google Cloud $300 credit)
- **1000 roasts**: ~$0.15 (500-word responses)
- **10,000 roasts**: ~$1.50 
- **100,000 roasts**: ~$15
- **Credit capacity**: ~2M roasts before paid billing

### Scaling Strategy
- Gemini 2.5 Flash enables cost-effective unlimited tier
- Caching layer for similar LinkedIn profiles
- Queue system for voice generation
- CDN for static assets and cached responses