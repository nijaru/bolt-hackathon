import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X, Check, Crown, Zap, Star } from 'lucide-react'
import { subscriptionTiers } from '@/lib/revenuecat'
import { useSubscription } from '@/hooks/useSubscription'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { purchaseSubscription, getSubscriptionStatus } = useSubscription()
  const currentStatus = getSubscriptionStatus()

  if (!isOpen) return null

  const handlePurchase = async (tierId: string) => {
    if (tierId === 'free') {
      onClose()
      return
    }

    setLoading(tierId)
    try {
      await purchaseSubscription(tierId)
      onClose()
    } catch (error) {
      console.error('Purchase failed:', error)
      // Error is handled by the hook
    } finally {
      setLoading(null)
    }
  }

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'free':
        return <Zap className="h-6 w-6 text-blue-500" />
      case 'premium':
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 'enterprise':
        return <Star className="h-6 w-6 text-purple-500" />
      default:
        return null
    }
  }

  const isCurrentTier = (tierId: string) => currentStatus.tier === tierId

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-gray-600 mt-1">Unlock the full power of AI roasting</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative ${
                  tier.isPopular 
                    ? 'border-2 border-yellow-400 shadow-lg' 
                    : isCurrentTier(tier.id)
                    ? 'border-2 border-green-500'
                    : 'border border-gray-200'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {isCurrentTier(tier.id) && (
                  <div className="absolute -top-3 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Current</span>
                    </div>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {getTierIcon(tier.id)}
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {tier.price}
                    {tier.id !== 'free' && (
                      <span className="text-base font-normal text-gray-500">/month</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePurchase(tier.id)}
                    disabled={loading === tier.id || isCurrentTier(tier.id)}
                    className={`w-full ${
                      tier.isPopular
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : tier.id === 'enterprise'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    variant={isCurrentTier(tier.id) ? 'outline' : 'default'}
                  >
                    {loading === tier.id ? (
                      'Processing...'
                    ) : isCurrentTier(tier.id) ? (
                      'Current Plan'
                    ) : tier.id === 'free' ? (
                      'Continue Free'
                    ) : (
                      `Upgrade to ${tier.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-600">
              All plans include secure payment processing via RevenueCat
            </p>
            <p className="text-xs text-gray-500">
              Cancel anytime. No hidden fees. 7-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}