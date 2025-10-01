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
      
      <main className="container max-w-6xl mx-auto px-6 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple/10 mb-4">
            <Trophy className="h-10 w-10 text-purple" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Test Your NBA<br />Knowledge Daily
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Think you know basketball? Challenge yourself with our daily NBA quiz. 
            Race against the clock, climb the leaderboard, and prove you're the ultimate hoops historian.
          </p>
          
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/game")}
              className="text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Today's Quiz
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center space-y-3 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple/10">
              <Clock className="h-6 w-6 text-purple" />
            </div>
            <h3 className="font-semibold text-card-foreground">Daily Challenge</h3>
            <p className="text-sm text-muted-foreground">New quiz every 24 hours. Can you keep your streak alive?</p>
          </Card>

          <Card className="p-6 text-center space-y-3 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple/10">
              <Brain className="h-6 w-6 text-purple" />
            </div>
            <h3 className="font-semibold text-card-foreground">Smart Hints</h3>
            <p className="text-sm text-muted-foreground">Stuck? Use strategic hints to unlock tough answers.</p>
          </Card>

          <Card className="p-6 text-center space-y-3 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple/10">
              <Trophy className="h-6 w-6 text-purple" />
            </div>
            <h3 className="font-semibold text-card-foreground">Compete Globally</h3>
            <p className="text-sm text-muted-foreground">Climb the leaderboard and compete with fans worldwide.</p>
          </Card>

          <Card className="p-6 text-center space-y-3 bg-card/50 backdrop-blur-sm border-2 hover:border-purple/50 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple/10">
              <TrendingUp className="h-6 w-6 text-purple" />
            </div>
            <h3 className="font-semibold text-card-foreground">Build Streaks</h3>
            <p className="text-sm text-muted-foreground">Maintain your winning streak and dominate the rankings.</p>
          </Card>
        </div>

        {/* Why Play Section */}
        <Card className="p-8 md:p-12 text-center space-y-6 bg-card/50 backdrop-blur-sm border-2">
          <h2 className="text-3xl font-bold text-card-foreground">Why Play NBA Daily Quiz?</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p className="text-lg">
              <strong className="text-card-foreground">Perfect for every fan:</strong> Whether you're a casual viewer or a stats obsessive, 
              our quizzes are designed to challenge and entertain at every level.
            </p>
            <p className="text-lg">
              <strong className="text-card-foreground">Sharpen your knowledge:</strong> Learn fascinating NBA facts and stats 
              while having fun. Each quiz is a mini history lesson wrapped in excitement.
            </p>
            <p className="text-lg">
              <strong className="text-card-foreground">Join a community:</strong> Connect with thousands of basketball fans worldwide. 
              Share your scores, compare strategies, and celebrate the game we all love.
            </p>
          </div>
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/game")}
              className="text-lg px-8 py-6 h-auto rounded-full"
            >
              Play Now
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
