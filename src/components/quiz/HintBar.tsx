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
    <div className="space-y-3">
      {currentHint && (
        <Alert className="bg-warning/10 border-warning/30 animate-slide-up p-4 rounded-xl shadow-sm">
          <Lightbulb className="h-5 w-5 text-warning" style={{ strokeWidth: '1.5px' }} />
          <AlertDescription className="flex items-start justify-between gap-3">
            <span className="flex-1 text-sm leading-relaxed text-card-foreground">{currentHint}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-warning/20 rounded-lg"
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
        className="w-full h-10 text-sm font-medium hover:bg-muted rounded-xl transition-all duration-150"
      >
        <Lightbulb className="mr-2 h-5 w-5" style={{ strokeWidth: '1.5px' }} />
        Need a hint? ({hintsRemaining} left)
      </Button>
    </div>
  );
};

export default HintBar;
