import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Brain, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import basketballPlayer from "@/assets/basketball-player.png";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  return <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-6 flex-1 flex flex-col justify-center gap-6">
        {user ?
      // Logged-in view - Mobile Optimized
      <>
            <div className="text-center space-y-4">
              {/* Welcome Message - Larger */}
              <p className="text-base text-muted-foreground font-medium">
                Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}
              </p>

              {/* Mini Streak Indicator */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Your current streak</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl">🔥</span>
                  <span className="text-4xl font-bold text-foreground">3</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Don't break your streak</p>
              </div>

              {/* CTA Button - 50% Smaller */}
              <Button size="lg" onClick={() => navigate("/game")} className="w-full h-12 rounded-2xl text-lg font-bold shadow-floating relative overflow-hidden group bg-gradient-to-r from-orange to-orange-hover hover:shadow-floating transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Start Today's Quiz</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-hover to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              {/* Countdown Timer */}
              <p className="text-sm text-muted-foreground font-medium">
                2:47 left to play
              </p>
            </div>
          </> :
      // Not logged-in view
      <>
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">Do you know Basketball?</h1>
              
              <div className="inline-flex items-center justify-center w-48 h-48">
                <img src={basketballPlayer} alt="Basketball player dunking" className="w-full h-full object-contain" />
              </div>
              
              <p className="text-base md:text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                One quiz. Six answers. 2:40. Measure yourself against basketball fans from Boston to Beijing.
              </p>
            </div>

            <Button size="lg" onClick={() => navigate("/game")} className="w-full h-16 rounded-full text-lg font-bold shadow-floating relative overflow-hidden group bg-gradient-to-r from-orange to-orange-hover hover:shadow-floating transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Start Quiz
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-hover to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>

            {/* Social Proof */}
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <p className="text-sm font-medium">12,847 fans played today</p>
              </div>
            </div>

            {/* How It Works - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-6 text-center space-y-3 hover-scale">
                <Clock className="h-10 w-10 mx-auto text-orange" />
                <h3 className="font-bold text-foreground text-lg">Daily Challenge</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  One quiz drops at midnight. 6 answers, 2:40 on the clock.
                </p>
              </Card>

              <Card className="p-6 text-center space-y-3 hover-scale">
                <Trophy className="h-10 w-10 mx-auto text-gold" />
                <h3 className="font-bold text-foreground text-lg">Build Streaks</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Consistency wins. Don't break the chain.
                </p>
              </Card>

              <Card className="p-6 text-center space-y-3 hover-scale">
                <TrendingUp className="h-10 w-10 mx-auto text-success" />
                <h3 className="font-bold text-foreground text-lg">Global Leaderboard</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Boston to Beijing. Prove your IQ.
                </p>
              </Card>
            </div>
          </>}
      </main>

      <Footer />
    </div>;
};
export default Index;