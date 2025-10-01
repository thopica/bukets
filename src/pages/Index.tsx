import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Brain, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center gap-6">
        {/* Hero Section - Compact & Scannable */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/10">
            <Trophy className="h-8 w-8 text-orange" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
            NBA Daily Quiz
          </h1>
          
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Test your basketball knowledge. Race the clock. Climb the leaderboard.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/game")}
            className="px-8 py-6 rounded-full shadow-floating text-base font-semibold"
          >
            Start Today's Quiz
          </Button>
        </div>

        {/* Features - Compact Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <Clock className="h-5 w-5 text-orange mx-auto" />
            <h3 className="font-semibold text-sm text-foreground">Daily</h3>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <Brain className="h-5 w-5 text-orange mx-auto" />
            <h3 className="font-semibold text-sm text-foreground">Hints</h3>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <Trophy className="h-5 w-5 text-orange mx-auto" />
            <h3 className="font-semibold text-sm text-foreground">Compete</h3>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <TrendingUp className="h-5 w-5 text-orange mx-auto" />
            <h3 className="font-semibold text-sm text-foreground">Streaks</h3>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
