import React, { useState } from 'react';
import { 
  Gift, Sparkles, Heart, Unlock, Stars, PartyPopper, 
  BookOpen, Mail, Flame, ArrowRight, RotateCcw 
} from 'lucide-react';
import { BirthdayData } from '../types/birthday';
import { triggerRealisticConfetti, triggerFireworks, triggerHeartShower } from '../utils/confettiFireworks';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { activityTracker } from '../utils/activityTracker';
import { UnlimitedWishesGenerator } from './UnlimitedWishesGenerator';
import { RomanticScratchCards } from './RomanticScratchCards';
import { AntiqueWishesBook } from './AntiqueWishesBook';

interface SurpriseSectionProps {
  data: BirthdayData;
}

export const SurpriseSection: React.FC<SurpriseSectionProps> = ({ data }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [surpriseMode, setSurpriseMode] = useState<'chooser' | 'book' | 'classic'>('chooser');

  const handleOpenGift = () => {
    if (isOpened) return;

    setIsShaking(true);
    birthdayAudio.playSparkleChime();

    setTimeout(() => {
      setIsShaking(false);
      setIsOpened(true);
      setSurpriseMode('chooser'); // Show selection options when box opens!
      birthdayAudio.playSparkleChime();
      triggerRealisticConfetti();
      triggerHeartShower();
      triggerFireworks(4500);
      activityTracker.logEvent(
        'surprise',
        'Mystery Birthday Gift Box Opened! 🎁✨',
        `Alihaaa opened her secret surprise gift box!`,
        'purple'
      );
    }, 800);
  };

  const handleReset = () => {
    setIsOpened(false);
    setSurpriseMode('chooser');
  };

  return (
    <section id="surprise" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-pink-500/20 via-rose-500/15 to-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-300 uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Mystery Gift & Sacred Grimoire</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            A secret surprise waiting for you... <span className="text-pink-400">🎁✨</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 font-light max-w-lg mx-auto">
            {isOpened
              ? 'The sacred seal has been broken! Browse the antique book of endless wishes or classic letter.'
              : 'Wrapped with love, bound by cosmic stars. Tap the gift box to unlock what is inside.'}
          </p>
        </div>

        {/* Surprise Box Interactive Container */}
        <div className="flex flex-col items-center justify-center min-h-[360px]">
          {!isOpened ? (
            <div
              onClick={handleOpenGift}
              className={`group cursor-pointer p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105 flex flex-col items-center relative ${
                isShaking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : ''
              }`}
            >
              {/* Floating Sparkle Elements */}
              <div className="absolute -top-4 -right-4 p-2 rounded-full bg-amber-400/30 border border-amber-300/40 text-amber-200 animate-bounce">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-3 -left-3 p-2 rounded-full bg-pink-500/30 border border-pink-300/40 text-pink-200 animate-pulse">
                <Heart className="w-4 h-4 fill-pink-300" />
              </div>

              {/* 3D Styled Gift Box Icon Container */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-xl shadow-pink-500/40 group-hover:rotate-3 transition-transform relative overflow-hidden">
                {/* Ribbon Stripes */}
                <div className="absolute inset-y-0 w-8 bg-amber-300/70 border-x border-amber-200/50" />
                <div className="absolute inset-x-0 h-8 bg-amber-300/70 border-y border-amber-200/50" />
                <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-lg z-10 group-hover:scale-110 transition-transform" />
              </div>

              <div className="mt-6 space-y-1">
                <span className="text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-1.5">
                  <Unlock className="w-4 h-4 text-amber-300" />
                  <span>Tap to Open Your Secret Surprise</span>
                </span>
                <p className="text-xs text-pink-200/80">Packed with magical blessings for {data.girlName}</p>
              </div>
            </div>
          ) : (
            /* Opened Cinematic Gift Presentation */
            <div className="w-full max-w-3xl rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-white/15 via-slate-950/60 to-pink-950/50 backdrop-blur-2xl border border-pink-300/30 shadow-2xl space-y-6 text-left relative overflow-hidden animate-scale-up">
              {/* Confetti Ribbon Banner & View Selector Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-white/15 pb-4 gap-3">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <PartyPopper className="w-4 h-4" />
                  <span>Surprise Unlocked</span>
                </div>

                {/* Option Chooser Button & Direct Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      birthdayAudio.playPageFlip();
                      setSurpriseMode('chooser');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                      surpriseMode === 'chooser'
                        ? 'bg-amber-500 text-white border-amber-400 font-bold shadow-md shadow-amber-500/30'
                        : 'bg-black/40 text-white/70 border-white/15 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Select Option</span>
                  </button>

                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/40 border border-white/15">
                    <button
                      onClick={() => {
                        birthdayAudio.playPageFlip();
                        setSurpriseMode('book');
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-serif flex items-center gap-1 transition-all cursor-pointer ${
                        surpriseMode === 'book'
                          ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-700/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      title="Antique Burnt & Torn Book"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Burnt Book</span>
                    </button>

                    <button
                      onClick={() => {
                        birthdayAudio.playSparkleChime();
                        setSurpriseMode('classic');
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        surpriseMode === 'classic'
                          ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-700/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      title="Classic Birthday Letter & Scratch Cards"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Classic UI</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-white/50 hover:text-white underline transition-colors cursor-pointer"
                >
                  Wrap again
                </button>
              </div>

              {/* OPTION SELECTION SCREEN (User can select which one they want to open) */}
              {surpriseMode === 'chooser' ? (
                <div className="py-6 space-y-6 animate-fade-in text-center">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 border border-pink-400/30 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Choose Your Surprise
                    </span>
                    <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
                      Which Surprise Experience Would You Like To Open? 🎁✨
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
                      Select which one you would like to explore. You can switch between them anytime!
                    </p>
                  </div>

                  {/* 2 Big Choice Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2 text-left">
                    {/* OPTION 1: ANTIQUE BURNT & TORN WISH BOOK */}
                    <div
                      onClick={() => {
                        birthdayAudio.playPageFlip();
                        setSurpriseMode('book');
                      }}
                      className="group cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-[#2e150c]/95 via-[#1e0e08]/95 to-black/95 border-2 border-amber-600/50 hover:border-amber-400 shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between space-y-5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/20 blur-2xl rounded-full pointer-events-none group-hover:bg-amber-500/30 transition-all" />
                      
                      <div className="space-y-3 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-800 to-amber-600 border border-amber-400/50 flex items-center justify-center text-white shadow-lg shadow-amber-950">
                          <BookOpen className="w-6 h-6 text-amber-100" />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-serif font-bold uppercase tracking-wider">
                            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            <span>Antique Experience</span>
                          </div>
                          <h4 className="font-['Playfair_Display'] text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                            The Antique Burnt & Torn Grimoire
                          </h4>
                        </div>

                        <p className="text-xs text-amber-200/80 leading-relaxed font-serif">
                          Real charred & torn paper edges, vintage ink pen calligraphy, categorized folios (Emotional, Funny, Inspirational, Vows), and endless wishes.
                        </p>
                      </div>

                      <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-serif font-bold text-xs shadow-lg shadow-amber-950 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-all cursor-pointer">
                        <span>Open Antique Grimoire</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* OPTION 2: CLASSIC ROYAL LETTER & SCRATCH CARDS (OLD UI) */}
                    <div
                      onClick={() => {
                        birthdayAudio.playSparkleChime();
                        setSurpriseMode('classic');
                      }}
                      className="group cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-pink-950/85 via-slate-950/85 to-purple-950/85 border-2 border-pink-500/50 hover:border-pink-300 shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between space-y-5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-pink-400/30 transition-all" />

                      <div className="space-y-3 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 border border-pink-300/50 flex items-center justify-center text-white shadow-lg shadow-pink-950">
                          <Mail className="w-6 h-6 text-pink-100" />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-pink-300 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                            <span>Original Experience (Old UI)</span>
                          </div>
                          <h4 className="font-['Playfair_Display'] text-xl font-bold text-white group-hover:text-pink-200 transition-colors">
                            The Classic Royal Letter & Activities
                          </h4>
                        </div>

                        <p className="text-xs text-pink-200/80 leading-relaxed font-light">
                          The original heartfelt birthday letter, Shaheer's interactive gold scratch cards, fireworks celebration, and infinite love wishes generator.
                        </p>
                      </div>

                      <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-pink-950 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-all cursor-pointer">
                        <span>Open Classic Letter & Activities</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : surpriseMode === 'book' ? (
                /* MODE 1: THE REQUESTED ANTIQUE FIRE-BURNT BOOK OF WISHES */
                <div className="w-full animate-fade-in py-2">
                  <AntiqueWishesBook girlName={data.girlName} />
                </div>
              ) : (
                /* MODE 2: CLASSIC ROYAL LETTER & SCRATCH CARDS */
                <div className="space-y-6 animate-fade-in">
                  {/* Golden Headline */}
                  <div className="space-y-2">
                    <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white leading-snug">
                      "You deserve all the happiness in the world. Happy Birthday! <span className="text-pink-400">💖</span>"
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-amber-300 rounded-full" />
                  </div>

                  {/* Surprise Letter */}
                  <p className="font-['Dancing_Script'] text-xl sm:text-2xl text-white/95 leading-relaxed">
                    {data.surpriseLetter}
                  </p>

                  {/* Emotional Closing Badge */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                      <span className="text-xs sm:text-sm text-white/90 font-medium">
                        Forever celebrating the wonder that is you.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        birthdayAudio.playSparkleChime();
                        triggerRealisticConfetti();
                        triggerFireworks(3000);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-pink-500 hover:bg-pink-400 text-white shadow-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Stars className="w-3.5 h-3.5" />
                      More Fireworks!
                    </button>
                  </div>

                  {/* Shaheer's Secret Interactive Scratch Cards Activity */}
                  <div className="pt-4 border-t border-white/15">
                    <RomanticScratchCards girlName={data.girlName} />
                  </div>

                  {/* Endless Love Wishes & Pickup Lines Inside Mystery Gift */}
                  <div className="pt-4 border-t border-white/15">
                    <UnlimitedWishesGenerator girlName={data.girlName} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

