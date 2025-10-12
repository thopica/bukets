import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Delete, Lightbulb, ArrowUp } from "lucide-react";
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
  const [isShiftActive, setIsShiftActive] = useState(true); // Auto-capitalize first letter
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTypedFirstChar = useRef(false); // Track if we've typed the first character
  const previousShowError = useRef(false); // Track previous error state
  
  // Key preview popup state
  const [popupKey, setPopupKey] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupVisible, setPopupVisible] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentKeyRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Trigger animation when showError changes to true OR when it's already true but was false before
    if (showError && !previousShowError.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      previousShowError.current = true;
      return () => clearTimeout(timer);
    } else if (!showError) {
      previousShowError.current = false;
    }
  }, [showError]);

  useEffect(() => {
    if (pressedKey) {
      const timer = setTimeout(() => setPressedKey(null), 150);
      return () => clearTimeout(timer);
    }
  }, [pressedKey]);

  // Auto shift management - activate shift when input is empty
  useEffect(() => {
    if (currentValue.length === 0) {
      setIsShiftActive(true);
      hasTypedFirstChar.current = false; // Reset first char tracking
    }
  }, [currentValue]);

  const showKeyPopup = (key: string, element: HTMLButtonElement) => {
    const rect = element.getBoundingClientRect();
    const popupWidth = 60;
    const popupHeight = 70;
    
    // Calculate position (centered above key)
    let x = rect.left + rect.width / 2 - popupWidth / 2;
    let y = rect.top - popupHeight - 8;
    
    // Clamp to screen bounds
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - popupWidth - padding));
    y = Math.max(padding, y);
    
    setPopupPosition({ x, y });
    setPopupKey(isShiftActive ? key.toUpperCase() : key.toLowerCase());
    setPopupVisible(true);
    currentKeyRef.current = element;
    
    // Auto-hide after 350ms
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      hideKeyPopup();
    }, 350);
  };

  const moveKeyPopup = (key: string, element: HTMLButtonElement) => {
    if (!popupVisible) return;
    
    const rect = element.getBoundingClientRect();
    const popupWidth = 60;
    const popupHeight = 70;
    
    let x = rect.left + rect.width / 2 - popupWidth / 2;
    let y = rect.top - popupHeight - 8;
    
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - popupWidth - padding));
    y = Math.max(padding, y);
    
    setPopupPosition({ x, y });
    setPopupKey(isShiftActive ? key.toUpperCase() : key.toLowerCase());
    currentKeyRef.current = element;
  };

  const hideKeyPopup = () => {
    setPopupVisible(false);
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    currentKeyRef.current = null;
  };

  // This function is no longer used - kept for reference
  // All key handling now goes through handleKeyUp

  const handleKeyDown = (key: string, event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const element = event.currentTarget;
    setPressedKey(key);
    
    // Trigger haptic instantly on touch down
    haptics.keyPress();
    
    // Show popup after 80ms hold
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    popupTimerRef.current = setTimeout(() => {
      showKeyPopup(key, element);
    }, 80);
  };

  const handleKeyUp = (key: string, event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    hideKeyPopup();
    setPressedKey(null);
    
    // Capture shift state and input state BEFORE any changes
    const shouldCapitalize = isShiftActive;
    const isFirstCharOfInput = currentValue.length === 0;
    const isStartOfWord = currentValue.endsWith(' ');
    const finalKey = shouldCapitalize ? key.toUpperCase() : key.toLowerCase();
    
    // Send the key press
    onKeyPress(finalKey);
    
    // If this was the first character OR start of a new word and shift was active, deactivate it for next key
    if (shouldCapitalize && (isFirstCharOfInput || isStartOfWord)) {
      setIsShiftActive(false);
    }
  };


  const handleBackspaceStart = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    // Clear any existing timers first
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    if (longPressIntervalRef.current) {
      clearInterval(longPressIntervalRef.current);
      longPressIntervalRef.current = null;
    }
    
    // Trigger haptic once on initial press
    setPressedKey('BACKSPACE');
    haptics.keyPress();
    onBackspace();
    setIsLongPressing(true);
    
    // Start continuous deletion after 500ms hold (no haptic on repeat)
    longPressTimeoutRef.current = setTimeout(() => {
      longPressIntervalRef.current = setInterval(() => {
        onBackspace(); // Delete without haptic feedback during repeat
      }, 50); // Delete every 50ms while holding
    }, 500);
  };

  const handleBackspaceEnd = (event?: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    
    // Immediately stop all deletion
    setIsLongPressing(false);
    setPressedKey(null);
    
    // Clear timeout (for long press trigger)
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    // Clear interval (for continuous deletion)
    if (longPressIntervalRef.current) {
      clearInterval(longPressIntervalRef.current);
      longPressIntervalRef.current = null;
    }
  };

  const handleSubmitDown = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPressedKey('SUBMIT');
    haptics.keyPress();
  };

  const handleSubmitUp = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPressedKey(null);
    onSubmit();
  };

  const handleSpaceDown = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPressedKey('SPACE');
    haptics.keyPress();
  };

  const handleSpaceUp = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPressedKey(null);
    onKeyPress(' ');
    // Activate shift after space (new word) but don't reset first char tracking
    setIsShiftActive(true);
  };

  const handleShiftToggle = () => {
    setPressedKey('SHIFT');
    haptics.keyPress();
    // Toggle shift immediately - affects both visual and next key press
    setIsShiftActive(prev => !prev);
    setTimeout(() => setPressedKey(null), 150);
  };

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <>
      {/* Key Preview Popup */}
      {popupVisible && (
        <div
          className={`fixed z-[9999] pointer-events-none transition-all ${
            popupVisible ? 'animate-scale-in opacity-100' : 'animate-fade-out opacity-0'
          }`}
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            width: '60px',
            height: '70px',
            transitionDuration: '50ms',
            transitionTimingFunction: 'ease-out'
          }}
        >
          <div className="relative w-full h-full">
            {/* Bubble tail */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-card" />
            
            {/* Bubble */}
            <div className="w-full h-full bg-card border-2 border-primary rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground" style={{ transform: 'scale(1.3)' }}>
                {popupKey}
              </span>
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-full bg-card/50 backdrop-blur-sm pt-1 ${
          isMobile ? 'fixed bottom-0 left-0 right-0 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]' : ''
        }`}
        style={isMobile ? {
          paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))'
        } : undefined}
      >
      {/* Input Display */}
      <div className="px-2 pb-0.5">
        <div 
          onClick={() => setIsFocused(true)}
          className={`bg-background border-2 rounded-lg h-[36px] text-base text-foreground transition-all cursor-text flex items-center justify-between overflow-hidden ${
            isShaking ? 'animate-shake-horizontal border-destructive' : 'border-border'
          }`}
        >
          <div className="flex items-center px-3 flex-1">
            {currentValue ? (
              <>
                <span>{currentValue}</span>
                <span className="inline-block w-0.5 h-5 bg-foreground ml-0.5 animate-pulse" />
              </>
            ) : (
              <span className="inline-block w-0.5 h-5 bg-foreground animate-pulse" />
            )}
          </div>
          
          {currentValue.trim() && (
            <Button
              onMouseDown={(e) => handleSubmitDown(e)}
              onMouseUp={(e) => handleSubmitUp(e)}
              onTouchStart={(e) => handleSubmitDown(e)}
              onTouchEnd={(e) => handleSubmitUp(e)}
              disabled={disabled}
              className={`h-full w-12 rounded-none rounded-r-[6px] bg-primary hover:bg-primary/90 border-0 transition-all duration-200 ${
                pressedKey === 'SUBMIT' ? 'scale-95' : ''
              }`}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Keyboard */}
      <div className="px-1 pb-0.5 space-y-1">
        {/* Row 1 */}
        <div className="flex justify-center gap-1">
          {rows[0].map((key) => (
            <button
              key={key}
              onMouseDown={(e) => handleKeyDown(key, e)}
              onMouseUp={(e) => handleKeyUp(key, e)}
              onMouseLeave={hideKeyPopup}
              onTouchStart={(e) => handleKeyDown(key, e)}
              onTouchEnd={(e) => handleKeyUp(key, e)}
              onTouchCancel={hideKeyPopup}
              disabled={disabled}
              className={`h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2 text-foreground ${
                pressedKey === key ? 'bg-gray-100 border-gray-400' : 'bg-transparent border-border'
              }`}
              style={{ 
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {isShiftActive ? key : key.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex justify-center gap-1">
          <div className="w-[calc((100%-9*4px)/20)]" />
          {rows[1].map((key) => (
            <button
              key={key}
              onMouseDown={(e) => handleKeyDown(key, e)}
              onMouseUp={(e) => handleKeyUp(key, e)}
              onMouseLeave={hideKeyPopup}
              onTouchStart={(e) => handleKeyDown(key, e)}
              onTouchEnd={(e) => handleKeyUp(key, e)}
              onTouchCancel={hideKeyPopup}
              disabled={disabled}
              className={`h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2 text-foreground ${
                pressedKey === key ? 'bg-gray-100 border-gray-400' : 'bg-transparent border-border'
              }`}
              style={{ 
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {isShiftActive ? key : key.toLowerCase()}
            </button>
          ))}
          <div className="w-[calc((100%-9*4px)/20)]" />
        </div>

        {/* Row 3 */}
        <div className="flex justify-center gap-1">
          <button
            onClick={handleShiftToggle}
            disabled={disabled}
            className={`h-10 w-[calc((100%-9*4px)/10*1.5)] min-w-0 p-0 rounded-md border-2 text-foreground transition-all duration-100 ${
              pressedKey === 'SHIFT' ? 'bg-gray-100 border-gray-400' : 'bg-transparent border-border'
            }`}
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <span className="text-lg">⇧</span>
          </button>
          
          {rows[2].map((key) => (
            <button
              key={key}
              onMouseDown={(e) => handleKeyDown(key, e)}
              onMouseUp={(e) => handleKeyUp(key, e)}
              onMouseLeave={hideKeyPopup}
              onTouchStart={(e) => handleKeyDown(key, e)}
              onTouchEnd={(e) => handleKeyUp(key, e)}
              onTouchCancel={hideKeyPopup}
              disabled={disabled}
              className={`h-10 w-[calc((100%-9*4px)/10)] min-w-0 p-0 text-sm font-semibold rounded-md border-2 text-foreground ${
                pressedKey === key ? 'bg-gray-100 border-gray-400' : 'bg-transparent border-border'
              }`}
              style={{ 
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {isShiftActive ? key : key.toLowerCase()}
            </button>
          ))}
          
          <button
            onMouseDown={(e) => handleBackspaceStart(e)}
            onMouseUp={(e) => handleBackspaceEnd(e)}
            onMouseLeave={(e) => handleBackspaceEnd(e)}
            onTouchStart={(e) => handleBackspaceStart(e)}
            onTouchEnd={(e) => handleBackspaceEnd(e)}
            onTouchCancel={(e) => handleBackspaceEnd(e)}
            disabled={disabled}
            className={`h-10 w-[calc((100%-9*4px)/10*1.5)] min-w-0 p-0 rounded-md border-2 text-foreground flex items-center justify-center transition-all duration-100 ${
              pressedKey === 'BACKSPACE' || isLongPressing ? 'bg-gray-100 border-gray-400' : 'bg-transparent border-border'
            }`}
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <Delete className="h-4 w-4" />
          </button>
        </div>

        {/* Row 4 - Space and Submit */}
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
          
          <button
            onMouseDown={(e) => handleSpaceDown(e)}
            onMouseUp={(e) => handleSpaceUp(e)}
            onTouchStart={(e) => handleSpaceDown(e)}
            onTouchEnd={(e) => handleSpaceUp(e)}
            disabled={disabled}
            className={`h-10 flex-1 text-sm font-semibold rounded-md border-2 text-foreground transition-all duration-100 ${
              pressedKey === 'SPACE' ? 'bg-gray-100 border-gray-400' : 'bg-transparent border-border'
            }`}
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            SPACE
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default VirtualKeyboard;
