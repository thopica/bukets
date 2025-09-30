import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";

interface ResultAnswer {
  rank: number;
  correctName: string;
  userGuess?: string;
  isCorrect: boolean;
}

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  correctCount: number;
  totalCount: number;
  streak: number;
  answers: ResultAnswer[];
}

const ResultsModal = ({
  open,
  onOpenChange,
  score,
  correctCount,
  totalCount,
  streak,
  answers,
}: ResultsModalProps) => {
  const handleShare = () => {
    const emoji = answers.map((a) => (a.isCorrect ? "✅" : "❌")).join(" ");
    const shareText = `NBA Daily Quiz\n${correctCount}/${totalCount} • Score: ${score} • 🔥${streak} day streak\n${emoji}`;
    
    navigator.clipboard.writeText(shareText);
    toast.success("Results copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-secondary" />
            Quiz Complete!
          </DialogTitle>
          <DialogDescription>
            You scored {correctCount} out of {totalCount} correct
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{score}</p>
                <p className="text-xs text-muted-foreground">Final Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{correctCount}/{totalCount}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold">🔥{streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <h3 className="font-semibold">Answers</h3>
            {answers.map((answer) => (
              <Card
                key={answer.rank}
                className={`p-3 ${
                  answer.isCorrect ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"
                }`}
              >
                <div className="flex items-center gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">#{answer.rank}</span>
                      <span>{answer.correctName}</span>
                    </div>
                    {!answer.isCorrect && answer.userGuess && (
                      <p className="text-sm text-muted-foreground">Your guess: {answer.userGuess}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;
