import { TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { haptics } from "@/lib/haptics";

interface QuizHeaderProps {
  title: string;
  description: string;
  date: string;
  timeRemaining: number;
  totalTime: number;
  playerTimeRemaining: number;
  playerTotalTime: number;
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
  playerTimeRemaining,
  playerTotalTime,
  score,
  correctCount = 0,
  totalCount = 6,
}: QuizHeaderProps) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const playerPercentage = (playerTimeRemaining / playerTotalTime) * 100;
  const isOverallUrgent = timeRemaining < 30;
  const isPlayerUrgent = playerTimeRemaining < 10;

  // Haptic feedback for time warnings
  useEffect(() => {
    if (timeRemaining === 30 || timeRemaining === 10) {
      haptics.warning();
    }
    if (playerTimeRemaining === 5) {
      haptics.warning();
    }
  }, [timeRemaining, playerTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const showTimers = totalTime > 0;

  return (
    <div className="border-2 border-white rounded-xl p-3 space-y-2">
      {/* Top Bar: Score + Timers */}
      <div className="flex items-center justify-between">
        {/* Running Score - Left */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-lg font-bold text-foreground animate-score-bounce">
            {score} pts
          </span>
        </div>

        {/* Timers - Right (only show when totalTime > 0) */}
        {showTimers && (
          <div className="flex flex-col items-end gap-1.5">
            {/* Overall Quiz Timer - Slightly Longer */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Total</span>
              <div className="w-16 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverallUrgent ? "bg-destructive" : "bg-blue-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span
                className={`text-xs font-bold tabular-nums ${
                  isOverallUrgent ? "text-destructive" : "text-foreground"
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Per-Player Timer - Shorter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Player</span>
              <div className="w-12 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isPlayerUrgent ? "bg-destructive" : "bg-orange-500"
                  }`}
                  style={{ width: `${playerPercentage}%` }}
                />
              </div>
              <span
                className={`text-xs font-bold tabular-nums ${
                  isPlayerUrgent ? "text-destructive" : "text-foreground"
                }`}
              >
                {playerTimeRemaining}s
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Category + Question */}
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground leading-tight">
          {title}
        </p>
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          Name the top {totalCount} scorers in NBA history
        </h1>
      </div>

      {/* Progress Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
        <span className="text-sm font-semibold text-foreground">
          {correctCount}/{totalCount} answered
        </span>
      </div>
    </div>
  );
};

export default QuizHeader;
