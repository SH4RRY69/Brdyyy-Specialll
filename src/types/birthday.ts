export type ThemeId =
  | 'pink-dream'
  | 'purple-fantasy'
  | 'midnight'
  | 'rose-garden'
  | 'golden-celebration'
  | 'dreamy';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  textMuted: string;
  glowColor: string;
  particleColors: string[];
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  caption: string;
  image: string;
  tag: string;
}

export interface WishItem {
  id: string;
  category: 'heart' | 'future' | 'special' | 'memories';
  categoryLabel: string;
  icon: string;
  title: string;
  content: string;
  highlightWord?: string;
  authorNote?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  category: string;
}

export interface BirthdayData {
  girlName: string;
  nickname: string;
  birthdayDate: string; // YYYY-MM-DD
  relationshipStartDate?: string; // YYYY-MM-DD optional
  profilePhoto: string;
  heroSubtitle: string;
  aboutIntro: string;
  personalityDescription: string;
  specialQualities: string[];
  favoriteThings: {
    color: string;
    flower: string;
    dessert: string;
    musicGenre: string;
    season: string;
    place: string;
  };
  hobbies: string[];
  cuteFacts: string[];
  personalizedLetter: string;
  surpriseLetter: string;
  finalMessage: string;
  wishes: WishItem[];
  hiddenWishes: string[];
  memories: MemoryItem[];
  gallery: GalleryItem[];
}
