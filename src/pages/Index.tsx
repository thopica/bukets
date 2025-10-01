import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Clock, Brain, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container max-w-6xl mx-auto px-6 py-4 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple/10">
            <Trophy className="h-7 w-7 text-purple" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Test Your NBA Knowledge Daily
          </h1>
          
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Challenge yourself with our daily NBA quiz. Race against the clock, climb the leaderboard, and prove you're the ultimate hoops historian.
          </p>
          
          <div className="pt-2">
            <Button 
              size="lg" 
              onClick={() => navigate("/game")}
              className="px-6 py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Today's Quiz
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple/10">
              <Clock className="h-5 w-5 text-purple" />
            </div>
            <h3 className="font-semibold text-sm text-card-foreground">Daily Challenge</h3>
            <p className="text-xs text-muted-foreground">New quiz every 24 hours</p>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple/10">
              <Brain className="h-5 w-5 text-purple" />
            </div>
            <h3 className="font-semibold text-sm text-card-foreground">Smart Hints</h3>
            <p className="text-xs text-muted-foreground">Strategic hints available</p>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple/10">
              <Trophy className="h-5 w-5 text-purple" />
            </div>
            <h3 className="font-semibold text-sm text-card-foreground">Compete Globally</h3>
            <p className="text-xs text-muted-foreground">Climb the leaderboard</p>
          </Card>

          <Card className="p-4 text-center space-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple/10">
              <TrendingUp className="h-5 w-5 text-purple" />
            </div>
            <h3 className="font-semibold text-sm text-card-foreground">Build Streaks</h3>
            <p className="text-xs text-muted-foreground">Maintain your winning streak</p>
          </Card>
        </div>

        {/* Why Play Section */}
        <Card className="p-6 text-center space-y-3 bg-card/50 backdrop-blur-sm border-2">
          <h2 className="text-xl font-bold text-card-foreground">Why Play NBA Daily Quiz?</h2>
          <div className="max-w-3xl mx-auto text-sm text-muted-foreground">
            <p>
              <strong className="text-card-foreground">Perfect for every fan</strong> — Whether casual or stats obsessive, challenge yourself at every level. 
              <strong className="text-card-foreground"> Sharpen your knowledge</strong> with fascinating NBA facts. 
              <strong className="text-card-foreground"> Join thousands</strong> of basketball fans worldwide.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
