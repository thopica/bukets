import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";
import { useRef, useEffect, useState } from "react";
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
  hintsUsed?: number;
  currentHint?: string;
}

const AnswerGrid = ({ answers, lastGuessRank, disabled = false, hintsUsed = 0, currentHint }: AnswerGridProps) => {
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const startTimeRef = useRef(Date.now());
  const lastProcessedGuessRef = useRef<number | undefined>();

  // Reset timer when moving to a new player (when a correct answer is given)
  useEffect(() => {
    if (lastGuessRank && lastGuessRank !== lastProcessedGuessRef.current) {
      const answer = answers.find(a => a.rank === lastGuessRank);
      if (answer?.isCorrect) {
        // Reset start time for next player after a short delay
        setTimeout(() => {
          startTimeRef.current = Date.now();
        }, 800);
      }
    }
  }, [lastGuessRank, answers]);

  // Trigger animations when a guess is made
  useEffect(() => {
    if (lastGuessRank && lastGuessRank !== lastProcessedGuessRef.current) {
      lastProcessedGuessRef.current = lastGuessRank;
      const answer = answers.find(a => a.rank === lastGuessRank);
      if (answer?.isCorrect && cardRefs.current[lastGuessRank]) {
        // Calculate time taken and points
        const timeTaken = (Date.now() - startTimeRef.current) / 1000; // in seconds
        let points = 3;
        
        if (timeTaken <= 10) {
          points = 5;
        } else if (timeTaken <= 15) {
          points = 4;
        }
        
        // Apply hint penalty (1 point per hint used)
        points = Math.max(1, points - hintsUsed);
        
        // Assign color based on final points
        let color = '#00D9A5'; // default green
        if (points === 5) {
          color = '#F7B32B'; // gold
        } else if (points === 4) {
          color = '#00D9A5'; // green
        } else if (points === 3) {
          color = '#FF6B35'; // orange
        } else if (points === 2) {
          color = '#D97706'; // dark orange
        } else if (points === 1) {
          color = '#EF4444'; // red
        }
        
        // Correct answer animations
        createConfetti(cardRefs.current[lastGuessRank]!);
        animateScoreFlyUp(cardRefs.current[lastGuessRank]!, points, color);
        haptics.correct();
      } else if (answer && !answer.isCorrect) {
        // Incorrect answer animations
        haptics.incorrect();
      }
    }
  }, [lastGuessRank, answers, hintsUsed]);

  const hasRevealedCards = answers.some(a => !!a.playerName);
  const firstUnansweredIndex = answers.findIndex(a => !a.playerName);

  return (
    <div className={`rounded-lg md:rounded-xl p-0.5 md:p-2 md:border md:border-white ${
      hasRevealedCards ? 'border border-white' : ''
    }`}>
      <div className="grid grid-cols-1 gap-0.5 md:gap-1.5">
      {answers.map((answer, index) => {
        const isRevealed = !!answer.playerName;
        const isCorrect = answer.isCorrect;
        const isTimedOut = answer.isRevealed && !answer.isCorrect;
        const isLastGuess = lastGuessRank === answer.rank;
        const showHintOnThisCard = !isRevealed && currentHint && index === firstUnansweredIndex;

        return (
          <div
            key={answer.rank}
            ref={(el) => cardRefs.current[answer.rank] = el}
            className={`transition-all duration-150 ${
              showHintOnThisCard ? 'flex flex-col' : 'grid grid-cols-[auto_1fr_auto] items-center'
            } gap-1 md:gap-3 px-1 md:px-3 py-0.5 md:py-2 rounded-md md:rounded-lg border md:border-2 ${
              isCorrect
                ? "bg-success/10 border-success animate-scale-pulse shadow-glow-green"
                : isTimedOut
                ? "bg-timerWarning/5 border-timerWarning/50 opacity-60"
                : isLastGuess && !isCorrect && isRevealed
                ? "bg-danger/10 border-danger animate-shake-horizontal"
                : isRevealed
                ? "bg-timerWarning/10 border-timerWarning"
                : showHintOnThisCard
                ? "bg-gold/10 border-gold/50"
                : "bg-muted/30 border-border/50"
            }`}
          >
            {showHintOnThisCard ? (
              <>
                {/* First row: rank and locked state */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1 md:gap-3">
                  <div className={`flex items-center justify-center w-4 h-4 md:w-9 md:h-9 rounded-full font-bold text-[9px] md:text-sm flex-shrink-0 bg-muted text-foreground`}>
                    #{answer.rank}
                  </div>
                  <div className="flex items-center gap-0.5 md:gap-2">
                    <Lock className="h-2 w-2 md:h-[18px] md:w-[18px] text-muted-foreground opacity-50" />
                    <span className="text-[10px] md:text-base text-muted-foreground">Locked</span>
                  </div>
                </div>
                {/* Second row: hint text */}
                <div className="pl-5 md:pl-12 pr-1 pb-1 animate-fade-in">
                  <span className="text-[10px] md:text-sm text-gold/90 font-medium italic">
                    💡 {currentHint}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Rank badge */}
                <div className={`flex items-center justify-center w-4 h-4 md:w-9 md:h-9 rounded-full font-bold text-[9px] md:text-sm flex-shrink-0 ${
                  isCorrect
                    ? 'bg-success text-white' 
                    : 'bg-muted text-foreground'
                }`}>
                  #{answer.rank}
                </div>
                
                {/* Player name or locked state */}
                <div className="flex items-center gap-0.5 md:gap-2 min-h-[16px] md:min-h-[32px]">
                  {isRevealed ? (
                    <>
                      {isCorrect && (
                        <CheckCircle2 className="h-2.5 w-2.5 md:h-5 md:w-5 text-success flex-shrink-0 animate-bounce-in" />
                      )}
                      <span className={`font-semibold text-[10px] md:text-base ${
                        isCorrect ? "text-success" : "text-foreground"
                      }`}>
                        {answer.playerName}
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-0.5 md:gap-2">
                      <Lock className="h-2 w-2 md:h-[18px] md:w-[18px] text-muted-foreground opacity-50" />
                      <span className="text-[10px] md:text-base text-muted-foreground">Locked</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                {isRevealed && answer.stat && (
                  <span className="text-[10px] md:text-sm text-muted-foreground font-medium whitespace-nowrap">
                    {answer.stat}
                  </span>
                )}
              </>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default AnswerGrid;
