import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Flame, Mic, Share2, Crown, Globe, Zap, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { useRoasts } from '@/hooks/useRoasts'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { PricingModal } from '@/components/PricingModal'

export function Home() {
  const [input, setInput] = useState('')
  const [selectedPersonality, setSelectedPersonality] = useState<'gordon_ramsay' | 'simon_cowell' | 'gordon_gekko' | 'sherlock_holmes'>('gordon_ramsay')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPricingModal, setShowPricingModal] = useState(false)
  
  const navigate = useNavigate()
  const { createRoast } = useRoasts()
  const { } = useAuth()
  const { canCreateRoast, getRemainingFreeRoasts, incrementDailyUsage, getSubscriptionStatus } = useSubscription()

  const handleRoast = async () => {
    if (!input.trim()) return
    
    // Check subscription limits
    if (!canCreateRoast()) {
      setError('Daily limit reached. Upgrade to Premium for unlimited roasts!')
      setShowPricingModal(true)
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      // Determine input type
      const inputType = input.startsWith('http') ? 'url' : 'text'
      
      // First moderate the content
      const moderation = await api.moderateContent({ text: input })
      
      if (moderation.flagged || !moderation.safe_for_demo) {
        setError('Content flagged for review. Please ensure input is appropriate for roasting.')
        setIsLoading(false)
        return
      }

      // Generate the roast
      const roastResponse = await api.generateRoast({
        input_content: input,
        personality: selectedPersonality,
        input_type: inputType
      })

      // Save to database
      const savedRoast = await createRoast({
        input_type: inputType,
        input_content: input,
        personality: selectedPersonality,
        roast_text: roastResponse.roast_text,
        improvements: roastResponse.improvements,
        voice_url: null,
        is_public: false,
        reddit_shared: false
      })

      // Increment usage counter for free users
      incrementDailyUsage()

      // Navigate to result page
      navigate(`/roast/${savedRoast.id}`)

    } catch (error) {
      console.error('Error generating roast:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate roast')
    }
    
    setIsLoading(false)
  }

  const remainingRoasts = getRemainingFreeRoasts()
  const subscriptionStatus = getSubscriptionStatus()

  const personalities = [
    { name: 'Gordon Ramsay', key: 'gordon_ramsay', icon: '👨‍🍳', description: 'Culinary criticism with passion' },
    { name: 'Simon Cowell', key: 'simon_cowell', icon: '🎤', description: 'Entertainment industry bluntness' },
    { name: 'Gordon Gekko', key: 'gordon_gekko', icon: '💼', description: 'Ruthless business analysis' },
    { name: 'Sherlock Holmes', key: 'sherlock_holmes', icon: '🔍', description: 'Deductive reasoning master' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
          Get Roasted by AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Constructive AI-powered feedback with personality. Input your LinkedIn, portfolio, or startup pitch 
          and get brutally honest advice with actionable improvements.
        </p>
      </div>

      {/* Input Section */}
      <Card className="border-2 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span>What needs roasting?</span>
          </CardTitle>
          <CardDescription>
            Paste a LinkedIn URL, upload your resume, or describe your startup idea
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Input
              placeholder="https://linkedin.com/in/yourprofile or paste text..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleRoast}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isLoading ? 'Roasting...' : 'Roast Me!'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {subscriptionStatus.tier === 'free' ? (
                `⚡ Free: ${remainingRoasts} roasts remaining today`
              ) : (
                `🔥 ${subscriptionStatus.tier.charAt(0).toUpperCase() + subscriptionStatus.tier.slice(1)}: Unlimited roasts`
              )}
            </div>
            {subscriptionStatus.tier === 'free' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPricingModal(true)}
              >
                <Crown className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personality Selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Choose Your Roaster</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {personalities.map((personality) => (
            <Card 
              key={personality.key} 
              className={`cursor-pointer hover:shadow-lg transition-all ${
                selectedPersonality === personality.key 
                  ? 'border-orange-500 bg-orange-50 shadow-md' 
                  : 'border-orange-100'
              }`}
              onClick={() => setSelectedPersonality(personality.key as any)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-3xl">{personality.icon}</div>
                <h3 className="font-semibold">{personality.name}</h3>
                <p className="text-xs text-gray-600">{personality.description}</p>
                {selectedPersonality === personality.key && (
                  <div className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-purple-500" />
              <span>Voice Roasts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Hear your roast in authentic personality voices powered by ElevenLabs AI
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowPricingModal(true)}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-green-500" />
              <span>Premium Tiers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Unlock unlimited roasts, priority processing, and exclusive personalities
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              View Pricing
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              <span>Share & Go Viral</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Share your roasts on Reddit and social media with one click
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Badges */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-center mb-4">Powered by Industry Leaders</h3>
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <span>Custom Domains</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Serverless Deploy</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-purple-500" />
            <span>Enterprise Scale</span>
          </div>
        </div>
      </div>

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </div>
  )
}