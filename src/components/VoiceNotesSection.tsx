import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Trash2,
  Radio,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Music4,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  Lock,
  Unlock,
  Download,
  UploadCloud
} from 'lucide-react';
import { activityTracker } from '../utils/activityTracker';
import {
  loadPermanentVoiceNotes,
  savePermanentVoiceNotes,
  exportVoiceNotesBackup,
  importVoiceNotesBackup
} from '../utils/voiceStorage';

export interface VoiceNote {
  id: string;
  title: string;
  sender: string;
  recipient: string;
  date: string;
  durationFormatted: string;
  durationSeconds: number;
  caption: string;
  audioData: string; // Base64 or Blob URL
  createdAt: number;
  isPermanentLocked?: boolean;
  lockedAt?: number;
}

interface VoiceNotesSectionProps {
  girlName: string;
  isAdminAuthorized: boolean;
  themeColor?: string;
  cardBg?: string;
  cardBorder?: string;
}

const STORAGE_KEY = 'birthday_sh3rry_voice_notes_v3';

export const VoiceNotesSection: React.FC<VoiceNotesSectionProps> = ({
  girlName,
  isAdminAuthorized,
  themeColor = '#ec4899',
  cardBg = 'bg-white/5',
  cardBorder = 'border-white/10'
}) => {
  // Voice Notes List (Default 12 Heartfelt Voice Messages)
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading voice notes', e);
    }
    // 12 Pre-populated Heartfelt Voice Notes
    return [
      {
        id: 'voice-msg-1',
        title: `1. A Birthday Message From The Heart`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Midnight Special',
        durationFormatted: '0:52',
        durationSeconds: 52,
        caption: `My most genuine words for the most precious person in my entire life. Happy Birthday, my whole universe. 💖✨`,
        audioData: '',
        createdAt: Date.now() - 11000
      },
      {
        id: 'voice-msg-2',
        title: `2. The Day My Universe Changed`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Sacred Memory',
        durationFormatted: '1:15',
        durationSeconds: 75,
        caption: `Thinking back to the moment you stepped into my life. Everything before you felt like black & white. 🌌`,
        audioData: '',
        createdAt: Date.now() - 10000
      },
      {
        id: 'voice-msg-3',
        title: `3. Midnight Dua for Alihaaa's Long Life`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Birthday Dua',
        durationFormatted: '1:08',
        durationSeconds: 68,
        caption: `A heartfelt prayer for your health, unshakeable happiness, and freedom from every worry. 🤲✨`,
        audioData: '',
        createdAt: Date.now() - 9000
      },
      {
        id: 'voice-msg-4',
        title: `4. Your Smile Is My Favorite View`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Sweet Moments',
        durationFormatted: '0:45',
        durationSeconds: 45,
        caption: `Whenever you smile with your whole heart, my entire world lights up. Keep that smile guarded forever. 😊🌸`,
        audioData: '',
        createdAt: Date.now() - 8000
      },
      {
        id: 'voice-msg-5',
        title: `5. The Sacred Vow of Forever`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Unbreakable Promise',
        durationFormatted: '1:24',
        durationSeconds: 84,
        caption: `Through every thunderstorm, through every silent midnight, I promise to always stand by your side. 💫`,
        audioData: '',
        createdAt: Date.now() - 7000
      },
      {
        id: 'voice-msg-6',
        title: `6. A Sweet Reminder: Eat On Time!`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Cute Banter',
        durationFormatted: '0:38',
        durationSeconds: 38,
        caption: `You always forget to take care of yourself! Here is your daily gentle reminder from Sherry to eat well. 🍕🧁`,
        audioData: '',
        createdAt: Date.now() - 6000
      },
      {
        id: 'voice-msg-7',
        title: `7. When The Stars Whisper Your Name`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Cosmic Whispers',
        durationFormatted: '1:02',
        durationSeconds: 62,
        caption: `Looking up at the night sky, every shooting star carries a wish penned exclusively for you. 🌠`,
        audioData: '',
        createdAt: Date.now() - 5000
      },
      {
        id: 'voice-msg-8',
        title: `8. Ghazal Whispers for My Queen`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Poetic Voice',
        durationFormatted: '1:30',
        durationSeconds: 90,
        caption: `Urdu shayari recited straight from the soul. 'Tere chehre ki noor se roshan hai meri zindagi...' 📜🌹`,
        audioData: '',
        createdAt: Date.now() - 4000
      },
      {
        id: 'voice-msg-9',
        title: `9. My Safe Haven in Every Storm`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Heartfelt Confession',
        durationFormatted: '1:12',
        durationSeconds: 72,
        caption: `In a loud and restless world, you are the only peace my soul has ever known. Thank you for existing. 🕊️`,
        audioData: '',
        createdAt: Date.now() - 3000
      },
      {
        id: 'voice-msg-10',
        title: `10. In Love With Every Little Thing`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Pure Affection',
        durationFormatted: '0:55',
        durationSeconds: 55,
        caption: `From your cute little habits to the deep sincerity in your voice, I adore every single part of you. 💖`,
        audioData: '',
        createdAt: Date.now() - 2000
      },
      {
        id: 'voice-msg-11',
        title: `11. 3:00 AM Birthday Whispers`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Late Night Confession',
        durationFormatted: '1:18',
        durationSeconds: 78,
        caption: `The world is fast asleep, but my heart is wide awake counting all the blessings of having you. 🌙`,
        audioData: '',
        createdAt: Date.now() - 1000
      },
      {
        id: 'voice-msg-12',
        title: `12. Forever and Always, Your Sherry`,
        sender: 'SH3RRY',
        recipient: girlName || 'Alihaaa',
        date: 'Grand Finale Note',
        durationFormatted: '1:45',
        durationSeconds: 105,
        caption: `A final birthday vow: no matter how many birthdays come and go, I will love you more with every passing year. 💍👑`,
        audioData: '',
        createdAt: Date.now()
      }
    ];
  });

  // Audio Playback State
  const [activeNoteId, setActiveNoteId] = useState<string>(() => voiceNotes[0]?.id || 'default-note-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(48);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);

  // Admin & Recording Studio State
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const synthOscillatorRef = useRef<any>(null);
  const synthIntervalRef = useRef<any>(null);

  // Save to state, localStorage, and permanent IndexedDB
  const saveNotes = (updated: VoiceNote[]) => {
    setVoiceNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage quota warning - preserved in IndexedDB', e);
    }
    savePermanentVoiceNotes(updated as any);
  };

  // Hydrate permanent notes from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    loadPermanentVoiceNotes().then(storedNotes => {
      if (!isMounted) return;
      if (storedNotes && Array.isArray(storedNotes) && storedNotes.length > 0) {
        setVoiceNotes(storedNotes);
        setActiveNoteId(prev => {
          const exists = storedNotes.some(n => n.id === prev);
          return exists ? prev : storedNotes[0].id;
        });
      }
    }).catch(err => console.warn('Permanent notes load check', err));
    return () => { isMounted = false; };
  }, []);

  // Lock / Unlock toggling for individual voice note
  const handleToggleLock = (id: string) => {
    const updated = voiceNotes.map(n => {
      if (n.id === id) {
        const nextState = !n.isPermanentLocked;
        return {
          ...n,
          isPermanentLocked: nextState,
          lockedAt: nextState ? (n.lockedAt || Date.now()) : undefined
        };
      }
      return n;
    });
    saveNotes(updated);
    const target = updated.find(n => n.id === id);
    setStatusMessage(target?.isPermanentLocked ? '🔒 Voice Note locked! Safe from accidental deletion.' : '🔓 Voice Note unlocked! You can now edit or delete it.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Lock all or Unlock all voice notes
  const handleToggleLockAll = (lock: boolean) => {
    const updated = voiceNotes.map(n => ({
      ...n,
      isPermanentLocked: lock,
      lockedAt: lock ? (n.lockedAt || Date.now()) : undefined
    }));
    saveNotes(updated);
    setStatusMessage(lock ? '🔒 All voice notes locked and protected!' : '🔓 All voice notes unlocked for editing.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Backup export / import
  const handleExportBackup = () => {
    exportVoiceNotesBackup(voiceNotes as any);
    setStatusMessage('💾 Voice notes backup file downloaded successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const imported = await importVoiceNotesBackup(files[0]);
      if (imported && imported.length > 0) {
        saveNotes(imported as any);
        setActiveNoteId(imported[0].id);
        setStatusMessage(`📂 Successfully restored ${imported.length} voice notes from backup!`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      setStatusMessage('⚠️ Failed to restore backup file.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const activeNote = voiceNotes.find(n => n.id === activeNoteId) || voiceNotes[0];

  // Synthesizer ambient voice chime fallback if no raw mp3 is attached
  const playSynthesizedVoiceChime = (durationSec: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Soft romantic chords progression (Cmaj9, Am9, Fmaj7, Gsus4)
      const notes = [
        261.63, 329.63, 392.00, 493.88, // C maj
        220.00, 261.63, 329.63, 440.00, // Am
        174.61, 220.00, 261.63, 349.23, // F
        196.00, 246.94, 293.66, 392.00  // G
      ];

      let noteIdx = 0;
      synthIntervalRef.current = setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = notes[noteIdx % notes.length];
        noteIdx++;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12 * volume, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.9);
      }, 700);

      synthOscillatorRef.current = ctx;
    } catch (e) {
      console.error('Audio synth error', e);
    }
  };

  const stopSynthesizer = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (synthOscillatorRef.current) {
      try {
        synthOscillatorRef.current.close();
      } catch (e) {}
      synthOscillatorRef.current = null;
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!activeNote) return;

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthesizer();
      setIsPlaying(false);
    } else {
      if (activeNote.audioData) {
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.warn('Audio play request blocked', err);
          });
        }
      } else {
        // Play synthetic melody simulation
        playSynthesizedVoiceChime(activeNote.durationSeconds || 48);
      }
      setIsPlaying(true);
      activityTracker.logEvent('note', 'Voice Note Played 🎙️', `Listening to: ${activeNote.title}`, 'pink');
    }
  };

  // Update time for synthetic or real audio
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(t => {
          const max = activeNote?.durationSeconds || duration || 48;
          if (t >= max) {
            setIsPlaying(false);
            stopSynthesizer();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeNote?.durationSeconds, duration]);

  // Handle Seek Bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    setCurrentTime(target);
    if (audioRef.current && activeNote?.audioData) {
      audioRef.current.currentTime = target;
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ==========================================
  // ADMIN ONLY FUNCTIONS: RECORD & UPLOAD
  // ==========================================

  // 1. Microphone Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioPreviewUrl(base64data);
        };
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);

      setStatusMessage('🔴 Recording voice note... Speak from your heart!');
    } catch (err) {
      console.error('Error accessing microphone', err);
      setStatusMessage('⚠️ Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      setStatusMessage('✨ Recording finished! Review and click Save Voice Note below.');
    }
  };

  // Track Navigation (< and > arrows)
  const handleNextTrack = () => {
    const currentIndex = voiceNotes.findIndex(n => n.id === activeNoteId);
    const nextIndex = (currentIndex + 1) % voiceNotes.length;
    const nextNote = voiceNotes[nextIndex];
    if (nextNote) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthesizer();
      setActiveNoteId(nextNote.id);
      setCurrentTime(0);
      if (isPlaying) {
        setTimeout(() => {
          if (nextNote.audioData) {
            if (audioRef.current) audioRef.current.play().catch(() => {});
          } else {
            playSynthesizedVoiceChime(nextNote.durationSeconds || 48);
          }
        }, 120);
      }
      activityTracker.logEvent('note', 'Switched Voice Note ⏭️', `Next: ${nextNote.title}`, 'pink');
    }
  };

  const handlePrevTrack = () => {
    const currentIndex = voiceNotes.findIndex(n => n.id === activeNoteId);
    const prevIndex = (currentIndex - 1 + voiceNotes.length) % voiceNotes.length;
    const prevNote = voiceNotes[prevIndex];
    if (prevNote) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthesizer();
      setActiveNoteId(prevNote.id);
      setCurrentTime(0);
      if (isPlaying) {
        setTimeout(() => {
          if (prevNote.audioData) {
            if (audioRef.current) audioRef.current.play().catch(() => {});
          } else {
            playSynthesizedVoiceChime(prevNote.durationSeconds || 48);
          }
        }, 120);
      }
      activityTracker.logEvent('note', 'Switched Voice Note ⏮️', `Previous: ${prevNote.title}`, 'pink');
    }
  };

  // 2. Audio File Upload (.mp3, .wav, .m4a, .aac)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length === 1) {
      const file = files[0];
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|webm)$/i)) {
        setStatusMessage('⚠️ Please upload a valid audio file (.mp3, .wav, .m4a, .aac).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setAudioPreviewUrl(base64);
        if (!newTitle) {
          setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        setStatusMessage(`✅ Loaded audio file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    } else {
      // Multiple audio files upload (10+ tracks at once!)
      handleBatchAudioUpload(files);
    }
  };

  // Batch upload multiple tracks at once
  const handleBatchAudioUpload = async (files: FileList) => {
    setStatusMessage(`⏳ Uploading and processing ${files.length} audio files...`);
    const newNotes: VoiceNote[] = [];

    const readFileAsync = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|m4a|aac|ogg|webm)$/i)) {
        const base64 = await readFileAsync(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        newNotes.push({
          id: `voice-upload-${Date.now()}-${i}`,
          title: cleanName,
          sender: 'SH3RRY',
          recipient: girlName || 'Alihaaa',
          date: 'Uploaded Voice Note',
          durationFormatted: '1:00',
          durationSeconds: 60,
          caption: `Voice recording for ${girlName} 💖`,
          audioData: base64,
          createdAt: Date.now() + i,
          isPermanentLocked: true,
          lockedAt: Date.now()
        });
      }
    }

    if (newNotes.length > 0) {
      const combined = [...newNotes, ...voiceNotes];
      saveNotes(combined);
      setActiveNoteId(newNotes[0].id);
      setStatusMessage(`🔒 Successfully uploaded & permanently locked ${newNotes.length} voice note(s)! It cannot be changed or lost.`);
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      setStatusMessage('⚠️ No valid audio files were found in the selection.');
    }
  };

  // 3. Save Voice Note to Portal
  const handleSaveVoiceNote = () => {
    if (!audioPreviewUrl) {
      setStatusMessage('⚠️ Please record audio or upload an audio file first!');
      return;
    }

    const noteDuration = recordingSeconds > 0 ? recordingSeconds : 45;
    const newNote: VoiceNote = {
      id: `voice-note-${Date.now()}`,
      title: newTitle.trim() || `Special Voice Message for ${girlName}`,
      sender: 'SH3RRY',
      recipient: girlName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      durationFormatted: formatTime(noteDuration),
      durationSeconds: noteDuration,
      caption: newCaption.trim() || `Heartfelt voice note recorded with love for ${girlName} on her birthday. ✨`,
      audioData: audioPreviewUrl,
      createdAt: Date.now(),
      isPermanentLocked: true,
      lockedAt: Date.now()
    };

    const updated = [newNote, ...voiceNotes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
    setAudioPreviewUrl(null);
    setNewTitle('');
    setNewCaption('');
    setRecordingSeconds(0);
    setStatusMessage('🔒 Voice note permanently saved and sealed! It cannot be modified or deleted.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // 4. Delete Voice Note (checks lock state)
  const handleDeleteVoiceNote = (id: string) => {
    const targetNote = voiceNotes.find(n => n.id === id);
    if (targetNote?.isPermanentLocked) {
      setStatusMessage('🔒 This voice note is currently locked. Tap the Unlock 🔓 button next to it before deleting.');
      setTimeout(() => setStatusMessage(null), 3500);
      return;
    }

    if (voiceNotes.length <= 1) {
      setStatusMessage('⚠️ At least one voice note must remain in the collection.');
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }
    const updated = voiceNotes.filter(n => n.id !== id);
    saveNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated[0]?.id || '');
    }
    setStatusMessage('🗑️ Voice note deleted successfully.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  return (
    <section
      id="voice-notes"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      {/* Real HTML5 Audio Element for custom recordings */}
      {activeNote?.audioData && (
        <audio
          ref={audioRef}
          src={activeNote.audioData}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(Math.floor(audioRef.current.currentTime));
              if (audioRef.current.duration) {
                setDuration(Math.floor(audioRef.current.duration));
              }
            }
          }}
        />
      )}

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs sm:text-sm text-pink-200 shadow-xs">
          <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span className="font-medium tracking-wide">Spoken With Devotion by SH3RRY (Shaheer)</span>
        </div>
        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Voices of SH3RRY (Shaheer) For{' '}
          <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent italic">
            {girlName}
          </span>{' '}
          🎙️💖
        </h2>
        <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto font-light">
          Dedicated, voiced & curated with infinite devotion by <strong className="text-white font-medium">SH3RRY / SHAHEER</strong> for his Sleepy Queen {girlName}♡.
        </p>
      </div>

      {/* Main Interactive Player Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-5xl mx-auto">
        
        {/* Left / Main: The Vinyl / Modern Player Card */}
        <div className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 backdrop-blur-xl ${cardBg} border ${cardBorder} shadow-2xl space-y-6 relative overflow-hidden`}>
          
          {/* Subtle Top Badge */}
          <div className="flex items-center justify-between gap-3 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-medium text-pink-200">Exclusive Voice Recording</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-white/50" />
              <span>{activeNote?.durationFormatted || '0:48'}</span>
            </div>
          </div>

          {/* Glowing Vinyl / Sound Disc Visualizer */}
          <div className="flex flex-col items-center justify-center py-4 sm:py-6">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
              {/* Rotating Outer Ring */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-dashed border-pink-400/40 transition-transform ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '8s' }}
              />

              {/* Inner Vinyl Grooves */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-linear-to-br from-slate-900 via-black to-slate-950 border border-white/20 shadow-xl flex items-center justify-center relative shadow-pink-500/20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md flex items-center justify-center">
                    <Heart className={`w-5 h-5 text-white fill-white ${isPlaying ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Glowing Sound Pulse Rings when Playing */}
              {isPlaying && (
                <>
                  <div className="absolute inset-0 rounded-full border border-pink-400/30 animate-ping pointer-events-none" />
                  <div className="absolute -inset-4 rounded-full bg-pink-500/10 blur-xl pointer-events-none" />
                </>
              )}
            </div>

            {/* Note Title & Caption */}
            <div className="text-center mt-5 space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-white font-['Playfair_Display']">
                {activeNote?.title}
              </h3>
              <p className="text-xs sm:text-sm text-pink-200/80 italic max-w-md">
                "{activeNote?.caption}"
              </p>
              <div className="text-[11px] text-white/50 pt-1">
                Recorded by <strong className="text-white/80">SH3RRY</strong> • Dedicated to <strong className="text-pink-300">{girlName}</strong>
              </div>
            </div>
          </div>

          {/* Equalizer Waveform Animation Bars */}
          <div className="h-10 flex items-center justify-center gap-1.5 px-4 bg-black/30 rounded-2xl border border-white/10">
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [35, 65, 90, 45, 80, 55, 100, 70, 40, 85, 95, 60, 40, 75, 90, 50, 85, 65, 100, 45, 70, 55, 80, 40];
              const barHeight = isPlaying ? `${heights[i % heights.length]}%` : '20%';
              return (
                <div
                  key={i}
                  className="w-1 sm:w-1.5 rounded-full bg-linear-to-t from-pink-500 to-amber-300 transition-all duration-300"
                  style={{
                    height: barHeight,
                    animationDuration: `${0.4 + (i % 5) * 0.15}s`
                  }}
                />
              );
            })}
          </div>

          {/* Audio Scrubber & Progress */}
          <div className="space-y-1.5">
            <input
              type="range"
              min={0}
              max={activeNote?.durationSeconds || duration || 48}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-400"
              aria-label="Audio progress slider"
            />
            <div className="flex justify-between text-[11px] font-mono text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(activeNote?.durationSeconds || duration || 48)}</span>
            </div>
          </div>

          {/* Playback Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            {/* Left: Volume Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  setIsMuted(false);
                  if (audioRef.current) audioRef.current.volume = v;
                }}
                className="w-16 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-400"
                aria-label="Volume slider"
              />
            </div>

            {/* Center: Controls with Prev Track, Play/Pause, and Next Track */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Previous Track Arrow (<) */}
              <button
                onClick={handlePrevTrack}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-pink-500/30 text-white transition-all cursor-pointer hover:scale-110 active:scale-95 border border-white/15 shadow-sm"
                title="Previous Voice Note (<)"
                aria-label="Previous Voice Note"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-white/80" />
              </button>

              {/* Big Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="px-6 sm:px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                title={isPlaying ? 'Pause Voice Note' : 'Play Voice Note'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                    <span>Play Voice</span>
                  </>
                )}
              </button>

              {/* Next Track Arrow (>) */}
              <button
                onClick={handleNextTrack}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-pink-500/30 text-white transition-all cursor-pointer hover:scale-110 active:scale-95 border border-white/15 shadow-sm"
                title="Next Voice Note (>)"
                aria-label="Next Voice Note"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-white/80" />
              </button>
            </div>

            {/* Right: Loop Indicator */}
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Music4 className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Voice Note</span>
            </div>
          </div>
        </div>

        {/* Right Side: Playlist / Voice Notes Selector */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Notes Selection Header */}
          <div className={`p-5 rounded-3xl backdrop-blur-xl ${cardBg} border ${cardBorder} shadow-xl space-y-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-pink-400" />
                <span>Recorded Voice Messages</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200">
                  {voiceNotes.length} Note{voiceNotes.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setIsStudioOpen(prev => !prev)}
                  className="px-2.5 py-1 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400/40 text-[11px] text-pink-200 font-medium transition-all flex items-center gap-1 cursor-pointer"
                  title="Open Voice Studio to record or upload notes"
                >
                  <Mic className="w-3 h-3 text-pink-300" />
                  <span>{isStudioOpen ? 'Close Studio' : '+ Add Voice'}</span>
                </button>
              </div>
            </div>

            {/* Quick Action Toolbar: Lock All / Unlock All / Backup / Restore */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 pb-1 border-t border-b border-white/10 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-white/50 text-[10px]">Lock System:</span>
                <button
                  onClick={() => handleToggleLockAll(true)}
                  className="px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Lock all voice notes (Protected from deletion)"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock All</span>
                </button>
                <button
                  onClick={() => handleToggleLockAll(false)}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Unlock all voice notes (Allows deleting/editing)"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Unlock All</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportBackup}
                  className="px-2 py-0.5 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Export backup file of your voice notes to your phone/PC"
                >
                  <Download className="w-3 h-3" />
                  <span>Backup</span>
                </button>
                <label
                  className="px-2 py-0.5 rounded-md bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Restore voice notes from a backup JSON file"
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Restore</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Status Alert Banner */}
            {statusMessage && (
              <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-400/40 text-[11px] text-pink-200 flex items-center gap-1.5 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-pink-300" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Voice Notes List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {voiceNotes.map(note => {
                const isCurrent = note.id === activeNoteId;
                const isLocked = Boolean(note.isPermanentLocked);
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      if (activeNoteId !== note.id) {
                        setIsPlaying(false);
                        setCurrentTime(0);
                        setActiveNoteId(note.id);
                      }
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isCurrent
                        ? 'bg-pink-500/20 border-pink-400/50 shadow-md shadow-pink-500/10'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/60'
                      }`}>
                        {isCurrent && isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-white" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {note.title}
                          </h4>
                          {isLocked && (
                            <span title="Locked (Protected)">
                              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-white/50 block truncate">
                          {note.date} • {note.durationFormatted} • by {note.sender}
                        </span>
                      </div>
                    </div>

                    {/* Lock / Unlock Toggle & Delete button */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleLock(note.id)}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                          isLocked
                            ? 'bg-amber-500/15 border-amber-400/30 text-amber-300 hover:bg-amber-500/25'
                            : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25'
                        }`}
                        title={isLocked ? 'Locked (Safe from deletion). Click to Unlock.' : 'Unlocked. Click to Lock.'}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-300" />
                            <span className="hidden sm:inline">Locked</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-emerald-300" />
                            <span className="hidden sm:inline">Unlocked</span>
                          </>
                        )}
                      </button>

                      {/* Delete button (Active when unlocked) */}
                      {!isLocked ? (
                        <button
                          onClick={() => handleDeleteVoiceNote(note.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/30 text-rose-300 transition-colors cursor-pointer"
                          title="Delete voice note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteVoiceNote(note.id)}
                          className="p-1.5 rounded-lg bg-white/5 text-white/20 cursor-not-allowed"
                          title="Locked - Tap Unlock first to delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VOICE STUDIO (RECORDING & UPLOAD) */}
          {/* ========================================================================= */}
          {(isAdminAuthorized || isStudioOpen) ? (
            <div className="p-5 rounded-3xl bg-linear-to-b from-slate-900 via-slate-950 to-black border border-pink-500/40 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Voice Studio • SH3RRY (Shaheer)</span>
                </div>
                <button
                  onClick={() => setIsStudioOpen(false)}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-[10px] cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                <span><strong>Voice Safe Lock:</strong> Uploaded or recorded notes are saved directly into persistent IndexedDB storage so they never delete on refresh. Use the Lock/Unlock buttons anytime!</span>
              </div>

              <p className="text-[11px] text-white/70 leading-relaxed">
                Record your voice from your microphone or upload any audio file (.mp3, .m4a, .wav). It will be saved permanently so Alihaaa can listen to your voice.
              </p>

              {/* Option 1: Live Microphone Recording */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <span className="text-xs font-semibold text-white block">
                  Option 1: Live Voice Recording
                </span>
                
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-pink-600/30 transition-all cursor-pointer"
                    >
                      <Mic className="w-4 h-4 text-white" />
                      <span>Start Recording Voice</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 animate-pulse transition-all cursor-pointer"
                    >
                      <MicOff className="w-4 h-4 text-white" />
                      <span>Stop Recording ({formatTime(recordingSeconds)})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Option 2: Upload MP3 / Audio File */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <span className="text-xs font-semibold text-white block">
                  Option 2: Upload Audio File (.mp3, .m4a, .wav)
                </span>
                <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs text-white font-medium cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>Choose Voice File(s) (Select 1 or Multiple Files)</span>
                  <input
                    type="file"
                    multiple
                    accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Title & Caption for the new recording */}
              {audioPreviewUrl && (
                <div className="space-y-3 pt-1 animate-fade-in border-t border-white/10">
                  <div>
                    <label className="text-[11px] text-white/70 block mb-1">Voice Note Title</label>
                    <input
                      type="text"
                      placeholder={`e.g. My Secret Birthday Wish For ${girlName}`}
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-hidden focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-white/70 block mb-1">Sweet Message Caption</label>
                    <input
                      type="text"
                      placeholder="e.g. Words spoken straight from the heart of SH3RRY..."
                      value={newCaption}
                      onChange={e => setNewCaption(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-hidden focus:border-pink-400"
                    />
                  </div>

                  <button
                    onClick={handleSaveVoiceNote}
                    className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Lock Voice Note to Portal</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Visitor Note (when studio is closed) */
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
              <span className="text-xs font-medium text-pink-200 flex items-center justify-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                <span>Dedicated With Pure Love by SH3RRY</span>
              </span>
              <p className="text-[11px] text-white/60">
                Press play on the disc player to hear the special voice notes recorded just for Alihaaa.
              </p>
              <button
                onClick={() => setIsStudioOpen(true)}
                className="mt-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] text-pink-300 font-medium inline-flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Open Voice Studio to Record or Upload</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
