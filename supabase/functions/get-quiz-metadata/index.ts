import { quizzes } from '../verify-guess/quizzes.ts';

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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const quizIndexParam = url.searchParams.get('index');

    const quizIndex = quizIndexParam !== null ? parseInt(quizIndexParam) : getTodaysQuizIndex();

    const fullQuiz = quizzes[quizIndex];

    if (!fullQuiz) {
      return new Response(
        JSON.stringify({ error: 'Quiz not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return only title and hints (no answers)
    const quiz = {
      title: fullQuiz.title,
      hints: fullQuiz.hints
    };

    return new Response(
      JSON.stringify({
        index: quizIndex,
        totalQuizzes: quizzes.length,
        quiz,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting quiz metadata:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
