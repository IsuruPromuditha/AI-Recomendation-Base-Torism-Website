import React, { useState } from 'react';
import {
  MapPin,
  Globe,
  Bookmark,
  CalendarCheck,
  Navigation2,
  ChevronDown,
  Check,
  Radio,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/sampleScans';
import { formatCoordinates } from '../lib/geo';

export interface TravelerQuickBarProps {
  currentLocation: {
    latitude: number;
    longitude: number;
    name: string;
    region?: string;
  };
  onSelectLocation: (loc: { latitude: number; longitude: number; name: string; region?: string }) => void;
  targetLanguage: string;
  onChangeLanguage: (lang: string) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onBookTour: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'French', label: 'Français', flag: '🇫🇷' },
  { code: 'German', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'Spanish', label: 'Español', flag: '🇪🇸' },
  { code: 'Japanese', label: '日本語', flag: '🇯🇵' },
  { code: 'Chinese', label: '中文', flag: '🇨🇳' },
];

export const TravelerQuickBar: React.FC<TravelerQuickBarProps> = ({
  currentLocation,
  onSelectLocation,
  targetLanguage,
  onChangeLanguage,
  savedCount,
  onOpenSavedDrawer,
  onBookTour,
}) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleUseLiveGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        onSelectLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          name: 'Live Device GPS',
          region: `Accuracy: ±${Math.round(pos.coords.accuracy)}m`,
        });
        setIsLocationDropdownOpen(false);
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsError(err.message || 'Unable to retrieve location.');
        setTimeout(() => setGpsError(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <section
      id="section-traveler-companion-bar"
      aria-label="Traveler Companion Quick Controls"
      className="relative z-30 w-full"
    >
      <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-2xl backdrop-blur-xl p-2.5 sm:p-4 transition-all">
        {/* Top Mini Tagline */}
        <div className="hidden sm:flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Traveler Control Deck
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Real-Time Geolocation, Multilingual Translation & Booking</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official SLTDA Safe & Secure</span>
          </div>
        </div>

        {/* The 4 Responsive Control Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* 1. CURRENT COORDINATES & LOCATION HUB */}
          <div className="relative">
            <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold mb-1 flex items-center justify-between px-1">
              <span className="flex items-center gap-1 text-amber-400">
                <MapPin className="w-3 h-3" />
                <span>Current Coordinates</span>
              </span>
              <span className="font-mono text-[9px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                {formatCoordinates(currentLocation.latitude, currentLocation.longitude)}
              </span>
            </div>

            <button
              id="btn-quickbar-location"
              type="button"
              onClick={() => {
                setIsLocationDropdownOpen(!isLocationDropdownOpen);
                setIsLangDropdownOpen(false);
              }}
              className="w-full h-11 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-amber-500/40 text-left transition-all flex items-center justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {currentLocation.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentLocation.region || 'Sri Lanka'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:text-white" />
            </button>

            {/* Coordinates & Location Dropdown Modal */}
            {isLocationDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 max-w-[95vw] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400" /> Active GPS Fix
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">
                    {formatCoordinates(currentLocation.latitude, currentLocation.longitude)}
                  </span>
                </div>

                {/* Live Device GPS Button */}
                <button
                  id="btn-quickbar-live-gps"
                  type="button"
                  onClick={handleUseLiveGps}
                  disabled={isDetectingGps}
                  className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Navigation2 className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                  {isDetectingGps ? 'Acquiring GPS Fix...' : 'Use My Current Device GPS'}
                </button>

                {gpsError && (
                  <p className="text-[11px] text-rose-400 mb-2 px-2 py-1.5 bg-rose-500/10 rounded-lg border border-rose-500/20">
                    {gpsError}
                  </p>
                )}

                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold px-1 mb-1.5">
                  Select Sri Lankan Destination:
                </div>

                <div className="space-y-1 max-h-52 overflow-y-auto no-scrollbar pr-1">
                  {POPULAR_LOCATIONS.map((loc) => {
                    const isSelected =
                      Math.abs(loc.latitude - currentLocation.latitude) < 0.005 &&
                      Math.abs(loc.longitude - currentLocation.longitude) < 0.005;

                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          onSelectLocation({
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                            name: loc.name,
                            region: loc.region,
                          });
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-100">{loc.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{loc.region}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. LANGUAGE CHANGING OPTION */}
          <div className="relative">
            <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold mb-1 flex items-center justify-between px-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Globe className="w-3 h-3" />
                <span>Language Setting</span>
              </span>
              <span className="text-[9px] text-slate-400">Multimodal AI</span>
            </div>

            <button
              id="btn-quickbar-language"
              type="button"
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsLocationDropdownOpen(false);
              }}
              className="w-full h-11 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-amber-500/40 text-left transition-all flex items-center justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 text-sm">
                  {currentLangObj.flag}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {currentLangObj.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Translation Target
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:text-white" />
            </button>

            {/* Language Selector Dropdown Modal */}
            {isLangDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold">
                  Select Translation Language
                </div>
                <div className="py-1 space-y-1">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onChangeLanguage(l.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between cursor-pointer ${
                        targetLanguage === l.code
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {targetLanguage === l.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. TRAVEL DIARY & SAVED SCANS */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold mb-1 flex items-center justify-between px-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Bookmark className="w-3 h-3" />
                <span>Travel Diary</span>
              </span>
              <span className="text-[9px] text-emerald-400 font-medium">Offline Vault</span>
            </div>

            <button
              id="btn-quickbar-diary"
              type="button"
              onClick={onOpenSavedDrawer}
              className="w-full h-11 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-amber-500/40 text-left transition-all flex items-center justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20">
                  <Bookmark className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 flex items-center gap-1.5">
                    <span>Saved Scans</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                      {savedCount}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {savedCount > 0 ? `${savedCount} records saved` : 'Browse offline history'}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 4. BOOK A TOUR CTA ACTION */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold mb-1 flex items-center justify-between px-1">
              <span className="flex items-center gap-1 text-amber-400">
                <CalendarCheck className="w-3 h-3" />
                <span>Bespoke Journeys</span>
              </span>
              <span className="text-[9px] text-amber-300 font-bold">Live Rates</span>
            </div>

            <button
              id="btn-quickbar-book-tour"
              type="button"
              onClick={onBookTour}
              className="w-full h-11 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-98 group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-slate-950/20 text-slate-950 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black uppercase tracking-tight text-slate-950 truncate">
                    Book a Tour
                  </div>
                  <div className="text-[9px] font-bold text-slate-900/80 truncate">
                    Reserve Itinerary
                  </div>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
