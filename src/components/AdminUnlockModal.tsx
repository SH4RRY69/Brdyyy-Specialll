import React, { useState } from 'react';
import { Shield, Lock, X, Check, Key } from 'lucide-react';
import { authorizeDevice } from '../utils/adminAuth';
import { birthdayAudio } from '../utils/audioSynthesizer';

interface AdminUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminUnlockModal: React.FC<AdminUnlockModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authorizeDevice(passcode)) {
      birthdayAudio.playSparkleChime();
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
      birthdayAudio.playBlowOutSound();
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-slate-950 border border-pink-500/30 p-6 shadow-2xl relative space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pink-500/20 border border-pink-400/40 text-pink-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-white">
              Authorize Admin on this PC
            </h3>
            <p className="text-xs text-white/60">
              Enter master key to unlock exclusive admin access on this device
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-white/70 block">Master Admin Key / Passcode</label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter secret master key"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder-white/40 focus:border-pink-400 focus:outline-hidden"
              />
              <Key className="w-4 h-4 text-white/40 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-white/40 pt-1">
              Private access reserved exclusively for the website creator.
            </p>
          </div>

          {error && (
            <div className="text-xs text-rose-400 font-medium animate-wiggle">
              Incorrect passcode. Please try again.
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 text-xs text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-xs font-semibold text-white shadow-md shadow-pink-500/30 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
