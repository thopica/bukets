import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Skill level score ranges for bot generation (Today only - max 30 points per day)
const SKILL_RANGES: Record<string, { min: number; max: number }> = {
  elite: { min: 27, max: 30 },
  advanced: { min: 22, max: 26 },
  intermediate: { min: 16, max: 21 },
  beginner: { min: 10, max: 15 },
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
      const totalScore = userScores.get(profile.user_id) || 0;
      const gamesPlayed = userGames.get(profile.user_id) || 0;
      const accuracy = gamesPlayed > 0 ? Math.round((totalScore / (gamesPlayed * 30)) * 100) : 0;
      
      return {
        user_id: profile.user_id,
        username: profile.display_name || 'Anonymous',
        country_code: profile.country_code || 'US',
        total_score: totalScore,
        current_streak: streak?.current_streak || 0,
        accuracy: accuracy,
        is_bot: false
      };
    });

    console.log('Real players:', realPlayers.length);

    // Fetch bots and their scores
    let botPlayers: any[] = [];
    
    if (period === 'today') {
      // For TODAY: Generate random scores dynamically
      let botQuery = supabaseClient
        .from('bot_pool')
        .select('id, username, country_code, skill_level')
        .eq('is_active_bot', true);

      if (countryCode) {
        botQuery = botQuery.eq('country_code', countryCode);
      }

      const { data: bots } = await botQuery;
      console.log('Bots fetched for today:', bots?.length || 0);

      botPlayers = (bots || []).map(bot => {
        const botScore = generateBotScore(bot.skill_level);
        const botAccuracy = Math.round((botScore / 30) * 100); // Bots play 1 game per day
        return {
          user_id: bot.id,
          username: bot.username,
          country_code: bot.country_code,
          total_score: botScore,
          current_streak: generateBotStreak(bot.skill_level),
          accuracy: botAccuracy,
          is_bot: true
        };
      });
    } else {
      // For historical periods: Query bot_daily_scores
      let botScoresQuery = supabaseClient
        .from('bot_daily_scores')
        .select('bot_id, total_score, quiz_date');

      // Apply same date filter as real players
      if (dateFilter) {
        const parts = dateFilter.split('.');
        if (parts[1] === 'eq') {
          botScoresQuery = botScoresQuery.eq('quiz_date', parts[2]);
        } else if (parts[1] === 'gte') {
          botScoresQuery = botScoresQuery.gte('quiz_date', parts[2]);
        }
      }

      const { data: botScores } = await botScoresQuery;

      // Aggregate bot scores by bot_id
      const botScoresMap = new Map<string, number>();
      botScores?.forEach(score => {
        const current = botScoresMap.get(score.bot_id) || 0;
        botScoresMap.set(score.bot_id, current + score.total_score);
      });

      // Get bot profiles
      const botIds = Array.from(botScoresMap.keys());
      if (botIds.length > 0) {
        let botProfilesQuery = supabaseClient
          .from('bot_pool')
          .select('id, username, country_code, skill_level')
          .in('id', botIds)
          .eq('is_active_bot', true);

        if (countryCode) {
          botProfilesQuery = botProfilesQuery.eq('country_code', countryCode);
        }

        const { data: botProfiles } = await botProfilesQuery;

        botPlayers = (botProfiles || []).map(bot => {
          const botTotalScore = botScoresMap.get(bot.id) || 0;
          const botGamesCount = botScores?.filter(s => s.bot_id === bot.id).length || 0;
          const botAccuracy = botGamesCount > 0 ? Math.round((botTotalScore / (botGamesCount * 30)) * 100) : 0;
          return {
            user_id: bot.id,
            username: bot.username,
            country_code: bot.country_code,
            total_score: botTotalScore,
            current_streak: generateBotStreak(bot.skill_level),
            accuracy: botAccuracy,
            is_bot: true
          };
        });

        console.log('Historical bots included:', botPlayers.length);
      }
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
