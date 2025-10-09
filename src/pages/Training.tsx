import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shuffle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Training() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Array<{ index: number; title: string }>>([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const { data, error } = await api.invoke('get-quiz-metadata');
      if (error) throw error;
      
      const quizList = data.quizzes.map((quiz: any, index: number) => ({
        index: index,
        title: quiz.title
      }));
      setQuizzes(quizList);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    }
  };

  const handleQuizSelect = (quizIndex: number) => {
    navigate(`/game?training=true&quiz=${quizIndex}`);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * quizzes.length);
    handleQuizSelect(randomIndex);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-primary">Training Mode</h1>
            <p className="text-lg text-muted-foreground">
              Practice with all 30 quizzes. No leaderboard, unlimited replays!
            </p>
          </div>

          {/* Shuffle Button */}
          <Card className="p-6 bg-card/80 backdrop-blur">
            <Button
              onClick={handleShuffle}
              size="lg"
              className="w-full text-lg"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Shuffle Random Quiz
            </Button>
          </Card>

          {/* Quiz List */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-center">All Quizzes</h2>
            <div className="grid gap-3">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.index}
                  className="p-4 bg-card/80 backdrop-blur hover:bg-card/90 transition-colors cursor-pointer"
                  onClick={() => handleQuizSelect(quiz.index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-primary">#{quiz.index + 1}</span>
                      <span className="text-base">{quiz.title}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
