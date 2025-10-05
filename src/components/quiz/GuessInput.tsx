import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Lightbulb, Shuffle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import VirtualKeyboard from "./VirtualKeyboard";
interface GuessInputProps {
  onGuess: (guess: string) => void;
  onRequestHint?: () => void;
  onShuffle?: () => void;
  disabled?: boolean;
  hintsRemaining?: number;
  currentHint?: string;
  showError?: boolean;
  showSuccess?: boolean;
  hintsUsed?: number;
  onFocusChange?: (isFocused: boolean) => void;
}
const GuessInput = ({
  onGuess,
  onRequestHint,
  onShuffle,
  disabled = false,
  hintsRemaining = 0,
  currentHint,
  showError = false,
  showSuccess = false,
  hintsUsed = 0,
  onFocusChange
}: GuessInputProps) => {
  const [input, setInput] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [showSuccessBorder, setShowSuccessBorder] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (showError) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showError]);
  useEffect(() => {
    if (showSuccess) {
      setShowSuccessBorder(true);
      const timer = setTimeout(() => setShowSuccessBorder(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
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

  const handleFocus = () => {
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    onFocusChange?.(false);
  };

  const handleKeyPress = (key: string) => {
    setInput(prev => prev + key.toLowerCase());
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  // Mobile: Virtual Keyboard
  if (isMobile && !onShuffle) {
    return (
      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        onHint={onRequestHint}
        disabled={disabled}
        hintsRemaining={hintsRemaining}
        currentValue={input}
        showError={showError}
      />
    );
  }

  // Desktop: Traditional Input
  return <div className="bg-background p-1 md:p-3 z-[1000]" style={{
    paddingBottom: `max(0.25rem, env(safe-area-inset-bottom))`
  }}>
      <div className="space-y-1 md:space-y-2 md:container md:max-w-5xl md:mx-auto">
        {/* Input Row */}
        <div className="flex gap-1 md:gap-2 items-center w-full">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} onFocus={handleFocus} onBlur={handleBlur} disabled={disabled} className={`flex-1 min-w-0 h-8 md:h-12 text-base md:text-sm text-foreground bg-card border md:border-2 rounded-md md:rounded-xl px-2 md:px-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 transition-all duration-150 placeholder:text-muted-foreground shadow-elevated ${isShaking ? 'animate-shake-horizontal border-destructive focus-visible:border-destructive focus-visible:ring-destructive' : showSuccessBorder ? 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500' : 'border-border focus-visible:border-white focus-visible:ring-white'}`} />
          {onRequestHint && <Button onClick={onRequestHint} disabled={disabled || hintsRemaining === 0} variant="outline" size="icon" className={`h-7 w-7 md:h-12 md:w-12 rounded-md md:rounded-xl shrink-0 border md:border-2 transition-all relative ${hintsRemaining === 0 ? 'border-muted-foreground/30 text-muted-foreground/30 bg-muted/20 cursor-not-allowed' : 'border-timerWarning text-timerWarning hover:bg-timerWarning/10'}`} title={hintsRemaining > 0 ? `${hintsRemaining} hints remaining` : 'No hints remaining'}>
              <div className="flex flex-col items-center justify-center gap-0">
                <Lightbulb className="h-3 w-3 md:h-5 md:w-5" />
                <span className={`text-[6px] md:text-[8px] font-bold leading-none transition-colors ${hintsRemaining === 0 ? 'text-muted-foreground/50' : 'text-timerWarning'}`}>
                  {hintsRemaining}
                </span>
              </div>
            </Button>}
          {onShuffle && <Button onClick={onShuffle} disabled={disabled} variant="outline" size="icon" className="h-7 w-7 md:h-12 md:w-12 rounded-md md:rounded-xl shrink-0 border md:border-2" title="Random quiz">
              <Shuffle className="h-3 w-3 md:h-5 md:w-5" />
            </Button>}
          <Button onClick={handleSubmit} disabled={disabled || !input.trim()} size="icon" className="h-7 w-7 md:h-12 md:w-12 rounded-md md:rounded-xl shrink-0 font-bold">
            <Send className="h-3 w-3 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
    </div>;
};
export default GuessInput;