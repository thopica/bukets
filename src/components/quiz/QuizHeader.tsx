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
  const timeElapsed = totalTime - timeRemaining;
  const minutesElapsed = Math.floor(timeElapsed / 60);
  const secondsElapsed = timeElapsed % 60;
  const lastWarningTime = useRef<number>(0);
  
  // Timer urgency effects with haptic feedback
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0 && Math.floor(timeRemaining) !== lastWarningTime.current) {
      haptics.warning();
      lastWarningTime.current = Math.floor(timeRemaining);
    }
  }, [timeRemaining]);
  
  const getProgressColor = () => {
    return "bg-gold";
  };

  return (
    <Card className="p-6 bg-card shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-[2px] border-border rounded-2xl">
      {/* Title row */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <p className="text-[15px] text-text-secondary mb-2">{title}</p>
          <h1 className="text-[40px] font-bold text-text-primary leading-tight">{description}</h1>
        </div>
      </div>

      {/* Simple progress bar with urgency animations */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-text-secondary">Time remaining</span>
          <span className={`font-mono text-[15px] font-semibold tabular-nums ${
            timeRemaining <= 10 ? 'text-danger animate-pulse-urgency-fast' : 
            timeRemaining <= 30 ? 'text-timerWarning animate-pulse-urgency' : 
            'text-gold'
          }`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
          <div 
            className={`h-full transition-all duration-300 ${
              timeRemaining <= 10 ? 'bg-danger animate-pulse-urgency-fast' : 
              timeRemaining <= 30 ? 'bg-timerWarning animate-pulse-urgency' : 
              'bg-gold'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default QuizHeader;
