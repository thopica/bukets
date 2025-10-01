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
    return "bg-gold";
  };

  return (
    <Card className="p-6 bg-card shadow-md border-0 rounded-2xl">
      {/* Title row with Submit pill button */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <p className="text-[15px] text-text-secondary mb-2">{title}</p>
          <h1 className="text-[40px] font-bold text-text-primary leading-tight">{description}</h1>
        </div>
        <Button 
          onClick={onSubmit}
          disabled={isDisabled}
          className="bg-purple hover:bg-purple-hover text-primary-foreground px-8 h-12 rounded-full font-semibold shadow-sm transition-all duration-150 focus:ring-2 focus:ring-purple focus:ring-offset-2 hover:shadow-[0_0_20px_rgba(253,185,39,0.4)]"
        >
          Submit
        </Button>
      </div>

      {/* Stat pills on single row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-4 py-2 bg-card-muted rounded-full">
          <Calendar className="h-5 w-5 text-icon-muted" style={{ strokeWidth: '1.5px' }} />
          <span className="text-[15px] text-text-primary">{date}</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-card-muted rounded-full">
          <Flame className="h-5 w-5 text-gold" style={{ strokeWidth: '1.5px' }} />
          <span className="text-[15px] text-text-primary font-medium">{streak} day streak</span>
        </div>
      </div>

      {/* Simple progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-text-secondary">Time remaining</span>
          <span className={`text-[15px] font-semibold tabular-nums ${timeRemaining <= 10 ? 'text-danger animate-pulse' : 'text-gold'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
          <div 
            className={`h-full transition-all duration-300 ${timeRemaining <= 10 ? 'bg-danger animate-pulse' : 'bg-gold'}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default QuizHeader;
