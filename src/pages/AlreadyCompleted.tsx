import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Trophy, Clock, Flame, TrendingUp, Target, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ScoreMessage {
  title: string;
  message: string;
  color: string;
}

function getScoreMessage(totalScore: number): ScoreMessage {
  // Keep typography consistent regardless of score
  return {
    title: totalScore >= 18 ? 'Starter Material' : totalScore >= 12 ? 'Bench Player' : 'Keep Going',
    message: totalScore >= 18
      ? "You're in the rotation, keep grinding to reach the top."
      : totalScore >= 12
        ? "Hit the film room and study up for tomorrow's quiz."
        : "Tomorrow's a new chance.",
    color: 'text-foreground/80'
  };
}

export default function AlreadyCompleted() {
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState<any>(null);
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [answers, setAnswers] = useState<Array<{ rank: number; name: string; stat: string }>>([]);
  const [correctRanks, setCorrectRanks] = useState<number[]>([]);

  useEffect(() => {
    checkCompletion();
    updateCountdown(); // Initial update
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkCompletion = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await api.invoke('check-daily-completion', {
        body: { quiz_date: today }
      });

      if (error) throw error;

      if (!data.completed) {
        // Not completed yet - but don't redirect if we just came from game
        // This prevents infinite redirect loops
        console.warn('No completed score found - staying on already-completed page');
        return;
      }

      setScoreData(data);

      // Load today's quiz answers and user's correct ranks
      try {
        // Get today's quiz index
        const { default: quizzes } = await import('../../quizzes.json');
        // Reuse server's index logic by asking metadata if available is complex; instead infer index by date like API
        // Prefer fetching index from get-quiz-metadata to match server start date calculation
        const { data: meta } = await api.invoke('get-quiz-metadata');
        const quizIndex = meta?.index ?? 0;

        const quiz = quizzes[quizIndex];
        if (quiz && Array.isArray(quiz.answers)) {
          setAnswers(quiz.answers.map((a: any) => ({ rank: a.rank, name: a.name, stat: a.stat })));
        }
      } catch (e) {
        console.error('Failed to load answers on AlreadyCompleted:', e);
      }
      
      // Fetch correct ranks from the user's quiz session for today
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: sessions } = await supabase
            .from('quiz_sessions')
            .select('correct_ranks, completed_at, updated_at, quiz_date')
            .eq('quiz_date', today)
            .not('completed_at', 'is', null)
            .order('updated_at', { ascending: false })
            .limit(1);
          if (sessions && sessions.length > 0 && Array.isArray(sessions[0].correct_ranks)) {
            setCorrectRanks(sessions[0].correct_ranks as number[]);
          }
        }
      } catch (e) {
        console.error('Failed to fetch correct ranks:', e);
      }
      
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
          <Card className="p-6 md:p-8 text-center space-y-4 bg-card/80 backdrop-blur">
            <h1 className="text-6xl font-bold text-primary">
              {scoreData?.total_score || 0} POINTS
            </h1>
            <div className={`${scoreMessage.color}`}>
              <h2 className="text-3xl font-bold">{scoreMessage.title}</h2>
              <p className="text-xl opacity-80">{scoreMessage.message}</p>
            </div>
          </Card>

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

          {/* Answer Summary */}
          {answers.length > 0 && (
            <Card className="p-6 space-y-4 bg-card/80 backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your Picks vs Answers</h3>
                <span className="text-sm text-muted-foreground">All players for today</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {answers.map((a) => {
                  const isCorrect = correctRanks.includes(a.rank);
                  return (
                    <div key={a.rank} className={`flex items-center gap-3 rounded-lg border p-3 ${isCorrect ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold ${isCorrect ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                        {a.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold leading-tight">{a.name}</div>
                        <div className="text-sm text-muted-foreground">{a.stat}</div>
                      </div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-success text-sm font-medium">
                          <CheckCircle className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-destructive text-sm font-medium">
                          <XCircle className="w-4 h-4" /> Missed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}


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
