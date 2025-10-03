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

    const url = new URL(req.url);
    const period = url.searchParams.get('period') || 'today';
    const countryCode = url.searchParams.get('country_code');
    const limit = parseInt(url.searchParams.get('limit') || '100');

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
        total_score
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

    // Aggregate scores by user
    const userScores = new Map();
    scores?.forEach(score => {
      const current = userScores.get(score.user_id) || 0;
      userScores.set(score.user_id, current + score.total_score);
    });

    // Get user profiles and streaks
    const userIds = Array.from(userScores.keys());
    
    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select('user_id, display_name, country_code, is_bot')
      .in('user_id', userIds);

    const { data: streaks } = await supabaseClient
      .from('user_streaks')
      .select('user_id, current_streak')
      .in('user_id', userIds);

    // Combine data
    const leaderboard = userIds.map(userId => {
      const profile = profiles?.find(p => p.user_id === userId);
      const streak = streaks?.find(s => s.user_id === userId);
      
      return {
        user_id: userId,
        username: profile?.display_name || 'Anonymous',
        country_code: profile?.country_code || 'US',
        is_bot: profile?.is_bot || false,
        total_score: userScores.get(userId),
        current_streak: streak?.current_streak || 0
      };
    });

    // Filter by country if specified
    let filtered = countryCode 
      ? leaderboard.filter(u => u.country_code === countryCode)
      : leaderboard;

    // Sort and limit
    filtered.sort((a, b) => b.total_score - a.total_score);
    const limited = filtered.slice(0, limit);

    // Add ranks
    const ranked = limited.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    return new Response(
      JSON.stringify({
        leaderboard: ranked,
        total_users: filtered.length,
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
