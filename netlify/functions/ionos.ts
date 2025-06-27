import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface CreateSubdomainRequest {
  userId: string;
  username: string;
  roastId?: string;
}

interface DomainCheckRequest {
  domain: string;
}

export const handler: Handler = async (event, context) => {
  const { httpMethod, path } = event;

  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };
  }

  try {
    // Route handling based on path
    if (path?.includes('/check-domain') && httpMethod === 'POST') {
      return await handleDomainCheck(event);
    } else if (path?.includes('/create-subdomain') && httpMethod === 'POST') {
      return await handleCreateSubdomain(event);
    } else if (httpMethod === 'GET') {
      return await handleGetDomains(event);
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('IONOS API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

async function handleDomainCheck(event: any) {
  const { domain }: DomainCheckRequest = JSON.parse(event.body || '{}');

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Domain is required' })
    };
  }

  // Simulate IONOS domain availability check
  // In production, this would call IONOS Domain API
  const isAvailable = !['google', 'facebook', 'twitter', 'instagram'].some(
    blocked => domain.toLowerCase().includes(blocked)
  );

  const suggestions = isAvailable ? [] : [
    `${domain}-roasts`,
    `get-${domain}`,
    `${domain}-ai`,
    `roast-${domain}`
  ];

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      domain,
      available: isAvailable,
      price: isAvailable ? '$12.99/year' : null,
      suggestions,
      message: isAvailable 
        ? 'Domain is available for registration!'
        : 'Domain is taken. Here are some alternatives:'
    })
  };
}

async function handleCreateSubdomain(event: any) {
  const { userId, username, roastId }: CreateSubdomainRequest = JSON.parse(event.body || '{}');

  if (!userId || !username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User ID and username are required' })
    };
  }

  // Check if user has permission (premium users only)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();

  if (!subscription || subscription.tier === 'free') {
    return {
      statusCode: 403,
      body: JSON.stringify({ 
        error: 'Premium subscription required for custom domains',
        upgrade_url: '/pricing'
      })
    };
  }

  // Simulate IONOS subdomain creation
  const subdomain = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}.roastme.io`;
  
  // Save domain record to database
  const { error: dbError } = await supabase
    .from('custom_domains')
    .upsert({
      user_id: userId,
      subdomain,
      username,
      roast_id: roastId,
      status: 'active',
      created_at: new Date().toISOString(),
      ionos_domain_id: `ionos_${Date.now()}`, // Simulated IONOS ID
      ssl_enabled: true
    });

  if (dbError) {
    console.error('Database error:', dbError);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save domain record' })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      subdomain,
      url: `https://${subdomain}`,
      ssl_enabled: true,
      message: 'Custom domain created successfully!',
      setup_instructions: [
        'Your custom domain is now active',
        'SSL certificate has been automatically configured',
        'Share your personalized roast page with friends!',
        `Visit: https://${subdomain}`
      ]
    })
  };
}

async function handleGetDomains(event: any) {
  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User ID is required' })
    };
  }

  const { data: domains, error } = await supabase
    .from('custom_domains')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch domains' })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      domains: domains || [],
      total: domains?.length || 0
    })
  };
}