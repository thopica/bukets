-- Create bot_daily_scores table for historical bot data
CREATE TABLE IF NOT EXISTS public.bot_daily_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id uuid NOT NULL REFERENCES public.bot_pool(id) ON DELETE CASCADE,
  quiz_date date NOT NULL,
  total_score integer NOT NULL CHECK (total_score >= 0 AND total_score <= 30),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(bot_id, quiz_date)
);

-- Enable RLS
ALTER TABLE public.bot_daily_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view bot scores (public leaderboard)
CREATE POLICY "Anyone can view bot scores"
  ON public.bot_daily_scores
  FOR SELECT
  USING (true);

-- Create index for efficient queries
CREATE INDEX idx_bot_daily_scores_date ON public.bot_daily_scores(quiz_date);
CREATE INDEX idx_bot_daily_scores_bot_id ON public.bot_daily_scores(bot_id);

-- Function to generate historical scores for a bot based on skill level
CREATE OR REPLACE FUNCTION generate_bot_score(skill_level text)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  CASE skill_level
    WHEN 'elite' THEN
      RETURN floor(random() * 4 + 27)::integer; -- 27-30
    WHEN 'advanced' THEN
      RETURN floor(random() * 5 + 22)::integer; -- 22-26
    WHEN 'intermediate' THEN
      RETURN floor(random() * 6 + 16)::integer; -- 16-21
    WHEN 'beginner' THEN
      RETURN floor(random() * 6 + 10)::integer; -- 10-15
    ELSE
      RETURN floor(random() * 6 + 16)::integer; -- default to intermediate
  END CASE;
END;
$$;

-- Generate 100 days of historical data for all bots
DO $$
DECLARE
  bot_record RECORD;
  day_offset integer;
  score_value integer;
BEGIN
  -- Loop through all bots
  FOR bot_record IN 
    SELECT id, skill_level FROM public.bot_pool WHERE is_active_bot = true
  LOOP
    -- Generate scores for past 100 days
    FOR day_offset IN 0..99 LOOP
      INSERT INTO public.bot_daily_scores (bot_id, quiz_date, total_score)
      VALUES (
        bot_record.id,
        CURRENT_DATE - day_offset,
        generate_bot_score(bot_record.skill_level)
      )
      ON CONFLICT (bot_id, quiz_date) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;