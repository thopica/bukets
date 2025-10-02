import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { ChevronLeft, ChevronRight, Shuffle, Lightbulb, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import carouselData from "@/data/carousel_questions.json";
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
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState<Answer[]>([]);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [lastGuessRank, setLastGuessRank] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  
  const totalQuestions = carouselData.playerQuestions.length;
  const currentQuestion = carouselData.playerQuestions[currentIndex];

  // Initialize player answers when changing questions
  const initializePlayerAnswers = () => {
    const answers: Answer[] = currentQuestion.answers.map((_, index) => ({
      rank: index + 1,
      name: "",
      isCorrect: false,
      isRevealed: false,
    }));
    setPlayerAnswers(answers);
    setUsedHints([]);
    setLastGuessRank(null);
  };

  // Initialize on mount
  useState(() => {
    initializePlayerAnswers();
  });

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalQuestions);
    initializePlayerAnswers();
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalQuestions) % totalQuestions);
    initializePlayerAnswers();
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * totalQuestions);
    setCurrentIndex(randomIndex);
    initializePlayerAnswers();
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

  const handleRequestHint = (rank: number) => {
    if (!usedHints.includes(rank)) {
      setUsedHints([...usedHints, rank]);
    }
  };

  const correctCount = playerAnswers.filter(a => a.isRevealed).length;

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/carousel")}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        {/* Header with Counter */}
        <Card className="p-4 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <p className="text-sm text-muted-foreground">6-Player Quiz</p>
              <p className="font-semibold">Question {currentIndex + 1} of {totalQuestions}</p>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRandom}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
        </Card>

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
          maxHints={6}
          correctCount={correctCount}
          totalCount={6}
        />

        {/* Hints Display */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {currentQuestion.hints.map((hint) => (
            <Alert 
              key={hint.rank}
              className={`p-3 ${usedHints.includes(hint.rank) ? 'bg-gold/10 border-gold/30' : 'bg-muted/30'}`}
            >
              <AlertDescription className="text-sm">
                {usedHints.includes(hint.rank) ? (
                  <>
                    <Lightbulb className="h-4 w-4 inline mr-1 text-gold" />
                    <span className="font-medium">#{hint.rank}:</span> {hint.text}
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRequestHint(hint.rank)}
                    className="w-full h-auto p-0"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Reveal hint #{hint.rank}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>

        <AnswerGrid
          answers={playerAnswers}
          lastGuessRank={lastGuessRank}
          disabled={false}
        />

        <GuessInput
          onGuess={handleGuess}
          disabled={correctCount === 6}
          hintsRemaining={6 - usedHints.length}
          showError={showError}
        />

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pb-24">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pb-24">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarouselPlayer;
