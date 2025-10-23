-- Test cases for streak edge cases
-- Run this after implementing the fixes to verify everything works correctly

-- Test 1: First time player
SELECT 'TEST 1: First time player' as test_name;
-- This would be tested by inserting a new user's first score

-- Test 2: Consecutive days
SELECT 'TEST 2: Consecutive days' as test_name;
-- Check what the current streak should be for consecutive days
WITH user_play_dates AS (
    SELECT quiz_date,
           ROW_NUMBER() OVER (ORDER BY quiz_date DESC) as rn
    FROM daily_scores
    WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9'
    AND completed_at IS NOT NULL
    ORDER BY quiz_date DESC
),
consecutive_count AS (
    SELECT COUNT(*) as consecutive_days
    FROM user_play_dates upd1
    WHERE NOT EXISTS (
        SELECT 1 
        FROM user_play_dates upd2 
        WHERE upd2.rn = upd1.rn + 1 
        AND upd2.quiz_date != upd1.quiz_date - 1
    )
    AND upd1.rn <= (
        SELECT MIN(rn) 
        FROM user_play_dates upd3
        WHERE EXISTS (
            SELECT 1 
            FROM user_play_dates upd4 
            WHERE upd4.rn = upd3.rn + 1 
            AND upd4.quiz_date != upd3.quiz_date - 1
        )
    )
)
SELECT COALESCE(consecutive_days, 0) as current_streak_should_be FROM consecutive_count;

-- Test 3: Gap in days (streak broken)
SELECT 'TEST 3: Gap in days (streak broken)' as test_name;
-- Show the gaps in the data
SELECT 
    quiz_date,
    LAG(quiz_date) OVER (ORDER BY quiz_date) as previous_date,
    quiz_date - LAG(quiz_date) OVER (ORDER BY quiz_date) as days_gap,
    CASE 
        WHEN quiz_date - LAG(quiz_date) OVER (ORDER BY quiz_date) > 1 
        THEN 'STREAK BROKEN HERE'
        ELSE 'CONSECUTIVE'
    END as streak_status
FROM daily_scores
WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9'
ORDER BY quiz_date;

-- Test 4: Same day (should maintain streak)
SELECT 'TEST 4: Same day (should maintain streak)' as test_name;
-- Check if there are any duplicate dates (shouldn't happen due to unique constraint)
SELECT 
    quiz_date,
    COUNT(*) as submission_count
FROM daily_scores
WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9'
GROUP BY quiz_date
HAVING COUNT(*) > 1;

-- Test 5: Verify current data integrity
SELECT 'TEST 5: Current data integrity check' as test_name;
SELECT 
    us.user_id,
    us.current_streak,
    us.longest_streak,
    us.last_play_date,
    -- Calculate what the streak should actually be
    (
        WITH user_play_dates AS (
            SELECT quiz_date,
                   ROW_NUMBER() OVER (ORDER BY quiz_date DESC) as rn
            FROM daily_scores
            WHERE user_id = us.user_id
            AND completed_at IS NOT NULL
            ORDER BY quiz_date DESC
        ),
        consecutive_count AS (
            SELECT COUNT(*) as consecutive_days
            FROM user_play_dates upd1
            WHERE NOT EXISTS (
                SELECT 1 
                FROM user_play_dates upd2 
                WHERE upd2.rn = upd1.rn + 1 
                AND upd2.quiz_date != upd1.quiz_date - 1
            )
            AND upd1.rn <= (
                SELECT MIN(rn) 
                FROM user_play_dates upd3
                WHERE EXISTS (
                    SELECT 1 
                    FROM user_play_dates upd4 
                    WHERE upd4.rn = upd3.rn + 1 
                    AND upd4.quiz_date != upd3.quiz_date - 1
                )
            )
        )
        SELECT COALESCE(consecutive_days, 0) FROM consecutive_count
    ) as calculated_current_streak,
    -- Check if there's a discrepancy
    CASE 
        WHEN us.current_streak != (
            WITH user_play_dates AS (
                SELECT quiz_date,
                       ROW_NUMBER() OVER (ORDER BY quiz_date DESC) as rn
                FROM daily_scores
                WHERE user_id = us.user_id
                AND completed_at IS NOT NULL
                ORDER BY quiz_date DESC
            ),
            consecutive_count AS (
                SELECT COUNT(*) as consecutive_days
                FROM user_play_dates upd1
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM user_play_dates upd2 
                    WHERE upd2.rn = upd1.rn + 1 
                    AND upd2.quiz_date != upd1.quiz_date - 1
                )
                AND upd1.rn <= (
                    SELECT MIN(rn) 
                    FROM user_play_dates upd3
                    WHERE EXISTS (
                        SELECT 1 
                        FROM user_play_dates upd4 
                        WHERE upd4.rn = upd3.rn + 1 
                        AND upd4.quiz_date != upd3.quiz_date - 1
                    )
                )
            )
            SELECT COALESCE(consecutive_days, 0) FROM consecutive_count
        ) THEN 'DISCREPANCY FOUND'
        ELSE 'OK'
    END as status
FROM user_streaks us
ORDER BY us.last_play_date DESC;

-- Test 6: Verify trigger functionality
SELECT 'TEST 6: Trigger functionality test' as test_name;
-- Check if triggers exist
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'daily_scores'
AND trigger_name LIKE '%streak%'
ORDER BY trigger_name;

-- Test 7: Performance check - make sure the streak calculation is efficient
SELECT 'TEST 7: Performance check' as test_name;
-- Simple performance test on the streak calculation logic
EXPLAIN (ANALYZE, BUFFERS) 
WITH user_play_dates AS (
    SELECT quiz_date,
           ROW_NUMBER() OVER (ORDER BY quiz_date DESC) as rn
    FROM daily_scores
    WHERE user_id = 'fff1d90d-009d-4fce-86f8-4a30c12377d9'
    AND completed_at IS NOT NULL
    ORDER BY quiz_date DESC
)
SELECT COUNT(*) as consecutive_days
FROM user_play_dates upd1
WHERE NOT EXISTS (
    SELECT 1 
    FROM user_play_dates upd2 
    WHERE upd2.rn = upd1.rn + 1 
    AND upd2.quiz_date != upd1.quiz_date - 1
)
AND upd1.rn <= (
    SELECT MIN(rn) 
    FROM user_play_dates upd3
    WHERE EXISTS (
        SELECT 1 
        FROM user_play_dates upd4 
        WHERE upd4.rn = upd3.rn + 1 
        AND upd4.quiz_date != upd3.quiz_date - 1
    )
);
