import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

interface Answer {
  rank: number;
  playerName?: string;
  isCorrect?: boolean;
  isRevealed?: boolean;
}

interface AnswerGridProps {
  answers: Answer[];
  focusedSlot?: number;
  onGuess: (guess: string, rank?: number) => void;
  disabled?: boolean;
}

const AnswerGrid = ({ answers, focusedSlot, onGuess, disabled = false }: AnswerGridProps) => {
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});
  const [timers, setTimers] = useState<{ [key: number]: number }>({});
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const timerIntervals = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    // Focus first unanswered slot and start its timer
    const firstUnanswered = answers.find(a => !a.playerName);
    if (firstUnanswered && inputRefs.current[firstUnanswered.rank]) {
      inputRefs.current[firstUnanswered.rank]?.focus();
      // Initialize timer if not already set
      if (timers[firstUnanswered.rank] === undefined) {
        setTimers(prev => ({ ...prev, [firstUnanswered.rank]: 24 }));
      }
    }
  }, [answers]);

  // Timer countdown effect
  useEffect(() => {
    answers.forEach(answer => {
      if (!answer.playerName && timers[answer.rank] !== undefined) {
        // Clear existing interval
        if (timerIntervals.current[answer.rank]) {
          clearInterval(timerIntervals.current[answer.rank]);
        }
        
        // Start new interval
        timerIntervals.current[answer.rank] = setInterval(() => {
          setTimers(prev => {
            const currentTime = prev[answer.rank];
            if (currentTime <= 0) {
              clearInterval(timerIntervals.current[answer.rank]);
              return prev;
            }
            return { ...prev, [answer.rank]: currentTime - 0.1 };
          });
        }, 100);
      }
    });

    return () => {
      Object.values(timerIntervals.current).forEach(interval => clearInterval(interval));
    };
  }, [answers, timers]);

  const handleSubmit = (rank: number) => {
    const guess = inputs[rank]?.trim();
    if (guess) {
      onGuess(guess, rank);
      setInputs(prev => ({ ...prev, [rank]: '' }));
      // Clear timer for this slot
      if (timerIntervals.current[rank]) {
        clearInterval(timerIntervals.current[rank]);
      }
      setTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[rank];
        return newTimers;
      });
      // Focus next unanswered slot and start its timer
      const nextUnanswered = answers.find(a => !a.playerName && a.rank > rank);
      if (nextUnanswered && inputRefs.current[nextUnanswered.rank]) {
        setTimeout(() => {
          inputRefs.current[nextUnanswered.rank]?.focus();
          setTimers(prev => ({ ...prev, [nextUnanswered.rank]: 24 }));
        }, 50);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, rank: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(rank);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {answers.map((answer) => {
        const isLocked = !answer.playerName;
        const isFocused = focusedSlot === answer.rank;
        const isCorrect = answer.isCorrect;

        const timerProgress = timers[answer.rank] !== undefined ? (timers[answer.rank] / 24) * 100 : 100;
        
        // Calculate smooth color transition: green (120) -> orange (30) -> red (0)
        const getTimerColor = (timeRemaining: number) => {
          const percentage = (timeRemaining / 24) * 100;
          if (percentage > 62.5) { // > 15s: green to yellow
            const hue = 120; // green
            return `hsl(${hue}, 71%, 45%)`;
          } else if (percentage > 33.3) { // 8-15s: yellow to orange
            const hue = 120 - ((62.5 - percentage) / 29.2) * 60; // 120 to 60
            return `hsl(${hue}, 71%, 45%)`;
          } else { // < 8s: orange to red
            const hue = 60 - ((33.3 - percentage) / 33.3) * 60; // 60 to 0
            return `hsl(${hue}, 84%, 60%)`;
          }
        };

        return (
          <Card
            key={answer.rank}
            className={`px-5 py-6 transition-all duration-150 rounded-2xl relative overflow-hidden backdrop-blur-xl border ${
              isCorrect
                ? "bg-white/70 border-success/40 shadow-[0_8px_32px_rgba(34,197,94,0.15)] animate-bounce-in"
                : isFocused
                ? "bg-white/70 border-danger/40 shadow-[0_8px_32px_rgba(239,68,68,0.15)] animate-shake"
                : isLocked
                ? "bg-white/50 border-white/40 shadow-[0_4px_16px_rgba(139,92,246,0.08)]"
                : "bg-white/50 border-white/40 shadow-[0_4px_16px_rgba(139,92,246,0.08)]"
            } ${!isLocked && !isCorrect && !isFocused ? 'hover:bg-white/70 hover:shadow-[0_8px_32px_rgba(139,92,246,0.12)]' : ''}`}
          >
            <div className="flex items-center gap-3">
              {/* Left badge for rank */}
              <div className={`flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg font-bold text-sm flex-shrink-0 ${
                answer.playerName && isCorrect 
                  ? 'bg-gold text-text-primary' 
                  : 'bg-badge-lavender text-badge-text'
              }`}>
                #{answer.rank}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                {answer.playerName ? (
                  <>
                    {isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" style={{ strokeWidth: '1.5px' }} />
                    )}
                    <span className={`font-semibold text-[15px] truncate ${
                      isCorrect ? "text-text-primary" : "text-text-primary"
                    }`}>
                      {answer.playerName}
                    </span>
                  </>
                ) : (
                  <Input
                    ref={(el) => inputRefs.current[answer.rank] = el}
                    value={inputs[answer.rank] || ''}
                    onChange={(e) => setInputs(prev => ({ ...prev, [answer.rank]: e.target.value }))}
                    onKeyDown={(e) => handleKeyDown(e, answer.rank)}
                    placeholder="Player Name"
                    disabled={disabled}
                    className="h-9 text-[15px] text-text-primary bg-card-muted border border-border rounded-lg px-3 focus:ring-2 focus:ring-purple focus:border-purple transition-all duration-150 placeholder:text-text-secondary"
                  />
                )}
              </div>
            </div>
            
            {/* Timer bar at bottom */}
            {!answer.playerName && timers[answer.rank] !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
                <div 
                  className="h-full transition-all duration-100"
                  style={{ 
                    width: `${timerProgress}%`,
                    backgroundColor: getTimerColor(timers[answer.rank])
                  }}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default AnswerGrid;
