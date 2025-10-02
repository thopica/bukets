import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";
import { useRef, useEffect } from "react";
import { createConfetti, animateScoreFlyUp } from "@/lib/confetti";
import { haptics } from "@/lib/haptics";

interface Answer {
  rank: number;
  playerName?: string;
  isCorrect?: boolean;
  isRevealed?: boolean;
  stat?: string;
}

interface AnswerGridProps {
  answers: Answer[];
  lastGuessRank?: number;
  disabled?: boolean;
}

const AnswerGrid = ({ answers, lastGuessRank, disabled = false }: AnswerGridProps) => {
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Trigger animations when a guess is made
  useEffect(() => {
    if (lastGuessRank) {
      const answer = answers.find(a => a.rank === lastGuessRank);
      if (answer?.isCorrect && cardRefs.current[lastGuessRank]) {
        // Correct answer animations
        createConfetti(cardRefs.current[lastGuessRank]!);
        animateScoreFlyUp(cardRefs.current[lastGuessRank]!, 3);
        haptics.correct();
      } else if (answer && !answer.isCorrect) {
        // Incorrect answer animations
        haptics.incorrect();
      }
    }
  }, [lastGuessRank, answers]);

  return (
    <div className="border-2 border-white rounded-xl p-2">
      <div className="grid grid-cols-1 gap-1.5">
      {answers.map((answer) => {
        const isRevealed = !!answer.playerName;
        const isCorrect = answer.isCorrect;
        const isLastGuess = lastGuessRank === answer.rank;

        return (
          <div
            key={answer.rank}
            ref={(el) => cardRefs.current[answer.rank] = el}
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 border-2 ${
              isCorrect
                ? "bg-success/10 border-success animate-scale-pulse shadow-glow-green"
                : isLastGuess && !isCorrect && isRevealed
                ? "bg-danger/10 border-danger animate-shake-horizontal"
                : isRevealed
                ? "bg-timerWarning/10 border-timerWarning"
                : "bg-muted/30 border-border/50"
            }`}
          >
            {/* Rank badge */}
            <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm flex-shrink-0 ${
              isCorrect
                ? 'bg-success text-white' 
                : 'bg-muted text-foreground'
            }`}>
              #{answer.rank}
            </div>
            
            {/* Player name or locked state */}
            <div className="flex items-center gap-2 min-h-[28px]">
              {isRevealed ? (
                <>
                  {isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 animate-bounce-in" />
                  )}
                  <span className={`font-semibold text-sm ${
                    isCorrect ? "text-success" : "text-foreground"
                  }`}>
                    {answer.playerName}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground opacity-50" />
                  <span className="text-sm text-muted-foreground">Locked</span>
                </div>
              )}
            </div>

            {/* Stats */}
            {isRevealed && answer.stat && (
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                {answer.stat}
              </span>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default AnswerGrid;
