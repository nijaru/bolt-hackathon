import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Volume2, Download, Heart, ArrowLeft, Loader2 } from 'lucide-react'
import { useRoasts, Roast } from '@/hooks/useRoasts'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { RedditShare } from '@/components/RedditShare'
import { CustomDomain } from '@/components/CustomDomain'

const personalityMap = {
  gordon_ramsay: { name: 'Gordon Ramsay', icon: '👨‍🍳' },
  simon_cowell: { name: 'Simon Cowell', icon: '🎤' },
  gordon_gekko: { name: 'Gordon Gekko', icon: '💼' },
  sherlock_holmes: { name: 'Sherlock Holmes', icon: '🔍' }
}

export function RoastResult() {
  const { id } = useParams()
  const { user } = useAuth()
  const { getRoast, updateRoast } = useRoasts()
  const [roast, setRoast] = useState<Roast | null>(null)
  const [loading, setLoading] = useState(true)
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRoast = async () => {
      if (!id) return
      
      try {
        const roastData = await getRoast(id)
        setRoast(roastData)
      } catch (error) {
        setError('Failed to load roast')
        console.error('Error fetching roast:', error)
      }
      
      setLoading(false)
    }

    fetchRoast()
  }, [id, getRoast])

  const handleGenerateVoice = async () => {
    if (!roast || roast.voice_url) return
    
    setVoiceLoading(true)
    try {
      const voiceResponse = await api.generateVoice({
        text: roast.roast_text,
        personality: roast.personality
      })
      
      // Update roast with voice URL
      const updatedRoast = await updateRoast(roast.id, {
        voice_url: voiceResponse.audio_url
      })
      
      setRoast(updatedRoast)
    } catch (error) {
      console.error('Error generating voice:', error)
      setError('Failed to generate voice')
    }
    
    setVoiceLoading(false)
  }

  const playVoice = () => {
    if (roast?.voice_url) {
      const audio = new Audio(roast.voice_url)
      audio.play()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !roast) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">{error || 'Roast not found'}</p>
        <Link to="/">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  const personality = personalityMap[roast.personality]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Your Roast Results</h1>
      </div>

      <Card className="border-2 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span className="text-2xl">{personality.icon}</span>
              <span>{personality.name} says...</span>
            </span>
            <div className="flex space-x-2">
              {roast.voice_url ? (
                <Button variant="outline" size="sm" onClick={playVoice}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play Voice
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateVoice}
                  disabled={voiceLoading}
                >
                  {voiceLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-2" />
                  )}
                  {voiceLoading ? 'Generating...' : 'Generate Voice'}
                </Button>
              )}
              {user && (
                <RedditShare
                  roastId={roast.id}
                  roastText={roast.roast_text}
                  personality={personality.name}
                  userId={user.id}
                />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="text-gray-800 font-medium italic">"{roast.roast_text}"</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <span>Constructive Improvements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {roast.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  {index + 1}
                </span>
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        {user && (
          <CustomDomain
            userId={user.id}
            username={user.user_metadata?.username || user.email?.split('@')[0]}
            roastId={roast.id}
          />
        )}
        <Link to="/">
          <Button>
            Get Another Roast
          </Button>
        </Link>
      </div>
    </div>
  )
}