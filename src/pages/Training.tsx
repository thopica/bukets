import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";
import ResultsModal from "@/components/quiz/ResultsModal";
import { ChevronLeft, ChevronRight, Shuffle, Flame } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getQuizByIndex, getTotalQuizzes, type Quiz } from "@/utils/quizDate";

const Training = () => {
  const [displayedQuizNumber, setDisplayedQuizNumber] = useState(1);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [QUIZ_DATA, setQUIZ_DATA] = useState<Quiz>(getQuizByIndex(0));
  
  // State management for quiz game
  const [userAnswers, setUserAnswers] = useState<Array<{ rank: number; playerName?: string; isCorrect?: boolean; stat?: string }>>([
    { rank: 1 }, { rank: 2 }, { rank: 3 }, { rank: 4 }, { rank: 5 }, { rank: 6 },
  ]);
  
  const [streak, setStreak] = useState(0);
  const [currentQuizPerfect, setCurrentQuizPerfect] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | undefined>();
  const [timeRemaining, setTimeRemaining] = useState(24);
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastGuessRank, setLastGuessRank] = useState<number | undefined>();
  const [showInputError, setShowInputError] = useState(false);

  const maxHints = 3;
  const totalQuizzes = getTotalQuizzes();

  // Reset quiz state when quiz changes
  const resetQuiz = () => {
    setUserAnswers([
      { rank: 1 }, { rank: 2 }, { rank: 3 }, { rank: 4 }, { rank: 5 }, { rank: 6 },
    ]);
    setCurrentQuizPerfect(true);
    setHintsUsed(0);
    setCurrentHint(undefined);
    setTimeRemaining(24);
    setShowResults(false);
    setIsCompleted(false);
    setLastGuessRank(undefined);
    setShowInputError(false);
  };

  const loadQuiz = (index: number, updateDisplay = true) => {
    const safeIndex = ((index % totalQuizzes) + totalQuizzes) % totalQuizzes;
    setCurrentQuizIndex(safeIndex);
    setQUIZ_DATA(getQuizByIndex(safeIndex));
    if (updateDisplay) {
      setDisplayedQuizNumber(safeIndex + 1);
    }
    resetQuiz();
  };

  const handleRandomQuiz = () => {
    const randomIndex = Math.floor(Math.random() * totalQuizzes);
    loadQuiz(randomIndex, false); // Don't update display number
    toast.success("Random quiz loaded!");
  };

  const handleNextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;
    const safeIndex = ((nextIndex % totalQuizzes) + totalQuizzes) % totalQuizzes;
    setDisplayedQuizNumber((prev) => (prev % totalQuizzes) + 1);
    loadQuiz(nextIndex, false);
  };

  const handlePreviousQuiz = () => {
    const prevIndex = currentQuizIndex - 1;
    const safeIndex = ((prevIndex % totalQuizzes) + totalQuizzes) % totalQuizzes;
    setDisplayedQuizNumber((prev) => prev === 1 ? totalQuizzes : prev - 1);
    loadQuiz(prevIndex, false);
  };

  // No timer in training mode - unlimited time

  const handleTimeUp = () => {
    const unansweredIndex = userAnswers.findIndex((a) => !a.playerName);
    if (unansweredIndex !== -1) {
      // Time ran out - reset timer for next player
      toast.info("Time's up! Hint available.");
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
          quizIndex: currentQuizIndex,
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

  const handleGuess = async (guess: string) => {
    const result = await checkGuess(guess);
    
    if (typeof result === "string") {
      if (result === "ALREADY_CORRECT") {
        toast.info("You already found this player!");
      } else {
        toast.info("This player was already revealed.");
      }
      return;
    }
    
    const matchedAnswer = result;
    
    if (matchedAnswer) {
      const newAnswers = [...userAnswers];
      const index = matchedAnswer.rank - 1;
      newAnswers[index] = {
        rank: matchedAnswer.rank,
        playerName: matchedAnswer.name,
        isCorrect: true,
        stat: matchedAnswer.stat,
      };
      
      setUserAnswers(newAnswers);
      setStreak((prev) => prev + 1);
      setTimeRemaining(24);
      setCurrentHint(undefined);
      setLastGuessRank(matchedAnswer.rank);
      setShowInputError(false);
      
      if (timeRemaining >= 23) {
        toast.success("🏀 BUZZER BEATER!", {
          duration: 3000,
        });
      } else {
        toast.success("Correct!");
      }
      
      const allCorrect = newAnswers.every((a) => a.isCorrect);
      if (allCorrect) {
        // Perfect quiz! Increment streak
        if (currentQuizPerfect) {
          setStreak((prev) => prev + 1);
          toast.success(`🔥 Perfect Quiz! Streak: ${streak + 1}`, {
            duration: 3000,
          });
        }
        setIsCompleted(true);
        setTimeout(() => setShowResults(true), 1000);
      }
    } else {
      setLastGuessRank(undefined);
      setShowInputError(true);
      setStreak(0);
    }
  };

  const handleRequestHint = () => {
    if (hintsUsed >= maxHints || currentHint) return;
    
    const unansweredIndex = userAnswers.findIndex((a) => !a.isCorrect);
    if (unansweredIndex !== -1) {
      const hint = QUIZ_DATA.hints[unansweredIndex];
      setCurrentHint(hint.text);
      setHintsUsed((prev) => prev + 1);
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
      
      <main className="container max-w-2xl mx-auto px-4 py-2 flex-1 flex flex-col gap-4">
        {/* Carousel Navigation */}
        <Card className="p-4 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <p className="text-sm text-muted-foreground">Unranked Training Mode</p>
              <div className="flex items-center justify-center gap-2">
                <p className="font-semibold">Quiz {displayedQuizNumber}</p>
                {streak >= 2 && (
                  <div className="flex items-center gap-1 text-orange animate-bounce-in">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-bold">{streak}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRandomQuiz}
              disabled={isCompleted}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Quiz Content */}
        <div className="shrink-0">
          <QuizHeader
            title={QUIZ_DATA.title}
            description={QUIZ_DATA.description}
            date="Training Mode"
            timeRemaining={0}
            totalTime={0}
            playerTimeRemaining={timeRemaining}
            playerTotalTime={24}
            score={0}
            streak={0}
            hintsUsed={hintsUsed}
            maxHints={maxHints}
            onSubmit={() => {}}
            isDisabled={isCompleted}
            correctCount={correctCount}
            totalCount={6}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnswerGrid 
            answers={userAnswers} 
            lastGuessRank={lastGuessRank}
            disabled={isCompleted}
          />
        </div>
      </main>

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
        onOpenChange={(open) => {
          setShowResults(open);
          if (!open) {
            resetQuiz();
          }
        }}
        score={0}
        correctCount={correctCount}
        totalCount={6}
        streak={0}
        answers={getResultsData()}
        timeBonus={0}
        speedBonus={0}
        hintsUsed={hintsUsed}
      />
    </div>
  );
};

export default Training;
