import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import carouselData from "@/data/carousel_questions.json";

const CarouselSingle = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const totalQuestions = carouselData.singleQuestions.length;
  const currentQuestion = carouselData.singleQuestions[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % totalQuestions);
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + totalQuestions) % totalQuestions);
  };

  const handleRandom = () => {
    setShowAnswer(false);
    const randomIndex = Math.floor(Math.random() * totalQuestions);
    setCurrentIndex(randomIndex);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

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
              <p className="text-sm text-muted-foreground">Single Q&A</p>
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

        {/* Question Card */}
        <Card className="flex-1 p-6 space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">
              {currentQuestion.category}
            </Badge>
            
            <h2 className="text-2xl font-bold leading-tight">
              {currentQuestion.question}
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
                  {currentQuestion.answer}
                </p>
              </Card>
            )}
          </div>
        </Card>

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

        {/* Progress Bar */}
        <div className="space-y-2">
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

export default CarouselSingle;
