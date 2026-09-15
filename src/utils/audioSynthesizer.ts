// Ambient Birthday Audio Engine using Web Audio API
// Generates soothing celesta, music box, and ambient chord progressions without relying on flaky external mp3 hosting.

type MelodyNote = { note: string; freq: number; duration: number };

// Note frequencies
const NOTE_FREQS: Record<string, number> = {
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  G4: 392.0,
  Gs4: 415.3,
  A4: 440.0,
  As4: 466.16,
  B4: 493.88,
  C5: 523.25,
  Cs5: 554.37,
  D5: 587.33,
  Ds5: 622.25,
  E5: 659.25,
  F5: 698.46,
  Fs5: 739.99,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5
};

export type MusicTrackId =
  | 'birthday'
  | 'baar_baar_din'
  | 'alihaaa_anthem'
  | 'birthday_waltz'
  | 'desi_bash'
  | 'chote_birthday'
  | 'jashn_dhamaal'
  | 'desi_bhangra'
  | 'dreamy'
  | 'portal_cosmic'
  | 'supernova_glow'
  | 'andromeda_drift'
  | 'sukoon_dil'
  | 'school_nostalgia'
  | 'tum_se_hi'
  | 'baarish_sukoon';

// 1. Happy Birthday melody in C major
const BIRTHDAY_MELODY: MelodyNote[] = [
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.4 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.3 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.7 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.7 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 1.2 },

  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.4 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.3 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.7 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.7 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.7 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.2 },

  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.4 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.3 },
  { note: 'G5', freq: NOTE_FREQS.G5, duration: 0.7 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.7 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.7 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 1.0 },

  { note: 'F5', freq: NOTE_FREQS.F5, duration: 0.4 },
  { note: 'F5', freq: NOTE_FREQS.F5, duration: 0.3 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.7 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.7 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.8 }
];

// 2. Iconic Indian Birthday Anthem: "Baar Baar Din Ye Aaye" (Fun & Upbeat Bollywood)
const BAAR_BAAR_DIN_MELODY: MelodyNote[] = [
  // Baar baar din ye aaye
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.28 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.28 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.28 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.35 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.45 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.28 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.35 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.65 },

  // Baar baar dil ye gaaye
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.28 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.28 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.28 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.35 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.45 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.28 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.35 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.75 },

  // Tu jiye hazaaron saal
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.32 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.32 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.35 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.45 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.35 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.3 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.3 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.3 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.65 },

  // Ye meri hai aarzoo
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.3 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.3 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.3 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.3 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.3 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.35 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.35 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.8 },

  // Happy Birthday to you, Alihaaa!
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.25 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.25 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.45 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.45 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.5 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.9 }
];

// 3. Upbeat Indian Party Anthem: "Desi Birthday Bash"
const DESI_BASH_MELODY: MelodyNote[] = [
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.22 },
  { note: 'Fs4', freq: NOTE_FREQS.Fs4, duration: 0.22 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.25 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.35 },
  { note: 'Cs5', freq: NOTE_FREQS.Cs5, duration: 0.25 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.25 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.4 },

  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.22 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.22 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.25 },
  { note: 'Fs4', freq: NOTE_FREQS.Fs4, duration: 0.35 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.25 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.45 },

  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.2 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.2 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.2 },
  { note: 'Fs4', freq: NOTE_FREQS.Fs4, duration: 0.3 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.3 },
  { note: 'Fs4', freq: NOTE_FREQS.Fs4, duration: 0.3 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.25 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.7 }
];

// 4. Fun Bollywood Dance Chiptune: "Chote Tera Birthday Aaya"
const CHOTE_BIRTHDAY_MELODY: MelodyNote[] = [
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.24 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.24 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.28 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.38 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.24 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.24 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.45 },

  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.24 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.24 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.4 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.24 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.24 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.5 },

  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.22 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.22 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.3 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.35 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 }
];

// Soothing dream arpeggio for ambient mode
const DREAM_MELODY: MelodyNote[] = [
  { note: 'C4', freq: NOTE_FREQS.C4, duration: 0.6 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.6 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.6 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.8 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.2 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.6 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.6 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.8 },
  { note: 'F4', freq: NOTE_FREQS.F4, duration: 0.6 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.6 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.8 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 1.4 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.6 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.6 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.8 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.5 }
];

// 6. Sukoon-e-Qalb: Peaceful & Heart-touching Soulful Melody
const SUKOON_MELODY: MelodyNote[] = [
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.65 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.5 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.6 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.8 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.9 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.5 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.7 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.9 },

  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.6 },
  { note: 'F4', freq: NOTE_FREQS.F4, duration: 0.5 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.7 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 1.2 },

  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.5 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.8 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 1.4 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.6 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.6 }
];

// 7. School Nostalgia / Purani Yaadein: Sweet, Innocent Warm Music Box with Childhood School Bell
const SCHOOL_NOSTALGIA_MELODY: MelodyNote[] = [
  // Westminster School Bell & Assembly Motif
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.55 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.5 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.5 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.75 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.9 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.6 },

  // Warm Childhood Friendship Chorus
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.45 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.45 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.8 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.45 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.6 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.7 },

  // Playground & Recess Memory Turn
  { note: 'F4', freq: NOTE_FREQS.F4, duration: 0.45 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.45 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.5 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.65 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.65 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.7 },
  { note: 'C4', freq: NOTE_FREQS.C4, duration: 1.8 }
];

// 8. Tum Se Hi / Dil Ki Baatein: Romantic Soothing Ballad
const TUM_SE_HI_MELODY: MelodyNote[] = [
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.4 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.4 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.45 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.5 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.8 },

  { note: 'F4', freq: NOTE_FREQS.F4, duration: 0.4 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.4 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.7 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 1.2 },

  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.4 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.4 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.6 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.9 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.7 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.6 }
];

// 9. Monsoon Raindrops & Soul Serenade (Baarish Sukoon)
const BAARISH_SUKOON_MELODY: MelodyNote[] = [
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.6 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.5 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.5 },
  { note: 'C4', freq: NOTE_FREQS.C4, duration: 0.8 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.5 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.7 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.9 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.6 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.9 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.5 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.8 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 1.6 }
];

// 10. Alihaaa's Golden Birthday Song
const ALIHAAA_ANTHEM_MELODY: MelodyNote[] = [
  { note: 'C4', freq: NOTE_FREQS.C4, duration: 0.35 },
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.35 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.45 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.35 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.4 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.8 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.4 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.4 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.5 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.6 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 1.2 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.5 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.5 }
];

// 11. Royalty Birthday Waltz
const BIRTHDAY_WALTZ_MELODY: MelodyNote[] = [
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.6 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.4 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.4 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.8 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.4 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.4 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.7 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.4 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.5 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.6 }
];

// 12. Jashn-e-Mehfil Dhamaal
const JASHN_DHAMAAL_MELODY: MelodyNote[] = [
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.3 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.25 },
  { note: 'F4', freq: NOTE_FREQS.F4, duration: 0.35 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.4 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.35 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.25 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.4 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.5 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.35 },
  { note: 'F4', freq: NOTE_FREQS.F4, duration: 0.35 },
  { note: 'D4', freq: NOTE_FREQS.D4, duration: 0.7 }
];

// 13. Bhangra Dholak Celebration
const DESI_BHANGRA_MELODY: MelodyNote[] = [
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.3 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.3 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.4 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.5 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.3 },
  { note: 'A4', freq: NOTE_FREQS.A4, duration: 0.3 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.6 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.35 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.4 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.7 }
];

// 14. Celestial Portal Theme: Cosmic Harmony
const PORTAL_COSMIC_MELODY: MelodyNote[] = [
  { note: 'C4', freq: NOTE_FREQS.C4, duration: 0.5 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.5 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.7 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.7 },
  { note: 'G5', freq: NOTE_FREQS.G5, duration: 1.2 },
  { note: 'F5', freq: NOTE_FREQS.F5, duration: 0.5 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.5 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.8 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.8 }
];

// 15. Supernova Starlight Dream
const SUPERNOVA_GLOW_MELODY: MelodyNote[] = [
  { note: 'C4', freq: NOTE_FREQS.C4, duration: 0.5 },
  { note: 'G4', freq: NOTE_FREQS.G4, duration: 0.5 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.7 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.9 },
  { note: 'G5', freq: NOTE_FREQS.G5, duration: 1.2 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.6 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.8 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 1.8 }
];

// 16. Andromeda Nebula Orbit
const ANDROMEDA_DRIFT_MELODY: MelodyNote[] = [
  { note: 'E4', freq: NOTE_FREQS.E4, duration: 0.6 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 0.6 },
  { note: 'C5', freq: NOTE_FREQS.C5, duration: 0.8 },
  { note: 'G5', freq: NOTE_FREQS.G5, duration: 1.1 },
  { note: 'F5', freq: NOTE_FREQS.F5, duration: 0.5 },
  { note: 'E5', freq: NOTE_FREQS.E5, duration: 0.7 },
  { note: 'D5', freq: NOTE_FREQS.D5, duration: 0.6 },
  { note: 'B4', freq: NOTE_FREQS.B4, duration: 1.4 }
];

export class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;
  private volume = 0.6;
  private currentTrack: MusicTrackId = 'birthday';
  private loopTimer: number | null = null;
  private currentNoteIndex = 0;
  private listeners: Array<() => void> = [];

  constructor() {
    // Lazy initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public async togglePlay(): Promise<boolean> {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
    return this.isPlaying;
  }

  public async play(): Promise<void> {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.notify();
    this.playMelodyLoop();
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.loopTimer) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.notify();
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getTrack(): MusicTrackId {
    return this.currentTrack;
  }

  public setTrack(track: MusicTrackId) {
    this.currentTrack = track;
    this.currentNoteIndex = 0;
    if (this.isPlaying) {
      if (this.loopTimer) window.clearTimeout(this.loopTimer);
      this.playMelodyLoop();
    }
    this.notify();
  }

  // Plays a single music-box chime with harmonic richness
  private playBellNote(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    
    // Fundamental Sine wave
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Harmonic bell overtone
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // High shimmer
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3.01, now);

    // Note Envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.28, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.6);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.08, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.9);

    const shimmerGain = this.ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.04, now);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.5);

    osc1.connect(noteGain);
    osc2.connect(overtoneGain);
    osc3.connect(shimmerGain);

    noteGain.connect(this.masterGain);
    overtoneGain.connect(this.masterGain);
    shimmerGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration * 1.8);
    osc2.stop(now + duration * 1.8);
    osc3.stop(now + duration * 1.8);
  }

  // Play a delicate spark chime (for candle blow-out / wishes / buttons)
  public playSparkleChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C major 7 shimmer
    chord.forEach((freq, idx) => {
      const delay = idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.linearRampToValueAtTime(0.18, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + delay);
      osc.stop(now + delay + 1.3);
    });
  }

  // Play candle blowout sound effect (gentle breath whoosh + bell)
  public playBlowOutSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    
    // Low whoosh
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    
    // Complementary soft ping
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(880, now + 0.05);
    oscGain.gain.setValueAtTime(0.1, now + 0.05);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now + 0.05);
    osc.stop(now + 0.6);
  }

  // Realistic Vintage Parchment Paper Page Flip Sound
  public playPageFlip() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.18);
    filter.Q.setValueAtTime(1.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  // Realistic Balloon Pop Sound (Acoustic air displacement, rubber tear snap & sub punch)
  public playBalloonPop() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Sharp Rubber Rupture Noise Impulse (The initial "CRACK/SNAP")
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.008));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2400, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start(now);

    // 2. Sudden Air Compression Wave (The deep "POP/THUMP")
    const oscThud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    oscThud.type = 'sine';
    oscThud.frequency.setValueAtTime(280, now);
    oscThud.frequency.exponentialRampToValueAtTime(38, now + 0.08);

    thudGain.gain.setValueAtTime(0.5, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    oscThud.connect(thudGain);
    thudGain.connect(this.masterGain);
    oscThud.start(now);
    oscThud.stop(now + 0.09);

    // 3. High-Frequency Elastic Snap
    const oscSnap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    oscSnap.type = 'triangle';
    oscSnap.frequency.setValueAtTime(1400, now);
    oscSnap.frequency.exponentialRampToValueAtTime(110, now + 0.035);

    snapGain.gain.setValueAtTime(0.25, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    oscSnap.connect(snapGain);
    snapGain.connect(this.masterGain);
    oscSnap.start(now);
    oscSnap.stop(now + 0.045);
  }

  // Playful Tactile Balloon Pop / Bubble voice for UI buttons
  public playTactileBalloonButtonPop(pitchMod: number = 1.0) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Rubber pop air wave
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const startFreq = 460 * pitchMod;
    const endFreq = 90 * pitchMod;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.06);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.07);

    // 2. Crisp rubber snap
    const oscSnap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    oscSnap.type = 'triangle';
    oscSnap.frequency.setValueAtTime(1550 * pitchMod, now);
    oscSnap.frequency.exponentialRampToValueAtTime(180, now + 0.022);

    snapGain.gain.setValueAtTime(0.2, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    oscSnap.connect(snapGain);
    snapGain.connect(this.masterGain);
    oscSnap.start(now);
    oscSnap.stop(now + 0.03);
  }

  // Ethereal Shooting Star / Meteor Whoosh Sparkle
  public playMeteorWhoosh() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  // Cosmic Alignment chime when Alihaaa clicks a planet in sequence (Ascending celestial scale)
  public playCosmicAlignmentNote(stepIndex: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Ascending scale: C4, D4, E4, G4, A4, C5, D5, E5
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
    const freq = scale[Math.min(stepIndex, scale.length - 1)];

    // Fundamental Bell
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Harmonic Sparkle Overtone
    const oscHarmonic = this.ctx.createOscillator();
    const harmonicGain = this.ctx.createGain();
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2.01, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    harmonicGain.gain.setValueAtTime(0.001, now);
    harmonicGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    oscHarmonic.connect(harmonicGain);
    harmonicGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.25);
    oscHarmonic.start(now);
    oscHarmonic.stop(now + 0.85);
  }

  // Majestic Cosmic Portal Awakening Fanfare
  public playCosmicPortalOpen() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Deep Celestial Sub-Bass Thrum
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(65.4, now); // C2
    subOsc.frequency.exponentialRampToValueAtTime(130.8, now + 1.8);
    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.4, now + 0.3);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 3.3);

    // 2. Cascading Diamond Stardust Arpeggio Chord
    const portalChord = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093.0];
    portalChord.forEach((freq, idx) => {
      const delay = idx * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.linearRampToValueAtTime(0.22, now + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 2.0);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + delay);
      osc.stop(now + delay + 2.1);
    });
  }

  // Cosmic Alignment Reset Sound (gentle falling chime)
  public playResetChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    [392.0, 293.66].forEach((freq, i) => {
      const delay = i * 0.14;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + delay);
      osc.stop(now + delay + 0.45);
    });
  }

  private playMelodyLoop() {
    if (!this.isPlaying) return;

    let melody = BIRTHDAY_MELODY;
    let tempoFactor = 1.0;

    if (this.currentTrack === 'baar_baar_din') {
      melody = BAAR_BAAR_DIN_MELODY;
      tempoFactor = 0.9;
    } else if (this.currentTrack === 'alihaaa_anthem') {
      melody = ALIHAAA_ANTHEM_MELODY;
      tempoFactor = 0.9;
    } else if (this.currentTrack === 'birthday_waltz') {
      melody = BIRTHDAY_WALTZ_MELODY;
      tempoFactor = 1.0;
    } else if (this.currentTrack === 'desi_bash') {
      melody = DESI_BASH_MELODY;
      tempoFactor = 0.85;
    } else if (this.currentTrack === 'chote_birthday') {
      melody = CHOTE_BIRTHDAY_MELODY;
      tempoFactor = 0.85;
    } else if (this.currentTrack === 'jashn_dhamaal') {
      melody = JASHN_DHAMAAL_MELODY;
      tempoFactor = 0.8;
    } else if (this.currentTrack === 'desi_bhangra') {
      melody = DESI_BHANGRA_MELODY;
      tempoFactor = 0.8;
    } else if (this.currentTrack === 'dreamy') {
      melody = DREAM_MELODY;
      tempoFactor = 1.1;
    } else if (this.currentTrack === 'portal_cosmic') {
      melody = PORTAL_COSMIC_MELODY;
      tempoFactor = 1.1;
    } else if (this.currentTrack === 'supernova_glow') {
      melody = SUPERNOVA_GLOW_MELODY;
      tempoFactor = 1.15;
    } else if (this.currentTrack === 'andromeda_drift') {
      melody = ANDROMEDA_DRIFT_MELODY;
      tempoFactor = 1.15;
    } else if (this.currentTrack === 'sukoon_dil') {
      melody = SUKOON_MELODY;
      tempoFactor = 1.05;
    } else if (this.currentTrack === 'school_nostalgia') {
      melody = SCHOOL_NOSTALGIA_MELODY;
      tempoFactor = 1.0;
    } else if (this.currentTrack === 'tum_se_hi') {
      melody = TUM_SE_HI_MELODY;
      tempoFactor = 1.0;
    } else if (this.currentTrack === 'baarish_sukoon') {
      melody = BAARISH_SUKOON_MELODY;
      tempoFactor = 1.1;
    }

    const item = melody[this.currentNoteIndex];
    this.playBellNote(item.freq, item.duration);

    const waitMs = item.duration * 1000 * tempoFactor;
    this.currentNoteIndex = (this.currentNoteIndex + 1) % melody.length;
    // Pause between loops
    const pauseBeforeNext = this.currentNoteIndex === 0 ? 1800 : waitMs;

    this.loopTimer = window.setTimeout(() => {
      this.playMelodyLoop();
    }, pauseBeforeNext);
  }

  public getVisualizerData(outArray: Uint8Array): void {
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(outArray);
    } else {
      outArray.fill(0);
    }
  }
}

export const birthdayAudio = new BirthdayAudioEngine();
