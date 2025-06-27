import { Handler } from '@netlify/functions'

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
    const { text } = JSON.parse(event.body || '{}')

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing text to moderate' })
      }
    }

    // Use OpenAI Moderation API (free)
    const openaiResponse = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        input: text
      })
    })

    if (!openaiResponse.ok) {
      throw new Error('OpenAI moderation failed')
    }

    const moderationResult = await openaiResponse.json()
    const result = moderationResult.results[0]

    // Additional custom checks for roasting context
    const customFlags = {
      too_harsh: checkIfTooHarsh(text),
      lacks_constructive_feedback: checkConstructiveFeedback(text),
      inappropriate_language: checkInappropriateLanguage(text)
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        flagged: result.flagged || Object.values(customFlags).some(flag => flag),
        categories: {
          ...result.categories,
          ...customFlags
        },
        category_scores: result.category_scores,
        safe_for_demo: !result.flagged && !customFlags.too_harsh,
        recommendations: generateRecommendations(result, customFlags)
      })
    }

  } catch (error) {
    console.error('Error in moderation:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Moderation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

function checkIfTooHarsh(text: string): boolean {
  const harshPatterns = [
    /\b(worthless|pathetic|useless|garbage|trash|stupid|idiot)\b/i,
    /\b(kill yourself|die|hatred)\b/i,
    /\b(never amount to anything|complete failure)\b/i
  ]
  
  return harshPatterns.some(pattern => pattern.test(text))
}

function checkConstructiveFeedback(text: string): boolean {
  const constructiveIndicators = [
    /\b(improve|better|fix|enhance|develop|grow|learn)\b/i,
    /\b(try|consider|focus on|work on)\b/i,
    /\b(suggestion|recommendation|advice)\b/i
  ]
  
  // Returns true if LACKS constructive feedback
  return !constructiveIndicators.some(pattern => pattern.test(text))
}

function checkInappropriateLanguage(text: string): boolean {
  const inappropriatePatterns = [
    /\b(damn|hell|shit|fuck|bastard)\b/i
  ]
  
  // Allow mild language but flag stronger profanity
  const strongProfanity = [
    /\bf[\*u]ck/i,
    /\bs[\*h]it/i,
    /\bb[\*a]stard/i
  ]
  
  return strongProfanity.some(pattern => pattern.test(text))
}

function generateRecommendations(openaiResult: any, customFlags: any): string[] {
  const recommendations = []
  
  if (openaiResult.flagged) {
    recommendations.push('Content flagged by OpenAI moderation - review for policy violations')
  }
  
  if (customFlags.too_harsh) {
    recommendations.push('Tone down harsh language while maintaining constructive criticism')
  }
  
  if (customFlags.lacks_constructive_feedback) {
    recommendations.push('Add specific, actionable improvement suggestions')
  }
  
  if (customFlags.inappropriate_language) {
    recommendations.push('Replace strong profanity with more professional language')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Content appears safe for demo and sharing')
  }
  
  return recommendations
}