-- Create robust quiz sessions table
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quiz_date date NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  current_question_index integer NOT NULL DEFAULT 0,
  correct_answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  locked_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_ranks integer[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'in_progress',
  score integer NOT NULL DEFAULT 0,
  hints_used integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quiz_sessions_unique_user_day UNIQUE (user_id, quiz_date)
);

-- Enable RLS
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "Users can view their own quiz sessions" ON public.quiz_sessions;
CREATE POLICY "Users can view their own quiz sessions"
ON public.quiz_sessions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own quiz session" ON public.quiz_sessions;
CREATE POLICY "Users can create their own quiz session"
ON public.quiz_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own quiz session" ON public.quiz_sessions;
CREATE POLICY "Users can update their own quiz session"
ON public.quiz_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_quiz_sessions_updated_at ON public.quiz_sessions;
CREATE TRIGGER trg_quiz_sessions_updated_at
BEFORE UPDATE ON public.quiz_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();