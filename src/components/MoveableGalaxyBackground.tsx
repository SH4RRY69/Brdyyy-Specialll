import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Eye,
  EyeOff,
  Rotate3d,
  Compass,
  Orbit,
  Sparkles,
  Zap,
  Globe2,
  ChevronRight,
  Flame,
  Check,
  CircleDot,
  Heart,
  Flower2,
  Sliders,
  Layers,
  Radio,
  Info,
  Gauge,
  Award,
  CheckCircle2,
  Rocket,
  Stars,
  Play,
  CloudRain,
  Sun,
  SunMedium,
  Moon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  SlidersHorizontal,
  Aperture,
  RefreshCw,
  MousePointer,
  Crown,
  Waves,
  Sparkle
} from 'lucide-react';
import { activityTracker } from '../utils/activityTracker';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { triggerFireworks, triggerHeartShower, triggerRealisticConfetti } from '../utils/confettiFireworks';
import { CURSOR_THEMES, CursorThemeId, CURSOR_STORAGE_KEY } from '../types/cursor';
import { FireworkShapeType } from './CelestialShapeFireworks';

const STORAGE_SOLAR_ON = 'birthday_solar_active_v4';
const STORAGE_SOLAR_SPEED = 'birthday_solar_speed_v4';
const STORAGE_GALAXY_THEME = 'birthday_solar_galaxy_v5';
const STORAGE_CELESTIAL_MODE = 'birthday_celestial_mode_v5';
const STORAGE_SOLAR_PARTICLES = 'birthday_solar_particles_v5';
const STORAGE_SOLAR_HEARTS = 'birthday_solar_hearts_v5';
const STORAGE_SOLAR_POSITION = 'birthday_solar_position_v5';

export type GalaxyTheme =
  | 'grand_solar_nebula'
  | 'earth_azure_space'
  | 'saturn_golden_orbit'
  | 'rose_gold_galaxy'
  | 'cyber_aurora'
  | 'mars_crimson_deep';

export type CelestialMode =
  | 'solar_system'
  | 'earth_orbit'
  | 'saturn_rings'
  | 'mars_deep_space';

interface GalaxyConfig {
  id: GalaxyTheme;
  name: string;
  emoji: string;
  subtitle: string;
  bgColor: number;
  fogColor: number;
  starColor: number;
  nebulaColor1: number;
  nebulaColor2: number;
  sunEmissive: number;
  glowColor: string;
}

const GALAXY_THEMES: Record<GalaxyTheme, GalaxyConfig> = {
  grand_solar_nebula: {
    id: 'grand_solar_nebula',
    name: '3D Grand Solar System',
    emoji: '🪐',
    subtitle: 'All 8 Planets Orbiting with Sun',
    bgColor: 0x020208,
    fogColor: 0x060614,
    starColor: 0xffedd5,
    nebulaColor1: 0x4338ca,
    nebulaColor2: 0x6d28d9,
    sunEmissive: 0xf59e0b,
    glowColor: 'rgba(245, 158, 11, 0.3)'
  },
  earth_azure_space: {
    id: 'earth_azure_space',
    name: 'Earth View Cosmos (Blue Marble)',
    emoji: '🌍',
    subtitle: 'Deep Azure Atmosphere & Moon Orbit',
    bgColor: 0x01040a,
    fogColor: 0x020a14,
    starColor: 0xffffff,
    nebulaColor1: 0x1e3a8a,
    nebulaColor2: 0x0369a1,
    sunEmissive: 0x38bdf8,
    glowColor: 'rgba(56, 189, 248, 0.25)'
  },
  saturn_golden_orbit: {
    id: 'saturn_golden_orbit',
    name: 'Saturn Golden Ring World',
    emoji: '✨',
    subtitle: 'Majestic Rings & Golden Stardust',
    bgColor: 0x0a0501,
    fogColor: 0x170b02,
    starColor: 0xfef08a,
    nebulaColor1: 0xd97706,
    nebulaColor2: 0xb45309,
    sunEmissive: 0xfbbf24,
    glowColor: 'rgba(251, 191, 36, 0.3)'
  },
  rose_gold_galaxy: {
    id: 'rose_gold_galaxy',
    name: 'Cosmic Rose Gold (Alihaaa♡)',
    emoji: '🌸',
    subtitle: 'Romantic Pink & Golden Stardust',
    bgColor: 0x0f0308,
    fogColor: 0x1a0510,
    starColor: 0xfce7f3,
    nebulaColor1: 0xec4899,
    nebulaColor2: 0xf43f5e,
    sunEmissive: 0xfb7185,
    glowColor: 'rgba(244, 114, 182, 0.25)'
  },
  cyber_aurora: {
    id: 'cyber_aurora',
    name: 'Cyber Aurora Borealis',
    emoji: '💚',
    subtitle: 'Emerald & Teal Polar Plasma Ribbons',
    bgColor: 0x010a08,
    fogColor: 0x021611,
    starColor: 0xa7f3d0,
    nebulaColor1: 0x059669,
    nebulaColor2: 0x0d9488,
    sunEmissive: 0x10b981,
    glowColor: 'rgba(16, 185, 129, 0.25)'
  },
  mars_crimson_deep: {
    id: 'mars_crimson_deep',
    name: 'Crimson Mars & Solar Storm',
    emoji: '🔴',
    subtitle: 'Deep Rust Canyons & Star Flares',
    bgColor: 0x0a0202,
    fogColor: 0x180505,
    starColor: 0xfecaca,
    nebulaColor1: 0xb91c1c,
    nebulaColor2: 0x991b1b,
    sunEmissive: 0xef4444,
    glowColor: 'rgba(239, 68, 68, 0.3)'
  }
};

// Procedural Smooth Particle Texture Generator (ELIMINATES SQUARE BOXES ENTIRELY)
function createRoundParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.35)');
  grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// Procedural Glowing Heart Texture Generator for Heart Particles
function createHeartParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);

  ctx.save();
  ctx.translate(64, 48);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-26, -26, -48, 4, 0, 52);
  ctx.bezierCurveTo(48, 4, 26, -26, 0, 0);
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 16, 2, 0, 16, 44);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
  grad.addColorStop(0.3, 'rgba(251, 113, 133, 0.95)');
  grad.addColorStop(0.65, 'rgba(244, 63, 94, 0.75)');
  grad.addColorStop(1, 'rgba(236, 72, 153, 0)');

  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.restore();
  return new THREE.CanvasTexture(canvas);
}

// 4K Ultra-Realistic Earth Atmosphere Clouds Texture (Tropical cyclones & cloud bands)
function createAtmosphereCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 512);

  // 1. Equatorial Intertropical Convergence Zone (ITCZ)
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1024;
    const y = 230 + (Math.random() - 0.5) * 60;
    const rx = 40 + Math.random() * 80;
    const ry = 8 + Math.random() * 16;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.45})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Dynamic Tropical Cyclones / Hurricanes with spiral arms
  const cyclones = [
    { cx: 280, cy: 190, r: 65 }, // North Atlantic / Caribbean
    { cx: 720, cy: 170, r: 85 }, // West Pacific Typhoon
    { cx: 830, cy: 330, r: 55 }  // South Pacific / Indian Ocean
  ];

  cyclones.forEach(cyc => {
    // Spiral arms
    for (let arm = 0; arm < 3; arm++) {
      const armOffset = (arm * Math.PI * 2) / 3;
      for (let s = 0; s < 45; s++) {
        const theta = armOffset + (s / 45) * Math.PI * 3.5;
        const rad = (s / 45) * cyc.r;
        const x = cyc.cx + Math.cos(theta) * rad;
        const y = cyc.cy + Math.sin(theta) * rad * 0.75;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.55 + Math.random() * 0.35})`;
        ctx.beginPath();
        ctx.arc(x, y, 5 + Math.random() * 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  // 3. Mid-latitude Weather Fronts & Plumes
  for (let i = 0; i < 110; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() < 0.5 ? 90 + Math.random() * 110 : 320 + Math.random() * 110;
    const rx = 35 + Math.random() * 70;
    const ry = 12 + Math.random() * 22;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.45})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.4 + (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Polar Swirls
  for (let p = 0; p < 35; p++) {
    const x = Math.random() * 1024;
    const y = Math.random() < 0.5 ? Math.random() * 60 : 452 + Math.random() * 60;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.45 + Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.arc(x, y, 16 + Math.random() * 25, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Procedural Canvas Texture Generator for realistic planet surfaces
function createSunTexture(galaxy: GalaxyTheme): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  if (galaxy === 'rose_gold_galaxy') {
    grad.addColorStop(0, '#fff1f2');
    grad.addColorStop(0.2, '#fecdd3');
    grad.addColorStop(0.5, '#f43f5e');
    grad.addColorStop(0.8, '#be123c');
    grad.addColorStop(1, '#4c0519');
  } else if (galaxy === 'cyber_aurora') {
    grad.addColorStop(0, '#ecfdf5');
    grad.addColorStop(0.2, '#6ee7b7');
    grad.addColorStop(0.5, '#059669');
    grad.addColorStop(0.8, '#047857');
    grad.addColorStop(1, '#022c22');
  } else if (galaxy === 'mars_crimson_deep') {
    grad.addColorStop(0, '#fef2f2');
    grad.addColorStop(0.2, '#fca5a5');
    grad.addColorStop(0.5, '#ef4444');
    grad.addColorStop(0.8, '#b91c1c');
    grad.addColorStop(1, '#7f1d1d');
  } else {
    grad.addColorStop(0, '#fffbeb');
    grad.addColorStop(0.2, '#fef08a');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.8, '#d97706');
    grad.addColorStop(1, '#78350f');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Solar granules
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(245,158,11,0.2)';
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 8 + 2, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

// 4K Ultra-Realistic Earth Texture (Apollo / Google Earth Blueprint)
function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Ocean Floor with subtle bathymetry
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#091d42');
  oceanGrad.addColorStop(0.5, '#0d2d66');
  oceanGrad.addColorStop(1, '#081736');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Continental Shelf Shallow Waters (Turquoise fringing)
  const drawShallowCoast = (x: number, y: number, rx: number, ry: number) => {
    ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 14, ry + 12, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // 2. Major Continental Formations with Realistic Shapes
  // North America
  drawShallowCoast(240, 160, 115, 65);
  ctx.fillStyle = '#15803d'; // Green vegetation
  ctx.beginPath();
  ctx.ellipse(240, 160, 105, 55, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Rocky Mountains / Sierra Nevada
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(205, 150, 24, 48, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Florida & Caribbean
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(275, 195, 14, 26);

  // South America
  drawShallowCoast(330, 335, 75, 110);
  // Amazon Basin (deep emerald)
  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.ellipse(330, 310, 68, 55, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Andes mountain ridge (tall western backbone)
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(282, 335, 14, 95, 0.12, 0, Math.PI * 2);
  ctx.fill();
  // Patagonia (arid south)
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.ellipse(305, 410, 24, 45, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Europe & Mediterranean
  drawShallowCoast(525, 145, 65, 40);
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(525, 145, 55, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  // British Isles & Scandinavia
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.ellipse(490, 105, 16, 24, 0.2, 0, Math.PI * 2);
  ctx.ellipse(535, 80, 22, 32, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Africa
  drawShallowCoast(540, 275, 85, 105);
  // Sahara Desert (vibrant golden ochre)
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.ellipse(535, 215, 80, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  // Nile River green ribbon
  ctx.fillStyle = '#15803d';
  ctx.fillRect(572, 185, 5, 45);
  // Congo Rainforest & Central Africa
  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.ellipse(545, 290, 65, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  // South Africa
  ctx.fillStyle = '#65a30d';
  ctx.beginPath();
  ctx.ellipse(552, 365, 38, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Asia
  drawShallowCoast(720, 180, 155, 85);
  // Arabian Peninsula
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(625, 210, 32, 36, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // India Subcontinent
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.moveTo(680, 215);
  ctx.lineTo(730, 215);
  ctx.lineTo(705, 280);
  ctx.closePath();
  ctx.fill();
  // Tibetan Plateau & Himalayas (Snow-capped white tops)
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(710, 190, 52, 20, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fafc'; // Himalayan snow
  ctx.beginPath();
  ctx.ellipse(712, 188, 44, 10, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // East Asia & China
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.ellipse(785, 195, 65, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  // Siberian Taiga
  ctx.fillStyle = '#166534';
  ctx.fillRect(620, 80, 240, 65);

  // Australia & Oceania
  drawShallowCoast(825, 360, 65, 45);
  // Outback red center
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.ellipse(825, 360, 56, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  // Green coastal fertile band
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 9;
  ctx.stroke();
  // New Zealand
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.ellipse(915, 395, 12, 28, 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Polar Ice Caps (Glittering Arctic & Antarctic Sheets)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 38);
  ctx.fillRect(0, 474, 1024, 38);
  // Ice crevices
  ctx.fillStyle = '#e2e8f0';
  for (let i = 0; i < 30; i++) {
    ctx.fillRect(Math.random() * 1024, Math.random() * 32, Math.random() * 20 + 8, 3);
    ctx.fillRect(Math.random() * 1024, 480 + Math.random() * 25, Math.random() * 25 + 8, 3);
  }

  // 3. Night City Lights (Golden urban glow networks)
  const cityClusters = [
    { x: 265, y: 155, n: 35 }, // US East Coast
    { x: 195, y: 165, n: 25 }, // US West Coast
    { x: 520, y: 135, n: 45 }, // Western Europe
    { x: 705, y: 240, n: 38 }, // India
    { x: 800, y: 180, n: 40 }, // Japan & East Asia
    { x: 345, y: 360, n: 22 }, // Sao Paulo / Rio
    { x: 835, y: 380, n: 16 }  // Sydney / Melbourne
  ];

  cityClusters.forEach(cluster => {
    for (let c = 0; c < cluster.n; c++) {
      const cx = cluster.x + (Math.random() - 0.5) * 45;
      const cy = cluster.y + (Math.random() - 0.5) * 35;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(253, 224, 71, 0.85)' : 'rgba(245, 158, 11, 0.75)';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.random() * 1.8 + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return new THREE.CanvasTexture(canvas);
}

function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(0, 0, 256, 256);

  // Craters and lunar maria
  ctx.fillStyle = '#4b5563';
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 14 + 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright crater rays
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 4 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#7f1d1d';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 25 + 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar ice caps
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(0, 0, 256, 16);
  ctx.fillRect(0, 240, 256, 16);

  return new THREE.CanvasTexture(canvas);
}

function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 0, 512, 256);

  const colors = ['#fde68a', '#b45309', '#fed7aa', '#92400e', '#fef3c7', '#78350f'];
  let y = 0;
  while (y < 256) {
    const h = Math.random() * 14 + 6;
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(0, y, 512, h);
    y += h;
  }

  // Great Red Spot
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.ellipse(330, 160, 36, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // White storms
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * 512, Math.random() * 256, Math.random() * 16 + 8, Math.random() * 6 + 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const cx = 128;
  const cy = 128;
  ctx.clearRect(0, 0, 256, 256);

  const grad = ctx.createRadialGradient(cx, cy, 46, cx, cy, 126);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.12, 'rgba(217, 119, 6, 0.7)');
  grad.addColorStop(0.35, 'rgba(254, 243, 199, 0.9)');
  grad.addColorStop(0.48, 'rgba(180, 83, 9, 0.35)');
  grad.addColorStop(0.65, 'rgba(251, 191, 36, 0.88)');
  grad.addColorStop(0.85, 'rgba(217, 119, 6, 0.65)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 126, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// 🕳️ Black Hole Relativistic Accretion Disk Texture
function createAccretionDiskTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const cx = 256;
  const cy = 256;
  ctx.clearRect(0, 0, 512, 512);

  const grad = ctx.createRadialGradient(cx, cy, 75, cx, cy, 255);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.04, 'rgba(255, 255, 255, 1.0)'); // Photon ring edge
  grad.addColorStop(0.18, 'rgba(249, 115, 22, 0.95)'); // Superheated plasma
  grad.addColorStop(0.38, 'rgba(245, 158, 11, 0.85)');
  grad.addColorStop(0.65, 'rgba(239, 68, 68, 0.65)');
  grad.addColorStop(0.85, 'rgba(180, 83, 9, 0.35)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 255, 0, Math.PI * 2);
  ctx.fill();

  // Spiral relativistic flow lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, 80 + Math.random() * 160, 0, Math.PI * 2);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// 🪨 Ceres Dwarf Planet Cratered Surface Texture
function createCeresTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#71717a';
  ctx.fillRect(0, 0, 256, 256);

  // Surface cratering
  ctx.fillStyle = '#52525b';
  for (let i = 0; i < 45; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 16 + 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Famous bright salt spots (Occator Crater faculae)
  ctx.fillStyle = '#f4f4f5';
  ctx.beginPath();
  ctx.arc(120, 110, 5, 0, Math.PI * 2);
  ctx.arc(128, 114, 3, 0, Math.PI * 2);
  ctx.arc(114, 118, 2.5, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// ❄️ Trans-Neptunian Dwarf Ice Planet Texture (Eris, Haumea, Makemake)
function createDwarfIceTexture(baseColor: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = accentColor;
  for (let i = 0; i < 35; i++) {
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 22 + 6,
      Math.random() * 10 + 3,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Ice fractures & frost bands
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.2;
  for (let j = 0; j < 12; j++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 256, Math.random() * 256);
    ctx.lineTo(Math.random() * 256, Math.random() * 256);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

export interface MoveableGalaxyBackgroundProps {
  isWebsiteVisible?: boolean;
  onShowWebsite?: (sectionId?: string) => void;
}

export const MoveableGalaxyBackground: React.FC<MoveableGalaxyBackgroundProps> = ({
  isWebsiteVisible = false,
  onShowWebsite
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_SOLAR_ON) !== 'false';
  });
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_SOLAR_SPEED);
    return saved ? parseFloat(saved) : 1.0;
  });
  const [galaxyTheme, setGalaxyTheme] = useState<GalaxyTheme>(() => {
    const saved = localStorage.getItem(STORAGE_GALAXY_THEME) as GalaxyTheme;
    return (saved && GALAXY_THEMES[saved]) ? saved : 'grand_solar_nebula';
  });
  const [celestialMode, setCelestialMode] = useState<CelestialMode>(() => {
    const saved = localStorage.getItem(STORAGE_CELESTIAL_MODE) as CelestialMode;
    return ['solar_system', 'saturn_rings', 'mars_deep_space', 'earth_orbit'].includes(saved)
      ? saved
      : 'solar_system'; // Default to 3D Grand Solar System
  });

  const [showControls, setShowControls] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showComets, setShowComets] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  // Particles on/off state - default false for blank clean background
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_SOLAR_PARTICLES) === 'true';
  });

  // Heart particles on/off state (User requested)
  const [heartParticlesEnabled, setHeartParticlesEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_SOLAR_HEARTS);
    return saved !== null ? saved === 'true' : true;
  });

  // Heart button options migrated directly into Solar System
  const [ambientParticle, setAmbientParticle] = useState<string>(() => {
    try {
      return localStorage.getItem('birthday_particle_type_v1') || 'hearts';
    } catch (e) {
      return 'hearts';
    }
  });

  const handleSelectAmbientParticle = (type: string) => {
    setAmbientParticle(type);
    try {
      localStorage.setItem('birthday_particle_type_v1', type);
      window.dispatchEvent(new CustomEvent('particle-theme-change', { detail: type }));
    } catch (e) {}
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('particles', 'Ambient Particle Changed', `Switched particle theme to ${type} via Solar System HUD`, 'pink');
  };

  // Active HUD Tab
  const [hudTab, setHudTab] = useState<'worlds' | 'earth' | 'lighting' | 'sun_stars' | 'cursors' | 'fireworks' | 'atmosphere' | 'controls' | 'planets' | 'galaxies'>('worlds');

  // 4K Dynamic Lighting Controller & Atmospheric Bloom / Depth-of-Field
  const [cinematicBloom, setCinematicBloom] = useState<number>(() => {
    const s = localStorage.getItem('birthday_cinematic_bloom_v1');
    return s ? parseFloat(s) : 0.85;
  });
  const [depthOfField, setDepthOfField] = useState<number>(() => {
    const s = localStorage.getItem('birthday_dof_blur_v1');
    return s ? parseFloat(s) : 0.65;
  });
  const [exposureBrightness, setExposureBrightness] = useState<number>(() => {
    const s = localStorage.getItem('birthday_exposure_bright_v1');
    return s ? parseFloat(s) : 1.15;
  });
  const [saturationLevel, setSaturationLevel] = useState<number>(() => {
    const s = localStorage.getItem('birthday_saturation_v1');
    return s ? parseFloat(s) : 1.2;
  });
  const [contrastLevel, setContrastLevel] = useState<number>(() => {
    const s = localStorage.getItem('birthday_contrast_v1');
    return s ? parseFloat(s) : 110;
  });
  const [dayNightMood, setDayNightMood] = useState<'auto' | 'night' | 'day'>(() => {
    const s = localStorage.getItem('birthday_day_night_mood_v1') as 'auto' | 'night' | 'day';
    return s && ['auto', 'night', 'day'].includes(s) ? s : 'auto';
  });

  // Dedicated 3D Earth Orbit Zoom & Google Earth Rotation
  const [earthZoom, setEarthZoom] = useState<number>(() => {
    const s = localStorage.getItem('birthday_earth_zoom_v1');
    return s ? parseFloat(s) : 18.0;
  });
  const [earthAutoSpin, setEarthAutoSpin] = useState<boolean>(() => {
    return localStorage.getItem('birthday_earth_autospin_v1') !== 'false';
  });

  const earthAutoSpinRef = useRef(earthAutoSpin);
  earthAutoSpinRef.current = earthAutoSpin;
  const earthZoomRef = useRef(earthZoom);
  earthZoomRef.current = earthZoom;
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const handleUpdateBloom = (val: number) => {
    setCinematicBloom(val);
    localStorage.setItem('birthday_cinematic_bloom_v1', String(val));
  };
  const handleUpdateDof = (val: number) => {
    setDepthOfField(val);
    localStorage.setItem('birthday_dof_blur_v1', String(val));
  };
  const handleUpdateExposure = (val: number) => {
    setExposureBrightness(val);
    localStorage.setItem('birthday_exposure_bright_v1', String(val));
    if (rendererRef.current) {
      const moodMult = dayNightMood === 'day' ? 1.25 : dayNightMood === 'night' ? 0.85 : 1.0;
      rendererRef.current.toneMappingExposure = val * moodMult;
    }
  };
  const handleUpdateSaturation = (val: number) => {
    setSaturationLevel(val);
    localStorage.setItem('birthday_saturation_v1', String(val));
  };
  const handleUpdateContrast = (val: number) => {
    setContrastLevel(val);
    localStorage.setItem('birthday_contrast_v1', String(val));
  };
  const handleSelectDayNightMood = (mood: 'auto' | 'night' | 'day') => {
    setDayNightMood(mood);
    localStorage.setItem('birthday_day_night_mood_v1', mood);
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('theme', 'Dynamic Lighting Mood', `Switched lighting mood to ${mood}`, 'sky');
  };

  const handleZoomEarth = (delta: number) => {
    const nextZ = Math.max(11, Math.min(38, earthZoom + delta));
    setEarthZoom(nextZ);
    localStorage.setItem('birthday_earth_zoom_v1', String(nextZ));
    if (cameraRef.current && celestialMode === 'earth_orbit') {
      cameraRef.current.position.z = nextZ;
    }
  };

  const handleToggleEarthSpin = () => {
    const next = !earthAutoSpin;
    setEarthAutoSpin(next);
    localStorage.setItem('birthday_earth_autospin_v1', String(next));
    birthdayAudio.playSparkleChime();
  };

  // Sun & Star Customization Controls (Directly in Solar System HUD)
  const [sunScale, setSunScale] = useState<number>(() => {
    const s = localStorage.getItem('birthday_sun_scale_v5');
    return s ? parseFloat(s) : 1.0;
  });
  const [sunGlow, setSunGlow] = useState<number>(() => {
    const g = localStorage.getItem('birthday_sun_glow_v5');
    return g ? parseFloat(g) : 1.2;
  });
  const [starBrightness, setStarBrightness] = useState<number>(() => {
    const b = localStorage.getItem('birthday_star_bright_v5');
    return b ? parseFloat(b) : 1.0;
  });

  const sunScaleRef = useRef(sunScale);
  sunScaleRef.current = sunScale;
  const sunGlowRef = useRef(sunGlow);
  sunGlowRef.current = sunGlow;
  const starBrightnessRef = useRef(starBrightness);
  starBrightnessRef.current = starBrightness;

  // 4K HDR Ultra Quality Setting
  const [hdrQuality, setHdrQuality] = useState<boolean>(() => {
    return localStorage.getItem('birthday_hdr_quality_v1') !== 'false';
  });

  const toggleHdrQuality = () => {
    const next = !hdrQuality;
    setHdrQuality(next);
    localStorage.setItem('birthday_hdr_quality_v1', String(next));
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('cosmos', `4K HDR Mode: ${next ? 'ON' : 'OFF'}`, 'Toggled 4K/HDR graphics enhancement', 'sky');
  };

  // Cosmic Rain State
  const [cosmicRain, setCosmicRain] = useState<boolean>(() => {
    return localStorage.getItem('birthday_cosmic_rain_v2') === 'true';
  });

  const toggleCosmicRain = () => {
    const next = !cosmicRain;
    setCosmicRain(next);
    localStorage.setItem('birthday_cosmic_rain_v2', String(next));
    window.dispatchEvent(new CustomEvent('cosmic-rain-toggle', { detail: { enabled: next } }));
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('particles', `Cosmic Rain ${next ? 'ON' : 'OFF'}`, `Toggled gentle glowing cosmic rain via Solar System HUD`, 'sky');
  };

  // Active Mouse Cursor
  const [activeCursorId, setActiveCursorId] = useState<CursorThemeId>(() => {
    return (localStorage.getItem(CURSOR_STORAGE_KEY) as CursorThemeId) || 'tiara';
  });

  const handleSelectCursor = (id: CursorThemeId) => {
    setActiveCursorId(id);
    localStorage.setItem(CURSOR_STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent('cursor-theme-change', { detail: id }));
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('theme', 'Cursor Theme Changed', `Switched cursor theme to ${id} via Solar System HUD`, 'pink');
  };

  // Launch Shape Fireworks directly from Solar System HUD
  const handleLaunchFirework = (shape: FireworkShapeType) => {
    window.dispatchEvent(new CustomEvent('fire-shape-firework', { detail: { shape } }));
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('surprise', 'Celestial Shape Firework Launched', `Launched ${shape} firework across the sky`, 'amber');
  };

  // Currently focused planet info
  const [focusedPlanet, setFocusedPlanet] = useState<string>('sun');

  // Cosmic Portal Alignment Sequence Definition (From closest to farthest from the Sun)
  const COSMIC_PORTAL_SEQUENCE = [
    { id: 'mercury', name: 'Mercury ☿', num: 1, dist: '0.39 AU', color: '#a8a29e' },
    { id: 'venus', name: 'Venus ♀', num: 2, dist: '0.72 AU', color: '#fde047' },
    { id: 'earth', name: 'Earth 🌍', num: 3, dist: '1.00 AU', color: '#38bdf8' },
    { id: 'mars', name: 'Mars ♂', num: 4, dist: '1.52 AU', color: '#f87171' },
    { id: 'jupiter', name: 'Jupiter ♃', num: 5, dist: '5.20 AU', color: '#f59e0b' },
    { id: 'saturn', name: 'Saturn 🪐', num: 6, dist: '9.58 AU', color: '#fbbf24' },
    { id: 'uranus', name: 'Uranus ⛢', num: 7, dist: '19.22 AU', color: '#67e8f9' },
    { id: 'neptune', name: 'Neptune ♆', num: 8, dist: '30.05 AU', color: '#60a5fa' }
  ];

  // Hidden Cosmic Portal game state
  const [portalUnlocked, setPortalUnlocked] = useState<boolean>(false);
  const [showPortalModal, setShowPortalModal] = useState<boolean>(false);
  const [portalSequenceStep, setPortalSequenceStep] = useState<number>(0); // 0 to 8
  const [portalHint, setPortalHint] = useState<string | null>(null);

  // Solar system position - DEFAULT 'left' (placed on left side as requested)
  const [solarPosition, setSolarPosition] = useState<'left' | 'center' | 'right'>(() => {
    const saved = localStorage.getItem(STORAGE_SOLAR_POSITION) as 'left' | 'center' | 'right';
    return saved && ['left', 'center', 'right'].includes(saved) ? saved : 'left';
  });

  // References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const solarGroupRef = useRef<THREE.Group | null>(null);
  const starFieldRef = useRef<THREE.Points | null>(null);
  const nebulaMeshRef = useRef<THREE.Points | null>(null);
  const heartFieldRef = useRef<THREE.Points | null>(null);
  const orbitLinesGroupRef = useRef<THREE.Group | null>(null);
  const orbitStardustGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const earthCloudsRef = useRef<THREE.Mesh | null>(null);
  const saturnMeshRef = useRef<THREE.Mesh | null>(null);
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const sunCoronaRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.PointLight | null>(null);
  const portalGroupRef = useRef<THREE.Group | null>(null);
  const isPortalActiveRef = useRef<boolean>(false);
  const planetOrbitsRef = useRef<{ group: THREE.Group; speed: number; mesh: THREE.Mesh }[]>([]);
  const cometsRef = useRef<{ mesh: THREE.Mesh; speed: number; dir: THREE.Vector3 }[]>([]);

  // 3D Drag & Tap Physics State
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const pointerStartPosRef = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef({ x: 0.0012, y: 0 });

  const toggleActive = () => {
    const next = !isActive;
    setIsActive(next);
    localStorage.setItem(STORAGE_SOLAR_ON, String(next));
  };

  const toggleParticles = () => {
    const next = !particlesEnabled;
    setParticlesEnabled(next);
    localStorage.setItem(STORAGE_SOLAR_PARTICLES, String(next));
    if (starFieldRef.current) starFieldRef.current.visible = next;
    if (nebulaMeshRef.current) nebulaMeshRef.current.visible = next;
    activityTracker.logEvent('cosmos', `Cosmic Particles: ${next ? 'ON' : 'OFF'}`, `Switched background particles to ${next ? 'visible' : 'blank/clean'}`, 'sky');
  };

  const toggleHeartParticles = () => {
    const next = !heartParticlesEnabled;
    setHeartParticlesEnabled(next);
    localStorage.setItem(STORAGE_SOLAR_HEARTS, String(next));
    if (heartFieldRef.current) heartFieldRef.current.visible = next;
    activityTracker.logEvent('cosmos', `Heart Particles: ${next ? 'ON' : 'OFF'}`, `Toggled 3D heart particles`, 'pink');
  };

  const toggleSolarPosition = (pos?: 'left' | 'center' | 'right') => {
    let next: 'left' | 'center' | 'right';
    if (pos) {
      next = pos;
    } else {
      next = solarPosition === 'left' ? 'center' : solarPosition === 'center' ? 'right' : 'left';
    }
    setSolarPosition(next);
    localStorage.setItem(STORAGE_SOLAR_POSITION, next);
    if (solarGroupRef.current) {
      const targetX = next === 'left' ? (window.innerWidth > 768 ? -24 : -10) : next === 'right' ? (window.innerWidth > 768 ? 24 : 10) : 0;
      solarGroupRef.current.position.x = targetX;
    }
    birthdayAudio.playTactileBalloonButtonPop(0.9);
    activityTracker.logEvent('cosmos', 'Solar System Position', `Moved Solar System to ${next}`, 'sky');
  };

  // Cosmic Portal Planetary Alignment Handler
  const handleCosmicPlanetClick = (planetId: string) => {
    const targetId = planetId.toLowerCase();
    const expected = COSMIC_PORTAL_SEQUENCE[portalSequenceStep];

    if (expected && targetId === expected.id) {
      const nextStep = portalSequenceStep + 1;
      setPortalSequenceStep(nextStep);
      birthdayAudio.playCosmicAlignmentNote(nextStep);
      setPortalHint(`✨ Correct! Aligned ${expected.name} (${nextStep}/8)`);

      if (nextStep === COSMIC_PORTAL_SEQUENCE.length) {
        setPortalUnlocked(true);
        setShowPortalModal(true);
        isPortalActiveRef.current = true;
        if (portalGroupRef.current) portalGroupRef.current.visible = true;
        birthdayAudio.playCosmicPortalOpen();
        triggerFireworks(7000);
        triggerHeartShower();
        triggerRealisticConfetti();
        activityTracker.logEvent('surprise', 'Cosmic Portal Unlocked! 🌌', 'Alihaaa aligned all 8 planets in true celestial harmony!', 'amber');
      }
    } else {
      if (targetId === 'mercury') {
        setPortalSequenceStep(1);
        birthdayAudio.playCosmicAlignmentNote(1);
        setPortalHint(`✨ Started fresh with Mercury ☿ (1/8)! Next is Venus ♀.`);
      } else {
        setPortalSequenceStep(0);
        birthdayAudio.playTactileBalloonButtonPop(0.75);
        setPortalHint(`Cosmic alignment sequence reset. Tip: Start from Mercury (closest to Sun) and move outwards!`);
      }
    }
  };

  const changeGalaxyTheme = (theme: GalaxyTheme) => {
    setGalaxyTheme(theme);
    localStorage.setItem(STORAGE_GALAXY_THEME, theme);
  };

  const changeCelestialMode = (mode: CelestialMode) => {
    setCelestialMode(mode);
    localStorage.setItem(STORAGE_CELESTIAL_MODE, mode);
    activityTracker.logEvent('cosmos', `Celestial Mode: ${mode}`, `User switched to ${mode} mode`, 'purple');
  };

  const setSpeed = (val: number) => {
    setSpeedMultiplier(val);
    localStorage.setItem(STORAGE_SOLAR_SPEED, String(val));
  };

  // Preset Camera Angles for All Celestial Bodies
  const setCameraFocus = (type: 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'ceres' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'haumea' | 'makemake' | 'eris' | 'sedna' | 'asteroid_belt' | 'topdown' | 'reset') => {
    setFocusedPlanet(type);
    if (!solarGroupRef.current || !cameraRef.current) return;

    if (type === 'reset' || type === 'sun') {
      solarGroupRef.current.rotation.set(0.42, 0, 0);
      cameraRef.current.position.set(0, 42, 78);
      cameraRef.current.lookAt(0, 0, 0);
      velocityRef.current = { x: 0.0012, y: 0 };
    } else if (type === 'mercury') {
      solarGroupRef.current.rotation.set(0.25, 0.4, 0);
      cameraRef.current.position.set(0, 14, 28);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'venus') {
      solarGroupRef.current.rotation.set(0.22, 0.8, 0);
      cameraRef.current.position.set(0, 18, 34);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'earth') {
      solarGroupRef.current.rotation.set(0.2, 1.2, 0);
      cameraRef.current.position.set(0, 12, celestialMode === 'earth_orbit' ? earthZoomRef.current : 36);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'mars') {
      solarGroupRef.current.rotation.set(0.3, 0.6, 0);
      cameraRef.current.position.set(0, 24, 48);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'ceres' || type === 'asteroid_belt') {
      solarGroupRef.current.rotation.set(0.32, 0.2, 0);
      cameraRef.current.position.set(0, 26, 52);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'jupiter') {
      solarGroupRef.current.rotation.set(0.35, -0.4, 0);
      cameraRef.current.position.set(0, 30, 64);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'saturn') {
      solarGroupRef.current.rotation.set(0.5, -0.8, 0);
      cameraRef.current.position.set(0, 32, 72);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'uranus') {
      solarGroupRef.current.rotation.set(0.4, 1.4, 0);
      cameraRef.current.position.set(0, 36, 84);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'neptune') {
      solarGroupRef.current.rotation.set(0.45, -1.2, 0);
      cameraRef.current.position.set(0, 40, 96);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'pluto') {
      solarGroupRef.current.rotation.set(0.38, 0.9, 0);
      cameraRef.current.position.set(0, 44, 108);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'haumea' || type === 'makemake' || type === 'eris' || type === 'sedna') {
      solarGroupRef.current.rotation.set(0.42, 1.1, 0);
      cameraRef.current.position.set(0, 48, 118);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (type === 'topdown') {
      solarGroupRef.current.rotation.set(Math.PI / 2.2, 0, 0);
      cameraRef.current.position.set(0, 98, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const activeGalaxy = GALAXY_THEMES[galaxyTheme];

    // 1. SCENE SETUP WITH DYNAMIC LIGHTING / DAY-NIGHT MOOD
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    let sceneBg = activeGalaxy.bgColor;
    let sceneFog = activeGalaxy.fogColor;
    if (dayNightMood === 'night') {
      sceneBg = 0x000206;
      sceneFog = 0x01030a;
    } else if (dayNightMood === 'day') {
      sceneBg = activeGalaxy.bgColor;
      sceneFog = activeGalaxy.fogColor;
    }
    scene.background = new THREE.Color(sceneBg);
    scene.fog = new THREE.FogExp2(sceneFog, dayNightMood === 'night' ? 0.0055 : 0.0042);

    // 2. CAMERA SETUP
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1200);
    if (celestialMode === 'earth_orbit') {
      camera.position.set(0, 4.5, earthZoomRef.current);
    } else {
      camera.position.set(0, 42, 78);
    }
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. RENDERER WITH 4K ACES FILMIC TONE MAPPING & DYNAMIC EXPOSURE
    const isMobile = window.innerWidth < 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const moodExposureMult = dayNightMood === 'day' ? 1.25 : dayNightMood === 'night' ? 0.85 : 1.0;
    renderer.toneMappingExposure = exposureBrightness * moodExposureMult;
    container.appendChild(renderer.domElement);

    // 4. ROUND STARFIELD SPRITES (ELIMINATES SQUARE PARTICLES)
    const particleTexture = createRoundParticleTexture();
    const starCount = isMobile ? 650 : 2200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const baseStarColor = new THREE.Color(activeGalaxy.starColor);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const rad = 240 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i3] = rad * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = rad * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.8) {
        starColors[i3] = 0.65;
        starColors[i3 + 1] = 0.82;
        starColors[i3 + 2] = 1.0;
      } else if (tint > 0.6) {
        starColors[i3] = 1.0;
        starColors[i3 + 1] = 0.88;
        starColors[i3 + 2] = 0.72;
      } else {
        starColors[i3] = baseStarColor.r;
        starColors[i3 + 1] = baseStarColor.g;
        starColors[i3 + 2] = baseStarColor.b;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const starField = new THREE.Points(starGeo, starMat);
    starField.visible = particlesEnabled;
    starFieldRef.current = starField;
    scene.add(starField);

    // 5. SMOOTH NEBULAR DUST CLOUDS (ROUND SPRITES, NO SQUARES)
    const nebulaCount = isMobile ? 220 : 800;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaCols = new Float32Array(nebulaCount * 3);
    const col1 = new THREE.Color(activeGalaxy.nebulaColor1);
    const col2 = new THREE.Color(activeGalaxy.nebulaColor2);

    for (let i = 0; i < nebulaCount; i++) {
      const i3 = i * 3;
      nebulaPos[i3] = (Math.random() - 0.5) * 260;
      nebulaPos[i3 + 1] = (Math.random() - 0.5) * 70 - 15;
      nebulaPos[i3 + 2] = (Math.random() - 0.5) * 260;

      const mix = Math.random();
      nebulaCols[i3] = THREE.MathUtils.lerp(col1.r, col2.r, mix);
      nebulaCols[i3 + 1] = THREE.MathUtils.lerp(col1.g, col2.g, mix);
      nebulaCols[i3 + 2] = THREE.MathUtils.lerp(col1.b, col2.b, mix);
    }
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaCols, 3));

    const nebulaMat = new THREE.PointsMaterial({
      size: 16.0,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const nebulaMesh = new THREE.Points(nebulaGeo, nebulaMat);
    nebulaMesh.visible = particlesEnabled;
    nebulaMeshRef.current = nebulaMesh;
    scene.add(nebulaMesh);

    // 6. FLOATING 3D HEART PARTICLES FIELD (User Request: Heart Particles Toggle)
    const heartCount = isMobile ? 50 : 180;
    const heartGeo = new THREE.BufferGeometry();
    const heartPos = new Float32Array(heartCount * 3);
    const heartColors = new Float32Array(heartCount * 3);
    for (let i = 0; i < heartCount; i++) {
      const i3 = i * 3;
      heartPos[i3] = (Math.random() - 0.5) * 220;
      heartPos[i3 + 1] = (Math.random() - 0.5) * 120;
      heartPos[i3 + 2] = (Math.random() - 0.5) * 220;

      const hChoice = Math.random();
      if (hChoice > 0.6) {
        heartColors[i3] = 0.98; heartColors[i3 + 1] = 0.28; heartColors[i3 + 2] = 0.52;
      } else if (hChoice > 0.3) {
        heartColors[i3] = 0.95; heartColors[i3 + 1] = 0.45; heartColors[i3 + 2] = 0.68;
      } else {
        heartColors[i3] = 0.99; heartColors[i3 + 1] = 0.72; heartColors[i3 + 2] = 0.82;
      }
    }
    heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
    heartGeo.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));

    const heartMat = new THREE.PointsMaterial({
      size: 8.5,
      map: createHeartParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const heartField = new THREE.Points(heartGeo, heartMat);
    heartField.visible = heartParticlesEnabled;
    heartFieldRef.current = heartField;
    scene.add(heartField);

    // 7. MAIN CELESTIAL GROUP (Positioned on Left Side as Requested by Default)
    const solarGroup = new THREE.Group();
    solarGroup.rotation.x = 0.38;
    const defaultX = solarPosition === 'left' ? (window.innerWidth > 768 ? -24 : -10) : solarPosition === 'right' ? (window.innerWidth > 768 ? 24 : 10) : 0;
    solarGroup.position.set(defaultX, 0, 0);
    scene.add(solarGroup);
    solarGroupRef.current = solarGroup;

    // Orbit Lines Group
    const orbitLinesGroup = new THREE.Group();
    solarGroup.add(orbitLinesGroup);
    orbitLinesGroupRef.current = orbitLinesGroup;

    // Orbit Trailing Stardust Particles Group
    const orbitStardustGroup = new THREE.Group();
    solarGroup.add(orbitStardustGroup);
    orbitStardustGroupRef.current = orbitStardustGroup;

    // Key Space Sunlight
    const sunKeyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunKeyLight.position.set(-60, 35, 50);
    solarGroup.add(sunKeyLight);

    // =========================================================================
    // 🌍 8. CELESTIAL PHENOMENON 1: DEDICATED 3D EARTH VIEW (BLUE MARBLE)
    // =========================================================================
    if (celestialMode === 'earth_orbit') {
      const earthRadius = 9.2;
      const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
      const earthMat = new THREE.MeshStandardMaterial({
        map: createEarthTexture(),
        roughness: 0.42,
        metalness: 0.08
      });
      const earthMesh = new THREE.Mesh(earthGeo, earthMat);
      solarGroup.add(earthMesh);
      earthMeshRef.current = earthMesh;

      // Atmospheric Clouds Layer (Swirling tropical cyclones and weather fronts)
      const cloudGeo = new THREE.SphereGeometry(earthRadius * 1.026, 64, 64);
      const cloudMat = new THREE.MeshBasicMaterial({
        map: createAtmosphereCloudsTexture(),
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      earthMesh.add(cloudMesh);
      earthCloudsRef.current = cloudMesh;

      // Atmospheric Rayleigh scattering azure haze
      const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.075, 48, 48);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.38,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      earthMesh.add(atmosMesh);

      // Orbiting Moon
      const moonPivot = new THREE.Group();
      solarGroup.add(moonPivot);
      moonGroupRef.current = moonPivot;

      const moonGeo = new THREE.SphereGeometry(2.0, 32, 32);
      const moonMat = new THREE.MeshStandardMaterial({
        map: createMoonTexture(),
        roughness: 0.85
      });
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);
      moonMesh.position.x = 22.0;
      moonPivot.add(moonMesh);

      // Moon Orbit Ring
      const moonOrbitCurve = new THREE.EllipseCurve(0, 0, 22.0, 22.0, 0, 2 * Math.PI, false, 0);
      const moonPts = moonOrbitCurve.getPoints(96);
      const moonOrbitGeo = new THREE.BufferGeometry().setFromPoints(
        moonPts.map(pt => new THREE.Vector3(pt.x, 0, pt.y))
      );
      const moonOrbitMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25
      });
      const moonOrbitLine = new THREE.Line(moonOrbitGeo, moonOrbitMat);
      orbitLinesGroup.add(moonOrbitLine);
    }

    // =========================================================================
    // ✨ 9. CELESTIAL PHENOMENON 2: SATURN GOLDEN RING WORLD
    // =========================================================================
    if (celestialMode === 'saturn_rings') {
      const saturnRadius = 6.4;
      const saturnGeo = new THREE.SphereGeometry(saturnRadius, 64, 64);
      const saturnMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.55,
        metalness: 0.15
      });
      const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
      solarGroup.add(saturnMesh);
      saturnMeshRef.current = saturnMesh;

      // Concentric Saturn Rings
      const ringGeo = new THREE.RingGeometry(saturnRadius * 1.35, saturnRadius * 2.8, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        map: createSaturnRingTexture(),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      saturnMesh.add(ringMesh);

      // Orbiting Moons (Titan)
      const titanPivot = new THREE.Group();
      solarGroup.add(titanPivot);
      moonGroupRef.current = titanPivot;

      const titanGeo = new THREE.SphereGeometry(1.2, 24, 24);
      const titanMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.7 });
      const titanMesh = new THREE.Mesh(titanGeo, titanMat);
      titanMesh.position.x = 22.0;
      titanPivot.add(titanMesh);
    }

    // =========================================================================
    // 🔴 10. CELESTIAL PHENOMENON 3: CRIMSON MARS DEEP SPACE
    // =========================================================================
    if (celestialMode === 'mars_deep_space') {
      const marsRadius = 6.0;
      const marsGeo = new THREE.SphereGeometry(marsRadius, 64, 64);
      const marsMat = new THREE.MeshStandardMaterial({
        map: createMarsTexture(),
        roughness: 0.65,
        metalness: 0.1
      });
      const marsMesh = new THREE.Mesh(marsGeo, marsMat);
      solarGroup.add(marsMesh);
      marsMeshRef.current = marsMesh;

      // Rust Atmosphere Glow
      const marsAtmosGeo = new THREE.SphereGeometry(marsRadius * 1.06, 32, 32);
      const marsAtmosMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const marsAtmos = new THREE.Mesh(marsAtmosGeo, marsAtmosMat);
      marsMesh.add(marsAtmos);

      // Orbiting Moons (Phobos)
      const phobosPivot = new THREE.Group();
      solarGroup.add(phobosPivot);
      moonGroupRef.current = phobosPivot;

      const phobosGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const phobosMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.9 });
      const phobosMesh = new THREE.Mesh(phobosGeo, phobosMat);
      phobosMesh.position.x = 14.0;
      phobosPivot.add(phobosMesh);
    }

    // =========================================================================
    // ☀️ 9. SOLAR SYSTEM (ALL PLANETS + SUN + MOON)
    // =========================================================================
    let sunMesh: THREE.Mesh | null = null;

    if (celestialMode === 'solar_system') {
      const sunRadius = 5.3;
      const sunGeo = new THREE.SphereGeometry(sunRadius, 48, 48);
      const sunMat = new THREE.MeshBasicMaterial({
        map: createSunTexture(galaxyTheme)
      });
      sunMesh = new THREE.Mesh(sunGeo, sunMat);
      solarGroup.add(sunMesh);
      sunMeshRef.current = sunMesh;

      // Sun Outer Corona Flare (Glow halo with dynamic pulse)
      const coronaGeo = new THREE.SphereGeometry(sunRadius * 1.35, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: activeGalaxy.sunEmissive,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      sunMesh.add(coronaMesh);
      sunCoronaRef.current = coronaMesh;

      // Sun Outer Ethereal Halo Aura
      const outerHaloGeo = new THREE.SphereGeometry(sunRadius * 1.75, 24, 24);
      const outerHaloMat = new THREE.MeshBasicMaterial({
        color: 0xffaa33,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const outerHaloMesh = new THREE.Mesh(outerHaloGeo, outerHaloMat);
      sunMesh.add(outerHaloMesh);

      // Sun Illumination Point Light
      const sunLight = new THREE.PointLight(0xfff7ed, 3.4, 380, 0.4);
      sunLight.position.set(0, 0, 0);
      solarGroup.add(sunLight);
      sunLightRef.current = sunLight;

      // 🌀 3D HIDDEN COSMIC PORTAL (Awakens at the center of the Solar System when all planets align)
      const portalGroup = new THREE.Group();
      portalGroup.visible = isPortalActiveRef.current;
      solarGroup.add(portalGroup);
      portalGroupRef.current = portalGroup;

      // Concentric Celestial Rings
      [
        { radius: 6.8, color: 0xa855f7, rotX: Math.PI / 2 },
        { radius: 8.4, color: 0xec4899, rotX: Math.PI / 2.3 },
        { radius: 10.2, color: 0x38bdf8, rotX: Math.PI / 1.8 }
      ].forEach(ring => {
        const ringGeo = new THREE.TorusGeometry(ring.radius, 0.22, 16, 96);
        const ringMat = new THREE.MeshBasicMaterial({
          color: ring.color,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = ring.rotX;
        portalGroup.add(ringMesh);
      });

      // Swirling Portal Particle Vortex
      const vortexCount = isMobile ? 100 : 360;
      const vortexGeo = new THREE.BufferGeometry();
      const vortexPos = new Float32Array(vortexCount * 3);
      const vortexColors = new Float32Array(vortexCount * 3);
      const colA = new THREE.Color(0xa855f7);
      const colB = new THREE.Color(0x38bdf8);

      for (let i = 0; i < vortexCount; i++) {
        const angle = (i / vortexCount) * Math.PI * 8;
        const dist = 3.5 + (i / vortexCount) * 8.5;
        vortexPos[i * 3] = Math.cos(angle) * dist;
        vortexPos[i * 3 + 1] = (i / vortexCount) * 4.0 - 2.0;
        vortexPos[i * 3 + 2] = Math.sin(angle) * dist;

        const lerpCol = colA.clone().lerp(colB, Math.random());
        vortexColors[i * 3] = lerpCol.r;
        vortexColors[i * 3 + 1] = lerpCol.g;
        vortexColors[i * 3 + 2] = lerpCol.b;
      }
      vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPos, 3));
      vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3));
      const vortexMat = new THREE.PointsMaterial({
        size: 0.65,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const vortexPoints = new THREE.Points(vortexGeo, vortexMat);
      portalGroup.add(vortexPoints);
    }

    const ambientSpaceLight = new THREE.AmbientLight(0x384252, 0.6);
    scene.add(ambientSpaceLight);

    // Planetary Configurations (All 8 Primary Planets + Dwarf Planets + Belts)
    interface PlanetData {
      name: string;
      radius: number;
      distance: number;
      speed: number;
      color?: number;
      emissive?: number;
      isEarth?: boolean;
      isMars?: boolean;
      isCeres?: boolean;
      isJupiter?: boolean;
      isSaturn?: boolean;
      isUranus?: boolean;
      isNeptune?: boolean;
      isPluto?: boolean;
      isHaumea?: boolean;
      isMakemake?: boolean;
      isEris?: boolean;
      isSedna?: boolean;
      hasRings?: boolean;
    }

    const planets: PlanetData[] = [
      { name: 'Mercury', radius: 0.7, distance: 9.5, speed: 4.15, color: 0xa8a29e },
      { name: 'Venus', radius: 1.25, distance: 13.5, speed: 1.62, color: 0xfde047, emissive: 0x854d0e },
      { name: 'Earth', radius: 1.45, distance: 19.5, speed: 1.0, isEarth: true },
      { name: 'Mars', radius: 0.95, distance: 25.5, speed: 0.53, isMars: true },
      { name: 'Ceres', radius: 0.55, distance: 30.5, speed: 0.44, isCeres: true, color: 0x71717a },
      { name: 'Jupiter', radius: 3.6, distance: 38.0, speed: 0.28, isJupiter: true },
      { name: 'Saturn', radius: 2.9, distance: 49.5, speed: 0.18, color: 0xfbbf24, hasRings: true, isSaturn: true },
      { name: 'Uranus', radius: 1.85, distance: 60.5, speed: 0.12, isUranus: true, color: 0x38bdf8, emissive: 0x0284c7 },
      { name: 'Neptune', radius: 1.75, distance: 70.0, speed: 0.08, isNeptune: true, color: 0x3b82f6, emissive: 0x1d4ed8 },
      { name: 'Pluto', radius: 0.55, distance: 78.5, speed: 0.05, isPluto: true, color: 0xd6d3d1 },
      { name: 'Haumea', radius: 0.48, distance: 85.5, speed: 0.038, isHaumea: true, color: 0xf1f5f9 },
      { name: 'Makemake', radius: 0.52, distance: 92.5, speed: 0.031, isMakemake: true, color: 0xfb923c },
      { name: 'Eris', radius: 0.60, distance: 100.0, speed: 0.024, isEris: true, color: 0xe2e8f0 },
      { name: 'Sedna', radius: 0.48, distance: 108.0, speed: 0.017, isSedna: true, color: 0xf87171 }
    ];

    const planetList: { group: THREE.Group; speed: number; mesh: THREE.Mesh }[] = [];

    if (celestialMode === 'solar_system') {
      // 🪨 1. THE MAIN ASTEROID BELT (Between Mars 25.5 & Jupiter 38.0)
      const asteroidBeltCount = isMobile ? 320 : 1400;
      const asteroidGeo = new THREE.BufferGeometry();
      const asteroidPos = new Float32Array(asteroidBeltCount * 3);
      const asteroidColors = new Float32Array(asteroidBeltCount * 3);

      for (let a = 0; a < asteroidBeltCount; a++) {
        const a3 = a * 3;
        const aAngle = Math.random() * Math.PI * 2;
        const aRad = 27.5 + Math.random() * 5.8;
        asteroidPos[a3] = Math.cos(aAngle) * aRad;
        asteroidPos[a3 + 1] = (Math.random() - 0.5) * 1.8;
        asteroidPos[a3 + 2] = Math.sin(aAngle) * aRad;

        const shade = 0.5 + Math.random() * 0.4;
        asteroidColors[a3] = shade * 0.85;
        asteroidColors[a3 + 1] = shade * 0.82;
        asteroidColors[a3 + 2] = shade * 0.80;
      }
      asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPos, 3));
      asteroidGeo.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));
      const asteroidMat = new THREE.PointsMaterial({
        size: isMobile ? 0.75 : 0.55,
        vertexColors: true,
        transparent: true,
        opacity: 0.75
      });
      const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
      solarGroup.add(asteroidBelt);

      // ❄️ 2. THE KUIPER BELT FIELD (Beyond Neptune & Pluto, from 75 to 115)
      const kuiperCount = isMobile ? 360 : 1600;
      const kuiperGeo = new THREE.BufferGeometry();
      const kuiperPos = new Float32Array(kuiperCount * 3);
      const kuiperColors = new Float32Array(kuiperCount * 3);

      for (let k = 0; k < kuiperCount; k++) {
        const k3 = k * 3;
        const kAngle = Math.random() * Math.PI * 2;
        const kRad = 76.0 + Math.random() * 38.0;
        kuiperPos[k3] = Math.cos(kAngle) * kRad;
        kuiperPos[k3 + 1] = (Math.random() - 0.5) * 3.5;
        kuiperPos[k3 + 2] = Math.sin(kAngle) * kRad;

        kuiperColors[k3] = 0.7 + Math.random() * 0.3;
        kuiperColors[k3 + 1] = 0.85 + Math.random() * 0.15;
        kuiperColors[k3 + 2] = 1.0;
      }
      kuiperGeo.setAttribute('position', new THREE.BufferAttribute(kuiperPos, 3));
      kuiperGeo.setAttribute('color', new THREE.BufferAttribute(kuiperColors, 3));
      const kuiperMat = new THREE.PointsMaterial({
        size: 0.45,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const kuiperBelt = new THREE.Points(kuiperGeo, kuiperMat);
      solarGroup.add(kuiperBelt);

      planets.forEach(p => {
        // Orbit Line Ring
        const orbitCurve = new THREE.EllipseCurve(0, 0, p.distance, p.distance, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(isMobile ? 36 : 96);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map(pt => new THREE.Vector3(pt.x, 0, pt.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: activeGalaxy.id === 'rose_gold_galaxy' ? 0xf472b6 : 0x38bdf8,
          transparent: true,
          opacity: 0.22
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbitLinesGroup.add(orbitLine);

        // Trailing Stardust Particles along each planet's orbit
        const stardustCount = isMobile ? 12 : Math.floor(45 + p.distance * 1.6);
        const stardustGeo = new THREE.BufferGeometry();
        const stardustPos = new Float32Array(stardustCount * 3);
        const stardustColors = new Float32Array(stardustCount * 3);
        const baseCol = new THREE.Color(
          p.color ? p.color : (activeGalaxy.id === 'rose_gold_galaxy' ? 0xf472b6 : 0x7dd3fc)
        );

        for (let s = 0; s < stardustCount; s++) {
          const sAngle = (s / stardustCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
          const sRad = p.distance + (Math.random() - 0.5) * 0.65;
          stardustPos[s * 3] = Math.cos(sAngle) * sRad;
          stardustPos[s * 3 + 1] = (Math.random() - 0.5) * 0.45;
          stardustPos[s * 3 + 2] = Math.sin(sAngle) * sRad;

          stardustColors[s * 3] = baseCol.r * (0.8 + Math.random() * 0.35);
          stardustColors[s * 3 + 1] = baseCol.g * (0.8 + Math.random() * 0.35);
          stardustColors[s * 3 + 2] = baseCol.b * (0.8 + Math.random() * 0.35);
        }
        stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPos, 3));
        stardustGeo.setAttribute('color', new THREE.BufferAttribute(stardustColors, 3));
        const stardustMat = new THREE.PointsMaterial({
          size: 0.48,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const stardustPoints = new THREE.Points(stardustGeo, stardustMat);
        orbitStardustGroup.add(stardustPoints);

        // Planet Orbit Pivot Group
        const orbitGroup = new THREE.Group();
        solarGroup.add(orbitGroup);
        orbitGroup.rotation.y = Math.random() * Math.PI * 2;

        // Planet Mesh
        const pGeo = new THREE.SphereGeometry(p.radius, 32, 32);
        let pMat: THREE.Material;

        if (p.isEarth) {
          pMat = new THREE.MeshStandardMaterial({
            map: createEarthTexture(),
            roughness: 0.5,
            metalness: 0.1
          });
        } else if (p.isMars) {
          pMat = new THREE.MeshStandardMaterial({
            map: createMarsTexture(),
            roughness: 0.7,
            metalness: 0.1
          });
        } else if (p.isCeres) {
          pMat = new THREE.MeshStandardMaterial({
            map: createCeresTexture(),
            roughness: 0.85
          });
        } else if (p.isJupiter) {
          pMat = new THREE.MeshStandardMaterial({
            map: createJupiterTexture(),
            roughness: 0.6,
            metalness: 0.1
          });
        } else if (p.isHaumea) {
          pMat = new THREE.MeshStandardMaterial({
            map: createDwarfIceTexture('#f1f5f9', '#94a3b8'),
            roughness: 0.45
          });
        } else if (p.isMakemake) {
          pMat = new THREE.MeshStandardMaterial({
            map: createDwarfIceTexture('#ea580c', '#7c2d12'),
            roughness: 0.6
          });
        } else if (p.isEris) {
          pMat = new THREE.MeshStandardMaterial({
            map: createDwarfIceTexture('#e2e8f0', '#64748b'),
            roughness: 0.5
          });
        } else if (p.isSedna) {
          pMat = new THREE.MeshStandardMaterial({
            map: createDwarfIceTexture('#dc2626', '#450a0a'),
            roughness: 0.65
          });
        } else {
          pMat = new THREE.MeshStandardMaterial({
            color: p.color || 0xcccccc,
            emissive: p.emissive || 0x000000,
            roughness: 0.7,
            metalness: 0.1
          });
        }

        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.x = p.distance;
        pMesh.userData = { planetId: p.name.toLowerCase(), planetName: p.name };
        orbitGroup.add(pMesh);

        // 🌍 EARTH & MOON
        if (p.isEarth) {
          earthMeshRef.current = pMesh;

          // Atmospheric rim glow
          const atmosGeo = new THREE.SphereGeometry(p.radius * 1.08, 32, 32);
          const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.25,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
          });
          const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
          pMesh.add(atmosMesh);

          // Orbiting Moon
          const moonPivot = new THREE.Group();
          pMesh.add(moonPivot);
          moonGroupRef.current = moonPivot;

          const moonGeo = new THREE.SphereGeometry(0.32, 20, 20);
          const moonMat = new THREE.MeshStandardMaterial({
            map: createMoonTexture(),
            roughness: 0.8
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.x = 2.1;
          moonPivot.add(moonMesh);
        }

        // 🔴 MARS MOONS (Phobos & Deimos)
        if (p.isMars) {
          const marsMoonPivot = new THREE.Group();
          pMesh.add(marsMoonPivot);
          const phobosGeo = new THREE.SphereGeometry(0.18, 12, 12);
          const phobosMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.9 });
          const phobosMesh = new THREE.Mesh(phobosGeo, phobosMat);
          phobosMesh.position.x = 1.45;
          marsMoonPivot.add(phobosMesh);
        }

        // ♃ JUPITER 4 GALILEAN MOONS (Io, Europa, Ganymede, Callisto)
        if (p.isJupiter) {
          const jupMoonsPivot = new THREE.Group();
          pMesh.add(jupMoonsPivot);
          const moonConfigs = [
            { name: 'Io', rad: 0.22, dist: 4.8, col: 0xfef08a },
            { name: 'Europa', rad: 0.2, dist: 5.6, col: 0xe0f2fe },
            { name: 'Ganymede', rad: 0.32, dist: 6.8, col: 0xd4d4d8 },
            { name: 'Callisto', rad: 0.28, dist: 8.0, col: 0x71717a }
          ];
          moonConfigs.forEach(m => {
            const mGeo = new THREE.SphereGeometry(m.rad, 16, 16);
            const mMat = new THREE.MeshStandardMaterial({ color: m.col, roughness: 0.7 });
            const mMesh = new THREE.Mesh(mGeo, mMat);
            mMesh.position.x = m.dist;
            jupMoonsPivot.add(mMesh);
          });
        }

        // 🪐 SATURN 3D RINGS & TITAN
        if (p.hasRings) {
          saturnMeshRef.current = pMesh;
          const ringGeo = new THREE.RingGeometry(p.radius * 1.35, p.radius * 2.6, 64);
          const ringMat = new THREE.MeshBasicMaterial({
            map: createSaturnRingTexture(),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.92
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2.3;
          pMesh.add(ringMesh);

          // Titan Moon
          const saturnMoonPivot = new THREE.Group();
          pMesh.add(saturnMoonPivot);
          const titanGeo = new THREE.SphereGeometry(0.3, 16, 16);
          const titanMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 });
          const titanMesh = new THREE.Mesh(titanGeo, titanMat);
          titanMesh.position.x = 5.2;
          saturnMoonPivot.add(titanMesh);
        }

        // ⛢ URANUS THIN RING & TITANIA
        if (p.isUranus) {
          const uRingGeo = new THREE.RingGeometry(p.radius * 1.25, p.radius * 1.6, 48);
          const uRingMat = new THREE.MeshBasicMaterial({
            color: 0x7dd3fc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
          });
          const uRing = new THREE.Mesh(uRingGeo, uRingMat);
          uRing.rotation.x = Math.PI / 1.8;
          pMesh.add(uRing);
        }

        // ♆ NEPTUNE MOON (Triton)
        if (p.isNeptune) {
          const nepPivot = new THREE.Group();
          pMesh.add(nepPivot);
          const tritonGeo = new THREE.SphereGeometry(0.24, 14, 14);
          const tritonMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.7 });
          const tritonMesh = new THREE.Mesh(tritonGeo, tritonMat);
          tritonMesh.position.x = 3.2;
          nepPivot.add(tritonMesh);
        }

        // ♇ PLUTO MOON (Charon)
        if (p.isPluto) {
          const plutoPivot = new THREE.Group();
          pMesh.add(plutoPivot);
          const charonGeo = new THREE.SphereGeometry(0.25, 14, 14);
          const charonMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.8 });
          const charonMesh = new THREE.Mesh(charonGeo, charonMat);
          charonMesh.position.x = 1.2;
          plutoPivot.add(charonMesh);
        }

        planetList.push({ group: orbitGroup, speed: p.speed, mesh: pMesh });
      });
    }

    planetOrbitsRef.current = planetList;

    // 10. CELESTIAL SHOOTING COMETS
    const comets: { mesh: THREE.Mesh; speed: number; dir: THREE.Vector3 }[] = [];
    for (let c = 0; c < 4; c++) {
      const cometGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const cometMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.85
      });
      const cometMesh = new THREE.Mesh(cometGeo, cometMat);
      cometMesh.position.set(
        (Math.random() - 0.5) * 140,
        Math.random() * 40 + 10,
        (Math.random() - 0.5) * 140
      );
      scene.add(cometMesh);
      comets.push({
        mesh: cometMesh,
        speed: Math.random() * 0.4 + 0.3,
        dir: new THREE.Vector3(-0.8, -0.3, -0.5).normalize()
      });
    }
    cometsRef.current = comets;

    // 11. ANIMATION LOOP
    let animationFrameId: number;
    let isVisible = true;

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const currentSpeed = speedMultiplier;

      // Rotate Planets
      planetList.forEach(item => {
        item.group.rotation.y += 0.003 * item.speed * currentSpeed;
        item.mesh.rotation.y += 0.015 * currentSpeed;
      });

      // Earth & Cloud Revolutions
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += 0.0035 * currentSpeed;
      }
      if (earthCloudsRef.current) {
        earthCloudsRef.current.rotation.y += 0.0048 * currentSpeed;
      }

      // Moon / Satellite Orbit
      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.y += 0.018 * currentSpeed;
      }

      // Saturn & Mars Rotation
      if (saturnMeshRef.current) {
        saturnMeshRef.current.rotation.y += 0.004 * currentSpeed;
      }
      if (marsMeshRef.current) {
        marsMeshRef.current.rotation.y += 0.0035 * currentSpeed;
      }

      // ☀️ Sun Subtle Glowing Heartbeat Pulse Animation & Rotation
      if (sunMesh) {
        sunMesh.rotation.y += 0.0015 * currentSpeed;
        const pulse = Math.sin(Date.now() * 0.0024);
        const curScale = (1.0 + pulse * 0.035) * sunScaleRef.current;
        sunMesh.scale.set(curScale, curScale, curScale);

        if (sunCoronaRef.current) {
          const coronaScale = (1.35 + pulse * 0.08) * sunScaleRef.current;
          sunCoronaRef.current.scale.set(coronaScale, coronaScale, coronaScale);
          const mat = sunCoronaRef.current.material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = (0.32 + pulse * 0.12) * (sunGlowRef.current / 1.2);
          }
        }

        if (sunLightRef.current) {
          sunLightRef.current.intensity = (3.4 + pulse * 0.8) * (sunGlowRef.current / 1.2);
        }
      }

      // Trailing Orbit Stardust Particles Gentle Drift
      if (orbitStardustGroupRef.current) {
        orbitStardustGroupRef.current.children.forEach((dust, idx) => {
          dust.rotation.y += (0.0004 + (idx % 3) * 0.0002) * (idx % 2 === 0 ? 1 : -1) * currentSpeed;
        });
      }

      // 🌀 3D Cosmic Portal Energy Vortex Animation
      if (portalGroupRef.current && isPortalActiveRef.current) {
        portalGroupRef.current.visible = true;
        portalGroupRef.current.rotation.y += 0.045;
        portalGroupRef.current.rotation.z += 0.02;
        const portalPulse = Math.sin(Date.now() * 0.004);
        const pScale = 1.0 + portalPulse * 0.12;
        portalGroupRef.current.scale.set(pScale, pScale, pScale);
      }

      // 3D Floating Heart Particles Rotation
      if (heartFieldRef.current && heartFieldRef.current.visible) {
        heartFieldRef.current.rotation.y += 0.0006 * currentSpeed;
        heartFieldRef.current.rotation.x += 0.0003 * currentSpeed;
      }

      // Comets Motion
      if (showComets) {
        comets.forEach(comet => {
          comet.mesh.position.addScaledVector(comet.dir, comet.speed * currentSpeed);
          if (comet.mesh.position.length() > 220) {
            comet.mesh.position.set(
              Math.random() * 80 + 60,
              Math.random() * 40 + 20,
              Math.random() * 80 + 60
            );
          }
        });
      }

      // Inertial Orbit & Galaxy Drift
      if (solarGroupRef.current) {
        if (!isDraggingRef.current) {
          if (celestialMode === 'earth_orbit') {
            if (earthAutoSpinRef.current && earthMeshRef.current) {
              earthMeshRef.current.rotation.y += 0.0018 * currentSpeed;
              if (earthCloudsRef.current) {
                earthCloudsRef.current.rotation.y += 0.0025 * currentSpeed;
              }
            }
          } else {
            solarGroupRef.current.rotation.y += velocityRef.current.x * currentSpeed;
            solarGroupRef.current.rotation.x += velocityRef.current.y * currentSpeed;
            velocityRef.current.x *= 0.985;
            velocityRef.current.y *= 0.985;
            if (Math.abs(velocityRef.current.x) < 0.0006) {
              velocityRef.current.x = 0.0008;
            }
          }
        }
      }

      // Soft Star Field Drift
      starField.rotation.y += 0.0002;
      nebulaMesh.rotation.y += 0.00015;

      renderer.render(scene, camera);
    };

    animate();

    // 12. 3D POINTER & TOUCH DRAG / TAP RAYCASTING CONTROLS
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('.admin-modal') || target.closest('.modal-content')) {
        return;
      }

      isDraggingRef.current = true;
      setIsInteracting(true);
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      pointerStartPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevPointerRef.current.x;
      const deltaY = e.clientY - prevPointerRef.current.y;

      // 🌍 GOOGLE EARTH INTERACTIVE ROTATION
      if (celestialMode === 'earth_orbit' && earthMeshRef.current) {
        earthMeshRef.current.rotation.y += deltaX * 0.008;
        earthMeshRef.current.rotation.x = Math.max(-1.3, Math.min(1.3, earthMeshRef.current.rotation.x + deltaY * 0.006));
        if (earthCloudsRef.current) {
          earthCloudsRef.current.rotation.y += deltaX * 0.0085;
          earthCloudsRef.current.rotation.x = earthMeshRef.current.rotation.x;
        }
      } else if (solarGroupRef.current) {
        solarGroupRef.current.rotation.y += deltaX * 0.005;
        solarGroupRef.current.rotation.x += deltaY * 0.003;

        velocityRef.current = {
          x: deltaX * 0.0012,
          y: deltaY * 0.0008
        };
      }

      prevPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDraggingRef.current = false;
      setTimeout(() => setIsInteracting(false), 800);

      const dist = Math.hypot(e.clientX - pointerStartPosRef.current.x, e.clientY - pointerStartPosRef.current.y);
      const duration = Date.now() - pointerStartPosRef.current.time;

      // Detect click/tap on canvas for planetary raycasting & Cosmic Portal interaction
      if (dist < 8 && duration < 450 && cameraRef.current) {
        const mouse = new THREE.Vector2(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, cameraRef.current);

        const candidates: THREE.Object3D[] = [];
        planetOrbitsRef.current.forEach(item => candidates.push(item.mesh));
        if (sunMeshRef.current) candidates.push(sunMeshRef.current);

        const intersects = raycaster.intersectObjects(candidates, false);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.planetId) {
            handleCosmicPlanetClick(hit.userData.planetId);
            setCameraFocus(hit.userData.planetId as any);
          } else if (hit === sunMeshRef.current) {
            birthdayAudio.playSparkleChime();
            setCameraFocus('sun');
            setPortalHint('☀️ Radiant Solar Core: Center of all light and cosmic warmth in Alihaaa’s galaxy.');
          }
        }
      }
    };

    // 🔍 SMOOTH MOUSE WHEEL ZOOM (Interactive Google Earth Zoom & Cosmic Zoom)
    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      const zoomDelta = e.deltaY * 0.035;

      if (celestialMode === 'earth_orbit') {
        const newZoom = Math.max(12.0, Math.min(45.0, earthZoomRef.current + zoomDelta));
        earthZoomRef.current = newZoom;
        setEarthZoom(newZoom);
        cameraRef.current.position.z = newZoom;
      } else {
        const newZ = Math.max(14.0, Math.min(130.0, cameraRef.current.position.z + zoomDelta));
        cameraRef.current.position.z = newZ;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: true });

    // 13. RESPONSIVE RESIZE
    const handleResize = () => {
      if (!cameraRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      const isMobileNow = window.innerWidth < 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 1);
      renderer.setPixelRatio(isMobileNow ? 1.0 : Math.min(window.devicePixelRatio, 1.5));

      if (solarGroupRef.current) {
        const targetX = solarPosition === 'left' ? (window.innerWidth > 768 ? -24 : -10) : solarPosition === 'right' ? (window.innerWidth > 768 ? 24 : 10) : 0;
        solarGroupRef.current.position.x = targetX;
      }
    };
    window.addEventListener('resize', handleResize);

    // 14. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      heartGeo.dispose();
      heartMat.dispose();
    };
  }, [galaxyTheme, celestialMode, showComets]);

  // Sync orbit lines visibility
  useEffect(() => {
    if (orbitLinesGroupRef.current) {
      orbitLinesGroupRef.current.visible = showOrbits;
    }
  }, [showOrbits]);

  // Sync heart particles visibility
  useEffect(() => {
    if (heartFieldRef.current) {
      heartFieldRef.current.visible = heartParticlesEnabled;
    }
  }, [heartParticlesEnabled]);

  const resetAngle = () => {
    setCameraFocus('reset');
  };

  const AMBIENT_OPTIONS = [
    { id: 'hearts', label: 'Floating Hearts', icon: Heart, color: 'text-pink-400', desc: 'Sweet romantic hearts floating gently in devotion' },
    { id: 'stars', label: 'Twinkling Stardust', icon: Sparkles, color: 'text-amber-300', desc: 'Glittering diamond sparks of celestial starlight' },
    { id: 'petals', label: 'Rose Petals', icon: Flower2, color: 'text-rose-400', desc: 'Fragrant velvety petals drifting down from heaven' },
    { id: 'fireflies', label: 'Warm Fireflies', icon: Flame, color: 'text-yellow-300', desc: 'Mystical golden fireflies illuminating the night' },
    { id: 'snow', label: 'Magical Snow', icon: Zap, color: 'text-sky-300', desc: 'Pristine crystalline snowfall in slow motion' },
    { id: 'off', label: 'Particles Off', icon: EyeOff, color: 'text-slate-400', desc: 'Pure undisturbed deep cosmos void' }
  ];

  const CELESTIAL_RADAR_TARGETS = [
    { id: 'sun' as const, label: '☀️ Sun', distance: '0.0 AU', orbitalPeriod: 'Core Star', desc: 'Radiant heart of the cosmos; its golden light reflects the warmth of Alihaaa’s smile.' },
    { id: 'mercury' as const, label: '☿️ Mercury', distance: '0.39 AU', orbitalPeriod: '88 Earth Days', desc: 'Swift messenger planet dancing in close orbit to the solar flame.' },
    { id: 'venus' as const, label: '♀ Venus', distance: '0.72 AU', orbitalPeriod: '225 Days', desc: 'The morning and evening jewel, radiant second only to Queen Alihaaa.' },
    { id: 'earth' as const, label: '🌍 Earth & Moon', distance: '1.00 AU', orbitalPeriod: '365.25 Days', desc: 'Our oasis of life in the universe, sanctified because Alihaaa walks upon it.' },
    { id: 'mars' as const, label: '🔴 Mars', distance: '1.52 AU', orbitalPeriod: '687 Days', desc: 'The crimson world of canyons and ancient volcanoes touching the stars.' },
    { id: 'jupiter' as const, label: '♃ Jupiter', distance: '5.20 AU', orbitalPeriod: '11.86 Years', desc: 'The majestic gas giant colossus with swirling storms protecting the inner system.' },
    { id: 'saturn' as const, label: '🪐 Saturn Rings', distance: '9.58 AU', orbitalPeriod: '29.4 Years', desc: 'Crowned with diamond ice rings, sculpted as an eternal cosmic tiara for Alihaaa.' },
    { id: 'uranus' as const, label: '⛢ Uranus', distance: '19.22 AU', orbitalPeriod: '84 Years', desc: 'The aquamarine ice realm gracefully tilted on its rolling orbital plane.' },
    { id: 'neptune' as const, label: '♆ Neptune', distance: '30.05 AU', orbitalPeriod: '164.8 Years', desc: 'Deep sapphire voyager serenading the deep cosmic abyss with supersonic winds.' },
    { id: 'topdown' as const, label: '🗺️ Map View', distance: 'Concentric View', orbitalPeriod: 'Full Perspective', desc: 'Top-down orbital plane tracking all concentric planetary tracks.' },
    { id: 'reset' as const, label: '🔄 Reset View', distance: 'Cosmic Angle', orbitalPeriod: 'Standard Camera', desc: 'Standard cinematic viewing angle overlooking the Solar System.' }
  ];

  return (
    <>
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 pointer-events-auto ${
          isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          touchAction: isWebsiteVisible ? 'pan-y' : 'none',
          filter: `brightness(${exposureBrightness * (dayNightMood === 'night' ? 0.82 : dayNightMood === 'day' ? 1.25 : 1.0)}) saturate(${saturationLevel}) contrast(${contrastLevel}%)`
        }}
      />

      {/* 4K Cinematic Light Bloom Glow Atmosphere Layer (Hidden on mobile to maximize FPS) */}
      {isActive && (
        <div
          className="fixed inset-0 z-0 pointer-events-none transition-all duration-700 mix-blend-screen hidden md:block"
          style={{
            opacity: cinematicBloom * 0.38,
            background: dayNightMood === 'night'
              ? 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.16) 0%, rgba(147, 51, 234, 0.08) 50%, transparent 85%)'
              : dayNightMood === 'day'
              ? 'radial-gradient(ellipse at center, rgba(253, 224, 71, 0.22) 0%, rgba(244, 114, 182, 0.14) 55%, transparent 90%)'
              : 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.14) 0%, rgba(236, 72, 153, 0.12) 50%, transparent 85%)',
            filter: `blur(${Math.max(14, cinematicBloom * 24)}px)`
          }}
        />
      )}

      {/* Cinematic Depth-of-Field Edge Blur & Vignette (Hidden on mobile for silky smooth performance) */}
      {isActive && depthOfField > 0.05 && (
        <div
          className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 hidden md:block"
          style={{
            boxShadow: `inset 0 0 ${Math.round(depthOfField * 180)}px rgba(0, 0, 0, 0.85), inset 0 0 ${Math.round(depthOfField * 70)}px rgba(15, 23, 42, 0.6)`,
            backdropFilter: `blur(${Math.min(1.2, depthOfField)}px)`
          }}
        />
      )}

      {/* Floating 3D Space HUD Controls in Bottom Left */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
        {/* Expanded Advanced Observatory HUD Popup */}
        {showControls && (
          <div className="w-[90vw] sm:w-[440px] max-h-[82vh] overflow-y-auto p-4 sm:p-5 rounded-3xl bg-slate-950/95 border border-sky-400/40 backdrop-blur-2xl shadow-2xl shadow-sky-950/90 text-white space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Header with Live Telemetry */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center">
                  <Orbit className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm tracking-wide text-white">
                      Cosmic Solar Observatory
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      LIVE 3D
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 block font-mono">
                    Alihaaa Celestial Edition • {speedMultiplier}x Speed
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Close Solar HUD"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-medium">
              {[
                { id: 'worlds' as const, label: '🪐 Worlds' },
                { id: 'sun_stars' as const, label: '☀️ Sun & Star' },
                { id: 'cursors' as const, label: '🖱️ Cursors' },
                { id: 'fireworks' as const, label: '🎆 Fireworks' },
                { id: 'atmosphere' as const, label: '🌧️ Aura & Rain' },
                { id: 'controls' as const, label: '⚙️ 4K & Setup' },
                { id: 'planets' as const, label: '🔭 Radar' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setHudTab(t.id)}
                  className={`py-1.5 px-0.5 rounded-xl text-center transition-all cursor-pointer truncate ${
                    hudTab === t.id
                      ? 'bg-gradient-to-r from-sky-500/30 to-pink-500/30 text-white border border-sky-400/40 shadow-xs font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: CELESTIAL PHENOMENA WORLDS */}
            {hudTab === 'worlds' && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-sky-400 tracking-wider">
                  <span>Celestial Phenomena</span>
                  <span className="text-white/40">Select 3D Mode</span>
                </div>

                {/* ☀️ 3D Grand Solar System Featured Option */}
                <button
                  onClick={() => {
                    changeCelestialMode('solar_system');
                    setCameraFocus('reset');
                    birthdayAudio.playSparkleChime();
                    activityTracker.logEvent('theme', 'Grand Solar System Activated', 'Switched to 3D Grand Solar System', 'pink');
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                    celestialMode === 'solar_system'
                      ? 'bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-sky-600/30 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-gradient-to-r from-amber-950/40 via-orange-950/40 to-sky-950/40 border-amber-500/40 hover:border-amber-400 text-white shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-200">
                      <span>☀️ 3D Grand Solar System</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/30 text-[9px] text-amber-200 border border-amber-400/40">DEFAULT</span>
                    </div>
                    <span className="text-[10px] text-white/70 block mt-0.5 leading-relaxed">
                      Radiant Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune & planetary orbits
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-300 shrink-0 group-hover:translate-x-1 transition-transform ml-2" />
                </button>

                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    {
                      id: 'solar_system' as CelestialMode,
                      name: '☀️ 3D Grand Solar System',
                      subtitle: 'Sun, Earth, Mars, Jupiter, Saturn & 8 Orbiting Planets'
                    },
                    {
                      id: 'earth_orbit' as CelestialMode,
                      name: '🌍 3D Earth Orbit View',
                      subtitle: 'Blue Marble, Atmosphere Cloud Layer & Orbiting Moon'
                    },
                    {
                      id: 'saturn_rings' as CelestialMode,
                      name: '🪐 Saturn Ring World',
                      subtitle: 'Golden Gas Giant with Shimmering Diamond Ice Rings'
                    },
                    {
                      id: 'mars_deep_space' as CelestialMode,
                      name: '🔴 Crimson Mars Space',
                      subtitle: 'Red Planet with Olympus Mons & Orbiting Moon Phobos'
                    }
                  ].map(mode => {
                    const isSel = celestialMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => changeCelestialMode(mode.id)}
                        className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSel
                            ? 'bg-sky-500/25 border-sky-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-xs block">{mode.name}</span>
                          <span className="text-[10px] text-white/50">{mode.subtitle}</span>
                        </div>
                        {isSel && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: PLANETARY RADAR & QUICK CAMERA FLY-TO */}
            {hudTab === 'planets' && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-sky-400 tracking-wider">
                  <span>Planetary Camera Radar</span>
                  <span className="text-white/40">Fly to Celestial Body</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {CELESTIAL_RADAR_TARGETS.map(target => {
                    const isSel = focusedPlanet === target.id;
                    return (
                      <button
                        key={target.id}
                        onClick={() => setCameraFocus(target.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSel
                            ? 'bg-sky-500/30 border-sky-400 text-white shadow-xs font-semibold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-xs block truncate">{target.label}</span>
                        <span className="text-[9px] text-white/40 block truncate">{target.distance}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Planet Telemetry Card */}
                {(() => {
                  const curr = CELESTIAL_RADAR_TARGETS.find(t => t.id === focusedPlanet) || CELESTIAL_RADAR_TARGETS[0];
                  return (
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/15 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-300">{curr.label} Telemetry</span>
                        <span className="text-[9px] font-mono text-white/50">{curr.orbitalPeriod}</span>
                      </div>
                      <p className="text-[11px] text-white/80 leading-relaxed font-serif italic">
                        "{curr.desc}"
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB: SUN & STAR CUSTOMIZATION (USER REQUESTED) */}
            {hudTab === 'sun_stars' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-amber-400 tracking-wider">
                  <div className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Solar System Sun & Star Options</span>
                  </div>
                  <span className="text-white/40">Realtime 3D</span>
                </div>

                {/* Sun Scale Slider */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium">☀️ Sun Size & Core Diameter</span>
                    <span className="font-mono text-amber-300 font-bold">{sunScale.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={sunScale}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setSunScale(val);
                      localStorage.setItem('birthday_sun_scale_v5', String(val));
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>Compact Core</span>
                    <span>Grand Solar Giant</span>
                  </div>
                </div>

                {/* Sun Glow Intensity */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium">✨ Sun Glow & Corona Radiance</span>
                    <span className="font-mono text-amber-300 font-bold">{sunGlow.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={sunGlow}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setSunGlow(val);
                      localStorage.setItem('birthday_sun_glow_v5', String(val));
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>Gentle Warmth</span>
                    <span>Radiant Solar Flare</span>
                  </div>
                </div>

                {/* Star Brightness */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium">⭐ Starfield Twinkle Brightness</span>
                    <span className="font-mono text-sky-300 font-bold">{starBrightness.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={starBrightness}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setStarBrightness(val);
                      localStorage.setItem('birthday_star_bright_v5', String(val));
                    }}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>Deep Space Faint</span>
                    <span>Diamond Twinkle</span>
                  </div>
                </div>

                {/* Star Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setShowOrbits(!showOrbits)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      showOrbits
                        ? 'bg-sky-500/25 border-sky-400/50 text-sky-200 shadow-xs'
                        : 'bg-white/5 border-white/10 text-white/50'
                    }`}
                  >
                    <span>🪐 Orbit Rings: {showOrbits ? 'ON' : 'OFF'}</span>
                  </button>
                  <button
                    onClick={() => setShowComets(!showComets)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      showComets
                        ? 'bg-amber-500/25 border-amber-400/50 text-amber-200 shadow-xs'
                        : 'bg-white/5 border-white/10 text-white/50'
                    }`}
                  >
                    <span>☄️ Comets: {showComets ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: MOUSE CURSORS (USER REQUESTED INSIDE SOLAR SYSTEM) */}
            {hudTab === 'cursors' && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-pink-400 tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <MousePointer className="w-3.5 h-3.5 text-pink-400" />
                    <span>Mouse Cursor Selection</span>
                  </div>
                  <span className="text-white/40">16 Custom Styles</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Select your cursor right inside the Solar System — trailing sparkles, royal tiara, kawaii hearts, and sweet treats:
                </p>

                <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {CURSOR_THEMES.map(theme => {
                    const isSel = activeCursorId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => handleSelectCursor(theme.id)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSel
                            ? 'bg-pink-500/30 border-pink-400 text-white shadow-xs font-semibold'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-base shrink-0">{theme.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] block truncate">{theme.name}</span>
                          <span className="text-[9px] text-white/40 block truncate">{theme.trailType}</span>
                        </div>
                        {isSel && <Check className="w-3 h-3 text-pink-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: CELESTIAL SHAPE FIREWORKS (WITH HBD ALIHAAA SHAPE) */}
            {hudTab === 'fireworks' && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-amber-400 tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sky Shape Fireworks</span>
                  </div>
                  <span className="text-white/40">Click to Launch</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Fire rockets that ascend into the cosmos and burst into glowing custom shapes across the sky:
                </p>

                <div className="grid grid-cols-1 gap-1.5">
                  {/* Featured: HBD ALIHAAA */}
                  <button
                    onClick={() => handleLaunchFirework('hbd_alihaaa')}
                    className="p-3 rounded-2xl bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-amber-600/30 hover:from-pink-600/50 hover:to-amber-600/50 border border-pink-400/60 text-white flex items-center justify-between transition-all cursor-pointer shadow-lg active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🎆</span>
                      <div className="text-left">
                        <div className="font-bold text-xs text-pink-200 flex items-center gap-1.5">
                          <span>"HBD ALIHAAA ♡" Firework</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-mono">SPECIAL</span>
                        </div>
                        <span className="text-[10px] text-white/70 block">
                          Spells out glowing birthday message across the sky, fitted to screen
                        </span>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-amber-400 shrink-0" />
                  </button>

                  {[
                    { id: 'heart' as FireworkShapeType, label: '💖 Sweetheart Glow', desc: 'Floating parametric pink ruby heart' },
                    { id: 'crown' as FireworkShapeType, label: '👑 Princess Royal Crown', desc: 'Three peaks with jewel sparks for the Birthday Queen' },
                    { id: 'star' as FireworkShapeType, label: '⭐ Golden Starburst', desc: 'Radiant 5-pointed diamond starlight' },
                    { id: 'saturn' as FireworkShapeType, label: '🪐 Ring of Saturn', desc: 'Cosmic gas planet with tilted icy ring particle' },
                    { id: 'flower' as FireworkShapeType, label: '🌸 Midnight Peony', desc: '8-petal blooming rose with gold center' }
                  ].map(fw => (
                    <button
                      key={fw.id}
                      onClick={() => handleLaunchFirework(fw.id)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-between transition-all cursor-pointer text-left"
                    >
                      <div>
                        <span className="text-xs font-semibold block">{fw.label}</span>
                        <span className="text-[10px] text-white/50 block">{fw.desc}</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400/70" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ROMANTIC ATMOSPHERE & FLOATING PARTICLES */}
            {hudTab === 'atmosphere' && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-pink-400 tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                    <span>Heart Options & Atmosphere</span>
                  </div>
                  <span className="text-white/40">{ambientParticle}</span>
                </div>

                {/* Cosmic Rain Toggle (User requested) */}
                <button
                  onClick={toggleCosmicRain}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    cosmicRain
                      ? 'bg-sky-500/25 border-sky-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cosmicRain ? 'bg-sky-500/30' : 'bg-white/5'}`}>
                      <CloudRain className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs block">🌧️ Gentle Cosmic Rain Overlay</span>
                      <span className="text-[10px] text-white/50">Soft-glowing romantic pastel rain across the entire screen</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cosmicRain ? 'bg-sky-400 text-slate-950' : 'bg-white/10 text-white/60'}`}>
                    {cosmicRain ? 'ON' : 'OFF'}
                  </span>
                </button>

                <p className="text-[11px] text-white/70 leading-relaxed pt-1">
                  Choose the romantic ambient particle drift floating across the screen and solar canvas:
                </p>

                <div className="grid grid-cols-1 gap-1.5">
                  {AMBIENT_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    const isSel = ambientParticle === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectAmbientParticle(opt.id)}
                        className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSel
                            ? 'bg-pink-500/25 border-pink-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isSel ? 'bg-pink-500/30' : 'bg-white/5'}`}>
                            <Icon className={`w-4 h-4 ${opt.color}`} />
                          </div>
                          <div>
                            <span className="font-semibold text-xs block">{opt.label}</span>
                            <span className="text-[10px] text-white/50">{opt.desc}</span>
                          </div>
                        </div>
                        {isSel && <Check className="w-4 h-4 text-pink-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: SYSTEM CONTROLS & PHYSICS */}
            {hudTab === 'controls' && (
              <div className="space-y-3 animate-fade-in">
                {/* Speed Controls */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-white/70">
                    <span className="font-medium">Orbital Simulation Speed</span>
                    <span className="text-sky-300 font-mono font-bold">{speedMultiplier}x</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { label: 'Pause', val: 0 },
                      { label: '0.5x', val: 0.5 },
                      { label: '1.0x', val: 1.0 },
                      { label: '2.5x', val: 2.5 },
                      { label: '5.0x', val: 5.0 }
                    ].map(s => (
                      <button
                        key={s.label}
                        onClick={() => setSpeed(s.val)}
                        className={`py-1.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                          speedMultiplier === s.val
                            ? 'bg-sky-500/30 border-sky-400 text-white shadow-xs'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position & Visibility Toggles */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-mono text-sky-400 tracking-wider block">
                    Rendering & Layout Dynamics
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleSolarPosition()}
                      className={`p-2 rounded-xl border text-[10px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        solarPosition === 'right'
                          ? 'bg-sky-500/25 border-sky-400/50 text-sky-200 shadow-xs'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                      title="Move celestial system between right side and center"
                    >
                      <span>Position: {solarPosition === 'right' ? '➡️ Right Side' : '🎯 Center Screen'}</span>
                    </button>

                    <button
                      onClick={() => setShowOrbits(!showOrbits)}
                      className={`p-2 rounded-xl border text-[10px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        showOrbits
                          ? 'bg-sky-500/20 border-sky-400/50 text-sky-200'
                          : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      <span>3D Orbits: {showOrbits ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setShowComets(!showComets)}
                      className={`p-2 rounded-xl border text-[10px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        showComets
                          ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                          : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      <span>Comets: {showComets ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={toggleHeartParticles}
                      className={`p-2 rounded-xl border text-[10px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        heartParticlesEnabled
                          ? 'bg-rose-500/25 border-rose-400/50 text-rose-200 shadow-xs'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${heartParticlesEnabled ? 'text-rose-400 fill-rose-400' : 'text-white/40'}`} />
                      <span>Cosmic Hearts: {heartParticlesEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  {/* 4K / HDR Graphics Ultra Enhancement Toggle & Dynamic Lighting */}
                  <div className="pt-2 border-t border-white/10 space-y-2.5">
                    <button
                      onClick={toggleHdrQuality}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        hdrQuality
                          ? 'bg-gradient-to-r from-amber-500/25 to-pink-500/25 border-amber-400/60 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-sm">
                          ✨
                        </div>
                        <div>
                          <span className="font-bold text-xs block text-amber-200">4K HDR Realistic Rendering Mode</span>
                          <span className="text-[10px] text-white/60">Enhanced ACES tone mapping & cinematic bloom</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hdrQuality ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white/60'}`}>
                        {hdrQuality ? '4K HDR' : 'Standard'}
                      </span>
                    </button>

                    {/* Dynamic Lighting & Mood Controller */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[10px] uppercase font-mono text-amber-400 tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>Dynamic Lighting & Atmosphere</span>
                        </span>
                        <span className="text-white/40 font-bold capitalize">{dayNightMood} Mood</span>
                      </div>

                      {/* Day / Night / Auto Mood Switcher */}
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'night' as const, label: '🌙 Night Moody' },
                          { id: 'auto' as const, label: '⚡ Cinematic Auto' },
                          { id: 'day' as const, label: '☀️ Day Vibrant' }
                        ].map(mood => (
                          <button
                            key={mood.id}
                            onClick={() => setDayNightMood(mood.id)}
                            className={`py-1.5 px-1 rounded-xl border text-[10px] font-medium transition-all cursor-pointer text-center ${
                              dayNightMood === mood.id
                                ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-xs'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {mood.label}
                          </button>
                        ))}
                      </div>

                      {/* Light Bloom Intensity Slider */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-white/70">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-pink-400" />
                            <span>Light Bloom Radiance</span>
                          </span>
                          <span className="font-mono text-pink-300">{cinematicBloom.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="2.5"
                          step="0.1"
                          value={cinematicBloom}
                          onChange={e => handleUpdateBloom(parseFloat(e.target.value))}
                          className="w-full accent-pink-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                        />
                      </div>

                      {/* Depth-of-Field Blur Toggle */}
                      <button
                        onClick={() => handleUpdateDof(depthOfField > 0 ? 0 : 0.65)}
                        className={`w-full p-2 rounded-xl border text-[10px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                          depthOfField > 0
                            ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span>Depth-of-Field Blur & Vignette</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${depthOfField > 0 ? 'bg-sky-400 text-slate-950' : 'bg-white/10 text-white/50'}`}>
                          {depthOfField > 0 ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      {/* Exposure Brightness & Saturation Sliders */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-white/60">
                            <span>Brightness</span>
                            <span className="font-mono text-sky-300">{exposureBrightness.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.6"
                            max="1.8"
                            step="0.1"
                            value={exposureBrightness}
                            onChange={e => handleUpdateExposure(parseFloat(e.target.value))}
                            className="w-full accent-sky-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-white/60">
                            <span>Saturation</span>
                            <span className="font-mono text-pink-300">{saturationLevel.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.6"
                            max="1.8"
                            step="0.1"
                            value={saturationLevel}
                            onChange={e => handleUpdateSaturation(parseFloat(e.target.value))}
                            className="w-full accent-pink-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                          />
                        </div>
                      </div>

                      {/* 🌍 Dedicated Google Earth Controls */}
                      <div className="pt-2 border-t border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] uppercase font-mono text-sky-300 tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                            <span>Google Earth Controls</span>
                          </span>
                          <span className="text-white/40">Zoom {earthZoom.toFixed(0)}</span>
                        </div>
                        <p className="text-[10px] text-white/50 leading-tight">
                          Drag anywhere to rotate the Earth globe like Google Earth. Use mouse wheel or slider below to zoom close.
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="12"
                            max="40"
                            step="1"
                            value={earthZoom}
                            onChange={e => {
                              const val = parseFloat(e.target.value);
                              setEarthZoom(val);
                              earthZoomRef.current = val;
                              if (cameraRef.current && celestialMode === 'earth_orbit') {
                                cameraRef.current.position.z = val;
                              }
                            }}
                            className="flex-1 accent-sky-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                          />
                          <button
                            onClick={() => {
                              setEarthAutoSpin(!earthAutoSpin);
                              earthAutoSpinRef.current = !earthAutoSpin;
                            }}
                            className={`px-2 py-1 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                              earthAutoSpin ? 'bg-sky-500/30 border-sky-400 text-sky-200' : 'bg-white/5 border-white/10 text-white/50'
                            }`}
                          >
                            Auto-spin: {earthAutoSpin ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset & Hide Action */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={resetAngle}
                    className="flex-1 py-2 px-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-white/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Rotate3d className="w-3.5 h-3.5 text-sky-400" />
                    <span>Reset Angle</span>
                  </button>

                  <button
                    onClick={toggleActive}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-500/20 border-rose-400/50 text-rose-200 hover:bg-rose-500/30'
                        : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isActive ? 'Hide Cosmos' : 'Show Cosmos'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: GALACTIC ENVIRONMENTS & NEBULAS */}
            {hudTab === 'galaxies' && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-sky-400 tracking-wider">
                  <span>Galactic Nebulas</span>
                  <span className="text-white/40">Background Atmosphere</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(GALAXY_THEMES) as GalaxyTheme[]).map(themeKey => {
                    const t = GALAXY_THEMES[themeKey];
                    const isSel = galaxyTheme === themeKey;
                    return (
                      <button
                        key={t.id}
                        onClick={() => changeGalaxyTheme(t.id)}
                        className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSel
                            ? 'bg-sky-500/25 border-sky-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="truncate">
                          <span className="text-xs block font-medium truncate">{t.emoji} {t.name}</span>
                        </div>
                        {isSel && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Controls Bar (Quick Pill HUD Launcher on Left) */}
        <div className="flex items-center gap-2">
          {/* Quick Heart Atmosphere Shortcut button */}
          <button
            onClick={() => {
              setShowControls(true);
              setHudTab('atmosphere');
              birthdayAudio.playSparkleChime();
            }}
            className="px-3 py-2 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-pink-400/40 text-xs text-pink-300 shadow-xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Heart & Atmosphere Particles"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span className="text-[11px] font-medium capitalize hidden sm:inline">{ambientParticle}</span>
          </button>

          {/* Quick Planet Snap Button when closed */}
          {!showControls && (
            <button
              onClick={() => setCameraFocus(focusedPlanet === 'earth' ? 'saturn' : focusedPlanet === 'saturn' ? 'mars' : focusedPlanet === 'mars' ? 'sun' : 'earth')}
              className="px-3 py-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-sky-400/30 text-xs text-sky-200 shadow-xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Next Planet View"
            >
              <Globe2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="capitalize text-[11px] font-mono">{focusedPlanet}</span>
            </button>
          )}

          {/* Main Bubble Trigger Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`group px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border backdrop-blur-xl shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-slate-950/90 hover:bg-slate-900 border-sky-400/50 text-sky-200 shadow-sky-500/30'
                : 'bg-slate-950/85 hover:bg-slate-900 border-white/20 text-white/60'
            }`}
            title="3D Solar System & Celestial Studio Settings"
            aria-label="3D Solar System and Celestial settings"
          >
            <Orbit className={`w-4 h-4 ${isActive ? 'text-sky-400 group-hover:rotate-45 transition-transform' : 'text-white/50'}`} />
            <span className="text-xs font-semibold tracking-wide">
              {isActive
                ? celestialMode === 'earth_orbit'
                  ? '🌍 Earth View'
                  : celestialMode === 'saturn_rings'
                  ? '🪐 Saturn Rings'
                  : celestialMode === 'mars_deep_space'
                  ? '🔴 Mars Space'
                  : '☀️ Solar System'
                : 'Cosmos (Off)'}
            </span>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Cosmic Portal Secret Celebration Modal */}
      {showPortalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950/95 border-2 border-amber-400/60 shadow-2xl shadow-amber-500/30 text-center space-y-5 overflow-hidden">
            {/* Ambient Celestial Glow Behind */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-amber-400/20 to-purple-600/20 blur-3xl pointer-events-none" />

            {/* Portal Animated Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-fuchsia-500 p-0.5 shadow-lg shadow-amber-500/40 animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl">
                🌌
              </div>
            </div>

            <div className="space-y-2 relative">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                ✨ Secret Cosmic Portal Unlocked! ✨
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200">
                True Celestial Harmony, Alihaaa!
              </h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-md mx-auto">
                You correctly aligned all 8 orbiting planets from Mercury to Neptune in perfect cosmological harmony! The central vortex has opened at the heart of your personal Solar System.
              </p>
            </div>

            {/* Planet Alignment Badge Row */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap py-2 px-3 rounded-2xl bg-white/5 border border-white/10">
              {COSMIC_PORTAL_SEQUENCE.map(p => (
                <span
                  key={p.id}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-amber-400/20 text-amber-200 border border-amber-400/30"
                >
                  ✓ {p.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  birthdayAudio.playCosmicPortalOpen();
                  triggerFireworks(6000);
                  triggerHeartShower();
                  triggerRealisticConfetti();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Celebrate Again (Fireworks & Confetti)</span>
              </button>

              <button
                onClick={() => setShowPortalModal(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all cursor-pointer border border-white/15"
              >
                Keep Portal Open & Explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Drag Hint When Interacting */}
      {isInteracting && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4 py-1.5 rounded-full bg-slate-950/85 border border-sky-400/40 backdrop-blur-md text-[11px] text-sky-200 shadow-xl flex items-center gap-2 animate-fade-in">
          <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>Rotating 3D {celestialMode === 'earth_orbit' ? 'Earth Globe & Orbit' : celestialMode === 'saturn_rings' ? 'Saturn Rings' : celestialMode === 'mars_deep_space' ? 'Crimson Mars' : 'Solar System'}</span>
        </div>
      )}
    </>
  );
};
