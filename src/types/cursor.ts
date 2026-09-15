export type CursorThemeId =
  | 'tiara'
  | 'heart'
  | 'star_wand'
  | 'butterfly'
  | 'kitty_paw'
  | 'sakura'
  | 'saturn'
  | 'glow_ring'
  | 'teddy_bear'
  | 'bunny_ears'
  | 'strawberry'
  | 'cupcake'
  | 'cosmic_moon'
  | 'rainbow_spark'
  | 'sparkle_crystal'
  | 'fairy_wings';

export interface CursorThemeConfig {
  id: CursorThemeId;
  name: string;
  emoji: string;
  description: string;
  accentColor: string;
  trailType: 'sparkles' | 'hearts' | 'stars' | 'butterflies' | 'paws' | 'petals' | 'dust' | 'sweets' | 'rainbow' | 'magic';
}

export const CURSOR_THEMES: CursorThemeConfig[] = [
  {
    id: 'My Arena',
    name: 'SH3RRY CURSOR',
    emoji: '🖤',
    description: 'Golden royal crown with diamond sparkle trail',
    accentColor: '#f59e0b',
    trailType: 'sparkles'
  },
  {
    id: 'heart',
    name: 'Kawaii Heart',
    emoji: '💖',
    description: 'Pastel pink heart floating with tiny love bubbles',
    accentColor: '#ec4899',
    trailType: 'hearts'
  },
  {
    id: 'star_wand',
    name: 'Fairy Wand',
    emoji: '✨',
    description: 'Magic star wand casting glittering stardust',
    accentColor: '#fbbf24',
    trailType: 'stars'
  },
  {
    id: 'butterfly',
    name: 'Glow Butterfly',
    emoji: '🦋',
    description: 'Iridescent lavender butterfly with fluttering wings',
    accentColor: '#a855f7',
    trailType: 'butterflies'
  },
  {
    id: 'kitty_paw',
    name: 'Kitty Paw',
    emoji: '🐾',
    description: 'Cute fluffy pink cat paw with pawprint dust',
    accentColor: '#f43f5e',
    trailType: 'paws'
  },
  {
    id: 'teddy_bear',
    name: 'Teddy Bear',
    emoji: '🧸',
    description: 'Cute cozy teddy bear with warm honey hearts',
    accentColor: '#d97706',
    trailType: 'hearts'
  },
  {
    id: 'bunny_ears',
    name: 'Kawaii Bunny',
    emoji: '🐰',
    description: 'Fluffy bunny with pastel carrot sparks',
    accentColor: '#fb7185',
    trailType: 'stars'
  },
  {
    id: 'strawberry',
    name: 'Sweet Berry',
    emoji: '🍓',
    description: 'Juicy ruby strawberry with candy sweetness trail',
    accentColor: '#f43f5e',
    trailType: 'sweets'
  },
  {
    id: 'cupcake',
    name: 'Birthday Cake',
    emoji: '🧁',
    description: 'Frosted cupcake with colorful sprinkle sparks',
    accentColor: '#ec4899',
    trailType: 'sweets'
  },
  {
    id: 'sakura',
    name: 'Sakura Petal',
    emoji: '🌸',
    description: 'Cherry blossom petals dancing in the breeze',
    accentColor: '#f472b6',
    trailType: 'petals'
  },
  {
    id: 'cosmic_moon',
    name: 'Crescent Moon',
    emoji: '🌙',
    description: 'Slender gold crescent with deep space stardust',
    accentColor: '#38bdf8',
    trailType: 'stars'
  },
  {
    id: 'rainbow_spark',
    name: 'Pastel Rainbow',
    emoji: '🌈',
    description: 'Magical rainbow arch with shimmering color trail',
    accentColor: '#818cf8',
    trailType: 'rainbow'
  },
  {
    id: 'sparkle_crystal',
    name: 'Crystal Orb',
    emoji: '🔮',
    description: 'Mystical glowing amethyst sphere with aura sparks',
    accentColor: '#c084fc',
    trailType: 'magic'
  },
  {
    id: 'fairy_wings',
    name: 'Angel Wings',
    emoji: '🪽',
    description: 'Silken ethereal wings leaving glowing feathers',
    accentColor: '#bae6fd',
    trailType: 'sparkles'
  },
  {
    id: 'saturn',
    name: 'Cosmic Saturn',
    emoji: '🪐',
    description: 'Ringed celestial planet leaving orbit stardust',
    accentColor: '#38bdf8',
    trailType: 'dust'
  },
  {
    id: 'glow_ring',
    name: 'Aesthetic Glow',
    emoji: '💫',
    description: 'Minimal rose gold ring with smooth lerp halo',
    accentColor: '#fb7185',
    trailType: 'sparkles'
  }
];

export const CURSOR_STORAGE_KEY = 'alihaaa_cursor_theme_v2';
