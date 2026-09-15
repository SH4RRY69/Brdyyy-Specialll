import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, Menu, X, Music, Palette, User, Volume2, VolumeX, Shield, Lock } from 'lucide-react';
import { ThemeId } from '../types/birthday';
import { birthdayAudio } from '../utils/audioSynthesizer';

interface NavbarProps {
  girlName: string;
  activeSection: string;
  currentTheme: ThemeId;
  isAdminAuthorized: boolean;
  isWebsiteVisible: boolean;
  onShowWebsite: (sectionId?: string) => void;
  onShowBlankCosmic: () => void;
  onOpenThemeModal: () => void;
  onOpenPersonalizeModal: () => void;
  onOpenMusicModal: () => void;
  onOpenAdminModal: () => void;
  onOpenAdminUnlock: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  girlName,
  activeSection,
  isAdminAuthorized,
  isWebsiteVisible,
  onShowWebsite,
  onShowBlankCosmic,
  onOpenThemeModal,
  onOpenPersonalizeModal,
  onOpenMusicModal,
  onOpenAdminModal,
  onOpenAdminUnlock
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(birthdayAudio.getIsPlaying());

  // Secret click trigger to unlock admin on this PC
  const logoClickRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  const handleLogoSecretClick = () => {
    const now = Date.now();
    if (now - logoClickRef.current.lastTime > 2500) {
      logoClickRef.current.count = 1;
    } else {
      logoClickRef.current.count += 1;
    }
    logoClickRef.current.lastTime = now;

    if (logoClickRef.current.count >= 4) {
      logoClickRef.current.count = 0;
      if (isAdminAuthorized) {
        onOpenAdminModal();
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = birthdayAudio.subscribe(() => {
      setIsPlayingMusic(birthdayAudio.getIsPlaying());
    });
    return unsubscribe;
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'cake', label: 'Cake' },
    { id: 'about', label: 'About' },
    { id: 'wishes', label: 'Wishes' },
    { id: 'memories', label: 'Memories' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'surprise', label: 'Surprise' }
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    birthdayAudio.playSparkleChime();

    // Any button from the main bar shows the full website and scrolls to that section
    onShowWebsite(id);
    setTimeout(() => {
      scrollTo(id);
    }, 60);
  };

  const handleLogoClick = () => {
    birthdayAudio.playSparkleChime();
    handleLogoSecretClick();

    if (!isWebsiteVisible) {
      // In blank solar view: clicking logo reveals full website
      onShowWebsite('home');
      scrollTo('home');
    } else {
      // In full website: clicking logo smoothly toggles back to blank solar cosmic view
      onShowBlankCosmic();
    }
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleMusic = () => {
    birthdayAudio.togglePlay();
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-lg py-2.5 sm:py-3'
          : 'bg-transparent py-3 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo - Connected to toggle between Blank Solar Cosmos & Full Website */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 group text-left focus:outline-hidden select-none cursor-pointer"
          aria-label="Toggle between Blank Solar Cosmos and Full Website"
          title={isWebsiteVisible ? "Click logo for pristine Blank Solar Cosmos View 🪐" : "Click logo to open full website 💖"}
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-linear-to-tr from-pink-500 via-rose-400 to-amber-300 p-0.5 shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full rounded-[14px] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
              <span className="font-['Playfair_Display'] font-black text-xs sm:text-sm tracking-wider bg-linear-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                A<span className="text-pink-400 text-[10px] mx-0.5">✦</span>S
              </span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Playfair_Display'] text-base sm:text-lg font-bold tracking-wide text-white group-hover:text-pink-200 transition-colors">
                {girlName}
              </span>
              <span className="text-[10px] text-pink-300 font-sans px-1.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/30">
                SH3RRY's Universe ✦
              </span>
            </div>
            <span className="text-[10px] text-white/55 block font-sans tracking-wide">
              Dedicated by <strong className="text-pink-300 font-semibold">SH3RRY (Shaheer)</strong> • Endless Love
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-inner">
          {navLinks.map(link => {
            const isActive = isWebsiteVisible && activeSection === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/20 shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-pink-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Quick Controls (Theme, Music, Personalize, Admin on this PC, Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Tools Button (ONLY VISIBLE ON AUTHORIZED PC) */}
          {isAdminAuthorized && (
            <button
              onClick={onOpenAdminModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/30 animate-pulse"
              title="Admin Master Control (Authorized on this PC)"
            >
              <Shield className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Admin Tools</span>
            </button>
          )}

          {/* Quick Music Button with mini animated equalizer */}
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isPlayingMusic
                ? 'bg-pink-500/25 border-pink-400/50 text-pink-200 shadow-sm shadow-pink-500/30'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/15 hover:text-white'
            }`}
            title={isPlayingMusic ? 'Pause Music' : 'Play Music'}
            aria-label="Toggle birthday music"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <div className="hidden sm:flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.6s_infinite_ease-in-out]" />
                  <span className="w-0.5 bg-pink-300 rounded-full animate-[bounce_0.8s_infinite_ease-in-out_0.2s]" />
                  <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.5s_infinite_ease-in-out_0.4s]" />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Music</span>
              </>
            )}
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={onOpenThemeModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
            title="Switch Theme"
            aria-label="Change color theme"
          >
            <Palette className="w-4 h-4 text-purple-300" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* Personalize Button */}
          <button
            onClick={onOpenPersonalizeModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 border border-pink-400/30 text-pink-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
            title="Personalize Name & Details"
            aria-label="Customize birthday data"
          >
            <User className="w-4 h-4 text-pink-400" />
            <span className="hidden md:inline">Edit Details</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl bg-white/10 text-white/90 border border-white/10 hover:bg-white/20 transition-all"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 bg-black/90 backdrop-blur-2xl border-b border-white/15 shadow-2xl animate-fade-in space-y-2 mt-2">
          {isAdminAuthorized && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-semibold flex items-center justify-center gap-2 mb-2"
            >
              <Shield className="w-4 h-4 text-emerald-300" />
              <span>Admin Master Panel (This PC)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map(link => {
              const isActive = isWebsiteVisible && activeSection === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-pink-500/25 text-white border border-pink-400/40 font-semibold'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMusicModal();
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/90 font-medium flex items-center justify-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5 text-pink-400" />
              Music Options
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenThemeModal();
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/90 font-medium flex items-center justify-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5 text-purple-300" />
              Themes
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
