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

    // Get user from auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { quiz_date, current_score, correct_guesses, hints_used, answered_ranks, revealed_ranks, reset_turn } = req.body;

    console.log(`Saving progress for user ${user.id}: score=${current_score}, correct=${correct_guesses}, answered=${answered_ranks}, revealed=${revealed_ranks}`);

    // Update the in-progress session with current score
    const updatePayload: Record<string, unknown> = {
      score: current_score,
      hints_used: hints_used,
      correct_ranks: answered_ranks,
      revealed_ranks: revealed_ranks || []
    };
    if (reset_turn) {
      updatePayload.turn_started_at = new Date().toISOString();
    }

    const { error: updateError } = await supabaseClient
      .from('quiz_sessions')
      .update(updatePayload)
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .is('completed_at', null); // Only update if not yet completed

    if (updateError) {
      console.error('Error saving progress:', updateError);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Failed to save progress' });
    }

    console.log('Progress saved successfully');

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = withRateLimit('save-quiz-progress')(handler);
