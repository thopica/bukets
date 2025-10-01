import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Brain, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import basketballPlayer from "@/assets/basketball-player.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-6 flex-1 flex flex-col justify-center gap-6">
        {/* Hero Section - Punchy & Action-Oriented */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-48 h-48">
            <img src={basketballPlayer} alt="Basketball player dunking" className="w-full h-full object-contain" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground leading-tight tracking-tight">
            Drop Your Daily Buckets
          </h1>
          
          <p className="text-lg text-muted-foreground font-medium">
            6 players. 2:40. Let's ball.
          </p>
        </div>

        {/* CTA Button - MASSIVE with subtle gradient shift */}
        <Button 
          size="lg" 
          onClick={() => navigate("/game")}
          className="w-full h-16 rounded-full text-lg font-bold shadow-floating relative overflow-hidden group bg-gradient-to-r from-orange to-orange-hover hover:shadow-floating transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Start Today's Quiz
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-hover to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>

        {/* Streak Showcase - NEW */}
        <div className="bg-gradient-to-br from-gold/20 to-orange/20 border-2 border-gold rounded-card p-6 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl animate-flicker">🔥</span>
            <span className="text-5xl font-bold text-foreground">3</span>
          </div>
          <p className="text-sm font-semibold text-foreground mb-3">Day Streak</p>
          <p className="text-xs text-muted-foreground font-medium">Don't break the chain</p>
          
          {/* Mini Calendar - Last 7 Days */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 0, 0, 0, 0].map((completed, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  completed
                    ? 'bg-success/20 border-2 border-success text-success'
                    : 'bg-muted border-2 border-border text-muted-foreground'
                }`}
              >
                {completed ? '✓' : '•'}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards - 2x2 Grid, Icons + Short Labels */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-5 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange hover:shadow-elevated transition-all duration-200 cursor-pointer group">
            <Clock className="h-8 w-8 text-orange mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-sm text-foreground">Daily Challenge</h3>
          </Card>

          <Card className="p-5 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange hover:shadow-elevated transition-all duration-200 cursor-pointer group">
            <Brain className="h-8 w-8 text-orange mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-sm text-foreground">Smart Hints</h3>
          </Card>

          <Card className="p-5 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange hover:shadow-elevated transition-all duration-200 cursor-pointer group">
            <TrendingUp className="h-8 w-8 text-orange mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-sm text-foreground">Build Streaks</h3>
          </Card>

          <Card className="p-5 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange hover:shadow-elevated transition-all duration-200 cursor-pointer group">
            <Trophy className="h-8 w-8 text-orange mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-sm text-foreground">Compete Globally</h3>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
