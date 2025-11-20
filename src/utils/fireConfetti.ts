import confetti from 'canvas-confetti';

const defaultConfig = {
  particleCount: 5,
  spread: 120,
  colors: ['#FDCE4E', '#E9475A', '#21B7EB'],
  // The overlay in some content creation has 4000 z-index
  zIndex: 4001,
};

/**
 * Util that triggers a confetti animation, respecting user's reduced motion preferences.
 * @param options Optional override settings for confetti appearance and behavior.
 */
export const fireConfetti = (options: confetti.Options = {}) => {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;

  const config: confetti.Options = { ...defaultConfig, ...options };

  const end = Date.now() + 500;

  (function frame() {
    confetti({
      ...config,
      origin: { x: 0 },
      angle: 60,
    });
    confetti({
      ...config,
      origin: { x: 1 },
      angle: 120,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};
