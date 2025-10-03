-- Add bot tracking columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_skill_level TEXT;

-- Create daily_scores table
CREATE TABLE IF NOT EXISTS daily_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  quiz_date DATE NOT NULL,
  quiz_index INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  correct_guesses INTEGER NOT NULL,
  hints_used INTEGER NOT NULL,
  time_used INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quiz_date)
);

CREATE INDEX idx_daily_scores_date ON daily_scores(quiz_date);
CREATE INDEX idx_daily_scores_user ON daily_scores(user_id);
CREATE INDEX idx_daily_scores_score ON daily_scores(total_score DESC);

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_play_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bot_pool table
CREATE TABLE IF NOT EXISTS bot_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  username TEXT UNIQUE NOT NULL,
  country_code TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  is_active_bot BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bot_pool_active ON bot_pool(is_active_bot);
CREATE INDEX idx_bot_pool_country ON bot_pool(country_code);

-- Enable RLS on all tables
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_pool ENABLE ROW LEVEL SECURITY;

-- daily_scores policies
CREATE POLICY "Users can insert own scores" ON daily_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view scores" ON daily_scores
  FOR SELECT USING (true);

CREATE POLICY "No updates allowed" ON daily_scores
  FOR UPDATE USING (false);

-- user_streaks policies
CREATE POLICY "Anyone can view streaks" ON user_streaks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own streak" ON user_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- bot_pool policies
CREATE POLICY "Anyone can view bots" ON bot_pool
  FOR SELECT USING (true);