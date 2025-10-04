-- Add column to store answered player ranks as JSON array
ALTER TABLE daily_scores 
ADD COLUMN IF NOT EXISTS answered_ranks integer[];

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_quiz 
ON daily_scores(user_id, quiz_date) 
WHERE completed_at IS NULL;