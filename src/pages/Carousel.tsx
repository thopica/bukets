import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff, Lightbulb } from "lucide-react";
import carouselData from "@/data/carousel_questions.json";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";

type QuizMode = "single" | "player";
type Answer = {
  rank: number;
  name: string;
  isCorrect: boolean;
  isRevealed: boolean;
  stat?: string;
};

const Carousel = () => {
  const [mode, setMode] = useState<QuizMode>("single");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Player quiz state
  const [playerAnswers, setPlayerAnswers] = useState<Answer[]>([]);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [lastGuessRank, setLastGuessRank] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  
  const totalSingleQuestions = carouselData.singleQuestions.length;
  const totalPlayerQuestions = carouselData.playerQuestions.length;
  
  const currentSingleQuestion = carouselData.singleQuestions[currentIndex];
  const currentPlayerQuestion = carouselData.playerQuestions[currentIndex];

  // Initialize player answers when changing questions
  const initializePlayerAnswers = () => {
    const answers: Answer[] = currentPlayerQuestion.answers.map((_, index) => ({
      rank: index + 1,
      name: "",
      isCorrect: false,
      isRevealed: false,
    }));
    setPlayerAnswers(answers);
    setUsedHints([]);
    setLastGuessRank(null);
  };

  const handleNext = () => {
    setShowAnswer(false);
    const maxQuestions = mode === "single" ? totalSingleQuestions : totalPlayerQuestions;
    setCurrentIndex((prev) => (prev + 1) % maxQuestions);
    if (mode === "player") initializePlayerAnswers();
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    const maxQuestions = mode === "single" ? totalSingleQuestions : totalPlayerQuestions;
    setCurrentIndex((prev) => (prev - 1 + maxQuestions) % maxQuestions);
    if (mode === "player") initializePlayerAnswers();
  };

  const handleRandom = () => {
    setShowAnswer(false);
    const maxQuestions = mode === "single" ? totalSingleQuestions : totalPlayerQuestions;
    const randomIndex = Math.floor(Math.random() * maxQuestions);
    setCurrentIndex(randomIndex);
    if (mode === "player") initializePlayerAnswers();
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleModeChange = (newMode: QuizMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setShowAnswer(false);
    if (newMode === "player") {
      initializePlayerAnswers();
    }
  };

  const handleGuess = (guess: string) => {
    const normalizedGuess = guess.toLowerCase().trim();
    const correctAnswers = currentPlayerQuestion.answers.map(a => a.toLowerCase());
    
    const matchIndex = correctAnswers.findIndex((answer, index) => 
      answer === normalizedGuess && !playerAnswers[index].isRevealed
    );

    if (matchIndex !== -1) {
      const updatedAnswers = [...playerAnswers];
      updatedAnswers[matchIndex] = {
        ...updatedAnswers[matchIndex],
        name: currentPlayerQuestion.answers[matchIndex],
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
        {/* Mode Selector */}
        <Card className="p-4 bg-card/50 backdrop-blur">
          <Tabs value={mode} onValueChange={(v) => handleModeChange(v as QuizMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Questions</TabsTrigger>
              <TabsTrigger value="player">Player Questions</TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Header with Counter */}
        <Card className="p-4 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "single" ? "Single Q&A" : "6-Player Quiz"}
              </p>
              <p className="font-semibold">
                Question {currentIndex + 1} of {mode === "single" ? totalSingleQuestions : totalPlayerQuestions}
              </p>
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

        {mode === "single" ? (
          <>
            {/* Single Question Card */}
            <Card className="flex-1 p-6 space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">
                  {currentSingleQuestion.category}
                </Badge>
                
                <h2 className="text-2xl font-bold leading-tight">
                  {currentSingleQuestion.question}
                </h2>
              </div>

              {/* Answer Section */}
              <div className="space-y-4">
                <Button
                  onClick={toggleAnswer}
                  variant={showAnswer ? "secondary" : "default"}
                  className="w-full"
                  size="lg"
                >
                  {showAnswer ? (
                    <>
                      <EyeOff className="h-5 w-5 mr-2" />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 mr-2" />
                      Show Answer
                    </>
                  )}
                </Button>

                {showAnswer && (
                  <Card className="p-4 bg-primary/10 border-primary animate-slide-up">
                    <p className="text-lg font-semibold text-center">
                      {currentSingleQuestion.answer}
                    </p>
                  </Card>
                )}
              </div>
            </Card>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(((currentIndex + 1) / totalSingleQuestions) * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalSingleQuestions) * 100}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Player Quiz Mode */}
            <QuizHeader
              title={currentPlayerQuestion.category}
              description={currentPlayerQuestion.description}
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
              {currentPlayerQuestion.hints.map((hint) => (
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

            {/* Progress Bar */}
            <div className="space-y-2 pb-24">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(((currentIndex + 1) / totalPlayerQuestions) * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalPlayerQuestions) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
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
      </main>
    </div>
  );
};

export default Carousel;
