import React, { useState } from 'react';
import { Heart, Sparkles, Flame, Zap, Award, Share2, Copy, Check, RefreshCw } from 'lucide-react';
import { birthdayAudio } from '../../utils/audioSynthesizer';
import { triggerRealisticConfetti, triggerHeartShower } from '../../utils/confettiFireworks';
import { activityTracker } from '../../utils/activityTracker';

interface LoveMeterGameProps {
  girlName: string;
}

export const LoveMeterGame: React.FC<LoveMeterGameProps> = ({ girlName }) => {
  const [partner1, setPartner1] = useState(girlName);
  const [partner2, setPartner2] = useState('Sherry');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [verdictIndex, setVerdictIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const VERDICTS = [
    {
      score: 100,
      title: 'Cosmic Celestial Soulmates ♾️💖',
      zodiacAura: 'Rose Gold Starlight & Golden Nebula',
      analysis: 'The stars aligned billions of years ago just to script this bond. Sherry and Alihaaa resonate on a frequency where a single glance speaks louder than a thousand books. Mathematically, emotionally, and cosmically unshakeable!',
      quote: '“Tere hone se hi mera wajood mukammal hai...”'
    },
    {
      score: 99.9,
      title: 'Flawless Royal Royalty 👑✨',
      zodiacAura: 'Emerald Moonlight & Amber Fire',
      analysis: 'A rare bond where deep understanding meets endless playful banter. Even when Alihaaa is dramatic or Sherry acts silly, their hearts synchronize in perfect harmony!',
      quote: '“Hazaar chehron mein sirf tu hi azeez hai...”'
    },
    {
      score: 99.8,
      title: 'Eternal Lifetime Bond 💍🕊️',
      zodiacAura: 'Amethyst Velvet & Diamond Glow',
      analysis: 'Sherry will happily surrender in every dispute, order midnight treats on command, and stand as an eternal shield across every season of life.',
      quote: '“Har kal tera hai, meri har subah teri hai...”'
    }
  ];

  const handleCalculate = () => {
    if (!partner1.trim() || !partner2.trim()) return;
    setIsCalculating(true);
    setCalculatedScore(null);
    birthdayAudio.playPageFlip();

    // Heartbeat audio intervals
    const pulseTimer = setInterval(() => {
      birthdayAudio.playSparkleChime();
    }, 350);

    setTimeout(() => {
      clearInterval(pulseTimer);
      setIsCalculating(false);
      const chosen = Math.floor(Math.random() * VERDICTS.length);
      setVerdictIndex(chosen);
      setCalculatedScore(VERDICTS[chosen].score);
      triggerHeartShower();
      triggerRealisticConfetti();
      activityTracker.logEvent('game', 'Calculated Love Meter 💖', `${partner1} & ${partner2} scored ${VERDICTS[chosen].score}%`, 'pink');
    }, 1800);
  };

  const handleShare = () => {
    const verdict = VERDICTS[verdictIndex];
    const text = `💖 Official Soulmate Certificate 💖\n${partner1} + ${partner2} = ${verdict.score}%\nVerdict: ${verdict.title}\n“${verdict.quote}”\nVerified under Sherry's Cosmic Love Registry ✨`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    birthdayAudio.playSparkleChime();
    setTimeout(() => setCopied(false), 2200);
  };

  const currentVerdict = VERDICTS[verdictIndex];

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/80 via-pink-950/30 to-slate-950/80 border border-pink-400/30 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fade-in">
      {/* Title */}
      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-bold uppercase tracking-wider">
          Cosmic Compatibility Engine
        </span>
        <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
          Aliha & Sherry Love Frequency Meter 💖
        </h3>
        <p className="text-xs text-white/70 max-w-md mx-auto">
          Calculate the exact emotional and cosmic soulmate vibration between Alihaaa and Sherry!
        </p>
      </div>

      {/* Input Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <div className="p-3.5 rounded-2xl bg-black/40 border border-pink-500/30 text-left space-y-1">
          <label className="text-[11px] text-pink-300 font-semibold flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>The Birthday Queen:</span>
          </label>
          <input
            type="text"
            value={partner1}
            onChange={(e) => setPartner1(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder-white/40"
            placeholder="Enter Name"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 text-left space-y-1">
          <label className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>The Devoted Admirer:</span>
          </label>
          <input
            type="text"
            value={partner2}
            onChange={(e) => setPartner2(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder-white/40"
            placeholder="Enter Name"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <div>
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-pink-600/40 flex items-center gap-2 mx-auto cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Heart className={`w-4 h-4 ${isCalculating ? 'animate-ping fill-white' : 'fill-white'}`} />
          <span>{isCalculating ? 'Calculating Cosmic Frequency...' : 'Calculate Soulmate Frequency 💫'}</span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </button>
      </div>

      {/* Animated Calculation Screen */}
      {isCalculating && (
        <div className="p-8 rounded-3xl bg-black/50 border border-pink-500/30 space-y-4 animate-pulse">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center animate-bounce">
            <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-ping" />
          </div>
          <p className="text-sm font-serif text-pink-200">
            Measuring heartbeats, synchronizing planetary orbits & checking intergalactic love laws...
          </p>
        </div>
      )}

      {/* Result Card */}
      {calculatedScore !== null && !isCalculating && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-black/70 to-pink-950/40 border border-pink-400/50 space-y-5 text-left animate-scale-up">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
            <span className="text-xs text-pink-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{currentVerdict.title}</span>
            </span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Aura: {currentVerdict.zodiacAura}
            </span>
          </div>

          {/* Big Score Counter */}
          <div className="flex items-center justify-center gap-4 py-2">
            <span className="font-['Playfair_Display'] text-5xl sm:text-6xl font-black bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
              {calculatedScore}%
            </span>
            <div className="text-left space-y-0.5">
              <span className="text-sm font-bold text-white block">Celestial Resonance</span>
              <span className="text-xs text-pink-300/80 block">Unmatched Compatibility</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-full transition-all duration-1000"
              style={{ width: `${calculatedScore}%` }}
            />
          </div>

          {/* Verdict Body */}
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light">
            {currentVerdict.analysis}
          </p>

          <blockquote className="font-serif italic text-sm text-amber-200 border-l-2 border-pink-400 pl-3">
            {currentVerdict.quote}
          </blockquote>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={handleCalculate}
              className="text-xs text-white/70 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Test Again</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Certificate Copied!' : 'Copy Soulmate Decree'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
