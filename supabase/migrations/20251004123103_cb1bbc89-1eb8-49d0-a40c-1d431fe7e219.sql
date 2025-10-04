-- Add quiz session tracking to prevent timer resets on refresh
-- Add started_at column to track when user began the quiz
ALTER TABLE daily_scores 
ADD COLUMN IF NOT EXISTS started_at timestamp with time zone;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date_started 
ON daily_scores(user_id, quiz_date, started_at);