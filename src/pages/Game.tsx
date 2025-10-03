import { useState, useEffect } from "react";
import Header from "@/components/Header";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";
import HintBar from "@/components/quiz/HintBar";
import ResultsModal from "@/components/quiz/ResultsModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getTodaysQuiz, getQuizDate, type Quiz } from "@/utils/quizDate";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  // Dynamic vh fix for mobile
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
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
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const maxHints = 2;
  const totalQuizTime = 160; // 2:40 minutes in seconds

  // Check authentication state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Detect mobile keyboard using VisualViewport and offset input bar
  useEffect(() => {
    const vv = (window as any).visualViewport as any;
    if (!vv) return;

    const updateOffset = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(isInputFocused ? offset : 0);
    };

    updateOffset();
    vv.addEventListener('resize', updateOffset);
    vv.addEventListener('scroll', updateOffset);
    return () => {
      vv.removeEventListener('resize', updateOffset);
      vv.removeEventListener('scroll', updateOffset);
    };
  }, [isInputFocused]);

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
      
      // Check if all answered
      const allCorrect = newAnswers.every((a) => a.isCorrect);
      if (allCorrect) {
        setIsCompleted(true);
        setTimeout(() => setShowResults(true), 1000);
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
    <div className="bg-background animate-slide-up grid" style={{ minHeight: 'calc(100 * var(--vh))', gridTemplateRows: '1fr auto' }}>
      <div className="flex flex-col overflow-hidden">
        <Header hideOnMobile={isInputFocused && !isCompleted} />
        
        {/* Scrollable Content Area */}
        <main className={`container max-w-2xl mx-auto px-2 md:px-4 py-1 md:py-2 pb-24 md:pb-2 flex-1 flex flex-col ${isInputFocused ? 'gap-0' : 'gap-1'} md:gap-2 overflow-y-auto webkit-overflow-scrolling-touch transition-all duration-300 ${isInputFocused && !isCompleted ? 'md:mt-0 -mt-14' : 'mt-0'}`}>
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
        <div className="md:flex-1 md:min-h-0 flex flex-col gap-0">
          <AnswerGrid 
            answers={userAnswers} 
            lastGuessRank={lastGuessRank}
            disabled={isCompleted}
            hintsUsed={hintsUsed}
          />
        </div>

        {/* Input Section - Below player cards */}
        <div className="mt-2">
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
        </main>
      </div>

      {/* Desktop version kept separate for different behavior */}
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
