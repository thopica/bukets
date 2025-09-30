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
            className={`p-4 transition-all duration-150 border rounded-2xl ${
              isCorrect
                ? "bg-success/10 border-success shadow-md animate-bounce-in"
                : isFocused
                ? "bg-card border-danger ring-2 ring-danger animate-shake"
                : isLocked
                ? "bg-card border-dashed border-border shadow-sm"
                : "bg-card border-border shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Ranking badge */}
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                #{answer.rank}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {answer.playerName ? (
                  <div className="flex items-center gap-2">
                    {isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" style={{ strokeWidth: '1.5px' }} />
                    )}
                    <span className={`font-semibold text-sm truncate ${
                      isCorrect ? "text-success" : "text-card-foreground"
                    }`}>
                      {answer.playerName}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4 flex-shrink-0" style={{ strokeWidth: '1.5px' }} />
                    <span className="text-sm truncate">Rank #{answer.rank}</span>
                  </div>
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
