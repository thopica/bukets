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

    const { quiz_date, quiz_index, total_score, correct_guesses, hints_used, time_used } = await req.json();

    // Check if user already completed today
    const { data: existing, error: checkError } = await supabaseClient
      .from('daily_scores')
      .select('id')
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .maybeSingle();

    if (checkError) {
      console.error('Check error:', checkError);
      throw checkError;
    }

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Already completed today' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Insert score
    const { error: insertError } = await supabaseClient
      .from('daily_scores')
      .insert({
        user_id: user.id,
        quiz_date,
        quiz_index,
        total_score,
        correct_guesses,
        hints_used,
        time_used
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
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
