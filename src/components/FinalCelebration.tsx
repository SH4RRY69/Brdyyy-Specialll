import React, { useState } from 'react';
import { Heart, Sparkles, PartyPopper } from 'lucide-react';
import { BirthdayData } from '../types/birthday';
import { triggerRealisticConfetti, triggerFireworks, triggerHeartShower } from '../utils/confettiFireworks';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { activityTracker } from '../utils/activityTracker';
import { D3FireworksCanvas } from './D3FireworksCanvas';

interface FinalCelebrationProps {
  data: BirthdayData;
}

export const FinalCelebration: React.FC<FinalCelebrationProps> = ({ data }) => {
  const [showD3Fireworks, setShowD3Fireworks] = useState(false);

  const handleCelebrate = () => {
    setShowD3Fireworks(true);
    birthdayAudio.playSparkleChime();
    triggerRealisticConfetti();
    triggerHeartShower();
    activityTracker.logEvent('surprise', 'D3 Full-Screen Fireworks Celebrated! 🎆', 'Triggered full-screen D3 celebration fireworks', 'amber');
  };

  const handleGrandCelebration = () => {
    setShowD3Fireworks(true);
    birthdayAudio.playSparkleChime();
    triggerRealisticConfetti();
    triggerHeartShower();
    triggerFireworks(6000);
    activityTracker.logEvent('surprise', 'Grand Fireworks Launched! 🎆', 'Grand finale celebration triggered!', 'amber');
  };

  return (
    <footer className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 w-full overflow-hidden border-t border-white/10 bg-linear-to-b from-transparent to-black/80">
      {/* Background radial celebratory lights */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-pink-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-12">
        {/* Main Headline */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-semibold text-pink-300 uppercase tracking-widest">
            <PartyPopper className="w-4 h-4 text-amber-300" />
            <span>The Grand Finale</span>
          </div>

          <h2 className="font-['Playfair_Display'] text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Once Again... Happy Birthday,
            <br />
            <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
              {data.girlName}
            </span>{' '}
            <span className="inline-block animate-bounce">🎂💖</span>
          </h2>

          <p className="font-['Dancing_Script'] text-2xl sm:text-3xl text-pink-200 max-w-2xl mx-auto leading-relaxed">
            "{data.finalMessage}"
          </p>
        </div>

        {/* Celebration Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
          {/* Dedicated "Celebrate" Button (Triggers full-screen D3-based fireworks animation across canvas) */}
          <button
            onClick={handleCelebrate}
            id="celebrate-btn"
            className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 hover:from-amber-200 hover:to-yellow-300 shadow-2xl shadow-amber-400/40 border-2 border-white/80 transform hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <PartyPopper className="w-5 h-5 text-amber-900 group-hover:rotate-12 transition-transform" />
            <span>Celebrate 🎆</span>
          </button>

          {/* Grand Fireworks & Confetti */}
          <button
            onClick={handleGrandCelebration}
            className="w-full sm:w-auto px-7 sm:px-9 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 shadow-2xl shadow-pink-500/40 border border-white/30 transform hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-45 transition-transform" />
            <span>Launch Grand Fireworks & Confetti ✨</span>
          </button>
        </div>
        <span className="block text-xs text-white/50 -mt-8">
          Click 'Celebrate' for full-screen D3 cosmic fireworks across the whole screen
        </span>

        {/* Dedicated Personal Devotion Note from SH3RRY / SHAHEER */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/5 backdrop-blur-xl border border-pink-400/20 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-semibold text-pink-300">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>Forever Dedicated to Alihaaa by SH3RRY (Shaheer)</span>
          </div>
          <p className="text-sm sm:text-base text-white/90 font-serif italic leading-relaxed">
            “In this entire universe of billions of souls, you are my one and only constant prayer. May your smiles never fade, your days be filled with endless barakah, and your heart always know how genuinely cherished you are.”
          </p>
          <div className="text-xs text-pink-300/90 font-mono font-medium">
            — With all my heart & soul, SH3RRY / SHAHEER 💍✨
          </div>
        </div>

        {/* Footer Credit & Copyright Notice */}
        <div className="pt-8 text-xs text-white/50 space-y-2 border-t border-white/10 max-w-xl mx-auto">
          <p className="font-semibold text-white/90 tracking-wide text-sm">
            © {new Date().getFullYear()} SH3RRY / SHAHEER. All Rights Reserved.
          </p>
          <p className="text-pink-300 font-medium text-xs sm:text-sm">
            Exclusively Architected, Designed & Dedicated with Infinite Devotion by{' '}
            <strong className="text-white font-bold tracking-wide">SH3RRY / SHAHEER</strong> for Alihaaa♡ 💖✨
          </p>
          <p className="text-[11px] text-white/40 font-mono">
            Crafted for Eternity • Universal Birthday Portal by SH3RRY (Shaheer)
          </p>
        </div>
      </div>

      {/* Full-Screen D3-based Fireworks Animation */}
      <D3FireworksCanvas
        isActive={showD3Fireworks}
        onComplete={() => setShowD3Fireworks(false)}
      />
    </footer>
  );
};
