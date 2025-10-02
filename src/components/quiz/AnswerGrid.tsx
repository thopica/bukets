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
}

const AnswerGrid = ({ answers, lastGuessRank, disabled = false, hintsUsed = 0 }: AnswerGridProps) => {
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const startTimeRef = useRef(Date.now());

  // Reset timer when moving to a new player (when a correct answer is given)
  useEffect(() => {
    if (lastGuessRank) {
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
    if (lastGuessRank) {
      const answer = answers.find(a => a.rank === lastGuessRank);
      if (answer?.isCorrect && cardRefs.current[lastGuessRank]) {
        // Calculate time taken and points
        const timeTaken = (Date.now() - startTimeRef.current) / 1000; // in seconds
        let points = 3;
        let color = '#00D9A5'; // green
        
        if (timeTaken <= 10) {
          points = 5;
          color = '#F7B32B'; // golden
        } else if (timeTaken <= 15) {
          points = 4;
          color = '#FF6B35'; // orange
        }
        
        // Apply hint penalty (1 point per hint used)
        points = Math.max(1, points - hintsUsed);
        
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

  return (
    <div className="border-2 border-white rounded-xl p-1.5">
      <div className="grid grid-cols-1 gap-1">
      {answers.map((answer) => {
        const isRevealed = !!answer.playerName;
        const isCorrect = answer.isCorrect;
        const isLastGuess = lastGuessRank === answer.rank;

        return (
          <div
            key={answer.rank}
            ref={(el) => cardRefs.current[answer.rank] = el}
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-150 border-2 ${
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
            <div className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs flex-shrink-0 ${
              isCorrect
                ? 'bg-success text-white' 
                : 'bg-muted text-foreground'
            }`}>
              #{answer.rank}
            </div>
            
            {/* Player name or locked state */}
            <div className="flex items-center gap-1.5 min-h-[24px]">
              {isRevealed ? (
                <>
                  {isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 animate-bounce-in" />
                  )}
                  <span className={`font-semibold text-xs ${
                    isCorrect ? "text-success" : "text-foreground"
                  }`}>
                    {answer.playerName}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground opacity-50" />
                  <span className="text-xs text-muted-foreground">Locked</span>
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
