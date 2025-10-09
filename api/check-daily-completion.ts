import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    return res.status(200).end();
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
      .select('total_score, correct_guesses, hints_used, time_used, completed_at')
      .eq('user_id', user.id)
      .eq('quiz_date', dateToCheck)
      .maybeSingle();

    if (scoreError) {
      console.error('Score error:', scoreError);
      throw scoreError;
    }

    if (!scoreData || !scoreData.completed_at) {
      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
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

    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      completed: true,
      total_score: scoreData.total_score,
      correct_guesses: scoreData.correct_guesses,
      hints_used: scoreData.hints_used,
      time_used: scoreData.time_used,
      completed_at: scoreData.completed_at,
      rank,
      current_streak: streakData?.current_streak || 0,
      longest_streak: streakData?.longest_streak || 0
    });

  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
