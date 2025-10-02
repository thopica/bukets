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
    <div className="border-2 border-white rounded-lg md:rounded-xl p-2 md:p-3 space-y-2 md:space-y-4">
      {/* Shot Clock - Center */}
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {/* NBA Shot Clock (only show when totalTime > 0) */}
        {showTimers && (
          <div className="relative w-10 h-10 md:w-16 md:h-16 bg-black rounded-sm border-2 md:border-4 border-gray-400 shadow-2xl flex items-center justify-center"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
              backgroundSize: '4px 4px'
            }}
          >
            {/* Inner border effect */}
            <div className="absolute inset-1 border border-gray-700 rounded-sm pointer-events-none"></div>
            
            {/* 24 Second Shot Clock - Red LED */}
            <div 
              className={`font-shot-clock text-2xl md:text-4xl font-normal tracking-[0.1em] leading-none ml-0.5 ${
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
      <div className="space-y-0.5 md:space-y-1 text-center">
        <p className="text-sm md:text-2xl font-bold text-foreground leading-tight capitalize">
          {title}
        </p>
        <h1 className="text-sm md:text-2xl font-bold text-foreground leading-tight">
          Name the top {totalCount} scorers in NBA history
        </h1>
      </div>

      {/* Progress Pill */}
      <div className="flex items-center justify-end gap-2 md:gap-4">
        <div className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-muted">
          <span className="text-xs md:text-sm font-semibold text-foreground">
            {correctCount}/{totalCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;
