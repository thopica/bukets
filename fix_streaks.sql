-- Fix all user streaks by recalculating from daily_scores data
-- This script will correct any incorrect streak values

-- First, let's see what we're working with
SELECT 'BEFORE FIX - Current streak data:' as status;
SELECT 
  us.user_id,
  us.current_streak,
  us.longest_streak,
  us.last_play_date,
  COUNT(ds.quiz_date) as total_games
FROM user_streaks us
LEFT JOIN daily_scores ds ON us.user_id = ds.user_id
GROUP BY us.user_id, us.current_streak, us.longest_streak, us.last_play_date
ORDER BY us.last_play_date DESC;

-- Create a temporary table with recalculated streaks
WITH user_play_dates AS (
  -- Get all unique users and their play dates, ordered by date
  SELECT 
    user_id,
    quiz_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY quiz_date) as play_sequence,
    LAG(quiz_date) OVER (PARTITION BY user_id ORDER BY quiz_date) as prev_date
  FROM daily_scores
  WHERE completed_at IS NOT NULL
  ORDER BY user_id, quiz_date
),

streak_calculations AS (
  -- Calculate streaks by finding consecutive dates
  SELECT 
    user_id,
    quiz_date,
    play_sequence,
    prev_date,
    -- Check if this is the start of a new streak (gap > 1 day from previous)
    CASE 
      WHEN prev_date IS NULL 
        OR quiz_date - prev_date > 1
      THEN 1
      ELSE 0
    END as is_streak_start
  FROM user_play_dates
),

streak_groups AS (
  -- Calculate streak group for each play
  SELECT 
    user_id,
    quiz_date,
    play_sequence,
    prev_date,
    is_streak_start,
    SUM(is_streak_start) OVER (PARTITION BY user_id ORDER BY quiz_date) as streak_group
  FROM streak_calculations
),

streak_lengths AS (
  -- Calculate the length of each streak
  SELECT 
    user_id,
    streak_group,
    MIN(quiz_date) as streak_start_date,
    MAX(quiz_date) as streak_end_date,
    COUNT(*) as streak_length
  FROM streak_groups
  GROUP BY user_id, streak_group
),

user_final_streaks AS (
  -- Get the current streak and longest streak for each user
  SELECT 
    user_id,
    -- Current streak is the length of the most recent streak
    (SELECT streak_length 
     FROM streak_lengths sl2 
     WHERE sl2.user_id = sl1.user_id 
     ORDER BY streak_end_date DESC 
     LIMIT 1) as current_streak,
    -- Longest streak is the maximum streak length
    MAX(streak_length) as longest_streak,
    -- Last play date is the most recent quiz date
    (SELECT MAX(quiz_date) 
     FROM daily_scores ds 
     WHERE ds.user_id = sl1.user_id) as last_play_date
  FROM streak_lengths sl1
  GROUP BY user_id
)

-- Update all user streaks with corrected data
UPDATE user_streaks 
SET 
  current_streak = COALESCE(ufs.current_streak, 0),
  longest_streak = COALESCE(ufs.longest_streak, 0),
  last_play_date = ufs.last_play_date,
  updated_at = NOW()
FROM user_final_streaks ufs
WHERE user_streaks.user_id = ufs.user_id;

-- Show the results after the fix
SELECT 'AFTER FIX - Updated streak data:' as status;
SELECT 
  us.user_id,
  us.current_streak,
  us.longest_streak,
  us.last_play_date,
  COUNT(ds.quiz_date) as total_games
FROM user_streaks us
LEFT JOIN daily_scores ds ON us.user_id = ds.user_id
GROUP BY us.user_id, us.current_streak, us.longest_streak, us.last_play_date
ORDER BY us.last_play_date DESC;

-- Show specific user that was having issues
SELECT 'SPECIFIC USER CHECK - fff1d90d-009d-4fce-86f8-4a30c12377d9:' as status;
SELECT 
  us.user_id,
  us.current_streak,
  us.longest_streak,
  us.last_play_date,
  us.updated_at
FROM user_streaks us
WHERE us.user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9';

-- Show their play dates for verification
SELECT 'Play dates for verification:' as status;
SELECT 
  user_id,
  quiz_date,
  completed_at,
  LAG(quiz_date) OVER (ORDER BY quiz_date) as previous_date,
  quiz_date - LAG(quiz_date) OVER (ORDER BY quiz_date) as days_gap
FROM daily_scores
WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9'
ORDER BY quiz_date;
