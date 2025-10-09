import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import quiz data - Vercel bundles this at build time
const quizzes = require('./quizzes.json');

const START_DATE = new Date('2025-10-02');

function getTodaysQuizIndex(): number {
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const quizIndex = daysPassed % quizzes.length;
  return quizIndex >= 0 ? quizIndex : 0;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const quizIndexParam = req.query.index as string | undefined;
    const quizIndex = quizIndexParam !== undefined ? parseInt(quizIndexParam) : getTodaysQuizIndex();

    const fullQuiz = quizzes[quizIndex];

    if (!fullQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Return only title and hints (no answers)
    const quiz = {
      title: fullQuiz.title,
      hints: fullQuiz.hints
    };

    return res.status(200).json({
      index: quizIndex,
      totalQuizzes: quizzes.length,
      quiz,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    });

  } catch (error) {
    console.error('Error getting quiz metadata:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
