/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BirthdayData, ThemeId } from './types/birthday';
import { DEFAULT_BIRTHDAY_DATA, THEMES } from './data/birthdayData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CakeSection } from './components/CakeSection';
import { AboutHer } from './components/AboutHer';
import { WishesSection } from './components/WishesSection';
import { MemoriesSection } from './components/MemoriesSection';
import { GallerySection } from './components/GallerySection';
import { SurpriseSection } from './components/SurpriseSection';
import { FinalCelebration } from './components/FinalCelebration';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { MusicPlayerModal } from './components/MusicPlayerModal';
import { PersonalizeModal } from './components/PersonalizeModal';
import { WishModal } from './components/WishModal';
import { CustomCursor } from './components/CustomCursor';
import { FloatingHomeButton } from './components/FloatingHomeButton';
import { ParticleBackground } from './components/ParticleBackground';
import { ScrollMilestonePopups } from './components/ScrollMilestonePopups';
import { BroadcastBanner } from './components/BroadcastBanner';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminUnlockModal } from './components/AdminUnlockModal';
import { MoveableGalaxyBackground } from './components/MoveableGalaxyBackground';
import { MeteorShowerOverlay } from './components/MeteorShowerOverlay';
import { CosmicRainOverlay } from './components/CosmicRainOverlay';
import { CelestialShapeFireworks } from './components/CelestialShapeFireworks';
import { ConfettiToast } from './components/ConfettiToast';
import { VoiceNotesSection } from './components/VoiceNotesSection';
import { FunActivitiesSection } from './components/FunActivitiesSection';
import { MobileBottomNav } from './components/MobileBottomNav';
import { birthdayAudio } from './utils/audioSynthesizer';
import { isDeviceAuthorized } from './utils/adminAuth';
import { securityTracker } from './utils/securityTracker';

export default function App() {
  // 1. Data state with localStorage persistence
  const [data, setData] = useState<BirthdayData>(() => {
    try {
      const saved = localStorage.getItem('birthday_custom_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const safeProfilePhoto = (parsed.profilePhoto && !parsed.profilePhoto.includes('mypic')) 
          ? parsed.profilePhoto 
          : DEFAULT_BIRTHDAY_DATA.profilePhoto;
        return {
          ...DEFAULT_BIRTHDAY_DATA,
          ...parsed,
          profilePhoto: safeProfilePhoto,
          memories: DEFAULT_BIRTHDAY_DATA.memories,
          gallery: DEFAULT_BIRTHDAY_DATA.gallery
        };
      }
    } catch (e) {
      console.error('Failed reading custom birthday data from storage', e);
    }
    return DEFAULT_BIRTHDAY_DATA;
  });

  // 2. Active Theme state with localStorage persistence
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('birthday_theme') as ThemeId;
      if (saved && THEMES[saved]) {
        return saved;
      }
    } catch (e) {
      console.error('Failed reading theme from storage', e);
    }
    return 'pink-dream';
  });

  // 3. Navigation active section tracking & Website visibility (Default TRUE so everyone can see public website immediately)
  const [activeSection, setActiveSection] = useState('home');
  const [isWebsiteVisible, setIsWebsiteVisible] = useState<boolean>(true);
  const [homeAnimKey, setHomeAnimKey] = useState<number>(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(() => birthdayAudio.getIsPlaying());

  const handleToggleMusic = () => {
    const isPlaying = birthdayAudio.getIsPlaying();
    if (isPlaying) {
      birthdayAudio.stopBgm();
      setIsPlayingMusic(false);
    } else {
      birthdayAudio.startBgm();
      setIsPlayingMusic(true);
    }
  };

  const handleMobileNavClick = (sectionId: string) => {
    setIsWebsiteVisible(true);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // 4. Modal Visibility states
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);

  // 5. Admin Panel & Security states (exclusive to this PC)
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(() => isDeviceAuthorized());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminUnlockOpen, setIsAdminUnlockOpen] = useState(false);

  // Active theme object
  const activeThemeConfig = THEMES[currentTheme] || THEMES['pink-dream'];

  // Handle saving new custom data
  const handleSaveData = (newData: BirthdayData) => {
    setData(newData);
    try {
      localStorage.setItem('birthday_custom_data', JSON.stringify(newData));
    } catch (e) {
      console.error('Failed saving to storage', e);
    }
  };

  // Handle switching theme
  const handleSelectTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem('birthday_theme', themeId);
    } catch (e) {
      console.error('Failed saving theme to storage', e);
    }
  };

  // Initialize real-time security, screenshot detection, and visitor IP telemetry
  useEffect(() => {
    securityTracker.initSurveillance();
  }, []);

  // Scroll spy to update active navbar section
  useEffect(() => {
    const sections = ['home', 'cake', 'about', 'wishes', 'memories', 'gallery', 'activities', 'surprise'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Owner secret shortcut: Ctrl+Shift+Alt+A to open unlock modal on any new device
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminUnlockOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`min-h-screen w-full relative font-['Outfit'] text-white selection:bg-pink-500 selection:text-white transition-colors duration-700 bg-gradient-to-b ${activeThemeConfig.bgGradient}`}
    >
      {/* 3D Moveable Galaxy & Nebula Background (Rotatable like the 3D Cake with On/Off controls) */}
      <MoveableGalaxyBackground />

      {/* High-Frequency Cosmic Meteor Shower Overlay with 10-15s Cooldown */}
      <MeteorShowerOverlay themeColor={activeThemeConfig.primaryColor} />

      {/* Live Admin Broadcast Announcement Banner */}
      <BroadcastBanner />

      {/* Interactive Background Particle Engine (only active when website is visible so blank solar cosmos is pure) */}
      {isWebsiteVisible && <ParticleBackground />}

      {/* Desktop Custom Trailing Cursor */}
      <CustomCursor />

      {/* Scroll Down Milestone Popups System (active when full website is displayed) */}
      {isWebsiteVisible && <ScrollMilestonePopups girlName={data.girlName} />}

      {/* Header & Sticky Navigation */}
      <Navbar
        girlName={data.girlName}
        activeSection={activeSection}
        currentTheme={currentTheme}
        isAdminAuthorized={isAdminAuthorized}
        isWebsiteVisible={isWebsiteVisible}
        onShowWebsite={(sectionId) => {
          setIsWebsiteVisible(true);
          if (!sectionId || sectionId === 'home') {
            setHomeAnimKey(k => k + 1);
          }
          if (sectionId) setActiveSection(sectionId);
        }}
        onShowBlankCosmic={() => {
          setIsWebsiteVisible(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenThemeModal={() => {
          setIsWebsiteVisible(true);
          setIsThemeModalOpen(true);
        }}
        onOpenPersonalizeModal={() => {
          setIsWebsiteVisible(true);
          setIsPersonalizeModalOpen(true);
        }}
        onOpenMusicModal={() => {
          setIsWebsiteVisible(true);
          setIsMusicModalOpen(true);
        }}
        onOpenAdminModal={() => {
          setIsWebsiteVisible(true);
          setIsAdminPanelOpen(true);
        }}
        onOpenAdminUnlock={() => {
          setIsWebsiteVisible(true);
          setIsAdminUnlockOpen(true);
        }}
      />

      {/* FULL WEBSITE SECTIONS (When Home, logo, or any navigation button is clicked) */}
      {isWebsiteVisible && (
        <main className="relative z-10 w-full overflow-x-hidden animate-fade-in">
          {/* 1. Hero Section */}
          <Hero
            data={data}
            themeColor={activeThemeConfig.primaryColor}
            onOpenWishModal={() => setIsWishModalOpen(true)}
            animKey={homeAnimKey}
          />

          {/* 2. Dedicated 3D Birthday Cake Ceremony Section */}
          <CakeSection
            data={data}
            themeColor={activeThemeConfig.primaryColor}
            onOpenWishModal={() => setIsWishModalOpen(true)}
            cardBg={activeThemeConfig.cardBg}
            cardBorder={activeThemeConfig.cardBorder}
          />

          {/* 3. About Her Section */}
          <AboutHer
            data={data}
            cardBg={activeThemeConfig.cardBg}
            cardBorder={activeThemeConfig.cardBorder}
          />

          {/* 4. Birthday Wishes Section with Infinite Favorites Bar */}
          <WishesSection
            wishes={data.wishes}
            hiddenWishes={data.hiddenWishes}
          />

          {/* 5. Memories Timeline Section */}
          <MemoriesSection memories={data.memories} />

          {/* 6. 3D Floating Gallery Section */}
          <GallerySection gallery={data.gallery} />

          {/* Voice Notes Section - Dedicated Audio Player for Visitors & Upload/Record Tools for Admin Only */}
          <VoiceNotesSection
            girlName={data.girlName}
            isAdminAuthorized={isAdminAuthorized}
            themeColor={activeThemeConfig.primaryColor}
            cardBg={activeThemeConfig.cardBg}
            cardBorder={activeThemeConfig.cardBorder}
          />

          {/* Interactive Birthday Games, Couple Quizzes & Fun Arcade */}
          <FunActivitiesSection
            girlName={data.girlName}
            themeColor={activeThemeConfig.primaryColor}
            cardBg={activeThemeConfig.cardBg}
            cardBorder={activeThemeConfig.cardBorder}
          />

          {/* 7. Mystery Surprise Gift Box Section */}
          <SurpriseSection data={data} />

          {/* 8. Final Grand Celebration & Guestbook */}
          <FinalCelebration data={data} />
        </main>
      )}

      {/* Floating Home Button (when full website is open) */}
      {isWebsiteVisible && <FloatingHomeButton />}

      {/* Mobile Main Navigation Bar (Requested by user: elegant responsive bottom dock) */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavClick={handleMobileNavClick}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
      />

      {/* Modals */}
      <ThemeSwitcher
        currentTheme={currentTheme}
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onSelectTheme={handleSelectTheme}
      />

      <MusicPlayerModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
      />

      <PersonalizeModal
        data={data}
        isOpen={isPersonalizeModalOpen}
        onClose={() => setIsPersonalizeModalOpen(false)}
        onSave={handleSaveData}
      />

      <WishModal
        girlName={data.girlName}
        isOpen={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
      />

      {/* Admin Panel Modal (PC Exclusive with Live Activity Tracker & Lag Controls) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        data={data}
        onSaveData={handleSaveData}
        onRevokeAdmin={() => setIsAdminAuthorized(false)}
      />

      {/* Admin Unlock Modal (for entering master passcode on this PC) */}
      <AdminUnlockModal
        isOpen={isAdminUnlockOpen}
        onClose={() => setIsAdminUnlockOpen(false)}
        onSuccess={() => {
          setIsAdminAuthorized(true);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Cosmic Rain Romantic Ambient Overlay */}
      <CosmicRainOverlay />

      {/* Celestial Custom Shape Fireworks (Bursting HBD Alihaaa, Hearts, Crowns) */}
      <CelestialShapeFireworks />

      {/* Confetti Toast for Wish Submission */}
      <ConfettiToast />
    </div>
  );
}
