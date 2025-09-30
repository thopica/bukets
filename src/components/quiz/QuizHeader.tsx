import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Flame, Lightbulb, Clock } from "lucide-react";

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
  onSubmit: () => void;
  isDisabled: boolean;
}

const QuizHeader = ({ 
  title, 
  description, 
  date,
  timeRemaining,
  totalTime,
  streak,
  hintsUsed,
  maxHints,
  onSubmit,
  isDisabled
}: QuizHeaderProps) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progressPercentage = (timeRemaining / totalTime) * 100;
  const timeElapsed = totalTime - timeRemaining;
  const minutesElapsed = Math.floor(timeElapsed / 60);
  const secondsElapsed = timeElapsed % 60;
  
  const getProgressColor = () => {
    if (progressPercentage > 30) return "bg-success";
    if (progressPercentage > 10) return "bg-warning";
    return "bg-danger";
  };

  const showWarning = progressPercentage <= 10;

  return (
    <Card className="p-5 bg-card shadow-md border-0 rounded-2xl">
      {/* Zone 1: Title row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-card-foreground mb-1">{title}</h2>
          <h1 className="text-2xl font-bold text-card-foreground leading-tight">{description}</h1>
        </div>
        <Button 
          onClick={onSubmit}
          disabled={isDisabled}
          className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 h-10 rounded-xl font-semibold shadow-sm transition-all duration-150"
        >
          Submit
        </Button>
      </div>

      {/* Zone 2: Meta row - stat pills */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card-muted rounded-lg">
          <Calendar className="h-5 w-5 text-muted-foreground" style={{ strokeWidth: '1.5px' }} />
          <span className="text-sm text-card-foreground">{date}</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card-muted rounded-lg">
          <Flame className="h-5 w-5 text-secondary" style={{ strokeWidth: '1.5px' }} />
          <span className="text-sm text-card-foreground font-medium">{streak} day streak</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card-muted rounded-lg">
          <Lightbulb className="h-5 w-5 text-warning" style={{ strokeWidth: '1.5px' }} />
          <span className="text-sm text-card-foreground font-medium">{maxHints - hintsUsed} hints left</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card-muted rounded-lg">
          <Clock className="h-5 w-5 text-muted-foreground" style={{ strokeWidth: '1.5px' }} />
          <span className="text-sm text-card-foreground font-medium tabular-nums">
            {minutesElapsed}:{secondsElapsed.toString().padStart(2, '0')} elapsed
          </span>
        </div>
      </div>

      {/* Zone 3: Countdown progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
          <span className={`text-sm font-bold tabular-nums ${
            progressPercentage > 30 ? 'text-success' :
            progressPercentage > 10 ? 'text-warning' :
            'text-danger'
          }`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
            {showWarning && <span className="ml-2 text-danger animate-pulse">Time running out!</span>}
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default QuizHeader;
