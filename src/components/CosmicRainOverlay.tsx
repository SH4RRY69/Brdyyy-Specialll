import React, { useEffect, useRef, useState } from 'react';

const STORAGE_COSMIC_RAIN = 'birthday_cosmic_rain_v2';

export const CosmicRainOverlay: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_COSMIC_RAIN) === 'true';
    } catch {
      return false;
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleToggle = (e: CustomEvent<{ enabled: boolean }>) => {
      const val = e.detail?.enabled !== undefined ? e.detail.enabled : !enabled;
      setEnabled(val);
      try {
        localStorage.setItem(STORAGE_COSMIC_RAIN, String(val));
      } catch {}
    };

    window.addEventListener('cosmic-rain-toggle' as any, handleToggle);
    return () => {
      window.removeEventListener('cosmic-rain-toggle' as any, handleToggle);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Raindrop particles
    const dropCount = Math.min(120, Math.floor(width / 14));
    interface RainDrop {
      x: number;
      y: number;
      len: number;
      speed: number;
      opacity: number;
      color: string;
      splashRadius: number;
      splashed: boolean;
    }

    const colors = [
      'rgba(244, 114, 182, ', // pink
      'rgba(192, 132, 252, ', // purple
      'rgba(56, 189, 248, ',  // sky blue
      'rgba(251, 191, 36, ',  // golden
      'rgba(255, 255, 255, '  // pure white
    ];

    const drops: RainDrop[] = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 22 + 14,
      speed: Math.random() * 4 + 3,
      opacity: Math.random() * 0.5 + 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      splashRadius: 0,
      splashed: false
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient glowing mist
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(15, 5, 25, 0.04)');
      gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.02)');
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1.25;
      ctx.lineCap = 'round';

      drops.forEach(d => {
        // Draw raindrop streak with glowing gradient
        ctx.strokeStyle = `${d.color}${d.opacity})`;
        ctx.beginPath();
        // gentle romantic slant: 0.18 slope
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2.5, d.y + d.len);
        ctx.stroke();

        // Draw soft glowing head tip
        ctx.fillStyle = `${d.color}${d.opacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(d.x - 2.5, d.y + d.len, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        d.y += d.speed;
        d.x -= 0.65;

        // Reset if reached bottom
        if (d.y > height) {
          d.y = -d.len - 10;
          d.x = Math.random() * (width + 100);
        }
        if (d.x < -20) {
          d.x = width + 20;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
