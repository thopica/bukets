-- Simple streak fix script - run each section separately if needed

-- Step 1: Check current streak data
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

-- Step 2: Calculate what streaks should be
SELECT 'CALCULATED STREAKS - What they should be:' as status;
WITH user_play_dates AS (
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
  SELECT 
    user_id,
    quiz_date,
    play_sequence,
    prev_date,
    CASE 
      WHEN prev_date IS NULL 
        OR quiz_date - prev_date > 1
      THEN 1
      ELSE 0
    END as is_streak_start
  FROM user_play_dates
),
streak_groups AS (
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
  SELECT 
    user_id,
    (SELECT streak_length 
     FROM streak_lengths sl2 
     WHERE sl2.user_id = sl1.user_id 
     ORDER BY streak_end_date DESC 
     LIMIT 1) as current_streak,
    MAX(streak_length) as longest_streak,
    (SELECT MAX(quiz_date) 
     FROM daily_scores ds 
     WHERE ds.user_id = sl1.user_id) as last_play_date
  FROM streak_lengths sl1
  GROUP BY user_id
)
SELECT 
  user_id,
  current_streak,
  longest_streak,
  last_play_date
FROM user_final_streaks
ORDER BY last_play_date DESC;

-- Step 3: Update the streaks (run this after verifying the calculations look correct)
-- Uncomment the following lines to actually perform the update:
/*
WITH user_play_dates AS (
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
  SELECT 
    user_id,
    quiz_date,
    play_sequence,
    prev_date,
    CASE 
      WHEN prev_date IS NULL 
        OR quiz_date - prev_date > 1
      THEN 1
      ELSE 0
    END as is_streak_start
  FROM user_play_dates
),
streak_groups AS (
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
  SELECT 
    user_id,
    (SELECT streak_length 
     FROM streak_lengths sl2 
     WHERE sl2.user_id = sl1.user_id 
     ORDER BY streak_end_date DESC 
     LIMIT 1) as current_streak,
    MAX(streak_length) as longest_streak,
    (SELECT MAX(quiz_date) 
     FROM daily_scores ds 
     WHERE ds.user_id = sl1.user_id) as last_play_date
  FROM streak_lengths sl1
  GROUP BY user_id
)
UPDATE user_streaks 
SET 
  current_streak = COALESCE(ufs.current_streak, 0),
  longest_streak = COALESCE(ufs.longest_streak, 0),
  last_play_date = ufs.last_play_date,
  updated_at = NOW()
FROM user_final_streaks ufs
WHERE user_streaks.user_id = ufs.user_id;
*/

-- Step 4: Check results after update (run this after the update)
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
