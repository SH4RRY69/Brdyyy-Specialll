import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Flower2, Zap, Flame, EyeOff, Settings2, Check } from 'lucide-react';
import { activityTracker } from '../utils/activityTracker';

export type ParticleType = 'hearts' | 'stars' | 'petals' | 'fireflies' | 'snow' | 'off';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  pulseSpeed: number;
  pulseVal: number;
}

const STORAGE_PARTICLE_KEY = 'birthday_particle_type_v1';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particleType, setParticleType] = useState<ParticleType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PARTICLE_KEY);
      if (saved && ['hearts', 'stars', 'petals', 'fireflies', 'snow', 'off'].includes(saved)) {
        return saved as ParticleType;
      }
    } catch (e) {}
    return 'hearts'; // Romantic default for Alihaaa
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Save particle preference
  const handleSelectType = (type: ParticleType) => {
    setParticleType(type);
    try {
      localStorage.setItem(STORAGE_PARTICLE_KEY, type);
    } catch (e) {}
    activityTracker.logEvent('particles', 'Particle Animation Changed', `Switched particle theme to ${type}`, 'purple');
  };

  // Listen for particle theme changes from Solar System HUD
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_PARTICLE_KEY && e.newValue) {
        if (['hearts', 'stars', 'petals', 'fireflies', 'snow', 'off'].includes(e.newValue)) {
          setParticleType(e.newValue as ParticleType);
        }
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ParticleType>;
      if (customEvent.detail && ['hearts', 'stars', 'petals', 'fireflies', 'snow', 'off'].includes(customEvent.detail)) {
        setParticleType(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('particle-theme-change', handleCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('particle-theme-change', handleCustomEvent);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || particleType === 'off') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Particle count based on screen width (mobile friendly)
    const isMobile = width < 768;
    const count = isMobile ? 16 : 45;

    const colorsMap: Record<ParticleType, string[]> = {
      hearts: ['#f472b6', '#fb7185', '#fda4af', '#f43f5e', '#ffffff'],
      stars: ['#fef08a', '#ffffff', '#fed7aa', '#e9d5ff', '#bae6fd'],
      petals: ['#fbcfe8', '#f472b6', '#fda4af', '#fff1f2', '#fecdd3'],
      fireflies: ['#fef08a', '#facc15', '#fde047', '#a7f3d0', '#fed7aa'],
      snow: ['#ffffff', '#e0f2fe', '#bae6fd', '#f1f5f9', '#ffffff'],
      off: []
    };

    const initParticles = () => {
      const pList: Particle[] = [];
      const palette = colorsMap[particleType] || colorsMap.hearts;

      for (let i = 0; i < count; i++) {
        pList.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size:
            particleType === 'hearts'
              ? Math.random() * 12 + 8
              : particleType === 'petals'
              ? Math.random() * 10 + 7
              : Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY:
            particleType === 'petals' || particleType === 'snow'
              ? Math.random() * 1.2 + 0.6 // falling down
              : (Math.random() - 0.5) * 0.7 - 0.4, // floating up
          opacity: Math.random() * 0.6 + 0.25,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          color: palette[Math.floor(Math.random() * palette.length)],
          pulseSpeed: Math.random() * 0.04 + 0.01,
          pulseVal: Math.random() * Math.PI
        });
      }
      particlesRef.current = pList;
    };

    initParticles();

    // Helper draw shapes
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
      // bottom right curve
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawPetal = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(size * 0.6, 0, 0, size);
      c.quadraticCurveTo(-size * 0.6, 0, 0, -size);
      c.fill();
      c.restore();
    };

    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, color: string) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      if (!isMobile) {
        c.shadowBlur = 6;
        c.shadowColor = color;
      }
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos(((18 + i * 90) * Math.PI) / 180) * size, -Math.sin(((18 + i * 90) * Math.PI) / 180) * size);
        c.lineTo(Math.cos(((63 + i * 90) * Math.PI) / 180) * (size * 0.35), -Math.sin(((63 + i * 90) * Math.PI) / 180) * (size * 0.35));
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.pulseVal += p.pulseSpeed;

        const currentAlpha = p.opacity * (0.65 + Math.sin(p.pulseVal) * 0.35);

        // Wrap around boundaries
        if (p.y < -30) p.y = height + 20;
        if (p.y > height + 30) p.y = -20;
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        // Render based on selected particle style
        if (particleType === 'hearts') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, currentAlpha);
        } else if (particleType === 'petals') {
          drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, currentAlpha);
        } else if (particleType === 'stars') {
          drawStar(ctx, p.x, p.y, p.size, currentAlpha, p.color);
        } else if (particleType === 'fireflies') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.8 + Math.sin(p.pulseVal) * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          if (!isMobile) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
          }
          ctx.fill();
          ctx.restore();
        } else if (particleType === 'snow') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleType]);

  const options: { id: ParticleType; label: string; icon: any; color: string }[] = [
    { id: 'hearts', label: 'Floating Hearts', icon: Heart, color: 'text-pink-400' },
    { id: 'stars', label: 'Twinkling Stars', icon: Sparkles, color: 'text-amber-300' },
    { id: 'petals', label: 'Cherry Petals', icon: Flower2, color: 'text-rose-300' },
    { id: 'fireflies', label: 'Warm Fireflies', icon: Flame, color: 'text-yellow-300' },
    { id: 'snow', label: 'Magical Snow', icon: Zap, color: 'text-sky-300' },
    { id: 'off', label: 'Particles Off', icon: EyeOff, color: 'text-slate-400' }
  ];

    return (
      particleType !== 'off' ? (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[2] transition-opacity duration-700"
          style={{ willChange: 'transform' }}
        />
      ) : null
    );
  };
