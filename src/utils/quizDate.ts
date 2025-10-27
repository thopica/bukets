import { api } from '@/lib/api';

export interface QuizHint {
  rank: number;
  text: string;
}

export interface Quiz {
  title: string;
  hints: QuizHint[];
}

export interface QuizMetadataResponse {
  index: number;
  totalQuizzes: number;
  quiz: Quiz;
  date: string;
}

/**
 * Fetches today's quiz metadata from the backend API
 * Implements caching to avoid unnecessary API calls
 */
export const fetchTodaysQuiz = async (): Promise<QuizMetadataResponse> => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `quiz-metadata-${today}`;

  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Invalid cache, proceed to fetch
      localStorage.removeItem(cacheKey);
    }
  }

  // Fetch from API
  const { data, error } = await api.invoke('get-quiz-metadata');

  if (error) {
    throw new Error(`Failed to fetch quiz metadata: ${error.message}`);
  }

  if (!data) {
    throw new Error('No quiz data returned from API');
  }

  // Cache the result
  localStorage.setItem(cacheKey, JSON.stringify(data));

  return data as QuizMetadataResponse;
};

/**
 * Fetches a specific quiz by index
 */
export const fetchQuizByIndex = async (index: number): Promise<QuizMetadataResponse> => {
  const { data, error } = await api.invoke('get-quiz-metadata', {
    body: { index }
  });

  if (error) {
    throw new Error(`Failed to fetch quiz metadata: ${error.message}`);
  }

  if (!data) {
    throw new Error('No quiz data returned from API');
  }

  return data as QuizMetadataResponse;
};

/**
 * Returns current date in ISO format (YYYY-MM-DD) in UTC
 * This ensures consistency with backend date calculations
 */
export const getQuizDateISO = (): string => {
  const isoDate = new Date().toISOString().split('T')[0];
  console.log(`[FRONTEND DATE] Quiz date: ${isoDate}`);
  return isoDate;
};

/**
 * Returns today's quiz index (for backward compatibility)
 * Note: This is now mainly used for database operations
 */
export const getTodaysQuizIndex = async (): Promise<number> => {
  const metadata = await fetchTodaysQuiz();
  return metadata.index;
};
