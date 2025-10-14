import React from 'react';

interface SegmentedProgressBarProps {
  timeRemaining: number;
  totalTime: number;
  isCompleted?: boolean;
  className?: string;
}

const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  timeRemaining,
  totalTime,
  isCompleted = false,
  className = ""
}) => {
  // Calculate progress percentage (0-100) - reversed for countdown effect
  const progressPercentage = isCompleted 
    ? 0 
    : (timeRemaining / totalTime) * 100;
  
  return (
    <div className={`relative h-2.5 rounded-full bg-white/30 border-2 border-white/40 shadow-inner overflow-hidden ${className}`}>
      {/* Progress fill - depletes from right to left using RTL direction */}
      <div 
        className={`h-full rounded-full transition-all duration-1000 ${
          timeRemaining > 60 
            ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.3)]' 
            : timeRemaining > 30 
            ? 'bg-orange shadow-[0_0_8px_rgba(255,107,53,0.4)]' 
            : 'bg-danger animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]'
        }`}
        style={{ 
          width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
          direction: 'rtl', // Right-to-left direction makes bar shrink from right
          transition: 'width 1s linear, background-color 0.3s ease-out, box-shadow 0.3s ease-out'
        }}
      />
    </div>
  );
};

export default SegmentedProgressBar;
