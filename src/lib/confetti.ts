// Confetti particle system for correct answers
export const createConfetti = (element: HTMLElement) => {
  const colors = ['#00D9A5', '#F7B32B', '#FF6B35', '#FFFFFF'];
  const particleCount = 12;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    const rect = element.getBoundingClientRect();
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 50 + Math.random() * 50;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    particle.style.animation = 'confetti-particle 0.8s ease-out forwards';
    particle.style.setProperty('--vx', `${vx}px`);
    particle.style.setProperty('--vy', `${vy}px`);
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 800);
  }
};

// Score fly-up animation
export const animateScoreFlyUp = (element: HTMLElement, points: number) => {
  const scoreElement = document.createElement('div');
  scoreElement.textContent = `+${points}`;
  scoreElement.style.position = 'absolute';
  scoreElement.style.fontSize = '16px';
  scoreElement.style.fontWeight = '700';
  scoreElement.style.color = '#00D9A5';
  scoreElement.style.pointerEvents = 'none';
  scoreElement.style.zIndex = '1000';
  scoreElement.className = 'font-mono';
  
  const rect = element.getBoundingClientRect();
  scoreElement.style.left = `${rect.left + rect.width / 2 + 50}px`;
  scoreElement.style.top = `${rect.top + rect.height / 4}px`;
  scoreElement.style.transform = 'translateX(-50%)';
  
  scoreElement.style.animation = 'score-fly-up 0.6s ease-out forwards';
  
  document.body.appendChild(scoreElement);
  
  setTimeout(() => scoreElement.remove(), 600);
};
