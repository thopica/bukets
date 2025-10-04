-- Add per-turn timer tracking to quiz sessions
ALTER TABLE public.quiz_sessions
ADD COLUMN IF NOT EXISTS turn_started_at TIMESTAMPTZ NOT NULL DEFAULT now();