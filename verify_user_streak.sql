-- Quick verification of what the streak should be for the specific user
-- User: fff1d90d-009d-4fce-86f8-4a30c12377d9

-- Current streak in database
SELECT 'CURRENT STREAK IN DATABASE:' as status;
SELECT 
  user_id,
  current_streak,
  longest_streak,
  last_play_date,
  updated_at
FROM user_streaks 
WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9';

-- What the streak should actually be
SELECT 'WHAT STREAK SHOULD BE:' as status;
WITH user_play_dates AS (
  SELECT 
    quiz_date,
    ROW_NUMBER() OVER (ORDER BY quiz_date) as play_sequence,
    LAG(quiz_date) OVER (ORDER BY quiz_date) as prev_date
  FROM daily_scores
  WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9'
  AND completed_at IS NOT NULL
  ORDER BY quiz_date
),
streak_analysis AS (
  SELECT 
    quiz_date,
    play_sequence,
    prev_date,
    quiz_date - prev_date as days_gap,
    CASE 
      WHEN prev_date IS NULL THEN 'FIRST PLAY'
      WHEN quiz_date - prev_date = 1 THEN 'CONSECUTIVE'
      WHEN quiz_date - prev_date > 1 THEN 'STREAK BROKEN'
      ELSE 'SAME DAY'
    END as streak_status
  FROM user_play_dates
),
streak_groups AS (
  SELECT 
    quiz_date,
    play_sequence,
    prev_date,
    days_gap,
    streak_status,
    SUM(CASE WHEN streak_status = 'STREAK BROKEN' OR streak_status = 'FIRST PLAY' THEN 1 ELSE 0 END) 
      OVER (ORDER BY quiz_date) as streak_group
  FROM streak_analysis
),
streak_lengths AS (
  SELECT 
    streak_group,
    MIN(quiz_date) as streak_start,
    MAX(quiz_date) as streak_end,
    COUNT(*) as streak_length,
    STRING_AGG(quiz_date::text, ', ' ORDER BY quiz_date) as play_dates
  FROM streak_groups
  GROUP BY streak_group
  ORDER BY streak_group
)
SELECT 
  streak_group,
  streak_start,
  streak_end,
  streak_length,
  play_dates,
  CASE 
    WHEN streak_group = (SELECT MAX(streak_group) FROM streak_lengths) 
    THEN 'CURRENT STREAK'
    ELSE 'PAST STREAK'
  END as streak_type
FROM streak_lengths
ORDER BY streak_group;

-- Summary
SELECT 'SUMMARY:' as status;
WITH user_play_dates AS (
  SELECT 
    quiz_date,
    ROW_NUMBER() OVER (ORDER BY quiz_date) as play_sequence,
    LAG(quiz_date) OVER (ORDER BY quiz_date) as prev_date
  FROM daily_scores
  WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9'
  AND completed_at IS NOT NULL
  ORDER BY quiz_date
),
streak_groups AS (
  SELECT 
    quiz_date,
    SUM(CASE WHEN prev_date IS NULL OR quiz_date - prev_date > 1 THEN 1 ELSE 0 END) 
      OVER (ORDER BY quiz_date) as streak_group
  FROM user_play_dates
),
streak_lengths AS (
  SELECT 
    streak_group,
    COUNT(*) as streak_length
  FROM streak_groups
  GROUP BY streak_group
)
SELECT 
  MAX(streak_length) as longest_streak,
  (SELECT streak_length 
   FROM streak_lengths 
   WHERE streak_group = (SELECT MAX(streak_group) FROM streak_lengths)) as current_streak
FROM streak_lengths;
