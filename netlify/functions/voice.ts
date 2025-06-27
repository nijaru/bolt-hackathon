import { Handler } from '@netlify/functions'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1'

// Voice IDs for different personalities (these would be configured in ElevenLabs)
const personalityVoices = {
  gordon_ramsay: 'pNInz6obpgDQGcFmaJgB', // Adam (mature male)
  simon_cowell: 'EXAVITQu4vr4xnSDxMaL', // Sam (professional male)  
  gordon_gekko: 'VR6AewLTigWG4xSOukaG', // Josh (confident male)
  sherlock_holmes: 'onwK4e9ZLuTAKqWW03F9' // Daniel (intellectual male)
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { text, personality } = JSON.parse(event.body || '{}')

    if (!text || !personality) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing text or personality' })
      }
    }

    if (!ELEVENLABS_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'ElevenLabs API key not configured' })
      }
    }

    const voiceId = personalityVoices[personality as keyof typeof personalityVoices]
    if (!voiceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid personality for voice generation' })
      }
    }

    // Call ElevenLabs API to generate speech
    const response = await fetch(`${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', errorText)
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'Voice generation failed', details: errorText })
      }
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: `data:audio/mpeg;base64,${audioBase64}`,
        personality,
        success: true
      })
    }

  } catch (error) {
    console.error('Error generating voice:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate voice',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}