import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";
import HintBar from "@/components/quiz/HintBar";
import ResultsModal from "@/components/quiz/ResultsModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getTodaysQuiz, getQuizDate, getQuizDateISO, getTodaysQuizIndex, type Quiz } from "@/utils/quizDate";
import type { User } from "@supabase/supabase-js";
import { useGameScore } from "@/hooks/useGameScore";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

  // Lock initial viewport height for mobile shell - don't update on keyboard
  useEffect(() => {
    const height = window.innerHeight;
    setInitialHeight(height);
    document.documentElement.style.setProperty('--initial-vh', `${height * 0.01}px`);
    
    // Standard vh for desktop
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    
    // Only update on actual orientation/window resize, not keyboard
    const handleResize = () => {
      setVH(); // Always update --vh for desktop
      
      // Only update initial-vh if it's a significant change (orientation, window resize)
      if (Math.abs(window.innerHeight - height) > 100) {
        const newHeight = window.innerHeight;
        setInitialHeight(newHeight);
        document.documentElement.style.setProperty('--initial-vh', `${newHeight * 0.01}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Visual Viewport: track keyboard height and keep scroll anchored
  useEffect(() => {
    const onVVUpdate = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const diff = window.innerHeight - vv.height;
      setKeyboardHeight(diff > 0 ? diff : 0);

      // Preserve scroll position of the content area to avoid jumps
      const el = scrollRef.current;
      if (el) {
        const current = el.scrollTop;
        requestAnimationFrame(() => {
          el.scrollTop = current;
        });
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onVVUpdate);
      window.visualViewport.addEventListener('scroll', onVVUpdate);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onVVUpdate);
        window.visualViewport.removeEventListener('scroll', onVVUpdate);
      }
    };
  }, []);

  // Get today's quiz metadata (no answers)
  const QUIZ_DATA: Quiz & { date: string } = {
    ...getTodaysQuiz(),
    date: getQuizDate()
  };

  // State management for quiz game
  const [userAnswers, setUserAnswers] = useState<Array<{ rank: number; playerName?: string; isCorrect?: boolean; isRevealed?: boolean; stat?: string }>>([
    { rank: 1 },
    { rank: 2 },
    { rank: 3 },
    { rank: 4 },
    { rank: 5 },
    { rank: 6 },
  ]);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | undefined>();
  const [timeRemaining, setTimeRemaining] = useState(24);
  const [overallTimeRemaining, setOverallTimeRemaining] = useState(160);
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [incorrectGuess, setIncorrectGuess] = useState<number | null>(null);
  const [lastGuessRank, setLastGuessRank] = useState<number | undefined>();
  const [showInputError, setShowInputError] = useState(false);
  const [showInputSuccess, setShowInputSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [answerTimings, setAnswerTimings] = useState<Map<number, { startTime: number; endTime?: number }>>(new Map());
  const [quizStartTime] = useState(Date.now());
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const INPUT_BAR_HEIGHT = 72;

  const maxHints = 2;
  const totalQuizTime = 160; // 2:40 minutes in seconds
  const { saveGameResult } = useGameScore();

  // Check authentication state and quiz completion
  useEffect(() => {
    const checkAccess = async () => {
      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Check if user already completed today's quiz
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data: completionCheck } = await supabase.functions.invoke('check-daily-completion', {
          body: { quiz_date: today }
        });

        if (completionCheck?.completed) {
          // User already completed today, redirect
          navigate('/already-completed');
          return;
        }
      } catch (error) {
        console.error('Failed to check completion:', error);
      }
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Initialize answer timings for all ranks
  useEffect(() => {
    const timings = new Map<number, { startTime: number; endTime?: number }>();
    for (let i = 1; i <= 6; i++) {
      timings.set(i, { startTime: Date.now() });
    }
    setAnswerTimings(timings);
  }, []);

  // Per-player timer countdown
  useEffect(() => {
    if (isCompleted || timeRemaining === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-reveal and move to next if time runs out
          handleTimeUp();
          return 24;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isCompleted, currentPlayerIndex]);

  // Overall quiz timer countdown
  useEffect(() => {
    if (isCompleted || overallTimeRemaining === 0) return;

    const overallTimer = setInterval(() => {
      setOverallTimeRemaining((prev) => {
        if (prev <= 1) {
          // End quiz when overall time is up
          setIsCompleted(true);
          setTimeout(() => setShowResults(true), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(overallTimer);
  }, [overallTimeRemaining, isCompleted]);

  const handleTimeUp = async () => {
    const unansweredIndex = userAnswers.findIndex((a) => !a.playerName);
    if (unansweredIndex !== -1) {
      // Reveal the answer for the first unanswered player
      const rank = unansweredIndex + 1;
      
      try {
        // Call server to get the correct answer for this rank
        const { data, error } = await supabase.functions.invoke('verify-guess', {
          body: {
            revealRank: rank,
            quizIndex: undefined
          }
        });

        if (!error && data?.answer) {
          const newAnswers = [...userAnswers];
          newAnswers[unansweredIndex] = {
            rank: data.answer.rank,
            playerName: data.answer.name,
            isCorrect: false,
            isRevealed: true,
            stat: data.answer.stat,
          };
          setUserAnswers(newAnswers);
          setLastGuessRank(data.answer.rank);
        }
      } catch (error) {
        console.error('Error revealing answer:', error);
      }
      
      setTimeRemaining(24);
      setCurrentHint(undefined);
      setHintsUsed(0);
    }
  };

  const normalizeGuess = (guess: string) => {
    return guess.toLowerCase().trim().replace(/[^a-z\s]/g, '');
  };

  const checkGuess = async (guess: string) => {
    try {
      // Get already answered ranks
      const alreadyAnswered = userAnswers
        .filter(a => a.playerName)
        .map(a => a.rank);

      // Call server-side verification
      const { data, error } = await supabase.functions.invoke('verify-guess', {
        body: {
          guess,
          quizIndex: undefined, // undefined = today's quiz
          alreadyAnswered
        }
      });

      if (error) {
        console.error('Verification error:', error);
        return null;
      }

      if (!data.correct) {
        return null;
      }

      // Check if already answered
      const slot = userAnswers[data.answer.rank - 1];
      if (slot?.playerName) {
        return slot.isCorrect ? "ALREADY_CORRECT" : "ALREADY_REVEALED";
      }

      return data.answer;
    } catch (error) {
      console.error('Error verifying guess:', error);
      return null;
    }
  };

  const calculateTimeBonus = () => {
    const timeUsed = 24 - timeRemaining;
    if (timeUsed < 10) return 2;  // 0-9.99 seconds = +2 points
    if (timeUsed < 15) return 1;  // 10-14.99 seconds = +1 point
    return 0;  // 15+ seconds = no bonus
  };

  const handleGuess = async (guess: string) => {
    const result = await checkGuess(guess);
    
    if (typeof result === "string") {
      // Already correct or timed out - just return
      return;
    }
    
    const matchedAnswer = result;
    
    if (matchedAnswer) {
      const timeBonus = calculateTimeBonus();
      const pointsEarned = 3 + timeBonus;
      
      const newAnswers = [...userAnswers];
      const index = matchedAnswer.rank - 1;
      newAnswers[index] = {
        rank: matchedAnswer.rank,
        playerName: matchedAnswer.name,
        isCorrect: true,
        stat: matchedAnswer.stat,
      };
      
      setUserAnswers(newAnswers);
      setScore((prev) => prev + pointsEarned);
      setTimeRemaining(24);
      setCurrentHint(undefined);
      setIncorrectGuess(null);
      setLastGuessRank(matchedAnswer.rank);
      setShowInputError(false);
      setShowInputSuccess(true);
      // Reset hints after awarding animation
      setTimeout(() => setHintsUsed(0), 800);
      
      // Track timing for this answer
      const timings = new Map(answerTimings);
      const answerTime = timings.get(matchedAnswer.rank);
      if (answerTime) {
        answerTime.endTime = Date.now();
        timings.set(matchedAnswer.rank, answerTime);
        setAnswerTimings(timings);
      }
      
      // Check if all answered
      const allCorrect = newAnswers.every((a) => a.isCorrect);
      if (allCorrect) {
        setIsCompleted(true);
        
        // Navigate to results page with score data
        const correctCount = newAnswers.filter((a) => a.isCorrect).length;
        const totalHints = newAnswers.reduce((sum) => sum, hintsUsed);
        
        navigate('/results', {
          state: {
            total_score: score,
            correct_guesses: correctCount,
            hints_used: totalHints,
            time_used: 160 - overallTimeRemaining,
            quiz_date: getQuizDateISO(),
            quiz_index: getTodaysQuizIndex()
          }
        });
      }
    } else {
      setLastGuessRank(undefined);
      setShowInputError(true);
      setShowInputSuccess(false);
    }
  };

  const handleRequestHint = () => {
    if (hintsUsed >= maxHints) return;
    
    const unansweredIndex = userAnswers.findIndex((a) => !a.isCorrect && !a.isRevealed);
    if (unansweredIndex !== -1) {
      const hint = QUIZ_DATA.hints[unansweredIndex];
      const parts = (hint?.text || '').split(',').map((p) => p.trim()).filter(Boolean);
      const nextIndex = hintsUsed === 0 ? 0 : 1; // 0 for first hint, 1 for second
      const partToShow = parts[nextIndex] || parts[0] || hint?.text || '';
      setCurrentHint(partToShow);
      setHintsUsed((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 1));
      
      // Clear hint - first hint after 10 seconds, second hint after 5 seconds
      const displayDuration = hintsUsed === 0 ? 10000 : 5000;
      setTimeout(() => {
        setCurrentHint(undefined);
      }, displayDuration);
    }
  };

  const saveGameResults = async (answers: typeof userAnswers) => {
    if (!user) return;

    const gameAnswers = answers.map((answer) => {
      const timing = answerTimings.get(answer.rank);
      const timeTaken = timing?.endTime && timing?.startTime 
        ? Math.floor((timing.endTime - timing.startTime) / 1000)
        : 0;

      return {
        rank: answer.rank,
        is_correct: answer.isCorrect || false,
        is_revealed: answer.isRevealed || false,
        time_taken: timeTaken,
        points_earned: answer.isCorrect ? (3 + calculateTimeBonus()) : 0,
      };
    });

    const totalHintsUsed = answers.reduce((sum, a) => {
      // Count hints used per answer based on the global hintsUsed
      // This is a simplified version - in a real app you'd track per answer
      return sum;
    }, hintsUsed);

    await saveGameResult(
      {
        quiz_date: getQuizDateISO(),
        quiz_index: getTodaysQuizIndex(),
        total_score: score,
        correct_count: answers.filter((a) => a.isCorrect).length,
        hints_used: totalHintsUsed,
        time_remaining: overallTimeRemaining,
      },
      gameAnswers
    );
  };

  const getResultsData = () => {
    // We don't have answers client-side, so just return user's guesses
    return userAnswers.map((userAnswer) => ({
      rank: userAnswer.rank,
      correctName: userAnswer.playerName || "Not answered",
      userGuess: userAnswer.playerName,
      isCorrect: userAnswer.isCorrect || false,
    }));
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  return (
    <div className="bg-background animate-slide-up md:grid" style={{ minHeight: 'calc(100 * var(--initial-vh, 1vh))', gridTemplateRows: '1fr auto' }}>
      {/* Mobile Layout: Fixed shell that doesn't move with keyboard */}
      <div className="md:hidden fixed inset-0 flex flex-col" style={{ height: `${initialHeight}px` }}>
        <div className="shrink-0">
          <Header hideOnMobile={false} />
        </div>
        
        {/* Scrollable Content Area - Mobile */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto webkit-overflow-scrolling-touch overscroll-none">
          <div className="container max-w-2xl mx-auto px-2 py-1 flex flex-col gap-1 pb-4">

            {/* Question Header */}
            <div className="shrink-0">
              <QuizHeader
                title={QUIZ_DATA.title}
                description={QUIZ_DATA.description}
                date={QUIZ_DATA.date}
                timeRemaining={overallTimeRemaining}
                totalTime={totalQuizTime}
                playerTimeRemaining={timeRemaining}
                playerTotalTime={24}
                score={score}
                streak={streak}
                hintsUsed={hintsUsed}
                maxHints={maxHints}
                onSubmit={() => {}}
                isDisabled={isCompleted}
                correctCount={correctCount}
                totalCount={6}
              />
            </div>

            {/* Answer Grid */}
            <div className="flex flex-col gap-0">
              <AnswerGrid 
                answers={userAnswers} 
                lastGuessRank={lastGuessRank}
                disabled={isCompleted}
                hintsUsed={hintsUsed}
              />
            </div>

            {/* Input bar directly under answer slots - Mobile */}
            <div className="mt-1">
              <GuessInput
                onGuess={handleGuess}
                onRequestHint={handleRequestHint}
                disabled={isCompleted}
                hintsRemaining={maxHints - hintsUsed}
                currentHint={currentHint}
                showError={showInputError}
                showSuccess={showInputSuccess}
                hintsUsed={hintsUsed}
                onFocusChange={setIsInputFocused}
              />
            </div>

            {/* Spacer for fixed input overlay */}
            <div aria-hidden="true" style={{ height: `${INPUT_BAR_HEIGHT}px` }} />
          </div>
        </div>

        {/* Removed fixed input overlay - now in content flow */}
      </div>

      {/* Desktop Layout: Original grid structure */}
      <div className="hidden md:flex md:flex-col md:overflow-hidden" style={{ minHeight: 'calc(100 * var(--vh))' }}>
        <Header hideOnMobile={isInputFocused && !isCompleted} />
        
        {/* Scrollable Content Area - Desktop */}
        <main className="container max-w-2xl mx-auto px-4 py-2 flex-1 flex flex-col gap-2 overflow-y-auto webkit-overflow-scrolling-touch">
          {/* Question Header */}
          <div className="shrink-0">
            <QuizHeader
              title={QUIZ_DATA.title}
              description={QUIZ_DATA.description}
              date={QUIZ_DATA.date}
              timeRemaining={overallTimeRemaining}
              totalTime={totalQuizTime}
              playerTimeRemaining={timeRemaining}
              playerTotalTime={24}
              score={score}
              streak={streak}
              hintsUsed={hintsUsed}
              maxHints={maxHints}
              onSubmit={() => {}}
              isDisabled={isCompleted}
              correctCount={correctCount}
              totalCount={6}
            />
          </div>

          {/* Answer Grid */}
          <div className="flex-1 min-h-0 flex flex-col gap-0">
            <AnswerGrid 
              answers={userAnswers} 
              lastGuessRank={lastGuessRank}
              disabled={isCompleted}
              hintsUsed={hintsUsed}
            />
          </div>
        </main>
      </div>

      {/* Input Section - Desktop: sticky at bottom */}
      <div className="hidden md:block">
        <GuessInput
          onGuess={handleGuess}
          onRequestHint={handleRequestHint}
          disabled={isCompleted}
          hintsRemaining={maxHints - hintsUsed}
          currentHint={currentHint}
          showError={showInputError}
          showSuccess={showInputSuccess}
          hintsUsed={hintsUsed}
          onFocusChange={setIsInputFocused}
        />
      </div>

      <ResultsModal
        open={showResults}
        onOpenChange={setShowResults}
        score={score}
        correctCount={correctCount}
        totalCount={6}
        streak={streak}
        answers={getResultsData()}
        timeBonus={2}
        speedBonus={overallTimeRemaining > 100 ? 3 : 0}
        hintsUsed={hintsUsed}
        isLoggedIn={!!user}
      />
    </div>
  );
};

export default Index;
