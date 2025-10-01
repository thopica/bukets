import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flame } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_LEADERBOARD = [
  { rank: 1, name: "Jordan_23", score: 142, streak: 15, country: "🇺🇸" },
  { rank: 2, name: "Lakers_Fan", score: 138, streak: 12, country: "🇺🇸" },
  { rank: 3, name: "BasketballPro", score: 135, streak: 10, country: "🇨🇦" },
  { rank: 4, name: "KobeLegacy", score: 130, streak: 8, country: "🇺🇸" },
  { rank: 5, name: "DunkMaster", score: 125, streak: 7, country: "🇪🇸" },
  { rank: 6, name: "ThreePointKing", score: 120, streak: 6, country: "🇫🇷" },
  { rank: 7, name: "AlleyOop", score: 115, streak: 5, country: "🇩🇪" },
  { rank: 8, name: "FastBreak", score: 110, streak: 4, country: "🇬🇧" },
  { rank: 9, name: "PickAndRoll", score: 105, streak: 3, country: "🇮🇹" },
  { rank: 10, name: "ClutchPlayer", score: 100, streak: 2, country: "🇦🇺" },
];

// Simulated current user rank (for demo)
const CURRENT_USER_RANK = 7;

type TabValue = "today" | "7d" | "30d" | "82d" | "alltime";

const tabs: { value: TabValue; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "82d", label: "82D" },
  { value: "alltime", label: "All-Time" },
];

const LeaderboardTable = ({ 
  data, 
  userRank 
}: { 
  data: typeof DUMMY_LEADERBOARD;
  userRank?: number;
}) => {
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="space-y-0">
      {/* Top 3 - Larger Cards */}
      {data.slice(0, 3).map((player) => {
        const isCurrentUser = player.rank === userRank;
        const medal = getMedalIcon(player.rank);
        
        return (
          <div
            key={player.rank}
            className={`px-4 py-5 transition-all ${
              player.rank === 1
                ? "bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border-b-2 border-gold/30"
                : player.rank <= 3
                ? "bg-muted/30 border-b-2 border-border/50"
                : ""
            } ${isCurrentUser ? "bg-orange/10 border-l-4 border-l-orange" : ""}`}
          >
            <div className="flex items-center gap-4">
              {/* Rank/Medal */}
              <div className="flex items-center justify-center w-12 h-12">
                {player.rank === 1 ? (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">{medal}</span>
                    <Trophy className="h-4 w-4 text-gold -mt-1" />
                  </div>
                ) : (
                  <span className="text-3xl">{medal}</span>
                )}
              </div>

              {/* Flag + Username */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{player.country}</span>
                <div>
                  <span className="font-bold text-lg text-foreground block">
                    {player.name}
                  </span>
                  {isCurrentUser && (
                    <span className="text-xs text-orange font-semibold">You</span>
                  )}
                </div>
              </div>

              {/* Score + Streak */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-xl text-foreground">{player.score}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-5 w-5 text-orange" />
                  <span className="font-bold text-lg text-foreground">{player.streak}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Rest of the list */}
      {data.slice(3).map((player) => {
        const isCurrentUser = player.rank === userRank;
        
        return (
          <div
            key={player.rank}
            className={`px-4 py-4 border-b border-border/30 transition-all hover:bg-muted/20 ${
              isCurrentUser ? "bg-orange/10 border-l-4 border-l-orange sticky top-0 z-10" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                <span className="text-muted-foreground font-semibold text-base">
                  #{player.rank}
                </span>
              </div>

              {/* Flag + Username */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xl">{player.country}</span>
                <div>
                  <span className="font-semibold text-base text-foreground block">
                    {player.name}
                  </span>
                  {isCurrentUser && (
                    <span className="text-xs text-orange font-semibold">You</span>
                  )}
                </div>
              </div>

              {/* Score + Streak */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground">{player.score}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange" />
                  <span className="font-semibold text-base text-foreground">{player.streak}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-12 text-center bg-muted/30 border-2 border-dashed border-border">
      <div className="space-y-4">
        <div className="text-6xl">🏀</div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            No Rankings Yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complete today's quiz to see your ranking and compete with other players
          </p>
        </div>
        <Button 
          size="lg"
          onClick={() => navigate("/game")}
          className="h-14 px-8 rounded-xl font-bold text-base mt-4"
        >
          Start Today's Quiz
        </Button>
      </div>
    </Card>
  );
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("today");
  const hasPlayed = true; // Set to false to show empty state

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4 py-6 flex-1">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground text-sm">
              Compete with NBA quiz enthusiasts worldwide
            </p>
          </div>

          {/* iOS-style Segmented Control */}
          <div className="bg-muted/50 p-1 rounded-xl border-2 border-border inline-flex w-full max-w-2xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.value
                    ? "bg-background text-foreground shadow-sm border-2 border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <Card className="overflow-hidden border-2 border-border bg-background rounded-xl">
            {hasPlayed ? (
              <LeaderboardTable data={DUMMY_LEADERBOARD} userRank={CURRENT_USER_RANK} />
            ) : (
              <div className="p-6">
                <EmptyState />
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
