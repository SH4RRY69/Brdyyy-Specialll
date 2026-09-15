import React, { useEffect, useState, useRef } from 'react';
import { CursorThemeId, CURSOR_THEMES, CURSOR_STORAGE_KEY } from '../types/cursor';

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  char: string;
  color: string;
  vx: number;
  vy: number;
}

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [currentThemeId, setCurrentThemeId] = useState<CursorThemeId>(() => {
    return (localStorage.getItem(CURSOR_STORAGE_KEY) as CursorThemeId) || 'tiara';
  });

  const particlesRef = useRef<TrailParticle[]>([]);
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const lastEmitRef = useRef(0);

  // Listen for cursor theme changes from PersonalizeModal or Navbar
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<CursorThemeId>) => {
      if (e.detail) {
        setCurrentThemeId(e.detail);
      }
    };
    window.addEventListener('cursor-theme-change' as any, handleThemeChange);
    return () => {
      window.removeEventListener('cursor-theme-change' as any, handleThemeChange);
    };
  }, []);

  const activeTheme = CURSOR_THEMES.find(t => t.id === currentThemeId) || CURSOR_THEMES[0];

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch && window.innerWidth < 1024) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Spawn trail particle occasionally
      const now = performance.now();
      if (now - lastEmitRef.current > 45) {
        lastEmitRef.current = now;

        let char = '✨';
        if (activeTheme.trailType === 'hearts') char = '💖';
        else if (activeTheme.trailType === 'stars') char = '⭐';
        else if (activeTheme.trailType === 'butterflies') char = '🦋';
        else if (activeTheme.trailType === 'paws') char = '🐾';
        else if (activeTheme.trailType === 'petals') char = '🌸';
        else if (activeTheme.trailType === 'dust') char = '✦';
        else if (activeTheme.trailType === 'sweets') char = '🍭';
        else if (activeTheme.trailType === 'rainbow') char = '🌈';
        else if (activeTheme.trailType === 'magic') char = '🔮';

        const newP: TrailParticle = {
          id: Math.random(),
          x: e.clientX + (Math.random() * 8 - 4),
          y: e.clientY + (Math.random() * 8 - 4),
          size: Math.random() * 8 + 10,
          opacity: 0.9,
          char,
          color: activeTheme.accentColor,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.5
        };

        particlesRef.current = [...particlesRef.current.slice(-16), newP];
      }

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.getAttribute('data-hoverable') === 'true')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Particle animation loop
    let animId: number;
    const updateParticles = () => {
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.035,
            size: p.size * 0.96
          }))
          .filter(p => p.opacity > 0.05);

        setParticles([...particlesRef.current]);
      }
      animId = requestAnimationFrame(updateParticles);
    };
    animId = requestAnimationFrame(updateParticles);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [activeTheme]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Floating Sparkle Particles Trail */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none select-none z-50 transition-none"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`,
            opacity: p.opacity,
            fontSize: `${p.size}px`,
            filter: `drop-shadow(0 0 4px ${p.color})`,
            color: p.color
          }}
        >
          {p.char}
        </div>
      ))}

      {/* Outer Soft Aura Glow */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovering ? 'scale-130' : isMouseDown ? 'scale-85' : 'scale-100'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          width: isHovering ? '38px' : '28px',
          height: isHovering ? '38px' : '28px',
          backgroundColor: `${activeTheme.accentColor}25`,
          border: `1.5px solid ${activeTheme.accentColor}80`,
          boxShadow: `0 0 16px ${activeTheme.accentColor}90`
        }}
      />

      {/* Cute Cursor Head Icon */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 select-none transition-transform duration-100 ease-out flex items-center justify-center ${
          isHovering ? 'scale-125' : isMouseDown ? 'scale-90' : 'scale-100'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          filter: `drop-shadow(0 0 6px ${activeTheme.accentColor})`
        }}
      >
        {activeTheme.id === 'glow_ring' ? (
          <div
            className="w-2.5 h-2.5 rounded-full bg-white shadow-xs"
            style={{ backgroundColor: activeTheme.accentColor }}
          />
        ) : (
          <span className="text-base leading-none select-none drop-shadow-sm">
            {activeTheme.emoji}
          </span>
        )}
      </div>
    </>
  );
};
