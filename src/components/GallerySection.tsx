import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types/birthday';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(gallery.map(item => item.category)))];

  const filteredItems =
    activeCategory === 'All'
      ? gallery
      : gallery.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
      {/* Glow background effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-300 uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>Visual Journey</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            3D Gallery <span className="text-pink-400">🖼️✨</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 font-light">
            An artistic mosaic capturing radiant smiles, candid grace, and timeless moments.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Floating Asymmetric Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/25 hover:-translate-y-2 hover:scale-[1.01]"
              style={{
                perspective: '1000px'
              }}
            >
              {/* Image Container with 3D Zoom on Hover */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-black/30">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Corner Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-pink-300 uppercase tracking-wider">
                  {item.category}
                </div>

                {/* Click Expand Icon */}
                <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                  <Maximize2 className="w-4 h-4 text-amber-300" />
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-4 inset-x-4 space-y-1 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/80 font-light line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Animated Lightbox Popup */}
      {selectedImageIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all transform hover:scale-110"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all transform hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all transform hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[88vh] flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-white/5 border border-white/20 p-2 shadow-2xl"
          >
            <div className="relative w-full max-h-[70vh] flex items-center justify-center rounded-2xl overflow-hidden bg-black/60">
              <img
                src={filteredItems[selectedImageIndex].image}
                alt={filteredItems[selectedImageIndex].title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl animate-scale-up"
              />
            </div>

            <div className="w-full pt-4 pb-2 px-4 text-center space-y-1">
              <div className="text-[11px] font-semibold text-pink-400 uppercase tracking-widest">
                {filteredItems[selectedImageIndex].category} &bull; {selectedImageIndex + 1} of{' '}
                {filteredItems.length}
              </div>
              <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-white">
                {filteredItems[selectedImageIndex].title}
              </h3>
              <p className="text-sm text-white/80 max-w-xl mx-auto font-light">
                {filteredItems[selectedImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
