import React, { useState } from 'react';
import { Sparkles, Heart, Gift, Award, CheckCircle2, Flame, RefreshCw, Star, Lock, Eye, Volume2, VolumeX } from 'lucide-react';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { triggerRealisticConfetti, triggerHeartShower, triggerFireworks } from '../utils/confettiFireworks';
import { activityTracker } from '../utils/activityTracker';

interface ScratchCardItem {
  id: string;
  title: string;
  category: string;
  teaser: string;
  secretMessage: string;
  badge: string;
  color: string;
}

const SECRET_CARDS: ScratchCardItem[] = [
  {
    id: 'promise',
    title: "Shaheer's Sacred Promise",
    category: "Eternal Vow",
    teaser: "A lifetime promise etched across the stars...",
    secretMessage: "No matter where life takes us, my hand will always hold yours. Through every storm, every smile, and under every starry sky, you are my forever home, Alihaaa. ♡",
    badge: "🌟 Sacred Promise",
    color: "from-pink-500/30 to-rose-600/30 border-pink-400/40"
  },
  {
    id: 'favorite',
    title: "What Shaheer Loves Most About You",
    category: "The Secret Truth",
    teaser: "The little thing that steals my breath away...",
    secretMessage: "The way your eyes light up when you laugh, and how you turn the simplest ordinary moments into pure magic. The whole world fades away when you smile. You are irreplaceable. ♡",
    badge: "💖 Pure Love",
    color: "from-amber-500/30 to-rose-500/30 border-amber-400/40"
  },
  {
    id: 'dream_date',
    title: "Our Next Dream Adventure",
    category: "Future Memory",
    teaser: "A private destination reserved just for the two of us...",
    secretMessage: "A peaceful midnight drive under endless fairy lights, warm desserts, our favorite songs on repeat, and slow dancing without a single worry in the universe. Just you and me. ♡",
    badge: "👑 Dream Date",
    color: "from-purple-500/30 to-pink-500/30 border-purple-400/40"
  },
  {
    id: 'whisper',
    title: "A Midnight Whisper Only For You",
    category: "From Sherry's Heart",
    teaser: "Words kept safe in the deepest corner of my soul...",
    secretMessage: "You didn't just walk into my life; you became my peace, my strength, and the reason I look forward to every tomorrow. Happy Birthday to the most special soul in existence. — Yours always, Shaheer ♡",
    badge: "💌 Soul Whisper",
    color: "from-rose-500/30 to-red-600/30 border-rose-400/40"
  }
];

export const RomanticScratchCards: React.FC<{ girlName: string }> = ({ girlName }) => {
  const [scratchedIds, setScratchedIds] = useState<string[]>([]);
  const [scratchingId, setScratchingId] = useState<string | null>(null);
  const [isHeartbeatPlaying, setIsHeartbeatPlaying] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [copiedCertificate, setCopiedCertificate] = useState(false);

  const handleScratch = (card: ScratchCardItem) => {
    if (scratchedIds.includes(card.id)) return;

    setScratchingId(card.id);
    birthdayAudio.playSparkleChime();

    // Reveal after realistic scratch animation
    setTimeout(() => {
      setScratchedIds(prev => [...prev, card.id]);
      setScratchingId(null);
      birthdayAudio.playSparkleChime();
      triggerRealisticConfetti();
      triggerHeartShower();

      activityTracker.logEvent(
        'surprise',
        `Romantic Scratch Card Revealed: ${card.title}`,
        `Alihaaa unlocked: "${card.secretMessage.slice(0, 45)}..."`,
        'purple'
      );

      // If all unlocked, fire huge fireworks
      if (scratchedIds.length + 1 === SECRET_CARDS.length) {
        triggerFireworks(4500);
      }
    }, 650);
  };

  const handleResetScratchCards = () => {
    setScratchedIds([]);
    birthdayAudio.playSparkleChime();
  };

  // Gentle rhythmic heartbeat simulation
  const toggleHeartbeat = () => {
    if (isHeartbeatPlaying) {
      setIsHeartbeatPlaying(false);
    } else {
      setIsHeartbeatPlaying(true);
      birthdayAudio.playSparkleChime();
      activityTracker.logEvent(
        'surprise',
        "Shaheer's Heartbeat Pulse Activated",
        "Alihaaa listened to Shaheer's heartbeat synchronization.",
        'pink'
      );
    }
  };

  return (
    <div className="w-full space-y-8 pt-4">
      {/* Activity Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-linear-to-r from-pink-500/20 to-amber-500/20 border border-pink-400/30 text-xs font-semibold text-pink-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Interactive Romance Activity</span>
        </div>
        <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
          Shaheer's Secret Mystery Scratch Cards ✨
        </h3>
        <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto">
          Each golden card conceals a deeply personal secret confession written specifically for {girlName}. Tap or scratch to peel away the holographic foil!
        </p>

        {/* Progress Tracker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-pink-300 font-mono">
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 animate-pulse" />
          <span>Cards Unlocked: {scratchedIds.length} of {SECRET_CARDS.length}</span>
          {scratchedIds.length > 0 && (
            <button
              onClick={handleResetScratchCards}
              className="ml-2 text-[10px] text-white/40 hover:text-white underline cursor-pointer"
            >
              Reset foil
            </button>
          )}
        </div>
      </div>

      {/* 4 Interactive Scratch Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {SECRET_CARDS.map(card => {
          const isRevealed = scratchedIds.includes(card.id);
          const isScratching = scratchingId === card.id;

          return (
            <div
              key={card.id}
              onClick={() => handleScratch(card)}
              className={`relative min-h-[190px] rounded-3xl p-5 border backdrop-blur-xl transition-all duration-500 select-none overflow-hidden cursor-pointer ${
                isRevealed
                  ? `bg-linear-to-br ${card.color} shadow-lg shadow-pink-500/20 scale-100`
                  : 'bg-slate-900/90 border-amber-400/30 hover:border-pink-400 hover:scale-[1.02] shadow-xl'
              } ${isScratching ? 'animate-wiggle' : ''}`}
            >
              {/* Foil Shimmer effect when hidden */}
              {!isRevealed && (
                <div className="absolute inset-0 bg-linear-to-tr from-amber-400/20 via-pink-400/15 to-transparent pointer-events-none" />
              )}

              {/* Holographic Scratch Foil Layer */}
              {!isRevealed ? (
                <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                      {card.badge}
                    </span>
                    <span className="p-1.5 rounded-full bg-white/10 text-amber-300 animate-bounce">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="space-y-1.5 my-3">
                    <h4 className="font-['Playfair_Display'] text-base font-bold text-white group-hover:text-pink-200">
                      {card.title}
                    </h4>
                    <p className="text-xs text-white/60 italic font-['Outfit']">
                      "{card.teaser}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Tap to scratch & reveal
                    </span>
                    <span className="text-[10px] text-white/40">From Sherry</span>
                  </div>
                </div>
              ) : (
                /* Revealed Golden Note */
                <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {card.category}
                    </span>
                    <Heart className="w-4 h-4 fill-pink-400 text-pink-400 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-['Playfair_Display'] text-sm font-bold text-white/90">
                      {card.title}
                    </h4>
                    <p className="font-['Dancing_Script'] text-lg sm:text-xl text-white leading-relaxed font-semibold">
                      "{card.secretMessage}"
                    </p>
                  </div>

                  <div className="text-[10px] text-pink-200/60 font-mono text-right">
                    Forever & always yours • Shaheer ♡
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bonus Romantic Activities: Heartbeat Pulse & Official Certificate */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Heartbeat Pulse Sync */}
        <button
          onClick={toggleHeartbeat}
          className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            isHeartbeatPlaying
              ? 'bg-rose-500/25 border-rose-400 text-white shadow-lg shadow-rose-500/30'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
              <Heart className={`w-4 h-4 fill-rose-400 text-rose-400 ${isHeartbeatPlaying ? 'animate-ping' : 'animate-pulse'}`} />
              <span>Shaheer's Heartbeat Pulse</span>
            </div>
            <p className="text-[11px] text-white/60">
              {isHeartbeatPlaying ? 'Synchronized and beating solely for you...' : 'Tap to feel my rhythmic heartbeat for you'}
            </p>
          </div>
          <span className="text-xs font-mono text-rose-300 px-2 py-1 rounded-lg bg-rose-500/20 border border-rose-400/30">
            {isHeartbeatPlaying ? 'ACTIVE 💓' : 'LISTEN'}
          </span>
        </button>

        {/* Official Certificate of Love Modal Button */}
        <button
          onClick={() => {
            setShowCertificate(true);
            birthdayAudio.playSparkleChime();
            triggerRealisticConfetti();
          }}
          className="p-4 rounded-2xl bg-linear-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 border border-amber-300/40 text-left flex items-center justify-between transition-all cursor-pointer shadow-md"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Certificate of Eternal Love</span>
            </div>
            <p className="text-[11px] text-white/60">
              Official royal certificate issued by Shaheer to Alihaaa
            </p>
          </div>
          <span className="text-xs font-mono text-amber-200 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30">
            VIEW 📜
          </span>
        </button>
      </div>

      {/* Official Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-linear-to-b from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-300/60 shadow-2xl text-center space-y-5 text-white animate-scale-up overflow-hidden">
            {/* Ambient Gold Halo */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center border-b border-amber-300/20 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                Official Royal Decree • Sherry & Alihaaa
              </span>
              <button
                onClick={() => setShowCertificate(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Crest Emblem */}
            <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-tr from-amber-400 via-rose-400 to-pink-500 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <Heart className="w-8 h-8 fill-pink-400 text-pink-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
                Certificate of Infinite Love & Devotion
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-black text-amber-200">
                Issued to: {girlName}
              </h3>
              <p className="text-xs text-white/70">
                Under the cosmic alignment of her most wonderful birthday
              </p>
            </div>

            {/* Decree Body */}
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-300/30 text-xs sm:text-sm text-white/90 leading-relaxed font-serif italic text-center space-y-2">
              <p>
                "This document certifies that {girlName} is held in the highest regard, cherished beyond words, and loved infinitely with every heartbeat of Shaheer (Sherry)."
              </p>
              <p className="text-amber-200 font-sans text-xs not-italic font-semibold">
                Entitled to: Unlimited Smiles • Lifelong Loyalty • Endless Hugs • Eternal Happiness
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-2 flex items-center justify-between border-t border-amber-300/20 text-xs">
              <div className="text-left">
                <span className="text-[10px] text-white/50 block font-mono">Certified By</span>
                <span className="font-['Dancing_Script'] text-xl text-amber-300 font-bold block">
                  Shaheer (Sherry) ♡
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 block font-mono">Status</span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">
                  Permanent & Sealed ✨
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `📜 Certificate of Infinite Love issued to ${girlName} by Shaheer (Sherry) ♡ • Valid for all of eternity!`
                  );
                  setCopiedCertificate(true);
                  setTimeout(() => setCopiedCertificate(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{copiedCertificate ? 'Certificate Copied!' : 'Copy Royal Decree'}</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
