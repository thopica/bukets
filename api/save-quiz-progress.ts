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
      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: 'Failed to save progress' });
    }

    console.log('Progress saved successfully');

    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Internal server error' });
  }
}
