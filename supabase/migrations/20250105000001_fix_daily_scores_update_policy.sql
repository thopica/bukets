-- Fix RLS policy to allow users to update their own incomplete daily_scores records
-- This resolves the "Already completed today" error when users try to submit scores

-- Drop the overly restrictive policy that blocks all updates
DROP POLICY IF EXISTS "No updates allowed" ON public.daily_scores;

-- Create a more permissive policy that allows users to update their own incomplete scores
-- This prevents score manipulation after completion while allowing legitimate updates
CREATE POLICY "Users can update own incomplete scores" ON public.daily_scores
  FOR UPDATE 
  USING (auth.uid() = user_id AND completed_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- Add comment to document the policy purpose
COMMENT ON POLICY "Users can update own incomplete scores" ON public.daily_scores IS 
'Allows users to update their own daily_scores records only when completed_at is NULL, preventing score manipulation after completion.';
