import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3FireworksCanvasProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  radius: number;
  sparkle: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
  exploded: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

export const D3FireworksCanvas: React.FC<D3FireworksCanvasProps> = ({ isActive, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // D3 Color Palette and Interpolator
    const vibrantColors = [
      '#ff007f', '#ff4081', '#ff1493', '#ffd700', '#ffea00',
      '#00e5ff', '#00b0ff', '#76ff03', '#d500f9', '#ff3d00'
    ];
    const colorScale = d3.scaleOrdinal<number, string>()
      .domain(d3.range(10))
      .range(vibrantColors);

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    // Function to create an explosion at (x, y) with D3 particle math
    const explode = (x: number, y: number, baseColor?: string) => {
      const particleCount = d3.randomInt(70, 130)();
      const chosenColor = baseColor || colorScale(Math.floor(Math.random() * 10));

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = d3.randomNormal(4.5, 1.8)();
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * Math.max(1, speed),
          vy: Math.sin(angle) * Math.max(1, speed),
          alpha: 1,
          decay: d3.randomUniform(0.012, 0.024)(),
          color: Math.random() > 0.3 ? chosenColor : '#ffffff',
          radius: d3.randomUniform(1.8, 3.2)(),
          sparkle: Math.random() > 0.5
        });
      }
    };

    // Function to launch a rocket
    const launchRocket = () => {
      const x = d3.randomUniform(width * 0.1, width * 0.9)();
      const targetY = d3.randomUniform(height * 0.15, height * 0.45)();
      const color = colorScale(Math.floor(Math.random() * 10));

      rockets.push({
        x,
        y: height + 10,
        targetY,
        speed: d3.randomUniform(9, 14)(),
        color,
        exploded: false,
        trail: []
      });
    };

    // Initial volley of fireworks
    for (let i = 0; i < 4; i++) {
      setTimeout(() => launchRocket(), i * 280);
    }

    // Interval to launch more rockets
    let launchCounter = 0;
    const launchTimer = setInterval(() => {
      if (launchCounter < 15) {
        launchRocket();
        if (Math.random() > 0.4) launchRocket();
        launchCounter++;
      }
    }, 450);

    // Main animation loop driven by d3.timer
    const timer = d3.timer((elapsed) => {
      // Clear with soft trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, width, height);

      // 1. Update and draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y -= r.speed;

        // Add trail dot
        r.trail.push({ x: r.x, y: r.y, alpha: 0.9 });
        if (r.trail.length > 8) r.trail.shift();

        // Draw trail
        for (const t of r.trail) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = t.alpha;
          ctx.fill();
          t.alpha *= 0.75;
        }

        // Draw rocket head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.fill();

        // Check if rocket reached target altitude
        if (r.y <= r.targetY && !r.exploded) {
          r.exploded = true;
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // 2. Update and draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055; // Gravity
        p.vx *= 0.985; // Air drag
        p.vy *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sparkle && Math.random() > 0.5 ? p.radius * 1.5 : p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;

      // Finish when time has passed and particles are depleted
      if (elapsed > 9000 && particles.length === 0 && rockets.length === 0) {
        timer.stop();
        if (onComplete) onComplete();
      }
    });

    return () => {
      timer.stop();
      clearInterval(launchTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {/* Visual celebration toast overlay */}
      <div className="relative z-10 pointer-events-auto px-6 py-3 rounded-full bg-slate-950/80 border border-amber-400/50 backdrop-blur-xl text-amber-200 font-serif text-sm sm:text-base font-bold shadow-2xl flex items-center gap-3 animate-bounce">
        <span>🎆 D3 Grand Fireworks Spectacular In The Sky! 💖</span>
        <button
          onClick={onComplete}
          className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white/80 transition-colors cursor-pointer"
        >
          Close ✕
        </button>
      </div>
    </div>
  );
};
