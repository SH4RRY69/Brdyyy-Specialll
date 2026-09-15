/**
 * Admin Authentication & Device Locking
 * Ensures the Admin Panel and visitor logs are exclusively visible
 * and accessible only on this designated PC/browser.
 */

const AUTH_KEY = 'birthday_admin_pc_authorized';
const DEVICE_ID_KEY = 'birthday_admin_device_id';
const BROADCAST_KEY = 'birthday_admin_broadcast';
const PERFORMANCE_KEY = 'birthday_performance_mode';

// Master Passcodes accepted to activate Admin access on this PC/device
const VALID_PASSCODES = ['alihaaa', 'alihaaa2026', 'admin786', '12345', 'shaheer', 'sherry'];

export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `PC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/**
 * Checks URL query params for secret owner key (e.g. ?admin=shaheer or ?admin=alihaaa)
 * Allows the creator to unlock admin on their personal phone/PC instantly via secret link.
 */
export function checkSecretUrlAuthorization(): boolean {
  try {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get('admin') || params.get('auth') || params.get('secret');
      if (adminParam && VALID_PASSCODES.includes(adminParam.trim().toLowerCase())) {
        localStorage.setItem(AUTH_KEY, 'true');
        getOrCreateDeviceId();
        // Remove secret query param from address bar so it remains private
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
        return true;
      }
    }
  } catch (e) {
    console.error('Error checking URL secret auth', e);
  }
  return false;
}

export function isDeviceAuthorized(): boolean {
  try {
    // 1. Check if activated via secret URL parameter on this visit
    if (checkSecretUrlAuthorization()) {
      return true;
    }
    // 2. Only return true if this specific device has been explicitly authorized
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function authorizeDevice(passcode: string): boolean {
  const clean = passcode.trim().toLowerCase();
  if (VALID_PASSCODES.includes(clean)) {
    localStorage.setItem(AUTH_KEY, 'true');
    getOrCreateDeviceId();
    return true;
  }
  return false;
}

export function revokeDeviceAuthorization(): void {
  localStorage.removeItem(AUTH_KEY);
}

// Secret broadcast message from admin to display across the site
export interface BroadcastMessage {
  active: boolean;
  text: string;
  sender?: string;
  type?: 'banner' | 'popup';
  timestamp?: number;
}

export function getBroadcastMessage(): BroadcastMessage {
  try {
    const raw = localStorage.getItem(BROADCAST_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    active: false,
    text: '',
    sender: 'Admin',
    type: 'banner'
  };
}

export function saveBroadcastMessage(msg: BroadcastMessage): void {
  localStorage.setItem(BROADCAST_KEY, JSON.stringify(msg));
}

// Performance mode configuration (Lag Reducer)
export interface PerformanceConfig {
  lagReducerActive: boolean;
  capPixelRatio: boolean;
  pauseWhenScrolled: boolean;
  disableShadows: boolean;
  reducedParticles: boolean;
}

const DEFAULT_PERF: PerformanceConfig = {
  lagReducerActive: true, // Default ON to prevent lag immediately!
  capPixelRatio: true,
  pauseWhenScrolled: true,
  disableShadows: false,
  reducedParticles: false
};

export function getPerformanceConfig(): PerformanceConfig {
  try {
    const raw = localStorage.getItem(PERFORMANCE_KEY);
    if (raw) return { ...DEFAULT_PERF, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PERF;
}

export function savePerformanceConfig(config: PerformanceConfig): void {
  localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(config));
}
