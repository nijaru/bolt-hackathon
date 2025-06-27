import { useState, useEffect } from 'react'
import { CustomerInfo } from '@revenuecat/purchases-js'
import { revenueCat } from '@/lib/revenuecat'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'

export function useSubscription() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Daily usage tracking for free tier
  const [dailyUsage, setDailyUsage] = useState({
    roasts_today: 0,
    last_reset: new Date().toDateString()
  })

  useEffect(() => {
    if (user) {
      initializeRevenueCat()
      loadDailyUsage()
    } else {
      setCustomerInfo(null)
      setLoading(false)
    }
  }, [user])

  const initializeRevenueCat = async () => {
    try {
      setLoading(true)
      await revenueCat.initialize(user?.id)
      const info = await revenueCat.getCustomerInfo()
      setCustomerInfo(info)
      
      // Sync with Supabase
      await syncSubscriptionWithSupabase(info)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize subscription')
    } finally {
      setLoading(false)
    }
  }

  const loadDailyUsage = async () => {
    if (!user) return

    try {
      // Get today's roast count from Supabase
      const today = new Date().toDateString()
      const { data, error } = await supabase
        .from('roasts')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0])

      if (!error && data) {
        setDailyUsage({
          roasts_today: data.length,
          last_reset: today
        })
      }
    } catch (error) {
      console.error('Failed to load daily usage:', error)
    }
  }

  const syncSubscriptionWithSupabase = async (info: CustomerInfo) => {
    if (!user) return

    try {
      const status = revenueCat.getSubscriptionStatus(info)
      
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          tier: status.tier,
          status: status.isActive ? 'active' : 'expired',
          revenue_cat_id: info.originalAppUserId,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Failed to sync subscription:', error)
      }
    } catch (error) {
      console.error('Subscription sync error:', error)
    }
  }

  const purchaseSubscription = async (packageId: string) => {
    try {
      setLoading(true)
      const offerings = await revenueCat.getOfferings()
      
      // Find the package to purchase
      let packageToPurchase = null
      for (const offering of offerings) {
        packageToPurchase = offering.availablePackages.find((pkg: any) => pkg.identifier === packageId)
        if (packageToPurchase) break
      }

      if (!packageToPurchase) {
        throw new Error('Package not found')
      }

      const updatedCustomerInfo = await revenueCat.purchasePackage(packageToPurchase)
      setCustomerInfo(updatedCustomerInfo)
      await syncSubscriptionWithSupabase(updatedCustomerInfo)
      
      return updatedCustomerInfo
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const restorePurchases = async () => {
    try {
      setLoading(true)
      const restoredInfo = await revenueCat.restorePurchases()
      setCustomerInfo(restoredInfo)
      await syncSubscriptionWithSupabase(restoredInfo)
      return restoredInfo
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const incrementDailyUsage = () => {
    const today = new Date().toDateString()
    setDailyUsage(prev => {
      if (prev.last_reset !== today) {
        // Reset counter for new day
        return { roasts_today: 1, last_reset: today }
      }
      return { ...prev, roasts_today: prev.roasts_today + 1 }
    })
  }

  // Helper functions
  const getSubscriptionStatus = () => {
    if (!customerInfo) return { tier: 'free' as const, isActive: true }
    return revenueCat.getSubscriptionStatus(customerInfo)
  }

  const hasFeatureAccess = (feature: string) => {
    if (!customerInfo) return feature === 'basic_features'
    return revenueCat.hasFeatureAccess(customerInfo, feature)
  }

  const canCreateRoast = () => {
    const status = getSubscriptionStatus()
    if (status.tier !== 'free') return true
    
    const today = new Date().toDateString()
    if (dailyUsage.last_reset !== today) return true
    
    return dailyUsage.roasts_today < 3
  }

  const getRemainingFreeRoasts = () => {
    const status = getSubscriptionStatus()
    if (status.tier !== 'free') return Infinity
    
    const today = new Date().toDateString()
    if (dailyUsage.last_reset !== today) return 3
    
    return Math.max(0, 3 - dailyUsage.roasts_today)
  }

  return {
    customerInfo,
    loading,
    error,
    dailyUsage,
    purchaseSubscription,
    restorePurchases,
    incrementDailyUsage,
    getSubscriptionStatus,
    hasFeatureAccess,
    canCreateRoast,
    getRemainingFreeRoasts,
    refreshCustomerInfo: initializeRevenueCat
  }
}