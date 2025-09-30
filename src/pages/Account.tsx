import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trophy, Flame, Target, TrendingUp } from "lucide-react";

const Account = () => {
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
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=demo" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Jordan_23</h2>
                <p className="text-muted-foreground mb-4">demo@nba-quiz.com</p>
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <Trophy className="h-8 w-8 text-secondary mb-2" />
                <p className="text-3xl font-bold">142</p>
                <p className="text-sm text-muted-foreground">Total Score</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Flame className="h-8 w-8 text-orange-500 mb-2" />
                <p className="text-3xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Target className="h-8 w-8 text-primary mb-2" />
                <p className="text-3xl font-bold">42</p>
                <p className="text-sm text-muted-foreground">Quizzes Played</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="h-8 w-8 text-success mb-2" />
                <p className="text-3xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="privacy" className="text-base font-medium">
                    Anonymous Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Hide your username on public leaderboards
                  </p>
                </div>
                <Switch id="privacy" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound" className="text-base font-medium">
                    Sound Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable buzzer beater and celebration sounds
                  </p>
                </div>
                <Switch id="sound" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium">
                    Daily Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new quiz is available
                  </p>
                </div>
                <Switch id="notifications" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 text-destructive">Danger Zone</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Reset Statistics
              </Button>
              <Button variant="destructive" className="w-full">
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
