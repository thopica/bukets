const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Quiz metadata without answers (client-safe)
const quizMetadata = [
  {
    "title": "All-Time Scoring Leaders",
    "description": "Name the top 6 scorers in NBA history (regular season)",
    "hints": [
      { "rank": 1, "text": "Active player at age 40, all-time leading scorer" },
      { "rank": 2, "text": "Legendary Lakers center, famous for skyhook" },
      { "rank": 3, "text": "Power forward nicknamed 'The Mailman'" },
      { "rank": 4, "text": "Lakers icon, wore #24 and #8" },
      { "rank": 5, "text": "6× Finals MVP with Chicago Bulls" },
      { "rank": 6, "text": "German forward, Dallas Mavericks legend" }
    ]
  }
  // ... rest will be added
];

const START_DATE = new Date('2025-10-02');

function getTodaysQuizIndex(): number {
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const quizIndex = daysPassed % quizMetadata.length;
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
    
    const quiz = quizMetadata[quizIndex];

    if (!quiz) {
      return new Response(
        JSON.stringify({ error: 'Quiz not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        index: quizIndex,
        totalQuizzes: quizMetadata.length,
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
