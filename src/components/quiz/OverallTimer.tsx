import { Clock } from "lucide-react";

interface OverallTimerProps {
  timeRemaining: number;
  totalTime: number;
}

const OverallTimer = ({ timeRemaining, totalTime }: OverallTimerProps) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progressPercentage = (timeRemaining / totalTime) * 100;
  
  // Color logic based on time remaining
  const getTimerColor = () => {
    if (progressPercentage > 50) return "text-success";
    if (progressPercentage > 25) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="bg-card rounded-lg border-2 border-border p-4 shadow-md animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${getTimerColor()}`} />
          <span className="text-sm font-medium text-muted-foreground">Total Time</span>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${getTimerColor()}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div 
          className={`h-full transition-all duration-300 ${
            progressPercentage > 50 ? 'bg-success' :
            progressPercentage > 25 ? 'bg-warning' :
            'bg-destructive'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {timeRemaining <= 30 && (
        <p className="text-xs text-destructive mt-2 text-center animate-pulse font-semibold">
          Hurry up! Time is running out!
        </p>
      )}
    </div>
  );
};

export default OverallTimer;
