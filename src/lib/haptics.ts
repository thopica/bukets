// Haptic feedback utilities for mobile devices
export const haptics = {
  // Key press - light, crisp tap (WhatsApp-style)
  keyPress: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Very light, 10ms tap
    }
  },
  
  // Correct answer - medium impact
  correct: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  
  // Incorrect answer - error notification (pattern)
  incorrect: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 30]);
    }
  },
  
  // Timer warning - light impact
  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  
  // Streak milestone - celebration pattern
  milestone: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50, 30, 50]);
    }
  },
};
