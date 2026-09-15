import React, { useState } from 'react';
import { X, Sparkles, Heart, Wand2, Stars, Send } from 'lucide-react';
import { triggerRealisticConfetti, triggerFireworks, triggerHeartShower } from '../utils/confettiFireworks';
import { birthdayAudio } from '../utils/audioSynthesizer';

interface WishModalProps {
  girlName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WishModal: React.FC<WishModalProps> = ({ girlName, isOpen, onClose }) => {
  const [userWishText, setUserWishText] = useState('');
  const [wishSent, setWishSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    setWishSent(true);
    birthdayAudio.playSparkleChime();
    triggerRealisticConfetti();
    triggerFireworks(3500);
    triggerHeartShower();

    window.dispatchEvent(new CustomEvent('show-confetti-toast', {
      detail: {
        title: `🎉 Thank You for Your Wish, ${girlName}! ✨`,
        message: userWishText ? `“${userWishText}” — May this precious wish manifest into your life with endless blessings!` : 'Your sweet birthday wish has been written into the constellation of love!',
        senderName: 'Sherry'
      }
    }));
  };

  const handleClose = () => {
    setWishSent(false);
    setUserWishText('');
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-pink-400/40 shadow-2xl shadow-pink-500/20 text-center space-y-6 relative overflow-hidden animate-scale-up"
      >
        {/* Glow ambient circle */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          aria-label="Close wish modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!wishSent ? (
          <>
            {/* Header Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Wand2 className="w-8 h-8 text-white animate-pulse" />
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-pink-300 uppercase tracking-widest">
                Sacred Birthday Moment
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white leading-tight">
                Make a Wish, {girlName} <span className="text-pink-400">✨</span>
              </h3>
              <p className="text-sm text-white/80 font-light italic max-w-sm mx-auto">
                "Close your eyes, take a deep breath, and let your dreams find their way to you."
              </p>
            </div>

            {/* Wish Input Form */}
            <form onSubmit={handleSubmitWish} className="space-y-4 pt-2 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 block">
                  Whisper a wish or thought into the stars:
                </label>
                <textarea
                  rows={3}
                  value={userWishText}
                  onChange={e => setUserWishText(e.target.value)}
                  placeholder="e.g. Enduring peace, unforgettable adventures, love without limits..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-pink-400 focus:outline-hidden text-sm text-white placeholder-white/40 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 shadow-lg shadow-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-200" />
                <span>Send Wish to the Universe ✨</span>
              </button>
            </form>
          </>
        ) : (
          /* Wish Sent Confirmation View */
          <div className="space-y-6 py-4 animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-pink-500/20 border-2 border-pink-400/50 flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white">
                Your Wish is Set in Motion! 💫
              </h3>
              <p className="font-['Dancing_Script'] text-xl text-pink-200">
                "Today isn't just another day... it's the day someone truly special was born."
              </p>
              {userWishText && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/90 italic mt-3 max-w-sm mx-auto">
                  "{userWishText}"
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              Continue Celebrating 💖
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
