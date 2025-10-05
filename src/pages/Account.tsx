import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Flame, Target, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES, getCountryByCode } from "@/utils/countries";
import { toast } from "sonner";

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setDisplayName(profileData.display_name || "");
        setCountryCode(profileData.country_code || "");
      }

      // Load stats from daily_scores and user_streaks
      const { data: scoresData } = await supabase
        .from('daily_scores')
        .select('total_score, correct_guesses')
        .eq('user_id', user.id);

      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .maybeSingle();

      // Calculate aggregate stats
      const totalScore = scoresData?.reduce((sum, s) => sum + s.total_score, 0) || 0;
      const totalGames = scoresData?.length || 0;
      const totalCorrect = scoresData?.reduce((sum, s) => sum + s.correct_guesses, 0) || 0;

      setStats({
        total_score: totalScore,
        total_games_played: totalGames,
        current_streak: streakData?.current_streak || 0,
        longest_streak: streakData?.longest_streak || 0,
        total_correct: totalCorrect,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          country_code: countryCode || null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setEditing(false);
      loadUserData();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const country = countryCode ? getCountryByCode(countryCode) : null;
  const accuracy = stats && stats.total_games_played > 0 
    ? Math.round((stats.total_score / (stats.total_games_played * 30)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Account</h1>
            <p className="text-muted-foreground">
              Manage your profile and preferences
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`} />
                  <AvatarFallback>{displayName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.flag} {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-1">
                        {displayName || "Set your name"}
                      </h2>
                      <p className="text-muted-foreground mb-2">{profile?.email}</p>
                      {country && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {country.flag} {country.name}
                        </p>
                      )}
                      <Button variant="outline" onClick={() => setEditing(true)}>
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <Trophy className="h-8 w-8 text-secondary mb-2" />
                <p className="text-3xl font-bold">{stats?.total_score || 0}</p>
                <p className="text-sm text-muted-foreground">Total Score</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Flame className="h-8 w-8 text-orange-500 mb-2" />
                <p className="text-3xl font-bold">{stats?.current_streak || 0}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Target className="h-8 w-8 text-primary mb-2" />
                <p className="text-3xl font-bold">{stats?.total_games_played || 0}</p>
                <p className="text-sm text-muted-foreground">Quizzes Played</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="h-8 w-8 text-success mb-2" />
                <p className="text-3xl font-bold">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </Card>


          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-destructive">Danger Zone</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                Sign Out
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Reset Statistics
              </Button>
              <Button variant="destructive" className="w-full" disabled>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
