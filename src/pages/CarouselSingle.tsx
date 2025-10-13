import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shuffle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import carouselData from "@/data/carousel_questions.json";

const CarouselSingle = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const totalQuestions = carouselData.singleQuestions.length;
  const currentQuestion = carouselData.singleQuestions[currentIndex];


  const handleRandom = () => {
    // Reset states immediately without animation
    setShowAnswer(false);
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * totalQuestions);
    setCurrentIndex(randomIndex);
  };

  const toggleAnswer = () => {
    setShowAnswer(true);
    setIsFlipped(true);
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

        

        {/* Flip Card Container */}
        <div className="perspective-1000" key={currentIndex}>
          <div 
            className={`relative w-full h-80 transform-style-preserve-3d ${
              isFlipped ? 'transition-transform duration-700 rotate-y-180' : ''
            }`}
          >
            {/* Front of Card (Question) */}
            <Card className={`absolute inset-0 w-full h-full p-6 backface-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-2 border-blue-200 dark:border-blue-800`}>
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <Badge variant="secondary" className="text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                    {currentQuestion.category}
                  </Badge>
                  
                  <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    {currentQuestion.question}
                  </h2>
                </div>

                {!showAnswer && (
                  <div className="mt-6">
                    <Button
                      onClick={toggleAnswer}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      size="lg"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Show Answer
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Back of Card (Answer) */}
            <Card className={`absolute inset-0 w-full h-full p-6 backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 border-2 border-emerald-200 dark:border-emerald-800`}>
              <div className="flex flex-col h-full justify-center items-center text-center">
                <div className="space-y-4">
                  <Badge variant="secondary" className="text-sm bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
                    Answer
                  </Badge>
                  
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                    {currentQuestion.answer}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

{/* Next Question Button */}
<Card className={`p-4 transition-all duration-500 ${
          showAnswer 
            ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg' 
            : 'bg-card/50 backdrop-blur'
        }`}>
          <div className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handleRandom}
              className={`transition-all duration-300 transform ${
                showAnswer 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl scale-105' 
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              {showAnswer ? 'Next Question' : 'Next Question'}
            </Button>
          </div>
        </Card>
        
      </main>
      
      <Footer />
    </div>
  );
};

export default CarouselSingle;
