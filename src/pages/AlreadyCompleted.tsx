import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Trophy, Clock, Flame, TrendingUp, Target } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState<number>(0);

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
      
      // Calculate accuracy from all daily scores
      await calculateAccuracy();
    } catch (error) {
      console.error('Failed to check completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAccuracy = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: scores, error } = await supabase
        .from('daily_scores')
        .select('total_score')
        .eq('user_id', user.id);

      if (error) throw error;

      if (scores && scores.length > 0) {
        const totalScore = scores.reduce((sum, s) => sum + s.total_score, 0);
        const gamesPlayed = scores.length;
        const calculatedAccuracy = Math.round((totalScore / (gamesPlayed * 30)) * 100);
        setAccuracy(calculatedAccuracy);
      }
    } catch (error) {
      console.error('Failed to calculate accuracy:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-primary/5">
        <Header />
        <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const scoreMessage = scoreData ? getScoreMessage(scoreData.total_score) : { title: "Outstanding!", message: "The league scouts are watching!", color: "text-green-400" };
  const speedBonus = scoreData ? scoreData.total_score - (scoreData.correct_guesses * 3) : 0;
  const timedOut = scoreData ? 6 - scoreData.correct_guesses : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-primary">
              {scoreData?.total_score || 0} POINTS
            </h1>
            <div className={`${scoreMessage.color}`}>
              <h2 className="text-3xl font-bold">{scoreMessage.title}</h2>
              <p className="text-xl opacity-90">{scoreMessage.message}</p>
            </div>
          </div>

          {/* Score Breakdown */}
          <Card className="p-6 space-y-4 bg-card/80 backdrop-blur">
            <h3 className="text-xl font-semibold text-center">Score Breakdown</h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">✓ Correct Guesses: {scoreData?.correct_guesses || 0}/6</span>
                <span className="font-semibold text-green-400">+{(scoreData?.correct_guesses || 0) * 3} pts</span>
              </div>
              {speedBonus > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">⚡ Speed Bonuses</span>
                  <span className="font-semibold text-blue-400">+{speedBonus} pts</span>
                </div>
              )}
              {scoreData?.hints_used > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">💡 Hints Used: {scoreData.hints_used}</span>
                  <span className="font-semibold text-orange-400">-{scoreData.hints_used} pts</span>
                </div>
              )}
              {timedOut > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">⏱️ Timer Expired: {timedOut} players</span>
                  <span className="font-semibold text-gray-400">0 pts</span>
                </div>
              )}
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">TOTAL</span>
                  <span className="font-bold text-primary">{scoreData?.total_score || 0} POINTS</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Rank and Streaks */}
          <Card className="p-6 space-y-4 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-center gap-2 text-xl">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>You're ranked <span className="font-bold text-primary">#{scoreData?.rank || 0}</span> today!</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-lg flex-wrap">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span>Current streak: <span className="font-semibold">{scoreData?.current_streak || 0}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Best: <span className="font-semibold">{scoreData?.longest_streak || 0}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span>Accuracy: <span className="font-semibold">{accuracy}%</span></span>
              </div>
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
