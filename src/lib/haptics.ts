// Haptic feedback utilities for mobile devices
// Optimized for instant response with no latency

let lastVibration = 0;
const VIBRATION_COOLDOWN = 10; // Prevent vibration queuing

export const haptics = {
  // Key press - light, crisp tap (WhatsApp-style)
  keyPress: () => {
    const now = Date.now();
    // Prevent queuing vibrations during rapid key presses
    if (now - lastVibration < VIBRATION_COOLDOWN) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Very light, 10ms tap
      lastVibration = now;
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
