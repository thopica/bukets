-- Test script to verify the streak fix works
-- Run this AFTER applying the migration and backfill

-- 1. Test that we can insert a new streak record
-- (Replace with actual user ID from your daily_scores)
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_play_date)
VALUES ('fff1d90d-009d-4fce-86f8-4a30c12377d9', 1, 1, '2025-10-22')
ON CONFLICT (user_id) DO UPDATE SET
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  last_play_date = EXCLUDED.last_play_date,
  updated_at = NOW()
RETURNING *;

-- 2. Check that the foreign key constraint is correct
SELECT
    tc.constraint_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'user_streaks'
  AND kcu.column_name = 'user_id';

-- 3. Verify backfill worked - check streak data
SELECT 
  us.user_id,
  us.current_streak,
  us.longest_streak,
  us.last_play_date,
  us.updated_at,
  COUNT(ds.quiz_date) as total_games_played
FROM user_streaks us
LEFT JOIN daily_scores ds ON us.user_id = ds.user_id
GROUP BY us.user_id, us.current_streak, us.longest_streak, us.last_play_date, us.updated_at
ORDER BY us.last_play_date DESC;
