-- Clear all leaderboard data
DELETE FROM bot_daily_scores;
DELETE FROM bot_pool;
DELETE FROM profiles WHERE is_bot = true;
DELETE FROM daily_scores;
DELETE FROM user_streaks;