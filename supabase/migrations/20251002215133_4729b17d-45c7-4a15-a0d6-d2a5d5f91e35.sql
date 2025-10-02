-- Drop the players_glossary table as it's not used in the application
-- All quiz data and validation is handled server-side in edge functions
DROP TABLE IF EXISTS public.players_glossary CASCADE;