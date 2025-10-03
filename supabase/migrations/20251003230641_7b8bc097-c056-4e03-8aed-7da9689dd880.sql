-- Fix search_path for generate_bot_score function
CREATE OR REPLACE FUNCTION generate_bot_score(skill_level text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CASE skill_level
    WHEN 'elite' THEN
      RETURN floor(random() * 4 + 27)::integer; -- 27-30
    WHEN 'advanced' THEN
      RETURN floor(random() * 5 + 22)::integer; -- 22-26
    WHEN 'intermediate' THEN
      RETURN floor(random() * 6 + 16)::integer; -- 16-21
    WHEN 'beginner' THEN
      RETURN floor(random() * 6 + 10)::integer; -- 10-15
    ELSE
      RETURN floor(random() * 6 + 16)::integer; -- default to intermediate
  END CASE;
END;
$$;