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

    const { quiz_date, current_score, correct_guesses, hints_used, answered_ranks } = await req.json();

    console.log(`Saving progress for user ${user.id}: score=${current_score}, correct=${correct_guesses}, answered=${answered_ranks}`);

    // Update the in-progress session with current score
    const { error: updateError } = await supabaseClient
      .from('daily_scores')
      .update({
        total_score: current_score,
        correct_guesses: correct_guesses,
        hints_used: hints_used,
        answered_ranks: answered_ranks
      })
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .is('completed_at', null); // Only update if not yet completed

    if (updateError) {
      console.error('Error saving progress:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save progress' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Progress saved successfully');

    return new Response(
      JSON.stringify({ success: true }),
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
