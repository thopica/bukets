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

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

// Check if guess is close enough to target (allows for misspellings)
function isFuzzyMatch(guess: string, target: string): boolean {
  // Exact match
  if (guess === target) return true;
  
  // For short names (< 5 chars), require exact match
  if (target.length < 5) return false;
  
  // Calculate allowed edit distance based on length
  const maxDistance = Math.max(1, Math.floor(target.length * 0.2)); // Allow 20% error
  const distance = levenshteinDistance(guess, target);
  
  return distance <= maxDistance;
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

      const normalizedName = normalizeGuess(answer.name);
      
      // Check exact name match
      let isMatch = normalizedName === normalized;
      
      // Check fuzzy name match for misspellings
      if (!isMatch) {
        isMatch = isFuzzyMatch(normalized, normalizedName);
      }
      
      // Check all aliases (includes nicknames, variations)
      if (!isMatch) {
        isMatch = answer.aliases.some((alias: string) => {
          const normalizedAlias = normalizeGuess(alias);
          return normalizedAlias === normalized || isFuzzyMatch(normalized, normalizedAlias);
        });
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
