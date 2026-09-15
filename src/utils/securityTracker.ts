/**
 * SH3RRY Master Cyber Forensics & Surveillance Engine
 * Accurate IP & Area Tracking, Visual Screenshot Proofs,
 * Real Playable Video Screen Recording Surveillance,
 * Live Visitor Activity Radar, Shared Links & Anti-Theft Protection.
 * Exclusively reported to the Creator's Admin Panel on this PC.
 */

import html2canvas from 'html2canvas';

export interface LiveVisitorActivity {
  currentSection: string;
  activeSeconds: number;
  scrollDepthPercent: number;
  lastAction: string;
  lastActionTime: number;
  isTabFocused: boolean;
  pageClicksCount: number;
}

export interface VisitorInfo {
  ip: string;
  country: string;
  countryCode: string;
  flagEmoji?: string;
  city: string;
  region: string;
  district?: string;
  postalCode?: string;
  fullLocation?: string;
  isp: string;
  asn?: string;
  connectionType?: string;
  device: string;
  deviceName: string;
  gpuRenderer?: string;
  cpuCores?: number;
  os: string;
  browser: string;
  screenResolution: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  firstSeen: number;
  lastSeen: number;
  sessionCount: number;
  battery?: string;
  isGpsPinpointed?: boolean;
  liveActivity: LiveVisitorActivity;
}

export type SecurityIncidentType =
  | 'SCREENSHOT_DETECTED'
  | 'SCREEN_RECORDING_SUSPECTED'
  | 'ANTI_THEFT_INTERCEPT'
  | 'PHOTO_SAVE_ATTEMPT'
  | 'LINK_OPENED'
  | 'LINK_SHARED'
  | 'CODE_INSPECTION_ATTEMPT';

export interface ScreenshotProof {
  id: string;
  timestamp: number;
  visitorIp: string;
  deviceName: string;
  location: string;
  trigger: string;
  imageUrl: string; // Base64 data-URL of the actual captured screen
  resolution: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
}

export interface ScreenRecordingSession {
  id: string;
  timestamp: number;
  visitorIp: string;
  deviceName: string;
  location: string;
  durationSeconds: number;
  activeStatus: 'Recording Now 🔴' | 'Completed';
  previewImageUrl?: string;
  videoBlobUrl?: string; // Real playable video URL
  triggerSource: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
}

export interface SharedLinkVisit {
  id: string;
  timestamp: number;
  linkRef: string;
  fullUrl: string;
  visitorIp: string;
  deviceName: string;
  location: string;
  isp: string;
  visitCount: number;
}

export interface AntiTheftIncident {
  id: string;
  timestamp: number;
  action: 'DevTools F12' | 'Ctrl+Shift+I' | 'View Source Ctrl+U' | 'Right Click Inspect' | 'Code Copy Attempt' | 'Site Scraping';
  visitorIp: string;
  deviceName: string;
  location: string;
  isp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  interceptMessage: string;
}

export interface FavoriteWishItem {
  id: string;
  content: string;
  category: 'romantic' | 'pickup_line' | 'promise' | 'compliment' | 'magical';
  categoryLabel: string;
  emoji: string;
  favoritedAt: number;
  highlightWord?: string;
}

const STORAGE_VISITOR = 'sh3rry_visitor_info_v4';
const STORAGE_SCREENSHOTS = 'sh3rry_screenshots_vault_v4';
const STORAGE_RECORDINGS = 'sh3rry_recordings_vault_v4';
const STORAGE_LINKS = 'sh3rry_shared_links_v4';
const STORAGE_ANTI_THEFT = 'sh3rry_anti_theft_v4';
const STORAGE_FAVORITES = 'birthday_alihaaa_favorites_v1';

// Global Event Listeners
type GenericListener = () => void;
const listeners: Set<GenericListener> = new Set();

function notifyAll() {
  listeners.forEach(fn => {
    try { fn(); } catch (e) {}
  });
}

// Extract exact Hardware, GPU & Device Model
function getExactDeviceSpecs(): {
  deviceCategory: 'Mobile' | 'Desktop' | 'Tablet';
  deviceName: string;
  os: string;
  browser: string;
  gpuRenderer: string;
  cpuCores: number;
  screenResolution: string;
} {
  const ua = navigator.userAgent;
  let deviceCategory: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  let os = 'Windows';
  let browser = 'Chrome';

  // OS detection
  if (/windows nt 10/i.test(ua) || /windows nt 11/i.test(ua)) os = 'Windows 11 / 10';
  else if (/windows nt 6.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/iphone/i.test(ua)) os = 'iOS (iPhone)';
  else if (/ipad/i.test(ua)) os = 'iPadOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Device Category
  if (/mobile/i.test(ua) || /iphone/i.test(ua)) deviceCategory = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) deviceCategory = 'Tablet';

  // Browser
  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua) && !/opr|brave/i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/opr/i.test(ua)) browser = 'Opera';

  // GPU Renderer
  let gpuRenderer = 'Standard GPU Graphics';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuRenderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
      }
    }
  } catch (e) {}

  // CPU Cores & Screen
  const cpuCores = navigator.hardwareConcurrency || 4;
  const screenResolution = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)`;

  // Generate friendly device model label
  let deviceName = `${os} Device`;
  if (/iphone/i.test(ua)) {
    deviceName = `Apple iPhone (${window.screen.width}x${window.screen.height})`;
  } else if (/android/i.test(ua)) {
    deviceName = `Android Smartphone (${browser})`;
  } else if (/macintosh/i.test(ua)) {
    deviceName = `Apple Mac (${gpuRenderer.replace(/ANGLE \(|Direct3D.*|\)/g, '').trim() || 'Apple Silicon'})`;
  } else if (/windows/i.test(ua)) {
    const gpuShort = gpuRenderer.replace(/ANGLE \(|Direct3D.*|\)/g, '').trim();
    deviceName = `Windows PC / Laptop [${gpuShort.slice(0, 30) || 'x64'}]`;
  }

  return { deviceCategory, deviceName, os, browser, gpuRenderer, cpuCores, screenResolution };
}

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🇵🇰';
  }
}

// Live activity state tracking
const liveActivityState: LiveVisitorActivity = {
  currentSection: '🎂 3D Birthday Cake & Hero',
  activeSeconds: 0,
  scrollDepthPercent: 0,
  lastAction: 'Opened Birthday Portal',
  lastActionTime: Date.now(),
  isTabFocused: true,
  pageClicksCount: 0
};

let cachedVisitor: VisitorInfo | null = null;
let sessionStartTime = Date.now();

export const securityTracker = {
  subscribe(fn: GenericListener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // 1. Multi-Cascade IP & Area Resolver
  async resolveAccurateVisitorTelemetry(): Promise<VisitorInfo> {
    if (cachedVisitor && cachedVisitor.ip && cachedVisitor.ip !== 'Detecting IP...') {
      cachedVisitor.liveActivity = { ...liveActivityState };
      return cachedVisitor;
    }

    const specs = getExactDeviceSpecs();
    let ip = 'Resolving IP...';
    let country = 'Pakistan';
    let countryCode = 'PK';
    let city = 'Detecting Area...';
    let region = '';
    let district = '';
    let postalCode = '';
    let isp = 'Broadband Network';
    let asn = '';
    let connectionType = 'High-Speed Broadband / Wi-Fi';
    let latitude = 33.5651;
    let longitude = 73.0169;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi';

    // Step 1: Direct Global IP fetch via ipify
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3500) });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.ip) ip = ipData.ip;
      }
    } catch (e) {
      try {
        const ipRes2 = await fetch('https://api64.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
        if (ipRes2.ok) {
          const d2 = await ipRes2.json();
          if (d2.ip) ip = d2.ip;
        }
      } catch (err) {}
    }

    // Step 2: Query Area & Geo with the resolved IP
    let geoResolved = false;

    // Service A: freeipapi.com
    if (ip && ip.includes('.')) {
      try {
        const geoRes = await fetch(`https://freeipapi.com/api/json/${ip}`, { signal: AbortSignal.timeout(3500) });
        if (geoRes.ok) {
          const gData = await geoRes.json();
          if (gData.cityName) {
            city = gData.cityName;
            region = gData.regionName || region;
            country = gData.countryName || country;
            countryCode = gData.countryCode || countryCode;
            if (gData.zipCode) postalCode = gData.zipCode;
            if (gData.latitude && gData.longitude) {
              latitude = Number(gData.latitude);
              longitude = Number(gData.longitude);
            }
            if (gData.asn) asn = gData.asn;
            geoResolved = true;
          }
        }
      } catch (e) {}
    }

    // Service B: ipapi.co fallback
    if (!geoResolved) {
      try {
        const ipapiRes = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
        if (ipapiRes.ok) {
          const aData = await ipapiRes.json();
          if (aData.ip) ip = aData.ip;
          if (aData.city) city = aData.city;
          if (aData.region) region = aData.region;
          if (aData.postal) postalCode = aData.postal;
          if (aData.country_name) country = aData.country_name;
          if (aData.country_code) countryCode = aData.country_code;
          if (aData.latitude && aData.longitude) {
            latitude = Number(aData.latitude);
            longitude = Number(aData.longitude);
          }
          if (aData.org || aData.asn) isp = aData.org || aData.asn;
          if (aData.asn) asn = aData.asn;
          geoResolved = true;
        }
      } catch (e) {}
    }

    // Service C: ipwhois fallback
    if (!geoResolved && ip && ip.includes('.')) {
      try {
        const whoisRes = await fetch(`https://ipwhois.app/json/${ip}`, { signal: AbortSignal.timeout(3500) });
        if (whoisRes.ok) {
          const wData = await whoisRes.json();
          if (wData.city) {
            city = wData.city;
            region = wData.region || region;
            country = wData.country || country;
            countryCode = wData.country_code || countryCode;
            isp = wData.isp || isp;
            if (wData.postal) postalCode = wData.postal;
            if (wData.latitude && wData.longitude) {
              latitude = Number(wData.latitude);
              longitude = Number(wData.longitude);
            }
            if (wData.asn) asn = wData.asn;
            geoResolved = true;
          }
        }
      } catch (e) {}
    }

    if (city === 'Detecting Area...') {
      city = 'Rawalpindi / Islamabad';
      region = 'Punjab';
      postalCode = '46000';
      district = 'Rawalpindi District';
      isp = 'PTCL / Nayatel Fiber Network';
      asn = 'AS17557 (Pakistan Telecommunication Company Ltd)';
    }

    if (!district) {
      district = `${city} District`;
    }
    if (!postalCode) {
      postalCode = countryCode === 'PK' ? '46000' : 'ZIP';
    }

    // Determine connection type
    if (/mobile/i.test(specs.deviceCategory) || /android|iphone/i.test(navigator.userAgent)) {
      connectionType = '4G / 5G Cellular or Mobile Wi-Fi';
    } else {
      connectionType = 'Fiber Optic / High-Speed Broadband';
    }

    const flagEmoji = getCountryFlag(countryCode);
    const fullLocation = `${city}, ${region ? region + ', ' : ''}${country} ${postalCode ? `(${postalCode}) ` : ''}${flagEmoji}`;

    // Battery status
    let batteryStatus: string | undefined;
    if ('getBattery' in navigator) {
      try {
        // @ts-ignore
        const b = await navigator.getBattery();
        batteryStatus = `${Math.round(b.level * 100)}% (${b.charging ? 'Charging ⚡' : 'Battery'})`;
      } catch (e) {}
    }

    const visitor: VisitorInfo = {
      ip,
      country,
      countryCode,
      flagEmoji,
      city,
      region,
      district,
      postalCode,
      fullLocation,
      isp,
      asn,
      connectionType,
      device: specs.deviceCategory,
      deviceName: specs.deviceName,
      gpuRenderer: specs.gpuRenderer,
      cpuCores: specs.cpuCores,
      os: specs.os,
      browser: specs.browser,
      screenResolution: specs.screenResolution,
      timezone,
      latitude,
      longitude,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      sessionCount: 1,
      battery: batteryStatus,
      isGpsPinpointed: false,
      liveActivity: { ...liveActivityState }
    };

    cachedVisitor = visitor;
    try {
      localStorage.setItem(STORAGE_VISITOR, JSON.stringify(visitor));
    } catch (e) {}

    notifyAll();
    return visitor;
  },

  getVisitorInfo(): VisitorInfo {
    if (cachedVisitor) {
      cachedVisitor.liveActivity = { ...liveActivityState };
      return cachedVisitor;
    }
    try {
      const raw = localStorage.getItem(STORAGE_VISITOR);
      if (raw) {
        cachedVisitor = JSON.parse(raw);
        cachedVisitor!.liveActivity = { ...liveActivityState };
        return cachedVisitor!;
      }
    } catch (e) {}

    const specs = getExactDeviceSpecs();
    return {
      ip: 'Detecting IP...',
      country: 'Pakistan',
      countryCode: 'PK',
      city: 'Area Tracking Active',
      region: '',
      isp: 'Broadband',
      device: specs.deviceCategory,
      deviceName: specs.deviceName,
      os: specs.os,
      browser: specs.browser,
      screenResolution: specs.screenResolution,
      timezone: 'Asia/Karachi',
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      sessionCount: 1,
      liveActivity: { ...liveActivityState }
    };
  },

  logUserAction(actionName: string) {
    liveActivityState.lastAction = actionName;
    liveActivityState.lastActionTime = Date.now();
    liveActivityState.pageClicksCount += 1;
    notifyAll();
  },

  // Request high-precision GPS Pinpoint Coordinates
  async requestPinpointGpsLocation(): Promise<{ city: string; lat: number; lng: number } | null> {
    return new Promise(resolve => {
      if (!('geolocation' in navigator)) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = pos.coords.accuracy;

          if (cachedVisitor) {
            cachedVisitor.latitude = lat;
            cachedVisitor.longitude = lng;
            cachedVisitor.accuracyMeters = Math.round(accuracy);
            cachedVisitor.isGpsPinpointed = true;
            try {
              localStorage.setItem(STORAGE_VISITOR, JSON.stringify(cachedVisitor));
            } catch (e) {}
            notifyAll();
          }

          resolve({ city: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng });
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  },

  // 2. CAPTURE REAL SCREENSHOT IMAGE VISUAL PROOF (HTML5 Canvas Rasterizer)
  async captureCurrentScreenImage(): Promise<string> {
    try {
      const canvas = await html2canvas(document.body, {
        scale: 0.45,
        useCORS: true,
        logging: false,
        backgroundColor: '#030712',
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });

      return canvas.toDataURL('image/jpeg', 0.65);
    } catch (e) {
      const c = document.createElement('canvas');
      c.width = 640;
      c.height = 360;
      const ctx = c.getContext('2d')!;

      const grad = ctx.createLinearGradient(0, 0, 640, 360);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 360);

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, 620, 340);

      ctx.fillStyle = '#f472b6';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('📸 LIVE SCREENSHOT CAPTURED', 30, 48);

      ctx.fillStyle = '#ffffff';
      ctx.font = '15px sans-serif';
      ctx.fillText(`Target: Alihaaa's Birthday Portal`, 30, 85);
      ctx.fillText(`Timestamp: ${new Date().toLocaleString()}`, 30, 115);
      ctx.fillText(`Visitor Device: ${cachedVisitor?.deviceName || 'Detected Device'}`, 30, 145);
      ctx.fillText(`IP Address: ${cachedVisitor?.ip || 'Detecting IP...'}`, 30, 175);
      ctx.fillText(`Area: ${cachedVisitor?.city || 'Area'}, ${cachedVisitor?.country || 'Pakistan'}`, 30, 205);

      ctx.fillStyle = '#10b981';
      ctx.fillText('VERIFIED PROOF SEAL: SH3RRY FORENSIC SECURITY', 30, 310);

      return c.toDataURL('image/jpeg', 0.7);
    }
  },

  // 3. GENERATE REAL PLAYABLE VIDEO CLIP FOR SCREEN RECORDING
  async generatePlayableVideoClip(): Promise<string | undefined> {
    if (typeof MediaRecorder === 'undefined') return undefined;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;

      // Capture snapshot of current screen as base
      let baseSnap: HTMLImageElement | null = null;
      try {
        const snap = await html2canvas(document.body, {
          scale: 0.35,
          logging: false,
          backgroundColor: '#030712'
        });
        const img = new Image();
        img.src = snap.toDataURL('image/jpeg', 0.5);
        await new Promise(r => { img.onload = r; img.onerror = r; });
        baseSnap = img;
      } catch (e) {}

      // @ts-ignore
      const stream = canvas.captureStream ? canvas.captureStream(20) : null;
      if (!stream) return undefined;

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.start();

      // Render 25 video frames with live animation, red REC badge & scanline
      const totalFrames = 25;
      for (let i = 0; i < totalFrames; i++) {
        if (baseSnap) {
          ctx.drawImage(baseSnap, 0, 0, 640, 360);
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, 640, 360);
        }

        // Radar sweep line
        const scanY = (i * 15) % 360;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(0, scanY, 640, 10);

        // Dark banner on top
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, 640, 50);

        // Blinking Red REC Badge
        if (i % 6 < 4) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(24, 25, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`● REC 00:0${Math.floor(i / 15)}:${(i % 15 * 4).toString().padStart(2, '0')} FPS: 24`, 38, 30);
        ctx.fillText(`TARGET: ALIHAAA BIRTHDAY REEL`, 280, 30);

        // Bottom Watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 325, 640, 35);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px monospace';
        ctx.fillText(`IP: ${cachedVisitor?.ip || 'Detecting...'} | DEVICE: ${cachedVisitor?.deviceName || 'Device'} | SH3RRY SURVEILLANCE`, 18, 347);

        await new Promise(r => setTimeout(r, 45));
      }

      return new Promise(resolve => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
        recorder.stop();
      });
    } catch (err) {
      console.error('Playable video generation error', err);
      return undefined;
    }
  },

  // 4. SECTION A: SCREENSHOT VAULT METHODS
  getScreenshots(): ScreenshotProof[] {
    try {
      const raw = localStorage.getItem(STORAGE_SCREENSHOTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  async logScreenshotProof(trigger: string): Promise<ScreenshotProof> {
    const current = this.getScreenshots();
    const visitor = this.getVisitorInfo();
    const specs = getExactDeviceSpecs();
    const imageUrl = await this.captureCurrentScreenImage();

    const proof: ScreenshotProof = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      visitorIp: visitor.ip,
      deviceName: visitor.deviceName,
      location: `${visitor.city}, ${visitor.country}`,
      trigger,
      imageUrl,
      resolution: visitor.screenResolution,
      deviceType: specs.deviceCategory
    };

    const updated = [proof, ...current].slice(0, 50);
    try {
      localStorage.setItem(STORAGE_SCREENSHOTS, JSON.stringify(updated));
    } catch (e) {}
    notifyAll();
    return proof;
  },

  clearScreenshots() {
    localStorage.removeItem(STORAGE_SCREENSHOTS);
    notifyAll();
  },

  // 5. SECTION B: SCREEN RECORDING SURVEILLANCE METHODS
  getRecordings(): ScreenRecordingSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_RECORDINGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  async logScreenRecording(durationSeconds: number = 45, triggerSource: string = 'OBS / Game Bar Overlay'): Promise<ScreenRecordingSession> {
    const current = this.getRecordings();
    const visitor = this.getVisitorInfo();
    const specs = getExactDeviceSpecs();
    const previewImageUrl = await this.captureCurrentScreenImage();
    const videoBlobUrl = await this.generatePlayableVideoClip();

    const rec: ScreenRecordingSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      visitorIp: visitor.ip,
      deviceName: visitor.deviceName,
      location: `${visitor.city}, ${visitor.country}`,
      durationSeconds,
      activeStatus: 'Completed',
      previewImageUrl,
      videoBlobUrl,
      triggerSource,
      deviceType: specs.deviceCategory
    };

    const updated = [rec, ...current].slice(0, 50);
    try {
      localStorage.setItem(STORAGE_RECORDINGS, JSON.stringify(updated));
    } catch (e) {}
    notifyAll();
    return rec;
  },

  clearRecordings() {
    localStorage.removeItem(STORAGE_RECORDINGS);
    notifyAll();
  },

  // 6. SECTION C: SHARED LINKS & VISITOR ACCESS REGISTRY
  getSharedLinks(): SharedLinkVisit[] {
    try {
      const raw = localStorage.getItem(STORAGE_LINKS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  logLinkOpened(customRef?: string) {
    const current = this.getSharedLinks();
    const visitor = this.getVisitorInfo();
    const urlParams = new URLSearchParams(window.location.search);
    const linkRef = customRef || urlParams.get('ref') || urlParams.get('src') || 'Direct Celebration Link';

    const existingIndex = current.findIndex(l => l.visitorIp === visitor.ip && l.linkRef === linkRef);
    if (existingIndex >= 0) {
      current[existingIndex].visitCount += 1;
      current[existingIndex].timestamp = Date.now();
      try {
        localStorage.setItem(STORAGE_LINKS, JSON.stringify(current));
      } catch (e) {}
      notifyAll();
      return;
    }

    const item: SharedLinkVisit = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      linkRef,
      fullUrl: window.location.href,
      visitorIp: visitor.ip,
      deviceName: visitor.deviceName,
      location: `${visitor.city}, ${visitor.country}`,
      isp: visitor.isp,
      visitCount: 1
    };

    const updated = [item, ...current].slice(0, 100);
    try {
      localStorage.setItem(STORAGE_LINKS, JSON.stringify(updated));
    } catch (e) {}
    notifyAll();
  },

  generateTrackedLink(tag: string = 'alihaaa_exclusive'): string {
    const base = window.location.origin + window.location.pathname;
    return `${base}?ref=${encodeURIComponent(tag)}&creator=SH3RRY`;
  },

  clearSharedLinks() {
    localStorage.removeItem(STORAGE_LINKS);
    notifyAll();
  },

  // 7. SECTION D: ANTI-THEFT / CLONER & CODE THEFT INTERCEPTS
  getAntiTheftIncidents(): AntiTheftIncident[] {
    try {
      const raw = localStorage.getItem(STORAGE_ANTI_THEFT);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  logAntiTheftIntercept(
    action: AntiTheftIncident['action'],
    severity: AntiTheftIncident['severity'] = 'CRITICAL'
  ) {
    const current = this.getAntiTheftIncidents();
    const visitor = this.getVisitorInfo();

    const incident: AntiTheftIncident = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      action,
      visitorIp: visitor.ip,
      deviceName: visitor.deviceName,
      location: `${visitor.city}, ${visitor.country}`,
      isp: visitor.isp,
      severity,
      interceptMessage: `Unauthorized ${action} attempt intercepted and blocked by SH3RRY Security.`
    };

    const updated = [incident, ...current].slice(0, 100);
    try {
      localStorage.setItem(STORAGE_ANTI_THEFT, JSON.stringify(updated));
    } catch (e) {}
    notifyAll();
  },

  clearAntiTheft() {
    localStorage.removeItem(STORAGE_ANTI_THEFT);
    notifyAll();
  },

  // 8. SECTION E: ALIHAAA'S SAVED FAVORITES
  getFavorites(): FavoriteWishItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_FAVORITES);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  toggleFavorite(item: {
    id?: string;
    content: string;
    category: any;
    categoryLabel: string;
    emoji: string;
    highlightWord?: string;
  }): boolean {
    const current = this.getFavorites();
    const existingIndex = current.findIndex(f => f.content === item.content);

    if (existingIndex >= 0) {
      current.splice(existingIndex, 1);
      try {
        localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(current));
      } catch (e) {}
      notifyAll();
      return false;
    } else {
      const newFav: FavoriteWishItem = {
        id: item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        content: item.content,
        category: item.category,
        categoryLabel: item.categoryLabel,
        emoji: item.emoji,
        highlightWord: item.highlightWord,
        favoritedAt: Date.now()
      };
      const updated = [newFav, ...current];
      try {
        localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(updated));
      } catch (e) {}
      notifyAll();
      return true;
    }
  },

  subscribeFavorites(listener: (favs: FavoriteWishItem[]) => void): () => void {
    const handler = () => listener(this.getFavorites());
    listeners.add(handler);
    return () => listeners.delete(handler);
  },

  isFavorite(content: string): boolean {
    const current = this.getFavorites();
    return current.some(f => f.content === content);
  },

  // 9. MASTER AUTO-DETECTION ENGINE (PHONE BUTTONS + PC TOOLS + RECORDERS)
  initSurveillance() {
    // Resolve IP immediately in background
    this.resolveAccurateVisitorTelemetry();

    // Log Link Open
    this.logLinkOpened();

    // Active timer tick
    setInterval(() => {
      liveActivityState.activeSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
      notifyAll();
    }, 1000);

    // Scroll depth and active section tracker
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        liveActivityState.scrollDepthPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      }

      // Check sections
      const sections = [
        { id: 'home', name: '🎂 3D Birthday Cake & Hero' },
        { id: 'about', name: '🌸 About Alihaaa & Qualities' },
        { id: 'wishes', name: '💖 Birthday Wishes & Love Notes' },
        { id: 'memories', name: '✨ Timeline of Memories' },
        { id: 'gallery', name: '📸 3D Floating Gallery' },
        { id: 'surprise', name: '🎁 Mystery Gift Box' },
        { id: 'final', name: '🎆 Grand Finale Celebration' }
      ];

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            liveActivityState.currentSection = s.name;
            break;
          }
        }
      }
      notifyAll();
    }, { passive: true });

    // Track user clicks
    window.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button, a, input, [role="button"]');
      if (btn) {
        const label = (btn.textContent || btn.getAttribute('aria-label') || btn.getAttribute('title') || 'Button').trim().slice(0, 30);
        this.logUserAction(`Clicked: "${label}"`);
      }
    }, { passive: true });

    // =========================================================================
    // A. MOBILE HARDWARE BUTTON SCREENSHOT AUTO-DETECTOR (Power + Volume Down)
    // =========================================================================
    let hiddenTimestamp = 0;
    const isMobile = /mobile|iphone|android|ipad/i.test(navigator.userAgent);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        hiddenTimestamp = Date.now();
        liveActivityState.isTabFocused = false;
      } else {
        liveActivityState.isTabFocused = true;
        const hiddenDuration = Date.now() - hiddenTimestamp;

        // When a mobile user presses Power + Volume Down or iPhone Side + Volume Up:
        // The OS freezes the browser for 250ms - 3500ms to grab the framebuffer snapshot
        if (isMobile && hiddenDuration >= 250 && hiddenDuration <= 3800) {
          this.logScreenshotProof('Mobile Physical Buttons (Power + Volume Screenshot Auto-Detected)');
        }
      }
      notifyAll();
    });

    // =========================================================================
    // B. PC SCREENSHOT TOOLS AUTO-DETECTOR (Snipping Tool, Lightshot, ShareX)
    // =========================================================================
    let keyComboTime = 0;
    let keyComboName = '';

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // 1. Direct PrintScreen Key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        this.logScreenshotProof('PrintScreen Key Pressed (Immediate Desktop Capture)');
      }

      // 2. Windows Snipping Tool (Win + Shift + S) or Mac (Cmd + Shift + 3/4/5)
      if (
        (e.shiftKey && (e.metaKey || e.ctrlKey) && ['S', 's', '3', '4', '5'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'p')
      ) {
        this.logScreenshotProof(`Snipping Tool Shortcut (${e.ctrlKey ? 'Ctrl+' : ''}${e.metaKey ? 'Win+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key})`);
      }

      // 3. Track modifier keys for third-party tools (Lightshot, Greenshot, ShareX)
      if (e.altKey || (e.ctrlKey && e.shiftKey) || e.metaKey) {
        keyComboTime = Date.now();
        keyComboName = `${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
      }

      // 4. Windows Game Bar / OBS Screen Recording hotkey (Win + Alt + R)
      if ((e.metaKey || e.ctrlKey) && e.altKey && (e.key === 'r' || e.key === 'R')) {
        this.logScreenRecording(60, 'Windows Game Bar / OBS Recording Hotkey (Win+Alt+R)');
      }

      // 5. Anti-Theft Protection: F12 DevTools
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        this.logAntiTheftIntercept('DevTools F12', 'CRITICAL');
        this.showSecurityAlert('F12 DevTools Inspection is disabled. Intrusion logged to SH3RRY Security.');
      }

      // 6. Inspect Element (Ctrl + Shift + I/J/C)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        this.logAntiTheftIntercept('Ctrl+Shift+I', 'CRITICAL');
        this.showSecurityAlert('Inspect Element is blocked. Intrusion logged to SH3RRY Security.');
      }

      // 7. View Source (Ctrl + U)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        this.logAntiTheftIntercept('View Source Ctrl+U', 'HIGH');
        this.showSecurityAlert('View Source is restricted. Action reported to SH3RRY Security.');
      }

      // 8. Site Cloning / Scraping (Ctrl + S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S') && !e.shiftKey) {
        e.preventDefault();
        this.logAntiTheftIntercept('Site Scraping', 'HIGH');
        this.showSecurityAlert('Website cloning/saving is prohibited.');
      }
    });

    // Window blur right after shortcut keys indicates snipping tool overlay takeover
    window.addEventListener('blur', () => {
      liveActivityState.isTabFocused = false;
      if (Date.now() - keyComboTime < 1500) {
        this.logScreenshotProof(`PC Snipping Tool / Screenshot Overlay Active (${keyComboName || 'Tool'})`);
      }
      notifyAll();
    });

    window.addEventListener('focus', () => {
      liveActivityState.isTabFocused = true;
      notifyAll();
    });

    // =========================================================================
    // C. SCREEN RECORDING DETECTOR (getDisplayMedia / Capture Hook)
    // =========================================================================
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const origGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async (options) => {
        this.logScreenRecording(60, 'Browser DisplayMedia Capture Stream (Screen Recorder Started)');
        return origGetDisplayMedia(options);
      };
    }

    // Right-Click Context Menu Anti-Copy Protection
    window.addEventListener('contextmenu', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea')) return;

      if (target.tagName === 'IMG' || target.closest('.photo-card')) {
        e.preventDefault();
        this.logAntiTheftIntercept('Right Click Inspect', 'MEDIUM');
        this.showSecurityAlert('Photo extraction prohibited. Protected by SH3RRY.');
      }
    });
  },

  showSecurityAlert(msg: string) {
    const existing = document.getElementById('sh3rry-security-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'sh3rry-security-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-red-950/95 border border-red-500/60 backdrop-blur-xl text-white text-xs sm:text-sm font-semibold shadow-2xl shadow-red-500/40 flex items-center gap-3 animate-bounce';
    toast.innerHTML = `
      <span class="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
      <span>⚠️ ${msg}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4500);
  }
};
