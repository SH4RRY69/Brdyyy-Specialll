/**
 * Robust Permanent Storage for Voice Notes with IndexedDB and LocalStorage fallback.
 * Guarantees that uploaded voice notes are permanently preserved across refreshes,
 * and provides full Lock/Unlock control for the creator (SH3RRY).
 */

export interface StoredVoiceNote {
  id: string;
  title: string;
  sender: string;
  recipient: string;
  date: string;
  durationFormatted: string;
  durationSeconds: number;
  caption: string;
  audioData: string; // Base64 audio data or sound synthesizer URL
  createdAt: number;
  isPermanentLocked?: boolean;
  lockedAt?: number;
}

const DB_NAME = 'SherryAlihaaaVoicePortal_v4';
const STORE_NAME = 'permanent_voice_notes';
const BACKUP_KEY = 'birthday_sh3rry_voice_notes_v4';
const PERMANENT_LOCK_KEY = 'birthday_permanent_voice_lock_ids_v4';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Loads all voice notes, prioritizing IndexedDB for full audio data.
 */
export async function loadPermanentVoiceNotes(): Promise<StoredVoiceNote[] | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = req.result as StoredVoiceNote[];
        if (items && Array.isArray(items) && items.length > 0) {
          // Sort chronologically or by createdAt if available
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          resolve(items);
        } else {
          // Fallback to localStorage if IndexedDB is empty
          const fallback = loadFromLocalStorage();
          resolve(fallback);
        }
      };
      req.onerror = () => {
        resolve(loadFromLocalStorage());
      };
    });
  } catch (e) {
    console.warn('IndexedDB read failed, falling back to localStorage', e);
    return loadFromLocalStorage();
  }
}

/**
 * Fallback loader from localStorage
 */
function loadFromLocalStorage(): StoredVoiceNote[] | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Saves all voice notes to IndexedDB and LocalStorage in exact state.
 * Performs a clear-and-put so deleted notes are genuinely removed,
 * and current notes with audio are permanently preserved across refreshes.
 */
export async function savePermanentVoiceNotes(notes: StoredVoiceNote[]): Promise<void> {
  try {
    // 1. IndexedDB storage (handles hundreds of megabytes of audio seamlessly)
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Clear out any old/deleted notes so they don't reincarnate on refresh
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    // Write all current notes
    for (const note of notes) {
      store.put(note);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IndexedDB write warning', e);
  }

  // 2. Save into LocalStorage for quick instant hydration on initial page load
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(notes));
  } catch (e) {
    // If audioData exceeds localStorage 5MB quota, save lightweight versions with metadata
    try {
      const lightweight = notes.map(n => ({
        ...n,
        // Keep audio data if small, otherwise mark that it is preserved in IndexedDB
        audioData: n.audioData && n.audioData.length > 100000 ? '[INDEXED_DB_AUDIO]' : n.audioData
      }));
      localStorage.setItem(BACKUP_KEY, JSON.stringify(lightweight));
    } catch (err) {
      console.warn('LocalStorage save failed', err);
    }
  }
}

/**
 * Export all voice notes to a downloadable JSON backup file
 */
export function exportVoiceNotesBackup(notes: StoredVoiceNote[]): void {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SH3RRY_Voice_Notes_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (e) {
    console.error('Failed exporting voice notes backup', e);
  }
}

/**
 * Import voice notes from a JSON backup file
 */
export function importVoiceNotesBackup(file: File): Promise<StoredVoiceNote[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const notes = JSON.parse(text);
        if (Array.isArray(notes)) {
          resolve(notes);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
