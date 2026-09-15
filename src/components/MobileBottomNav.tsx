import React from 'react';
import {
  Home,
  Cake,
  Mic,
  HeartHandshake,
  Image as ImageIcon,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { birthdayAudio } from '../utils/audioSynthesizer';

interface MobileBottomNavProps {
  activeSection: string;
  onNavClick: (id: string) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavClick,
  isPlayingMusic,
  onToggleMusic
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cake', label: '3D Cake', icon: Cake },
    { id: 'voice-notes', label: 'Voices', icon: Mic },
    { id: 'wishes', label: 'Wishes', icon: HeartHandshake },
    { id: 'gallery', label: 'Photos', icon: ImageIcon },
    { id: 'surprise', label: 'Surprise', icon: Sparkles }
  ];

  const handleClick = (id: string) => {
    birthdayAudio.playSparkleChime();
    onNavClick(id);
  };

  return (
    <aside
      id="mobile-main-bar"
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-3 inset-x-3 z-40 md:hidden max-w-md mx-auto pointer-events-auto select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Small top dedication indicator */}
      <div className="flex justify-center -mb-1">
        <span className="text-[9px] font-mono tracking-widest text-pink-200/80 px-2.5 py-0.5 rounded-t-lg bg-black/80 backdrop-blur-md border-t border-x border-pink-400/30">
          SH3RRY ✦ SHAHEER
        </span>
      </div>

      <div className="flex items-center justify-between gap-1 px-2 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-pink-500/30 shadow-2xl shadow-black/90 text-white">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-300 relative cursor-pointer ${
                isActive
                  ? 'text-pink-300 bg-pink-500/20 scale-105 shadow-xs shadow-pink-500/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5 active:scale-95'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-pink-300' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap leading-none ${
                  isActive ? 'text-pink-200 font-semibold' : 'text-white/65'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Mini Music Toggle Button */}
        <button
          onClick={() => {
            birthdayAudio.playSparkleChime();
            onToggleMusic();
          }}
          className={`px-2 py-1 rounded-xl transition-all flex flex-col items-center justify-center cursor-pointer border ${
            isPlayingMusic
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 animate-pulse'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
          }`}
          title={isPlayingMusic ? 'Pause Ambient Music' : 'Play Ambient Music'}
          aria-label="Toggle background music"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4 text-amber-300" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="text-[9px] font-mono mt-0.5 whitespace-nowrap leading-none">
            {isPlayingMusic ? 'Music' : 'Mute'}
          </span>
        </button>
      </div>
    </aside>
  );
};
