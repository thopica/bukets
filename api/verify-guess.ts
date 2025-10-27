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

function normalizeGuess(guess: string): string {
  return guess.toLowerCase().trim().replace(/[^a-z\s]/g, '');
}

// Common letter substitutions that sound similar or are commonly mistyped
function applyCommonSubstitutions(str: string): string[] {
  const variations: string[] = [str];

  // Phonetic substitutions
  const substitutions: Array<[RegExp, string]> = [
    [/ph/g, 'f'],
    [/f/g, 'ph'],
    [/c/g, 'k'],
    [/k/g, 'c'],
    [/s/g, 'z'],
    [/z/g, 's'],
    [/ck/g, 'k'],
    [/qu/g, 'kw'],
    [/x/g, 'ks'],
    [/ie/g, 'y'],
    [/y/g, 'ie'],
    [/tion/g, 'shun'],
    [/sion/g, 'shun'],
  ];

  for (const [pattern, replacement] of substitutions) {
    if (pattern.test(str)) {
      variations.push(str.replace(pattern, replacement));
    }
  }

  return variations;
}

// Soundex algorithm for phonetic matching
function soundex(str: string): string {
  const a = str.toLowerCase().split('');
  const firstLetter = a[0];

  const codes: { [key: string]: string } = {
    a: '', e: '', i: '', o: '', u: '', h: '', w: '', y: '',
    b: '1', f: '1', p: '1', v: '1',
    c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
    d: '3', t: '3',
    l: '4',
    m: '5', n: '5',
    r: '6'
  };

  let soundexCode = firstLetter.toUpperCase() + a
    .slice(1)
    .map(letter => codes[letter])
    .filter((code, index, array) => code !== '' && code !== array[index - 1])
    .join('')
    .substring(0, 3)
    .padEnd(3, '0');

  return soundexCode;
}

// Levenshtein distance (robust)
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1,       // deletion
        dp[j - 1] + 1,   // insertion
        prev + cost      // substitution
      );
      prev = temp;
    }
  }

  return dp[n];
}

// Advanced fuzzy matching with multiple algorithms
function isFuzzyMatch(guess: string, target: string): boolean {
  // Exact match
  if (guess === target) return true;

  // Very short names require exact match
  if (target.length < 4) return false;

  // Minimum length requirements for meaningful matching
  if (guess.length < 2) return false;

  // Token-based matching for multi-word names (first/last name matching)
  const guessTokens = guess.split(/\s+/).filter(t => t.length >= 2);
  const targetTokens = target.split(/\s+/).filter(t => t.length >= 2);

  if (guessTokens.length > 0 && targetTokens.length > 0) {
    // Check if all guess tokens match target tokens (allows first name only, last name only, etc.)
    const matchingTokens = guessTokens.filter(gt =>
      targetTokens.some(tt => {
        // Exact token match
        if (tt === gt) return true;
        // Token starts with guess (for partial names)
        if (tt.startsWith(gt) && gt.length >= 3) return true;
        // Guess starts with token (for abbreviations)
        if (gt.startsWith(tt) && tt.length >= 3) return true;
        return false;
      })
    );

    // If all guess tokens have matches, it's a valid match
    if (matchingTokens.length === guessTokens.length) {
      return true;
    }
  }

  // Meaningful substring matching (only for substantial partials)
  if (guess.length >= 3) {
    // Check if guess is a meaningful prefix of target
    if (target.startsWith(guess)) {
      return true;
    }
    // Check if target is a meaningful prefix of guess
    if (guess.startsWith(target) && target.length >= 3) {
      return true;
    }
    // Check if guess appears as a word boundary in target
    const wordBoundaryRegex = new RegExp(`\\b${guess}\\b`, 'i');
    if (wordBoundaryRegex.test(target)) {
      return true;
    }
  }

  // Check common substitution variations (only for meaningful lengths)
  if (guess.length >= 3) {
    const guessVariations = applyCommonSubstitutions(guess);
    const targetVariations = applyCommonSubstitutions(target);

    for (const gVar of guessVariations) {
      for (const tVar of targetVariations) {
        if (gVar === tVar) return true;
      }
    }
  }

  // Phonetic matching using Soundex (only for longer names)
  if (guess.length >= 4 && target.length >= 5) {
    const guessSoundex = soundex(guess);
    const targetSoundex = soundex(target);
    if (guessSoundex === targetSoundex) {
      return true;
    }
  }

  // Levenshtein distance for general typos (with stricter limits)
  const maxDistance = Math.max(1, Math.ceil(target.length * 0.2)); // Reduced to 20% error
  const distance = levenshteinDistance(guess, target);

  if (distance <= maxDistance && guess.length >= 3) {
    return true;
  }

  // Prefix matching for longer names (more restrictive)
  if (target.length >= 8 && guess.length >= 5) {
    const minPrefixLength = Math.min(5, Math.floor(target.length * 0.5));
    if (target.startsWith(guess.substring(0, minPrefixLength))) {
      return true;
    }
  }

  return false;
}

const handler = async function(req: VercelRequest, res: VercelResponse) {
  // Security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'");
  
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

    const { guess, quizIndex, alreadyAnswered, revealRank } = req.body;

    console.log('Verifying guess:', { guess, quizIndex, alreadyAnsweredCount: alreadyAnswered?.length, revealRank });

    // Handle reveal request (when timer runs out)
    if (revealRank !== undefined) {
      const targetQuizIndex = quizIndex !== undefined ? quizIndex : getTodaysQuizIndex(quizzes.length);
      const quiz = quizzes[targetQuizIndex];

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const answer = quiz.answers.find(a => a.rank === revealRank);
      if (answer) {
        return res.status(200).json({
          correct: true,
          answer: {
            rank: answer.rank,
            name: answer.name,
            stat: answer.stat
          }
        });
      }
    }

    if (!guess || typeof guess !== 'string') {
      return res.status(400).json({ error: 'Invalid guess' });
    }

    // Determine which quiz to use
    const targetQuizIndex = quizIndex !== undefined ? quizIndex : getTodaysQuizIndex(quizzes.length);
    const quiz = quizzes[targetQuizIndex];

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
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
        return res.status(200).json({
          correct: true,
          answer: {
            rank: answer.rank,
            name: answer.name,
            stat: answer.stat
          }
        });
      }
    }

    console.log('No match found for guess:', guess);
    return res.status(200).json({ correct: false });

  } catch (error) {
    console.error('Error verifying guess:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = withRateLimit('verify-guess')(handler);
