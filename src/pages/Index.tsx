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
      
      <main className="container max-w-6xl mx-auto px-6 py-4 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10">
            <Trophy className="h-7 w-7 text-orange" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Test Your NBA Knowledge Daily
          </h1>
          
          <p className="text-base text-text-secondary max-w-2xl mx-auto">
            Challenge yourself with our daily NBA quiz. Race against the clock, climb the leaderboard, and prove you're the ultimate hoops historian.
          </p>
          
          <div className="pt-2">
            <Button 
              size="lg" 
              onClick={() => navigate("/game")}
              className="px-6 py-5 rounded-full shadow-floating hover:shadow-floating"
            >
              Start Today's Quiz
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange/10">
              <Clock className="h-5 w-5 text-orange" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Daily Challenge</h3>
            <p className="text-xs text-text-secondary">New quiz every 24 hours</p>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange/10">
              <Brain className="h-5 w-5 text-orange" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Smart Hints</h3>
            <p className="text-xs text-text-secondary">Strategic hints available</p>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange/10">
              <Trophy className="h-5 w-5 text-orange" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Compete Globally</h3>
            <p className="text-xs text-text-secondary">Climb the leaderboard</p>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-orange/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange/10">
              <TrendingUp className="h-5 w-5 text-orange" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Build Streaks</h3>
            <p className="text-xs text-text-secondary">Maintain your winning streak</p>
          </Card>
        </div>

        {/* Why Play Section */}
        <Card className="p-6 text-center space-y-3 bg-card/50 backdrop-blur-sm border-2">
          <h2 className="text-xl font-bold text-foreground">Why Play NBA Daily Quiz?</h2>
          <div className="max-w-3xl mx-auto text-sm text-text-secondary">
            <p>
              <strong className="text-foreground">Perfect for every fan</strong> — Whether casual or stats obsessive, challenge yourself at every level. 
              <strong className="text-foreground"> Sharpen your knowledge</strong> with fascinating NBA facts. 
              <strong className="text-foreground"> Join thousands</strong> of basketball fans worldwide.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
