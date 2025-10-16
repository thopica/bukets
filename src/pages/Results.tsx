import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Trophy, Flame, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
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
  answered_ranks?: number[]; // optional, from game navigation state
}

interface ScoreMessage {
  title: string;
  message: string;
  color: string;
}

function getScoreMessage(totalScore: number): ScoreMessage {
  if (totalScore === 30) return { title: "Goat", message: "Perfect game! You didn't just win, you dominated.", color: "text-foreground/80" };
  if (totalScore >= 25) return { title: "Legend", message: "You proved you're elite. Now stay there.", color: "text-foreground/80" };
  if (totalScore >= 19) return { title: "All-Star", message: "You just proved you belong at the top of the board.", color: "text-foreground/80" };
  if (totalScore >= 13) return { title: "Starter Material", message: "You're in the rotation, keep grinding to reach the top.", color: "text-foreground/80" };
  return { title: "Bench Player", message: "Hit the film room and study up for tomorrow's quiz.", color: "text-foreground/80" };
}

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultsData = location.state as ResultsData;

  const [isSubmitting, setIsSubmitting] = useState(true);
  const [rank, setRank] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [answers, setAnswers] = useState<Array<{ rank: number; name: string; stat: string }>>([]);
  const [correctRanks, setCorrectRanks] = useState<number[]>(resultsData.answered_ranks ?? []);

  useEffect(() => {
    if (!resultsData) {
      navigate('/game');
      return;
    }

    // Load quiz answers for display from quizzes.json
    (async () => {
      try {
        const { default: quizzes } = await import('../../quizzes.json');
        const quiz = quizzes[resultsData.quiz_index];
        if (quiz && Array.isArray(quiz.answers)) {
          setAnswers(quiz.answers.map((a: any) => ({ rank: a.rank, name: a.name, stat: a.stat })));
        }
      } catch (e) {
        console.error('Failed to load quiz answers', e);
      }
    })();

    // Prefer answered_ranks from navigation state (works for logged-in and logged-out users)
    if (Array.isArray(resultsData.answered_ranks)) {
      setCorrectRanks(resultsData.answered_ranks);
      // We can still try to submit score in background if logged in
      checkAuthAndSubmit();
    } else {
      // Otherwise proceed with normal auth + optional fetch from quiz_sessions if logged in
      checkAuthAndSubmit();
    }
  }, []);

  const checkAuthAndSubmit = async () => {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);

    if (session) {
      // Only submit score if logged in
      await submitScore();
    } else {
      // Not logged in - skip submission
      setIsSubmitting(false);
    }
  };

  const submitScore = async () => {
    try {
      // API now verifies score server-side from quiz_sessions table
      const { data, error } = await api.invoke('submit-score', {
        body: {
          quiz_date: resultsData.quiz_date,
          quiz_index: resultsData.quiz_index
        }
      });

      if (error) throw error;

      if (data.success) {
        setRank(data.rank);
        setCurrentStreak(data.current_streak);
        setLongestStreak(data.longest_streak);

        // If we didn't receive answered_ranks via state and user is logged in, try to fetch from quiz_sessions
        if (!Array.isArray(resultsData.answered_ranks)) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .select('correct_ranks, completed_at, updated_at')
                .eq('quiz_date', resultsData.quiz_date)
                .not('completed_at', 'is', null)
                .order('updated_at', { ascending: false })
                .limit(1);

              if (!sessionsError && sessions && sessions.length > 0) {
                const cr = sessions[0].correct_ranks || [];
                if (Array.isArray(cr)) setCorrectRanks(cr);
              }
            }
          } catch (e) {
            // Non-fatal
          }
        }
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
  const accuracy = ((resultsData.correct_guesses / 6) * 100).toFixed(0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full space-y-6">
          {/* Score Display */}
          <Card className="p-6 md:p-8 text-center space-y-4 bg-card/80 backdrop-blur">
            <h1 className="text-6xl font-bold text-primary">
              {resultsData.total_score} POINTS
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
                <span className="text-muted-foreground">✓ Correct Guesses: {resultsData.correct_guesses}/6</span>
                <span className="font-semibold text-green-400">+{resultsData.correct_guesses * 3} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">🎯 Accuracy</span>
                <span className="font-semibold text-foreground">{accuracy}%</span>
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

          {/* Sign Up Prompt - only show for non-logged in users */}
          {!isLoggedIn && (
            <Card className="p-6 space-y-4 bg-card/80 backdrop-blur">
              <div className="space-y-3 text-center">
                <p className="text-muted-foreground">
                  🏆 Your score wasn't saved because you're not logged in.
                </p>
                <p className="text-sm text-muted-foreground">
                  Create a free account to save your scores, climb the leaderboard, and track your streak!
                </p>
                <Button
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="w-full mt-2"
                >
                  Create Account or Log In
                </Button>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {isLoggedIn && (
              <Button
                onClick={() => navigate('/leaderboard?period=today')}
                size="lg"
                className="w-full text-lg"
              >
                View Full Leaderboard
              </Button>
            )}
            <Button
              onClick={() => navigate('/carousel/single')}
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
