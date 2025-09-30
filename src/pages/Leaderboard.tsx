import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award } from "lucide-react";

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

const LeaderboardTable = ({ data }: { data: typeof DUMMY_LEADERBOARD }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-warning" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-600" />;
    return <span className="text-muted-foreground font-semibold">#{rank}</span>;
  };

  return (
    <div className="space-y-2">
      {data.map((player) => (
        <Card
          key={player.rank}
          className={`p-4 transition-all hover:shadow-md ${
            player.rank <= 3 ? "bg-gradient-to-r from-primary/5 to-secondary/5 border-2" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10">
              {getRankIcon(player.rank)}
            </div>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-lg">{player.country}</span>
              <span className="font-semibold">{player.name}</span>
            </div>

            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <p className="font-bold text-lg">{player.score}</p>
                <p className="text-muted-foreground text-xs">Score</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">🔥{player.streak}</p>
                <p className="text-muted-foreground text-xs">Streak</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">
              See how you rank against other NBA quiz enthusiasts
            </p>
          </div>

          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="7day">7 Days</TabsTrigger>
              <TabsTrigger value="30day">30 Days</TabsTrigger>
              <TabsTrigger value="82day">82 Days</TabsTrigger>
              <TabsTrigger value="alltime">All-Time</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-6">
              <LeaderboardTable data={DUMMY_LEADERBOARD} />
            </TabsContent>

            <TabsContent value="7day" className="mt-6">
              <LeaderboardTable data={DUMMY_LEADERBOARD} />
            </TabsContent>

            <TabsContent value="30day" className="mt-6">
              <LeaderboardTable data={DUMMY_LEADERBOARD} />
            </TabsContent>

            <TabsContent value="82day" className="mt-6">
              <LeaderboardTable data={DUMMY_LEADERBOARD} />
            </TabsContent>

            <TabsContent value="alltime" className="mt-6">
              <LeaderboardTable data={DUMMY_LEADERBOARD} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
