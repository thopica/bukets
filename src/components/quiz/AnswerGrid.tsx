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
    <div className="grid gap-3">
      {answers.map((answer) => (
        <Card
          key={answer.rank}
          className={`p-4 transition-all duration-300 ${
            answer.isCorrect
              ? "bg-success/10 border-success animate-bounce-in"
              : "bg-card hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
              #{answer.rank}
            </div>
            
            <div className="flex-1">
              {answer.playerName ? (
                <div className="flex items-center gap-2">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={`font-semibold ${answer.isCorrect ? "text-success" : ""}`}>
                    {answer.playerName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Name the player at rank #{answer.rank}</span>
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
