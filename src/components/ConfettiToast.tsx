import React, { useEffect, useState } from 'react';
import { Sparkles, Heart, CheckCircle, X } from 'lucide-react';
import { triggerRealisticConfetti } from '../utils/confettiFireworks';
import { birthdayAudio } from '../utils/audioSynthesizer';

export interface ConfettiToastData {
  title?: string;
  message?: string;
  senderName?: string;
}

export const ConfettiToast: React.FC = () => {
  const [toast, setToast] = useState<ConfettiToastData | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleShowToast = (e: CustomEvent<ConfettiToastData>) => {
      const data = e.detail || {};
      setToast({
        title: data.title || '🎉 Thank You for Your Heartfelt Wish!',
        message: data.message || 'Your beautiful birthday wish and love have been safely placed in Alihaaa’s constellation book.',
        senderName: data.senderName
      });
      setVisible(true);

      // Trigger celebratory confetti burst & audio chime
      try {
        triggerRealisticConfetti(['#ec4899', '#f43f5e', '#fbbf24', '#c084fc', '#38bdf8']);
        birthdayAudio.playSparkleChime();
      } catch (err) {}

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('show-confetti-toast' as any, handleShowToast);
    return () => {
      window.removeEventListener('show-confetti-toast' as any, handleShowToast);
    };
  }, []);

  if (!visible || !toast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100000] w-[92vw] max-w-md pointer-events-auto animate-bounce-in">
      <div className="relative p-4 rounded-2xl bg-gradient-to-r from-pink-950/90 via-purple-950/90 to-slate-950/90 backdrop-blur-xl border border-pink-400/40 shadow-2xl shadow-pink-500/20 text-white overflow-hidden">
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse" />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/30 text-lg">
            🎉
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 font-bold text-sm text-pink-200">
              <span>{toast.title}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-spin-slow" />
            </div>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              {toast.message}
            </p>
            {toast.senderName && (
              <div className="mt-1.5 text-[11px] font-medium text-pink-300 flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                <span>With eternal love from {toast.senderName}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
