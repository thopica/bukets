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
    <Card className="p-2 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="grid grid-cols-4 gap-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-secondary" />
          <div>
            <p className="text-[10px] text-muted-foreground">Score</p>
            <p className="text-base font-bold">{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <div>
            <p className="text-[10px] text-muted-foreground">Streak</p>
            <p className="text-base font-bold">{streak}d</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Lightbulb className="h-4 w-4 text-warning" />
          <div>
            <p className="text-[10px] text-muted-foreground">Hints</p>
            <p className="text-base font-bold">
              {maxHints - hintsUsed}/{maxHints}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4 text-primary" />
          <div>
            <p className="text-[10px] text-muted-foreground">Time</p>
            <p className="text-base font-bold">{timeRemaining}s</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScoreStrip;
