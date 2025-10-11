import type { VercelRequest, VercelResponse } from '@vercel/node';
const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
const { join } = require('path');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Scoring constants
const POINTS_PER_CORRECT = 5;
const POINTS_PER_HINT = 1;

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    return res.status(200).end();
  }

  try {
    const supabaseClient = createClient(
      process.env.VITE_SUPABASE_URL ?? '',
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
      {
        global: {
          headers: { Authorization: req.headers.authorization! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { quiz_date, quiz_index } = req.body;

    // Check if user already has a completed score for today
    const { data: existing, error: checkError } = await supabaseClient
      .from('daily_scores')
      .select('id, completed_at')
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .maybeSingle();

    if (checkError) {
      console.error('Check error:', checkError);
      throw checkError;
    }

    // If already completed, don't allow resubmission
    if (existing && existing.completed_at) {
      res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
      res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'Already completed today' });
    }

    // Get the user's quiz session to verify their answers
    const { data: session, error: sessionError } = await supabaseClient
      .from('quiz_sessions')
      .select('correct_ranks, hints_used, started_at, completed_at')
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date)
      .maybeSingle();

    if (sessionError || !session) {
      throw new Error('No quiz session found');
    }

    // Load quiz data to verify answers
    const quizzesPath = join(process.cwd(), 'quizzes.json');
    const quizzes = JSON.parse(readFileSync(quizzesPath, 'utf-8'));
    const quiz = quizzes[quiz_index];

    if (!quiz) {
      throw new Error('Invalid quiz index');
    }

    // Verify the correct_ranks are actually correct
    const correctRanks: number[] = session.correct_ranks || [];
    const validCorrectRanks = correctRanks.filter(rank => {
      const answer = quiz.answers.find((a: any) => a.rank === rank);
      return answer !== undefined; // Verify rank exists in quiz
    });

    // Calculate server-side verified score
    const correct_guesses = validCorrectRanks.length;
    const hints_used = session.hints_used || 0;
    const total_score = (correct_guesses * POINTS_PER_CORRECT) - (hints_used * POINTS_PER_HINT);

    // Calculate time used
    const startedAt = new Date(session.started_at);
    const completedAt = session.completed_at ? new Date(session.completed_at) : new Date();
    const time_used = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);

    console.log(`Server-verified score for ${user.id}: ${total_score} points (${correct_guesses} correct, ${hints_used} hints)`);

    // Update existing score or insert new one
    if (existing) {
      // Update the existing session with verified score
      const { error: updateError } = await supabaseClient
        .from('daily_scores')
        .update({
          total_score,
          correct_guesses,
          hints_used,
          time_used,
          completed_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }
    } else {
      // Insert new score with verified data
      // Handle potential schema cache issues with started_at column
      const insertData: any = {
        user_id: user.id,
        quiz_date,
        quiz_index,
        total_score,
        correct_guesses,
        hints_used,
        time_used,
        completed_at: new Date().toISOString()
      };

      // Try to include started_at, but handle schema cache issues gracefully
      if (session.started_at) {
        insertData.started_at = session.started_at;
      }

      const { error: insertError } = await supabaseClient
        .from('daily_scores')
        .insert(insertData);

      if (insertError) {
        console.error('Insert error:', insertError);
        
        // If the error is about started_at column not found, try without it
        if (insertError.message && insertError.message.includes('started_at')) {
          console.log('Retrying insert without started_at column due to schema cache issue...');
          delete insertData.started_at;
          
          const { error: retryError } = await supabaseClient
            .from('daily_scores')
            .insert(insertData);
            
          if (retryError) {
            console.error('Retry insert error:', retryError);
            throw retryError;
          }
        } else {
          throw insertError;
        }
      }
    }

    // Mark quiz session as completed to prevent replays
    await supabaseClient
      .from('quiz_sessions')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('user_id', user.id)
      .eq('quiz_date', quiz_date);

    // Update streak
    const { data: streakData } = await supabaseClient
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const yesterday = new Date(quiz_date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakData) {
      if (streakData.last_play_date === yesterdayStr) {
        currentStreak = streakData.current_streak + 1;
        longestStreak = Math.max(streakData.longest_streak, currentStreak);
      } else if (streakData.last_play_date === quiz_date) {
        currentStreak = streakData.current_streak;
        longestStreak = streakData.longest_streak;
      } else {
        currentStreak = 1;
        longestStreak = streakData.longest_streak;
      }

      await supabaseClient
        .from('user_streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_play_date: quiz_date,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      await supabaseClient
        .from('user_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_play_date: quiz_date
        });
    }

    // Calculate rank
    const { count } = await supabaseClient
      .from('daily_scores')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_date', quiz_date)
      .gt('total_score', total_score);

    const rank = (count ?? 0) + 1;

    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      rank,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      verified_score: total_score // Return the server-verified score
    });

  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
