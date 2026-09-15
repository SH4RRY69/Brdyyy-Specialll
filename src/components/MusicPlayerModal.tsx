import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Music, Sparkles, Heart, Flame, Moon, Compass } from 'lucide-react';
import { birthdayAudio, MusicTrackId } from '../utils/audioSynthesizer';

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MusicCategory = 'sukoon' | 'birthday' | 'desi' | 'cosmic';

interface TrackInfo {
  id: MusicTrackId;
  name: string;
  subtitle: string;
  category: MusicCategory;
  emoji: string;
  tag?: string;
}

const TRACKS_CATALOG: TrackInfo[] = [
  // 1. Sukoon & Peaceful Nostalgia
  {
    id: 'school_nostalgia',
    name: 'School Bell & Childhood Yaadein',
    subtitle: 'Morning assembly bell, lunch tiffin laughs & innocent school days',
    category: 'sukoon',
    emoji: '🔔',
    tag: 'School Bell & Memories'
  },
  {
    id: 'sukoon_dil',
    name: 'Sukoon-e-Qalb (Heart Calm)',
    subtitle: 'Deeply relaxing acoustic peace for the soul',
    category: 'sukoon',
    emoji: '🕊️',
    tag: 'Calm & Pure'
  },
  {
    id: 'tum_se_hi',
    name: 'Tum Se Hi (Romantic Sukoon)',
    subtitle: 'Sweet soulful ballad dedicated to Alihaaa',
    category: 'sukoon',
    emoji: '💖',
    tag: 'Soulful'
  },
  {
    id: 'baarish_sukoon',
    name: 'Baarish & Soul Serenade',
    subtitle: 'Gentle raindrops, petrichor breeze & peaceful evening chimes',
    category: 'sukoon',
    emoji: '🌧️',
    tag: 'Monsoon Peace'
  },

  // 2. Birthday Celebrations
  {
    id: 'alihaaa_anthem',
    name: "Alihaaa's Golden Birthday Song",
    subtitle: 'Special celebratory royal anthem customized for Alihaaa',
    category: 'birthday',
    emoji: '👑',
    tag: "Alihaaa's Special"
  },
  {
    id: 'baar_baar_din',
    name: 'Baar Baar Din Ye Aaye',
    subtitle: 'Legendary classic Bollywood birthday celebration anthem',
    category: 'birthday',
    emoji: '🎉',
    tag: 'Classic Anthem'
  },
  {
    id: 'birthday',
    name: 'Celestial Happy Birthday',
    subtitle: 'Harmonic music box bells in C-Major chime',
    category: 'birthday',
    emoji: '🎂',
    tag: 'Music Box'
  },
  {
    id: 'birthday_waltz',
    name: 'Royalty Birthday Waltz',
    subtitle: 'Grand ballroom waltz for the birthday queen',
    category: 'birthday',
    emoji: '🪻',
    tag: 'Ballroom Waltz'
  },

  // 3. Upbeat & Desi Celebration
  {
    id: 'desi_bash',
    name: 'Desi Dhol Birthday Bash',
    subtitle: 'Upbeat Punjabi celebratory rhythm & dhol beats',
    category: 'desi',
    emoji: '🪘',
    tag: 'Bhangra Vibe'
  },
  {
    id: 'chote_birthday',
    name: 'Chote Tera Birthday Aaya',
    subtitle: 'Fun lively Bollywood celebration dance tune',
    category: 'desi',
    emoji: '💃',
    tag: 'Dance Beat'
  },
  {
    id: 'jashn_dhamaal',
    name: 'Jashn-e-Mehfil Dhamaal',
    subtitle: 'Energetic desi party dhamaal with clap rhythms',
    category: 'desi',
    emoji: '🎊',
    tag: 'Desi Party'
  },
  {
    id: 'desi_bhangra',
    name: 'Bhangra Dholak Celebration',
    subtitle: 'Authentic Punjabi dholak celebration tempo',
    category: 'desi',
    emoji: '🎺',
    tag: 'Folk Dholak'
  },

  // 4. Cosmic & Dreamy Ambience
  {
    id: 'dreamy',
    name: 'Dreamy Starlight Lullaby',
    subtitle: 'Soft ambient piano & celestial chimes',
    category: 'cosmic',
    emoji: '✨',
    tag: 'Dreamscape'
  },
  {
    id: 'portal_cosmic',
    name: 'Celestial Portal Harmony',
    subtitle: 'Mystical stardust arpeggios & cosmic planetary chord',
    category: 'cosmic',
    emoji: '🌌',
    tag: 'Deep Space'
  },
  {
    id: 'supernova_glow',
    name: 'Supernova Starlight Dream',
    subtitle: 'Shimmering celestial nebula frequency chords',
    category: 'cosmic',
    emoji: '🌠',
    tag: 'Starlight'
  },
  {
    id: 'andromeda_drift',
    name: 'Andromeda Nebula Orbit',
    subtitle: 'Hypnotic space ambient echoes through galactic rings',
    category: 'cosmic',
    emoji: '🪐',
    tag: 'Cosmic Drift'
  }
];

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(birthdayAudio.getIsPlaying());
  const [volume, setVolume] = useState(birthdayAudio.getVolume());
  const [track, setTrack] = useState<MusicTrackId>(birthdayAudio.getTrack());
  const [activeCategory, setActiveCategory] = useState<MusicCategory>('sukoon');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const unsub = birthdayAudio.subscribe(() => {
      setIsPlaying(birthdayAudio.getIsPlaying());
      setVolume(birthdayAudio.getVolume());
      setTrack(birthdayAudio.getTrack());
    });
    return unsub;
  }, []);

  // Update active category tab to match current track if needed
  useEffect(() => {
    const current = TRACKS_CATALOG.find(t => t.id === track);
    if (current && current.category !== activeCategory) {
      setActiveCategory(current.category);
    }
  }, [track]);

  // Visualizer loop when modal is open
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const render = () => {
      animId = requestAnimationFrame(render);
      birthdayAudio.getVisualizerData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArray.length) * 0.8;
      let x = (canvas.width - dataArray.length * (barWidth + 2)) / 2;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = Math.max(3, (dataArray[i] / 255) * (canvas.height - 8));
        
        // Gradient for visualizer bars
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(0.5, '#c084fc');
        grad.addColorStop(1, '#fbbf24');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, 3);
        ctx.fill();

        x += barWidth + 2;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    birthdayAudio.togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    birthdayAudio.setVolume(val);
  };

  const handleTrackChange = (newTrack: MusicTrackId) => {
    setTrack(newTrack);
    birthdayAudio.setTrack(newTrack);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl p-6 sm:p-7 bg-slate-950/95 border border-white/20 shadow-2xl space-y-6 text-center"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-pink-400" />
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-white text-left">
              Soundtrack & Ambience
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            aria-label="Close music settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Visualizer Wave Canvas */}
        <div className="rounded-2xl p-4 bg-black/50 border border-white/10 flex flex-col items-center justify-center">
          <canvas ref={canvasRef} width={280} height={60} className="w-full h-16" />
          <span className="text-[11px] text-white/50 mt-2">
            {isPlaying ? '♪ Playing harmonic chimes' : 'Paused'}
          </span>
        </div>

        {/* Playback Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition-transform transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/60 font-semibold">
            <span>Music Categories</span>
            <span className="text-[10px] text-pink-400 font-normal">All Custom Synthesized</span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-medium">
            {[
              { id: 'sukoon' as MusicCategory, label: '🕊️ Sukoon' },
              { id: 'birthday' as MusicCategory, label: '🎂 Birthday' },
              { id: 'desi' as MusicCategory, label: '🪘 Party' },
              { id: 'cosmic' as MusicCategory, label: '🌌 Cosmic' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer truncate ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white border border-pink-400/40 shadow-xs font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filtered Track Cards */}
          <div className="grid grid-cols-1 gap-2 text-left">
            {TRACKS_CATALOG.filter(t => t.category === activeCategory).map(t => {
              const isSel = track === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTrackChange(t.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isSel
                      ? 'bg-gradient-to-r from-pink-500/25 to-purple-500/25 border-pink-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{t.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isSel ? 'text-pink-200' : 'text-white'}`}>
                          {t.name}
                        </span>
                        {t.tag && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/10 text-white/70 border border-white/10">
                            {t.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/50">{t.subtitle}</div>
                    </div>
                  </div>
                  {isSel && (
                    <div className="flex items-center gap-1 text-pink-400">
                      <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <div className="flex items-center gap-1.5">
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
              <span>Volume</span>
            </div>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-pink-500 cursor-pointer h-2 bg-white/20 rounded-lg"
          />
        </div>

        <p className="text-[11px] text-white/40 italic">
          Synthesized in real-time with Web Audio chimes. Zero lag, zero broken streams.
        </p>
      </div>
    </div>
  );
};
