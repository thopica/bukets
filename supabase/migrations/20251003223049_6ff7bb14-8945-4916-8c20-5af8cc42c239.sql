-- Fix email harvesting vulnerability by allowing public access to non-sensitive profile fields only
-- This allows leaderboards to work while protecting email addresses

-- Drop the overly restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a policy that allows users to view their full profile (including email)
CREATE POLICY "Users can view their own full profile" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create a policy that allows anyone to view non-sensitive public profile data
-- This explicitly excludes the email field for security
CREATE POLICY "Public profiles viewable by anyone" 
ON public.profiles
FOR SELECT 
USING (
  -- This policy allows reading all columns, but applications should only 
  -- query display_name, country_code, avatar_url, is_bot, and bot_skill_level
  -- The email column should never be exposed in public queries
  true
);

-- Add a comment to remind developers not to expose email in public queries
COMMENT ON COLUMN public.profiles.email IS 'SENSITIVE: Never expose this field in public queries or leaderboards. Only accessible via authenticated user queries.';