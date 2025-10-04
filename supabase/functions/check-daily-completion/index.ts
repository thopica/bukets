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

    const { quiz_date } = await req.json();
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
      return new Response(
        JSON.stringify({ completed: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    return new Response(
      JSON.stringify({
        completed: true,
        total_score: scoreData.total_score,
        correct_guesses: scoreData.correct_guesses,
        hints_used: scoreData.hints_used,
        time_used: scoreData.time_used,
        completed_at: scoreData.completed_at,
        rank,
        current_streak: streakData?.current_streak || 0,
        longest_streak: streakData?.longest_streak || 0
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
