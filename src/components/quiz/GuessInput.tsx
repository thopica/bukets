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
    <Card className="p-6 bg-card shadow-elevated border-[2px] border-border rounded-card">
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter player name..."
            disabled={disabled}
            className="h-12 text-base text-foreground bg-muted border-2 border-border rounded-input px-4 focus:ring-2 focus:ring-orange focus:border-orange transition-all duration-150 placeholder:text-muted-foreground"
            autoFocus
          />
          <Button
            onClick={onRequestHint}
            disabled={disabled || hintsRemaining === 0 || !!currentHint}
            variant="secondary"
            size="lg"
            className="h-12 px-6 rounded-button"
            title={hintsRemaining > 0 ? `${hintsRemaining} hints remaining` : 'No hints remaining'}
          >
            <Lightbulb className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            size="lg"
            className="h-12 px-6 rounded-button"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {currentHint && (
          <div className="p-3 bg-gold/10 border-2 border-gold rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Hint:</span> {currentHint}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GuessInput;
