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
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? '',
      {
        global: {
          headers: { Authorization: req.headers.authorization! },
        },
      }
    );

    // Get user from auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { quiz_date, quiz_index } = req.body;

    console.log(`Checking quiz session for user ${user.id} on ${quiz_date}`);

    // Check if there's already a session started for today
    const { data: existingSession } = await supabaseClient
      .from('quiz_sessions')
      .select('started_at, completed_at, score, hints_used, correct_ranks, revealed_ranks, turn_started_at')
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .maybeSingle();

    if (existingSession) {
      console.log('Existing session found:', existingSession);

      // If already completed, return completion status
      if (existingSession.completed_at) {
        res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
        res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
          already_completed: true
        });
      }

      // Session exists but not completed - return elapsed time
      const startedAt = new Date(existingSession.started_at);
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
      const totalQuizTime = 160; // 2:40 in seconds

      // Per-turn timer remaining based on when this turn started
      const turnStartedAt = existingSession.turn_started_at ? new Date(existingSession.turn_started_at) : startedAt;
      const elapsedTurnSeconds = Math.floor((now.getTime() - turnStartedAt.getTime()) / 1000);
      const perTurnRemaining = Math.max(0, 24 - elapsedTurnSeconds);

      // If time expired, return partial progress and mark as completed
      if (elapsedSeconds >= totalQuizTime) {
        // Update session as completed with partial score
        await supabaseClient
          .from('quiz_sessions')
          .update({
            completed_at: new Date().toISOString(),
            status: 'completed'
          })
          .eq('user_id', user.id)
          .eq('quiz_date', quiz_date);

        console.log(`Session expired - crediting partial progress: ${existingSession.score || 0} points, ${(existingSession.correct_ranks || []).length} correct`);

        res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
        res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
          session_expired: true,
          started_at: existingSession.started_at,
          elapsed_seconds: elapsedSeconds,
           partial_score: existingSession.score || 0,
           correct_guesses: (existingSession.correct_ranks || []).length,
           hints_used: existingSession.hints_used || 0
        });
      }

      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        session_exists: true,
        started_at: existingSession.started_at,
        elapsed_seconds: elapsedSeconds,
        remaining_seconds: totalQuizTime - elapsedSeconds,
        per_turn_remaining_seconds: perTurnRemaining,
        saved_score: existingSession.score || 0,
        saved_correct: (existingSession.correct_ranks || []).length,
        saved_hints: existingSession.hints_used || 0,
        answered_ranks: existingSession.correct_ranks || [],
        revealed_ranks: existingSession.revealed_ranks || []
      });
    }

    // No existing session - create a new one
    const now = new Date().toISOString();
    const { error: insertError } = await supabaseClient
      .from('quiz_sessions')
      .insert({
        user_id: user.id,
        quiz_date: quiz_date,
        score: 0,
        hints_used: 0,
        correct_ranks: [],
        revealed_ranks: [],
        started_at: now,
        turn_started_at: now,
        status: 'in_progress',
        current_question_index: 0,
        completed_at: null
      });

    if (insertError) {
      console.error('Error creating session:', insertError);
      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Failed to start session' });
    }

    console.log('New session created at:', now);

    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      session_started: true,
      started_at: now,
      elapsed_seconds: 0,
      remaining_seconds: 160,
      per_turn_remaining_seconds: 24
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Internal server error' });
  }
}
