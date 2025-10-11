import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Shuffle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import carouselData from "@/data/carousel_questions.json";

const CarouselSingle = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const totalQuestions = carouselData.singleQuestions.length;
  const currentQuestion = carouselData.singleQuestions[currentIndex];


  const handleRandom = () => {
    setShowAnswer(false);
    const randomIndex = Math.floor(Math.random() * totalQuestions);
    setCurrentIndex(randomIndex);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="min-h-screen flex flex-col animate-slide-up">
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

        {/* Next Question Button */}
        <Card className="p-4 bg-card/50 backdrop-blur">
          <div className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handleRandom}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Next Question
            </Button>
          </div>
        </Card>

        {/* Question Card */}
        <Card className="p-4 space-y-4">
          <div className="space-y-3">
            <Badge variant="secondary" className="text-sm">
              {currentQuestion.category}
            </Badge>
            
            <h2 className="text-2xl font-bold leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Section */}
          <div className="space-y-3">
            <Button
              onClick={toggleAnswer}
              variant={showAnswer ? "secondary" : "success"}
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


      </main>
    </div>
  );
};

export default CarouselSingle;
