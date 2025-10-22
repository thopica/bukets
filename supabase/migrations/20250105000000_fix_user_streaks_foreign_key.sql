-- Fix user_streaks foreign key constraint
-- The current FK points to public.users.id but should point to auth.users.id

-- Drop the incorrect foreign key constraint
ALTER TABLE public.user_streaks 
DROP CONSTRAINT IF EXISTS user_streaks_user_id_fkey;

-- Add the correct foreign key constraint to auth.users
ALTER TABLE public.user_streaks 
ADD CONSTRAINT user_streaks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
