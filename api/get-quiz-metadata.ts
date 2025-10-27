import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';
import { withRateLimit } from './_middleware';
import { getCorsHeaders, isOriginAllowed } from './_cors';

const START_DATE = new Date('2025-10-02');

function getTodaysQuizIndex(quizzesLength: number): number {
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const quizIndex = daysPassed % quizzesLength;
  return quizIndex >= 0 ? quizIndex : 0;
}

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none'"
};

const handler = async function(req: VercelRequest, res: VercelResponse) {
  // Set security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS with origin validation
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value as string);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject requests from disallowed origins
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  try {
    // Load quiz data at runtime using fs.readFileSync
    const quizzesPath = join(process.cwd(), 'quizzes.json');
    const quizzes = JSON.parse(readFileSync(quizzesPath, 'utf-8'));

    const quizIndexParam = req.query.index as string | undefined;
    const quizIndex = quizIndexParam !== undefined ? parseInt(quizIndexParam) : getTodaysQuizIndex(quizzes.length);

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
};

module.exports = withRateLimit('get-quiz-metadata')(handler);
