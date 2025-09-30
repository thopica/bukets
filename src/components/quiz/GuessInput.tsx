import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

const GuessInput = ({ onGuess, disabled = false }: GuessInputProps) => {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim());
      setGuess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type an NBA player name..."
          disabled={disabled}
          className="pl-9 h-10 text-sm"
        />
      </div>
      <Button type="submit" disabled={disabled || !guess.trim()} className="h-10 px-6">
        Submit
      </Button>
    </form>
  );
};

export default GuessInput;
