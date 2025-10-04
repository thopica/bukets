-- Fix default that auto-completes sessions on insert
ALTER TABLE public.daily_scores ALTER COLUMN completed_at DROP DEFAULT;

-- Clean up any sessions wrongly marked completed at creation
UPDATE public.daily_scores
SET completed_at = NULL
WHERE completed_at IS NOT NULL
  AND started_at IS NOT NULL
  AND time_used = 0
  AND total_score = 0
  AND correct_guesses = 0;