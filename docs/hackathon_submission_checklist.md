# 🏆 Hackathon Submission Checklist - AI Roast Generator

## 📋 Project Status
**Current State**: Codebase complete, builds successfully, all 6 partner integrations implemented  
**Target**: Bolt.new Hackathon submission targeting ALL 6 challenges ($150K potential)  
**Deadline**: Record 3-minute demo video and submit

---

## 🎯 CRITICAL PATH TO SUBMISSION

**Estimated Total Time: 3-4 hours**

### Phase 1: Environment & Deployment (90 minutes)
1. Environment Configuration → 2. Database Setup → 3. Production Deployment → 4. API Testing

### Phase 2: Testing & Demo Prep (60 minutes) 
5. End-to-End Testing → 6. Demo Data Preparation

### Phase 3: Demo Recording (60 minutes)
7. Demo Video Recording → 8. Final Submission

---

## ⚠️ HIGH PRIORITY TASKS (MUST COMPLETE)

### 1. Environment Configuration
**Time: 15 minutes**

```bash
# Copy environment template
cp .env.example .env
```

**Edit `.env` with your actual API keys:**
```env
# Core Services (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Model (Required - Gemini 2.5 Flash)
VITE_GOOGLE_AI_KEY=your_google_ai_api_key

# Voice AI Challenge - ElevenLabs ($25K)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Make More Money Challenge - RevenueCat ($25K)
VITE_REVENUECAT_PUBLIC_KEY=your_revenuecat_public_key

# Silly Sh!t Challenge - Reddit API ($25K)
VITE_REDDIT_CLIENT_ID=your_reddit_app_client_id
VITE_REDDIT_CLIENT_SECRET=your_reddit_app_secret

# Custom Domain Challenge - IONOS ($25K)
IONOS_API_KEY=your_ionos_api_key
IONOS_SECRET=your_ionos_secret

# Deploy Challenge - Netlify ($25K)
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id

# Content Moderation (Recommended)
OPENAI_API_KEY=your_openai_api_key
```

**Setup Accounts if Needed:**
- [ ] Supabase project created
- [ ] Google AI Studio API key
- [ ] ElevenLabs account + API key
- [ ] RevenueCat app configured
- [ ] Reddit app created
- [ ] IONOS domain API access
- [ ] Netlify account connected

---

### 2. Database Setup
**Time: 10 minutes**

```bash
# Install Supabase CLI if needed
npm install -g @supabase/cli

# Apply database migrations
npx supabase db push

# Verify tables created
npx supabase db status
```

**Verify in Supabase Dashboard:**
- [ ] Tables: `roasts`, `subscriptions`, `reddit_shares`, `custom_domains`
- [ ] RLS policies enabled on all tables
- [ ] Auth users table accessible

---

### 3. Production Deployment  
**Time: 20 minutes**

```bash
# Build and test locally first
npm run build
npm run preview

# Deploy to Netlify
netlify deploy --prod
```

**Verify Deployment:**
- [ ] Main app loads at production URL
- [ ] All 5 Netlify Functions deployed:
  - `/.netlify/functions/roast` (Gemini AI)
  - `/.netlify/functions/voice` (ElevenLabs)  
  - `/.netlify/functions/reddit` (Sharing)
  - `/.netlify/functions/ionos` (Domains)
  - `/.netlify/functions/moderate` (Content safety)
- [ ] Environment variables configured in Netlify dashboard

---

### 4. End-to-End Testing
**Time: 45 minutes**

**Test Complete User Journey:**

**4.1 Authentication Flow (5 min)**
- [ ] Sign up with email works
- [ ] Sign in with existing account
- [ ] Google OAuth sign-in (optional)

**4.2 Core Roast Generation (15 min)**
- [ ] Generate roast with Gordon Ramsay personality
- [ ] Generate roast with Simon Cowell personality  
- [ ] Generate roast with Gordon Gekko personality
- [ ] Generate roast with Sherlock Holmes personality
- [ ] Verify improvements list generates correctly
- [ ] Test content moderation (try inappropriate input)

**4.3 Voice AI Challenge - ElevenLabs (10 min)**
- [ ] Voice generation button appears
- [ ] Click generates voice successfully
- [ ] Audio plays correctly
- [ ] Different personalities have distinct voices

**4.4 Make More Money Challenge - RevenueCat (10 min)**
- [ ] Free tier limits work (3 roasts/day)
- [ ] Pricing modal opens correctly
- [ ] Subscription tiers display properly
- [ ] Upgrade flow functions (may not complete payment)

**4.5 Silly Sh!t Challenge - Reddit (5 min)**
- [ ] Reddit share button appears on roast results
- [ ] Modal opens with subreddit options
- [ ] Title generation works
- [ ] Share creates demo post (simulated)
- [ ] Share count updates in database

**4.6 Custom Domain Challenge - IONOS (5 min)**
- [ ] Custom domain button shows for premium users
- [ ] Domain creation modal works
- [ ] Subdomain validation works
- [ ] Domain creation simulated successfully
- [ ] Public roast page accessible

---

## 🎬 DEMO PREPARATION TASKS

### 5. Demo Data Setup
**Time: 30 minutes**

**Create Demo Content:**
- [ ] Create demo user account: `demo@roastgenerator.com`
- [ ] Generate 2-3 sample roasts with different personalities
- [ ] Test voice generation for demo roasts
- [ ] Create sample custom domain: `demo.roastme.io`
- [ ] Prepare backup screenshots of all features

**Demo Script Preparation:**
- [ ] Review `docs/demo_strategy.md` 
- [ ] Practice 3-minute pitch timing
- [ ] Prepare judge interaction elements
- [ ] Set up screen recording software

**Backup Materials Ready:**
- [ ] Screenshots of each integration working
- [ ] Pre-recorded voice samples
- [ ] Sample roast text for fallback
- [ ] Business metrics slide ready

---

### 6. Demo Video Recording
**Time: 60 minutes** 

**Pre-Recording Setup (15 min):**
- [ ] Clear browser cache/cookies
- [ ] Open demo app in incognito window
- [ ] Test screen recording software
- [ ] Prepare timer for 3-minute limit
- [ ] Have backup browser tab ready

**Recording Checklist (Following `docs/demo_strategy.md`):**

**Minute 1: Core Experience (60 seconds)**
- [ ] 0-15s: Problem introduction
- [ ] 15-30s: Live roast generation (Gordon Ramsay)
- [ ] 30-45s: Show constructive improvements
- [ ] 45-60s: ElevenLabs voice generation ✅ **Voice AI Challenge**

**Minute 2: Integrations (60 seconds)**  
- [ ] 60-75s: RevenueCat upgrade flow ✅ **Make More Money Challenge**
- [ ] 75-90s: Reddit sharing mechanics ✅ **Silly Sh!t Challenge**
- [ ] 90-105s: IONOS custom domain creation ✅ **Custom Domain Challenge**
- [ ] 105-120s: Netlify serverless architecture ✅ **Deploy Challenge**

**Minute 3: Business Case (60 seconds)**
- [ ] 120-135s: Market opportunity ✅ **Startup Challenge**
- [ ] 135-150s: Traction metrics & growth
- [ ] 150-165s: Investment ask ($500K seed)
- [ ] 165-180s: Call to action & contact info

**Post-Recording (30 min):**
- [ ] Review video quality
- [ ] Edit if needed (keep under 3 minutes)
- [ ] Add captions/subtitles
- [ ] Export in required format
- [ ] Upload to submission platform

---

## 🔧 TROUBLESHOOTING GUIDE

### Common Issues & Solutions

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API Not Working:**
- Check environment variables in Netlify dashboard
- Verify API keys are valid and have correct permissions
- Check function logs in Netlify dashboard

**Database Issues:**
- Verify Supabase URL and keys are correct
- Check RLS policies allow your operations
- Confirm migrations applied successfully

**Demo Day Failures:**
- Have screenshot backups ready
- Use pre-recorded voice samples if API fails
- Switch to fallback roast examples
- Show code/architecture if features fail

---

## ✅ FINAL SUBMISSION CHECKLIST

**Before Submitting:**
- [ ] Production app deployed and working
- [ ] All 6 integrations tested and functional
- [ ] 3-minute demo video recorded and uploaded
- [ ] README.md updated with submission details
- [ ] Repository clean and well-documented
- [ ] Demo materials backed up

**Submission Requirements:**
- [ ] Demo video (3 minutes max)
- [ ] GitHub repository link
- [ ] Live demo URL
- [ ] Challenge category selections (all 6)
- [ ] Team/individual information

---

## 📞 EMERGENCY CONTACTS & RESOURCES

**Documentation:**
- Demo Strategy: `docs/demo_strategy.md`
- Architecture: `docs/architecture.md` 
- Environment Setup: `.env.example`

**API Documentation:**
- [ElevenLabs API](https://elevenlabs.io/docs)
- [RevenueCat Web SDK](https://docs.revenuecat.com/docs/web)
- [Reddit API](https://www.reddit.com/dev/api/)
- [IONOS Domain API](https://developer.hosting.ionos.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

**Success Metrics:**
- Target: Win 5-6 challenges ($125K-$150K)
- All 6 integrations must work in demo
- Business case must be compelling
- Technical execution must be flawless

**🚀 YOU'VE GOT THIS! All the hard work is done - now execute and win! 🏆**