import { differenceInDays } from 'date-fns';
import quizMetadata from '@/data/nba_quiz_metadata.json';

const START_DATE = new Date('2025-10-02'); // October 2, 2025

export interface QuizHint {
  rank: number;
  text: string;
}

export interface Quiz {
  title: string;
  description: string;
  hints: QuizHint[];
}

export const getTodaysQuizIndex = (): number => {
  const today = new Date();
  const daysPassed = differenceInDays(today, START_DATE);
  
  // Cycle through the quizzes
  const quizIndex = daysPassed % quizMetadata.quizzes.length;
  
  // Ensure we always return a valid index
  return quizIndex >= 0 ? quizIndex : 0;
};

export const getTodaysQuiz = (): Quiz => {
  const index = getTodaysQuizIndex();
  return quizMetadata.quizzes[index] as Quiz;
};

export const getQuizByIndex = (index: number): Quiz => {
  const safeIndex = Math.max(0, Math.min(index, quizMetadata.quizzes.length - 1));
  return quizMetadata.quizzes[safeIndex] as Quiz;
};

export const getTotalQuizzes = (): number => {
  return quizMetadata.quizzes.length;
};

export const getQuizDate = (): string => {
  return new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const getQuizDateISO = (): string => {
  return new Date().toISOString().split('T')[0];
};
