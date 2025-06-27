import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface Roast {
  id: string
  user_id: string | null
  input_type: 'url' | 'text' | 'file'
  input_content: string
  personality: 'gordon_ramsay' | 'simon_cowell' | 'gordon_gekko' | 'sherlock_holmes'
  roast_text: string
  improvements: string[]
  voice_url: string | null
  created_at: string
  is_public: boolean
  reddit_shared: boolean
}

export function useRoasts() {
  const [roasts, setRoasts] = useState<Roast[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchUserRoasts = async () => {
    if (!user) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('roasts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRoasts(data)
    }
    setLoading(false)
  }

  const createRoast = async (roastData: Omit<Roast, 'id' | 'created_at' | 'user_id'>) => {
    const { data, error } = await supabase
      .from('roasts')
      .insert({
        ...roastData,
        user_id: user?.id || null,
      })
      .select()
      .single()

    if (!error && data) {
      setRoasts(prev => [data, ...prev])
      return data
    }
    
    throw error
  }

  const getRoast = async (id: string) => {
    const { data, error } = await supabase
      .from('roasts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  const updateRoast = async (id: string, updates: Partial<Roast>) => {
    const { data, error } = await supabase
      .from('roasts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setRoasts(prev => prev.map(roast => 
        roast.id === id ? { ...roast, ...data } : roast
      ))
      return data
    }
    
    throw error
  }

  const deleteRoast = async (id: string) => {
    const { error } = await supabase
      .from('roasts')
      .delete()
      .eq('id', id)

    if (!error) {
      setRoasts(prev => prev.filter(roast => roast.id !== id))
    }
    
    return { error }
  }

  useEffect(() => {
    if (user) {
      fetchUserRoasts()
    } else {
      setRoasts([])
    }
  }, [user])

  return {
    roasts,
    loading,
    createRoast,
    getRoast,
    updateRoast,
    deleteRoast,
    refreshRoasts: fetchUserRoasts,
  }
}