# AI Context - Roast Generator Project

## Project Patterns

### Code Organization
- **Frontend**: React components in `src/components/`
- **API Functions**: Netlify functions in `netlify/functions/`
- **Utilities**: Shared utilities in `src/utils/`
- **Types**: TypeScript definitions in `src/types/`
- **Hooks**: Custom React hooks in `src/hooks/`

### Naming Conventions
- **Components**: PascalCase (e.g., `RoastGenerator.tsx`)
- **Files**: kebab-case (e.g., `roast-generator.tsx`)
- **Functions**: camelCase (e.g., `generateRoast`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### Technology Decisions
- **React over SolidJS**: Ecosystem maturity, integration speed for hackathon timeline
- **uv for Python**: Fast package management for microservices
- **Vite over CRA**: Faster development and build times
- **Shadcn over Material-UI**: Better Tailwind integration, smaller bundle

## Common Issues & Solutions

### API Integration Issues
- **Rate Limits**: Implement exponential backoff, cache responses
- **API Key Management**: Use environment variables, never commit secrets
- **CORS Issues**: Configure Netlify functions properly for cross-origin requests
- **Timeout Handling**: Set appropriate timeouts for AI API calls (Gemini is fast but ElevenLabs can be slow)

### Development Issues
- **Hot Reload Problems**: Clear browser cache, restart dev server
- **TypeScript Errors**: Enable strict mode, use proper type definitions
- **Build Failures**: Check environment variables in Netlify deployment
- **Supabase Connection**: Verify API keys and database URL

### Performance Issues
- **Slow AI Responses**: Implement loading states, consider response streaming
- **Large Bundle Size**: Use code splitting, optimize imports
- **Memory Leaks**: Cleanup effects, unsubscribe from subscriptions
- **Voice Generation Delays**: Show progress indicators, implement queuing

## Architecture Constraints

### Hackathon Limitations
- **Time Pressure**: Prioritize working features over perfect code
- **Demo Focus**: Every feature must work in live demo environment
- **Integration Requirements**: All 6 services must be functional for prize eligibility
- **Content Safety**: Implement robust toxicity detection - roasts must be constructive

### Technical Constraints
- **Netlify Functions**: 10-second execution limit
- **Google Gemini API**: Rate limits (15 RPM free, 1000 RPM paid), context length limits
- **ElevenLabs**: Character limits for voice generation (10k/month free via Builder Pack)
- **RevenueCat**: Mobile SDK vs web implementation differences

## Service Integration Notes

### Google Gemini 2.5 Flash
```javascript
// Recommended prompt structure
const roastPrompt = `
You are ${personality}. Analyze this content and provide constructive criticism in your signature style.
Content: ${content}
Rules: Be harsh but helpful. Include specific improvement suggestions.
Format: [Roast] followed by [Improvements]
`;

// Gemini API call pattern
const response = await genai.generateContent(roastPrompt);
const roastText = response.response.text();
```

### ElevenLabs Voice
```javascript
// Voice personality mapping
const voiceMap = {
  'gordon_ramsay': 'voice_id_1',
  'simon_cowell': 'voice_id_2',
  'gordon_gekko': 'voice_id_3'
};
```

### Supabase Setup
```sql
-- Enable RLS on all tables
alter table roasts enable row level security;

-- Policy for user access
create policy "Users can access own roasts"
  on roasts for all
  using (auth.uid() = user_id);
```

## Error Recovery Strategies

### Demo Backup Plans
1. **Pre-generated Roasts**: Famous tech figures (Elon Musk, Mark Zuckerberg, etc.) for live demo
2. **Offline Demo Video**: 3-minute backup video if live integration fails
3. **Multiple Personality Examples**: Ready-to-show examples for each personality type
4. **Screenshot Evidence**: All integrations working locally with timestamps
5. **Fallback Personalities**: Generic roasting templates if Gemini/AI services fail
6. **Judge Participation**: Pre-selected volunteer judges if audience participation fails

### Development Recovery
- **Database Reset**: Scripts to recreate schema quickly
- **API Fallbacks**: Mock responses if services are down
- **Local Development**: Ensure everything works offline
- **Quick Deployment**: Automated deployment pipeline

## Code Quality Standards

### Required for Hackathon
- **Functional Code**: Working features over perfect architecture
- **Basic Testing**: Core functionality must be tested
- **Error Handling**: Graceful failure for all external APIs
- **Security**: No exposed API keys, basic input validation

### Nice to Have
- **Comprehensive Tests**: Full test coverage
- **Perfect Architecture**: Clean code patterns
- **Advanced Features**: Complex optimizations
- **Documentation**: Extensive code comments

## Troubleshooting Workflow

### When Things Break
1. **Check API Status**: Verify all external services are up
2. **Review Logs**: Netlify function logs, browser console
3. **Test Locally**: Reproduce issue in development
4. **Fallback Mode**: Switch to backup functionality
5. **Quick Fix**: Prioritize working demo over perfect solution

### Common Debugging Commands
```bash
# Test Netlify functions locally
netlify dev

# Supabase status
supabase status

# Database migrations
npx supabase db push

# Build and deploy
npm run build && netlify deploy --prod

# Check function logs
netlify functions:log
```

## Success Metrics

### Demo Requirements
- **Response Time**: < 10 seconds for roast generation
- **Integration Success**: All 6 services working live
- **Error Handling**: Graceful failures with user feedback
- **User Experience**: Smooth flow from input to output

### Development Metrics
- **Build Success**: Clean builds without warnings
- **Test Coverage**: Core functionality tested
- **Performance**: Lighthouse scores > 80
- **Security**: No exposed secrets or vulnerabilities