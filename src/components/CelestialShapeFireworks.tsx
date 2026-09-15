import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Crown, Stars, Disc3, Flower2 } from 'lucide-react';
import { birthdayAudio } from '../utils/audioSynthesizer';

export type FireworkShapeType = 'hbd_alihaaa' | 'heart' | 'crown' | 'star' | 'saturn' | 'flower';

interface Spark {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  glowColor: string;
  alpha: number;
  decay: number;
  size: number;
  sparkleFreq: number;
  isLetterCore?: boolean;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  shape: FireworkShapeType;
  exploded: boolean;
}

export const CelestialShapeFireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const [activeShapeBanner, setActiveShapeBanner] = useState<string | null>(null);

  // Helper to interpolate dense points along a line segment
  const sampleSegment = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    step: number,
    color: string,
    glowColor: string,
    points: { x: number; y: number; color: string; glowColor: string }[]
  ) => {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const count = Math.max(2, Math.floor(dist / step));
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      points.push({
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t,
        color,
        glowColor
      });
    }
  };

  // Generate coordinate points for different shapes with high clarity & large size
  const getShapePoints = (
    shape: FireworkShapeType,
    centerX: number,
    centerY: number,
    screenW: number,
    screenH: number
  ): { x: number; y: number; color: string; glowColor: string }[] => {
    const points: { x: number; y: number; color: string; glowColor: string }[] = [];

    if (shape === 'hbd_alihaaa') {
      // High-precision vector stroke paths for "HBD" (top) and "ALIHAAA ♡" (bottom)
      // Normalized glyph height: 1.0, width: 0.65
      const isMobile = screenW < 768;
      const scale = isMobile 
        ? Math.min(screenW * 0.9 / 18, screenH * 0.22 / 8) 
        : Math.min(screenW * 0.85 / 24, screenH * 0.26 / 8, 38);

      const step = Math.max(3, scale * 0.16);

      // Letter definitions as vector segments [x1, y1, x2, y2]
      const getLetterSegments = (char: string): [number, number, number, number][] => {
        switch (char) {
          case 'H':
            return [
              [0, 0, 0, 1],
              [0.65, 0, 0.65, 1],
              [0, 0.5, 0.65, 0.5]
            ];
          case 'B':
            return [
              [0, 0, 0, 1],
              [0, 0, 0.5, 0],
              [0.5, 0, 0.65, 0.25],
              [0.65, 0.25, 0.5, 0.5],
              [0.5, 0.5, 0, 0.5],
              [0.5, 0.5, 0.68, 0.75],
              [0.68, 0.75, 0.5, 1],
              [0.5, 1, 0, 1]
            ];
          case 'D':
            return [
              [0, 0, 0, 1],
              [0, 0, 0.45, 0],
              [0.45, 0, 0.7, 0.5],
              [0.7, 0.5, 0.45, 1],
              [0.45, 1, 0, 1]
            ];
          case 'A':
            return [
              [0, 1, 0.35, 0],
              [0.35, 0, 0.7, 1],
              [0.15, 0.6, 0.55, 0.6]
            ];
          case 'L':
            return [
              [0, 0, 0, 1],
              [0, 1, 0.6, 1]
            ];
          case 'I':
            return [
              [0.1, 0, 0.5, 0],
              [0.3, 0, 0.3, 1],
              [0.1, 1, 0.5, 1]
            ];
          default:
            return [];
        }
      };

      const topWord = 'HBD';
      const bottomWord = 'ALIHAAA';

      const topY = centerY - scale * 1.6;
      const bottomY = centerY + scale * 0.4;

      // Row 1: HBD (Radiant Golden Sunfire)
      const topSpacing = scale * 1.05;
      const topTotalW = (topWord.length - 1) * topSpacing + scale * 0.7;
      let curX = centerX - topTotalW / 2;

      for (const char of topWord) {
        const segs = getLetterSegments(char);
        segs.forEach(([x1, y1, x2, y2]) => {
          sampleSegment(
            curX + x1 * scale,
            topY + y1 * scale,
            curX + x2 * scale,
            topY + y2 * scale,
            step,
            '#fef08a',
            '#eab308',
            points
          );
        });
        curX += topSpacing;
      }

      // Row 2: ALIHAAA (Vibrant Rose Fuchsia Glow)
      const botSpacing = scale * (isMobile ? 0.8 : 0.95);
      const botTotalW = (bottomWord.length - 1) * botSpacing + scale * 0.7 + scale * 1.1; // with heart
      curX = centerX - botTotalW / 2;

      for (const char of bottomWord) {
        const segs = getLetterSegments(char);
        segs.forEach(([x1, y1, x2, y2]) => {
          sampleSegment(
            curX + x1 * scale,
            bottomY + y1 * scale,
            curX + x2 * scale,
            bottomY + y2 * scale,
            step,
            '#fbcfe8',
            '#ec4899',
            points
          );
        });
        curX += botSpacing;
      }

      // Trailing Heart Symbol ♡ next to ALIHAAA
      const hScale = scale * 0.055;
      const heartCenterX = curX + scale * 0.45;
      const heartCenterY = bottomY + scale * 0.5;
      for (let t = 0; t < Math.PI * 2; t += 0.1) {
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({
          x: heartCenterX + hx * hScale,
          y: heartCenterY + hy * hScale,
          color: '#f43f5e',
          glowColor: '#be123c'
        });
      }
    } else if (shape === 'heart') {
      const scale = Math.min(screenW * 0.42, screenH * 0.38, 230) / 16;
      // Double layer heart (outer ring and glowing inner ring)
      for (let t = 0; t < Math.PI * 2; t += 0.04) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          color: '#fda4af',
          glowColor: '#f43f5e'
        });
        // Inner layer
        points.push({
          x: centerX + x * (scale * 0.82),
          y: centerY + y * (scale * 0.82),
          color: '#ffe4e6',
          glowColor: '#fb7185'
        });
      }
    } else if (shape === 'crown') {
      const scale = Math.min(screenW * 0.45, 250);
      // Base line
      sampleSegment(centerX - 0.5 * scale, centerY + 0.3 * scale, centerX + 0.5 * scale, centerY + 0.3 * scale, 5, '#fef08a', '#eab308', points);
      // Crown 3 peaks
      const peaks = [
        { x: -0.5, y: -0.2 },
        { x: -0.25, y: 0.1 },
        { x: 0, y: -0.45 },
        { x: 0.25, y: 0.1 },
        { x: 0.5, y: -0.2 }
      ];
      for (let i = 0; i < peaks.length - 1; i++) {
        const p1 = peaks[i];
        const p2 = peaks[i + 1];
        sampleSegment(
          centerX + p1.x * scale,
          centerY + p1.y * scale,
          centerX + p2.x * scale,
          centerY + p2.y * scale,
          5,
          '#fde047',
          '#ca8a04',
          points
        );
      }
      // Jewels at peaks
      [-0.5, 0, 0.5].forEach(px => {
        const jx = centerX + px * scale;
        const jy = centerY + (px === 0 ? -0.48 : -0.23) * scale;
        for (let a = 0; a < Math.PI * 2; a += 0.5) {
          points.push({
            x: jx + Math.cos(a) * 8,
            y: jy + Math.sin(a) * 8,
            color: '#f43f5e',
            glowColor: '#e11d48'
          });
        }
      });
    } else if (shape === 'star') {
      const outerR = Math.min(screenW * 0.35, screenH * 0.35, 220);
      const innerR = outerR * 0.42;
      for (let i = 0; i < 10; i++) {
        const a1 = (i * Math.PI) / 5 - Math.PI / 2;
        const a2 = ((i + 1) * Math.PI) / 5 - Math.PI / 2;
        const r1 = i % 2 === 0 ? outerR : innerR;
        const r2 = (i + 1) % 2 === 0 ? outerR : innerR;
        sampleSegment(
          centerX + Math.cos(a1) * r1,
          centerY + Math.sin(a1) * r1,
          centerX + Math.cos(a2) * r2,
          centerY + Math.sin(a2) * r2,
          5,
          '#fef08a',
          '#f59e0b',
          points
        );
      }
    } else if (shape === 'saturn') {
      const radius = Math.min(screenW * 0.18, 110);
      // Planet core double contour
      for (let t = 0; t < Math.PI * 2; t += 0.08) {
        points.push({
          x: centerX + Math.cos(t) * radius,
          y: centerY + Math.sin(t) * radius,
          color: '#fde047',
          glowColor: '#d97706'
        });
      }
      // Double Saturn Ring System
      [radius * 2.4, radius * 2.8].forEach((rx, idx) => {
        const ry = rx * 0.32;
        for (let t = 0; t < Math.PI * 2; t += 0.05) {
          const px = Math.cos(t) * rx;
          const py = Math.sin(t) * ry;
          const angle = -0.38;
          const rotX = px * Math.cos(angle) - py * Math.sin(angle);
          const rotY = px * Math.sin(angle) + py * Math.cos(angle);
          points.push({
            x: centerX + rotX,
            y: centerY + rotY,
            color: idx === 0 ? '#67e8f9' : '#38bdf8',
            glowColor: '#0284c7'
          });
        }
      });
    } else if (shape === 'flower') {
      const r = Math.min(screenW * 0.32, screenH * 0.32, 190);
      for (let t = 0; t < Math.PI * 2; t += 0.02) {
        const curR = r * Math.abs(Math.cos(4 * t));
        points.push({
          x: centerX + Math.cos(t) * curR,
          y: centerY + Math.sin(t) * curR,
          color: '#f43f5e',
          glowColor: '#be123c'
        });
      }
      // Golden central pistil
      for (let t = 0; t < Math.PI * 2; t += 0.15) {
        points.push({
          x: centerX + Math.cos(t) * 22,
          y: centerY + Math.sin(t) * 22,
          color: '#fef08a',
          glowColor: '#eab308'
        });
      }
    }

    return points;
  };

  const launchShapeFirework = (shape: FireworkShapeType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Trigger audio whistle
    try {
      birthdayAudio.playSparkleChime();
    } catch {}

    const targetY = h * (shape === 'hbd_alihaaa' ? 0.34 : 0.38);
    rocketsRef.current.push({
      x: w * (0.46 + Math.random() * 0.08),
      y: h + 20,
      targetY,
      vy: -15.5,
      color: shape === 'hbd_alihaaa' ? '#ec4899' : '#fbbf24',
      shape,
      exploded: false
    });

    const labelMap: Record<FireworkShapeType, string> = {
      hbd_alihaaa: '✨ "HBD ALIHAAA ♡" Grand Celestial Constellation!',
      heart: '💖 Radiant Glowing Sweetheart Firework!',
      crown: '👑 Royal Queen Princess Crown Firework!',
      star: '⭐ Golden Starburst Celestial Firework!',
      saturn: '🪐 Ring of Saturn Cosmic Spectacle!',
      flower: '🌸 Blooming Midnight Peony Firework!'
    };

    setActiveShapeBanner(labelMap[shape]);
    setTimeout(() => setActiveShapeBanner(null), 4500);
  };

  useEffect(() => {
    const handleFireEvent = (e: CustomEvent<{ shape: FireworkShapeType }>) => {
      if (e.detail?.shape) {
        launchShapeFirework(e.detail.shape);
      }
    };
    window.addEventListener('fire-shape-firework' as any, handleFireEvent);
    return () => {
      window.removeEventListener('fire-shape-firework' as any, handleFireEvent);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // 1. Process Shockwave Rings
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.14 + 1.5;
        sw.alpha -= 0.035;

        if (sw.alpha <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = sw.color;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Process Rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.y += r.vy;

        // Draw rocket head & luminous tail
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = r.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y - r.vy * 2.5);
        ctx.stroke();
        ctx.restore();

        // Check if reached apex
        if (r.y <= r.targetY) {
          r.exploded = true;
          rocketsRef.current.splice(i, 1);

          // Add flash shockwave
          shockwavesRef.current.push({
            x: r.x,
            y: r.targetY,
            radius: 4,
            maxRadius: 180,
            alpha: 0.9,
            color: r.color
          });

          // Explode into shape points!
          const pts = getShapePoints(r.shape, r.x, r.targetY, w, h);
          pts.forEach(p => {
            const angle = Math.atan2(p.y - r.targetY, p.x - r.x);
            const dist = Math.hypot(p.x - r.x, p.y - r.targetY);
            sparksRef.current.push({
              x: r.x,
              y: r.targetY,
              targetX: p.x,
              targetY: p.y,
              vx: (Math.cos(angle) * dist) / 14,
              vy: (Math.sin(angle) * dist) / 14,
              color: p.color,
              glowColor: p.glowColor,
              alpha: 1.0,
              decay: r.shape === 'hbd_alihaaa' ? 0.0042 : 0.0055, // Stays suspended much longer!
              size: r.shape === 'hbd_alihaaa' ? 4.2 : 4.6, // Much bigger particles!
              sparkleFreq: Math.random() * 10
            });
          });

          // Play fanfare chord
          try {
            birthdayAudio.playCosmicPortalOpen();
          } catch {}
        }
      }

      // 3. Process Sparks (Glowing particles)
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];

        // Move towards target then gently lock into position
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.vy += 0.015; // very gentle cosmic float
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        const flicker = Math.sin(performance.now() * 0.012 + s.sparkleFreq) * 0.25 + 0.85;
        const currentAlpha = Math.max(0, s.alpha * flicker);

        ctx.save();
        ctx.globalAlpha = currentAlpha;

        // Outer bloom halo
        ctx.shadowBlur = 14;
        ctx.shadowColor = s.glowColor;
        ctx.fillStyle = s.glowColor;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Core bright white/gold spark
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Central diamond glint for prominent sparks
        if (s.size > 4.0 && flicker > 0.9) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />

      {/* Active Fireworks Shape Toast Notification */}
      {activeShapeBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100001] pointer-events-none animate-fade-in">
          <div className="px-5 py-2.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-pink-400/50 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-pink-500/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-spin-slow" />
            <span>{activeShapeBanner}</span>
            <Sparkles className="w-4 h-4 text-pink-300 fill-pink-300 animate-spin-slow" />
          </div>
        </div>
      )}
    </>
  );
};
