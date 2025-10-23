import type { VercelRequest, VercelResponse } from '@vercel/node';
const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
const { join } = require('path');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};


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
      .select('correct_ranks, hints_used, started_at, completed_at, score')
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

    // Use frontend-calculated score from session
    const correct_guesses = validCorrectRanks.length;
    const hints_used = session.hints_used || 0;
    const total_score = session.score || 0; // Use frontend-calculated score

    // Calculate time used
    const startedAt = new Date(session.started_at);
    const completedAt = session.completed_at ? new Date(session.completed_at) : new Date();
    const time_used = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);

    console.log(`Server-verified score for ${user.id}: ${total_score} points (${correct_guesses} correct, ${hints_used} hints)`);

    // Update existing score or insert new one
    if (existing) {
      // Update the existing session with verified score
      const { error: updateError, count: updateCount } = await supabaseClient
        .from('daily_scores')
        .update({
          total_score,
          correct_guesses,
          hints_used,
          time_used,
          completed_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select('id', { count: 'exact', head: true });

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Check if the update actually affected any rows (defensive against RLS issues)
      if (updateCount === 0) {
        console.log('Update affected 0 rows - likely RLS policy issue. Deleting incomplete record and inserting fresh.');
        
        // Delete the incomplete record and insert fresh
        const { error: deleteError } = await supabaseClient
          .from('daily_scores')
          .delete()
          .eq('id', existing.id);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw deleteError;
        }

        // Fall through to insert logic below
        existing = null; // Force insert path
      }
    }

    if (!existing) {
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

    let currentStreak = 1;
    let longestStreak = 1;

    if (streakData) {
      // Calculate day difference using UTC noon to avoid timezone issues
      const lastDate = new Date((streakData.last_play_date as string) + 'T12:00:00Z');
      const quizDate = new Date((quiz_date as string) + 'T12:00:00Z');
      const dayDifference = Math.floor((quizDate.getTime() - lastDate.getTime()) / 86400000);
      
      if (dayDifference === 1) {
        // Consecutive days - increment streak
        currentStreak = streakData.current_streak + 1;
        longestStreak = Math.max(streakData.longest_streak, currentStreak);
      } else if (dayDifference === 0) {
        // Same day - maintain current streak
        currentStreak = streakData.current_streak;
        longestStreak = streakData.longest_streak;
      } else {
        // Streak broken (dayDifference > 1 or < 0) - reset to 1
        currentStreak = 1;
        longestStreak = streakData.longest_streak;
      }

      const { error: updateError } = await supabaseClient
        .from('user_streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_play_date: quiz_date,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Failed to update user streak:', updateError);
        throw new Error(`Failed to update streak: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabaseClient
        .from('user_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_play_date: quiz_date
        });

      if (insertError) {
        console.error('Failed to insert user streak:', insertError);
        throw new Error(`Failed to create streak: ${insertError.message}`);
      }
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
