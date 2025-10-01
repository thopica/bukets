import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

const GuessInput = ({ onGuess, disabled = false }: GuessInputProps) => {
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
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          size="lg"
          className="h-12 px-6 rounded-button"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default GuessInput;
