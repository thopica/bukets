import { useState, useEffect } from "react";
import Header from "@/components/Header";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";
import HintBar from "@/components/quiz/HintBar";
import ResultsModal from "@/components/quiz/ResultsModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getTodaysQuiz, getQuizDate, type Quiz } from "@/utils/quizDate";

const Index = () => {
  // Get today's quiz metadata (no answers)
  const QUIZ_DATA: Quiz & { date: string } = {
    ...getTodaysQuiz(),
    date: getQuizDate()
  };

  // State management for quiz game
  const [userAnswers, setUserAnswers] = useState<Array<{ rank: number; playerName?: string; isCorrect?: boolean; stat?: string }>>([
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

  const maxHints = 3;
  const totalQuizTime = 160; // 2:40 minutes in seconds

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
          toast.error("Time's up! Quiz ended", {
            description: "The overall time limit has been reached",
            duration: 5000,
          });
          setTimeout(() => setShowResults(true), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(overallTimer);
  }, [overallTimeRemaining, isCompleted]);

  const handleTimeUp = () => {
    const unansweredIndex = userAnswers.findIndex((a) => !a.playerName);
    if (unansweredIndex !== -1) {
      // Time ran out - we need to fetch the correct answer from server
      // For now, just mark as incomplete
      toast.error("Time's up for this player!");
      setTimeRemaining(24);
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
      if (result === "ALREADY_CORRECT") {
        toast.info("You already found this player!");
      } else {
        toast.info("This player was revealed due to timeout. No points awarded.");
      }
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
      
      if (timeRemaining >= 23) {
        toast.success("🏀 BUZZER BEATER! +" + pointsEarned + " points", {
          duration: 3000,
        });
      } else {
        toast.success(`Correct! +${pointsEarned} points (${timeBonus > 0 ? `+${timeBonus} time bonus` : 'no time bonus'})`);
      }
      
      // Check if all answered
      const allCorrect = newAnswers.every((a) => a.isCorrect);
      if (allCorrect) {
        setIsCompleted(true);
        setTimeout(() => setShowResults(true), 1000);
      }
    } else {
      setLastGuessRank(undefined);
      setShowInputError(true);
    }
  };

  const handleRequestHint = () => {
    if (hintsUsed >= maxHints || currentHint) return;
    
    const unansweredIndex = userAnswers.findIndex((a) => !a.isCorrect);
    if (unansweredIndex !== -1) {
      const hint = QUIZ_DATA.hints[unansweredIndex];
      setCurrentHint(hint.text);
      setHintsUsed((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 0.5));
      toast.info("Hint revealed! -0.5 points");
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
    <div className="min-h-screen bg-background flex flex-col animate-slide-up pb-28">
      <Header />
      
      {/* Mobile-Optimized Layout: 15% Header, 50% Grid, 35% Input */}
      <main className="container max-w-2xl mx-auto px-4 py-2 flex-1 flex flex-col gap-2 overflow-y-auto">
        {/* Question Header - 15% */}
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

        {/* Answer Grid - 50% */}
        <div className="flex-1 overflow-y-auto">
          <AnswerGrid 
            answers={userAnswers} 
            lastGuessRank={lastGuessRank}
            disabled={isCompleted}
          />
        </div>
      </main>

      {/* Input Section - Fixed Bottom (35% / Thumb Zone) */}
      <GuessInput
        onGuess={handleGuess}
        onRequestHint={handleRequestHint}
        disabled={isCompleted}
        hintsRemaining={maxHints - hintsUsed}
        currentHint={currentHint}
        showError={showInputError}
      />

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
      />
    </div>
  );
};

export default Index;
