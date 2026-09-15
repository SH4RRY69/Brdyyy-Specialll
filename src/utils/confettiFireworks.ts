import confetti from 'canvas-confetti';

export function triggerRealisticConfetti(colors?: string[]) {
  const defaultColors = ['#f472b6', '#fb7185', '#fbbf24', '#c084fc', '#38bdf8', '#ffffff'];
  const palette = colors && colors.length > 0 ? colors : defaultColors;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: palette,
    zIndex: 9999
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55
  });

  fire(0.2, {
    spread: 60
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}

export function triggerFireworks(durationMs = 3000) {
  const animationEnd = Date.now() + durationMs;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / durationMs);

    // Left firework
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.2 },
      colors: ['#ff6b81', '#feca57', '#ff9ff3', '#54a0ff', '#1dd1a1']
    });

    // Right firework
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.2 },
      colors: ['#f368e0', '#ff9f43', '#00d2d3', '#5f27cd', '#ff4757']
    });
  }, 250);
}

export function triggerHeartShower() {
  const scalar = 2;
  const heart = confetti.shapeFromPath({
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
  });

  confetti({
    shapes: [heart],
    scalar,
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#ff4d6d', '#ff758f', '#ff8fa3', '#c9184a', '#ffccd5'],
    zIndex: 9999
  });
}
