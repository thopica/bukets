-- Backfill script to populate user_streaks from existing daily_scores data
-- This calculates streaks based on consecutive play dates

WITH user_play_dates AS (
  -- Get all unique users and their play dates, ordered by date
  SELECT 
    user_id,
    quiz_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY quiz_date) as play_sequence
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
    -- Check if this is the start of a new streak (gap > 1 day from previous)
    CASE 
      WHEN LAG(quiz_date) OVER (PARTITION BY user_id ORDER BY quiz_date) IS NULL 
        OR quiz_date - LAG(quiz_date) OVER (PARTITION BY user_id ORDER BY quiz_date) > 1
      THEN 1
      ELSE 0
    END as is_streak_start,
    -- Calculate streak number for this play
    SUM(CASE 
      WHEN LAG(quiz_date) OVER (PARTITION BY user_id ORDER BY quiz_date) IS NULL 
        OR quiz_date - LAG(quiz_date) OVER (PARTITION BY user_id ORDER BY quiz_date) > 1
      THEN 1
      ELSE 0
    END) OVER (PARTITION BY user_id ORDER BY quiz_date) as streak_group
  FROM user_play_dates
),

streak_lengths AS (
  -- Calculate the length of each streak
  SELECT 
    user_id,
    streak_group,
    MIN(quiz_date) as streak_start_date,
    MAX(quiz_date) as streak_end_date,
    COUNT(*) as streak_length
  FROM streak_calculations
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

-- Insert or update user_streaks with calculated data
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_play_date, updated_at)
SELECT 
  user_id,
  COALESCE(current_streak, 0),
  COALESCE(longest_streak, 0),
  last_play_date,
  NOW()
FROM user_final_streaks
ON CONFLICT (user_id) DO UPDATE SET
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  last_play_date = EXCLUDED.last_play_date,
  updated_at = EXCLUDED.updated_at;
