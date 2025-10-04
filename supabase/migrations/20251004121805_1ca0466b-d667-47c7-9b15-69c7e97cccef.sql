-- Remove all bot-related data
DELETE FROM bot_daily_scores;
DELETE FROM bot_pool;
DELETE FROM profiles WHERE is_bot = true;

-- Reset leaderboard: clear all user scores and streaks
DELETE FROM daily_scores;
DELETE FROM user_streaks;