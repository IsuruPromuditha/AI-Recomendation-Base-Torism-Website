import React, { useState, useEffect } from 'react';
import {
  Compass,
  Smartphone,
  Maximize2,
  Menu,
  X,
  Lock,
  ShieldCheck,
  Phone,
  Clock,
  CalendarCheck,
  Landmark,
  Camera,
  Coins,
  SunMedium,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  isOnline: boolean;
  activeNavTab?: 'scanner' | 'tours' | 'discover' | 'admin';
  onSelectNavTab?: (tab: 'scanner' | 'tours' | 'discover' | 'admin') => void;
  onOpenBookingForm?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  onToggleMobileFrame,
  isOnline,
  activeNavTab = 'scanner',
  onSelectNavTab,
  onOpenBookingForm,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check admin session status
  useEffect(() => {
    const checkAuth = () => {
      setIsAdminAuthenticated(localStorage.getItem('wayfarer_admin_auth') === 'true');
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [activeNavTab]);

  const navItems = [
    {
      id: 'scanner' as const,
      label: 'Vision Scanner',
      icon: Camera,
      tag: 'Multimodal AI',
    },
    {
      id: 'tours' as const,
      label: 'Expeditions & Tours',
      icon: Compass,
      tag: 'Bespoke Packages',
    },
    {
      id: 'discover' as const,
      label: 'Discover Sri Lanka',
      icon: Landmark,
      tag: 'Heritage & Food',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/90 text-slate-100 shadow-xl">
      {/* 1. TOP UTILITY STRIP - Clean, single-line, responsive */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 text-[11px] text-slate-400 py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 text-xs">
          {/* Left: Island Weather & Local Time */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 min-w-0">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium truncate">
              <SunMedium className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">
                Sri Lanka: <strong className="text-white">29°C</strong> Colombo
                <span className="hidden sm:inline"> • <strong className="text-white">21°C</strong> Ella</span>
              </span>
            </div>

            <span className="hidden md:inline text-slate-700">|</span>

            <div className="hidden md:flex items-center gap-1 text-slate-400 whitespace-nowrap">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>UTC+5:30 (IST)</span>
            </div>

            <span className="hidden lg:inline text-slate-700">|</span>

            <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] text-slate-400 whitespace-nowrap">
              <Coins className="w-3 h-3 text-emerald-400" />
              <span>1 USD ≈ 310.50 LKR</span>
              <span className="text-emerald-400 font-bold">● Live</span>
            </div>
          </div>

          {/* Right: Tourist Police 24/7 Hotline & SLTDA Assurance */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              id="link-tourist-police-top"
              href="tel:1912"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-[10px] sm:text-xs border border-amber-500/20 transition-colors"
              title="Official Sri Lanka Tourist Police 24/7 Emergency Line"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Police: <strong className="text-white">1912</strong></span>
            </a>

            <span className="hidden sm:inline text-slate-700">|</span>

            <div className="hidden sm:flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SLTDA Certified DMC</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY NAVIGATION HEADER BAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
          <button
            id="btn-brand-logo"
            type="button"
            onClick={() => onSelectNavTab && onSelectNavTab('scanner')}
            className="group flex items-center gap-2 sm:gap-3 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1 font-serif">
                  WayFarer <span className="text-amber-400 font-sans font-bold">AI</span>
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Ceylon Expeditions
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate hidden md:block">
                Multimodal Vision • Heritage OCR • Bespoke Tour Engine
              </p>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Bar Links */}
        {onSelectNavTab && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
            {navItems.map((tab) => {
              const isActive = activeNavTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`nav-item-${tab.id}`}
                  onClick={() => onSelectNavTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{tab.label}</span>
                  {tab.tag && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono tracking-tight ${
                        isActive ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.tag}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Trip Planner Link */}
            {onOpenBookingForm && (
              <button
                id="btn-nav-plan-trip"
                onClick={onOpenBookingForm}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Plan Trip</span>
              </button>
            )}
          </nav>
        )}

        {/* Right: Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Staff Reservations Portal (Only visible if authenticated officer) */}
          {isAdminAuthenticated && (
            <button
              onClick={() => onSelectNavTab && onSelectNavTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                activeNavTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800'
              }`}
              title="Reservations Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Reservations</span>
            </button>
          )}

          {/* Online Connection Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-mono text-[10px]">
              {isOnline ? 'Cloud AI Ready' : 'Offline Cache'}
            </span>
          </div>

          {/* Desktop Mobile Frame Preview Toggle */}
          <button
            id="btn-toggle-frame"
            type="button"
            onClick={onToggleMobileFrame}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer text-xs"
            title={isMobileFrame ? 'Switch to Full Screen Layout' : 'Preview Mobile Companion Frame'}
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[11px]">Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Mobile Frame</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            id="btn-mobile-hamburger"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer transition-colors active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE SLIDEOUT / ACCORDION NAVIGATION MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
          {/* Mobile Instant Trip Reservation CTA */}
          {onOpenBookingForm && (
            <button
              id="btn-mobile-drawer-book"
              type="button"
              onClick={() => {
                onOpenBookingForm();
                setIsMobileMenuOpen(false);
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-between cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-5 h-5 text-slate-950" />
                <div className="text-left">
                  <div className="leading-tight">Plan & Book Island Tour</div>
                  <div className="text-[10px] font-medium text-slate-900/80">Live USD & LKR Quotes • Instant Voucher</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          )}

          {/* Navigation Section */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-mono text-amber-400 font-bold px-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Platform Modules</span>
            </p>

            <div className="grid grid-cols-1 gap-2">
              {navItems.map((tab) => {
                const isActive = activeNavTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`btn-mobile-nav-${tab.id}`}
                    type="button"
                    onClick={() => {
                      if (onSelectNavTab) onSelectNavTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">{tab.label}</div>
                        <div className={`text-[10px] ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                          {tab.tag}
                        </div>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency & Official Hotline Strip */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Tourist Police 24/7</div>
                  <div className="text-[10px] text-slate-400">Official Toll-Free Hotline</div>
                </div>
              </div>
              <a
                href="tel:1912"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors"
              >
                Call 1912
              </a>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SLTDA License Verified</span>
              </span>
              <span>Suwaseriya Ambulance: <strong className="text-white">1990</strong></span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
