import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CameraScanner } from './components/CameraScanner';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { InteractiveTravelMap } from './components/InteractiveTravelMap';
import { TravelAssistantChat } from './components/TravelAssistantChat';
import { SavedScansDrawer } from './components/SavedScansDrawer';
import { TourCatalogAndBooking } from './components/TourCatalogAndBooking';
import { DiscoverSriLanka } from './components/DiscoverSriLanka';
import { AdminBookingAndDbStudio } from './components/AdminBookingAndDbStudio';
import { HeroSlideshow } from './components/HeroSlideshow';
import { ModernTourismBookingWidget } from './components/ModernTourismBookingWidget';
import { TourismTrustStrip } from './components/TourismTrustStrip';
import { TravelerQuickBar } from './components/TravelerQuickBar';
import { Footer } from './components/Footer';
import { TravelAnalysisResult } from './types';
import { PRESET_SAMPLE_SCANS, POPULAR_LOCATIONS } from './data/sampleScans';
import {
  Compass,
  Sparkles,
  MessageSquare,
  Bookmark,
  ShieldCheck,
  Languages,
  Utensils,
  Landmark,
  Radio,
  Calendar,
  Layers,
  Database,
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation tab state
  const [activeNavTab, setActiveNavTab] = useState<'scanner' | 'tours' | 'discover' | 'admin'>('scanner');

  // Active travel location
  const [currentLocation, setCurrentLocation] = useState({
    latitude: POPULAR_LOCATIONS[0].latitude,
    longitude: POPULAR_LOCATIONS[0].longitude,
    name: POPULAR_LOCATIONS[0].name,
    region: POPULAR_LOCATIONS[0].region,
  });

  // Current active scan result (preloaded with first authentic sample)
  const [activeResult, setActiveResult] = useState<TravelAnalysisResult | null>(
    PRESET_SAMPLE_SCANS[0]
  );

  // Saved scans history
  const [savedScans, setSavedScans] = useState<TravelAnalysisResult[]>(() => {
    try {
      const cached = localStorage.getItem('wayfarer_saved_scans');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.warn('Could not read saved scans from localStorage:', err);
    }
    return PRESET_SAMPLE_SCANS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialQuestion, setAssistantInitialQuestion] = useState<string | undefined>();
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Booking planner state
  const [selectedBookingRegion, setSelectedBookingRegion] = useState<string | undefined>();
  const [selectedBookingTourId, setSelectedBookingTourId] = useState<number | undefined>(1);

  const handleScrollToBookingPlanner = () => {
    if (activeNavTab === 'discover' || activeNavTab === 'admin') {
      setActiveNavTab('tours');
    }
    setTimeout(() => {
      const el = document.getElementById('booking-planner');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleBookFromHero = (tourId?: number, region?: string) => {
    if (tourId) setSelectedBookingTourId(tourId);
    if (region) setSelectedBookingRegion(region);
    handleScrollToBookingPlanner();
  };

  // Synchronize with network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save scans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wayfarer_saved_scans', JSON.stringify(savedScans.slice(0, 50)));
    } catch (err) {
      console.warn('Could not write to localStorage:', err);
    }
  }, [savedScans]);

  // Fetch initial scans from server if available
  useEffect(() => {
    fetch('/api/scans')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.scans) && data.scans.length > 0) {
          setSavedScans((prev) => {
            const combined = [...data.scans, ...prev];
            const uniqueMap = new Map();
            combined.forEach((item) => {
              if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
            });
            return Array.from(uniqueMap.values());
          });
        }
      })
      .catch(() => {
        // Silent fallback to local storage
      });
  }, []);

  // Trigger Multimodal Analysis
  const handleAnalyze = async (imageData: string, scanTypeHint?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          location: currentLocation,
          targetLanguage,
          scanTypeHint,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        const newResult: TravelAnalysisResult = data.result;
        setActiveResult(newResult);
        setSavedScans((prev) => [newResult, ...prev.filter((s) => s.id !== newResult.id)]);

        // Smooth scroll to analysis card
        setTimeout(() => {
          document.getElementById(`analysis-card-${newResult.id}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 150);
      } else {
        alert(data.error || 'Could not analyze image. Please try another photo.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      alert('Network error while processing travel analysis. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (sample: TravelAnalysisResult) => {
    setActiveResult(sample);
    setCurrentLocation({
      latitude: sample.location.latitude,
      longitude: sample.location.longitude,
      name: sample.location.name,
      region: sample.location.region,
    });

    setTimeout(() => {
      document.getElementById(`analysis-card-${sample.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleToggleBookmark = async (id: string) => {
    const updated = savedScans.map((s) => {
      if (s.id === id) {
        return { ...s, isBookmarked: !s.isBookmarked };
      }
      return s;
    });
    setSavedScans(updated);

    if (activeResult && activeResult.id === id) {
      setActiveResult({ ...activeResult, isBookmarked: !activeResult.isBookmarked });
    }

    try {
      const target = updated.find((s) => s.id === id);
      if (target) {
        await fetch('/api/scans/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, isBookmarked: target.isBookmarked }),
        });
      }
    } catch (e) {
      // Local state is already updated
    }
  };

  const handleDeleteScan = async (id: string) => {
    setSavedScans((prev) => prev.filter((s) => s.id !== id));
    if (activeResult && activeResult.id === id) {
      setActiveResult(savedScans.find((s) => s.id !== id) || null);
    }

    try {
      await fetch(`/api/scans/${id}`, { method: 'DELETE' });
    } catch (e) {
      // Local state updated
    }
  };

  const handleOpenAssistant = (question?: string) => {
    setAssistantInitialQuestion(question);
    setIsAssistantOpen(true);
  };

  const handleScrollToMap = () => {
    document.getElementById('interactive-travel-map')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Application Header */}
      <Header
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        isOnline={isOnline}
        activeNavTab={activeNavTab}
        onSelectNavTab={setActiveNavTab}
        onOpenBookingForm={handleScrollToBookingPlanner}
      />

      {/* Main Screen Container with Optional Mobile Bezel Wrapper */}
      <main className="flex-1 flex justify-center p-3 sm:p-6 md:p-8">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-[440px] rounded-[48px] border-[12px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-slate-900 overflow-hidden flex flex-col my-4'
              : 'max-w-6xl'
          }`}
        >
          {/* Mobile Speaker Notch (Only when frame active) */}
          {isMobileFrame && (
            <div className="w-full bg-slate-800 h-6 flex items-center justify-center relative flex-shrink-0">
              <div className="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>
          )}

          <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
            {/* Dedicated Traveler Companion & Quick-Action Deck (Coordinates, Language, Diary, Book a Tour) */}
            <TravelerQuickBar
              currentLocation={currentLocation}
              onSelectLocation={(loc) => setCurrentLocation(loc)}
              targetLanguage={targetLanguage}
              onChangeLanguage={setTargetLanguage}
              savedCount={savedScans.filter((s) => s.isBookmarked).length}
              onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
              onBookTour={handleScrollToBookingPlanner}
            />

            {/* 1. Modern Tourism Hero Slideshow Section (Featured on Home / Scanner View) */}
            {activeNavTab === 'scanner' && (
              <section aria-label="Featured Island Expeditions Slideshow">
                <HeroSlideshow
                  onBookExperience={(tourId, region) => {
                    handleBookFromHero(tourId, region);
                  }}
                  onOpenScanner={() => setActiveNavTab('scanner')}
                  onScrollToBookingForm={handleScrollToBookingPlanner}
                />
              </section>
            )}

            {/* 2. Official Tourism Trust & Certified Partner Marquee (On Home and Tours) */}
            {(activeNavTab === 'scanner' || activeNavTab === 'tours') && (
              <section aria-label="Tourism Credentials and Trust">
                <TourismTrustStrip />
              </section>
            )}

            {/* 3. Trend-Setting Modern Tourism Booking & Trip Planner Form */}
            {(activeNavTab === 'scanner' || activeNavTab === 'tours') && (
              <section aria-label="Bespoke Tour Reservation and Trip Planner">
                <ModernTourismBookingWidget
                  initialRegion={selectedBookingRegion}
                  initialTourId={selectedBookingTourId}
                  onNavigateToAdmin={() => setActiveNavTab('admin')}
                />
              </section>
            )}

            {/* Quick Context Banner */}
            <section className="relative rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/20 p-4 sm:p-6 overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      WayFarer Sri Lanka AI Platform
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
                    {activeNavTab === 'scanner' && 'Explore Uncharted Lands with Multimodal AI'}
                    {activeNavTab === 'tours' && 'Book Curated Sri Lanka Travel Expeditions'}
                    {activeNavTab === 'discover' && 'Sri Lanka: Culture, Culinary, Heritage & Economy'}
                    {activeNavTab === 'admin' && 'Guest Reservations & Tour Operations'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                    {activeNavTab === 'scanner' &&
                      'Point your camera at native Sinhala & Tamil road signs, temple ruins, or street delicacies to get instant OCR translations, allergen breakdown, and geo-fenced travel tips.'}
                    {activeNavTab === 'tours' &&
                      'Select from premier curated island itineraries, reserve your custom package, and receive instant confirmation.'}
                    {activeNavTab === 'discover' &&
                      'Comprehensive guide to Sri Lankan ancient locations, famous dishes, bucket-list activities, cultural pageants, religions, and tea & gem industries.'}
                    {activeNavTab === 'admin' &&
                      'Review traveler reservations, verify booking details, and manage tour confirmation statuses.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsSavedDrawerOpen(true)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>Travel Diary ({savedScans.length})</span>
                  </button>

                  <button
                    onClick={() => handleOpenAssistant()}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI Assistant</span>
                  </button>
                </div>
              </div>
            </section>

            {/* TAB 1: AI Vision Scanner */}
            {activeNavTab === 'scanner' && (
              <div className="space-y-6 sm:space-y-8">
                {/* 1. Camera & Multimodal Scanner Section */}
                <section aria-label="Camera and Multimodal Scanner">
                  <CameraScanner
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                    onSelectPreset={handleSelectPreset}
                    currentLocationName={currentLocation.name}
                  />
                </section>

                {/* 2. Active Multimodal Analysis Inspection Section */}
                {activeResult && (
                  <section aria-label="Analysis Details">
                    <AnalysisResultCard
                      result={activeResult}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenAssistant={handleOpenAssistant}
                      onScrollToMap={handleScrollToMap}
                    />
                  </section>
                )}

                {/* 3. Location-Aware Interactive Map & Proximity Recommendations */}
                {activeResult && (
                  <section aria-label="Interactive Map and Nearby Recommendations">
                    <InteractiveTravelMap
                      location={activeResult.location}
                      subjectName={activeResult.identification}
                      recommendations={activeResult.nearby_recommendations}
                    />
                  </section>
                )}
              </div>
            )}

            {/* TAB 2: Tour Bookings & Packages */}
            {activeNavTab === 'tours' && (
              <section aria-label="Tour Packages and Online Reservations">
                <TourCatalogAndBooking
                  onBookingSuccess={() => {
                    // Optional toast or direct jump to admin
                  }}
                />
              </section>
            )}

            {/* TAB 3: Discover Sri Lanka Showcase */}
            {activeNavTab === 'discover' && (
              <section aria-label="Sri Lanka Cultural and Destination Showcase">
                <DiscoverSriLanka
                  onSelectLocationForScanner={(lat, lng, name) => {
                    setCurrentLocation({
                      latitude: lat,
                      longitude: lng,
                      name: name,
                      region: 'Sri Lanka',
                    });
                    setActiveNavTab('scanner');
                  }}
                />
              </section>
            )}

            {/* TAB 4: Operations & Reservations Portal */}
            {activeNavTab === 'admin' && (
              <section aria-label="Reservations and Operations Portal">
                <AdminBookingAndDbStudio />
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Modern Island Tourism Footer */}
      <Footer
        onSelectNavTab={setActiveNavTab}
        onScrollToBooking={handleScrollToBookingPlanner}
      />

      {/* Floating Travel Assistant & 24/7 Concierge Trigger */}
      {!isAssistantOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
          {/* Subtle invitation chip (desktop) */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 text-slate-200 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md text-[11px] animate-in fade-in slide-in-from-right-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ayubowan! Need Itinerary Help?</span>
          </div>

          <button
            id="btn-floating-assistant"
            onClick={() => handleOpenAssistant()}
            className="p-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-amber-300 cursor-pointer active:scale-95"
            title="Open WayFarer AI Travel Guide & Concierge"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-wider pr-1">
              Ask AI Guide
            </span>
          </button>
        </div>
      )}

      {/* Conversational Travel Assistant Drawer */}
      <TravelAssistantChat
        currentScan={activeResult}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        initialQuestion={assistantInitialQuestion}
        locationName={currentLocation.name}
      />

      {/* Saved Scans & Offline Log Drawer */}
      <SavedScansDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        scans={savedScans}
        onSelectScan={(scan) => {
          setActiveResult(scan);
          setCurrentLocation(scan.location);
        }}
        onToggleBookmark={handleToggleBookmark}
        onDeleteScan={handleDeleteScan}
      />
    </div>
  );
};

export default App;
