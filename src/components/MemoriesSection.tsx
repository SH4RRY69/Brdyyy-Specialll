import React, { useState } from 'react';
import { Camera, Calendar, Sparkles, Heart } from 'lucide-react';
import { MemoryItem } from '../types/birthday';

interface MemoriesSectionProps {
  memories: MemoryItem[];
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ memories }) => {
  const [activeMemory, setActiveMemory] = useState<string | null>(null);

  return (
    <section id="memories" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      {/* Background lights */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-300 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-pink-400" />
            <span>Cherished Timeline</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Beautiful Memories <span className="text-pink-400">✨📸</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 font-light">
            Frames frozen in time that remind us of laughter, quiet looks, and adventures shared.
          </p>
        </div>

        {/* Timeline structure (responsive: centered on md+, left-aligned line on mobile) */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-pink-400/40 to-transparent pointer-events-none" />

          <div className="space-y-12 sm:space-y-16">
            {memories.map((memory, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={memory.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                  onMouseEnter={() => setActiveMemory(memory.id)}
                  onMouseLeave={() => setActiveMemory(null)}
                >
                  {/* Timeline Center Node Pin */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-pink-400 flex items-center justify-center shadow-lg shadow-pink-500/30 z-20">
                    <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                  </div>

                  {/* Spacer for other column */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card Content (Offset for line on mobile) */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                    <div className="group rounded-3xl p-4 sm:p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-pink-500/25 hover:border-pink-300/40 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                      {/* Photo */}
                      <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden mb-4 bg-black/40">
                        <img
                          src={memory.image}
                          alt={memory.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Tag Pill */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-pink-300">
                          {memory.tag}
                        </div>

                        {/* Date overlay */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white/90">
                          <Calendar className="w-3 h-3 text-pink-400" />
                          <span>{memory.date}</span>
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="space-y-2">
                        <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-white group-hover:text-pink-200 transition-colors">
                          {memory.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
                          {memory.description}
                        </p>
                        <div className="pt-2 flex items-center gap-1.5 text-xs italic text-pink-300 font-['Dancing_Script'] text-base">
                          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/50" />
                          <span>"{memory.caption}"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
