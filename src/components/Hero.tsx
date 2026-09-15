import React, { useState } from 'react';
import { Sparkles, Heart, Gift, Wand2 } from 'lucide-react';
import { BirthdayData } from '../types/birthday';
import { ThreeBirthdayScene } from './ThreeBirthdayScene';
import { triggerRealisticConfetti, triggerFireworks, triggerHeartShower } from '../utils/confettiFireworks';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { activityTracker } from '../utils/activityTracker';

interface HeroProps {
  data: BirthdayData;
  themeColor: string;
  onOpenWishModal: () => void;
  animKey?: number;
}

export const Hero: React.FC<HeroProps> = ({ data, themeColor, onOpenWishModal, animKey = 0 }) => {
  const [screenGlow, setScreenGlow] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const handleMakeAWish = () => {
    setScreenGlow(true);
    setWishMade(true);
    birthdayAudio.playSparkleChime();
    triggerRealisticConfetti();
    triggerHeartShower();
    triggerFireworks(3500);
    activityTracker.logEvent('wish', 'Birthday Wish Triggered ✨', `${data.girlName} clicked Make A Wish!`, 'pink');

    setTimeout(() => {
      setScreenGlow(false);
    }, 1800);

    onOpenWishModal();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] w-full flex flex-col justify-center items-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16"
    >
      {/* Dynamic Screen Glow Pulse when Make a Wish is clicked */}
      {screenGlow && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-r from-pink-500/30 via-rose-300/30 to-amber-300/30 backdrop-blur-xs animate-pulse transition-opacity duration-1000" />
      )}

      {/* Atmospheric Background Lights & Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 my-auto">
        {/* Left Column: Romantic Display Typography & Narrative */}
        <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start space-y-4 sm:space-y-6">
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-pink-200 shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-medium tracking-wide">A Magical Celebration Dedicated To You</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-[11px] font-medium text-pink-200">
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
              <span>Dedicated by <strong className="text-white font-semibold">SH3RRY / SHAHEER</strong></span>
            </div>
          </div>

          {/* Main Title with Cascading Letter-by-Letter Entrance Animation */}
          <div key={animKey} className="space-y-1 sm:space-y-2">
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.18]">
              <span className="inline-block text-xl sm:text-3xl md:text-4xl lg:text-5xl text-pink-200/95 font-serif italic tracking-normal block mb-1.5">
                {"To The Light Of My Whole Universe,".split('').map((char, i) => (
                  <span
                    key={`line1-${i}`}
                    style={{ animationDelay: `${i * 32}ms` }}
                    className="inline-block animate-letter-pop"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <span className="inline-block text-2xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-amber-200 via-rose-100 to-pink-200 bg-clip-text text-transparent">
                {"A Celestial Celebration For".split('').map((char, i) => (
                  <span
                    key={`line2-${i}`}
                    style={{ animationDelay: `${(28 + i) * 32}ms` }}
                    className="inline-block animate-letter-pop"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent italic drop-shadow-md">
                {data.girlName.split('').map((char, i) => (
                  <span
                    key={`name-${i}`}
                    style={{ animationDelay: `${(54 + i) * 32}ms` }}
                    className="inline-block animate-letter-pop"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <span
                style={{ animationDelay: `${(54 + data.girlName.length) * 32}ms` }}
                className="inline-block ml-3 animate-letter-pop text-3xl sm:text-5xl"
              >
                ✧ 💖 ✧
              </span>
            </h1>
            <p
              style={{ animationDelay: `${(20 + data.girlName.length) * 35}ms` }}
              className="font-['Outfit'] text-base sm:text-lg md:text-xl text-white/80 max-w-lg font-light pt-2 animate-letter-pop"
            >
              "{data.heroSubtitle}"
            </p>
          </div>

          {/* Emotional Quote Snippet */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 max-w-lg text-xs sm:text-sm text-white/75 italic relative">
            <span className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/40 text-[10px] text-pink-200 font-sans not-italic uppercase tracking-wider font-semibold">
              From The Heart
            </span>
            "{data.aboutIntro}"
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
            {/* Scroll to Cake Section Button */}
            <button
              onClick={() => scrollToSection('cake')}
              className="px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 border border-white/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span>Blow The 3D Cake 🎂✨</span>
            </button>

            {/* Make a Wish Button */}
            <button
              onClick={handleMakeAWish}
              className="px-5 sm:px-6 py-3.5 rounded-full text-sm sm:text-base font-medium text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-pink-300" />
              <span>{wishMade ? 'Make Another Wish ✨' : 'Make a Wish ✨'}</span>
            </button>

            {/* Explore Story Button */}
            <button
              onClick={() => scrollToSection('about')}
              className="px-4 py-3.5 rounded-full text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Her Story</span>
            </button>

            {/* Secret Gift Quick Jump */}
            <button
              onClick={() => scrollToSection('surprise')}
              className="p-3.5 rounded-full text-white/80 bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
              title="Jump to Surprise Gift"
              aria-label="Jump to surprise gift"
            >
              <Gift className="w-5 h-5 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Right Column: Grand Welcoming Celebration Showcase */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl relative flex flex-col items-center text-center space-y-6">
            {/* Glowing Crown / Sparkle Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 p-0.5 shadow-xl shadow-pink-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center text-3xl">
                👑
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-pink-300 uppercase tracking-widest font-mono">
                Queen Of The Day
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
                {data.girlName}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 italic max-w-xs">
                "May your day be filled with celestial wonders, boundless happiness, and eternal love."
              </p>
            </div>

            {/* Quick Cake Invitation Banner */}
            <button
              onClick={() => scrollToSection('cake')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500/20 to-amber-500/20 hover:from-pink-500/30 hover:to-amber-500/30 border border-pink-400/40 text-xs sm:text-sm font-semibold text-pink-100 flex items-center justify-between group transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🎂</span>
                <span>3D Cake Ceremony Ready</span>
              </span>
              <span className="text-pink-300 group-hover:translate-x-1 transition-transform">
                Go to Cake ↓
              </span>
            </button>

            {/* Floating Heart / Sparkle Badges */}
            <div className="flex items-center justify-center gap-3 text-xs text-white/60 pt-1">
              <span className="flex items-center gap-1">✨ 3D Galaxy</span>
              <span>•</span>
              <span className="flex items-center gap-1">💖 Dedicated</span>
              <span>•</span>
              <span className="flex items-center gap-1">🎂 5 Candles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Floating Scroll Down Popup Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900/90 border border-pink-400/50 backdrop-blur-xl shadow-xl shadow-pink-500/25 text-white flex items-center gap-2.5 group transition-all transform hover:scale-105 active:scale-95"
          aria-label="Scroll down to explore surprises for Alihaaa"
        >
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span className="text-xs sm:text-sm font-medium tracking-wide text-pink-200 group-hover:text-white transition-colors">
            Scroll down for surprises, Alihaaa♡ ✨
          </span>
          <div className="w-5 h-5 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 group-hover:bg-pink-500 group-hover:text-white transition-colors">
            ↓
          </div>
        </button>
      </div>
    </section>
  );
};
