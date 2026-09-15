import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Bookmark,
  Share2,
  Wand2,
  Smile,
  Flame,
  Star,
  Quote
} from 'lucide-react';
import {
  ROMANTIC_WISHES,
  SWEET_PICKUP_LINES,
  BIRTHDAY_PROMISES,
  POETIC_COMPLIMENTS,
  generateInfiniteWish,
  GeneratedWish
} from '../data/unlimitedWishesData';
import { securityTracker, FavoriteWishItem } from '../utils/securityTracker';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { triggerHeartShower, triggerRealisticConfetti } from '../utils/confettiFireworks';

interface UnlimitedWishesGeneratorProps {
  girlName: string;
}

type WishCategoryFilter = 'all' | 'romantic' | 'pickup_line' | 'promise' | 'compliment';

export const UnlimitedWishesGenerator: React.FC<UnlimitedWishesGeneratorProps> = ({ girlName }) => {
  const [activeCategory, setActiveCategory] = useState<WishCategoryFilter>('all');
  const [currentWish, setCurrentWish] = useState<GeneratedWish>(() => generateInfiniteWish('romantic'));
  const [favorites, setFavorites] = useState<FavoriteWishItem[]>(() => securityTracker.getFavorites());
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sync favorites in real time
  useEffect(() => {
    const unsub = securityTracker.subscribeFavorites(updated => {
      setFavorites([...updated]);
    });
    return unsub;
  }, []);

  const isCurrentFavorited = favorites.some(f => f.content === currentWish.content);

  const handleGenerateWish = (cat?: WishCategoryFilter) => {
    setIsGenerating(true);
    birthdayAudio.playSparkleChime();
    triggerHeartShower();

    const selectedCat = (cat || activeCategory) === 'all' ? undefined : ((cat || activeCategory) as any);

    setTimeout(() => {
      const newWish = generateInfiniteWish(selectedCat);
      setCurrentWish(newWish);
      setIsGenerating(false);
    }, 200);
  };

  const handleToggleFavorite = () => {
    birthdayAudio.playSparkleChime();
    if (!isCurrentFavorited) {
      triggerHeartShower();
    }

    securityTracker.toggleFavorite({
      id: currentWish.id,
      content: currentWish.content,
      category: currentWish.category,
      categoryLabel: currentWish.categoryLabel,
      emoji: currentWish.emoji,
      highlightWord: currentWish.highlightWord
    });
  };

  const handleCopyWish = () => {
    navigator.clipboard.writeText(currentWish.content);
    birthdayAudio.playSparkleChime();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 rounded-3xl p-6 sm:p-10 bg-slate-950/80 backdrop-blur-2xl border border-pink-400/40 shadow-2xl shadow-pink-500/20 relative overflow-hidden">
      {/* Soft background ambient radial glows */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Infinite Love & Wishes Engine</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-[11px] font-medium text-amber-200">
              Unlimited ✨
            </span>
          </div>
          <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white mt-2">
            Endless Sweet Wishes & Pickup Lines for {girlName}♡
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-light mt-1">
            Generate infinite romantic wishes, flirty lines, and sweetest promises. Tap the heart to save your favorites!
          </p>
        </div>

        {/* Saved Favorites Counter Toggle */}
        <button
          onClick={() => setShowFavoritesOnly(prev => !prev)}
          className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            showFavoritesOnly
              ? 'bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/30'
              : 'bg-white/10 hover:bg-white/15 border-white/15 text-white/90'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-pink-300 fill-pink-300' : ''}`} />
          <span>My Saved Favorites</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-mono">
            {favorites.length}
          </span>
        </button>
      </div>

      {/* VIEW 1: SAVED FAVORITES LIST (when clicked) */}
      {showFavoritesOnly ? (
        <div className="space-y-4 relative z-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-semibold text-pink-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>Wishes Favorited by {girlName} ({favorites.length})</span>
            </h4>
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="text-xs text-white/60 hover:text-white underline"
            >
              Back to Generator &larr;
            </button>
          </div>

          {favorites.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-white/60 text-xs">
              No wishes favorited yet. Click the heart button on any wish or pickup line below to save it here!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {favorites.map((fav, i) => (
                <div
                  key={fav.id || i}
                  className="p-4 rounded-2xl bg-white/10 border border-pink-500/30 backdrop-blur-md flex flex-col justify-between gap-3 text-xs text-white relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-[10px] text-pink-300 font-semibold uppercase">
                      {fav.categoryLabel || 'Favorite Wish'}
                    </span>
                    <span className="text-base">{fav.emoji || '💖'}</span>
                  </div>
                  <p className="text-sm font-['Dancing_Script'] text-pink-100 text-lg leading-relaxed">
                    "{fav.content}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
                    <span>Saved {new Date(fav.favoritedAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(fav.content);
                        birthdayAudio.playSparkleChime();
                      }}
                      className="hover:text-pink-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: INTERACTIVE UNLIMITED GENERATOR */
        <div className="space-y-6 relative z-10">
          {/* Category Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Mixed 🎲' },
              { id: 'romantic', label: 'Romantic Wishes 💖' },
              { id: 'pickup_line', label: 'Flirty Pickup Lines 😉' },
              { id: 'promise', label: 'Birthday Promises 💍' },
              { id: 'compliment', label: 'Poetic Compliments 🌹' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id as WishCategoryFilter);
                  handleGenerateWish(tab.id as WishCategoryFilter);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Featured Wish Display Card */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-linear-to-br ${currentWish.moodColor} border border-pink-400/40 backdrop-blur-xl shadow-xl transition-all duration-300 ${
              isGenerating ? 'scale-98 opacity-70' : 'scale-100 opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentWish.emoji}</span>
                <span className="text-xs uppercase font-bold tracking-wider text-pink-200">
                  {currentWish.categoryLabel}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold text-white">
                ✨ {currentWish.highlightWord}
              </span>
            </div>

            <p className="font-['Dancing_Script'] text-2xl sm:text-3xl md:text-4xl text-white font-medium leading-relaxed my-4 text-center sm:text-left drop-shadow-sm">
              "{currentWish.content}"
            </p>

            {/* Action Bar inside Wish Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/20">
              <span className="text-xs text-white/70 italic">
                From the bottom of my heart, only for {girlName}♡
              </span>

              <div className="flex items-center gap-2">
                {/* Favourite Button */}
                <button
                  onClick={handleToggleFavorite}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all transform active:scale-95 ${
                    isCurrentFavorited
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                  title="Save to Favorites (Admin on this PC gets notified!)"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isCurrentFavorited ? 'fill-white text-white animate-bounce' : 'text-pink-300'
                    }`}
                  />
                  <span>{isCurrentFavorited ? 'Favorited ❤️' : 'Save to Favorites'}</span>
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopyWish}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Copy wish text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generator Controls */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 pt-2">
            <p className="text-xs text-white/60">
              Unlimited generator &bull; Millions of unique poetic combinations
            </p>

            <button
              onClick={() => handleGenerateWish()}
              disabled={isGenerating}
              className="px-6 py-3 rounded-full bg-linear-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-pink-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Generate Another Wish ✨</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
