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
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    // Focus first unanswered slot
    const firstUnanswered = answers.find(a => !a.playerName);
    if (firstUnanswered && inputRefs.current[firstUnanswered.rank]) {
      inputRefs.current[firstUnanswered.rank]?.focus();
    }
  }, [answers]);

  const handleSubmit = (rank: number) => {
    const guess = inputs[rank]?.trim();
    if (guess) {
      onGuess(guess, rank);
      setInputs(prev => ({ ...prev, [rank]: '' }));
      // Focus next unanswered slot
      const nextUnanswered = answers.find(a => !a.playerName && a.rank > rank);
      if (nextUnanswered && inputRefs.current[nextUnanswered.rank]) {
        setTimeout(() => inputRefs.current[nextUnanswered.rank]?.focus(), 50);
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

        return (
          <Card
            key={answer.rank}
            className={`px-5 py-6 transition-all duration-150 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
              isCorrect
                ? "bg-card border-[2px] border-success shadow-[0_0_20px_rgba(253,185,39,0.3),0_2px_8px_rgba(0,0,0,0.08)] animate-bounce-in"
                : isFocused
                ? "bg-card border-[2px] border-danger shadow-[0_2px_12px_rgba(0,0,0,0.12)] animate-shake"
                : isLocked
                ? "bg-card border-[2px] border-border"
                : "bg-card border-[2px] border-border"
            } ${!isLocked && !isCorrect && !isFocused ? 'hover:shadow-[0_0_0_2px_#552583,0_4px_12px_rgba(0,0,0,0.1)]' : ''}`}
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
          </Card>
        );
      })}
    </div>
  );
};

export default AnswerGrid;
