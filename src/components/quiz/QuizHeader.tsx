import { TrendingUp } from "lucide-react";
import { useEffect } from "react";
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
  onSubmit?: () => void;
  isDisabled?: boolean;
  correctCount?: number;
  totalCount?: number;
}

const QuizHeader = ({
  title,
  timeRemaining,
  totalTime,
  score,
  correctCount = 0,
  totalCount = 6,
}: QuizHeaderProps) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const isUrgent = timeRemaining < 30;

  // Haptic feedback for time warnings
  useEffect(() => {
    if (timeRemaining === 30 || timeRemaining === 10) {
      haptics.warning();
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate stroke dasharray for circular progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-3">
      {/* Top Bar: Score + Timer */}
      <div className="flex items-center justify-between">
        {/* Running Score - Left */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-lg font-bold text-foreground animate-score-bounce">
            {score} pts
          </span>
        </div>

        {/* Circular Timer - Right */}
        <div className="relative w-20 h-20">
          <svg className="transform -rotate-90 w-20 h-20">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-300 ${
                percentage < 10
                  ? "text-danger"
                  : percentage < 30
                  ? "text-timerWarning"
                  : "text-success"
              }`}
              strokeLinecap="round"
            />
          </svg>
          {/* Timer text */}
          <div className={`absolute inset-0 flex items-center justify-center ${isUrgent ? 'animate-pulse' : ''}`}>
            <span className="text-base font-bold text-foreground">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Category + Question */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {title}
        </p>
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          Name the top {totalCount} scorers in NBA history
        </h1>
      </div>

      {/* Progress Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
        <span className="text-sm font-semibold text-foreground">
          {correctCount}/{totalCount} answered
        </span>
      </div>
    </div>
  );
};

export default QuizHeader;
