import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { BookOpen, Users } from "lucide-react";

const CarouselMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Choose Your Mode</h1>
          <p className="text-muted-foreground">Select how you want to practice</p>
        </div>

        <div className="w-full grid gap-6">
          {/* Single Questions Card */}
          <Card 
            className="p-8 hover:bg-card/80 transition-all cursor-pointer border-2 hover:border-primary"
            onClick={() => navigate("/carousel/single")}
          >
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">Single Questions</h2>
                <p className="text-muted-foreground">
                  Practice with 100 quick Q&A questions. Show/hide answers at your own pace.
                </p>
              </div>
            </div>
          </Card>

          {/* Player Questions Card */}
          <Card 
            className="p-8 hover:bg-card/80 transition-all cursor-pointer border-2 hover:border-primary"
            onClick={() => navigate("/carousel/player")}
          >
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">Player Questions</h2>
                <p className="text-muted-foreground">
                  Name the top 6 players in 100 different NBA stat categories with hints.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CarouselMenu;
