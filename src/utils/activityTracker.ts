/**
 * Activity Tracker for Visitor & Celebration Actions
 * Stores detailed event telemetry in localStorage so the Admin can inspect
 * all interactions, wishes, and surprise views on this PC.
 */

export interface ActivityEvent {
  id: string;
  timestamp: number;
  type:
    | 'session'
    | 'wish'
    | 'candle'
    | 'cake'
    | 'cosmos'
    | 'surprise'
    | 'music'
    | 'theme'
    | 'photo'
    | 'note'
    | 'scroll'
    | 'particles'
    | 'game'
    | 'quiz';
  title: string;
  detail: string;
  badgeColor?: string;
}

const STORAGE_KEY = 'birthday_activity_logs_v1';
const MAX_LOGS = 150;

type Listener = (logs: ActivityEvent[]) => void;
const listeners: Set<Listener> = new Set();

function getStoredLogs(): ActivityEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading activity logs:', e);
  }
  return [];
}

function saveLogs(logs: ActivityEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
  } catch (e) {
    console.error('Failed saving activity logs:', e);
  }
  listeners.forEach(fn => fn(logs));
}

export const activityTracker = {
  logEvent(
    type: ActivityEvent['type'],
    title: string,
    detail: string,
    badgeColor?: string
  ) {
    const current = getStoredLogs();
    const newEvent: ActivityEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      type,
      title,
      detail,
      badgeColor: badgeColor || 'pink'
    };

    const updated = [newEvent, ...current].slice(0, MAX_LOGS);
    saveLogs(updated);
    return newEvent;
  },

  getLogs(): ActivityEvent[] {
    return getStoredLogs();
  },

  clearLogs() {
    saveLogs([]);
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getStats() {
    const logs = getStoredLogs();
    return {
      totalEvents: logs.length,
      wishesCount: logs.filter(l => l.type === 'wish').length,
      candlesBlownCount: logs.filter(l => l.type === 'candle').length,
      surpriseOpened: logs.some(l => l.type === 'surprise'),
      notesCount: logs.filter(l => l.type === 'note').length,
      photosViewed: logs.filter(l => l.type === 'photo').length,
      lastActive: logs[0] ? logs[0].timestamp : null
    };
  }
};
