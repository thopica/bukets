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
    <Card className="p-4 bg-card shadow-elevated border-[2px] border-border rounded-card">
      <div className="space-y-2">
        {answers.map((answer) => {
          const isRevealed = !!answer.playerName;
          const isCorrect = answer.isCorrect;
          const isLastGuess = lastGuessRank === answer.rank;

          return (
            <div
              key={answer.rank}
              ref={(el) => cardRefs.current[answer.rank] = el}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
                isCorrect
                  ? "bg-success/10 border-2 border-success animate-correct-answer animate-green-glow"
                  : isLastGuess && !isCorrect && isRevealed
                  ? "bg-danger/10 border-2 border-danger animate-shake animate-red-flash"
                  : isRevealed
                  ? "bg-muted/50 border-2 border-border"
                  : "bg-muted/30 border-2 border-border/50"
              }`}
            >
              {/* Rank badge */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 ${
                isCorrect
                  ? 'bg-gold text-background' 
                  : 'bg-background text-foreground'
              }`}>
                {answer.rank}
              </div>
              
              {/* Player name or locked state */}
              <div className="flex items-center gap-2 flex-1 min-h-[32px]">
                {isRevealed ? (
                  <>
                    {isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 animate-bounce-in" />
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
                    <span className="text-xs text-muted-foreground">Not revealed</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AnswerGrid;
