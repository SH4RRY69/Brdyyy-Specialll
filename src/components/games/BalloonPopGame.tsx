import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, RefreshCw, Trophy, Volume2, Award, Zap } from 'lucide-react';
import { birthdayAudio } from '../../utils/audioSynthesizer';
import { triggerRealisticConfetti, triggerHeartShower, triggerFireworks } from '../../utils/confettiFireworks';
import { activityTracker } from '../../utils/activityTracker';

interface BalloonItem {
  id: number;
  x: number; // percentage 5 to 90
  y: number; // percentage bottom 0 to 100
  speed: number;
  color: string;
  size: number;
  message: string;
  popped: boolean;
}

const BALLOON_COLORS = [
  'from-pink-500 to-rose-600',
  'from-amber-400 to-orange-500',
  'from-purple-500 to-indigo-600',
  'from-rose-400 to-red-500',
  'from-emerald-400 to-teal-500',
  'from-cyan-400 to-blue-500'
];

const SECRET_MESSAGES = [
  "You make Sherry's world 1,000,000 times brighter! 💖",
  "Alihaaa's laugh is Sherry's absolute favorite sound in existence. 🎵",
  "Free lifetime voucher: Sherry will bring you dessert whenever you ask! 🍦",
  "You look breathtaking in every single mood, especially when smiling! 🌸",
  "A star fell from heaven the day you were born. ✨",
  "Sherry will forever protect your cute smile from any sorrow. 🛡️",
  "No one in the multiverse has eyes as captivating as yours. 🌌",
  "Unlimited warm hugs on demand, valid for 100 years! 🫂",
  "May all your quietest prayers come true this year! 🤲",
  "You are Sherry's whole universe wrapped in one person. 🪐"
];

interface BalloonPopGameProps {
  girlName: string;
}

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ girlName }) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const nextIdRef = useRef(1);

  // Spawn balloons periodically
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length >= 10) return prev;
        const newBalloon: BalloonItem = {
          id: nextIdRef.current++,
          x: Math.floor(Math.random() * 80) + 10,
          y: -10, // starts below
          speed: Math.random() * 0.4 + 0.35,
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
          size: Math.floor(Math.random() * 20) + 52,
          message: SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)],
          popped: false
        };
        return [...prev, newBalloon];
      });
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  // Float loop
  useEffect(() => {
    if (!isPlaying) return;

    const animFrame = setInterval(() => {
      setBalloons(prev => 
        prev
          .map(b => ({
            ...b,
            y: b.y + b.speed
          }))
          .filter(b => b.y < 115) // remove when floated out
      );
    }, 50);

    return () => clearInterval(animFrame);
  }, [isPlaying]);

  const handlePop = (balloon: BalloonItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (balloon.popped) return;

    birthdayAudio.playBalloonPop();
    setPoppedCount(prev => prev + 1);
    setLatestMessage(balloon.message);

    // Mark as popped and remove
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));

    if ((poppedCount + 1) % 5 === 0) {
      triggerRealisticConfetti();
      triggerHeartShower();
    }

    activityTracker.logEvent('game', 'Popped Birthday Balloon 🎈', `Unlocked: "${balloon.message}"`, 'pink');
  };

  const handlePopAll = () => {
    setPoppedCount(prev => prev + balloons.length);
    setBalloons([]);
    triggerFireworks();
    triggerHeartShower();
    birthdayAudio.playBalloonPop();
    setTimeout(() => birthdayAudio.playBalloonPop(), 70);
    setTimeout(() => birthdayAudio.playBalloonPop(), 140);
    setLatestMessage("🎆 GRAND CARNIVAL CELEBRATION! Sherry loves you to the stars and beyond! 💖");
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/80 via-purple-950/30 to-slate-950/80 border border-pink-400/30 shadow-2xl backdrop-blur-xl text-center space-y-5 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-bold uppercase tracking-wider">
          Interactive Carnival Game
        </span>
        <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
          Pop The Birthday Balloons 🎈
        </h3>
        <p className="text-xs text-white/70 max-w-md mx-auto">
          Tap or click the floating balloons to pop them and reveal hidden secret love notes from Sherry!
        </p>
      </div>

      {/* Score and Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span className="text-white/80">Balloons Popped:</span>
          <span className="font-mono text-amber-300 font-bold text-sm">{poppedCount}</span>
        </div>

        <button
          onClick={handlePopAll}
          className="px-3 py-1.5 rounded-xl bg-pink-500/30 hover:bg-pink-500/50 border border-pink-400/40 text-pink-200 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pop All Balloons 💥</span>
        </button>
      </div>

      {/* Game Stage Area */}
      <div className="relative w-full h-[360px] rounded-3xl bg-gradient-to-b from-slate-950/80 via-[#1a0c24] to-slate-950 border border-pink-500/30 overflow-hidden shadow-inner cursor-crosshair select-none">
        {/* Sky stars background decoration */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{
                top: `${(i * 19) % 95}%`,
                left: `${(i * 27) % 95}%`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        {/* Floating Balloons */}
        {balloons.map(balloon => (
          <div
            key={balloon.id}
            onClick={(e) => handlePop(balloon, e)}
            className="absolute -translate-x-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-90"
            style={{
              left: `${balloon.x}%`,
              bottom: `${balloon.y}%`,
              width: `${balloon.size}px`,
              height: `${balloon.size * 1.25}px`,
            }}
          >
            {/* Balloon Body with 3D gradient and highlight */}
            <div className={`relative w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-br ${balloon.color} shadow-lg shadow-pink-500/40 border border-white/20 flex items-center justify-center animate-wiggle`}>
              {/* Highlight shine */}
              <div className="absolute top-2 left-2 w-3 h-6 bg-white/40 rounded-full blur-[0.5px] -rotate-12 pointer-events-none" />
              <Heart className="w-4 h-4 text-white/80 fill-white/80" />
            </div>

            {/* Balloon knot and thread */}
            <div className="w-1.5 h-1.5 bg-pink-700 mx-auto rounded-full mt-[-2px]" />
            <div className="w-0.5 h-7 bg-white/30 mx-auto" />
          </div>
        ))}

        {balloons.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs">
            Balloons floating up... Tap them! 🎈
          </div>
        )}
      </div>

      {/* Secret Message Revealed Card */}
      {latestMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-400/40 text-left space-y-1.5 animate-scale-up">
          <div className="flex items-center justify-between text-xs text-pink-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Secret Love Note Unlocked:</span>
            </span>
            <span className="text-[10px] text-white/60 font-mono">from Sherry 💌</span>
          </div>
          <p className="font-['Dancing_Script'] text-xl sm:text-2xl text-white font-bold tracking-wide">
            "{latestMessage}"
          </p>
        </div>
      )}
    </div>
  );
};
