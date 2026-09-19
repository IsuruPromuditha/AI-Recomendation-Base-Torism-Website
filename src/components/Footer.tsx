import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Heart,
  Calendar,
  Send,
  ArrowUpRight,
  Globe,
  Lock,
} from 'lucide-react';

interface FooterProps {
  onSelectNavTab?: (tab: 'scanner' | 'tours' | 'discover' | 'admin') => void;
  onScrollToBooking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectNavTab, onScrollToBooking }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/90 text-slate-300 pt-12 pb-8 mt-12 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Section: Brand Manifesto & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5 font-serif">
                  WayFarer <span className="text-amber-400 font-sans">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/80 block">
                  Sri Lanka Bespoke Luxury Expeditions
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              Crafting conscious, private expeditions across the resplendent teardrop island. From UNESCO royal cloud citadels and high-altitude colonial tea trains to untamed coastal leopard biospheres and sacred Buddhist reliquaries. Officially registered with the Sri Lanka Tourism Development Authority.
            </p>

            {/* Official Licensing Chip */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>SLTDA License #SLTDA/SQA/DMC/2026/048</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Safe & Secure Level 1 Certified</span>
              </span>
            </div>
          </div>

          {/* Newsletter / Seasonal Ceylon Dispatch */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-amber-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-block">
                Exclusive Ceylon Dispatch
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white font-serif">
                Join 28,000+ Discerning Explorers
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive confidential seasonal wildlife migration alerts, private villa openings, secret tea harvest tastings, and bespoke tour privileges.
              </p>
            </div>

            <div className="pt-4">
              {subscribed ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Ayubowan! You are confirmed for our 2026 private Ceylon dispatches.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your private email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Middle Columns: Navigation, Expeditions, Culture & Emergency Hotlines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          {/* Column 1: Curated Expeditions */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider font-serif border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Signature Journeys</span>
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('tours')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Grand Cultural Triangle & Sigiriya (7 Days)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('tours')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Ceylon Tea Trails & Ella Blue Train (6 Days)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('tours')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Southern Ocean Safari & Galle Fort (5 Days)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('tours')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Wild Yala Leopard & Elephant Quest (5 Days)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('tours')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Jaffna Northern Monarchy & Palmyra Realm (4 Days)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Living Culture & Discoveries */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider font-serif border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Island Heritage</span>
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('discover')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Sacred Temple of the Tooth & Esala Perahera
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('discover')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Authentic Ceylon Gastronomy & Spice Trails
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('discover')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Traditional Kandyan Performing Arts & Masks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('discover')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Hela Wedakama Indigenous Ayurvedic Healing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('discover')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Ceylon Blue Sapphire & Gemological Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Intelligent Platform Tools */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider font-serif border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Traveler Utilities</span>
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('scanner')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Native Sinhala & Tamil Script OCR Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('scanner')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Street Food Allergen & Heat Meter Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToBooking}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Real-time USD & LKR Tour Cost Estimator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavTab && onSelectNavTab('admin')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 text-amber-300 font-semibold"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Admin Panel & MySQL Studio Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency & Official Contacts */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider font-serif border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>24/7 Island Hotlines</span>
            </h5>
            <div className="space-y-2.5">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">
                    Tourist Police (24/7 Toll-Free)
                  </span>
                  <span className="text-white font-bold font-mono">1912 / +94 11 242 1052</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                  Active
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">
                  Suwaseriya Free National Ambulance
                </span>
                <span className="text-white font-bold font-mono">1990</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">
                  Bandaranaike Int'l Airport (CMB)
                </span>
                <span className="text-white font-bold font-mono">+94 11 225 2861</span>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                <span>Head Office: </span>
                <span className="text-slate-300 font-medium">
                  York Street, Fort, Colombo 01, Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Certifications, Payment Badges & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-400">© 2026 WayFarer AI Travel Technologies Ltd.</span>
            <span>•</span>
            <span>All Rights Reserved</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Expedition</span>
          </div>

          {/* Payment & Security Trust Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-mono text-slate-500">Secure Payments:</span>
            {['Visa', 'MasterCard', 'AMEX', 'Apple Pay', 'LankaPay'].map((pm) => (
              <span
                key={pm}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
