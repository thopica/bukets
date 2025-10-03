import { supabase } from "@/integrations/supabase/client";
import { getTodaysQuizIndex } from "@/utils/quizDate";

export interface GameAnswer {
  rank: number;
  is_correct: boolean;
  is_revealed: boolean;
  time_taken: number;
  points_earned: number;
}

export interface GameResult {
  quiz_date: string;
  quiz_index: number;
  total_score: number;
  correct_count: number;
  hints_used: number;
  time_remaining: number;
}

export const useGameScore = () => {
  // This hook is simplified - game completion is now handled by submit-score edge function
  // Keeping only streak data retrieval and daily check
  
  const getUserStreakData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user streak data:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Unexpected error fetching user streak data:", error);
      return null;
    }
  };

  const hasPlayedToday = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_scores')
        .select('id')
        .eq('user_id', user.id)
        .eq('quiz_date', today)
        .maybeSingle();

      if (error) {
        console.error("Error checking if played today:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Unexpected error checking if played today:", error);
      return false;
    }
  };

  return {
    getUserStreakData,
    hasPlayedToday,
  };
};
