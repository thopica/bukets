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
        <Alert className="bg-warning/10 border-warning animate-slide-up">
          <Lightbulb className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-start justify-between gap-2">
            <span className="flex-1">{currentHint}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1"
              onClick={onDismissHint}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Button
        variant="outline"
        onClick={onRequestHint}
        disabled={hintsRemaining === 0 || !!currentHint}
        className="w-full"
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        Need a Hint? ({hintsRemaining} remaining)
      </Button>
    </div>
  );
};

export default HintBar;
