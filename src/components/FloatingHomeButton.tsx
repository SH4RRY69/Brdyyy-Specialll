import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

export const FloatingHomeButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-5 z-40 p-3 sm:p-3.5 rounded-full bg-slate-950/80 hover:bg-pink-600 text-white border border-pink-400/50 shadow-xl shadow-pink-500/20 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 group"
      title="Scroll back to Home"
      aria-label="Scroll back to Home"
    >
      <ArrowUp className="w-5 h-5 text-pink-300 group-hover:text-white transition-colors" />
      <span className="sr-only">Back to Top</span>
    </button>
  );
};
