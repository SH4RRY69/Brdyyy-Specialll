import React, { useState } from 'react';
import { Sparkles, Heart, Wand2, Flame, FlameKindling, Wind, Rotate3d, Music, PartyPopper } from 'lucide-react';
import { BirthdayData } from '../types/birthday';
import { ThreeBirthdayScene } from './ThreeBirthdayScene';
import { triggerRealisticConfetti, triggerFireworks, triggerHeartShower } from '../utils/confettiFireworks';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { activityTracker } from '../utils/activityTracker';

interface CakeSectionProps {
  data: BirthdayData;
  themeColor: string;
  onOpenWishModal: () => void;
  cardBg?: string;
  cardBorder?: string;
}

export const CakeSection: React.FC<CakeSectionProps> = ({
  data,
  themeColor,
  onOpenWishModal,
  cardBg = 'bg-white/5',
  cardBorder = 'border-white/10'
}) => {
  const [cakeCut, setCakeCut] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [candlesKey, setCandlesKey] = useState(0);

  const handleCutCake = () => {
    setCakeCut(true);
    birthdayAudio.playSparkleChime();
    triggerRealisticConfetti();
    triggerHeartShower();
    triggerFireworks(3000);
    activityTracker.logEvent('cake', '🎂 Birthday Cake Cut!', `Alihaaa cut a sweet slice of her 3D birthday cake!`, 'pink');
  };

  const handleRelightAll = () => {
    setCandlesKey(prev => prev + 1);
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('cake', '🔥 Candles Relit', 'All 5 candles were relit on the 3D cake', 'amber');
  };

  const handleBlowAll = () => {
    birthdayAudio.playBlowOutSound();
    triggerRealisticConfetti();
    triggerHeartShower();
    activityTracker.logEvent('candle', '💨 All Candles Blown Out!', 'Alihaaa blew out all candles in one breath!', 'rose');
    setTimeout(() => {
      onOpenWishModal();
    }, 400);
  };

  return (
    <section
      id="cake"
      className="relative min-h-[90svh] w-full flex flex-col justify-center items-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-pink-500/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-400/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center text-center space-y-8">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs sm:text-sm text-pink-200 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-semibold tracking-wide">Interactive 3D Birthday Cake Ceremony</span>
          </div>

          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Make A Wish & Blow The Candles,{' '}
            <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent italic">
              {data.girlName}♡
            </span>
          </h2>

          <p className="text-sm sm:text-base text-white/75 font-light">
            Rotate the cake in 360° 3D, tap each glowing candle to blow it out, or cut a sweet slice to celebrate!
          </p>
        </div>

        {/* Dedicated 3D Cake Canvas Container */}
        <div className="w-full max-w-3xl h-[420px] sm:h-[500px] md:h-[560px] rounded-3xl bg-radial from-white/10 via-white/5 to-transparent border border-white/15 backdrop-blur-md shadow-2xl relative p-4 flex items-center justify-center overflow-hidden">
          {/* 3D Scene */}
          <ThreeBirthdayScene
            key={candlesKey}
            themeColor={themeColor}
            onAllCandlesBlownOut={onOpenWishModal}
            interactive={true}
          />

          {/* Floating Instructions Pill */}
          <div className="absolute top-4 left-4 pointer-events-none px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white/80 flex items-center gap-2 shadow-lg">
            <Rotate3d className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Drag anywhere on cake to rotate in 3D</span>
          </div>

          {/* Right Floating Candle Tip */}
          <div className="absolute top-4 right-4 pointer-events-none px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30 text-[11px] text-amber-200 flex items-center gap-2 shadow-lg">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Tap candles to blow out or light up</span>
          </div>

          {/* Cake Cut Status Ribbon */}
          {cakeCut && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-emerald-500/80 backdrop-blur-md border border-emerald-400 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
              <PartyPopper className="w-4 h-4 text-amber-200" />
              <span>Sweet Slice Cut for {data.girlName}! May all your dreams come true! 🎂✨</span>
            </div>
          )}
        </div>

        {/* Ceremony Interaction Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          {/* Cut Cake Button */}
          <button
            onClick={handleCutCake}
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 border border-white/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PartyPopper className="w-4 h-4 text-amber-200" />
            <span>{cakeCut ? 'Cut Another Slice 🍰' : 'Cut The Cake 🎂'}</span>
          </button>

          {/* Blow All Candles Button */}
          <button
            onClick={handleBlowAll}
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Wind className="w-4 h-4 text-sky-300" />
            <span>Blow All Candles 💨</span>
          </button>

          {/* Relight Candles Button */}
          <button
            onClick={handleRelightAll}
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FlameKindling className="w-4 h-4 text-amber-300" />
            <span>Relight Candles 🔥</span>
          </button>

          {/* Make A Wish Button */}
          <button
            onClick={onOpenWishModal}
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-pink-500/30 hover:bg-pink-500/50 border border-pink-400/40 backdrop-blur-md shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-pink-300" />
            <span>Whisper A Secret Wish ✨</span>
          </button>
        </div>
      </div>
    </section>
  );
};
