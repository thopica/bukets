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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Read from request body
    const body = await req.json();
    const period = body.period || 'today';
    const countryCode = body.country_code;
    const limit = parseInt(body.limit || '100');

    // Calculate date filter
    const today = new Date().toISOString().split('T')[0];
    let dateFilter = '';
    
    switch (period) {
      case 'today':
        dateFilter = `quiz_date.eq.${today}`;
        break;
      case '7d':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        dateFilter = `quiz_date.gte.${sevenDaysAgo.toISOString().split('T')[0]}`;
        break;
      case '30d':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = `quiz_date.gte.${thirtyDaysAgo.toISOString().split('T')[0]}`;
        break;
      case '82d':
        const eightyTwoDaysAgo = new Date();
        eightyTwoDaysAgo.setDate(eightyTwoDaysAgo.getDate() - 82);
        dateFilter = `quiz_date.gte.${eightyTwoDaysAgo.toISOString().split('T')[0]}`;
        break;
      case 'all-time':
        dateFilter = '';
        break;
    }

    // Build query - aggregate scores by user
    let query = supabaseClient
      .from('daily_scores')
      .select(`
        user_id,
        total_score,
        quiz_date
      `);

    if (dateFilter) {
      const parts = dateFilter.split('.');
      if (parts[1] === 'eq') {
        query = query.eq('quiz_date', parts[2]);
      } else if (parts[1] === 'gte') {
        query = query.gte('quiz_date', parts[2]);
      }
    }

    const { data: scores, error: scoresError } = await query;
    
    if (scoresError) throw scoresError;

    // Aggregate scores and count games by user
    const userScores = new Map();
    const userGames = new Map();
    scores?.forEach(score => {
      const currentScore = userScores.get(score.user_id) || 0;
      const currentGames = userGames.get(score.user_id) || 0;
      userScores.set(score.user_id, currentScore + score.total_score);
      userGames.set(score.user_id, currentGames + 1);
    });

    // Get user profiles and streaks
    const userIds = Array.from(userScores.keys());
    
    // Fetch profiles with optional country filter
    let profilesQuery = supabaseClient
      .from('profiles')
      .select('user_id, display_name, country_code')
      .in('user_id', userIds);
    
    if (countryCode) {
      profilesQuery = profilesQuery.eq('country_code', countryCode);
    }
    
    const { data: profiles } = await profilesQuery;

    const { data: streaks } = await supabaseClient
      .from('user_streaks')
      .select('user_id, current_streak')
      .in('user_id', userIds);

    // Build real players list (only includes users matching country filter)
    const realPlayers = (profiles || []).map(profile => {
      const streak = streaks?.find(s => s.user_id === profile.user_id);
      const totalScore = userScores.get(profile.user_id) || 0;
      const gamesPlayed = userGames.get(profile.user_id) || 0;
      const avgScore = gamesPlayed > 0 ? Math.round((totalScore / gamesPlayed) * 10) / 10 : 0;
      
      return {
        user_id: profile.user_id,
        username: profile.display_name || 'Anonymous',
        country_code: profile.country_code || 'US',
        total_score: totalScore,
        current_streak: streak?.current_streak || 0,
        avg_score: avgScore
      };
    });

    console.log('Real players:', realPlayers.length);

    // Sort by score and limit
    realPlayers.sort((a, b) => b.total_score - a.total_score);
    const limited = realPlayers.slice(0, limit);

    // Add ranks
    const ranked = limited.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    console.log('Final leaderboard:', ranked.length, 'players');

    return new Response(
      JSON.stringify({
        leaderboard: ranked,
        total_users: realPlayers.length,
        period,
        country_filter: countryCode
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
