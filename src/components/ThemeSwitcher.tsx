import React, { useState } from 'react';
import { X, Check, Palette, Sparkles, MousePointer2 } from 'lucide-react';
import { ThemeId, ThemeConfig } from '../types/birthday';
import { THEMES } from '../data/birthdayData';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { CursorThemeId, CURSOR_THEMES, CURSOR_STORAGE_KEY } from '../types/cursor';

interface ThemeSwitcherProps {
  currentTheme: ThemeId;
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  isOpen,
  onClose,
  onSelectTheme
}) => {
  const [tab, setTab] = useState<'themes' | 'cursors'>('themes');
  const [activeCursor, setActiveCursor] = useState<CursorThemeId>(() => {
    return (localStorage.getItem(CURSOR_STORAGE_KEY) as CursorThemeId) || 'tiara';
  });

  if (!isOpen) return null;

  const handleSelectCursor = (id: CursorThemeId) => {
    setActiveCursor(id);
    localStorage.setItem(CURSOR_STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent('cursor-theme-change', { detail: id }));
    birthdayAudio.playSparkleChime();
  };

  const themeList = Object.values(THEMES);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl p-5 sm:p-6 bg-slate-950/95 border border-white/20 shadow-2xl space-y-4 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              {tab === 'themes' ? <Palette className="w-4 h-4" /> : <MousePointer2 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-white">
                Appearance & Atmosphere
              </h3>
              <p className="text-[11px] text-white/60">
                Customize colors, moods, and cute interactive cursors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 shrink-0">
          <button
            onClick={() => setTab('themes')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'themes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Atmospheric Themes ({themeList.length})</span>
          </button>

          <button
            onClick={() => setTab('cursors')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'cursors'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            <span>Cute Cursors ({CURSOR_THEMES.length})</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-3">
          {tab === 'themes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themeList.map((theme: ThemeConfig) => {
                const isSelected = currentTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      birthdayAudio.playSparkleChime();
                      onSelectTheme(theme.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-24 group overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 bg-white/15 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Color swatches preview bar */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xl">{theme.icon}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </div>
                    </div>

                    {/* Theme Title & Checkmark */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {theme.name}
                        </div>
                        <div className="text-[10px] text-white/50 capitalize">
                          {theme.id.replace('-', ' ')}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-md text-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'cursors' && (
            <div className="space-y-2">
              <p className="text-[11px] text-white/70">
                Pick a cute cursor theme with lively custom particle trails following your mouse:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CURSOR_THEMES.map(cur => {
                  const isSelected = activeCursor === cur.id;
                  return (
                    <button
                      key={cur.id}
                      type="button"
                      onClick={() => handleSelectCursor(cur.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500/20 border-pink-400 shadow-md shadow-pink-500/20 ring-1 ring-pink-400'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl transition-transform group-hover:scale-125">
                          {cur.emoji}
                        </span>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        ) : (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cur.accentColor }}
                          />
                        )}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{cur.name}</div>
                      <div className="text-[9px] text-white/50 line-clamp-1">{cur.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="pt-2 border-t border-white/10 text-center text-[11px] text-white/50 flex items-center justify-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Selections are auto-saved to your browser profile</span>
        </div>
      </div>
    </div>
  );
};
