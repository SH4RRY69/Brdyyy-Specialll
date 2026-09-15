import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Search,
  Copy,
  Check,
  Trash2,
  X,
  ExternalLink,
  RefreshCw,
  Bookmark,
  Share2,
  ShieldAlert
} from 'lucide-react';
import { securityTracker, FavoriteWishItem } from '../utils/securityTracker';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { triggerHeartShower } from '../utils/confettiFireworks';
import { generateInfiniteWish } from '../data/unlimitedWishesData';

interface FavoriteWishesBarModalProps {
  girlName?: string;
  onNavigateToWishes?: () => void;
}

export const FavoriteWishesBarModal: React.FC<FavoriteWishesBarModalProps> = ({
  girlName = 'Alihaaa',
  onNavigateToWishes
}) => {
  const [favorites, setFavorites] = useState<FavoriteWishItem[]>(() => securityTracker.getFavorites());
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Sync favorites in real-time
  useEffect(() => {
    const unsub = securityTracker.subscribeFavorites(updated => {
      setFavorites([...updated]);
    });
    return unsub;
  }, []);

  const handleToggleFav = (wish: FavoriteWishItem) => {
    birthdayAudio.playSparkleChime();
    securityTracker.toggleFavorite(wish);
  };

  const handleCopyWish = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    birthdayAudio.playSparkleChime();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateAndSaveNew = () => {
    setIsAddingNew(true);
    birthdayAudio.playSparkleChime();
    triggerHeartShower();

    const randomWish = generateInfiniteWish();
    securityTracker.toggleFavorite({
      id: randomWish.id,
      content: randomWish.content,
      category: randomWish.category,
      categoryLabel: randomWish.categoryLabel,
      emoji: randomWish.emoji,
      highlightWord: randomWish.highlightWord
    });

    setTimeout(() => setIsAddingNew(false), 300);
  };

  const filteredFavorites = favorites.filter(f => {
    const matchesSearch = searchQuery.trim() === '' ||
      f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.categoryLabel && f.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <>
      {/* 1. HORIZONTAL INTERACTIVE FAVORITES BAR */}
      <div className="w-full max-w-4xl mx-auto my-6 px-4">
        <div
          onClick={() => {
            birthdayAudio.playSparkleChime();
            setIsOpen(true);
          }}
          className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-full p-3 sm:py-3.5 sm:px-6 bg-gradient-to-r from-pink-950/80 via-purple-950/70 to-slate-950/90 border border-pink-400/40 hover:border-pink-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99] flex flex-col sm:flex-row items-center justify-between gap-3"
          title="Click to expand full favorites popup"
        >
          {/* Subtle animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Left: Badge & Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner shadow-pink-500/30">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-200 transition-colors">
                  {girlName}'s Infinite Favorite Wishes
                </span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/40 text-[10px] sm:text-xs font-mono font-semibold text-pink-300">
                  {favorites.length} Saved
                </span>
              </div>
              <p className="text-[11px] text-white/60 truncate max-w-xs sm:max-w-md">
                {favorites.length > 0
                  ? `Latest: "${favorites[0].content}"`
                  : 'Tap to open popup & save unlimited romantic wishes & pickup lines'}
              </p>
            </div>
          </div>

          {/* Right: Action Callout Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-semibold text-pink-300 group-hover:text-pink-200 flex items-center gap-1">
              <span>Open Full Popup</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
            <div className="px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-500/40 group-hover:bg-pink-400 transition-colors">
              View All
            </div>
          </div>
        </div>
      </div>

      {/* 2. FULL POPUP SYSTEM MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950 border border-pink-500/40 shadow-2xl shadow-pink-500/30 overflow-hidden text-white">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 bg-linear-to-r from-pink-950/70 via-slate-900 to-purple-950/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-400/50 flex items-center justify-center shadow-md">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-['Playfair_Display'] text-white flex items-center gap-2">
                    <span>{girlName}'s Favorite Wishes Vault</span>
                    <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/40 text-pink-300 font-mono font-semibold">
                      {favorites.length} Saved
                    </span>
                  </h3>
                  <p className="text-xs text-white/60">
                    Saved forever & synced in real-time with Sherry's Admin Telemetry 🔐
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateAndSaveNew}
                  disabled={isAddingNew}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-200 text-xs font-semibold transition-all active:scale-95"
                  title="Generate and favorite a new romantic wish immediately"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ Add Wish</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Close popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 bg-slate-900/80 border-b border-white/10 space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search saved wishes, pickup lines, promises..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-hidden focus:border-pink-400"
                  />
                </div>
                <button
                  onClick={handleGenerateAndSaveNew}
                  className="sm:hidden flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-pink-500 text-white text-xs font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ Quick Add New Wish</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'All Saved' },
                  { id: 'romantic', label: '💖 Romantic' },
                  { id: 'pickup_line', label: '😉 Pickup Lines' },
                  { id: 'promise', label: '💍 Promises' },
                  { id: 'compliment', label: '🌹 Compliments' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                      categoryFilter === cat.id
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishes Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {favorites.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4">
                  <Heart className="w-12 h-12 text-pink-400/30 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-white">No Favorite Wishes Saved Yet</h4>
                    <p className="text-xs text-white/60 max-w-md mx-auto">
                      Tap the heart button on any wish or pickup line, or click the button below to add your first favorite!
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateAndSaveNew}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-xs shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate & Save Wish Now</span>
                  </button>
                </div>
              ) : filteredFavorites.length === 0 ? (
                <div className="p-8 text-center text-xs text-white/50">
                  No saved wishes match your search "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredFavorites.map((fav, idx) => (
                    <div
                      key={fav.id || fav.content}
                      style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-pink-500/30 hover:border-pink-400/60 backdrop-blur-md transition-all duration-300 space-y-3 text-xs flex flex-col justify-between group animate-in fade-in zoom-in-95 slide-in-from-bottom-2 fill-mode-both"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-[10px] font-semibold flex items-center gap-1">
                          <span>{fav.emoji || '💖'}</span>
                          <span>{fav.categoryLabel || 'Favorite'}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white/40 font-mono">
                            {fav.favoritedAt ? new Date(fav.favoritedAt).toLocaleDateString() : 'Today'}
                          </span>
                          <button
                            onClick={() => handleToggleFav(fav)}
                            title="Remove from favorites"
                            className="p-1 rounded-md text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-pink-100 font-['Dancing_Script'] text-xl leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/5">
                        "{fav.content}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-white/60">
                        {fav.highlightWord ? (
                          <span className="text-pink-300 font-mono text-[10px]">
                            #{fav.highlightWord}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Logged in Admin
                          </span>
                        )}

                        <button
                          onClick={() => handleCopyWish(fav.content, fav.id || fav.content)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-pink-500/30 hover:text-pink-200 text-white/80 transition-colors"
                        >
                          {copiedId === (fav.id || fav.content) ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                <span>Every favorite automatically syncs to Sherry's Telemetry Radar</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = favorites.map((f, i) => `${i + 1}. [${f.categoryLabel || 'Wish'}] "${f.content}"`).join('\n\n');
                    navigator.clipboard.writeText(text);
                    birthdayAudio.playSparkleChime();
                    setCopiedId('all');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  disabled={favorites.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-30"
                >
                  {copiedId === 'all' ? 'Copied All to Clipboard!' : 'Copy All Favorites'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
