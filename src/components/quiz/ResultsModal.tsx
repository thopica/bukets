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
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card rounded-2xl border-0 shadow-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-3xl font-bold text-card-foreground">
            <Trophy className="h-7 w-7 text-primary" style={{ strokeWidth: '1.5px' }} />
            Quiz complete!
          </DialogTitle>
          <DialogDescription className="text-[15px] text-muted-foreground">
            You scored {correctCount} out of {totalCount} correct
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Stats card */}
          <Card className="p-6 bg-card-muted border-0 rounded-2xl shadow-sm">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-card-foreground mb-1">{score}</p>
                <p className="text-[15px] text-muted-foreground">Final score</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground mb-1">{correctCount}/{totalCount}</p>
                <p className="text-[15px] text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground mb-1">🔥{streak}</p>
                <p className="text-[15px] text-muted-foreground">Day streak</p>
              </div>
            </div>
          </Card>

          {/* Answers section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base text-card-foreground">Answers</h3>
            {answers.map((answer) => (
              <Card
                key={answer.rank}
                className={`p-4 border-[2px] rounded-2xl shadow-sm ${
                  answer.isCorrect 
                    ? "bg-gold/5 border-gold" 
                    : "bg-danger/5 border-danger"
                }`}
              >
                <div className="flex items-center gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" style={{ strokeWidth: '1.5px' }} />
                  ) : (
                    <XCircle className="h-5 w-5 text-danger flex-shrink-0" style={{ strokeWidth: '1.5px' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[15px] text-card-foreground">#{answer.rank}</span>
                      <span className="font-semibold text-[15px] text-card-foreground">{answer.correctName}</span>
                    </div>
                    {!answer.isCorrect && answer.userGuess && (
                      <p className="text-sm text-muted-foreground mt-1">Your guess: {answer.userGuess}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={handleShare} 
              className="flex-1 h-12 rounded-full border-secondary bg-card hover:bg-card-muted text-card-foreground font-semibold focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Share2 className="mr-2 h-5 w-5" style={{ strokeWidth: '1.5px' }} />
              Share results
            </Button>
            <Button 
              onClick={() => onOpenChange(false)} 
              className="flex-1 h-12 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;
