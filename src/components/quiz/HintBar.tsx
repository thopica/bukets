import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, X } from "lucide-react";

interface HintBarProps {
  currentHint?: string;
  hintsRemaining: number;
  onRequestHint: () => void;
  onDismissHint: () => void;
}

const HintBar = ({ currentHint, hintsRemaining, onRequestHint, onDismissHint }: HintBarProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {currentHint && (
        <Alert className="bg-gold/10 border-gold/30 animate-slide-up p-5 rounded-2xl shadow-sm w-full">
          <Lightbulb className="h-5 w-5 text-gold" style={{ strokeWidth: '1.5px' }} />
          <AlertDescription className="flex items-start justify-between gap-3">
            <span className="flex-1 text-[15px] leading-relaxed text-text-primary">{currentHint}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gold/20 rounded-full"
              onClick={onDismissHint}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Button
        variant="ghost"
        onClick={onRequestHint}
        disabled={hintsRemaining === 0 || !!currentHint}
        className="h-12 px-8 text-[15px] font-medium text-purple hover:bg-card/10 rounded-full transition-all duration-150 focus:ring-2 focus:ring-purple focus:ring-offset-2 border-2 border-gold"
      >
        <Lightbulb className="mr-2 h-5 w-5 text-gold" style={{ strokeWidth: '1.5px' }} />
        Need a hint? ({hintsRemaining} left)
      </Button>
    </div>
  );
};

export default HintBar;
