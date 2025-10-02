import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Share2, Trophy, TrendingUp, Clock, Lightbulb, Zap, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { haptics } from "@/lib/haptics";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

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
  timeBonus?: number;
  speedBonus?: number;
  hintsUsed?: number;
}

const ResultsModal = ({
  open,
  onOpenChange,
  score,
  correctCount,
  totalCount,
  streak,
  answers,
  timeBonus = 0,
  speedBonus = 0,
  hintsUsed = 0,
}: ResultsModalProps) => {
  const navigate = useNavigate();
  const [displayScore, setDisplayScore] = useState(0);

  // Animated score counter
  useEffect(() => {
    if (open) {
      let current = 0;
      const increment = score / 30; // 30 frames to reach target
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [open, score]);

  // Celebrate streak milestones with haptics
  useEffect(() => {
    if (open && streak > 0 && streak % 5 === 0) {
      haptics.milestone();
    }
  }, [open, streak]);

  // Performance rating based on score
  const getPerformanceRating = () => {
    const percentage = (correctCount / totalCount) * 100;
    if (percentage === 100 && score >= 18) return { label: "All-Star!", color: "text-gold", icon: "🌟" };
    if (percentage >= 80) return { label: "Starter", color: "text-success", icon: "⭐" };
    if (percentage >= 50) return { label: "Bench Player", color: "text-timerWarning", icon: "💪" };
    return { label: "Rookie", color: "text-muted-foreground", icon: "🏀" };
  };

  const performance = getPerformanceRating();

  // Calculate next streak milestone
  const nextMilestone = Math.ceil((streak + 1) / 5) * 5;
  const streakProgress = ((streak % 5) / 5) * 100;

  const handleShare = () => {
    const emoji = answers.map((a) => (a.isCorrect ? "✅" : "❌")).join("");
    const shareText = `NBA Daily Quiz 🏀
    
${correctCount}/${totalCount} correct • ${score} pts • 🔥 ${streak} day streak

${emoji}

Can you beat my score?`;
    
    navigator.clipboard.writeText(shareText);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-background rounded-2xl border-2 border-border shadow-floating animate-slide-up">
        <DialogHeader className="space-y-2">
          {/* Performance Rating */}
          <div className="text-center space-y-2">
            <div className="text-5xl">{performance.icon}</div>
            <DialogTitle className={`text-3xl font-bold ${performance.color}`}>
              {performance.label}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              You scored {correctCount} out of {totalCount} correct
            </DialogDescription>
          </div>

          {/* Large Animated Score */}
          <div className="text-center py-4">
            <div className="text-6xl font-bold text-foreground animate-count-up">
              {displayScore}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total Points</p>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Score Breakdown */}
          <Card className="p-4 bg-muted/50 border-2 border-border rounded-xl">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Score Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Correct answers
                </span>
                <span className="font-semibold text-foreground">
                  {correctCount}/{totalCount} ({correctCount * 3} pts)
                </span>
              </div>
              {timeBonus > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-timerWarning" />
                    Time bonus
                  </span>
                  <span className="font-semibold text-success">+{timeBonus} pts</span>
                </div>
              )}
              {speedBonus > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <Zap className="h-4 w-4 text-gold" />
                    Speed bonus
                  </span>
                  <span className="font-semibold text-success">+{speedBonus} pts</span>
                </div>
              )}
              {hintsUsed > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    Hints used
                  </span>
                  <span className="font-semibold text-danger">-{hintsUsed * 0.5} pts</span>
                </div>
              )}
            </div>
          </Card>

          {/* Streak Status */}
          <Card className="p-4 bg-gradient-to-br from-orange/10 to-gold/10 border-2 border-orange/30 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange" />
                <span className="font-bold text-lg text-foreground">{streak} Day Streak</span>
              </div>
              <div className="text-2xl animate-flicker">🔥</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next milestone</span>
                <span className="font-semibold text-foreground">{nextMilestone} days</span>
              </div>
              <Progress value={streakProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center mt-2">
                🎯 Come back tomorrow to keep the streak alive!
              </p>
            </div>
          </Card>

          {/* Visual Answer Review */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Answer Review
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {answers.map((answer) => (
                <div
                  key={answer.rank}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    answer.isCorrect 
                      ? "bg-success/10 border-success" 
                      : "bg-danger/10 border-danger"
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {answer.isCorrect ? "✓" : "✗"}
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    #{answer.rank}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Detailed answers (collapsible section) */}
            <div className="space-y-2 mt-4">
              {answers.map((answer) => (
                <div
                  key={answer.rank}
                  className={`p-3 rounded-lg border ${
                    answer.isCorrect 
                      ? "bg-success/5 border-success/30" 
                      : "bg-danger/5 border-danger/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground">#{answer.rank}</span>
                        <span className="font-semibold text-sm text-foreground">{answer.correctName}</span>
                      </div>
                      {!answer.isCorrect && answer.userGuess && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Your guess: {answer.userGuess}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button 
              onClick={handleShare}
              className="w-full h-12 rounded-xl font-bold text-base bg-orange hover:bg-orange-hover"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Results
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  navigate('/leaderboard');
                  onOpenChange(false);
                }}
                className="h-11 rounded-xl border-2"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Leaderboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  navigate('/archive');
                  onOpenChange(false);
                }}
                className="h-11 rounded-xl border-2"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Archive
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;
