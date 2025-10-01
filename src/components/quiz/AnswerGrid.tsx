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
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md">
        {answers.map((answer) => {
          const isRevealed = !!answer.playerName;
          const isCorrect = answer.isCorrect;
          const isLastGuess = lastGuessRank === answer.rank;

          return (
            <Card
              key={answer.rank}
              ref={(el) => cardRefs.current[answer.rank] = el}
              className={`px-6 py-8 transition-all duration-150 rounded-card shadow-elevated relative overflow-hidden ${
                isCorrect
                  ? "bg-card border-[2px] border-success shadow-floating animate-correct-answer animate-green-glow"
                  : isLastGuess && !isCorrect && isRevealed
                  ? "bg-card border-[2px] border-danger animate-shake animate-red-flash"
                  : isRevealed
                  ? "bg-card border-[2px] border-border"
                  : "bg-card border-[2px] border-border/50"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank badge */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg flex-shrink-0 ${
                  isCorrect
                    ? 'bg-gold text-background' 
                    : 'bg-muted text-foreground'
                }`}>
                  #{answer.rank}
                </div>
                
                {/* Player name or locked state */}
                <div className="flex items-center gap-3 flex-1 min-h-[48px]">
                  {isRevealed ? (
                    <>
                      {isCorrect && (
                        <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 animate-bounce-in" style={{ strokeWidth: '1.5px' }} />
                      )}
                      <span className={`font-semibold text-lg ${
                        isCorrect ? "text-success" : "text-foreground"
                      }`}>
                        {answer.playerName}
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Lock className="h-6 w-6 text-muted-foreground opacity-50" />
                      <span className="text-base text-muted-foreground">Not revealed</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerGrid;
