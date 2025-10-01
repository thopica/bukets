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

  return (
    <div className="space-y-3">
      {/* Top Bar: Score + Two Timers */}
      <div className="flex items-center justify-between">
        {/* Running Score - Left */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-lg font-bold text-foreground animate-score-bounce">
            {score} pts
          </span>
        </div>

        {/* Two Compact Timers - Right */}
        <div className="flex items-center gap-3">
          {/* 24s Per-Player Timer */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-0.5">Player</span>
            <div className={`px-3 py-1.5 rounded-lg border-2 transition-all ${
              playerPercentage < 30
                ? "border-danger bg-danger/10"
                : playerPercentage < 50
                ? "border-timerWarning bg-timerWarning/10"
                : "border-success bg-success/10"
            } ${isPlayerUrgent ? 'animate-pulse' : ''}`}>
              <span className={`font-mono text-sm font-bold tabular-nums ${
                playerPercentage < 30
                  ? "text-danger"
                  : playerPercentage < 50
                  ? "text-timerWarning"
                  : "text-success"
              }`}>
                {playerTimeRemaining}s
              </span>
            </div>
          </div>

          {/* 2:40 Overall Timer */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-0.5">Total</span>
            <div className={`px-3 py-1.5 rounded-lg border-2 transition-all ${
              percentage < 10
                ? "border-danger bg-danger/10"
                : percentage < 30
                ? "border-timerWarning bg-timerWarning/10"
                : "border-border bg-muted/30"
            } ${isOverallUrgent ? 'animate-pulse' : ''}`}>
              <span className={`font-mono text-sm font-bold tabular-nums ${
                percentage < 10
                  ? "text-danger"
                  : percentage < 30
                  ? "text-timerWarning"
                  : "text-foreground"
              }`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
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
