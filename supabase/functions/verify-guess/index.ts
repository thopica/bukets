import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NBA data embedded in edge function (server-side only)
const nbaData = {
  "quizzes": [
    {
      "title": "All-Time Scoring Leaders",
      "description": "Name the top 6 scorers in NBA history (regular season)",
      "answers": [
        { "rank": 1, "name": "LeBron James", "stat": "42,184 points", "aliases": ["lebron", "lbj", "king james"] },
        { "rank": 2, "name": "Kareem Abdul-Jabbar", "stat": "38,387 points", "aliases": ["kareem", "abdul jabbar", "abdul-jabbar"] },
        { "rank": 3, "name": "Karl Malone", "stat": "36,928 points", "aliases": ["malone", "mailman"] },
        { "rank": 4, "name": "Kobe Bryant", "stat": "33,643 points", "aliases": ["kobe", "black mamba"] },
        { "rank": 5, "name": "Michael Jordan", "stat": "32,292 points", "aliases": ["mj", "jordan", "goat"] },
        { "rank": 6, "name": "Dirk Nowitzki", "stat": "31,560 points", "aliases": ["dirk", "nowitzki"] }
      ],
      "hints": [
        { "rank": 1, "text": "Active player at age 40, all-time leading scorer" },
        { "rank": 2, "text": "Legendary Lakers center, famous for skyhook" },
        { "rank": 3, "text": "Power forward nicknamed 'The Mailman'" },
        { "rank": 4, "text": "Lakers icon, wore #24 and #8" },
        { "rank": 5, "text": "6× Finals MVP with Chicago Bulls" },
        { "rank": 6, "text": "German forward, Dallas Mavericks legend" }
      ]
    }
    // ... rest of quizzes will be added
  ]
};

const START_DATE = new Date('2025-10-02');

function getTodaysQuizIndex(): number {
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const quizIndex = daysPassed % nbaData.quizzes.length;
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
    const quiz = nbaData.quizzes[targetQuizIndex];

    if (!quiz) {
      return new Response(
        JSON.stringify({ error: 'Quiz not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalized = normalizeGuess(guess);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch glossary data
    const { data: glossaryData } = await supabase
      .from('players_glossary')
      .select('*');

    // Check each answer
    for (const answer of quiz.answers) {
      // Check if already answered
      if (alreadyAnswered && alreadyAnswered.includes(answer.rank)) {
        continue;
      }

      let isMatch = normalizeGuess(answer.name) === normalized;
      
      // Check JSON aliases
      if (!isMatch) {
        isMatch = answer.aliases.some((alias: string) => normalizeGuess(alias) === normalized);
      }
      
      // Check glossary variations
      if (!isMatch && glossaryData) {
        const glossaryEntry = glossaryData.find(
          (entry: any) => normalizeGuess(entry.player_name) === normalizeGuess(answer.name)
        );
        
        if (glossaryEntry?.variations) {
          isMatch = glossaryEntry.variations.some(
            (variant: string) => normalizeGuess(variant) === normalized
          );
        }
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
