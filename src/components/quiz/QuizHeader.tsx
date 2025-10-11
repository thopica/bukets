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
    <div className="rounded-xl md:rounded-2xl p-1.5 md:p-6 space-y-1 md:space-y-4 relative bg-primary shadow-[0_4px_12px_rgba(0,0,0,0.12)] overflow-hidden">

      {/* Mobile Layout */}
      <div className="md:hidden space-y-1">
        {/* Title */}
        <div className="text-center px-0 pb-3">
          <h1 className="text-[21px] font-bold text-white leading-snug tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Desktop Layout: Title Only */}
      <div className="hidden md:block space-y-4">
        {/* Title */}
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Progress Bar Area - Absolute positioned at bottom */}
      {showTimers && (
        <div className="absolute bottom-1 left-2 right-2 flex items-center gap-2">
          {/* Player count indicator on the left */}
          <span className="text-xs font-semibold text-white">
            {correctCount}/{totalCount}
          </span>
          
          {/* Progress bar */}
          <div className="flex-1 h-2.5 rounded-full bg-white/30 border-2 border-white/40 shadow-inner overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                timeRemaining > 60 
                  ? 'bg-white' 
                  : timeRemaining > 30 
                  ? 'bg-orange' 
                  : 'bg-danger animate-pulse'
              }`}
              style={{ 
                width: `${percentage}%`,
                transition: 'width 1s ease-out, background-color 0.3s ease-out'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHeader;
