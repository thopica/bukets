import { Card } from "@/components/ui/card";
import { Trophy, Flame, Lightbulb, Timer } from "lucide-react";

interface ScoreStripProps {
  score: number;
  streak: number;
  hintsUsed: number;
  maxHints: number;
  timeRemaining: number;
}

const ScoreStrip = ({ score, streak, hintsUsed, maxHints, timeRemaining }: ScoreStripProps) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-secondary" />
          <div>
            <p className="text-xs text-muted-foreground">Score</p>
            <p className="text-lg font-bold">{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-lg font-bold">{streak} days</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          <div>
            <p className="text-xs text-muted-foreground">Hints</p>
            <p className="text-lg font-bold">
              {maxHints - hintsUsed}/{maxHints}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="text-lg font-bold">{timeRemaining}s</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScoreStrip;
