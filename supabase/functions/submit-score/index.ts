import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { quiz_date, quiz_index } = await req.json();

    // Get the user's quiz session to verify their answers and get accurate data
    const { data: session, error: sessionError } = await supabaseClient
      .from('quiz_sessions')
      .select('correct_ranks, hints_used, started_at, completed_at, score')
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .maybeSingle();

    if (sessionError || !session) {
      throw new Error('No quiz session found');
    }

    // Use verified data from quiz_sessions
    const correct_guesses = (session.correct_ranks || []).length;
    const hints_used = session.hints_used || 0;
    const total_score = session.score || 0;

    // Calculate time used
    const startedAt = new Date(session.started_at);
    const completedAt = session.completed_at ? new Date(session.completed_at) : new Date();
    const time_used = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);

    console.log(`Server-verified score for ${user.id}: ${total_score} points (${correct_guesses} correct, ${hints_used} hints)`);

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
      return new Response(
        JSON.stringify({ error: 'Already completed today' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
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

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakData) {
      // Calculate day difference using UTC noon to avoid timezone issues
      const lastDate = new Date((streakData.last_play_date as string) + 'T12:00:00Z');
      const quizDate = new Date((quiz_date as string) + 'T12:00:00Z');
      const dayDifference = Math.floor((quizDate.getTime() - lastDate.getTime()) / 86400000);
      
      if (dayDifference === 1) {
        // Consecutive days - increment streak
        currentStreak = streakData.current_streak + 1;
        longestStreak = Math.max(streakData.longest_streak, currentStreak);
      } else if (dayDifference === 0) {
        // Same day - maintain current streak
        currentStreak = streakData.current_streak;
        longestStreak = streakData.longest_streak;
      } else {
        // Streak broken (dayDifference > 1 or < 0) - reset to 1
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

    return new Response(
      JSON.stringify({
        success: true,
        rank,
        current_streak: currentStreak,
        longest_streak: longestStreak
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
