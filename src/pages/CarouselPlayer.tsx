import { useState, useEffect } from "react";
import carouselData from "@/data/carousel_questions.json";
import Header from "@/components/Header";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";

type Answer = {
  rank: number;
  name: string;
  isCorrect: boolean;
  isRevealed: boolean;
  stat?: string;
};

const CarouselPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState<Answer[]>([]);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [lastGuessRank, setLastGuessRank] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  
  const totalQuestions = carouselData.playerQuestions.length;
  const currentQuestion = carouselData.playerQuestions[currentIndex];

  // Initialize/reset player answers when question changes
  useEffect(() => {
    const answers: Answer[] = currentQuestion.answers.map((_, index) => ({
      rank: index + 1,
      name: "",
      isCorrect: false,
      isRevealed: false,
    }));
    setPlayerAnswers(answers);
    setUsedHints([]);
    setLastGuessRank(null);
  }, [currentIndex, currentQuestion]);

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * totalQuestions);
    setCurrentIndex(randomIndex);
  };

  const handleGuess = (guess: string) => {
    const normalizedGuess = guess.toLowerCase().trim();
    const correctAnswers = currentQuestion.answers.map(a => a.toLowerCase());
    
    const matchIndex = correctAnswers.findIndex((answer, index) => 
      answer === normalizedGuess && !playerAnswers[index].isRevealed
    );

    if (matchIndex !== -1) {
      const updatedAnswers = [...playerAnswers];
      updatedAnswers[matchIndex] = {
        ...updatedAnswers[matchIndex],
        name: currentQuestion.answers[matchIndex],
        isCorrect: true,
        isRevealed: true,
      };
      setPlayerAnswers(updatedAnswers);
      setLastGuessRank(matchIndex + 1);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
    }
  };

  const correctCount = playerAnswers.filter(a => a.isRevealed).length;

  return (
    <div className="min-h-screen flex flex-col animate-slide-up">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-2 md:px-4 py-1 md:py-2 flex-1 flex flex-col gap-1 md:gap-2 overflow-y-auto webkit-overflow-scrolling-touch">
        {/* Question Header - Compact */}
        <div className="shrink-0">
          <QuizHeader
            title={currentQuestion.category}
            description={currentQuestion.description}
            date=""
            timeRemaining={0}
            totalTime={0}
            playerTimeRemaining={0}
            playerTotalTime={0}
            score={0}
            streak={0}
            hintsUsed={usedHints.length}
            maxHints={2}
            correctCount={correctCount}
            totalCount={6}
          />
        </div>

        {/* Answer Grid */}
        <div className="shrink-0">
          <AnswerGrid
            answers={playerAnswers}
            lastGuessRank={lastGuessRank}
            disabled={false}
            hintsUsed={usedHints.length}
          />
        </div>

        {/* Inputs - Below Answers */}
        {/* Mobile */}
        <div className="md:hidden shrink-0">
          <GuessInput
            onGuess={handleGuess}
            onShuffle={handleRandom}
            disabled={correctCount === 6}
            hintsRemaining={2 - usedHints.length}
            showError={showError}
          />
        </div>
        {/* Desktop */}
        <div className="hidden md:block shrink-0">
          <GuessInput
            onGuess={handleGuess}
            onShuffle={handleRandom}
            disabled={correctCount === 6}
            hintsRemaining={2 - usedHints.length}
            showError={showError}
          />
        </div>
      </main>

    </div>
  );
};

export default CarouselPlayer;
