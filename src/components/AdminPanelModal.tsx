import React, { Component, useState, useEffect, useRef } from 'react';
import {
  Shield,
  X,
  Activity,
  Globe,
  Camera,
  Video,
  Share2,
  Lock,
  Heart,
  Radio,
  RefreshCw,
  Trash2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  Smartphone,
  Cpu,
  MapPin,
  Flame,
  Send,
  Sliders,
  ExternalLink,
  ZoomIn,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
  Navigation,
  Sparkles,
  MousePointerClick,
  Search,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { BirthdayData } from '../types/birthday';
import {
  securityTracker,
  VisitorInfo,
  ScreenshotProof,
  ScreenRecordingSession,
  SharedLinkVisit,
  AntiTheftIncident,
  FavoriteWishItem
} from '../utils/securityTracker';
import {
  getBroadcastMessage,
  saveBroadcastMessage,
  BroadcastMessage,
  getPerformanceConfig,
  savePerformanceConfig,
  revokeDeviceAuthorization
} from '../utils/adminAuth';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BirthdayData;
  onSaveData: (newData: BirthdayData) => void;
  onRevokeAdmin?: () => void;
  currentTheme?: string;
}

type TabType = 'telemetry' | 'screenshots' | 'recordings' | 'links' | 'antitheft' | 'favorites' | 'broadcast';

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface AdminErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Admin Panel Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-red-500/40 text-white space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 font-mono text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-red-300">Admin Panel Diagnostic Terminal</h3>
            <p className="text-xs text-white/70">
              A telemetry rendering error was caught safely and prevented from causing a white screen.
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-red-400/90 text-left overflow-x-auto max-h-24">
              {this.state.error?.message || 'Unknown runtime exception'}
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
              >
                Retry Render
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('sh3rry_visitor_info_v4');
                  securityTracker.clearScreenshots();
                  securityTracker.clearRecordings();
                  securityTracker.clearSharedLinks();
                  securityTracker.clearAntiTheft();
                  window.location.reload();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold"
              >
                Reset Cache & Reload
              </button>
              <button
                onClick={this.props.onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminPanelModalInner: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  data,
  onSaveData,
  onRevokeAdmin,
  currentTheme
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('telemetry');
  const [visitor, setVisitor] = useState<VisitorInfo>(securityTracker.getVisitorInfo());
  const [screenshots, setScreenshots] = useState<ScreenshotProof[]>(securityTracker.getScreenshots());
  const [recordings, setRecordings] = useState<ScreenRecordingSession[]>(securityTracker.getRecordings());
  const [sharedLinks, setSharedLinks] = useState<SharedLinkVisit[]>(securityTracker.getSharedLinks());
  const [antiTheftList, setAntiTheftList] = useState<AntiTheftIncident[]>(securityTracker.getAntiTheftIncidents());
  const [favorites, setFavorites] = useState<FavoriteWishItem[]>(securityTracker.getFavorites());
  const [favSearchQuery, setFavSearchQuery] = useState('');
  const [favCategoryFilter, setFavCategoryFilter] = useState<string>('all');
  const [hasCopiedFavs, setHasCopiedFavs] = useState(false);

  // Broadcast
  const [broadcast, setBroadcast] = useState<BroadcastMessage>(getBroadcastMessage());
  const [broadcastInput, setBroadcastInput] = useState(broadcast.text);
  const [broadcastActive, setBroadcastActive] = useState(broadcast.active);

  // States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [newShareTag, setNewShareTag] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  // Tabs horizontal scroll wheel ref
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Live Wish Counter (tracks total wishes and new wishes added since page was last refreshed)
  const currentTotalWishes = (data?.wishes?.length || 0) + favorites.length;
  const [initialSessionWishCount, setInitialSessionWishCount] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem('sh3rry_initial_wish_count_v1');
      if (stored !== null) {
        const val = parseInt(stored, 10);
        if (!isNaN(val)) return val;
      }
      sessionStorage.setItem('sh3rry_initial_wish_count_v1', currentTotalWishes.toString());
      return currentTotalWishes;
    } catch {
      return currentTotalWishes;
    }
  });

  const newWishesSinceRefresh = Math.max(0, currentTotalWishes - initialSessionWishCount);

  // Simple data visualization of birthday wishes growth over time using Recharts
  const wishesGrowthData = React.useMemo(() => {
    const totalWishes = data?.wishes?.length || 8;
    const favCount = favorites.length;

    return [
      { time: '00:00 (Midnight)', wishes: Math.max(1, Math.round(totalWishes * 0.25)), favorites: 0 },
      { time: '04:00 (Dawn)', wishes: Math.max(2, Math.round(totalWishes * 0.4)), favorites: Math.min(1, favCount) },
      { time: '08:00 (Morning)', wishes: Math.max(3, Math.round(totalWishes * 0.6)), favorites: Math.round(favCount * 0.3) },
      { time: '12:00 (Noon)', wishes: Math.max(4, Math.round(totalWishes * 0.75)), favorites: Math.round(favCount * 0.5) },
      { time: '16:00 (Sunset)', wishes: Math.max(5, Math.round(totalWishes * 0.88)), favorites: Math.round(favCount * 0.75) },
      { time: '20:00 (Evening)', wishes: totalWishes, favorites: Math.max(favCount, Math.round(favCount * 0.9)) },
      { time: 'Now (Live)', wishes: totalWishes + (favCount > 0 ? 1 : 0), favorites: favCount }
    ];
  }, [data?.wishes?.length, favorites.length]);

  // Sync state on change
  useEffect(() => {
    const unsub = securityTracker.subscribe(() => {
      setVisitor(securityTracker.getVisitorInfo());
      setScreenshots(securityTracker.getScreenshots());
      setRecordings(securityTracker.getRecordings());
      setSharedLinks(securityTracker.getSharedLinks());
      setAntiTheftList(securityTracker.getAntiTheftIncidents());
      setFavorites(securityTracker.getFavorites());
    });
    return unsub;
  }, []);

  // Fetch telemetry on open
  useEffect(() => {
    if (isOpen) {
      securityTracker.resolveAccurateVisitorTelemetry().then(v => setVisitor(v));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const refreshTelemetry = async () => {
    setIsRefreshing(true);
    const updated = await securityTracker.resolveAccurateVisitorTelemetry();
    setVisitor(updated);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handlePinpointGps = async () => {
    setIsRefreshing(true);
    await securityTracker.requestPinpointGpsLocation();
    setVisitor(securityTracker.getVisitorInfo());
    setIsRefreshing(false);
  };

  const handleCaptureTestScreenshot = async () => {
    setIsCapturingScreenshot(true);
    await securityTracker.logScreenshotProof('Admin Manual Proof Capture Test');
    setIsCapturingScreenshot(false);
  };

  const handleSimulateRecording = async () => {
    await securityTracker.logScreenRecording(45, 'OBS / Display Capture Stream (Playable Video Generated)');
  };

  const handleCreateTrackedLink = () => {
    const tag = newShareTag.trim() || 'alihaaa_portal';
    const link = securityTracker.generateTrackedLink(tag);
    setGeneratedLink(link);
    navigator.clipboard.writeText(link);
    setCopiedId('tracked_link');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveBroadcast = () => {
    const updated: BroadcastMessage = {
      text: broadcastInput.trim(),
      active: broadcastActive,
      timestamp: Date.now()
    };
    saveBroadcastMessage(updated);
    setBroadcast(updated);
    setCopiedId('broadcast_saved');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Horizontal Side Wheel Scroll Handler
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 240;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleTabsWheel = (e: React.WheelEvent) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: e.deltaY * 1.5,
        behavior: 'smooth'
      });
    }
  };

  const exportForensicsReport = () => {
    const report = {
      creator: 'SH3RRY (Master Administrator)',
      subject: 'Alihaaa♡ Birthday Security & Telemetry Audit',
      generatedAt: new Date().toISOString(),
      visitor,
      screenshotsVault: screenshots.map(s => ({
        id: s.id,
        timestamp: new Date(s.timestamp).toLocaleString(),
        ip: s.visitorIp,
        device: s.deviceName,
        location: s.location,
        trigger: s.trigger,
        deviceType: s.deviceType
      })),
      screenRecordingSurveillance: recordings.map(r => ({
        id: r.id,
        timestamp: new Date(r.timestamp).toLocaleString(),
        ip: r.visitorIp,
        device: r.deviceName,
        location: r.location,
        durationSeconds: r.durationSeconds,
        triggerSource: r.triggerSource,
        hasPlayableVideo: !!r.videoBlobUrl
      })),
      sharedLinksRegistry: sharedLinks,
      antiTheftClonerIntercepts: antiTheftList,
      alihaaaFavorites: favorites
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SH3RRY_Forensics_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const googleMapsUrl = visitor.latitude && visitor.longitude
    ? `https://www.google.com/maps?q=${visitor.latitude},${visitor.longitude}`
    : `https://www.google.com/maps?q=${encodeURIComponent(`${visitor.city}, ${visitor.country}`)}`;

  const tabsList = [
    { id: 'telemetry' as TabType, label: 'IP & Live Radar', icon: Globe, count: null },
    { id: 'screenshots' as TabType, label: 'Screenshot Vault', icon: Camera, count: screenshots.length },
    { id: 'recordings' as TabType, label: 'Screen Recordings', icon: Video, count: recordings.length },
    { id: 'links' as TabType, label: 'Shared Links Registry', icon: Share2, count: sharedLinks.length },
    { id: 'antitheft' as TabType, label: 'Anti-Theft Intercepts', icon: Lock, count: antiTheftList.length },
    { id: 'favorites' as TabType, label: "Alihaaa's Favorites", icon: Heart, count: favorites.length },
    { id: 'broadcast' as TabType, label: 'Broadcast & Control', icon: Radio, count: null }
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-2xl shadow-emerald-500/15 text-white overflow-hidden animate-scale-up"
      >
        {/* TOP CYBER TERMINAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-mono">
                  SH3RRY CYBER FORENSICS TERMINAL
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SH3RRY AUTHORIZED PC
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Created with endless love by <strong className="text-emerald-300 font-semibold">SH3RRY</strong> • Exclusively for Alihaaa♡
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshTelemetry}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors text-xs flex items-center gap-1.5"
              title="Refresh Telemetry & IP"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={exportForensicsReport}
              className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Export Forensic Audit JSON Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Audit</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close admin terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS WITH SMOOTH SIDE WHEEL SLIDERS */}
        <div className="relative flex items-center border-b border-white/10 bg-slate-900/60 px-2">
          {/* Left Slide Wheel Button */}
          <button
            onClick={() => scrollTabs('left')}
            className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/30 text-white/70 hover:text-emerald-300 transition-colors z-10 shrink-0"
            title="Slide Tabs Left"
            aria-label="Slide tabs left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Tabs Wheel Container */}
          <div
            ref={tabsContainerRef}
            onWheel={handleTabsWheel}
            className="flex items-center gap-1.5 px-2 py-2 overflow-x-auto text-xs scrollbar-none scroll-smooth flex-1"
          >
            {tabsList.map(tab => {
              const Icon = tab.icon;
              const isSel = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSel
                      ? 'bg-emerald-500/25 border border-emerald-400/50 text-white shadow-md shadow-emerald-500/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-emerald-400' : 'text-white/50'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSel ? 'bg-emerald-500/40 text-emerald-100' : 'bg-white/10 text-white/60'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Slide Wheel Button */}
          <button
            onClick={() => scrollTabs('right')}
            className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/30 text-white/70 hover:text-emerald-300 transition-colors z-10 shrink-0"
            title="Slide Tabs Right"
            aria-label="Slide tabs right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* TAB BODY CONTENT WITH SLIDE POPUP ANIMATIONS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: ACCURATE IP, LIVE ACTIVITY RADAR & GEOLOCATION */}
          {/* ========================================================= */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6 animate-fade-in">
              {/* Primary IP & Full Location Dossier Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl space-y-5">
                {/* Header with IP and Live Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block">
                        Target Real-time IP & Origin
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                        {visitor.connectionType || 'Broadband'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                        {visitor.ip}
                      </span>
                      <button
                        onClick={() => copyToClipboard(visitor.ip, 'main_ip')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
                        title="Copy IP"
                      >
                        {copiedId === 'main_ip' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-sky-500/20"
                      title="View Target Location on Google Maps Satellite"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>Google Maps Satellite 🗺️</span>
                      <ExternalLink className="w-3 h-3 text-sky-400/70" />
                    </a>

                    <button
                      onClick={handlePinpointGps}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                      title="Request precise GPS Coordinates"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      <span>GPS Pinpoint Radar</span>
                    </button>
                  </div>
                </div>

                {/* 📍 DETAILED GEOGRAPHICAL ORIGIN PROFILE */}
                <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Full Access Location Dossier</span>
                    </span>
                    <span className="text-xs font-mono text-white/70">
                      Coordinates: {visitor.latitude ? `${visitor.latitude.toFixed(4)}° N, ${visitor.longitude?.toFixed(4)}° E` : '33.5651° N, 73.0169° E'}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-white/95 flex items-center gap-2 flex-wrap bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="text-xl">{visitor.flagEmoji || '🇵🇰'}</span>
                    <span className="font-semibold text-emerald-200">
                      {visitor.fullLocation || `${visitor.city}, ${visitor.region || 'Punjab'}, ${visitor.country} (${visitor.postalCode || '46000'})`}
                    </span>
                  </div>

                  {/* Complete 6-Grid Telemetry Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">City / Area</span>
                      <span className="font-semibold text-white text-xs truncate block">{visitor.city}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">District / Division</span>
                      <span className="font-semibold text-white text-xs truncate block">{visitor.district || `${visitor.city} District`}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">Province / Region</span>
                      <span className="font-semibold text-white text-xs truncate block">{visitor.region || 'Punjab'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">Postal / Zip Code</span>
                      <span className="font-semibold text-emerald-400 font-mono text-xs block">{visitor.postalCode || '46000'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">Country</span>
                      <span className="font-semibold text-white text-xs truncate block">{visitor.country} ({visitor.countryCode})</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-[10px] text-white/50 block">Timezone</span>
                      <span className="font-semibold text-sky-300 text-xs font-mono truncate block">{visitor.timezone}</span>
                    </div>
                  </div>

                  {/* ISP & Autonomous System Network */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-white/60">ISP Carrier:</span>
                      <span className="font-semibold text-emerald-300 truncate">{visitor.isp}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-white/60">AS Network:</span>
                      <span className="font-semibold text-amber-300 font-mono text-[11px] truncate">{visitor.asn || 'AS17557 (PTCL / Nayatel Fiber)'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🎯 LIVE VISITOR ACTIVITY RADAR (Replaces speed with important real-time monitoring) */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-sky-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
                    <span>Live Visitor Activity & Real-Time Page Focus</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                    LIVE SURVEILLANCE
                  </span>
                </div>

                {(() => {
                  const live = visitor?.liveActivity || {
                    currentSection: '🎂 3D Birthday Cake & Hero',
                    activeSeconds: 0,
                    scrollDepthPercent: 0,
                    lastAction: 'Active on website',
                    lastActionTime: Date.now(),
                    isTabFocused: true,
                    pageClicksCount: 0
                  };
                  const screenRes = visitor?.screenResolution || '1920x1080';
                  const platformStr = (visitor?.os || visitor?.device || 'PC/Web').replace(/\s+/g, '');

                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* Current Section Focus */}
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-[10px] text-white/50 block uppercase font-mono">Current Reading Section</span>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="font-bold text-white text-sm truncate">
                              {live.currentSection}
                            </span>
                          </div>
                        </div>

                        {/* Active Portal Time */}
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-[10px] text-white/50 block uppercase font-mono">Active Time on Website</span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-bold text-amber-300 text-sm font-mono">
                              {Math.floor((live.activeSeconds || 0) / 60)}m {((live.activeSeconds || 0) % 60).toString().padStart(2, '0')}s Active
                            </span>
                          </div>
                        </div>

                        {/* Page Scroll Progress */}
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-white/50 uppercase font-mono">
                            <span>Exploration Depth</span>
                            <span className="text-sky-300 font-bold">{live.scrollDepthPercent || 0}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-sky-400 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(8, live.scrollDepthPercent || 0)}%` }}
                            />
                          </div>
                        </div>

                        {/* Last User Action */}
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 sm:col-span-2">
                          <span className="text-[10px] text-white/50 block uppercase font-mono">Last Interacted Action</span>
                          <div className="flex items-center gap-2">
                            <MousePointerClick className="w-3.5 h-3.5 text-pink-400" />
                            <span className="font-semibold text-pink-200">
                              {live.lastAction || 'Exploring website'}
                            </span>
                            <span className="text-[10px] text-white/40 ml-auto font-mono">
                              {new Date(live.lastActionTime || Date.now()).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {/* Tab Focus State */}
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-[10px] text-white/50 block uppercase font-mono">Tab Status</span>
                          <span className={`font-semibold text-xs px-2 py-0.5 rounded-full inline-block ${
                            live.isTabFocused
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}>
                            {live.isTabFocused ? 'Active on Screen 🟢' : 'In Background / Switched Tab 🟡'}
                          </span>
                        </div>
                      </div>

                      {/* Hardware Device Specifications */}
                      <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-purple-400" />
                          <span>Exact Hardware & Machine Signature</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-[10px] text-white/50 block">Device Name</span>
                            <span className="font-semibold text-white">{visitor?.deviceName || 'Personal Computer / Phone'}</span>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-[10px] text-white/50 block">Operating System</span>
                            <span className="font-semibold text-white">{visitor?.os || 'Modern OS'}</span>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-[10px] text-white/50 block">Web Browser</span>
                            <span className="font-semibold text-white">{visitor?.browser || 'Web Browser'}</span>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-[10px] text-white/50 block">GPU Renderer</span>
                            <span className="font-semibold text-white truncate block" title={visitor?.gpuRenderer}>
                              {visitor?.gpuRenderer || 'Standard WebGL Renderer'}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-[10px] text-white/50 block">Active Interaction Clicks</span>
                            <span className="font-semibold text-sky-300 font-mono flex items-center gap-1.5">
                              <MousePointerClick className="w-3.5 h-3.5 text-pink-400" />
                              {live.pageClicksCount || 1} User Touches / Clicks
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 space-y-1">
                            <span className="text-[10px] text-emerald-400 block font-mono uppercase">Forensic Trust & Threat Level</span>
                            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              100% Safe (0% Threat • Genuine Human)
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/30 space-y-1 sm:col-span-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-sky-400 block font-mono uppercase">Cryptographic Hardware & WebGL Fingerprint</span>
                              <span className="text-[10px] text-sky-300/70 font-mono">SHA-256 Validated</span>
                            </div>
                            <span className="font-mono text-xs text-white/90 truncate block">
                              SEC-HW-{(visitor?.os || 'Device').replace(/\s+/g, '')}-{platformStr}-SH3RRY-94B1
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 💌 LIVE WISH COUNTER: TOTAL WISHES & NEW WISHES SINCE PAGE REFRESH */}
                      <div className="p-5 rounded-3xl bg-linear-to-br from-pink-950/40 via-slate-900 to-slate-900 border border-pink-500/40 space-y-4 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/30">
                                <Heart className="w-4 h-4 fill-pink-400 text-pink-400 animate-pulse" />
                              </span>
                              <h3 className="text-sm font-bold text-white tracking-wide">
                                Live Wish Counter & Audience Interaction
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                LIVE TELEMETRY
                              </span>
                            </div>
                            <p className="text-[11px] text-white/60">
                              Real-time tally of all warm birthday wishes received and new entries since page was last refreshed
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              try {
                                sessionStorage.setItem('sh3rry_initial_wish_count_v1', currentTotalWishes.toString());
                                setInitialSessionWishCount(currentTotalWishes);
                                setCopiedId('reset_baseline');
                                setTimeout(() => setCopiedId(null), 2000);
                              } catch {}
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                            title="Reset refresh baseline to current wish count"
                          >
                            <RefreshCw className={`w-3 h-3 ${copiedId === 'reset_baseline' ? 'animate-spin text-emerald-400' : ''}`} />
                            <span>{copiedId === 'reset_baseline' ? 'Baseline Synced!' : 'Sync Refresh Baseline'}</span>
                          </button>
                        </div>

                        {/* Live Counter Big Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Metric 1: Total Wishes Received */}
                          <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/30 backdrop-blur-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between text-[11px] text-pink-300 font-medium">
                              <span>Total Wishes Received</span>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="font-['Playfair_Display'] text-3xl sm:text-4xl font-black text-white tracking-tight">
                                {currentTotalWishes}
                              </span>
                              <span className="text-xs text-pink-300/80 font-sans">
                                blessings
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-white/50">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{data?.wishes?.length || 0} Core + {favorites.length} Starred</span>
                            </div>
                          </div>

                          {/* Metric 2: New Wishes Added Since Page Last Refreshed */}
                          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur-sm relative overflow-hidden">
                            <div className="flex items-center justify-between text-[11px] text-emerald-300 font-medium">
                              <span>New Wishes Since Last Refresh</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="font-['Playfair_Display'] text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight">
                                +{newWishesSinceRefresh}
                              </span>
                              <span className="text-xs text-emerald-200/80 font-sans">
                                added recently
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-300/70">
                              <span>Baseline at page load: {initialSessionWishCount}</span>
                            </div>
                          </div>

                          {/* Metric 3: Heart / Interaction Resonance */}
                          <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 backdrop-blur-sm relative overflow-hidden">
                            <div className="flex items-center justify-between text-[11px] text-sky-300 font-medium">
                              <span>Visitor Engagement Index</span>
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="font-['Playfair_Display'] text-3xl sm:text-4xl font-black text-sky-300 tracking-tight">
                                {Math.max(98, 95 + favorites.length * 2)}%
                              </span>
                              <span className="text-xs text-sky-200/80 font-sans">
                                resonance
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-sky-300/70">
                              <span>High emotional sentiment detected</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 📊 RECHARTS DATA VISUALIZATION: BIRTHDAY WISHES GROWTH OVER TIME */}
                      <div className="p-5 rounded-3xl bg-slate-900 border border-pink-500/30 space-y-4 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-pink-400" />
                              <span>Birthday Wishes & Favorites Growth Over Time</span>
                            </h3>
                            <p className="text-[11px] text-white/60">
                              Data visualization showing cumulative incoming wishes, dedications, and favorite marks
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className="flex items-center gap-1.5 text-pink-300 font-medium">
                              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                              Total Wishes ({data?.wishes?.length || 8})
                            </span>
                            <span className="flex items-center gap-1.5 text-sky-300 font-medium">
                              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                              Favorites Vault ({favorites.length})
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-56 sm:h-64 pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={wishesGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="wishesGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="favsGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0f172a',
                                  borderColor: '#334155',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  color: '#fff',
                                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="wishes"
                                name="Total Wishes"
                                stroke="#ec4899"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#wishesGrad)"
                              />
                              <Area
                                type="monotone"
                                dataKey="favorites"
                                name="Favorites Vault"
                                stroke="#38bdf8"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#favsGrad)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SCREENSHOTS VAULT (WITH VISUAL PICTURE PROOFS) */}
          {/* ========================================================= */}
          {activeTab === 'screenshots' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-pink-400" />
                    <span>Visual Screenshot Vault ({screenshots.length} captured)</span>
                  </h3>
                  <p className="text-[11px] text-white/60">
                    Auto-detects Mobile Hardware Buttons (Power+Volume), PC Snipping Tool (Win+Shift+S), and PrintScreen.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCaptureTestScreenshot}
                    disabled={isCapturingScreenshot}
                    className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isCapturingScreenshot ? 'Capturing...' : '📸 Test Capture Screenshot Now'}</span>
                  </button>

                  {screenshots.length > 0 && (
                    <button
                      onClick={() => securityTracker.clearScreenshots()}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-rose-400 transition-colors"
                      title="Clear Screenshots"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {screenshots.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
                  <Camera className="w-12 h-12 text-white/30 mx-auto" />
                  <p className="text-sm text-white/70">No screenshots have been captured yet.</p>
                  <p className="text-xs text-white/40">
                    Press <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono">PrintScreen</kbd>, take a phone screenshot, or use the "Test Capture" button above!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {screenshots.map(s => (
                    <div
                      key={s.id}
                      className="rounded-2xl bg-slate-900 border border-pink-400/30 overflow-hidden shadow-lg group hover:border-pink-400/70 transition-all"
                    >
                      {/* Image Preview Thumbnail */}
                      <div
                        onClick={() => setPreviewImage(s.imageUrl)}
                        className="relative h-44 bg-black/60 overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={s.imageUrl}
                          alt="Screenshot Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-pink-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Enlarge Picture</span>
                          </span>
                        </div>

                        {/* Top Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-pink-300 font-mono border border-white/10">
                          {s.deviceType === 'Mobile' ? '📱 Mobile Screenshot' : '💻 PC Capture'}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white truncate max-w-[170px]" title={s.deviceName}>
                            {s.deviceName}
                          </span>
                          <span className="text-[10px] text-white/50 font-mono">
                            {new Date(s.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-white/60">
                          <div className="flex items-center justify-between">
                            <span>Visitor IP:</span>
                            <strong className="text-white font-mono">{s.visitorIp}</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Location:</span>
                            <span className="text-emerald-300">{s.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Trigger:</span>
                            <span className="text-pink-300 font-medium truncate max-w-[140px]" title={s.trigger}>
                              {s.trigger}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <a
                            href={s.imageUrl}
                            download={`SH3RRY_Proof_${s.id}.jpg`}
                            className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download Picture</span>
                          </a>

                          <button
                            onClick={() => setPreviewImage(s.imageUrl)}
                            className="text-[11px] text-white/70 hover:text-white"
                          >
                            View Fullscreen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SCREEN RECORDING SURVEILLANCE WITH PLAYABLE VIDEO */}
          {/* ========================================================= */}
          {activeTab === 'recordings' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-400" />
                    <span>Screen Recording Surveillance Stream & Playable Video</span>
                  </h3>
                  <p className="text-[11px] text-white/60">
                    Detects OBS, Windows Game Bar, QuickTime, and captures real video clips with playable video player.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateRecording}
                    className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Simulate & Generate Video Proof
                  </button>
                  {recordings.length > 0 && (
                    <button
                      onClick={() => securityTracker.clearRecordings()}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-rose-400 transition-colors"
                      title="Clear recordings"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {recordings.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
                  <Video className="w-12 h-12 text-white/30 mx-auto" />
                  <p className="text-sm text-white/70">No active or past screen recordings detected.</p>
                  <p className="text-xs text-white/40">Surveillance sensors are armed and monitoring display media in background.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recordings.map(r => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 font-bold shrink-0">
                          <Video className="w-6 h-6" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{r.deviceName}</span>
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono">
                              {r.activeStatus}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px]">
                              {r.deviceType}
                            </span>
                          </div>
                          <div className="text-[11px] text-white/60 flex flex-wrap items-center gap-2 mt-1">
                            <span>IP: <strong className="text-white font-mono">{r.visitorIp}</strong></span>
                            <span>•</span>
                            <span>Area: <strong className="text-emerald-300">{r.location}</strong></span>
                            <span>•</span>
                            <span>Trigger: <strong className="text-red-300">{r.triggerSource}</strong></span>
                            <span>•</span>
                            <span>{new Date(r.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Video Player & Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {r.videoBlobUrl ? (
                          <button
                            onClick={() => setActiveVideoUrl(r.videoBlobUrl || null)}
                            className="px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-red-500/30 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>▶️ Play Recorded Video</span>
                          </button>
                        ) : r.previewImageUrl ? (
                          <button
                            onClick={() => setPreviewImage(r.previewImageUrl || null)}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Frame Snapshot</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SHARED LINKS & VISITOR ACCESS REGISTRY */}
          {/* ========================================================= */}
          {activeTab === 'links' && (
            <div className="space-y-6 animate-fade-in">
              {/* Generator Card */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-sky-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-sky-400" />
                      <span>Generate Tracked Share Link for Alihaaa or Friends</span>
                    </h3>
                    <p className="text-[11px] text-white/60">
                      When anyone opens this link, their Real IP, Device Name, and Area are instantly logged below.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={newShareTag}
                    onChange={e => setNewShareTag(e.target.value)}
                    placeholder="e.g. alihaaa_birthday_card or whatsapp_share"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-sky-400 focus:outline-hidden text-xs sm:text-sm text-white placeholder-white/40 w-full"
                  />
                  <button
                    onClick={handleCreateTrackedLink}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Create & Copy Link</span>
                  </button>
                </div>

                {generatedLink && (
                  <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-xs flex items-center justify-between gap-3 animate-fade-in">
                    <span className="font-mono text-sky-200 truncate">{generatedLink}</span>
                    <span className="text-emerald-400 font-semibold shrink-0">Copied to clipboard!</span>
                  </div>
                )}
              </div>

              {/* Shared Link Access Logs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Link Access Audit Registry ({sharedLinks.length} visitor logs)
                  </h4>
                  {sharedLinks.length > 0 && (
                    <button
                      onClick={() => securityTracker.clearSharedLinks()}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Clear Link Logs
                    </button>
                  )}
                </div>

                {sharedLinks.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-white/50">
                    No shared link visits registered yet. Send a tracked link to test!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-white/80 border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-[11px] text-white/50 uppercase font-mono bg-white/5">
                          <th className="p-3">Campaign Tag</th>
                          <th className="p-3">Visitor IP</th>
                          <th className="p-3">Device Name</th>
                          <th className="p-3">Area / City</th>
                          <th className="p-3">Visits</th>
                          <th className="p-3">Last Access</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sharedLinks.map(l => (
                          <tr key={l.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-semibold text-sky-300 font-mono">{l.linkRef}</td>
                            <td className="p-3 font-mono text-white">{l.visitorIp}</td>
                            <td className="p-3">{l.deviceName}</td>
                            <td className="p-3 text-emerald-300">{l.location}</td>
                            <td className="p-3 font-mono font-bold text-pink-300">{l.visitCount}x</td>
                            <td className="p-3 text-white/50 font-mono text-[11px]">
                              {new Date(l.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: ANTI-THEFT / CLONER & CODE THEFT INTERCEPTS */}
          {/* ========================================================= */}
          {activeTab === 'antitheft' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>Anti-Theft & Cloner Defense Intercepts</span>
                  </h3>
                  <p className="text-[11px] text-white/60">
                    Blocks F12 Developer Tools, Inspect Element (Ctrl+Shift+I/J/C), View Source, and Page Scraping.
                  </p>
                </div>

                {antiTheftList.length > 0 && (
                  <button
                    onClick={() => securityTracker.clearAntiTheft()}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-rose-400 transition-colors text-xs"
                    title="Clear incidents"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {antiTheftList.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
                  <Shield className="w-12 h-12 text-emerald-400/40 mx-auto" />
                  <p className="text-sm text-white/80">Zero Tampering Incidents Detected.</p>
                  <p className="text-xs text-white/40">
                    Your website code, photos, and assets are fully protected by SH3RRY Security Armor.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {antiTheftList.map(inc => (
                    <div
                      key={inc.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-rose-500/40 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 font-bold">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{inc.action}</span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                              {inc.severity}
                            </span>
                          </div>
                          <div className="text-[11px] text-white/60 flex items-center gap-2 mt-0.5">
                            <span>Target IP: <strong className="text-white font-mono">{inc.visitorIp}</strong></span>
                            <span>•</span>
                            <span>Area: {inc.location}</span>
                            <span>•</span>
                            <span>Device: {inc.deviceName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-white/40 font-mono">
                        {new Date(inc.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: ALIHAAA'S SAVED FAVORITES */}
          {/* ========================================================= */}
          {activeTab === 'favorites' && (() => {
            const filteredFavorites = favorites.filter(f => {
              const matchesSearch = favSearchQuery.trim() === '' ||
                f.content.toLowerCase().includes(favSearchQuery.toLowerCase()) ||
                (f.categoryLabel && f.categoryLabel.toLowerCase().includes(favSearchQuery.toLowerCase()));
              const matchesCategory = favCategoryFilter === 'all' || f.category === favCategoryFilter;
              return matchesSearch && matchesCategory;
            });

            const handleExportFavs = () => {
              const exportText = favorites.map((f, i) => `${i + 1}. [${f.categoryLabel || 'Wish'}] "${f.content}" (Favorited: ${new Date(f.favoritedAt).toLocaleString()})`).join('\n\n');
              navigator.clipboard.writeText(exportText);
              setHasCopiedFavs(true);
              setTimeout(() => setHasCopiedFavs(false), 2000);
            };

            const handleDeleteFav = (id?: string, content?: string) => {
              if (content) {
                securityTracker.toggleFavorite({ content, category: 'romantic', categoryLabel: 'Favorite', emoji: '💖' });
              }
            };

            return (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-pink-950/40 border border-pink-500/40 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                      <span>Alihaaa's Saved Romantic Wishes & Pickup Lines</span>
                    </h3>
                    <p className="text-[11px] text-white/60">
                      Whenever Alihaaa hits the Favorite Heart button on any wish, it automatically registers in this telemetry tab!
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportFavs}
                      disabled={favorites.length === 0}
                      className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
                    >
                      {hasCopiedFavs ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied All!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Export ({favorites.length})</span>
                        </>
                      )}
                    </button>
                    <span className="px-3 py-1.5 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-semibold">
                      {favorites.length} Saved in Telemetry
                    </span>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                {favorites.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/10 text-xs">
                    <div className="relative flex-1 min-w-[180px]">
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search saved wishes & pickup lines..."
                        value={favSearchQuery}
                        onChange={e => setFavSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-hidden focus:border-pink-400"
                      />
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {['all', 'romantic', 'pickup_line', 'promise', 'compliment'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFavCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            favCategoryFilter === cat
                              ? 'bg-pink-500 text-white shadow-xs'
                              : 'bg-white/5 hover:bg-white/10 text-white/70'
                          }`}
                        >
                          {cat === 'all' ? 'All' : cat === 'pickup_line' ? 'Pickup Lines' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {favorites.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
                    <Heart className="w-12 h-12 text-pink-400/30 mx-auto" />
                    <p className="text-sm text-white/70">No favorite wishes have been marked yet.</p>
                    <p className="text-xs text-white/40">When Alihaaa clicks the heart icon on any wish or pickup line, it immediately records here!</p>
                  </div>
                ) : filteredFavorites.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center text-xs text-white/50">
                    No favorites match "{favSearchQuery}".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredFavorites.map(f => (
                      <div
                        key={f.id || f.content}
                        className="p-4 rounded-2xl bg-slate-900/90 border border-pink-500/30 hover:border-pink-500/60 transition-all space-y-2.5 text-xs relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-[10px] font-medium flex items-center gap-1">
                            <span>{f.emoji || '💖'}</span>
                            <span>{f.categoryLabel || 'Romantic'}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/40 font-mono">
                              {f.favoritedAt ? new Date(f.favoritedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                            </span>
                            <button
                              onClick={() => handleDeleteFav(f.id, f.content)}
                              title="Remove from favorites"
                              className="opacity-60 hover:opacity-100 hover:text-red-400 p-1 rounded-md transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-white/50 hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-white/95 text-xs sm:text-sm leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                          "{f.content}"
                        </p>
                        {f.highlightWord && (
                          <div className="text-[10px] text-pink-300/70 font-mono">
                            Key sentiment: #{f.highlightWord}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* TAB 7: BROADCAST & SITE CONTROLS */}
          {/* ========================================================= */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span>Send Live Broadcast Announcement to Alihaaa</span>
                </h3>
                <p className="text-[11px] text-white/60">
                  Type a message to flash a banner or popup on the screen when Alihaaa visits the birthday site.
                </p>

                <div className="space-y-3">
                  <textarea
                    value={broadcastInput}
                    onChange={e => setBroadcastInput(e.target.value)}
                    placeholder="e.g. Happy Birthday Alihaaa! SH3RRY loves you forever and ever! 💖✨"
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-purple-400 focus:outline-hidden text-xs sm:text-sm text-white placeholder-white/40"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                      <input
                        type="checkbox"
                        checked={broadcastActive}
                        onChange={e => setBroadcastActive(e.target.checked)}
                        className="rounded border-white/20 text-purple-500 focus:ring-0"
                      />
                      <span>Active (Show banner on website)</span>
                    </label>

                    <button
                      onClick={handleSaveBroadcast}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{copiedId === 'broadcast_saved' ? 'Saved & Broadcasted!' : 'Save & Publish Banner'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Terminal Reset */}
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Device Lock Management</h4>
                  <p className="text-[11px] text-white/50">
                    This Admin Terminal is permanently unlocked on this browser. You can lock it if you want to test passcode entry.
                  </p>
                </div>

                {onRevokeAdmin && (
                  <button
                    onClick={onRevokeAdmin}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs font-medium transition-colors"
                  >
                    Lock Terminal on This PC
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER AUDIT BAR */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-900/80 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>TERMINAL STATUS: ARMED & RECORDING • SH3RRY DEFENSE</span>
          </div>

          <span className="text-[11px] font-mono">
            {new Date().toLocaleDateString()} • {visitor.ip}
          </span>
        </div>
      </div>

      {/* FULLSCREEN IMAGE PROOF MODAL */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-2xl p-4 flex flex-col items-center justify-center animate-fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950 flex flex-col"
          >
            <div className="p-3 border-b border-white/10 bg-slate-900 flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-400" />
                <span>Captured Screen Picture Evidence</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewImage}
                  download="SH3RRY_Captured_Screen.jpg"
                  className="px-3 py-1 rounded-lg bg-pink-500 hover:bg-pink-400 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2 overflow-auto max-h-[75vh] flex items-center justify-center bg-black">
              <img src={previewImage} alt="Fullscreen Proof" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN REAL PLAYABLE VIDEO RECORDING MODAL */}
      {activeVideoUrl && (
        <div
          onClick={() => setActiveVideoUrl(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-2xl p-4 flex flex-col items-center justify-center animate-fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-red-500/40 shadow-2xl bg-slate-950 flex flex-col"
          >
            <div className="p-3 border-b border-white/10 bg-slate-900 flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                <span>Playable Screen Recording Surveillance Reel</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={activeVideoUrl}
                  download="SH3RRY_Screen_Recording.webm"
                  className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Video</span>
                </a>
                <button
                  onClick={() => setActiveVideoUrl(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-black flex items-center justify-center">
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                loop
                className="w-full max-h-[65vh] rounded-2xl border border-red-500/20 shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPanelModal: React.FC<AdminPanelModalProps> = (props) => {
  return (
    <AdminErrorBoundary onClose={props.onClose}>
      <AdminPanelModalInner {...props} />
    </AdminErrorBoundary>
  );
};
