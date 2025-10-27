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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { quiz_date } = req.body;
    const dateToCheck = quiz_date || new Date().toISOString().split('T')[0];

    // Check if user completed this quiz
    const { data: scoreData, error: scoreError } = await supabaseClient
      .from('daily_scores')
      .select('total_score, correct_guesses, hints_used, time_used, completed_at, quiz_index')
      .eq('user_id', user.id)
      .eq('quiz_date', dateToCheck)
      .maybeSingle();

    if (scoreError) {
      console.error('Score error:', scoreError);
      throw scoreError;
    }

    if (!scoreData || !scoreData.completed_at) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ completed: false });
    }

    // Get user's rank for this day
    const { count } = await supabaseClient
      .from('daily_scores')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_date', dateToCheck)
      .gt('total_score', scoreData.total_score);

    const rank = (count ?? 0) + 1;

    // Get user's streak data
    const { data: streakData } = await supabaseClient
      .from('user_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      completed: true,
      total_score: scoreData.total_score,
      correct_guesses: scoreData.correct_guesses,
      hints_used: scoreData.hints_used,
      time_used: scoreData.time_used,
      completed_at: scoreData.completed_at,
      quiz_index: scoreData.quiz_index,
      rank,
      current_streak: streakData?.current_streak || 0,
      longest_streak: streakData?.longest_streak || 0
    });

  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

module.exports = withRateLimit('check-daily-completion')(handler);
