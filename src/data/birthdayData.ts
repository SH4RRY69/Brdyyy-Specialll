import { BirthdayData, ThemeConfig } from '../types/birthday';

export const DEFAULT_BIRTHDAY_DATA: BirthdayData = {
  girlName: 'Alihaaa♡',
  nickname: 'Alihaaa x My Sleepy Queen',
  birthdayDate: '2011-09-48', // easily customizable
  relationshipStartDate: '69-69-69',
  profilePhoto: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
  heroSubtitle: 'Today is all about celebrating you.',
  aboutIntro: 'To the girl whose smile lights up every room and turns simple ordinary moments into magic.',
  personalityDescription:
    'Kindhearted, deeply thoughtful, effortlessly graceful, and with a laugh that is contagious. She finds wonder in sunsets, reads between the lines of every song, and makes everyone around her feel truly cherished.',
  specialQualities: [
    'Radiant warmth that melts away any bad day',
    'An unmatched sense of quiet empathy & kindness',
    'The sweetest eye smile that crinkles when genuinely happy',
    'A heart full of creative dreams and ambitious passion',
    'Always noticing the tiny details no one else sees'
  ],
  favoriteThings: {
    color: 'Soft Blush Pink & Lavender Mist',
    flower: 'White Peonies & Pink Tulips',
    dessert: 'Strawberry Shortcake & Matcha Macarons',
    musicGenre: 'Acoustic Indie & Dream Pop',
    season: 'Autumn Golden Hour',
    place: 'Quiet coffee nooks & ocean beaches at dusk'
  },
  hobbies: [
    'Capturing golden hour film photos',
    'Reading romance novels under cozy blankets',
    'Baking pastries on Sunday mornings',
    'Curating aesthetic music playlists',
    'Stargazing and night drives'
  ],
  cuteFacts: [
    'Does a tiny happy dance whenever her favorite food arrives',
    'Cannot sleep without at least three fluffy pillows',
    'Saves pretty leaves and cafe receipts inside book pages',
    'Makes wishes on shooting stars, eyelashes, and 11:11 every single time',
    'Her eyes light up like fireworks whenever she talks about things she loves'
  ],
  personalizedLetter:
    'Dearest Alihaaa♡,\n\nFrom the moment you came into my life, everything became more vibrant, more meaningful, and incomparably brighter. Your kindness inspires me every single day. On your special birthday, I wish you endless laughter, peace, adventures that take your breath away, and all the boundless love your pure heart deserves.\n\nNever forget how truly extraordinary you are.',
  surpriseLetter:
    'You are my favorite thought in the morning and my sweetest peace at night. May this year bring you closer to all your dreams, surround you with genuine happiness, and remind you every second just how deeply cherished you are. Happy Birthday, my beautiful star!',
  finalMessage:
    'May your year ahead be as breathtaking, sweet, and unforgettable as you are to the world.',
  wishes: [
    {
      id: 'wish-1',
      category: 'heart',
      categoryLabel: 'From The Heart',
      icon: 'Heart',
      title: 'A Heart Overflowing With Love',
      content:
        'I wish that every single day gives you a reason to smile as brightly as you make everyone around you smile. You deserve the softest kind of love.',
      highlightWord: 'Infinite Love',
      authorNote: 'Always here for you'
    },
    {
      id: 'wish-2',
      category: 'future',
      categoryLabel: 'For Your Future',
      icon: 'Sparkles',
      title: 'Boundless Dreams & Success',
      content:
        'May this upcoming chapter unlock doors you never dared to knock on, grant you confidence in your talents, and shower you with triumph and bliss.',
      highlightWord: 'Golden Horizon',
      authorNote: 'Rooting for your wings'
    },
    {
      id: 'wish-3',
      category: 'special',
      categoryLabel: 'A Special Message',
      icon: 'Star',
      title: 'The Light You Bring',
      content:
        'The world became a far softer and more enchanting place on the day you were born. Thank you for simply existing and being your genuine self.',
      highlightWord: 'Rare Soul',
      authorNote: 'Truly one of a kind'
    },
    {
      id: 'wish-4',
      category: 'memories',
      categoryLabel: 'Endless Smiles',
      icon: 'Smile',
      title: 'Unstoppable Laughter',
      content:
        'Here is to late-night laughing fits until your stomach aches, spontaneous road trips, and cozy dessert runs that become lifelong memories.',
      highlightWord: 'Pure Joy',
      authorNote: 'More adventures await'
    }
  ],
  hiddenWishes: [
    '✨ "I hope every candle you blow out turns into a fulfilled dream in the quiet of midnight."',
    '🌸 "May your days be filled with warm tea, good music, soft sunlight, and zero worries."',
    '💌 "You have an elegance that never goes out of style and a heart made of gold."',
    '🌙 "If wishes were stars, I would weave an entire galaxy just to place it at your feet."',
    '🍰 "Eat as much cake as you want today—birthday calories are spiritually cancelled!"',
    '💫 "Whenever you doubt yourself, remember how much joy your existence brings to this world."'
  ],
  memories: [
    {
      id: 'mem-1',
      title: 'The First Time We Met',
      date: 'April 12, 2023',
      description: 'A breezy spring afternoon where an innocent coffee chat turned into hours of effortless talking.',
      caption: 'The moment time quietly decided to stop.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
      tag: 'First Spark'
    },
    {
      id: 'mem-2',
      title: 'Sunset by the Seaside',
      date: 'July 24, 2023',
      description: 'Golden hour waves, barefoot in the soft sand, wind playing with your hair, and genuine laughter.',
      caption: 'Pink clouds painted the sky, but you were the view.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      tag: 'Golden Hour'
    },
    {
      id: 'mem-3',
      title: 'Spontaneous Rainy Day Drive',
      date: 'November 18, 2023',
      description: 'Rain drumming against the windshield, warm hot chocolates in hand, and our favorite playlist playing softly.',
      caption: 'The coziest afternoon in the universe.',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
      tag: 'Cozy Moments'
    },
    {
      id: 'mem-4',
      title: 'Stargazing Under Midnight Sky',
      date: 'August 14, 2024',
      description: 'Wrapped under thick wool blankets on the hillside, counting shooting stars and exchanging whispered secrets.',
      caption: 'Every wish made that night was about keeping this smile.',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80',
      tag: 'Under The Stars'
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Sun-Drenched Radiance',
      caption: 'Golden light falling gently across your smile.',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80',
      category: 'Portraits'
    },
    {
      id: 'gal-2',
      title: 'Flower Market Mornings',
      caption: 'Surrounded by fresh peonies and morning dew.',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80',
      category: 'Moments'
    },
    {
      id: 'gal-3',
      title: 'Soft Elegance',
      caption: 'Effortlessly graceful in every quiet pose.',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80',
      category: 'Portraits'
    },
    {
      id: 'gal-4',
      title: 'Seaside Golden Hour',
      caption: 'Walking barefoot on the sand as the waves roll in.',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
      category: 'Lifestyle'
    },
    {
      id: 'gal-5',
      title: 'Celebration Sparklers',
      caption: 'Shimmering in birthday joy, sparks, and laughter.',
      image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=1000&q=80',
      category: 'Celebration'
    },
    {
      id: 'gal-6',
      title: 'Night Lights & Magic',
      caption: 'Bokeh sparks illuminating city adventures.',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
      category: 'Moments'
    }
  ]
};

export const THEMES: Record<string, ThemeConfig> = {
  'pink-dream': {
    id: 'pink-dream',
    name: 'Pink Dream',
    icon: '🌸',
    bgGradient: 'from-pink-950 via-rose-900 to-slate-950',
    cardBg: 'rgba(255, 230, 240, 0.08)',
    cardBorder: 'rgba(244, 114, 182, 0.25)',
    primaryColor: '#f472b6',
    accentColor: '#fb7185',
    textColor: '#ffffff',
    textMuted: '#fbcfe8',
    glowColor: 'rgba(244, 114, 182, 0.45)',
    particleColors: ['#f472b6', '#fb7185', '#fde047', '#ffffff', '#fda4af']
  },
  'purple-fantasy': {
    id: 'purple-fantasy',
    name: 'Purple Fantasy',
    icon: '💜',
    bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
    cardBg: 'rgba(238, 210, 255, 0.08)',
    cardBorder: 'rgba(192, 132, 252, 0.25)',
    primaryColor: '#c084fc',
    accentColor: '#a855f7',
    textColor: '#ffffff',
    textMuted: '#e9d5ff',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    particleColors: ['#c084fc', '#e879f9', '#818cf8', '#ffffff', '#f0abfc']
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    icon: '🌌',
    bgGradient: 'from-slate-950 via-blue-950 to-zinc-950',
    cardBg: 'rgba(186, 230, 253, 0.06)',
    cardBorder: 'rgba(56, 189, 248, 0.22)',
    primaryColor: '#38bdf8',
    accentColor: '#60a5fa',
    textColor: '#ffffff',
    textMuted: '#bae6fd',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    particleColors: ['#38bdf8', '#818cf8', '#f8fafc', '#3b82f6', '#93c5fd']
  },
  'rose-garden': {
    id: 'rose-garden',
    name: 'Rose Garden',
    icon: '🌹',
    bgGradient: 'from-rose-950 via-stone-900 to-zinc-950',
    cardBg: 'rgba(254, 226, 226, 0.08)',
    cardBorder: 'rgba(251, 113, 133, 0.25)',
    primaryColor: '#fb7185',
    accentColor: '#e11d48',
    textColor: '#ffffff',
    textMuted: '#fecdd3',
    glowColor: 'rgba(251, 113, 133, 0.45)',
    particleColors: ['#fb7185', '#fda4af', '#f43f5e', '#ffffff', '#fed7aa']
  },
  'golden-celebration': {
    id: 'golden-celebration',
    name: 'Golden Celebration',
    icon: '✨',
    bgGradient: 'from-amber-950 via-stone-950 to-neutral-950',
    cardBg: 'rgba(254, 243, 199, 0.07)',
    cardBorder: 'rgba(251, 191, 36, 0.28)',
    primaryColor: '#fbbf24',
    accentColor: '#f59e0b',
    textColor: '#ffffff',
    textMuted: '#fef3c7',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    particleColors: ['#fbbf24', '#fef08a', '#f59e0b', '#ffffff', '#eab308']
  },
  dreamy: {
    id: 'dreamy',
    name: 'Dreamy',
    icon: '🌈',
    bgGradient: 'from-fuchsia-950 via-cyan-950 to-slate-950',
    cardBg: 'rgba(224, 242, 254, 0.08)',
    cardBorder: 'rgba(232, 121, 249, 0.25)',
    primaryColor: '#e879f9',
    accentColor: '#22d3ee',
    textColor: '#ffffff',
    textMuted: '#f5d0fe',
    glowColor: 'rgba(232, 121, 249, 0.45)',
    particleColors: ['#e879f9', '#22d3ee', '#fde047', '#ffffff', '#a78bfa']
  }
};
