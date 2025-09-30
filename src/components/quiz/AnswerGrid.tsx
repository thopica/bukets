import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useState } from "react";

interface Answer {
  rank: number;
  playerName?: string;
  isCorrect?: boolean;
  isRevealed?: boolean;
}

interface AnswerGridProps {
  answers: Answer[];
}

const AnswerGrid = ({ answers }: AnswerGridProps) => {
  return (
    <div className="grid gap-2">
      {answers.map((answer) => (
        <Card
          key={answer.rank}
          className={`p-2.5 transition-all duration-300 border-0 shadow-md rounded-2xl ${
            answer.isCorrect
              ? "bg-success/15 animate-bounce-in"
              : "bg-white hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-xs">
              #{answer.rank}
            </div>
            
            <div className="flex-1 min-w-0">
              {answer.playerName ? (
                <div className="flex items-center gap-2">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`font-semibold text-sm truncate ${answer.isCorrect ? "text-success" : "text-foreground"}`}>
                    {answer.playerName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs truncate">Name the player at rank #{answer.rank}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AnswerGrid;
