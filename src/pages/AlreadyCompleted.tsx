import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Trophy, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ScoreMessage {
  title: string;
  message: string;
  color: string;
}

function getScoreMessage(totalScore: number): ScoreMessage {
  if (totalScore === 30) return { title: "Perfect Score!", message: "Flawless victory!", color: "text-yellow-400" };
  if (totalScore >= 27) return { title: "Incredible!", message: "You're an NBA encyclopedia!", color: "text-yellow-400" };
  if (totalScore >= 24) return { title: "Outstanding!", message: "The league scouts are watching!", color: "text-green-400" };
  if (totalScore >= 21) return { title: "Great job!", message: "You know your hoops!", color: "text-green-400" };
  if (totalScore >= 18) return { title: "Solid performance!", message: "Keep that streak going!", color: "text-blue-400" };
  if (totalScore >= 15) return { title: "Not bad!", message: "Room for improvement tomorrow.", color: "text-blue-400" };
  if (totalScore >= 12) return { title: "Decent effort!", message: "Study up for tomorrow's quiz.", color: "text-orange-400" };
  if (totalScore >= 9) return { title: "Tough one today!", message: "Tomorrow's a new chance.", color: "text-orange-400" };
  if (totalScore >= 6) return { title: "Rough day at the office!", message: "Time to hit the film room.", color: "text-red-400" };
  if (totalScore >= 3) return { title: "Even legends have off days!", message: "Comeback tomorrow?", color: "text-red-400" };
  return { title: "Time to call it a day...", message: "Maybe grab a coffee first?", color: "text-gray-400" };
}

export default function AlreadyCompleted() {
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState<any>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    checkCompletion();
    updateCountdown(); // Initial update
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkCompletion = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.functions.invoke('check-daily-completion', {
        body: { quiz_date: today }
      });

      if (error) throw error;

      if (!data.completed) {
        // Not completed yet, redirect to game
        navigate('/game');
        return;
      }

      setScoreData(data);
    } catch (error) {
      console.error('Failed to check completion:', error);
    }
  };

  const updateCountdown = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setCountdown(`${hours}h ${minutes}m`);
  };

  const scoreMessage = scoreData ? getScoreMessage(scoreData.total_score) : { title: "Outstanding!", message: "The league scouts are watching!", color: "text-green-400" };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Message */}
          <div className={`${scoreMessage.color} space-y-2`}>
            <h1 className="text-3xl md:text-4xl font-bold">{scoreMessage.title}</h1>
            <p className="text-xl md:text-2xl opacity-90">{scoreMessage.message}</p>
          </div>

          {/* Score Info */}
          <Card className="p-6 space-y-4 bg-card/80 backdrop-blur">
            <div className="space-y-2">
              <p className="text-lg">Your score today: <span className="font-bold text-primary text-2xl">{scoreData?.total_score || 0} points</span></p>
              {scoreData?.rank && <p className="text-muted-foreground">You're ranked <span className="font-semibold text-foreground">#{scoreData.rank}</span></p>}
            </div>
          </Card>

          {/* Countdown */}
          <Card className="p-6 bg-card/80 backdrop-blur">
            <div className="space-y-3">
              <p className="text-lg font-semibold">Come back tomorrow for a new challenge!</p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono">Next quiz in: {countdown}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => navigate('/leaderboard?period=today')}
              size="lg"
              className="w-full text-lg"
            >
              View Leaderboard
            </Button>
            <Button
              onClick={() => navigate('/training')}
              variant="outline"
              size="lg"
              className="w-full text-lg"
            >
              Try Training Mode
            </Button>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
