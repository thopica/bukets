-- Remove the unused update_user_streak function since it's never called
-- and replace it with a better one that can be used by triggers

-- Drop the old unused function
DROP FUNCTION IF EXISTS public.update_user_streak(uuid, date, boolean);

-- Create a new, better function that handles streak calculation properly
CREATE OR REPLACE FUNCTION public.calculate_user_streak(p_user_id uuid, p_quiz_date date)
RETURNS TABLE(current_streak integer, longest_streak integer, streak_start_date date)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_streak integer := 1;
    v_longest_streak integer := 1;
    v_streak_start_date date := p_quiz_date;
    v_prev_date date;
    v_gap_days integer;
    v_existing_longest integer;
BEGIN
    -- Get the previous play date for this user
    SELECT MAX(quiz_date) INTO v_prev_date
    FROM daily_scores 
    WHERE user_id = p_user_id 
    AND quiz_date < p_quiz_date
    AND completed_at IS NOT NULL;
    
    -- Get existing longest streak
    SELECT COALESCE(us.longest_streak, 0) INTO v_existing_longest
    FROM user_streaks us
    WHERE us.user_id = p_user_id;
    
    -- Calculate gap between previous play and current play
    IF v_prev_date IS NOT NULL THEN
        v_gap_days := p_quiz_date - v_prev_date;
        
        IF v_gap_days = 1 THEN
            -- Consecutive day - increment streak
            SELECT us.current_streak + 1 INTO v_current_streak
            FROM user_streaks us
            WHERE us.user_id = p_user_id;
            
            -- Calculate streak start date by counting backwards
            WITH consecutive_dates AS (
                SELECT quiz_date,
                       ROW_NUMBER() OVER (ORDER BY quiz_date DESC) as rn
                FROM daily_scores
                WHERE user_id = p_user_id
                AND quiz_date <= p_quiz_date
                AND completed_at IS NOT NULL
                ORDER BY quiz_date DESC
            ),
            gap_detection AS (
                SELECT quiz_date, rn,
                       CASE 
                           WHEN LAG(quiz_date) OVER (ORDER BY quiz_date DESC) - quiz_date > 1 
                           THEN 1 
                           ELSE 0 
                       END as has_gap
                FROM consecutive_dates
            ),
            streak_start AS (
                SELECT quiz_date
                FROM gap_detection
                WHERE has_gap = 1
                ORDER BY quiz_date DESC
                LIMIT 1
            )
            SELECT COALESCE((SELECT quiz_date FROM streak_start), 
                           (SELECT MIN(quiz_date) FROM daily_scores WHERE user_id = p_user_id))
            INTO v_streak_start_date;
            
        ELSIF v_gap_days > 1 THEN
            -- Streak broken - reset to 1
            v_current_streak := 1;
            v_streak_start_date := p_quiz_date;
        ELSE
            -- Same day (shouldn't happen due to unique constraint, but handle gracefully)
            SELECT us.current_streak, us.streak_start_date 
            INTO v_current_streak, v_streak_start_date
            FROM user_streaks us
            WHERE us.user_id = p_user_id;
        END IF;
    ELSE
        -- First time playing
        v_current_streak := 1;
        v_streak_start_date := p_quiz_date;
    END IF;
    
    -- Calculate longest streak
    v_longest_streak := GREATEST(v_existing_longest, v_current_streak);
    
    -- Return the calculated values
    RETURN QUERY SELECT v_current_streak, v_longest_streak, v_streak_start_date;
END;
$$;

-- Create a trigger function that automatically updates streaks when a score is inserted
CREATE OR REPLACE FUNCTION public.update_streak_on_score_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_streak_data RECORD;
BEGIN
    -- Only process if the score is completed
    IF NEW.completed_at IS NOT NULL THEN
        -- Calculate the new streak values
        SELECT * INTO v_streak_data
        FROM public.calculate_user_streak(NEW.user_id, NEW.quiz_date);
        
        -- Insert or update the user's streak
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_play_date, streak_start_date, updated_at)
        VALUES (NEW.user_id, v_streak_data.current_streak, v_streak_data.longest_streak, NEW.quiz_date, v_streak_data.streak_start_date, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            current_streak = EXCLUDED.current_streak,
            longest_streak = EXCLUDED.longest_streak,
            last_play_date = EXCLUDED.last_play_date,
            streak_start_date = EXCLUDED.streak_start_date,
            updated_at = EXCLUDED.updated_at;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trg_update_streak_on_score_insert ON daily_scores;
CREATE TRIGGER trg_update_streak_on_score_insert
    AFTER INSERT ON daily_scores
    FOR EACH ROW
    EXECUTE FUNCTION public.update_streak_on_score_insert();

-- Also create trigger for updates (in case completed_at is set later)
DROP TRIGGER IF EXISTS trg_update_streak_on_score_update ON daily_scores;
CREATE TRIGGER trg_update_streak_on_score_update
    AFTER UPDATE ON daily_scores
    FOR EACH ROW
    WHEN (OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL)
    EXECUTE FUNCTION public.update_streak_on_score_insert();
