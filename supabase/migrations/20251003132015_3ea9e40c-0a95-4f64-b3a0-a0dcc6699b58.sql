-- Add country_code to profiles table
ALTER TABLE public.profiles 
ADD COLUMN country_code TEXT;

-- Create game_results table to track each completed game
CREATE TABLE public.game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_date DATE NOT NULL,
  quiz_index INTEGER NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  time_remaining INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quiz_date)
);

-- Create game_answers table for detailed answer tracking
CREATE TABLE public.game_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_result_id UUID NOT NULL REFERENCES public.game_results(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 6),
  is_correct BOOLEAN NOT NULL DEFAULT false,
  is_revealed BOOLEAN NOT NULL DEFAULT false,
  time_taken INTEGER NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_stats table for aggregate statistics
CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_games_played INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  average_score DECIMAL(10,2) NOT NULL DEFAULT 0,
  perfect_games INTEGER NOT NULL DEFAULT 0,
  last_played_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_results
CREATE POLICY "Users can view their own game results"
  ON public.game_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game results"
  ON public.game_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_answers
CREATE POLICY "Users can view their own game answers"
  ON public.game_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.game_results
      WHERE game_results.id = game_answers.game_result_id
      AND game_results.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own game answers"
  ON public.game_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_results
      WHERE game_results.id = game_answers.game_result_id
      AND game_results.user_id = auth.uid()
    )
  );

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_game_results_user_id ON public.game_results(user_id);
CREATE INDEX idx_game_results_quiz_date ON public.game_results(quiz_date);
CREATE INDEX idx_game_answers_game_result_id ON public.game_answers(game_result_id);

-- Function to update user stats after game completion
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_is_perfect BOOLEAN;
  v_prev_date DATE;
  v_new_streak INTEGER;
BEGIN
  -- Check if this is a perfect game (all 6 correct)
  v_is_perfect := NEW.correct_count = 6;
  
  -- Get previous game date for streak calculation
  SELECT last_played_date INTO v_prev_date
  FROM public.user_stats
  WHERE user_id = NEW.user_id;
  
  -- Calculate new streak
  IF v_prev_date IS NULL THEN
    v_new_streak := 1;
  ELSIF NEW.quiz_date = v_prev_date + INTERVAL '1 day' THEN
    v_new_streak := COALESCE((SELECT current_streak FROM public.user_stats WHERE user_id = NEW.user_id), 0) + 1;
  ELSIF NEW.quiz_date = v_prev_date THEN
    v_new_streak := COALESCE((SELECT current_streak FROM public.user_stats WHERE user_id = NEW.user_id), 1);
  ELSE
    v_new_streak := 1;
  END IF;
  
  -- Insert or update user stats
  INSERT INTO public.user_stats (
    user_id,
    current_streak,
    longest_streak,
    total_games_played,
    total_score,
    average_score,
    perfect_games,
    last_played_date,
    updated_at
  )
  VALUES (
    NEW.user_id,
    v_new_streak,
    v_new_streak,
    1,
    NEW.total_score,
    NEW.total_score,
    CASE WHEN v_is_perfect THEN 1 ELSE 0 END,
    NEW.quiz_date,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    current_streak = v_new_streak,
    longest_streak = GREATEST(user_stats.longest_streak, v_new_streak),
    total_games_played = user_stats.total_games_played + 1,
    total_score = user_stats.total_score + NEW.total_score,
    average_score = (user_stats.total_score + NEW.total_score)::DECIMAL / (user_stats.total_games_played + 1),
    perfect_games = user_stats.perfect_games + CASE WHEN v_is_perfect THEN 1 ELSE 0 END,
    last_played_date = NEW.quiz_date,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update user stats when a game is completed
CREATE TRIGGER on_game_completed
  AFTER INSERT ON public.game_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats();