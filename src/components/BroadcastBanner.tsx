import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import { getBroadcastMessage, BroadcastMessage } from '../utils/adminAuth';

export const BroadcastBanner: React.FC = () => {
  const [broadcast, setBroadcast] = useState<BroadcastMessage>(getBroadcastMessage());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check periodically if broadcast updated
    const interval = setInterval(() => {
      setBroadcast(getBroadcastMessage());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!broadcast.active || !broadcast.text.trim() || dismissed) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white px-4 py-2 shadow-lg shadow-pink-500/20 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2 mx-auto">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{broadcast.text}</span>
          <Heart className="w-3.5 h-3.5 text-pink-200 fill-pink-200 animate-pulse inline" />
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
