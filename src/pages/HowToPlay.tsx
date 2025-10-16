import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Lightbulb, Timer, Flame, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowToPlay = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Daily Challenge",
      description: "One quiz per day unlocks at midnight in your local timezone. Each quiz asks you to identify the top 6 players for a specific NBA statistic.",
    },
    {
      icon: <Trophy className="h-8 w-8 text-gold" />,
      title: "Scoring System",
      description: "Earn points for each correct answer. Speed matters: answer within 10 seconds for +5 points (golden), 10-15 seconds for +4 points (orange), or 15+ seconds for +3 points (green).",
    },
    {
      icon: <Timer className="h-8 w-8 text-orange" />,
      title: "Time Pressure",
      description: "You’ve got 90 seconds on the clock. Six answers, one ticking timer. Move fast, trust your gut, and lock in as many as you can before it hits zero.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-gold" />,
      title: "Hints Available",
      description: "Stuck? Use up to 2 hints per player (12 total). Each hint costs -1 point but gives you valuable clues about the player's career, team, or achievements.",
    },
    {
      icon: <Flame className="h-8 w-8 text-orange" />,
      title: "Build Your Streak",
      description: "Complete quizzes on consecutive days to build your streak. Get all 6 correct (hints allowed) to maintain your streak. Missing a day breaks it!",
    },
    
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="section-gap">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">How to Play</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-padding interactive-hover">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="card-padding bg-gradient-to-r from-primary/10 to-secondary/10 border-2">
            <h2 className="text-2xl font-bold mb-4">Scoring Breakdown</h2>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:flex md:justify-between items-center py-1">
                <span>Fast answer (0-10 seconds)</span>
                <span className="font-bold text-gold-bright md:text-right">+5 points (golden)</span>
              </div>
              <div className="grid grid-cols-1 md:flex md:justify-between items-center py-1">
                <span>Quick answer (10-15 seconds)</span>
                <span className="font-bold text-orange md:text-right">+4 points (orange)</span>
              </div>
              <div className="grid grid-cols-1 md:flex md:justify-between items-center py-1">
                <span>Standard answer (15+ seconds)</span>
                <span className="font-bold text-success md:text-right">+3 points (green)</span>
              </div>
              <div className="grid grid-cols-1 md:flex md:justify-between items-center py-1">
                <span>Hint used</span>
                <span className="font-bold text-destructive md:text-right">-1 point</span>
              </div>
              <div className="grid grid-cols-1 md:flex md:justify-between items-center border-t pt-4 mt-4">
                <span className="font-bold">Maximum possible score</span>
                <span className="font-bold text-primary md:text-right">30 points</span>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Ready to test your knowledge?</p>
            <Button
              onClick={() => navigate('/game')}
              size="lg"
              className="h-11 px-8"
            >
              Play Today's Quiz
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowToPlay;
