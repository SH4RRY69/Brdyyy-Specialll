import React, { useEffect, useRef, useState } from 'react';

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number; // in radians
  size: number;
  color: string;
  glowColor: string;
  alpha: number;
  maxAlpha: number;
  decay: number;
  sparks: { x: number; y: number; alpha: number; size: number; color: string }[];
}

interface MeteorShowerOverlayProps {
  themeColor?: string;
}

// Helper to safely convert hex or color to valid RGBA string with clamped alpha
const hexToRgba = (hex: string, alpha: number): string => {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  if (hex && hex.startsWith('#')) {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
    }
  }
  return `rgba(255, 255, 255, ${safeAlpha})`;
};

export const MeteorShowerOverlay: React.FC<MeteorShowerOverlayProps> = ({ themeColor = '#ec4899' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isShowerActive, setIsShowerActive] = useState<boolean>(false);
  const [totalShowersFired, setTotalShowersFired] = useState<number>(0);
  const isShowerActiveRef = useRef<boolean>(false);
  const meteorsRef = useRef<Meteor[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Palette of radiant cosmic meteor colors
  const METEOR_PALETTES = [
    { head: '#ffffff', tail: '#67e8f9', glow: '#06b6d4' }, // Cyan ice
    { head: '#fffbeb', tail: '#fde047', glow: '#eab308' }, // Golden fire
    { head: '#fff1f2', tail: '#fda4af', glow: '#f43f5e' }, // Rose starlight
    { head: '#faf5ff', tail: '#d8b4fe', glow: '#a855f7' }, // Amethyst purple
    { head: '#ffffff', tail: '#38bdf8', glow: '#2563eb' }  // Deep sky blue
  ];

  // Spawn a wave of dense meteors
  const triggerMeteorShowerWave = (customCount = 34) => {
    isShowerActiveRef.current = true;
    setIsShowerActive(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const count = width < 768 ? Math.min(22, customCount) : customCount;
    const newMeteors: Meteor[] = [];

    for (let i = 0; i < count; i++) {
      const palette = METEOR_PALETTES[Math.floor(Math.random() * METEOR_PALETTES.length)];
      // Start positions along top and right edge to stream diagonally down-left
      const startX = Math.random() * (width * 1.4) - width * 0.2;
      const startY = -Math.random() * (height * 0.6) - 50;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.15; // ~45 degrees diagonal

      newMeteors.push({
        x: startX,
        y: startY,
        length: Math.random() * 160 + 120, // long dramatic tail
        speed: Math.random() * 14 + 16,     // high speed blazing
        angle,
        size: Math.random() * 2.8 + 1.8,
        color: palette.head,
        glowColor: palette.glow,
        alpha: 0,
        maxAlpha: Math.random() * 0.4 + 0.6,
        decay: Math.random() * 0.008 + 0.012,
        sparks: []
      });
    }

    meteorsRef.current.push(...newMeteors);
    setTotalShowersFired(prev => prev + 1);

    // Wave duration ~3.8 seconds
    setTimeout(() => {
      isShowerActiveRef.current = false;
      setIsShowerActive(false);
    }, 3800);
  };

  // Trigger immediately when website opens, then repeat every 1 minute (60 seconds)
  useEffect(() => {
    if (!isActive) return;

    // Reset when tab becomes visible to prevent queue buildup
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden: clear accumulated meteors so it never causes a lag spike upon return
        meteorsRef.current = [];
        isShowerActiveRef.current = false;
        setIsShowerActive(false);
      } else {
        // Tab restored: start fresh with a light smooth wave
        meteorsRef.current = [];
        setTimeout(() => {
          if (!document.hidden) {
            triggerMeteorShowerWave(20);
          }
        }, 400);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial shower right as web opens (only if visible)
    const initialTimer = setTimeout(() => {
      if (!document.hidden) {
        triggerMeteorShowerWave(32);
      }
    }, 600);

    // 1-minute (60,000ms) automatic interval cooldown
    const interval = setInterval(() => {
      if (!document.hidden) {
        triggerMeteorShowerWave(32);
      }
    }, 60000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isActive]);

  // Occasional ambient single shooting star during cooldown so sky stays dynamic
  useEffect(() => {
    if (!isActive) return;
    const ambientInterval = setInterval(() => {
      if (document.hidden) return; // Never spawn when tab is hidden!
      if (meteorsRef.current.length > 25) return; // Strict safety ceiling to prevent any lag

      if (!isShowerActiveRef.current && Math.random() > 0.4) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const palette = METEOR_PALETTES[Math.floor(Math.random() * METEOR_PALETTES.length)];
        const startX = Math.random() * (canvas.width * 1.2);
        const startY = -Math.random() * 100;
        meteorsRef.current.push({
          x: startX,
          y: startY,
          length: Math.random() * 140 + 80,
          speed: Math.random() * 12 + 14,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.1,
          size: Math.random() * 2.2 + 1.4,
          color: palette.head,
          glowColor: palette.glow,
          alpha: 0,
          maxAlpha: 0.75,
          decay: 0.014,
          sparks: []
        });
      }
    }, 2800);

    return () => clearInterval(ambientInterval);
  }, [isActive]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const meteors = meteorsRef.current;
      const isMobile = width < 768;
      if (meteors.length > (isMobile ? 8 : 35)) {
        meteors.splice(0, meteors.length - (isMobile ? 8 : 35));
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];

        // Fade in rapidly, then hold, then fade out
        if (m.alpha < m.maxAlpha && m.y < height * 0.4) {
          m.alpha = Math.min(m.maxAlpha, m.alpha + 0.12);
        } else {
          m.alpha -= m.decay;
        }

        // Advance position
        const vx = Math.cos(m.angle) * m.speed;
        const vy = Math.sin(m.angle) * m.speed;
        m.x += vx;
        m.y += vy;

        // Cull inactive or offscreen meteors immediately
        if (m.alpha <= 0.001 || m.x > width + 200 || m.y > height + 200) {
          meteors.splice(i, 1);
          continue;
        }

        const safeAlpha = Math.max(0, Math.min(1, m.alpha));

        // Tail calculation (trailing backwards opposite of angle)
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        // Draw meteor luminous tail with gradient
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${safeAlpha})`);
        grad.addColorStop(0.2, hexToRgba(m.glowColor || '#67e8f9', safeAlpha * 0.9));
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.size;
        ctx.lineCap = 'round';
        if (!isMobile) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = m.glowColor;
        }
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Draw glowing blazing head
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        if (!isMobile) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#ffffff';
        }
        ctx.fill();

        // Emitting stardust sparks behind meteor head
        if (Math.random() > 0.4 && m.sparks.length < 8) {
          m.sparks.push({
            x: m.x - Math.cos(m.angle) * (Math.random() * 40),
            y: m.y - Math.sin(m.angle) * (Math.random() * 40) + (Math.random() - 0.5) * 6,
            alpha: safeAlpha * 0.8,
            size: Math.random() * 1.6 + 0.8,
            color: m.glowColor
          });
        }

        // Render sparks
        for (let s = m.sparks.length - 1; s >= 0; s--) {
          const sp = m.sparks[s];
          sp.alpha -= 0.04;
          if (sp.alpha <= 0.001) {
            m.sparks.splice(s, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, sp.alpha));
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive]);

  return (
    <>
      {/* 60fps Fullscreen Non-Blocking Canvas */}
      {isActive && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[4] w-full h-full"
          style={{ willChange: 'transform' }}
        />
      )}
    </>
  );
};
