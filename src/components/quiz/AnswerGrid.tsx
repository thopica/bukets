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
  lastAnswerPoints?: number;
  lastAnswerTime?: number;
}

const AnswerGrid = ({ answers, lastGuessRank, disabled = false, hintsUsed = 0, currentHint, lastAnswerPoints, lastAnswerTime }: AnswerGridProps) => {
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const startTimeRef = useRef(Date.now());
  const lastProcessedGuessRef = useRef<number | undefined>();

  // Timer reset logic removed - now handled in Game.tsx

  // Trigger animations when a guess is made
  useEffect(() => {
    if (lastGuessRank && lastGuessRank !== lastProcessedGuessRef.current) {
      lastProcessedGuessRef.current = lastGuessRank;
      const answer = answers.find(a => a.rank === lastGuessRank);
      if (answer?.isCorrect && cardRefs.current[lastGuessRank]) {
        // Use the points calculated in Game.tsx to ensure consistency
        const points = lastAnswerPoints || 3; // fallback to 3 if not provided
        
        // Assign color based on final points (using design system colors)
        let color = '#22C55E'; // success-light
        if (points === 5) {
          color = '#FACC15'; // gold-bright
        } else if (points === 4) {
          color = '#22C55E'; // success-light
        } else if (points === 3) {
          color = '#FF6B35'; // orange
        } else if (points === 2) {
          color = '#D97706'; // warning-dark
        } else if (points === 1) {
          color = '#EF4444'; // danger
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
    <div className="rounded-2xl bg-primary/5 border border-primary/10 p-1.5 md:p-4">
      <div className="grid grid-cols-1 gap-1 md:gap-2">
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
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-1.5 md:gap-3 px-2.5 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 border ${
              isCorrect
                ? "bg-success border-success text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)] animate-spring-bounce"
                : isTimedOut
                ? "bg-card border-border/50 opacity-75 animate-spring-bounce"
                : isLastGuess && !isCorrect && isRevealed
                ? "bg-danger/10 border-danger animate-shake-horizontal"
                : isRevealed
                ? "bg-card border-border/50 animate-spring-bounce"
                : showHintOnThisCard
                ? "bg-card border-gold/50 animate-shimmer"
                : "bg-card border-border/50 opacity-75 animate-shimmer"
            }`}
          >
            {/* Rank badge */}
            <div className={`flex items-center justify-center w-5.5 h-5.5 md:w-9 md:h-9 rounded-full font-bold text-[12px] md:text-sm flex-shrink-0 ${
              isCorrect
                ? 'bg-white/20 text-white'
                : 'bg-muted text-foreground'
            }`}>
              #{answer.rank}
            </div>
            
            {/* Player name or locked state or hint */}
            <div className="flex items-center gap-1 md:gap-2 min-h-[22px] md:min-h-[32px]">
              {isRevealed ? (
                <>
                  {isCorrect && (
                    <CheckCircle2 className="h-3.5 w-3.5 md:h-5 md:w-5 text-white flex-shrink-0 animate-bounce-in" />
                  )}
                  <span className={`font-semibold text-[13px] md:text-base ${
                    isCorrect ? "text-white" : "text-foreground"
                  }`}>
                    {answer.playerName}
                  </span>
                </>
              ) : showHintOnThisCard ? (
                <span className="text-[13px] md:text-sm text-foreground font-medium italic animate-fade-in break-words leading-relaxed">
                  {currentHint}
                </span>
              ) : (
                <div className="flex items-center gap-1 md:gap-2">
                  <Lock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground/70" />
                  <span className="text-[13px] md:text-base text-muted-foreground">Locked</span>
                </div>
              )}
            </div>

            {/* Stats */}
            {isRevealed && answer.stat && (
              <span className={`text-[12px] md:text-sm font-medium whitespace-nowrap ${
                isCorrect ? "text-white/90" : "text-muted-foreground"
              }`}>
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
