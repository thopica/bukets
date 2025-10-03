import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type TabValue = "today" | "7d" | "30d" | "82d" | "alltime";

const tabs: { value: TabValue; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "82d", label: "82D" },
  { value: "alltime", label: "All-Time" },
];

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  CA: "🇨🇦",
  GB: "🇬🇧",
  PH: "🇵🇭",
  AU: "🇦🇺",
  MX: "🇲🇽",
  ES: "🇪🇸",
  FR: "🇫🇷",
  DE: "🇩🇪",
  CN: "🇨🇳",
  BR: "🇧🇷",
  JP: "🇯🇵",
  IT: "🇮🇹",
  NO: "🇳🇴",
  FI: "🇫🇮",
  BE: "🇧🇪",
  NL: "🇳🇱",
  SE: "🇸🇪",
  DK: "🇩🇰",
  AT: "🇦🇹",
  CH: "🇨🇭",
  HR: "🇭🇷",
  HU: "🇭🇺",
  NZ: "🇳🇿",
  GR: "🇬🇷",
  RO: "🇷🇴",
  PT: "🇵🇹",
  SI: "🇸🇮",
  BG: "🇧🇬",
  IE: "🇮🇪",
  SK: "🇸🇰",
  UA: "🇺🇦",
  PL: "🇵🇱",
  CZ: "🇨🇿",
  RS: "🇷🇸",
};

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  country_code: string;
  total_score: number;
  current_streak: number;
  is_bot: boolean;
}

const LeaderboardTable = ({ 
  data, 
  currentUserId 
}: { 
  data: LeaderboardEntry[];
  currentUserId?: string;
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
        const isCurrentUser = player.user_id === currentUserId;
        const medal = getMedalIcon(player.rank);
        const flag = COUNTRY_FLAGS[player.country_code] || "🌐";
        
        return (
          <div
            key={player.user_id}
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
                <span className="text-2xl">{flag}</span>
                <div>
                  <span className="font-bold text-lg text-foreground block">
                    {player.username}
                  </span>
                  {isCurrentUser && (
                    <span className="text-xs text-orange font-semibold">You</span>
                  )}
                </div>
              </div>

              {/* Score + Streak */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-xl text-foreground">{player.total_score}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-5 w-5 text-orange" />
                  <span className="font-bold text-lg text-foreground">{player.current_streak}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Rest of the list */}
      {data.slice(3).map((player) => {
        const isCurrentUser = player.user_id === currentUserId;
        const flag = COUNTRY_FLAGS[player.country_code] || "🌐";
        
        return (
          <div
            key={player.user_id}
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
                <span className="text-xl">{flag}</span>
                <div>
                  <span className="font-semibold text-base text-foreground block">
                    {player.username}
                  </span>
                  {isCurrentUser && (
                    <span className="text-xs text-orange font-semibold">You</span>
                  )}
                </div>
              </div>

              {/* Score + Streak */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground">{player.total_score}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange" />
                  <span className="font-semibold text-base text-foreground">{player.current_streak}</span>
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
    <div className="text-center py-12 px-6 space-y-6">
      <div className="flex justify-center">
        <Trophy className="h-20 w-20 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">No Rankings Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Complete your first daily quiz to appear on the leaderboard!
        </p>
      </div>
      <Button 
        onClick={() => navigate('/game')}
        size="lg"
        className="px-8"
      >
        Start Today's Quiz
      </Button>
    </div>
  );
};

const LeaderboardSkeleton = () => {
  return (
    <div className="space-y-0">
      {/* Top 3 skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className={`px-4 py-5 border-b-2 ${i === 1 ? 'border-gold/30' : 'border-border/50'}`}>
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        </div>
      ))}
      {/* Rest skeleton */}
      {[4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="px-4 py-4 border-b border-border/30">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-6 rounded" />
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-7 h-7 rounded" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-6 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Leaderboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabValue>((searchParams.get('period') as TabValue) || "today");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, countryFilter]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        period: activeTab,
        ...(countryFilter !== "all" && { country_code: countryFilter })
      });

      const { data, error } = await supabase.functions.invoke('get-leaderboard', {
        body: { period: activeTab, country_code: countryFilter === "all" ? null : countryFilter, limit: 100 }
      });

      if (error) throw error;

      setLeaderboardData(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: TabValue) => {
    setActiveTab(value);
    setSearchParams({ period: value });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4 py-6 flex-1">
        <div className="space-y-6">
          {/* Beta Banner */}
          <div className="bg-muted/50 border border-border rounded-lg px-4 py-2 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Beta Leaderboard</strong> - Sample scores shown for demonstration
            </p>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground text-sm">
              Compete with NBA quiz enthusiasts worldwide
            </p>
          </div>

          {/* Country Filter */}
          <div className="flex justify-center">
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="US">🇺🇸 United States</SelectItem>
                <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="PH">🇵🇭 Philippines</SelectItem>
                <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                <SelectItem value="MX">🇲🇽 Mexico</SelectItem>
                <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                <SelectItem value="FR">🇫🇷 France</SelectItem>
                <SelectItem value="DE">🇩🇪 Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* iOS-style Segmented Control */}
          <div className="bg-muted/50 p-1 rounded-xl border-2 border-border inline-flex w-full max-w-2xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
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
            {isLoading ? (
              <LeaderboardSkeleton />
            ) : leaderboardData.length > 0 ? (
              <LeaderboardTable data={leaderboardData} currentUserId={currentUserId || undefined} />
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
