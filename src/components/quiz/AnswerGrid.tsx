import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock } from "lucide-react";

interface Answer {
  rank: number;
  playerName?: string;
  isCorrect?: boolean;
  isRevealed?: boolean;
}

interface AnswerGridProps {
  answers: Answer[];
  focusedSlot?: number;
}

const AnswerGrid = ({ answers, focusedSlot }: AnswerGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {answers.map((answer) => {
        const isLocked = !answer.playerName;
        const isFocused = focusedSlot === answer.rank;
        const isCorrect = answer.isCorrect;

        return (
          <Card
            key={answer.rank}
            className={`p-5 transition-all duration-150 rounded-2xl ${
              isCorrect
                ? "bg-card border-[2px] border-success shadow-md animate-bounce-in"
                : isFocused
                ? "bg-card border-[2px] border-danger shadow-sm animate-shake"
                : isLocked
                ? "bg-card border-[2px] border-border shadow-sm"
                : "bg-card border-[2px] border-border shadow-sm"
            } ${!isLocked && !isCorrect && !isFocused ? 'hover:ring-2 hover:ring-purple' : ''}`}
          >
            <div className="flex items-center gap-3">
              {/* Left badge for rank */}
              <div className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-badge-lavender text-badge-text font-bold text-sm">
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
                  <>
                    <Lock className="h-5 w-5 flex-shrink-0 text-icon-muted" style={{ strokeWidth: '1.5px' }} />
                    <span className="text-[15px] text-text-secondary truncate">Rank #{answer.rank}</span>
                  </>
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
