import React, { useState } from 'react';
import { X, Save, RotateCcw, User, Heart, Sparkles, Image, Check, Compass } from 'lucide-react';
import { BirthdayData } from '../types/birthday';
import { DEFAULT_BIRTHDAY_DATA } from '../data/birthdayData';
import { birthdayAudio } from '../utils/audioSynthesizer';

interface PersonalizeModalProps {
  data: BirthdayData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: BirthdayData) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  data,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<BirthdayData>({ ...data });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof BirthdayData, val: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleNestedChange = (parent: 'favoriteThings', child: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: val
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    birthdayAudio.playSparkleChime();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all values to default template?')) {
      setFormData({ ...DEFAULT_BIRTHDAY_DATA });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950/95 border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-white">
                Personalize Birthday Details
              </h3>
              <p className="text-xs text-white/60">
                Easily change the special girl's name, date, and messages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>Primary Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-white/70">Her Name</label>
                <input
                  type="text"
                  value={formData.girlName}
                  onChange={e => handleChange('girlName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Nickname / Sweet Name</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={e => handleChange('nickname', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Birthday Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={formData.birthdayDate}
                  onChange={e => handleChange('birthdayDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Profile Photo URL</label>
                <input
                  type="url"
                  value={formData.profilePhoto}
                  onChange={e => handleChange('profilePhoto', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden"
                  required
                />
              </div>
            </div>
          </div>

          {/* Hero Subtitle & Intro */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hero & Intro Messages</span>
            </h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-white/70">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={e => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Short Intro Quote</label>
                <input
                  type="text"
                  value={formData.aboutIntro}
                  onChange={e => handleChange('aboutIntro', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Personality Description</label>
                <textarea
                  rows={2}
                  value={formData.personalityDescription}
                  onChange={e => handleChange('personalityDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>

          {/* Favorite Things */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300">
              Favorite Things
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/70">Favorite Flower</label>
                <input
                  type="text"
                  value={formData.favoriteThings.flower}
                  onChange={e => handleNestedChange('favoriteThings', 'flower', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-pink-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Favorite Dessert</label>
                <input
                  type="text"
                  value={formData.favoriteThings.dessert}
                  onChange={e => handleNestedChange('favoriteThings', 'dessert', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-pink-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Music Vibe</label>
                <input
                  type="text"
                  value={formData.favoriteThings.musicGenre}
                  onChange={e => handleNestedChange('favoriteThings', 'musicGenre', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-pink-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70">Dream Place</label>
                <input
                  type="text"
                  value={formData.favoriteThings.place}
                  onChange={e => handleNestedChange('favoriteThings', 'place', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:border-pink-400 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Note regarding Cursors and Sun/Stars */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-sm shrink-0">
              🪐
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Cute Cursors & Sun/Stars Settings</span>
              <span className="text-[11px] text-white/60">
                Custom mouse cursors, Sun diameter, glowing corona, and star brightness are now all managed inside the 3D Solar System HUD!
              </span>
            </div>
          </div>

          {/* Surprise Letter */}
          <div className="space-y-2">
            <label className="text-xs text-white/70 block">
              Surprise Box Secret Letter
            </label>
            <textarea
              rows={3}
              value={formData.surpriseLetter}
              onChange={e => handleChange('surpriseLetter', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:border-pink-400 focus:outline-hidden resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/30 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
