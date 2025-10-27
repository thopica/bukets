import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { withRateLimit } from './_middleware';
import { getCorsHeaders, isOriginAllowed } from './_cors';

// CORS headers will be set dynamically based on origin

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none'"
};

const handler = async function(req: VercelRequest, res: VercelResponse) {
  // Set security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS with origin validation
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value as string);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject requests from disallowed origins
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  try {
    const supabaseClient = createClient(
      process.env.VITE_SUPABASE_URL ?? '',
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ''
    );

    // Read from request body
    const body = req.body;
    const period = body.period || 'today';
    const countryCode = body.country_code;
    const limit = parseInt(body.limit || '100');

    // Calculate date filter
    const today = new Date().toISOString().split('T')[0];
    let dateFilter = '';

    console.log('Today date:', today, 'Period:', period);

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

    console.log('Scores fetched:', scores?.length, 'Date filter:', dateFilter);

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

    // Handle empty leaderboard
    if (userIds.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({
        leaderboard: [],
        total_users: 0,
        period,
        country_filter: countryCode
      });
    }

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

    // Build players list
    const players = (profiles || []).map(profile => {
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

    // Sort by score and limit
    players.sort((a, b) => b.total_score - a.total_score);
    const limited = players.slice(0, limit);

    // Add ranks
    const ranked = limited.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    console.log('Leaderboard:', ranked.length, 'players');

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      leaderboard: ranked,
      total_users: players.length,
      period,
      country_filter: countryCode
    });

  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

module.exports = withRateLimit('get-leaderboard')(handler);
