-- Add column to track auto-revealed ranks (when timer expires)
ALTER TABLE public.quiz_sessions 
ADD COLUMN revealed_ranks integer[] DEFAULT ARRAY[]::integer[];