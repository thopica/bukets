-- Revert script to recreate deleted tables
-- Only run this if you need to restore the deleted tables

-- Recreate hints_used table (if it had a specific structure)
CREATE TABLE IF NOT EXISTS public.hints_used (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  quiz_date DATE,
  hints_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recreate players_glossary table
CREATE TABLE IF NOT EXISTS public.players_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL UNIQUE,
  variations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recreate quiz_answers table
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id INTEGER,
  rank INTEGER,
  player_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recreate quiz_hints table
CREATE TABLE IF NOT EXISTS public.quiz_hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id INTEGER,
  rank INTEGER,
  hint_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recreate quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_index INTEGER UNIQUE,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recreate user_guesses table
CREATE TABLE IF NOT EXISTS public.user_guesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  quiz_date DATE,
  guess_text TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recreate user_quiz_attempts table
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  quiz_date DATE,
  attempt_number INTEGER,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hints_used ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players_glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_guesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can manage their own hints_used" ON public.hints_used
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read players_glossary" ON public.players_glossary
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read quiz_answers" ON public.quiz_answers
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read quiz_hints" ON public.quiz_hints
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read quizzes" ON public.quizzes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own user_guesses" ON public.user_guesses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own user_quiz_attempts" ON public.user_quiz_attempts
  FOR ALL USING (auth.uid() = user_id);

-- Verify tables were recreated
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

