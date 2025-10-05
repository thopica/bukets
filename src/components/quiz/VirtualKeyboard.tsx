import { Button } from "@/components/ui/button";
import { Delete, Lightbulb } from "lucide-react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onHint?: () => void;
  disabled?: boolean;
  hintsRemaining?: number;
  currentValue: string;
}

const VirtualKeyboard = ({
  onKeyPress,
  onBackspace,
  onSubmit,
  onHint,
  disabled = false,
  hintsRemaining = 0,
  currentValue
}: VirtualKeyboardProps) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm pb-safe pt-4">
      {/* Input Display */}
      <div className="px-2 pb-1">
        <div className="bg-background border-2 border-border rounded-lg px-3 py-2 min-h-[40px] text-base text-foreground">
          {currentValue || <span className="text-muted-foreground">Type player name...</span>}
        </div>
      </div>

      {/* Keyboard */}
      <div className="px-1 pb-2 space-y-1">
        {/* Row 1 */}
        <div className="flex justify-center gap-1">
          {rows[0].map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              disabled={disabled}
              variant="outline"
              className="h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2"
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
              onClick={() => onKeyPress(key)}
              disabled={disabled}
              variant="outline"
              className="h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2"
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
              onClick={() => onKeyPress(key)}
              disabled={disabled}
              variant="outline"
              className="h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2"
            >
              {key}
            </Button>
          ))}
          
          <Button
            onClick={onBackspace}
            disabled={disabled}
            variant="outline"
            className="h-10 w-[calc((100%-9*4px)/10*1.5)] min-w-0 p-0 rounded-md border-2"
          >
            <Delete className="h-4 w-4" />
          </Button>
        </div>

        {/* Row 4 - Space and Submit */}
        <div className="flex justify-center gap-1">
          <Button
            onClick={() => onKeyPress(' ')}
            disabled={disabled}
            variant="outline"
            className="h-10 flex-1 text-sm font-semibold rounded-md border-2"
          >
            SPACE
          </Button>
          <Button
            onClick={onSubmit}
            disabled={disabled || !currentValue.trim()}
            className="h-10 w-24 font-bold rounded-md"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
