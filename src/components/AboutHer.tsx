import React, { useState } from 'react';
import { Heart, Sparkles, Calendar, Clock, Star, Gift, Compass, Music, Bookmark } from 'lucide-react';
import { BirthdayData } from '../types/birthday';

interface AboutHerProps {
  data: BirthdayData;
  cardBg?: string;
  cardBorder?: string;
}

export const AboutHer: React.FC<AboutHerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'qualities' | 'favorites' | 'hobbies' | 'cuteFacts'>('qualities');

  // Calculate age / days countdown safely, handling playful custom date strings like "2011-09-48"
  let bday = new Date(data.birthdayDate);
  let isCustomOrPlayfulDate = false;
  if (isNaN(bday.getTime())) {
    // If not a standard ISO date, fallback safely so it never throws NaN or crashes
    bday = new Date('2001-09-18');
    isCustomOrPlayfulDate = true;
  }
  const today = new Date();
  const nextBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (today.getTime() > nextBday.getTime() + 86400000) {
    nextBday.setFullYear(today.getFullYear() + 1);
  }
  const diffTime = Math.abs(nextBday.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Formatted date string
  const formattedDate = isCustomOrPlayfulDate
    ? (data.birthdayDate || 'September 18')
    : bday.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      {/* Decorative background light */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-300 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span>Profile & Dedication</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Dedicated by <strong className="text-pink-300 font-semibold">SH3RRY (Shaheer)</strong></span>
            </div>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            A Little About Her <span className="text-pink-400">💖</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 font-light">
            Curated with endless admiration by <strong className="text-white font-medium">SH3RRY (Shaheer)</strong> for Alihaaa♡. Every layer of her heart, her passions, and what makes her truly irreplaceable.
          </p>
        </div>

        {/* Main Grid: Photo Card (Left) & Narrative Dossier (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: 3D Animated Floating Photo Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="group relative w-full max-w-sm rounded-3xl p-4 sm:p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 hover:shadow-pink-500/20 hover:scale-[1.02] overflow-hidden">
              {/* Corner Glow Accents */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-pink-500/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-amber-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />

              {/* Photo Frame */}
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden border border-white/20 shadow-inner">
                <img
                  src={data.profilePhoto}
                  alt={data.girlName}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Floating Heart Sticker on Image */}
                <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>

                {/* Name Overlay inside photo */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-medium tracking-widest text-pink-300 uppercase">
                    Birthday Star
                  </span>
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white drop-shadow-md">
                    {data.girlName}
                  </h3>
                  <p className="text-xs text-white/80 italic">"{data.nickname}"</p>
                </div>
              </div>

              {/* Quick Info Badges Below Photo */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center gap-1 text-pink-300 text-xs mb-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-medium">Date</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{formattedDate}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center gap-1 text-amber-300 text-xs mb-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">Countdown</span>
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {diffDays === 0 ? 'Today! 🎂' : `${diffDays} days away`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Interactive Information Tabs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Personality Summary Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-semibold uppercase tracking-wider">
                <Star className="w-4 h-4 fill-pink-400 text-pink-400" />
                <span>The Essence of Her</span>
              </div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light">
                {data.personalityDescription}
              </p>
            </div>

            {/* Interactive Detail Tabs */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
              {/* Tab Navigation Buttons */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
                <button
                  onClick={() => setActiveTab('qualities')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'qualities'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Special Qualities
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'favorites'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Favorite Things
                </button>
                <button
                  onClick={() => setActiveTab('hobbies')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'hobbies'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Hobbies
                </button>
                <button
                  onClick={() => setActiveTab('cuteFacts')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'cuteFacts'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Cute Facts 🐾
                </button>
              </div>

              {/* Tab Content Panels */}
              {activeTab === 'qualities' && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                  {data.specialQualities.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs sm:text-sm text-white/90"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'favorites' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm animate-fade-in">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/50 text-[11px] block">Favorite Colors</span>
                    <span className="font-semibold text-white">{data.favoriteThings.color}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/50 text-[11px] block">Favorite Flowers</span>
                    <span className="font-semibold text-white">{data.favoriteThings.flower}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/50 text-[11px] block">Favorite Dessert</span>
                    <span className="font-semibold text-white">{data.favoriteThings.dessert}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/50 text-[11px] block">Music Vibe</span>
                    <span className="font-semibold text-white">{data.favoriteThings.musicGenre}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/50 text-[11px] block">Cozy Season</span>
                    <span className="font-semibold text-white">{data.favoriteThings.season}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/50 text-[11px] block">Dream Sanctuary</span>
                    <span className="font-semibold text-white">{data.favoriteThings.place}</span>
                  </div>
                </div>
              )}

              {activeTab === 'hobbies' && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                  {data.hobbies.map((hobby, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs sm:text-sm text-white/90"
                    >
                      <Bookmark className="w-4 h-4 text-pink-400 shrink-0" />
                      <span>{hobby}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'cuteFacts' && (
                <ul className="space-y-2.5 animate-fade-in">
                  {data.cuteFacts.map((fact, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs sm:text-sm text-white/90"
                    >
                      <span className="text-base shrink-0">🌸</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Personalized Letter Preview */}
            <div className="p-6 sm:p-7 rounded-3xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-white/20 backdrop-blur-md">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Personalized Note</span>
              </div>
              <p className="font-['Dancing_Script'] text-lg sm:text-xl text-white/95 leading-relaxed whitespace-pre-line">
                {data.personalizedLetter}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
