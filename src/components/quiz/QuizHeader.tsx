import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Flame, Lightbulb, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { haptics } from "@/lib/haptics";

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
  const lastWarningTime = useRef<number>(0);
  
  // Timer urgency effects with haptic feedback
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0 && Math.floor(timeRemaining) !== lastWarningTime.current) {
      haptics.warning();
      lastWarningTime.current = Math.floor(timeRemaining);
    }
  }, [timeRemaining]);

  return (
    <div className="space-y-3">
      {/* Compact timer bar at top */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Time</span>
        <span className={`font-mono text-sm font-semibold tabular-nums ${
          timeRemaining <= 10 ? 'text-danger animate-pulse-urgency-fast' : 
          timeRemaining <= 30 ? 'text-timerWarning animate-pulse-urgency' : 
          'text-foreground'
        }`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
        <div 
          className={`h-full transition-all duration-300 ${
            timeRemaining <= 10 ? 'bg-danger' : 
            timeRemaining <= 30 ? 'bg-timerWarning' : 
            'bg-gold'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question - Scannable in 2 seconds */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight">
          {description}
        </h1>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default QuizHeader;
