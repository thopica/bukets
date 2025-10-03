import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Skill level score ranges for bot generation
const SKILL_RANGES: Record<string, { min: number; max: number }> = {
  elite: { min: 90, max: 102 },
  advanced: { min: 70, max: 89 },
  intermediate: { min: 50, max: 69 },
  beginner: { min: 30, max: 49 },
};

function generateBotScore(skillLevel: string): number {
  const range = SKILL_RANGES[skillLevel] || SKILL_RANGES.intermediate;
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function generateBotStreak(skillLevel: string): number {
  const maxStreaks: Record<string, number> = { elite: 15, advanced: 10, intermediate: 5, beginner: 2 };
  const max = maxStreaks[skillLevel] || 3;
  return Math.floor(Math.random() * (max + 1));
}

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
    
    // Fetch profiles with optional country filter
    let profilesQuery = supabaseClient
      .from('profiles')
      .select('user_id, display_name, country_code, is_bot')
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
      
      return {
        user_id: profile.user_id,
        username: profile.display_name || 'Anonymous',
        country_code: profile.country_code || 'US',
        total_score: userScores.get(profile.user_id) || 0,
        current_streak: streak?.current_streak || 0,
        is_bot: false
      };
    });

    console.log('Real players:', realPlayers.length);

    // Bots only appear in TODAY leaderboard (not historical periods)
    let botPlayers: any[] = [];
    
    if (period === 'today') {
      let botQuery = supabaseClient
        .from('bot_pool')
        .select('id, username, country_code, skill_level')
        .eq('is_active_bot', true);

      if (countryCode) {
        botQuery = botQuery.eq('country_code', countryCode);
      }

      const { data: bots } = await botQuery;

      console.log('Bots fetched for today:', bots?.length || 0);

      // Generate bot entries with random scores for today
      botPlayers = (bots || []).map(bot => ({
        user_id: bot.id,
        username: bot.username,
        country_code: bot.country_code,
        total_score: generateBotScore(bot.skill_level),
        current_streak: generateBotStreak(bot.skill_level),
        is_bot: true
      }));
    } else {
      console.log('Historical period - no bots included');
    }

    // Combine real players and bots (both already filtered by country)
    let combined = [...realPlayers, ...botPlayers];

    // Sort by score and limit
    combined.sort((a, b) => b.total_score - a.total_score);
    const limited = combined.slice(0, limit);

    // Add ranks
    const ranked = limited.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    console.log('Final leaderboard:', ranked.length, '(', realPlayers.length, 'real +', botPlayers.length, 'bots)');

    return new Response(
      JSON.stringify({
        leaderboard: ranked,
        total_users: combined.length,
        real_players: realPlayers.length,
        bot_players: botPlayers.length,
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
