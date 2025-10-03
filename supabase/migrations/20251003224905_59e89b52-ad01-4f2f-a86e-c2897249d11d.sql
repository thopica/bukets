-- Clean up unused tables and triggers with CASCADE
DROP TABLE IF EXISTS public.game_answers CASCADE;
DROP TABLE IF EXISTS public.game_results CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP FUNCTION IF EXISTS public.update_user_stats() CASCADE;

-- Fix bot_pool: user_id should be nullable for bots
ALTER TABLE public.bot_pool ALTER COLUMN user_id DROP NOT NULL;

-- Populate bot_pool with realistic bot players across different countries and skill levels
INSERT INTO public.bot_pool (username, country_code, skill_level) VALUES
  -- Elite bots (90-100 score range)
  ('LeBronFan23', 'US', 'elite'),
  ('KobeGoat', 'US', 'elite'),
  ('DubNation', 'US', 'elite'),
  ('RaptorKing', 'CA', 'elite'),
  ('SydneySlammer', 'AU', 'elite'),
  ('TokyoHooper', 'JP', 'elite'),
  ('BerlinBaller', 'DE', 'elite'),
  ('MadridMVP', 'ES', 'elite'),
  ('ParisProdigy', 'FR', 'elite'),
  ('LondonLegend', 'GB', 'elite'),
  
  -- Advanced bots (70-89 score range)
  ('HoopDreams88', 'US', 'advanced'),
  ('BallIsLife', 'US', 'advanced'),
  ('SlamDunkKid', 'CA', 'advanced'),
  ('NetSwisher', 'GB', 'advanced'),
  ('CourtVision', 'AU', 'advanced'),
  ('TripleDouble', 'FR', 'advanced'),
  ('FadeawayKing', 'DE', 'advanced'),
  ('AlleyOopMaster', 'ES', 'advanced'),
  ('JumpShotJoe', 'IT', 'advanced'),
  ('AnkleBreaker', 'NL', 'advanced'),
  ('PaintDominator', 'SE', 'advanced'),
  ('PerimeterSniper', 'NO', 'advanced'),
  ('FastBreakFan', 'DK', 'advanced'),
  ('PickAndRollPro', 'FI', 'advanced'),
  ('ClutchPlayer', 'BE', 'advanced'),
  
  -- Intermediate bots (50-69 score range)
  ('CasualFan', 'US', 'intermediate'),
  ('WeekendWarrior', 'CA', 'intermediate'),
  ('BasketballBuddy', 'GB', 'intermediate'),
  ('CourtCrusher', 'AU', 'intermediate'),
  ('HoopNewbie', 'NZ', 'intermediate'),
  ('DunkLover', 'IE', 'intermediate'),
  ('NBAEnthusiast', 'CH', 'intermediate'),
  ('ThreePointFan', 'AT', 'intermediate'),
  ('ReboundKing', 'PL', 'intermediate'),
  ('DefenseFirst', 'CZ', 'intermediate'),
  ('AssistMaster', 'PT', 'intermediate'),
  ('BlockParty', 'GR', 'intermediate'),
  ('StealSpecialist', 'RO', 'intermediate'),
  ('BenchPlayer', 'HU', 'intermediate'),
  ('SixthMan', 'HR', 'intermediate'),
  ('RookieStar', 'RS', 'intermediate'),
  ('BallHandler', 'SK', 'intermediate'),
  ('ScreenSetter', 'SI', 'intermediate'),
  ('SpotUpShooter', 'BG', 'intermediate'),
  ('TransitionAce', 'UA', 'intermediate'),
  
  -- Beginner bots (30-49 score range)
  ('LearningHoops', 'US', 'beginner'),
  ('NewToNBA', 'CA', 'beginner'),
  ('FirstTimer', 'GB', 'beginner'),
  ('TryingMyBest', 'AU', 'beginner'),
  ('BasketballNoob', 'NZ', 'beginner'),
  ('JustStarted', 'IE', 'beginner'),
  ('BeginnerLuck', 'CH', 'beginner'),
  ('LearningCurve', 'AT', 'beginner'),
  ('NeedsPractice', 'PL', 'beginner'),
  ('WorkInProgress', 'CZ', 'beginner');

COMMENT ON TABLE public.bot_pool IS 'Pool of bot players to populate leaderboards when real user count is low';