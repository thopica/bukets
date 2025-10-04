import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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

    // Get user from auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { quiz_date, quiz_index } = await req.json();

    console.log(`Checking quiz session for user ${user.id} on ${quiz_date}`);

    // Check if there's already a session started for today
    const { data: existingSession } = await supabaseClient
      .from('daily_scores')
      .select('started_at, completed_at, total_score, correct_guesses, hints_used')
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .maybeSingle();

    if (existingSession) {
      console.log('Existing session found:', existingSession);
      
      // If already completed, return completion status
      if (existingSession.completed_at) {
        return new Response(
          JSON.stringify({ 
            already_completed: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Session exists but not completed - return elapsed time
      const startedAt = new Date(existingSession.started_at);
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
      const totalQuizTime = 160; // 2:40 in seconds
      
      // If time expired, return partial progress and mark as completed
      if (elapsedSeconds >= totalQuizTime) {
        // Update session as completed with partial score
        await supabaseClient
          .from('daily_scores')
          .update({
            time_used: totalQuizTime,
            completed_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('quiz_date', quiz_date);

        console.log(`Session expired - crediting partial progress: ${existingSession.total_score} points, ${existingSession.correct_guesses} correct`);

        return new Response(
          JSON.stringify({ 
            session_expired: true,
            started_at: existingSession.started_at,
            elapsed_seconds: elapsedSeconds,
            partial_score: existingSession.total_score || 0,
            correct_guesses: existingSession.correct_guesses || 0,
            hints_used: existingSession.hints_used || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          session_exists: true,
          started_at: existingSession.started_at,
          elapsed_seconds: elapsedSeconds,
          remaining_seconds: totalQuizTime - elapsedSeconds
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No existing session - create a new one
    const now = new Date().toISOString();
    const { error: insertError } = await supabaseClient
      .from('daily_scores')
      .insert({
        user_id: user.id,
        quiz_date: quiz_date,
        quiz_index: quiz_index,
        total_score: 0,
        correct_guesses: 0,
        hints_used: 0,
        time_used: 0,
        started_at: now,
        completed_at: null
      });

    if (insertError) {
      console.error('Error creating session:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to start session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('New session created at:', now);

    return new Response(
      JSON.stringify({ 
        session_started: true,
        started_at: now,
        elapsed_seconds: 0,
        remaining_seconds: 160
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
