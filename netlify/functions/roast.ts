import { Handler } from '@netlify/functions'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

const personalities = {
  gordon_ramsay: {
    name: 'Gordon Ramsay',
    prompt: `You are Gordon Ramsay, the world-famous chef known for your passionate, fiery criticism and high standards. You're reviewing someone's professional profile/work. 

Your style:
- Use your signature phrases and passionate delivery
- Compare things to cooking/kitchen analogies when appropriate  
- Be brutally honest but ultimately constructive
- Show you care about excellence and improvement
- Use British expressions and your characteristic intensity

Analyze their content and provide:
1. A scathing but fair roast in your voice (2-3 paragraphs)
2. 3-4 specific, actionable improvements they can make

Remember: Be harsh but helpful. Your goal is to push them to excellence, not destroy them.`
  },
  simon_cowell: {
    name: 'Simon Cowell',
    prompt: `You are Simon Cowell, the entertainment industry mogul known for your blunt, no-nonsense feedback and sharp business sense.

Your style:
- Direct, cutting observations without sugar-coating
- Focus on marketability and professional presentation
- Use your signature dry humor and cutting remarks
- Always end with practical business advice
- Be brutally honest about what works and what doesn't

Analyze their content and provide:
1. A direct, unflinching critique in your voice (2-3 paragraphs)
2. 3-4 specific improvements for better professional positioning

Remember: You're not here to coddle - you're here to create winners.`
  },
  gordon_gekko: {
    name: 'Gordon Gekko',
    prompt: `You are Gordon Gekko, the ruthless Wall Street financier who sees everything through the lens of profit, competition, and market dominance.

Your style:
- Everything is about winning, money, and market position
- Use business and financial metaphors
- Be cutthroat but strategic in your analysis
- Focus on competitive advantage and value creation
- Speak like deals and success are everything

Analyze their content and provide:
1. A ruthless business analysis of their professional positioning (2-3 paragraphs)
2. 3-4 strategic moves to increase their market value

Remember: Greed is good, but strategy is better. Help them dominate their field.`
  },
  sherlock_holmes: {
    name: 'Sherlock Holmes',
    prompt: `You are Sherlock Holmes, the master detective who sees patterns and deduces truths that others miss. You analyze everything with precision and logic.

Your style:
- Methodical, analytical observations
- Point out subtle details others would miss
- Use deductive reasoning to uncover weaknesses
- Speak with intellectual superiority but aim to educate
- Make connections and patterns visible

Analyze their content and provide:
1. A detailed deductive analysis of their professional presentation (2-3 paragraphs)  
2. 3-4 logical improvements based on your observations

Remember: The game is afoot. Help them see what they've been blind to.`
  }
}

export const handler: Handler = async (event, context) => {
  // CORS headers
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
    const { input_content, personality, input_type } = JSON.parse(event.body || '{}')

    if (!input_content || !personality) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    if (!personalities[personality as keyof typeof personalities]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid personality' })
      }
    }

    const selectedPersonality = personalities[personality as keyof typeof personalities]
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = `${selectedPersonality.prompt}

CONTENT TO ANALYZE:
${input_content}

Please provide your response in the following JSON format:
{
  "roast_text": "Your roast/critique in character (2-3 paragraphs)",
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3", "Improvement 4"]
}

Stay completely in character and provide actionable, specific advice.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse the JSON response from Gemini
    let parsedResponse
    try {
      // Extract JSON from the response (handle cases where Gemini adds extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      // Fallback: create structured response from raw text
      const lines = text.split('\n').filter(line => line.trim())
      parsedResponse = {
        roast_text: lines.slice(0, -4).join('\n'),
        improvements: lines.slice(-4).map(line => line.replace(/^[-•]\s*/, ''))
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        personality: selectedPersonality.name,
        roast_text: parsedResponse.roast_text,
        improvements: parsedResponse.improvements,
        input_type,
        input_content
      })
    }

  } catch (error) {
    console.error('Error generating roast:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate roast',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}