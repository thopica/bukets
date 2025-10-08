import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Brain, TrendingUp, Users, Play, Flame, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import basketballPlayer from "@/assets/basketball-player.png";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

// Stats shape for user dashboard
type Stats = {
  total_score: number;
  total_games_played: number;
  current_streak: number;
  accuracy: number;
};
const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  
  useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserStats(session.user.id);
      }
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserStats(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserStats = async (userId: string) => {
    try {
      // Load stats from daily_scores and user_streaks
      const { data: scoresData } = await supabase
        .from('daily_scores')
        .select('total_score, correct_guesses')
        .eq('user_id', userId);

      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .maybeSingle();

      // Calculate aggregate stats
      const totalScore = scoresData?.reduce((sum, s) => sum + s.total_score, 0) || 0;
      const totalGames = scoresData?.length || 0;
      const accuracy = totalGames > 0 
        ? Math.round((totalScore / (totalGames * 30)) * 100) 
        : 0;

      setStats({
        total_score: totalScore,
        total_games_played: totalGames,
        current_streak: streakData?.current_streak || 0,
        accuracy: accuracy,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };
  return <div className="min-h-screen flex flex-col animate-fade-in relative overflow-hidden">

      {/* Basketball Half-Circle Background - For all users on homepage */}
      <div className="fixed inset-x-0 top-0 flex justify-center pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        {/* Mobile SVG - Larger circle */}
        <svg
          className="w-full md:hidden"
          height="500"
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMin meet"
        >
          {/* Half Circle - Full width with deeper curve for mobile */}
          <path
            d="M 0 0 L 400 0 L 400 250 A 200 200 0 0 1 0 250 Z"
            fill="hsl(215, 100%, 50%)"
          />
        </svg>

        {/* Desktop SVG - Original size */}
        <svg
          className="hidden md:block w-full max-w-[1400px]"
          height="700"
          viewBox="0 0 1400 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMin meet"
        >
          {/* Half Circle - Rectangle on top with semicircle on bottom */}
          <path
            d="M 350 0 L 1050 0 L 1050 350 A 350 350 0 0 1 350 350 Z"
            fill="hsl(215, 100%, 50%)"
          />
        </svg>
      </div>

      <Header />

      <main className="container max-w-5xl mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col justify-center gap-6 md:gap-8 relative z-10">
        {user ?
      // Logged-in view - Matching non-logged-in design
      <>
            <div className="text-center space-y-2 md:space-y-4 px-4 md:px-8">
              {/* Welcome Message */}
              <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
                Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}
              </h1>

              {/* Statistics Grid - Inside blue circle with white text */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-3xl mx-auto py-1 md:py-2">
                  <div className="flex flex-col items-center text-center">
                    <Trophy className="h-5 w-5 md:h-8 md:w-8 text-gold-bright mb-0.5 md:mb-1" />
                    <p className="text-3xl font-bold text-white">{stats.total_score}</p>
                    <p className="text-sm text-white/80">Total Score</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Flame className="h-5 w-5 md:h-8 md:w-8 text-orange mb-0.5 md:mb-1" />
                    <p className="text-3xl font-bold text-white">{stats.current_streak}</p>
                    <p className="text-sm text-white/80">Day Streak</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Play className="h-5 w-5 md:h-8 md:w-8 text-white mb-0.5 md:mb-1" />
                    <p className="text-3xl font-bold text-white">{stats.total_games_played}</p>
                    <p className="text-sm text-white/80">Quizzes Played</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Target className="h-5 w-5 md:h-8 md:w-8 text-success-light mb-0.5 md:mb-1" />
                    <p className="text-3xl font-bold text-white">{stats.accuracy}%</p>
                    <p className="text-sm text-white/80">Accuracy</p>
                  </div>
                </div>
              )}

              {/* CTA Button - White button with blue text like non-logged-in */}
              <Button
                size="lg"
                onClick={() => navigate("/game")}
                className="h-14 px-10 text-lg font-bold shadow-elevated hover:shadow-floating bg-white text-primary hover:bg-white/95"
              >
                <Clock className="h-4 w-4 md:h-6 md:w-6" />
                Start Today's Quiz
              </Button>
            </div>
          </> :
      // Not logged-in view
      <>
            {/* Hero Section */}
            <div className="text-center space-y-3 md:space-y-6">
              {/* Headline */}
              <h1 className="text-6xl font-bold text-white leading-tight tracking-tight">
                Bukets
              </h1>

              {/* Subheadline */}
              <p className="text-2xl text-white/90 max-w-2xl mx-auto">
                Your daily dose of NBA trivia
              </p>

              {/* Value Proposition */}
              <p className="text-xl max-w-xl mx-auto leading-relaxed text-white/90 px-4 md:px-0">
                One quiz. Six players. 2 minutes 40 seconds.<br/>
                Can you name the NBA's greatest?
              </p>

              {/* Primary CTA */}
              <div className="pt-2 md:pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/game")}
                  className="h-16 px-12 text-xl font-bold shadow-elevated hover:shadow-floating bg-white text-primary hover:bg-white/95"
                >
                  <Play className="h-5 w-5 md:h-7 md:w-7" />
                  Start Playing
                </Button>
              </div>

              {/* Basketball Image (50% bigger visually) */}
              <div className="inline-flex items-center justify-center w-48 h-48 md:w-120 md:h-120 my-2 md:my-4">
                <img
                  src={basketballPlayer}
                  alt="Basketball player"
                  className="w-full h-full object-contain drop-shadow-lg"
                  style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
                />
              </div>
            </div>
          </>}

          {!user && (
            /* How It Works - 3 Cards - Below the circle */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-16 md:mt-20">
              <Card className="text-center p-4 md:p-5 space-y-2 transition-transform duration-200 hover:scale-[1.02]">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Daily Challenge</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fresh quiz every day
                </p>
              </Card>

              <Card className="text-center p-4 md:p-5 space-y-2 transition-transform duration-200 hover:scale-[1.02]">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 md:h-7 md:w-7 text-orange" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Build Streaks</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Keep the momentum going
                </p>
              </Card>

              <Card className="text-center p-4 md:p-5 space-y-2 transition-transform duration-200 hover:scale-[1.02]">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 md:h-7 md:w-7 text-success" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Compete Globally</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rise up the leaderboard
                </p>
              </Card>
            </div>
          )}
      </main>

      <Footer />
    </div>;
};
export default Index;