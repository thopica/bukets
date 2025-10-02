import { quizzes } from './quizzes.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const START_DATE = new Date('2025-10-02');

function getTodaysQuizIndex(): number {
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const quizIndex = daysPassed % quizzes.length;
  return quizIndex >= 0 ? quizIndex : 0;
}

function normalizeGuess(guess: string): string {
  return guess.toLowerCase().trim().replace(/[^a-z\s]/g, '');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guess, quizIndex, alreadyAnswered } = await req.json();
    
    console.log('Verifying guess:', { guess, quizIndex, alreadyAnsweredCount: alreadyAnswered?.length });

    if (!guess || typeof guess !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid guess' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine which quiz to use
    const targetQuizIndex = quizIndex !== undefined ? quizIndex : getTodaysQuizIndex();
    const quiz = quizzes[targetQuizIndex];

    if (!quiz) {
      return new Response(
        JSON.stringify({ error: 'Quiz not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalized = normalizeGuess(guess);

    // Check each answer
    for (const answer of quiz.answers) {
      // Check if already answered
      if (alreadyAnswered && alreadyAnswered.includes(answer.rank)) {
        continue;
      }

      // Check exact name match
      let isMatch = normalizeGuess(answer.name) === normalized;
      
      // Check all aliases (includes nicknames, variations, misspellings)
      if (!isMatch) {
        isMatch = answer.aliases.some((alias: string) => normalizeGuess(alias) === normalized);
      }
      
      if (isMatch) {
        console.log('Match found:', answer.name);
        return new Response(
          JSON.stringify({
            correct: true,
            answer: {
              rank: answer.rank,
              name: answer.name,
              stat: answer.stat
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('No match found for guess:', guess);
    return new Response(
      JSON.stringify({ correct: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying guess:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
