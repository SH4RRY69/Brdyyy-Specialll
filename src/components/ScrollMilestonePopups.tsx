import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Gift, Camera, PartyPopper, X, ChevronDown } from 'lucide-react';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { activityTracker } from '../utils/activityTracker';

interface MilestonePopup {
  id: string;
  triggerScrollPercent: number; // 0 to 100
  title: string;
  message: string;
  icon: any;
  iconColor: string;
  gradient: string;
}

const MILESTONES: MilestonePopup[] = [
  {
    id: 'milestone-about',
    triggerScrollPercent: 18,
    title: 'Keep Scrolling, Alihaaa... 🌸',
    message: 'So much love, warmth, and little memories are waiting just down below for you.',
    icon: Heart,
    iconColor: 'text-pink-400 fill-pink-400',
    gradient: 'from-pink-500/20 via-rose-500/20 to-purple-500/20'
  },
  {
    id: 'milestone-wishes',
    triggerScrollPercent: 36,
    title: 'Wishes For Your Beautiful Soul 💌',
    message: 'Every word written here was whispered to the stars just for your genuine smile.',
    icon: Sparkles,
    iconColor: 'text-amber-300',
    gradient: 'from-amber-500/20 via-pink-500/20 to-rose-500/20'
  },
  {
    id: 'milestone-memories',
    triggerScrollPercent: 55,
    title: 'Golden Memories Timeline ✨📸',
    message: 'Looking back at our moments... every single second with you is a treasure.',
    icon: Camera,
    iconColor: 'text-sky-300',
    gradient: 'from-sky-500/20 via-indigo-500/20 to-purple-500/20'
  },
  {
    id: 'milestone-surprise',
    triggerScrollPercent: 78,
    title: 'Almost at Your Mystery Gift! 🎁',
    message: 'Get ready... a special surprise gift box is waiting right down below!',
    icon: Gift,
    iconColor: 'text-pink-300',
    gradient: 'from-fuchsia-500/20 via-pink-500/20 to-amber-500/20'
  }
];

export const ScrollMilestonePopups: React.FC<{ girlName: string }> = ({ girlName }) => {
  const [activePopup, setActivePopup] = useState<MilestonePopup | null>(null);
  const [triggeredIds, setTriggeredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const currentPercent = (scrollY / docHeight) * 100;

      for (const milestone of MILESTONES) {
        if (currentPercent >= milestone.triggerScrollPercent && !triggeredIds.has(milestone.id)) {
          // Trigger popup!
          setTriggeredIds(prev => new Set(prev).add(milestone.id));
          setActivePopup(milestone);
          birthdayAudio.playSparkleChime();
          activityTracker.logEvent('scroll', milestone.title, `Reached ${milestone.triggerScrollPercent}% page scroll`, 'rose');

          // Auto dismiss after 6 seconds
          setTimeout(() => {
            setActivePopup(curr => (curr?.id === milestone.id ? null : curr));
          }, 6000);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggeredIds]);

  if (!activePopup) return null;

  const Icon = activePopup.icon;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto max-w-md pointer-events-auto animate-fade-in">
      <div
        className={`rounded-2xl p-4 sm:p-5 bg-slate-950/95 border border-pink-400/40 backdrop-blur-2xl shadow-2xl shadow-pink-500/20 bg-linear-to-r ${activePopup.gradient} relative overflow-hidden`}
      >
        {/* Soft radial glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative z-10">
          <div className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-400/30 shrink-0">
            <Icon className={`w-5 h-5 ${activePopup.iconColor} animate-pulse`} />
          </div>

          <div className="flex-1 pr-4 space-y-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-['Playfair_Display'] text-sm sm:text-base font-bold text-white leading-tight">
                {activePopup.title.replace('Alihaaa', girlName)}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-light">
              {activePopup.message}
            </p>
          </div>

          <button
            onClick={() => setActivePopup(null)}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors shrink-0"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mini progress bar timer indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
          <div className="h-full bg-pink-400/70 animate-[width_6s_linear_forwards] w-full" />
        </div>
      </div>
    </div>
  );
};
