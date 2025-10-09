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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { quiz_date, quiz_index, total_score, correct_guesses, hints_used, time_used } = req.body;

    // Check if user already has a session for today
    const { data: existing, error: checkError } = await supabaseClient
      .from('daily_scores')
      .select('id, completed_at')
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .maybeSingle();

    if (checkError) {
      console.error('Check error:', checkError);
      throw checkError;
    }

    // If already completed, don't allow resubmission
    if (existing && existing.completed_at) {
      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Already completed today' });
    }

    // Update existing session or insert new score
    if (existing) {
      // Update the existing session with final score
      const { error: updateError } = await supabaseClient
        .from('daily_scores')
        .update({
          total_score,
          correct_guesses,
          hints_used,
          time_used,
          completed_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }
    } else {
      // Insert new score (fallback for old sessions)
      const { error: insertError } = await supabaseClient
        .from('daily_scores')
        .insert({
          user_id: user.id,
          quiz_date,
          quiz_index,
          total_score,
          correct_guesses,
          hints_used,
          time_used,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
    }

    // Update streak
    const { data: streakData } = await supabaseClient
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const yesterday = new Date(quiz_date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakData) {
      if (streakData.last_play_date === yesterdayStr) {
        currentStreak = streakData.current_streak + 1;
        longestStreak = Math.max(streakData.longest_streak, currentStreak);
      } else if (streakData.last_play_date === quiz_date) {
        currentStreak = streakData.current_streak;
        longestStreak = streakData.longest_streak;
      } else {
        currentStreak = 1;
        longestStreak = streakData.longest_streak;
      }

      await supabaseClient
        .from('user_streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_play_date: quiz_date,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      await supabaseClient
        .from('user_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_play_date: quiz_date
        });
    }

    // Calculate rank
    const { count } = await supabaseClient
      .from('daily_scores')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_date', quiz_date)
      .gt('total_score', total_score);

    const rank = (count ?? 0) + 1;

    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      rank,
      current_streak: currentStreak,
      longest_streak: longestStreak
    });

  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
