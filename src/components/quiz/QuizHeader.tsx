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
    <div className="rounded-xl md:rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4 relative bg-primary shadow-[0_4px_12px_rgba(0,0,0,0.12)] overflow-hidden">
      {/* Progress Pill - Top Right Corner */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4">
        <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
          <span className="text-sm font-semibold text-white">
            {correctCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {/* Shot Clock - Centered */}
        {showTimers && (
          <div className="flex justify-center">
            <div className="relative w-7 h-7 bg-black rounded-sm border border-white shadow-lg flex items-center justify-center"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                backgroundSize: '3px 3px'
              }}
            >
              <div className="absolute inset-0.5 border border-white-700 rounded-sm pointer-events-none"></div>
              <div 
                className={`font-shot-clock text-lg font-normal tracking-[0.05em] leading-none ${
                  isPlayerUrgent ? "text-red-500 animate-pulse" : "text-red-500"
                }`}
                style={{
                  textShadow: '0 0 8px rgba(239, 68, 68, 0.9), 0 0 15px rgba(239, 68, 68, 0.7)'
                }}
              >
                {playerTimeRemaining}
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="text-center px-2">
          <h1 className="text-[23px] font-bold text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Desktop Layout: Centered Shot Clock and Title */}
      <div className="hidden md:block space-y-4">
        {/* Shot Clock - Center */}
        <div className="flex items-center justify-center">
          {showTimers && (
            <div className="relative w-16 h-16 bg-black rounded-sm border-4 border-white shadow-2xl flex items-center justify-center"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                backgroundSize: '4px 4px'
              }}
            >
              <div className="absolute inset-1 border border-white-700 rounded-sm pointer-events-none"></div>
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

        {/* Title */}
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;
