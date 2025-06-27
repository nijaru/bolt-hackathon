import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, History, Settings, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useRoasts } from '@/hooks/useRoasts'
import { PricingModal } from '@/components/PricingModal'

export function Profile() {
  const [showPricingModal, setShowPricingModal] = useState(false)
  const { user } = useAuth()
  const { getSubscriptionStatus, getRemainingFreeRoasts } = useSubscription()
  const { roasts } = useRoasts()
  
  const subscriptionStatus = getSubscriptionStatus()
  const remainingRoasts = getRemainingFreeRoasts()
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Profile</span>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              U
            </div>
            <div>
              <h3 className="font-semibold">{user?.email || 'Guest User'}</h3>
              <p className="text-gray-600 text-sm">
                {subscriptionStatus.tier === 'free' 
                  ? `Free Plan • ${remainingRoasts} roasts remaining today`
                  : `${subscriptionStatus.tier.charAt(0).toUpperCase() + subscriptionStatus.tier.slice(1)} Plan • Unlimited roasts`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Usage Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Roasts Generated</span>
              <span className="font-semibold">{roasts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Voice Roasts</span>
              <span className="font-semibold">{roasts.filter(r => r.voice_url).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shared to Reddit</span>
              <span className="font-semibold">{roasts.filter(r => r.reddit_shared).length}</span>
            </div>
          </CardContent>
        </Card>

        {subscriptionStatus.tier === 'free' ? (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span>Upgrade to Premium</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Unlimited roasts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Voice generation for all roasts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Priority processing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Exclusive personalities</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                onClick={() => setShowPricingModal(true)}
              >
                Upgrade Now - $9.99/month
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-green-500" />
                <span>Current Subscription</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {subscriptionStatus.tier.charAt(0).toUpperCase() + subscriptionStatus.tier.slice(1)} Plan
                </div>
                <p className="text-sm text-gray-600">Active subscription</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPricingModal(true)}
              >
                Manage Subscription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-500" />
            <span>Recent Roasts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roasts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No roasts yet! Create your first roast to see it here.</p>
              </div>
            ) : (
              roasts.slice(0, 5).map((roast) => (
                <div key={roast.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {roast.input_type === 'url' ? 'URL' : 'Text'} Roast
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(roast.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {roast.roast_text.substring(0, 80)}...
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {roast.personality.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                    {roast.voice_url && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Voice Available
                      </span>
                    )}
                    {roast.reddit_shared && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Shared
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </div>
  )
}