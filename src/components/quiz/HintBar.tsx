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
    <div className="space-y-2">
      {currentHint && (
        <Alert className="bg-warning/10 border-warning animate-slide-up p-2.5 rounded-2xl border-0 shadow-md">
          <Lightbulb className="h-3.5 w-3.5 text-warning" />
          <AlertDescription className="flex items-start justify-between gap-2">
            <span className="flex-1 text-xs leading-snug text-foreground">{currentHint}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 -mt-0.5"
              onClick={onDismissHint}
            >
              <X className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Button
        variant="outline"
        onClick={onRequestHint}
        disabled={hintsRemaining === 0 || !!currentHint}
        className="w-full h-9 text-xs bg-white hover:bg-muted border-0 shadow-md rounded-2xl"
        size="sm"
      >
        <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
        Need a Hint? ({hintsRemaining} left)
      </Button>
    </div>
  );
};

export default HintBar;
