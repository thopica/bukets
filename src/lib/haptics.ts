// Haptic feedback utilities for mobile devices
export const haptics = {
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
