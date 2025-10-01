import { useState, useEffect } from "react";
import Header from "@/components/Header";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";
import HintBar from "@/components/quiz/HintBar";
import ResultsModal from "@/components/quiz/ResultsModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Dummy data for v1
const QUIZ_DATA = {
  title: "All-Time Scoring Leaders",
  description: "Name the top 6 scorers in NBA history (regular season)",
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  answers: [
    { rank: 1, name: "LeBron James", aliases: ["lebron", "lbj", "king james"] },
    { rank: 2, name: "Kareem Abdul-Jabbar", aliases: ["kareem", "abdul jabbar", "abdul-jabbar"] },
    { rank: 3, name: "Karl Malone", aliases: ["malone", "mailman"] },
    { rank: 4, name: "Kobe Bryant", aliases: ["kobe", "black mamba"] },
    { rank: 5, name: "Michael Jordan", aliases: ["mj", "jordan", "goat"] },
    { rank: 6, name: "Dirk Nowitzki", aliases: ["dirk", "nowitzki"] },
  ],
  hints: [
    { rank: 1, text: "Active player, entered league in 2003, plays for Lakers" },
    { rank: 2, text: "Legendary Lakers center, famous for skyhook" },
    { rank: 3, text: "Power forward nicknamed 'The Mailman'" },
    { rank: 4, text: "Lakers icon, wore #24 and #8" },
    { rank: 5, text: "6× Finals MVP with Chicago Bulls" },
    { rank: 6, text: "German forward, Dallas Mavericks legend" },
  ],
};

const Index = () => {
  // State management for quiz game
  const [userAnswers, setUserAnswers] = useState<Array<{ rank: number; playerName?: string; isCorrect?: boolean }>>([
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
    const unansweredIndex = userAnswers.findIndex((a) => !a.isCorrect);
    if (unansweredIndex !== -1) {
      const correctAnswer = QUIZ_DATA.answers[unansweredIndex];
      const newAnswers = [...userAnswers];
      newAnswers[unansweredIndex] = {
        rank: correctAnswer.rank,
        playerName: correctAnswer.name,
        isCorrect: false,
      };
      setUserAnswers(newAnswers);
      toast.error("Time's up! Player revealed");
    }
  };

  const normalizeGuess = (guess: string) => {
    return guess.toLowerCase().trim().replace(/[^a-z\s]/g, '');
  };

  const checkGuess = (guess: string) => {
    const normalized = normalizeGuess(guess);
    
    for (const answer of QUIZ_DATA.answers) {
      const isMatch = 
        normalizeGuess(answer.name) === normalized ||
        answer.aliases.some(alias => normalizeGuess(alias) === normalized);
      
      if (isMatch) {
        const alreadyFound = userAnswers.find(
          (a) => a.isCorrect && normalizeGuess(a.playerName || '') === normalizeGuess(answer.name)
        );
        
        if (alreadyFound) {
          toast.info("You already found this player!");
          return null;
        }
        
        return answer;
      }
    }
    
    return null;
  };

  const calculateTimeBonus = () => {
    if (timeRemaining >= 15) return 2;
    if (timeRemaining >= 10) return 1;
    return 0;
  };

  const handleGuess = (guess: string) => {
    const matchedAnswer = checkGuess(guess);
    
    if (matchedAnswer) {
      const timeBonus = calculateTimeBonus();
      const pointsEarned = 3 + timeBonus;
      
      const newAnswers = [...userAnswers];
      const index = matchedAnswer.rank - 1;
      newAnswers[index] = {
        rank: matchedAnswer.rank,
        playerName: matchedAnswer.name,
        isCorrect: true,
      };
      
      setUserAnswers(newAnswers);
      setScore((prev) => prev + pointsEarned);
      setTimeRemaining(24);
      setCurrentHint(undefined);
      setIncorrectGuess(null);
      setLastGuessRank(matchedAnswer.rank);
      
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
      toast.error("Incorrect! Try again");
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
    return QUIZ_DATA.answers.map((answer) => {
      const userAnswer = userAnswers.find((a) => a.rank === answer.rank);
      return {
        rank: answer.rank,
        correctName: answer.name,
        userGuess: userAnswer?.playerName,
        isCorrect: userAnswer?.isCorrect || false,
      };
    });
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up pb-32">
      <Header />
      
      {/* Mobile-Optimized Layout: 15% Header, 50% Grid, 35% Input */}
      <main className="container max-w-2xl mx-auto px-4 py-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Question Header - 15% */}
        <div className="shrink-0">
          <QuizHeader
            title={QUIZ_DATA.title}
            description={QUIZ_DATA.description}
            date={QUIZ_DATA.date}
            timeRemaining={overallTimeRemaining}
            totalTime={totalQuizTime}
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
