import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

const GuessInput = ({ onGuess, disabled = false }: GuessInputProps) => {
  const [guess, setGuess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus on mount
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim());
      setGuess("");
      // Refocus after submission
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mx-6 px-6 py-3 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" style={{ strokeWidth: '1.5px' }} />
          <Input
            ref={inputRef}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an NBA player name..."
            disabled={disabled}
            className="pl-12 h-12 text-base bg-card border-border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150"
          />
        </div>
      </form>
    </div>
  );
};

export default GuessInput;
