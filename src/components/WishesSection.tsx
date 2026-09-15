import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Star, Smile, Wand2, RefreshCw, Bookmark } from 'lucide-react';
import { WishItem } from '../types/birthday';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { triggerHeartShower } from '../utils/confettiFireworks';
import { FavoriteWishesBarModal } from './FavoriteWishesBarModal';
import { securityTracker } from '../utils/securityTracker';

interface WishesSectionProps {
  wishes: WishItem[];
  hiddenWishes: string[];
}

export const WishesSection: React.FC<WishesSectionProps> = ({ wishes, hiddenWishes }) => {
  const [revealedWishes, setRevealedWishes] = useState<string[]>([]);
  const [currentHiddenIndex, setCurrentHiddenIndex] = useState(0);
  const [favorites, setFavorites] = useState(() => securityTracker.getFavorites());

  useEffect(() => {
    const unsub = securityTracker.subscribeFavorites(updated => {
      setFavorites([...updated]);
    });
    return unsub;
  }, []);

  const isFavorited = (content: string) => favorites.some(f => f.content === content);

  const toggleWishFavorite = (wish: WishItem) => {
    birthdayAudio.playSparkleChime();
    triggerHeartShower();
    securityTracker.toggleFavorite({
      id: wish.id,
      content: wish.content,
      category: wish.category,
      categoryLabel: wish.categoryLabel,
      highlightWord: wish.highlightWord,
      emoji: '💖'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'heart':
        return <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />;
      case 'future':
        return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'special':
        return <Star className="w-5 h-5 text-purple-300" />;
      case 'memories':
      default:
        return <Smile className="w-5 h-5 text-rose-300" />;
    }
  };

  const handleReadMoreWish = () => {
    birthdayAudio.playSparkleChime();
    triggerHeartShower();
    const nextWish = hiddenWishes[currentHiddenIndex % hiddenWishes.length];
    setRevealedWishes(prev => [nextWish, ...prev]);
    setCurrentHiddenIndex(prev => prev + 1);
  };

  return (
    <section id="wishes" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Dedicated Blessings</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Birthday Wishes For You <span className="text-pink-400">💌</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 font-light">
            Every whispered prayer, warm thought, and deepest wish for your new orbit around the sun.
          </p>
        </div>

        {/* PROMINENT INFINITE FAVORITE WISHES BAR (Click to open full popup modal) */}
        <FavoriteWishesBarModal girlName="Alihaaa" />

        {/* Primary Wish Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {wishes.map((wish, index) => {
            const favorited = isFavorited(wish.content);
            return (
              <div
                key={wish.id}
                className="group relative rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-pink-500/20 hover:border-pink-300/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Subtle top badge & Favorite Heart Button */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/90">
                    {getCategoryIcon(wish.category)}
                    <span>{wish.categoryLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {wish.highlightWord && (
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-pink-300">
                        ✨ {wish.highlightWord}
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishFavorite(wish)}
                      className={`p-2 rounded-full border transition-all duration-300 cursor-pointer group/heart relative ${
                        favorited
                          ? 'bg-linear-to-tr from-pink-500 to-rose-400 border-pink-300 text-white shadow-lg shadow-pink-500/40 scale-110 ring-2 ring-pink-400/40'
                          : 'bg-white/10 border-white/15 text-white/60 hover:text-pink-300 hover:bg-white/20 hover:scale-105'
                      }`}
                      title={favorited ? 'Saved in favorites vault 💖' : 'Save to favorite wishes'}
                      aria-label="Toggle favorite wish"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-300 ${
                          favorited
                            ? 'fill-white text-white animate-pulse'
                            : 'group-hover/heart:text-pink-300 group-hover/heart:scale-110 group-hover/heart:animate-pulse'
                        }`}
                      />
                      {favorited && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Title & Body */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-white group-hover:text-pink-200 transition-colors">
                    {wish.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                    "{wish.content}"
                  </p>
                </div>

                {/* Author / Signature Footer */}
                {wish.authorNote && (
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                    <span className="font-['Dancing_Script'] text-base text-pink-300">
                      With endless affection
                    </span>
                    <span className="italic">{wish.authorNote}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Revealed Hidden Wishes Container */}
        {revealedWishes.length > 0 && (
          <div className="mb-10 space-y-3 max-w-2xl mx-auto animate-fade-in">
            <h4 className="text-center text-xs uppercase tracking-widest text-pink-300 font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Newly Unfolded Hidden Wishes</span>
            </h4>
            {revealedWishes.map((msg, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-400/40 backdrop-blur-md text-center text-sm sm:text-base text-white font-['Dancing_Script'] text-xl shadow-lg animate-fade-in"
              >
                {msg}
              </div>
            ))}
          </div>
        )}

        {/* "Read One More Wish" Generator Button */}
        <div className="text-center">
          <button
            onClick={handleReadMoreWish}
            className="px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-pink-300/50 shadow-lg hover:shadow-pink-500/30 transition-all transform hover:scale-105 active:scale-95 inline-flex items-center gap-2 group"
          >
            <Heart className="w-4 h-4 text-pink-400 group-hover:scale-125 transition-transform" />
            <span>Read One More Wish 💖</span>
            <RefreshCw className="w-3.5 h-3.5 text-white/60 group-hover:rotate-180 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
