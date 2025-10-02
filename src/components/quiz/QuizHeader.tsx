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
    <div className="rounded-lg md:rounded-xl p-1.5 md:p-3 space-y-1.5 md:space-y-4 relative">
      {/* Progress Pill - Top Right Corner - Desktop only */}
      <div className="hidden md:block absolute top-1.5 right-1.5 md:top-3 md:right-3">
        <div className="inline-flex items-center gap-1 md:gap-2 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full bg-muted">
          <span className="text-[10px] md:text-sm font-semibold text-foreground">
            {correctCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Mobile Layout: Title left, Shot Clock right */}
      <div className="md:hidden flex items-start justify-between gap-1.5">
        {/* Category + Question */}
        <div className="space-y-0.5 text-left flex-1">
          <p className="text-xs font-bold text-foreground leading-tight capitalize">
            {title}
          </p>
          <h1 className="text-xs font-bold text-foreground leading-tight">
            Name the top {totalCount} scorers in NBA history
          </h1>
        </div>

        {/* Shot Clock - Right side on mobile */}
        {showTimers && (
          <div className="relative w-9 h-9 md:w-16 md:h-16 bg-black rounded-sm border-2 md:border-4 border-gray-400 shadow-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
              backgroundSize: '4px 4px'
            }}
          >
            <div className="absolute inset-0.5 md:inset-1 border border-gray-700 rounded-sm pointer-events-none"></div>
            <div 
              className={`font-shot-clock text-xl md:text-4xl font-normal tracking-[0.1em] leading-none ml-0.5 ${
                isPlayerUrgent ? "text-red-500 animate-pulse" : "text-red-500"
              }`}
              style={{
                textShadow: '0 0 10px rgba(239, 68, 68, 0.9), 0 0 20px rgba(239, 68, 68, 0.7), 0 0 30px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)'
              }}
            >
              {playerTimeRemaining}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout: Centered Shot Clock and Title */}
      <div className="hidden md:block space-y-4">
        {/* Shot Clock - Center */}
        <div className="flex items-center justify-center">
          {showTimers && (
            <div className="relative w-16 h-16 bg-black rounded-sm border-4 border-gray-400 shadow-2xl flex items-center justify-center"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                backgroundSize: '4px 4px'
              }}
            >
              <div className="absolute inset-1 border border-gray-700 rounded-sm pointer-events-none"></div>
              <div 
                className={`font-shot-clock text-4xl font-normal tracking-[0.1em] leading-none ml-0.5 ${
                  isPlayerUrgent ? "text-red-500 animate-pulse" : "text-red-500"
                }`}
                style={{
                  textShadow: '0 0 10px rgba(239, 68, 68, 0.9), 0 0 20px rgba(239, 68, 68, 0.7), 0 0 30px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)'
                }}
              >
                {playerTimeRemaining}
              </div>
            </div>
          )}
        </div>

        {/* Category + Question */}
        <div className="space-y-1 text-center">
          <p className="text-2xl font-bold text-foreground leading-tight capitalize">
            {title}
          </p>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Name the top {totalCount} scorers in NBA history
          </h1>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;
