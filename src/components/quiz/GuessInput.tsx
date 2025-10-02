import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Lightbulb, Shuffle } from "lucide-react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  onRequestHint?: () => void;
  onShuffle?: () => void;
  disabled?: boolean;
  hintsRemaining?: number;
  currentHint?: string;
  showError?: boolean;
  hintsUsed?: number;
}

const GuessInput = ({ onGuess, onRequestHint, onShuffle, disabled = false, hintsRemaining = 0, currentHint, showError = false, hintsUsed = 0 }: GuessInputProps) => {
  const [input, setInput] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (showError) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleSubmit = () => {
    const guess = input.trim();
    if (guess) {
      onGuess(guess);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border p-3 shadow-floating z-50">
      <div className="container max-w-4xl mx-auto space-y-2">
        {/* Hint Overlay - Slides up */}
        {currentHint && (
          <div className="p-3 bg-timerWarning/10 border-2 border-timerWarning rounded-xl animate-slide-up shadow-elevated">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-timerWarning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground flex-1">
                <span className="font-semibold">{hintsUsed === 1 ? "First Hint" : "Second Hint"}:</span> {currentHint}
              </p>
            </div>
          </div>
        )}
        
        {/* Input Row */}
        <div className="flex gap-2 items-center w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type player name..."
            disabled={disabled}
            className={`flex-1 min-w-0 h-12 text-sm text-foreground bg-card border-2 rounded-xl px-4 focus:ring-2 focus:ring-orange transition-all duration-150 placeholder:text-muted-foreground shadow-elevated ${
              isShaking 
                ? 'animate-shake-horizontal border-destructive focus:border-destructive' 
                : 'border-border focus:border-orange'
            }`}
            autoFocus
          />
          {onRequestHint && (
            <Button
              onClick={onRequestHint}
              disabled={disabled || hintsRemaining === 0}
              variant="outline"
              size="icon"
              className={`h-12 w-12 rounded-xl shrink-0 border-2 transition-all relative ${
                hintsRemaining === 0 
                  ? 'border-muted-foreground/30 text-muted-foreground/30 bg-muted/20 cursor-not-allowed' 
                  : 'border-timerWarning text-timerWarning hover:bg-timerWarning/10'
              }`}
              title={hintsRemaining > 0 ? `${hintsRemaining} hints remaining` : 'No hints remaining'}
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <Lightbulb className="h-5 w-5" />
                <span className={`text-[8px] font-bold leading-none transition-colors ${
                  hintsRemaining === 0 ? 'text-muted-foreground/50' : 'text-timerWarning'
                }`}>
                  {hintsRemaining}
                </span>
              </div>
            </Button>
          )}
          {onShuffle && (
            <Button
              onClick={onShuffle}
              disabled={disabled}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl shrink-0 border-2"
              title="Random quiz"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            size="icon"
            className="h-12 w-12 rounded-xl shrink-0 font-bold"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuessInput;
