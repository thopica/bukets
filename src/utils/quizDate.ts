import { differenceInDays } from 'date-fns';
import nbaData from '@/data/nba_data.json';

const START_DATE = new Date('2025-10-02'); // October 2, 2025

export interface QuizAnswer {
  rank: number;
  name: string;
  stat?: string;
  aliases: string[];
}

export interface QuizHint {
  rank: number;
  text: string;
}

export interface Quiz {
  title: string;
  description: string;
  answers: QuizAnswer[];
  hints: QuizHint[];
}

export const getTodaysQuizIndex = (): number => {
  const today = new Date();
  const daysPassed = differenceInDays(today, START_DATE);
  
  // Cycle through the 30 quizzes
  const quizIndex = daysPassed % nbaData.quizzes.length;
  
  // Ensure we always return a valid index (0-29)
  return quizIndex >= 0 ? quizIndex : 0;
};

export const getTodaysQuiz = (): Quiz => {
  const index = getTodaysQuizIndex();
  return nbaData.quizzes[index] as Quiz;
};

export const getQuizByIndex = (index: number): Quiz => {
  const safeIndex = Math.max(0, Math.min(index, nbaData.quizzes.length - 1));
  return nbaData.quizzes[safeIndex] as Quiz;
};

export const getTotalQuizzes = (): number => {
  return nbaData.quizzes.length;
};

export const getQuizDate = (): string => {
  return new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
