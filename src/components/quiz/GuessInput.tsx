import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Lightbulb } from "lucide-react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  onRequestHint?: () => void;
  disabled?: boolean;
  hintsRemaining?: number;
  currentHint?: string;
}

const GuessInput = ({ onGuess, onRequestHint, disabled = false, hintsRemaining = 0, currentHint }: GuessInputProps) => {
  const [input, setInput] = useState("");

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
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-border p-4 shadow-floating z-50">
      <div className="container max-w-2xl mx-auto space-y-3">
        {/* Hint Overlay - Slides up */}
        {currentHint && (
          <div className="p-4 bg-timerWarning/10 border-2 border-timerWarning rounded-xl animate-slide-up shadow-elevated">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-timerWarning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground flex-1">
                <span className="font-semibold">Hint:</span> {currentHint}
              </p>
            </div>
          </div>
        )}
        
        {/* Input Row */}
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type player name..."
            disabled={disabled}
            className="h-14 text-lg text-foreground bg-card border-2 border-border rounded-xl px-5 focus:ring-2 focus:ring-orange focus:border-orange transition-all duration-150 placeholder:text-muted-foreground shadow-elevated"
            autoFocus
          />
          <Button
            onClick={onRequestHint}
            disabled={disabled || hintsRemaining === 0 || !!currentHint}
            variant="outline"
            size="lg"
            className="h-14 px-4 rounded-xl shrink-0 border-2 border-timerWarning text-timerWarning hover:bg-timerWarning/10"
            title={hintsRemaining > 0 ? `${hintsRemaining} hints remaining` : 'No hints remaining'}
          >
            <Lightbulb className="h-6 w-6" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            size="lg"
            className="h-14 px-8 rounded-xl shrink-0 font-bold text-base"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuessInput;
