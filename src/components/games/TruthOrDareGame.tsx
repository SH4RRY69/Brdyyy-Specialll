import React, { useState } from 'react';
import { Sparkles, Crown, Heart, Flame, Copy, Check, RefreshCw, UserCheck, ShieldAlert } from 'lucide-react';
import { birthdayAudio } from '../../utils/audioSynthesizer';
import { triggerRealisticConfetti, triggerHeartShower } from '../../utils/confettiFireworks';
import { activityTracker } from '../../utils/activityTracker';

interface TruthOrDareGameProps {
  girlName: string;
}

type Participant = 'alihaaa' | 'sherry';
type GameMode = 'truth' | 'dare';

interface CardItem {
  title: string;
  prompt: string;
  detail: string;
  badge: string;
}

const SHERRY_TRUTHS: CardItem[] = [
  {
    title: "The Very First Glimpse",
    prompt: "What was Sherry's exact first thought when he first talked to Alihaaa?",
    detail: "“My heart skipped three beats and my mind went completely blank. I thought: How can someone's voice and aura be so effortlessly mesmerizing?”",
    badge: "Sherry's Confession"
  },
  {
    title: "Midnight Overthinking",
    prompt: "What is the sweetest thing Sherry has ever thought about Alihaaa at 2:00 AM?",
    detail: "“Wondering what she's dreaming about and secretly praying that all her worries vanish and she wakes up with that radiant, heart-melting smile.”",
    badge: "2:00 AM Thoughts"
  },
  {
    title: "Cutest Habit Award",
    prompt: "What is Alihaaa's habit that Sherry finds 10,000x cuter than anything else?",
    detail: "“When she gets stubborn or pretends to scold me, but her cute expressions completely give her away. It is impossible to resist her!”",
    badge: "Irresistible Habit"
  },
  {
    title: "The Ultimate Priority",
    prompt: "If Sherry had to choose between sleeping 12 hours or talking to Alihaaa, what happens?",
    detail: "“I would sacrifice my sleep 100 times out of 100 just to listen to her talk about her day.”",
    badge: "No Hesitation"
  },
  {
    title: "The One Wish",
    prompt: "If Sherry could grant Alihaaa one lifetime superpower right now, what would it be?",
    detail: "“The superpower to never feel sadness or anxiety ever again, and to see herself through my eyes so she knows how genuinely priceless she is.”",
    badge: "Soul Prayer"
  }
];

const SHERRY_DARES: CardItem[] = [
  {
    title: "The Royal Serenade Dare",
    prompt: "Sherry MUST record a 30-second voice note singing Alihaaa's favorite song right now, no excuses allowed!",
    detail: "Penalty if skipped: Must order Alihaaa her favorite dessert tomorrow!",
    badge: "Musical Challenge"
  },
  {
    title: "The 10 Compliments Speedrun",
    prompt: "Sherry must type 10 unique, non-generic compliments for Alihaaa in under 60 seconds on WhatsApp!",
    detail: "Penalty if skipped: Must agree to watch any romantic drama she chooses without complaining.",
    badge: "Rapid Fire"
  },
  {
    title: "Royal Queen Decree",
    prompt: "Sherry must end his next 5 messages to Alihaaa with 'Hukm karein meri Malika 👑'!",
    detail: "Penalty if skipped: Must send 20 cat memes to make her laugh.",
    badge: "Court Etiquette"
  },
  {
    title: "The Handwritten Love Note",
    prompt: "Sherry must write a cute romantic note on real paper with pen and send a picture of it to Alihaaa today!",
    detail: "Penalty if skipped: 100 pushups while shouting 'Alihaaa is the Queen of the World'!",
    badge: "Vintage Touch"
  },
  {
    title: "The 3 Promises Pledge",
    prompt: "Sherry must voice-note 3 brand new, unconditional promises to Alihaaa for the upcoming year!",
    detail: "Penalty if skipped: Must be Alihaaa's personal digital assistant for 48 hours.",
    badge: "Royal Oath"
  }
];

const ALIHAAA_DARES: CardItem[] = [
  {
    title: "The Radiant Smile Selfie 📸",
    prompt: "Alihaaa MUST take an instant, candid picture smiling right now and send it to Sherry on WhatsApp with no filters!",
    detail: "Enforcement Rule: No delays! Sherry's heart is eagerly waiting to see the birthday queen's radiant smile.",
    badge: "Birthday Queen Dare"
  },
  {
    title: "The Sweet Melody Voice Note 🎙️",
    prompt: "Alihaaa must record a 15-second voice note singing or humming any tune that makes her think of Sherry!",
    detail: "Enforcement Rule: If too shy, send a 10-second audio whispering: 'Sherry, you are the best!'",
    badge: "Audio Challenge"
  },
  {
    title: "The Royal Nickname Decree 👑",
    prompt: "Alihaaa must address Sherry with a cute romantic nickname of his choice for the next 24 hours in all chats!",
    detail: "Enforcement Rule: If she slips up and uses his normal name, she owes him 5 virtual hugs!",
    badge: "Playful Decree"
  },
  {
    title: "The Secret Admiration Confession 💌",
    prompt: "Alihaaa must message Sherry one little habit or thing about him that secretly made her heart skip a beat!",
    detail: "Enforcement Rule: Must be 100% genuine and sent within the next 3 minutes!",
    badge: "Heart To Heart"
  },
  {
    title: "The 3 Future Wishes ✈️",
    prompt: "Alihaaa must list 3 dream destinations or food spots she wants to visit together with Sherry without thinking twice!",
    detail: "Enforcement Rule: Sherry will screenshot this and turn them into future date milestones!",
    badge: "Future Adventure"
  },
  {
    title: "The Queen's Special Forgiveness Card 🕊️",
    prompt: "Alihaaa grants Sherry an official 'Royal Immunity Pass' forgiving any silly future joke or mistake for 7 days!",
    detail: "Enforcement Rule: Sealed with a screenshot sent to Sherry on WhatsApp!",
    badge: "Royal Immunity"
  },
  {
    title: "The Midnight Craving Decree 🍫",
    prompt: "Alihaaa must tell Sherry her exact current food or dessert craving right now, and Sherry must arrange it!",
    detail: "Enforcement Rule: Be totally honest — chocolate, ice cream, biryani, or coffee!",
    badge: "Queen's Feast"
  },
  {
    title: "The Urdu Sher Dare 📜🌹",
    prompt: "Alihaaa must dedicate or recite two lines of romantic Urdu shayari (or cute poetry) to Sherry via voice note!",
    detail: "Penalty if skipped: Must listen to Sherry recite 5 shayaris while she stays totally silent!",
    badge: "Poetic Challenge"
  },
  {
    title: "The Cute Roasting Audio 🎙️😜",
    prompt: "Alihaaa must record an 8-second audio lovingly teasing Sherry about his funniest habit!",
    detail: "Enforcement Rule: Must be playful, sweet, and end with: 'Lekin phir b tum mere sab se azeez dost ho!'",
    badge: "Sweet Roasting"
  },
  {
    title: "The Hand-Heart Photo 🫶✨",
    prompt: "Alihaaa must take a photo making half a heart with her hand and send it to Sherry so he can complete the other half!",
    detail: "Enforcement Rule: Send within 5 minutes so Sherry can edit the halves together!",
    badge: "Matching Hearts"
  },
  {
    title: "The 3 Compliments Under Pressure ⏱️",
    prompt: "Alihaaa has 30 seconds to type 3 genuine compliments for Sherry on WhatsApp without using emojis!",
    detail: "Enforcement Rule: If timer runs out, she must send a picture of her favorite outfit from today!",
    badge: "Rapid Fire"
  },
  {
    title: "The Eternal Friendship Treaty 👑🤝",
    prompt: "Alihaaa must officially pledge that no matter how busy life gets, she will never let distance or silence break their bond!",
    detail: "Enforcement Rule: Reply with 'Sherry, I swear upon the stars! 🌟' in all caps!",
    badge: "Sacred Treaty"
  }
];

const ALIHAAA_TRUTHS: CardItem[] = [
  {
    title: "The First Heart Flutter 💓",
    prompt: "When was the exact moment Alihaaa realized that Sherry is truly unlike anyone else in her life?",
    detail: "Sherry eagerly wants to know the exact memory or conversation that made her feel this bond.",
    badge: "Unfiltered Truth"
  },
  {
    title: "The Secret Smile Catalyst ✨",
    prompt: "What is one little silly or sweet thing Sherry does that instantly brightens your mood even on a bad day?",
    detail: "Be completely honest — whether it's his late-night texts, voice notes, or dramatic jokes!",
    badge: "Mood Lifter"
  },
  {
    title: "Late Night Chat Revisits 🌙",
    prompt: "Has Alihaaa ever quietly scrolled back to reread old conversations with Sherry late at night and smiled alone?",
    detail: "Confess the truth! Which chat or audio note do you secretly listen to again?",
    badge: "Midnight Nostalgia"
  },
  {
    title: "The Safe Haven Feeling 🛡️",
    prompt: "What is Sherry's single personality trait that makes you feel safest, most respected, and most cherished?",
    detail: "Share your candid thoughts with him — he values your feelings above everything.",
    badge: "Emotional Sanctuary"
  }
];

export const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ girlName }) => {
  const [participant, setParticipant] = useState<Participant>('alihaaa');
  const [gameMode, setGameMode] = useState<GameMode>('dare');
  const [currentCard, setCurrentCard] = useState<CardItem>(ALIHAAA_DARES[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [copied, setCopied] = useState(false);

  const getList = (target: Participant, mode: GameMode) => {
    if (target === 'alihaaa') {
      return mode === 'dare' ? ALIHAAA_DARES : ALIHAAA_TRUTHS;
    }
    return mode === 'dare' ? SHERRY_DARES : SHERRY_TRUTHS;
  };

  const handleDraw = (target: Participant, mode: GameMode) => {
    setParticipant(target);
    setGameMode(mode);
    setIsDrawing(true);
    birthdayAudio.playPageFlip();

    setTimeout(() => {
      const list = getList(target, mode);
      const nextCard = list[Math.floor(Math.random() * list.length)];
      setCurrentCard(nextCard);
      setIsDrawing(false);
      birthdayAudio.playSparkleChime();
      triggerRealisticConfetti();
      activityTracker.logEvent(
        'game',
        `Drew ${mode.toUpperCase()} for ${target === 'alihaaa' ? girlName : 'Sherry'} 👑`,
        nextCard.title,
        target === 'alihaaa' ? 'pink' : 'amber'
      );
    }, 350);
  };

  const handleCopyChallenge = () => {
    const isAlihaaa = participant === 'alihaaa';
    const text = isAlihaaa
      ? gameMode === 'dare'
        ? `👑 Royal Birthday Dare for ${girlName}!\n🎯 Challenge: “${currentCard.title}”\nTask: ${currentCard.prompt}\n${currentCard.detail}\nSherry says: You cannot escape this one, Queen! 😜💖`
        : `🌸 Royal Truth for ${girlName}!\nQuestion: “${currentCard.title}”\nPrompt: ${currentCard.prompt}\nSherry wants your honest answer! 🌹`
      : gameMode === 'dare'
        ? `🔥 Royal Dare for Sherry!\n🎯 Challenge: “${currentCard.title}”\nTask: ${currentCard.prompt}\n${currentCard.detail}\n${girlName} demands obedience! 👑`
        : `🤫 Royal Truth for Sherry!\nQuestion: “${currentCard.title}”\nSherry's Confession: ${currentCard.detail}\nDedicated to ${girlName} ♡`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    birthdayAudio.playSparkleChime();
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 via-amber-950/30 to-slate-950/90 border border-amber-400/30 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fade-in">
      {/* Title */}
      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
          Royal Interactive Court
        </span>
        <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
          Royal Truth & Dare for Two 👑✨
        </h3>
        <p className="text-xs text-white/70 max-w-md mx-auto">
          Choose who gets challenged: Playful birthday dares for {girlName} or romantic confessions and tasks for Sherry!
        </p>
      </div>

      {/* 1. Who is playing selector */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => handleDraw('alihaaa', gameMode)}
          className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            participant === 'alihaaa'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-lg shadow-pink-500/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-pink-200" />
          <span>For {girlName} 👸</span>
        </button>

        <button
          onClick={() => handleDraw('sherry', gameMode)}
          className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            participant === 'sherry'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-lg shadow-amber-500/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>For Sherry 🤴</span>
        </button>
      </div>

      {/* 2. Mode Selector Buttons (Truth vs Dare) */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <button
          onClick={() => handleDraw(participant, 'dare')}
          className={`p-3.5 sm:p-4 rounded-2xl border font-serif font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
            gameMode === 'dare'
              ? participant === 'alihaaa'
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white border-pink-300 shadow-lg shadow-pink-600/30 scale-105'
                : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 border-yellow-300 shadow-lg shadow-amber-600/30 scale-105 font-black'
              : 'bg-white/10 hover:bg-white/15 text-white/80 border-white/15'
          }`}
        >
          <span className="text-xl sm:text-2xl">🔥</span>
          <span>Draw Royal Dare</span>
          <span className="text-[10px] text-pink-200 font-sans font-normal">
            {participant === 'alihaaa' ? `Fun challenges for ${girlName}` : 'Challenges for Sherry'}
          </span>
        </button>

        <button
          onClick={() => handleDraw(participant, 'truth')}
          className={`p-3.5 sm:p-4 rounded-2xl border font-serif font-bold text-xs sm:text-sm transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
            gameMode === 'truth'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-300 shadow-lg shadow-purple-600/30 scale-105'
              : 'bg-white/10 hover:bg-white/15 text-white/80 border-white/15'
          }`}
        >
          <span className="text-xl sm:text-2xl">🤫</span>
          <span>Draw Royal Truth</span>
          <span className="text-[10px] text-purple-200 font-sans font-normal">
            {participant === 'alihaaa' ? `${girlName}'s Truths` : `Sherry's Confessions`}
          </span>
        </button>
      </div>

      {/* 3. The Royal Parchment Card */}
      <div 
        className={`relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1c0f0a] via-[#150a06] to-[#0d0503] border-2 ${
          participant === 'alihaaa' ? 'border-pink-500/50 shadow-pink-500/10' : 'border-amber-500/50 shadow-amber-500/10'
        } shadow-2xl text-left space-y-4 transition-all duration-300 ${
          isDrawing ? 'opacity-40 scale-95 rotate-1' : 'opacity-100 scale-100 rotate-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-amber-600/30 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Crown className={`w-4 h-4 ${participant === 'alihaaa' ? 'text-pink-400' : 'text-amber-400'}`} />
            <span className={`font-serif text-xs font-bold uppercase tracking-wider ${participant === 'alihaaa' ? 'text-pink-300' : 'text-amber-300'}`}>
              {gameMode === 'dare' ? `Royal Dare • ${participant === 'alihaaa' ? girlName : 'Sherry'}` : `Royal Truth • ${participant === 'alihaaa' ? girlName : 'Sherry'}`}
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-serif">
            {currentCard.badge}
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-white leading-relaxed">
            "{currentCard.prompt}"
          </h4>
          
          <div className={`p-4 rounded-2xl ${participant === 'alihaaa' ? 'bg-pink-950/30 border-pink-500/30' : 'bg-amber-950/40 border-amber-500/30'} border space-y-1.5`}>
            <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              {gameMode === 'dare' ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>The Royal Rule:</span>
                </>
              ) : (
                <>
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  <span>Heart Essence:</span>
                </>
              )}
            </span>
            <p className="font-serif italic text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              {currentCard.detail}
            </p>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-amber-600/30">
          <button
            onClick={() => handleDraw(participant, gameMode)}
            className="text-xs text-amber-300 hover:text-amber-100 flex items-center gap-1.5 cursor-pointer py-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Draw Another Card</span>
          </button>

          <button
            onClick={handleCopyChallenge}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              participant === 'alihaaa'
                ? 'bg-pink-500/20 hover:bg-pink-500/30 border-pink-400/40 text-pink-200'
                : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : `Copy to WhatsApp 📲`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
