import { Card } from "@/components/ui/card";
import { Trophy, Calendar, Clock, Flame, Lightbulb, Timer } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  description: string;
  date: string;
  timeRemaining: number;
  totalTime: number;
  score: number;
  streak: number;
  hintsUsed: number;
  maxHints: number;
  playerTimeRemaining: number;
}

const QuizHeader = ({ 
  title, 
  description, 
  date,
  timeRemaining,
  totalTime,
  score,
  streak,
  hintsUsed,
  maxHints,
  playerTimeRemaining
}: QuizHeaderProps) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progressPercentage = (timeRemaining / totalTime) * 100;
  
  const getTimerColor = () => {
    if (progressPercentage > 50) return "text-success";
    if (progressPercentage > 25) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-3 bg-white shadow-xl border-0 rounded-2xl">
      {/* Quiz Title Section */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Trophy className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{title}</h2>
            <h1 className="text-xs text-muted-foreground truncate">{description}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <Calendar className="h-3 w-3" />
          <span>{date}</span>
        </div>
      </div>

      {/* Overall Timer Section */}
      <div className="mb-3 p-2 bg-muted/30 rounded-xl">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Clock className={`h-4 w-4 ${getTimerColor()}`} />
            <span className="text-xs font-medium text-muted-foreground">Total Time</span>
          </div>
          <div className={`text-xl font-bold tabular-nums ${getTimerColor()}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className={`h-full transition-all duration-300 ${
              progressPercentage > 50 ? 'bg-success' :
              progressPercentage > 25 ? 'bg-warning' :
              'bg-destructive'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {timeRemaining <= 30 && (
          <p className="text-[10px] text-destructive mt-1 text-center animate-pulse font-semibold">
            Hurry up! Time is running out!
          </p>
        )}
      </div>

      {/* Score Strip Section */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-secondary" />
          <div>
            <p className="text-[10px] text-muted-foreground">Score</p>
            <p className="text-base font-bold text-foreground">{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-secondary" />
          <div>
            <p className="text-[10px] text-muted-foreground">Streak</p>
            <p className="text-base font-bold text-foreground">{streak}d</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Lightbulb className="h-4 w-4 text-warning" />
          <div>
            <p className="text-[10px] text-muted-foreground">Hints</p>
            <p className="text-base font-bold text-foreground">
              {maxHints - hintsUsed}/{maxHints}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4 text-primary" />
          <div>
            <p className="text-[10px] text-muted-foreground">Time</p>
            <p className="text-base font-bold text-foreground">{playerTimeRemaining}s</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuizHeader;
