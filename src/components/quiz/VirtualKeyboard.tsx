import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Delete, Lightbulb } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { haptics } from "@/lib/haptics";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onHint?: () => void;
  disabled?: boolean;
  hintsRemaining?: number;
  currentValue: string;
  showError?: boolean;
}

const VirtualKeyboard = ({
  onKeyPress,
  onBackspace,
  onSubmit,
  onHint,
  disabled = false,
  hintsRemaining = 0,
  currentValue,
  showError = false
}: VirtualKeyboardProps) => {
  const isMobile = useIsMobile();
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    if (showError) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  useEffect(() => {
    if (pressedKey) {
      const timer = setTimeout(() => setPressedKey(null), 150);
      return () => clearTimeout(timer);
    }
  }, [pressedKey]);

  const handleKeyPress = (key: string) => {
    setPressedKey(key);
    haptics.keyPress();
    onKeyPress(key);
  };

  const handleBackspace = () => {
    setPressedKey('BACKSPACE');
    haptics.keyPress();
    onBackspace();
  };

  const handleSubmit = () => {
    setPressedKey('SUBMIT');
    haptics.keyPress();
    onSubmit();
  };

  const handleSpace = () => {
    setPressedKey('SPACE');
    haptics.keyPress();
    onKeyPress(' ');
  };

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div 
      className={`w-full bg-card/50 backdrop-blur-sm pt-4 ${
        isMobile ? 'fixed bottom-0 left-0 right-0 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]' : ''
      }`}
      style={isMobile ? {
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
      } : undefined}
    >
      {/* Input Display */}
      <div className="px-2 pb-1">
        <div 
          onClick={() => setIsFocused(true)}
          className={`bg-background border-2 rounded-lg px-3 h-[45px] text-base text-foreground transition-all cursor-text flex items-center ${
            isShaking ? 'animate-shake-horizontal border-destructive' : 'border-primary ring-2 ring-primary/20'
          }`}
        >
          <div className="flex items-center">
            {currentValue ? (
              <>
                <span>{currentValue}</span>
                <span className="inline-block w-0.5 h-5 bg-foreground ml-0.5 animate-pulse" />
              </>
            ) : (
              <span className="inline-block w-0.5 h-5 bg-foreground animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className="px-1 pb-2 space-y-1">
        {/* Row 1 */}
        <div className="flex justify-center gap-1">
          {rows[0].map((key) => (
            <Button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              variant="outline"
              className={`h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2 transition-all duration-100 ${
                pressedKey === key ? 'scale-95 bg-orange border-orange text-white' : ''
              }`}
            >
              {key}
            </Button>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex justify-center gap-1">
          <div className="w-[calc((100%-9*4px)/20)]" />
          {rows[1].map((key) => (
            <Button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              variant="outline"
              className={`h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2 transition-all duration-100 ${
                pressedKey === key ? 'scale-95 bg-orange border-orange text-white' : ''
              }`}
            >
              {key}
            </Button>
          ))}
          <div className="w-[calc((100%-9*4px)/20)]" />
        </div>

        {/* Row 3 */}
        <div className="flex justify-center gap-1">
          {onHint && (
            <Button
              onClick={onHint}
              disabled={disabled || hintsRemaining === 0}
              variant="outline"
              className={`h-10 w-[calc((100%-9*4px)/10*1.5)] min-w-0 p-0 rounded-md border-2 transition-all ${
                hintsRemaining === 0
                  ? 'border-muted-foreground/30 text-muted-foreground/30 bg-muted/20'
                  : 'border-timerWarning text-timerWarning hover:bg-timerWarning/10'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <Lightbulb className="h-4 w-4" />
                <span className="text-xs font-bold">{hintsRemaining}</span>
              </div>
            </Button>
          )}
          
          {rows[2].map((key) => (
            <Button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              variant="outline"
              className={`h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2 transition-all duration-100 ${
                pressedKey === key ? 'scale-95 bg-orange border-orange text-white' : ''
              }`}
            >
              {key}
            </Button>
          ))}
          
          <Button
            onClick={handleBackspace}
            disabled={disabled}
            variant="outline"
            className={`h-10 w-[calc((100%-9*4px)/10*1.5)] min-w-0 p-0 rounded-md border-2 transition-all duration-100 ${
              pressedKey === 'BACKSPACE' ? 'scale-95 bg-orange border-orange text-white' : ''
            }`}
          >
            <Delete className="h-4 w-4" />
          </Button>
        </div>

        {/* Row 4 - Space and Submit */}
        <div className="flex justify-center gap-1">
          <Button
            onClick={handleSpace}
            disabled={disabled}
            variant="outline"
            className={`h-10 flex-1 text-sm font-semibold rounded-md border-2 transition-all duration-100 ${
              pressedKey === 'SPACE' ? 'scale-95 bg-orange border-orange text-white' : ''
            }`}
          >
            SPACE
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={disabled || !currentValue.trim()}
            className={`h-10 w-24 font-bold rounded-md transition-all duration-100 ${
              pressedKey === 'SUBMIT' ? 'scale-95' : ''
            }`}
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
