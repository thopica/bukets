import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Trophy, Flame, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ResultsData {
  total_score: number;
  correct_guesses: number;
  hints_used: number;
  time_used: number;
  quiz_date: string;
  quiz_index: number;
}

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

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultsData = location.state as ResultsData;

  const [isSubmitting, setIsSubmitting] = useState(true);
  const [rank, setRank] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  useEffect(() => {
    if (!resultsData) {
      navigate('/game');
      return;
    }

    submitScore();
  }, []);

  const submitScore = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('submit-score', {
        body: {
          quiz_date: resultsData.quiz_date,
          quiz_index: resultsData.quiz_index,
          total_score: resultsData.total_score,
          correct_guesses: resultsData.correct_guesses,
          hints_used: resultsData.hints_used,
          time_used: resultsData.time_used
        }
      });

      if (error) throw error;

      if (data.success) {
        setRank(data.rank);
        setCurrentStreak(data.current_streak);
        setLongestStreak(data.longest_streak);
      }
    } catch (error: any) {
      console.error('Failed to submit score:', error);
      toast.error('Failed to save your score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!resultsData) return null;

  const scoreMessage = getScoreMessage(resultsData.total_score);
  const speedBonus = resultsData.total_score - (resultsData.correct_guesses * 3) + resultsData.hints_used;
  const timedOut = 6 - resultsData.correct_guesses;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              {resultsData.total_score} POINTS
            </h1>
            <div className={`${scoreMessage.color}`}>
              <h2 className="text-2xl md:text-3xl font-bold">{scoreMessage.title}</h2>
              <p className="text-lg md:text-xl opacity-90">{scoreMessage.message}</p>
            </div>
          </div>

          {/* Score Breakdown */}
          <Card className="p-6 space-y-4 bg-card/80 backdrop-blur">
            <h3 className="text-xl font-semibold text-center">Score Breakdown</h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">✓ Correct Guesses: {resultsData.correct_guesses}/6</span>
                <span className="font-semibold text-green-400">+{resultsData.correct_guesses * 3} pts</span>
              </div>
              {speedBonus > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">⚡ Speed Bonuses</span>
                  <span className="font-semibold text-blue-400">+{speedBonus} pts</span>
                </div>
              )}
              {resultsData.hints_used > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">💡 Hints Used: {resultsData.hints_used}</span>
                  <span className="font-semibold text-orange-400">-{resultsData.hints_used} pts</span>
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
                  <span className="font-bold text-primary">{resultsData.total_score} POINTS</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Rank and Streak */}
          <Card className="p-6 space-y-4 bg-card/80 backdrop-blur">
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Calculating your rank...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg">You're ranked <span className="font-bold text-primary">#{rank}</span> today!</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>Current streak: <span className="font-semibold text-foreground">{currentStreak}</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Best: <span className="font-semibold text-foreground">{longestStreak}</span></span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/leaderboard?period=today')}
              size="lg"
              className="w-full text-lg"
            >
              View Full Leaderboard
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
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
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
