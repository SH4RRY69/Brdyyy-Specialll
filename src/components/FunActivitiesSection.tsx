import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Sparkles, Trophy, Heart, RotateCcw, Award, CheckCircle2, 
  HelpCircle, ChevronRight, ChevronLeft, Gift, Flame, Play, Pause, 
  Smile, Frown, Coffee, Moon, Zap, ArrowRight, Share2, Copy, Check
} from 'lucide-react';
import { triggerRealisticConfetti, triggerHeartShower, triggerFireworks } from '../utils/confettiFireworks';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { activityTracker } from '../utils/activityTracker';
import { LoveMeterGame } from './games/LoveMeterGame';
import { BalloonPopGame } from './games/BalloonPopGame';
import { TruthOrDareGame } from './games/TruthOrDareGame';

interface FunActivitiesSectionProps {
  girlName: string;
  themeColor?: string;
  cardBg?: string;
  cardBorder?: string;
}

type ActivityTab = 'quiz' | 'arcade' | 'wheel' | 'memory' | 'mood' | 'lovemeter' | 'balloons' | 'truthordare';

// ==========================================
// 1. QUIZ DATA
// ==========================================
interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; reaction: string; isBest: boolean }[];
  humorNote: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Who is officially more likely to stay awake at 3:00 AM craving midnight snacks or overthinking?",
    options: [
      { text: "Alihaaa, looking for chocolates or noodles 🍫", reaction: "Accurate! Midnight cravings are real!", isBest: true },
      { text: "Sherry, staring at code and missing her 💻", reaction: "True, Sherry is an owl too!", isBest: false },
      { text: "Both arguing over whose turn it is to order food 🍕", reaction: "The classic midnight dilemma!", isBest: false },
      { text: "Neither, sleeping peacefully like babies 😴", reaction: "Hahaha as if! That never happens.", isBest: false }
    ],
    humorNote: "Midnight snacking is a sacred constitutional right for the birthday girl."
  },
  {
    id: 2,
    question: "When Alihaaa says 'Give me 5 minutes, I'm almost ready!', what is the real standard time?",
    options: [
      { text: "Exactly 5 minutes (in an alternate reality) ⏳", reaction: "Scientifically unproven!", isBest: false },
      { text: "45 minutes to 1 hour minimum 💅", reaction: "Spot on! Perfection takes time and royal patience.", isBest: true },
      { text: "By the time the next season of our show arrives 🍿", reaction: "Hahaha Sherry waits happily anyway!", isBest: false },
      { text: "She is already ready, Sherry was late! 😜", reaction: "A bold defense, we accept it!", isBest: false }
    ],
    humorNote: "True beauty and flawless styling cannot be rushed by human clocks."
  },
  {
    id: 3,
    question: "What is Alihaaa's secret superpower whenever she gets a little angry or 'ziddi'?",
    options: [
      { text: "Typing with speed of light and zero emojis ⚡", reaction: "The legendary danger zone!", isBest: false },
      { text: "Saying 'I am totally fine' (Warning: NOT fine) 😤", reaction: "Code Red alert! Bring chocolates immediately.", isBest: false },
      { text: "Becoming 1000x cuter even while scolding Sherry 👑", reaction: "10000% True! Impossible to take her seriously when she's that cute.", isBest: true },
      { text: "The dramatic silent treatment 🤐", reaction: "Sherry panics instantly!", isBest: false }
    ],
    humorNote: "Her tantrums are officially recognized as high art."
  },
  {
    id: 4,
    question: "What is Sherry's absolute most precious treasure in the entire galaxy?",
    options: [
      { text: "His computer and gaming setup 🖥️", reaction: "Nope, those are just toys!", isBest: false },
      { text: "Sleeping for 14 hours straight 🛌", reaction: "Tempting, but not even close!", isBest: false },
      { text: "Alihaaa's genuine laugh and eye crinkles 💖", reaction: "BINGO! Nothing in the cosmos compares to her smile.", isBest: true },
      { text: "Unlimited biryani & chai ☕", reaction: "Close second, but she wins effortlessly!", isBest: false }
    ],
    humorNote: "Verified and certified under Sherry's signature."
  },
  {
    id: 5,
    question: "If a cute drama or silly misunderstanding happens, who surrenders first?",
    options: [
      { text: "Sherry within 0.005 seconds apologizing 🥺", reaction: "Without hesitation! Peace is the priority.", isBest: true },
      { text: "Alihaaa with a cute eye-roll and smirk 😏", reaction: "She forgives like a benevolent queen.", isBest: false },
      { text: "Both end up laughing halfway through 😂", reaction: "The best kind of silly argument!", isBest: false },
      { text: "Whoever brings ice cream wins the dispute 🍦", reaction: "Bribery is always effective!", isBest: false }
    ],
    humorNote: "Rule #1: Alihaaa is always right. Rule #2: If wrong, refer to Rule #1."
  },
  {
    id: 6,
    question: "What is the scientifically proven remedy for Alihaaa's bad moods?",
    options: [
      { text: "Unconditional compliments & attention 🌸", reaction: "Essential daily vitamin!", isBest: false },
      { text: "Her favorite desserts & iced drinks 🧋", reaction: "Sugar elevates the soul!", isBest: false },
      { text: "Sherry agreeing with everything she says 🫡", reaction: "Maximum obedience mode activated!", isBest: false },
      { text: "All of the above combined with a big warm hug 💫", reaction: "JACKPOT! The ultimate four-step treatment.", isBest: true }
    ],
    humorNote: "Prescription valid for the entire birthday week."
  },
  {
    id: 7,
    question: "If Sherry and Alihaaa are picking a movie or dinner spot, how long does it take?",
    options: [
      { text: "1 hour of scrolling trailers until they get tired 🎬", reaction: "Classic couple paralysis!", isBest: false },
      { text: "Aliha says 'Anything', but rejects 9 out of 10 options 🍔", reaction: "THE UNIVERSAL TRUTH! 'Not this, not that...'", isBest: true },
      { text: "Sherry already knows her favorite and orders it 🎯", reaction: "Smooth move when it works!", isBest: false },
      { text: "They just rewatch their favorite show for the 5th time 📺", reaction: "Comfort zone bliss!", isBest: false }
    ],
    humorNote: "'Anything' translates to 'Guess what I am thinking or face the consequences'."
  },
  {
    id: 8,
    question: "What is the official score of love and happiness between Alihaaa and Sherry?",
    options: [
      { text: "Alihaaa: 999 — Sherry: 0 (Flawless Victory) 🏆", reaction: "A very fair and balanced scoreboard!", isBest: false },
      { text: "Soulmates tied forever in infinite love ♾️💖", reaction: "PERFECT ANSWER! Beyond numbers, into eternity.", isBest: true },
      { text: "Sherry being the luckiest guy alive 🌟", reaction: "Undeniable fact of the century.", isBest: false },
      { text: "A never-ending adventure of laughter and smiles 🚀", reaction: "Always and forever!", isBest: false }
    ],
    humorNote: "Final result: Infinite love registered in the stars."
  }
];

// ==========================================
// 2. WHEEL OF TREATS & DARES DATA
// ==========================================
interface WheelItem {
  id: number;
  label: string;
  emoji: string;
  color: string;
  textColor: string;
  voucherTitle: string;
  voucherText: string;
}

const WHEEL_ITEMS: WheelItem[] = [
  {
    id: 1,
    label: "Ice Cream & Dessert",
    emoji: "🍦",
    color: "#ec4899",
    textColor: "#ffffff",
    voucherTitle: "Royal Dessert Voucher",
    voucherText: "Sherry is legally obligated to buy you your absolute favorite ice cream or sweet dessert whenever requested!"
  },
  {
    id: 2,
    label: "Head Massage (20 Min)",
    emoji: "💆‍♀️",
    color: "#8b5cf6",
    textColor: "#ffffff",
    voucherTitle: "Spa & Relaxation Pass",
    voucherText: "Redeem 1 free 20-minute relaxing head or shoulder massage with zero complaints from Sherry."
  },
  {
    id: 3,
    label: "Cute Voice Note Right Now",
    emoji: "🎙️",
    color: "#f59e0b",
    textColor: "#ffffff",
    voucherTitle: "Instant Sweet Voice Audio",
    voucherText: "Sherry must record and send a heartfelt, sweet voice note praising your greatness immediately!"
  },
  {
    id: 4,
    label: "Aliha Always Right for 24h",
    emoji: "👑",
    color: "#10b981",
    textColor: "#ffffff",
    voucherTitle: "Supreme Ruler Certificate",
    voucherText: "For the next 24 hours, Alihaaa is formally declared 100% correct in every argument and opinion."
  },
  {
    id: 5,
    label: "Pick 3 Movies Unopposed",
    emoji: "🎬",
    color: "#3b82f6",
    textColor: "#ffffff",
    voucherTitle: "Movie Dictator Pass",
    voucherText: "You get full remote control privileges for the next 3 movie nights. No vetoes allowed!"
  },
  {
    id: 6,
    label: "Midnight Burger / Pizza",
    emoji: "🍔",
    color: "#ef4444",
    textColor: "#ffffff",
    voucherTitle: "Midnight Feast Voucher",
    voucherText: "Sherry sponsors a late-night feast of burgers, fries, or pizza whenever the cravings strike."
  },
  {
    id: 7,
    label: "Handwritten Poem / Letter",
    emoji: "💌",
    color: "#d946ef",
    textColor: "#ffffff",
    voucherTitle: "Romantic Calligraphy Note",
    voucherText: "Sherry must handwrite an original 10-line heartfelt poetic letter dedicated to your eyes."
  },
  {
    id: 8,
    label: "Free Wish of Your Choice",
    emoji: "⭐",
    color: "#f97316",
    textColor: "#ffffff",
    voucherTitle: "The Golden Wildcard Wish",
    voucherText: "Claim ANY sweet request or favor from Sherry without limitations. The ultimate birthday privilege!"
  }
];

// ==========================================
// 3. MEMORY MATCH GAME DATA
// ==========================================
interface MemoryCard {
  id: number;
  pairId: number;
  icon: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_ICONS = [
  { icon: '🎂', name: 'Birthday Cake' },
  { icon: '👑', name: 'Queen Crown' },
  { icon: '💖', name: 'Sparkling Heart' },
  { icon: '🧁', name: 'Sweet Cupcake' },
  { icon: '🌹', name: 'Red Rose' },
  { icon: '🐱', name: 'Cute Kitten' }
];

// ==========================================
// 4. MOOD BOOSTER PRESCRIPTIONS
// ==========================================
interface MoodOption {
  id: string;
  mood: string;
  emoji: string;
  color: string;
  prescriptionTitle: string;
  quote: string;
  sherryAction: string;
  funTask: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'low',
    mood: 'Feeling Low / Emotional',
    emoji: '🥺',
    color: 'from-blue-600/30 to-indigo-700/30 border-blue-400/40',
    prescriptionTitle: 'Sherry\'s Soft Blanket & Warm Hug Protocol 🫂',
    quote: '"Whenever your world feels heavy, remember you don\'t have to carry it alone. You are deeply loved, and tomorrow is full of sunshine."',
    sherryAction: 'Sherry is sending an invisible tight hug that never lets go. Drink a warm cup of water and rest your sweet eyes.',
    funTask: 'Listen to Voice Note #3 in the Voice Studio or play the music box!'
  },
  {
    id: 'angry',
    mood: 'Angry / Ziddi / Nakhray',
    emoji: '😡',
    color: 'from-red-600/30 to-rose-700/30 border-red-400/40',
    prescriptionTitle: 'Emergency Surrender & Chocolate Dispenser 🍫',
    quote: '"Your anger is cute, but your smile is lethal. Sherry formally surrenders to whatever you are upset about!"',
    sherryAction: 'Sherry raises the white flag of surrender. Whatever happened, Sherry admits you were right and he was wrong.',
    funTask: 'Take 3 deep breaths, then send Sherry a grumpy sticker to watch him apologize!'
  },
  {
    id: 'hangry',
    mood: 'Hangry (Hungry & Grumpy)',
    emoji: '🍟',
    color: 'from-amber-600/30 to-orange-700/30 border-amber-400/40',
    prescriptionTitle: 'Immediate Nutrition Dispatch 🍕',
    quote: '"Hunger turns angels into feisty bosses! Food is non-negotiable."',
    sherryAction: 'You have official authorization to order your favorite cheat meal right this second.',
    funTask: 'Spin the Wheel of Treats tab right now to claim free ice cream or pizza from Sherry!'
  },
  {
    id: 'exhausted',
    mood: 'Exhausted / Sleepy',
    emoji: '😴',
    color: 'from-purple-600/30 to-slate-800/30 border-purple-400/40',
    prescriptionTitle: 'Royal Slumber Indulgence 🌙',
    quote: '"Rest, my queen. You conquered another day, and the stars are watching over you."',
    sherryAction: 'Put your phone on Do Not Disturb, cuddle up with three pillows, and let all worries drift away.',
    funTask: 'Close your eyes and let the celestial chime play softly in the background.'
  },
  {
    id: 'bored',
    mood: 'Bored / Zero Energy',
    emoji: '🥱',
    color: 'from-teal-600/30 to-emerald-700/30 border-teal-400/40',
    prescriptionTitle: 'Anti-Boredom Sparkle Therapy ✨',
    quote: '"Boredom is just the universe telling you it\'s time for an unexpected adventure or a silly game!"',
    sherryAction: 'Sherry challenges you to score at least 150 points in the Cupcake Rush game right now!',
    funTask: 'Switch to the "Cupcake Rush" tab above and beat Sherry\'s high score!'
  },
  {
    id: 'happy',
    mood: 'Happy & Loved',
    emoji: '🥰',
    color: 'from-pink-600/30 to-rose-600/30 border-pink-400/40',
    prescriptionTitle: 'Celebration Amplifier Mode 🎉',
    quote: '"Your happiness is the most beautiful thing in my world. Keep shining like the diamond you are!"',
    sherryAction: 'Sherry is smiling just knowing that you are happy. Your joy is contagious!',
    funTask: 'Tap the confetti button below to shower your screen with fireworks!'
  }
];

export const FunActivitiesSection: React.FC<FunActivitiesSectionProps> = ({
  girlName,
  themeColor = '#ec4899',
  cardBg = 'bg-white/10',
  cardBorder = 'border-white/15'
}) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>('quiz');
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);

  const ACTIVITY_TABS: { id: ActivityTab; label: string; icon: string; badge: string }[] = [
    { id: 'quiz', label: 'Couple Quiz', icon: '🏆', badge: '8 Questions' },
    { id: 'arcade', label: 'Cupcake Rush', icon: '🍰', badge: 'Arcade Game' },
    { id: 'wheel', label: 'Wheel of Treats', icon: '🎡', badge: 'Win Vouchers' },
    { id: 'memory', label: 'Memory Match', icon: '🧠', badge: '6 Pairs' },
    { id: 'mood', label: 'Mood Booster', icon: '🎭', badge: 'Instant Smile' },
    { id: 'lovemeter', label: 'Soulmate Meter', icon: '💖', badge: 'Love Frequency' },
    { id: 'balloons', label: 'Pop Balloons', icon: '🎈', badge: 'Carnival' },
    { id: 'truthordare', label: 'Truth or Dare', icon: '👑', badge: 'Challenges' }
  ];

  const handlePrevTab = () => {
    const currentIndex = ACTIVITY_TABS.findIndex(t => t.id === activeTab);
    const prevIndex = (currentIndex - 1 + ACTIVITY_TABS.length) % ACTIVITY_TABS.length;
    setActiveTab(ACTIVITY_TABS[prevIndex].id);
    birthdayAudio.playPageFlip();
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const handleNextTab = () => {
    const currentIndex = ACTIVITY_TABS.findIndex(t => t.id === activeTab);
    const nextIndex = (currentIndex + 1) % ACTIVITY_TABS.length;
    setActiveTab(ACTIVITY_TABS[nextIndex].id);
    birthdayAudio.playPageFlip();
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  // ==========================================
  // QUIZ STATE
  // ==========================================
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [copiedQuiz, setCopiedQuiz] = useState(false);

  const handleSelectQuizOption = (optIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIndex);
    const q = QUIZ_QUESTIONS[currentQIndex];
    if (q.options[optIndex].isBest) {
      setQuizScore(s => s + 1);
      birthdayAudio.playSparkleChime();
    } else {
      birthdayAudio.playPageFlip();
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(i => i + 1);
      setSelectedOption(null);
      birthdayAudio.playPageFlip();
    } else {
      setQuizFinished(true);
      triggerRealisticConfetti();
      triggerFireworks();
      activityTracker.logEvent('quiz', 'Completed Birthday Quiz! 🏆', `Score: ${quizScore + (selectedOption !== null && QUIZ_QUESTIONS[currentQIndex].options[selectedOption].isBest ? 1 : 0)} / ${QUIZ_QUESTIONS.length}`, 'pink');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
    birthdayAudio.playSparkleChime();
  };

  const getQuizResultTitle = () => {
    const final = quizScore;
    if (final >= 7) return "👑 Supreme Soulmates & Royal Boss Lady";
    if (final >= 5) return "💖 Certified Partner-in-Crime & Sweet Headache";
    if (final >= 3) return "😂 Adorable Drama Queen with Special Privileges";
    return "🍦 Sherry Owes You 5 Free Desserts for Retesting";
  };

  // ==========================================
  // ARCADE GAME (CUPCAKE RUSH) STATE
  // ==========================================
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameLives, setGameLives] = useState(3);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('birthday_cupcake_highscore');
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [basketX, setBasketX] = useState(50); // percentage 0 to 100
  const gameLoopRef = useRef<number | null>(null);
  const itemsRef = useRef<{ id: number; x: number; y: number; speed: number; type: 'cupcake' | 'strawberry' | 'gift' | 'heart' | 'cloud'; points: number; emoji: string }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const touchLeftIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchRightIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameScore(0);
    setGameLives(3);
    setGameTimeLeft(30);
    setGameOver(false);
    setIsGameRunning(true);
    itemsRef.current = [];
    setBasketX(50);
    birthdayAudio.playSparkleChime();
    activityTracker.logEvent('game', 'Started Cupcake Rush Arcade 🎮', `Playing as ${girlName}`, 'amber');
  };

  const stopGame = () => {
    setIsGameRunning(false);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  };

  // Move basket via keyboard
  useEffect(() => {
    if (!isGameRunning) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX(prev => Math.max(8, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX(prev => Math.min(92, prev + 7));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameRunning]);

  // Game timer countdown
  useEffect(() => {
    if (!isGameRunning || gameOver) return;
    const timer = setInterval(() => {
      setGameTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          endGame(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameRunning, gameOver]);

  // Game Animation Loop
  useEffect(() => {
    if (!isGameRunning || gameOver) return;

    let spawnCounter = 0;
    let nextItemId = 1;

    const loop = () => {
      spawnCounter++;
      // Spawn items every ~35 frames
      if (spawnCounter % 35 === 0) {
        const rand = Math.random();
        let type: 'cupcake' | 'strawberry' | 'gift' | 'heart' | 'cloud' = 'cupcake';
        let points = 10;
        let emoji = '🧁';

        if (rand < 0.35) {
          type = 'cupcake';
          points = 10;
          emoji = '🧁';
        } else if (rand < 0.60) {
          type = 'strawberry';
          points = 15;
          emoji = '🍓';
        } else if (rand < 0.78) {
          type = 'gift';
          points = 25;
          emoji = '🎁';
        } else if (rand < 0.90) {
          type = 'heart';
          points = 50;
          emoji = '💖';
        } else {
          type = 'cloud';
          points = -15;
          emoji = '⛈️';
        }

        itemsRef.current.push({
          id: nextItemId++,
          x: Math.floor(Math.random() * 80) + 10,
          y: 0,
          speed: 1.2 + Math.random() * 1.5,
          type,
          points,
          emoji
        });
      }

      // Update positions and check collisions with basket (y ≈ 85%)
      const remaining: typeof itemsRef.current = [];
      const currentBasket = basketX;

      for (const item of itemsRef.current) {
        item.y += item.speed;

        // Check collision at basket height (82% to 92%)
        if (item.y >= 82 && item.y <= 92) {
          const dist = Math.abs(item.x - currentBasket);
          if (dist < 14) {
            // Caught item!
            if (item.type === 'cloud') {
              birthdayAudio.playPageFlip();
              setGameLives(l => {
                const updated = l - 1;
                if (updated <= 0) {
                  endGame(false);
                }
                return updated;
              });
              setGameScore(s => Math.max(0, s - 15));
            } else {
              birthdayAudio.playSparkleChime();
              setGameScore(s => {
                const newScore = s + item.points;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  try {
                    localStorage.setItem('birthday_cupcake_highscore', newScore.toString());
                  } catch {}
                }
                return newScore;
              });
            }
            continue; // Item collected
          }
        }

        // Keep item if it hasn't fallen off screen
        if (item.y < 100) {
          remaining.push(item);
        }
      }

      itemsRef.current = remaining;
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isGameRunning, gameOver, basketX, highScore]);

  const endGame = (timedOut: boolean) => {
    setIsGameRunning(false);
    setGameOver(true);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    triggerRealisticConfetti();
    if (timedOut) {
      birthdayAudio.playSparkleChime();
    }
    activityTracker.logEvent('game', 'Finished Cupcake Rush! 🍰', `Final Score: ${gameScore} pts`, 'amber');
  };

  // ==========================================
  // WHEEL OF FORTUNE STATE
  // ==========================================
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [winningItem, setWinningItem] = useState<WheelItem | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinningItem(null);
    setShowVoucherModal(false);
    birthdayAudio.playSparkleChime();

    // Random slice selection (0 to 7)
    const targetSliceIndex = Math.floor(Math.random() * WHEEL_ITEMS.length);
    const sliceAngle = 360 / WHEEL_ITEMS.length;
    // Calculate final rotation (at least 5-7 full spins = 1800-2520 deg + offset for slice)
    const extraSpins = 5 * 360;
    // Pointer is at the top (270 deg or 90 deg depending on orientation)
    // Slice 0 starts at 0 deg, so center is sliceAngle / 2
    const sliceCenter = (targetSliceIndex * sliceAngle) + (sliceAngle / 2);
    // Align with top pointer (270 deg)
    const finalTargetAngle = wheelAngle + extraSpins + (360 - (sliceCenter % 360)) + 270;

    setWheelAngle(finalTargetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = WHEEL_ITEMS[targetSliceIndex];
      setWinningItem(chosen);
      setShowVoucherModal(true);
      birthdayAudio.playSparkleChime();
      triggerRealisticConfetti();
      triggerHeartShower();
      activityTracker.logEvent('surprise', `Won Wheel Treat: ${chosen.label} 🎡`, `Voucher claimed by ${girlName}`, 'purple');
    }, 4200);
  };

  // ==========================================
  // MEMORY MATCH STATE
  // ==========================================
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryTimer, setMemoryTimer] = useState(0);
  const [isMemoryActive, setIsMemoryActive] = useState(false);
  const [memoryWon, setMemoryWon] = useState(false);

  const initMemoryGame = () => {
    const deck: MemoryCard[] = [];
    MEMORY_ICONS.forEach((item, idx) => {
      // 2 cards per icon
      deck.push({
        id: idx * 2,
        pairId: idx,
        icon: item.icon,
        name: item.name,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: idx * 2 + 1,
        pairId: idx,
        icon: item.icon,
        name: item.name,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setMemoryCards(deck);
    setFlippedIndices([]);
    setMatchedPairsCount(0);
    setMemoryMoves(0);
    setMemoryTimer(0);
    setIsMemoryActive(true);
    setMemoryWon(false);
    birthdayAudio.playSparkleChime();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMemoryActive && !memoryWon) {
      interval = setInterval(() => {
        setMemoryTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMemoryActive, memoryWon]);

  const handleCardClick = (index: number) => {
    if (!isMemoryActive || memoryWon) return;
    if (flippedIndices.length >= 2) return;
    if (memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    birthdayAudio.playPageFlip();
    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].pairId === newCards[secondIdx].pairId) {
        // Matched!
        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
          setMatchedPairsCount(c => {
            const updated = c + 1;
            if (updated === MEMORY_ICONS.length) {
              setMemoryWon(true);
              triggerRealisticConfetti();
              triggerFireworks();
              activityTracker.logEvent('game', 'Won Memory Match! 🧠✨', `Finished in ${memoryMoves + 1} moves`, 'pink');
            }
            return updated;
          });
          birthdayAudio.playSparkleChime();
        }, 500);
      } else {
        // Mismatched, flip back
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // Initialize memory game on component mount
  useEffect(() => {
    initMemoryGame();
  }, []);

  // ==========================================
  // MOOD BOOSTER STATE
  // ==========================================
  const [selectedMood, setSelectedMood] = useState<MoodOption>(MOOD_OPTIONS[0]);
  const [hugSent, setHugSent] = useState(false);

  const handleSelectMood = (mood: MoodOption) => {
    setSelectedMood(mood);
    setHugSent(false);
    birthdayAudio.playSparkleChime();
  };

  const handleSendWarmHug = () => {
    setHugSent(true);
    birthdayAudio.playSparkleChime();
    triggerHeartShower();
    triggerRealisticConfetti();
    activityTracker.logEvent('note', 'Virtual Warm Hug Sent 🫂💖', `Prescription for ${selectedMood.mood}`, 'purple');
    setTimeout(() => setHugSent(false), 3000);
  };

  return (
    <section id="activities" className="w-full py-16 px-4 sm:px-6 relative z-10">
      <div className="max-w-5xl mx-auto space-y-10 text-center">

        {/* Header Title & Intro */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md">
            <Gamepad2 className="w-4 h-4 text-pink-400" />
            <span>Interactive Fun & Arcade</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-['Playfair_Display'] font-bold text-white tracking-tight">
            Aliha's Birthday Fun Zone & Games 🎮✨
          </h2>

          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Take the hilarious couple quiz, catch sweet falling birthday cupcakes, spin Sherry's wheel of treats & dares, test your memory, or activate instant mood boosters!
          </p>
        </div>

        {/* Activity Navigation Tabs with Interactive Arrow Buttons */}
        <div className="relative flex items-center justify-center gap-2 max-w-5xl mx-auto w-full px-1">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrevTab}
            className="p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-amber-400/40 hover:border-amber-400 text-amber-300 shadow-lg shadow-black/50 transition-all cursor-pointer shrink-0 hover:scale-110 active:scale-95 z-10"
            title="Previous Game / Activity (←)"
            aria-label="Previous Game"
          >
            <ChevronLeft className="w-5 h-5 text-amber-300 animate-pulse" />
          </button>

          {/* Scrolling Tab Pills Container */}
          <div 
            ref={tabsContainerRef}
            className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none scroll-smooth w-full"
          >
            {ACTIVITY_TABS.map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    birthdayAudio.playPageFlip();
                  }}
                  className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white border-pink-300/90 shadow-lg shadow-pink-600/40 scale-105 font-bold ring-2 ring-pink-400/40'
                      : 'bg-black/40 text-white/75 border-white/10 hover:bg-white/10 hover:text-white hover:border-pink-400/40'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/30 text-amber-200' : 'bg-white/10 text-white/60'}`}>
                    {tab.badge}
                  </span>
                  {/* Arrow Indicator on tab */}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-amber-200 translate-x-0.5' : 'text-white/40'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextTab}
            className="p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-black/90 border border-amber-400/40 hover:border-amber-400 text-amber-300 shadow-lg shadow-black/50 transition-all cursor-pointer shrink-0 hover:scale-110 active:scale-95 z-10"
            title="Next Game / Activity (→)"
            aria-label="Next Game"
          >
            <ChevronRight className="w-5 h-5 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: THE ULTIMATE COUPLE QUIZ                                           */}
        {/* ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/80 via-pink-950/40 to-slate-950/80 border border-pink-300/30 shadow-2xl backdrop-blur-xl text-left space-y-6 animate-fade-in">
            {!quizFinished ? (
              <>
                {/* Progress Bar & Counter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-pink-400" />
                      <span>Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    </span>
                    <span className="font-mono bg-pink-500/20 text-pink-200 px-2.5 py-0.5 rounded-full border border-pink-400/30">
                      Score: {quizScore}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-2">
                  <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-white leading-snug">
                    {QUIZ_QUESTIONS[currentQIndex].question}
                  </h3>
                  <p className="text-xs text-pink-300/70 italic">
                    💡 {QUIZ_QUESTIONS[currentQIndex].humorNote}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {QUIZ_QUESTIONS[currentQIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectQuizOption(oIdx)}
                        disabled={selectedOption !== null}
                        className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? opt.isBest
                              ? 'bg-emerald-600/30 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/40'
                              : 'bg-rose-600/30 border-rose-400 text-rose-100 ring-2 ring-rose-400/40'
                            : selectedOption !== null
                            ? opt.isBest
                              ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-200/80'
                              : 'bg-white/5 border-white/5 text-white/40'
                            : 'bg-white/10 hover:bg-white/15 border-white/15 text-white hover:border-pink-400/50 hover:scale-[1.01]'
                        }`}
                      >
                        <span className="font-medium">{opt.text}</span>
                        {isSelected && (
                          <span className="text-xs shrink-0 font-bold px-2 py-0.5 rounded-full bg-black/40">
                            {opt.isBest ? '✨ Correct' : '😂 Funny pick'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Reaction Box & Next Button */}
                {selectedOption !== null && (
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/15 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Sherry's Live Commentary:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 italic">
                      "{QUIZ_QUESTIONS[currentQIndex].options[selectedOption].reaction}"
                    </p>
                    <button
                      onClick={handleNextQuizQuestion}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    >
                      <span>{currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Royal Result'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Quiz Finished Screen */
              <div className="text-center space-y-6 py-4 animate-scale-up">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-xl shadow-pink-500/30 flex items-center justify-center">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-bold uppercase tracking-wider">
                    Official Birthday Certificate
                  </span>
                  <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
                    {getQuizResultTitle()}
                  </h3>
                  <p className="text-sm text-white/80 max-w-md mx-auto">
                    You scored <strong className="text-amber-300 font-bold">{quizScore} out of {QUIZ_QUESTIONS.length}</strong>! You know Sherry and yourself to absolute perfection.
                  </p>
                </div>

                {/* Score Details Banner */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-white/70 space-y-1">
                  <p>👑 Status: Certified Soulmate & Unquestionable Queen of the Household</p>
                  <p>🌹 Signed & sealed under Sherry's signature with infinite love.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleRestartQuiz}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play Again</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Alihaaa completed the Birthday Couple Quiz! Score: ${quizScore}/${QUIZ_QUESTIONS.length} - ${getQuizResultTitle()}`);
                      setCopiedQuiz(true);
                      birthdayAudio.playSparkleChime();
                      setTimeout(() => setCopiedQuiz(false), 2500);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-pink-500/30 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    {copiedQuiz ? <Check className="w-4 h-4 text-emerald-200" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedQuiz ? 'Result Copied!' : 'Copy Result Badge'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CUPCAKE RUSH (2D INTERACTIVE ARCADE GAME)                          */}
        {/* ========================================================================= */}
        {activeTab === 'arcade' && (
          <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 via-purple-950/50 to-slate-950/90 border border-purple-400/30 shadow-2xl backdrop-blur-xl space-y-6 text-center animate-fade-in">
            {/* Top Game Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="font-['Playfair_Display'] text-lg font-bold text-amber-300">
                  Catch Aliha's Cupcakes 🍰
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                  Score: <strong className="text-white">{gameScore}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  High: <strong className="text-white">{highScore}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                  Lives: {'❤️'.repeat(Math.max(0, gameLives))}
                </span>
              </div>
            </div>

            {/* Playfield Area */}
            <div
              ref={gameAreaRef}
              className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-[#12071f] via-[#1a092b] to-[#250d3d] border-2 border-purple-500/40 overflow-hidden select-none touch-none shadow-inner"
              onMouseMove={(e) => {
                if (!isGameRunning || !gameAreaRef.current) return;
                const rect = gameAreaRef.current.getBoundingClientRect();
                const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
                setBasketX(Math.max(8, Math.min(92, xPercent)));
              }}
              onTouchMove={(e) => {
                if (!isGameRunning || !gameAreaRef.current || e.touches.length === 0) return;
                const rect = gameAreaRef.current.getBoundingClientRect();
                const xPercent = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                setBasketX(Math.max(8, Math.min(92, xPercent)));
              }}
            >
              {/* Starry Background Glow */}
              <div className="absolute top-2 left-4 text-xs text-white/30 pointer-events-none">✨</div>
              <div className="absolute top-10 right-8 text-xs text-white/30 pointer-events-none">⭐</div>
              <div className="absolute bottom-16 left-12 text-xs text-white/20 pointer-events-none">💫</div>

              {/* Falling Items */}
              {isGameRunning && itemsRef.current.map(item => (
                <div
                  key={item.id}
                  className="absolute text-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    filter: item.type === 'heart' ? 'drop-shadow(0 0 8px #f43f5e)' : 'none'
                  }}
                >
                  {item.emoji}
                </div>
              ))}

              {/* The Birthday Basket */}
              <div
                className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
                style={{ left: `${basketX}%` }}
              >
                <div className="text-3xl">🎀</div>
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-[10px] font-bold text-white shadow-lg shadow-pink-500/50 whitespace-nowrap border border-pink-300">
                  {girlName}'s Basket 🧺
                </div>
              </div>

              {/* Non-Running Overlay (Start / Game Over) */}
              {!isGameRunning && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-4">
                  {gameOver ? (
                    <>
                      <div className="text-4xl animate-bounce">🎉</div>
                      <div className="space-y-1">
                        <h4 className="font-['Playfair_Display'] text-2xl font-bold text-white">
                          Game Over, Beautiful!
                        </h4>
                        <p className="text-xs text-pink-200">
                          Final Score: <strong className="text-amber-300 text-base">{gameScore} pts</strong>
                          {gameScore >= highScore && gameScore > 0 ? ' 🌟 NEW RECORD!' : ''}
                        </p>
                      </div>
                      <button
                        onClick={startGame}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Play Again</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl animate-bounce">🧁</div>
                      <div className="space-y-1">
                        <h4 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-white">
                          Catch the Birthday Cupcakes!
                        </h4>
                        <p className="text-xs text-white/70 max-w-sm">
                          Move the basket to catch cupcakes (+10), strawberries (+15), gifts (+25), and glowing hearts (+50). Avoid the rainclouds!
                        </p>
                      </div>
                      <button
                        onClick={startGame}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/40 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start Cupcake Rush</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Touch Control Buttons for Easy Playing */}
            {isGameRunning && (
              <div className="flex items-center justify-center gap-4 pt-2 sm:hidden">
                <button
                  onMouseDown={() => {
                    touchLeftIntervalRef.current = setInterval(() => {
                      setBasketX(p => Math.max(8, p - 6));
                    }, 50);
                  }}
                  onMouseUp={() => {
                    if (touchLeftIntervalRef.current) clearInterval(touchLeftIntervalRef.current);
                  }}
                  onTouchStart={() => {
                    touchLeftIntervalRef.current = setInterval(() => {
                      setBasketX(p => Math.max(8, p - 6));
                    }, 50);
                  }}
                  onTouchEnd={() => {
                    if (touchLeftIntervalRef.current) clearInterval(touchLeftIntervalRef.current);
                  }}
                  className="px-6 py-3 rounded-2xl bg-white/15 active:bg-pink-600 text-white text-base font-bold shadow-md border border-white/20 select-none"
                >
                  ⬅️ Move Left
                </button>

                <button
                  onMouseDown={() => {
                    touchRightIntervalRef.current = setInterval(() => {
                      setBasketX(p => Math.min(92, p + 6));
                    }, 50);
                  }}
                  onMouseUp={() => {
                    if (touchRightIntervalRef.current) clearInterval(touchRightIntervalRef.current);
                  }}
                  onTouchStart={() => {
                    touchRightIntervalRef.current = setInterval(() => {
                      setBasketX(p => Math.min(92, p + 6));
                    }, 50);
                  }}
                  onTouchEnd={() => {
                    if (touchRightIntervalRef.current) clearInterval(touchRightIntervalRef.current);
                  }}
                  className="px-6 py-3 rounded-2xl bg-white/15 active:bg-pink-600 text-white text-base font-bold shadow-md border border-white/20 select-none"
                >
                  Move Right ➡️
                </button>
              </div>
            )}

            <p className="text-[11px] text-white/50 italic">
              Desktop: Use Left & Right Arrow keys or drag your mouse across the canvas!
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WHEEL OF TREATS & DARES (SPIN THE WHEEL)                           */}
        {/* ========================================================================= */}
        {activeTab === 'wheel' && (
          <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/80 via-amber-950/30 to-slate-950/80 border border-amber-400/30 shadow-2xl backdrop-blur-xl space-y-6 text-center animate-fade-in">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                Sherry's Birthday Privilege Wheel
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
                Spin the Wheel of Treats & Dares 🎡
              </h3>
              <p className="text-xs text-white/70 max-w-md mx-auto">
                Spin to win real privileges, sweet dares, and vouchers that Sherry is obligated to fulfill!
              </p>
            </div>

            {/* Wheel Canvas / SVG Presentation */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto my-4 flex items-center justify-center">
              {/* Wheel Pointer Triangle at Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow(0 2px 4px rgba(0,0,0,0.8))" />

              {/* The Spinning Disc */}
              <div
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden relative"
                style={{
                  transform: `rotate(${wheelAngle}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
                }}
              >
                {/* 8 Slices Generated via SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {WHEEL_ITEMS.map((item, idx) => {
                    const angle = 360 / WHEEL_ITEMS.length;
                    const startAngle = idx * angle;
                    const endAngle = startAngle + angle;
                    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                    return (
                      <path
                        key={item.id}
                        d={pathData}
                        fill={item.color}
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                </svg>

                {/* Emojis & Labels Placed Over Slices */}
                {WHEEL_ITEMS.map((item, idx) => {
                  const angle = 360 / WHEEL_ITEMS.length;
                  const itemAngle = idx * angle + angle / 2;
                  return (
                    <div
                      key={item.id}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white font-bold select-none pointer-events-none"
                      style={{
                        transform: `rotate(${itemAngle}deg) translate(0, -90px) rotate(-${itemAngle}deg)`
                      }}
                    >
                      <span className="text-xl sm:text-2xl filter drop-shadow-md">{item.emoji}</span>
                    </div>
                  );
                })}
              </div>

              {/* Central Glowing Spin Button */}
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-2xl shadow-pink-500/50 border-2 border-white flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-80"
              >
                <Sparkles className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? '...' : 'SPIN!'}</span>
              </button>
            </div>

            {/* Winner Voucher Display Popup */}
            {winningItem && showVoucherModal && (
              <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/80 via-slate-900/90 to-black/90 border-2 border-amber-400 shadow-2xl space-y-4 animate-scale-up text-center">
                <div className="text-4xl animate-bounce">{winningItem.emoji}</div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                    🎉 Congratulations Alihaaa!
                  </span>
                  <h4 className="font-['Playfair_Display'] text-2xl font-bold text-white">
                    {winningItem.voucherTitle}
                  </h4>
                  <p className="text-sm text-amber-100/90 leading-relaxed font-serif max-w-md mx-auto">
                    "{winningItem.voucherText}"
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`🎟️ Alihaaa won: ${winningItem.voucherTitle}! "${winningItem.voucherText}" — Sherry owes this now!`);
                      setCopiedVoucher(true);
                      birthdayAudio.playSparkleChime();
                      setTimeout(() => setCopiedVoucher(false), 2500);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    {copiedVoucher ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedVoucher ? 'Voucher Copied!' : 'Copy Voucher to WhatsApp'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MEMORY LOVE MATCH (CARD FLIP GAME)                                  */}
        {/* ========================================================================= */}
        {activeTab === 'memory' && (
          <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/80 via-pink-950/30 to-slate-950/80 border border-pink-400/30 shadow-2xl backdrop-blur-xl space-y-6 text-center animate-fade-in">
            {/* Top Scorebar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/15">
              <div className="space-y-0.5 text-left">
                <span className="font-['Playfair_Display'] text-lg font-bold text-white">
                  Memory Love Match 🧠✨
                </span>
                <p className="text-xs text-pink-300">Find all 6 matching birthday pairs!</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/15">
                  Moves: <strong className="text-white">{memoryMoves}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                  Matched: <strong className="text-white">{matchedPairsCount} / {MEMORY_ICONS.length}</strong>
                </span>
                <button
                  onClick={initMemoryGame}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  title="Restart Memory Game"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4x3 Grid of Memory Cards */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 py-2">
              {memoryCards.map((card, idx) => {
                const isRevealed = card.isFlipped || card.isMatched;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`h-24 sm:h-28 rounded-2xl cursor-pointer transition-all duration-300 transform perspective-500 flex items-center justify-center select-none ${
                      isRevealed
                        ? 'bg-gradient-to-tr from-pink-600 via-rose-600 to-amber-500 text-white border-2 border-amber-300 shadow-lg shadow-pink-600/40 scale-100 rotate-0'
                        : 'bg-gradient-to-b from-white/15 to-black/40 hover:bg-white/20 border border-white/20 hover:border-pink-400/50 hover:scale-105'
                    }`}
                  >
                    {isRevealed ? (
                      <div className="flex flex-col items-center justify-center space-y-1 animate-scale-up">
                        <span className="text-3xl sm:text-4xl">{card.icon}</span>
                        <span className="text-[10px] font-medium text-white/90">{card.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1 text-pink-300/70">
                        <Heart className="w-6 h-6 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-wider font-mono">Tap</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Memory Victory Screen */}
            {memoryWon && (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-400/50 space-y-3 animate-scale-up">
                <div className="text-3xl">🎉</div>
                <h4 className="font-['Playfair_Display'] text-xl font-bold text-emerald-200">
                  Flawless Memory, Alihaaa!
                </h4>
                <p className="text-xs text-emerald-100/80">
                  You matched all pairs in only <strong>{memoryMoves} moves</strong> and <strong>{memoryTimer} seconds</strong>!
                </p>
                <button
                  onClick={initMemoryGame}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all cursor-pointer"
                >
                  Play Another Round
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MOOD BOOSTER TRANSFORMER (SHERRY'S EMERGENCY SMILE MACHINE)        */}
        {/* ========================================================================= */}
        {activeTab === 'mood' && (
          <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/80 via-pink-950/30 to-slate-950/80 border border-pink-400/30 shadow-2xl backdrop-blur-xl space-y-6 text-center animate-fade-in">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-bold uppercase tracking-wider">
                Instant Smile Prescription
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
                Aliha's Emergency Mood Transformer 🎭
              </h3>
              <p className="text-xs text-white/70 max-w-md mx-auto">
                How is Alihaaa feeling right now? Tap your mood below to unlock Sherry's tailored prescription!
              </p>
            </div>

            {/* Mood Option Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOOD_OPTIONS.map(opt => {
                const isSelected = selectedMood.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectMood(opt)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-300 shadow-lg shadow-pink-600/30 scale-105 font-bold'
                        : 'bg-white/10 hover:bg-white/15 text-white/80 border-white/15 hover:border-pink-400/40'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs leading-snug">{opt.mood}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Mood Prescription Card */}
            <div className="p-6 rounded-3xl bg-black/50 border border-white/15 text-left space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{selectedMood.prescriptionTitle}</span>
              </div>

              <blockquote className="font-serif text-sm sm:text-base text-white/95 italic border-l-2 border-pink-500 pl-3 leading-relaxed">
                {selectedMood.quote}
              </blockquote>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1.5 text-xs text-white/85">
                <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <span>💌 Message from Sherry:</span>
                </p>
                <p className="leading-relaxed">{selectedMood.sherryAction}</p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <span className="text-xs text-pink-200/70 italic">
                  Suggested Action: {selectedMood.funTask}
                </span>

                <button
                  onClick={handleSendWarmHug}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Heart className={`w-4 h-4 ${hugSent ? 'fill-white animate-ping' : ''}`} />
                  <span>{hugSent ? 'Tight Warm Hug Sent! 🫂' : 'Claim a Warm Hug from Sherry'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SOULMATE & LOVE FREQUENCY METER                                    */}
        {/* ========================================================================= */}
        {activeTab === 'lovemeter' && (
          <LoveMeterGame girlName={girlName} />
        )}

        {/* ========================================================================= */}
        {/* TAB 7: POP BIRTHDAY BALLOONS & REVEAL SECRET NOTES                        */}
        {/* ========================================================================= */}
        {activeTab === 'balloons' && (
          <BalloonPopGame girlName={girlName} />
        )}

        {/* ========================================================================= */}
        {/* TAB 8: SHERRY'S ROYAL TRUTH OR DARE CHALLENGE                             */}
        {/* ========================================================================= */}
        {activeTab === 'truthordare' && (
          <TruthOrDareGame girlName={girlName} />
        )}

      </div>
    </section>
  );
};
