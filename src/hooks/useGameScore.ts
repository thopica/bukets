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
  const saveGameResult = async (result: GameResult, answers: GameAnswer[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user logged in, skipping score save");
        return { success: false, error: "Not logged in" };
      }

      // Check if result already exists for today
      const { data: existingResult } = await supabase
        .from('game_results')
        .select('id')
        .eq('user_id', user.id)
        .eq('quiz_date', result.quiz_date)
        .maybeSingle();

      if (existingResult) {
        console.log("Game result already exists for today");
        return { success: false, error: "Already played today" };
      }

      // Insert game result
      const { data: gameResult, error: resultError } = await supabase
        .from('game_results')
        .insert({
          user_id: user.id,
          quiz_date: result.quiz_date,
          quiz_index: result.quiz_index,
          total_score: result.total_score,
          correct_count: result.correct_count,
          hints_used: result.hints_used,
          time_remaining: result.time_remaining,
        })
        .select()
        .single();

      if (resultError) throw resultError;

      // Insert individual answers
      const answersToInsert = answers.map(answer => ({
        game_result_id: gameResult.id,
        rank: answer.rank,
        is_correct: answer.is_correct,
        is_revealed: answer.is_revealed,
        time_taken: answer.time_taken,
        points_earned: answer.points_earned,
      }));

      const { error: answersError } = await supabase
        .from('game_answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error saving game result:", error);
      return { success: false, error: error.message };
    }
  };

  const getUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  };

  const hasPlayedToday = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('game_results')
        .select('id')
        .eq('user_id', user.id)
        .eq('quiz_date', today)
        .maybeSingle();

      if (error) throw error;

      return !!data;
    } catch (error) {
      console.error("Error checking if played today:", error);
      return false;
    }
  };

  return {
    saveGameResult,
    getUserStats,
    hasPlayedToday,
  };
};
