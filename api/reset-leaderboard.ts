import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { withRateLimit } from './_middleware';
import { getCorsHeaders, isOriginAllowed } from './_cors';

// CORS headers will be set dynamically based on origin

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none'"
};

const handler = async function(req: VercelRequest, res: VercelResponse) {
  // Set security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS with origin validation
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value as string);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject requests from disallowed origins
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  try {
    const supabaseClient = createClient(
      process.env.VITE_SUPABASE_URL ?? '',
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
      {
        global: {
          headers: { Authorization: req.headers.authorization! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin using service role client
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL ?? '',
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? ''
    );

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Delete all leaderboard data
    await supabaseAdmin.from('daily_scores').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('user_streaks').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('quiz_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true, message: 'Leaderboard reset successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: errorMessage });
  }
};

module.exports = withRateLimit('reset-leaderboard')(handler);
