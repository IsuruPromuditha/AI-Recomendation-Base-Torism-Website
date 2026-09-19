import React, { useState } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Send,
  X,
  Phone,
  Mail,
  User,
  HeartHandshake,
  Compass,
  FileCheck,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { BookingRecord, SRI_LANKA_TOURS } from '../data/sriLankaContent';
import { CalendarDropdownPicker } from './CalendarDropdownPicker';
import { CustomSelectDropdown } from './CustomSelectDropdown';

interface ModernTourismBookingWidgetProps {
  initialRegion?: string;
  initialTourId?: number;
  onBookingCreated?: (booking: BookingRecord) => void;
  onNavigateToAdmin?: () => void;
}

interface TravelVibePreset {
  id: string;
  name: string;
  icon: string;
  region: string;
  tourId: number;
  duration: number;
  tier: 'Standard' | 'Comfort' | 'Luxury VIP';
}

const TRAVEL_VIBES: TravelVibePreset[] = [
  {
    id: 'sigiriya',
    name: 'Ancient Kingdoms',
    icon: '🏰',
    region: 'Cultural Triangle',
    tourId: 1,
    duration: 7,
    tier: 'Comfort',
  },
  {
    id: 'ella',
    name: 'Highland Tea & Train',
    icon: '🚂',
    region: 'Hill Country',
    tourId: 3,
    duration: 6,
    tier: 'Comfort',
  },
  {
    id: 'mirissa',
    name: 'Coast, Whales & Surf',
    icon: '🌊',
    region: 'Southern Coast',
    tourId: 2,
    duration: 5,
    tier: 'Luxury VIP',
  },
  {
    id: 'yala',
    name: 'Wild Leopard Safari',
    icon: '🐆',
    region: 'Wildlife & Parks',
    tourId: 5,
    duration: 5,
    tier: 'Comfort',
  },
  {
    id: 'grand',
    name: 'Grand All-Island Odyssey',
    icon: '🇱🇰',
    region: 'All Island',
    tourId: 2,
    duration: 10,
    tier: 'Luxury VIP',
  },
];

export const ModernTourismBookingWidget: React.FC<ModernTourismBookingWidgetProps> = ({
  initialRegion,
  initialTourId,
  onBookingCreated,
  onNavigateToAdmin,
}) => {
  // Booking parameters
  const [selectedRegion, setSelectedRegion] = useState<string>(
    initialRegion || 'Cultural Triangle'
  );
  const [selectedTourId, setSelectedTourId] = useState<number>(initialTourId || 1);
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [durationDays, setDurationDays] = useState<number>(7);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [packageTier, setPackageTier] = useState<'Standard' | 'Comfort' | 'Luxury VIP'>('Comfort');

  // Dropdown options
  const tourOptions = SRI_LANKA_TOURS.map((t) => ({
    value: t.id,
    label: t.title,
    sublabel: `${t.duration_days} Days • ${t.difficulty} Pace`,
    badge: `$${t.price_usd}`,
    icon: MapPin,
  }));

  const guestOptions = [
    { value: 1, label: '1 Solo', sublabel: 'Single room', icon: Users },
    { value: 2, label: '2 Couple', sublabel: 'Double room', icon: Users },
    { value: 3, label: '3 Guests', sublabel: 'Triple room', icon: Users },
    { value: 4, label: '4 Family', sublabel: 'Family Suite', icon: Users },
    { value: 6, label: '6+ Group', sublabel: 'Dedicated Van', icon: Users },
  ];

  const durationOptions = [
    { value: 3, label: '3 Days', sublabel: 'Weekend Break', icon: Clock },
    { value: 5, label: '5 Days', sublabel: 'Express Tour', icon: Clock },
    { value: 7, label: '7 Days', sublabel: 'Classic Ceylon', icon: Clock },
    { value: 10, label: '10 Days', sublabel: 'Island Odyssey', icon: Clock },
    { value: 14, label: '14 Days', sublabel: 'Full Grand VIP', icon: Clock },
  ];

  // Modal checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Pick matching tour or default
  const activeTour =
    SRI_LANKA_TOURS.find((t) => t.id === selectedTourId) || SRI_LANKA_TOURS[0];

  // Pricing calculation
  const getTierMultiplier = (tier: 'Standard' | 'Comfort' | 'Luxury VIP') => {
    if (tier === 'Standard') return 1.0;
    if (tier === 'Comfort') return 1.18;
    return 1.45;
  };

  const basePerPerson = Math.round(activeTour.price_usd * (durationDays / activeTour.duration_days));
  const estimatedTotal = Math.round(
    basePerPerson * guestsCount * getTierMultiplier(packageTier)
  );
  const estimatedLkr = estimatedTotal * 310;

  const handleApplyVibe = (vibe: TravelVibePreset) => {
    setSelectedRegion(vibe.region);
    setSelectedTourId(vibe.tourId);
    setDurationDays(vibe.duration);
    setPackageTier(vibe.tier);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !travelDate) {
      alert('Please fill in your name, email, and travel date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: activeTour.id,
          tour_title: `${activeTour.title} (${durationDays} Days - ${selectedRegion})`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          travel_date: travelDate,
          guests_count: guestsCount,
          package_tier: packageTier,
          total_amount_usd: estimatedTotal,
          special_requests: specialRequests,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        if (onBookingCreated) {
          onBookingCreated(data.booking);
        }
      } else {
        alert(data.error || 'Booking submission failed. Please retry.');
      }
    } catch (err: any) {
      console.error('Booking submission error:', err);
      alert('Network error while processing booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="booking-planner" className="relative space-y-4">
      {/* Travel Vibe Selector Strip (Modern Tourism Trend) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider whitespace-nowrap pl-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Curated Vibes:</span>
        </span>
        {TRAVEL_VIBES.map((vibe) => (
          <button
            key={vibe.id}
            type="button"
            onClick={() => handleApplyVibe(vibe)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedRegion === vibe.region
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-[1.02]'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{vibe.icon}</span>
            <span>{vibe.name}</span>
          </button>
        ))}
      </div>

      {/* Main Luxury Tourism Booking Bar / Card */}
      <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Instant Availability Check
              </span>
              <span className="text-xs text-slate-400">Guaranteed Departures • 2026 Season</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
              Reserve Your Sri Lanka Bespoke Tour
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* Comfort Tier Selector */}
            <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2 hidden sm:inline">Tier:</span>
              {(['Standard', 'Comfort', 'Luxury VIP'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setPackageTier(tier)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    packageTier === tier
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Live Quote Pill */}
            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                Total Quote ({guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'})
              </span>
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono leading-tight">
                ${estimatedTotal.toLocaleString()}{' '}
                <span className="text-xs text-slate-400 font-normal">USD</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                ~₨ {estimatedLkr.toLocaleString()} LKR
              </span>
            </div>
          </div>
        </div>

        {/* The 5 Aligned Booking Columns with Same Order and Fixed Sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          {/* 1. Destination / Region Dropdown Box */}
          <CustomSelectDropdown
            id="select-tour-destination"
            label="Destination & Tour"
            icon={MapPin}
            options={tourOptions}
            value={selectedTourId}
            onChange={(tid: number) => {
              setSelectedTourId(tid);
              const tour = SRI_LANKA_TOURS.find((t) => t.id === tid);
              if (tour) setDurationDays(tour.duration_days);
            }}
            helperText={`${activeTour.overview.slice(0, 32)}...`}
          />

          {/* 2. Start Travel Date - User-Friendly Calendar Dropdown Box */}
          <CalendarDropdownPicker
            id="calendar-booking-departure"
            label="Departure Date"
            value={travelDate}
            onChange={(dateStr) => setTravelDate(dateStr)}
            helperText="Flexible • Free cancellation"
          />

          {/* 3. Travelers / Guests Dropdown Box */}
          <CustomSelectDropdown
            id="select-guests-count"
            label="Travelers"
            icon={Users}
            options={guestOptions}
            value={guestsCount}
            onChange={(g: number) => setGuestsCount(g)}
            helperText={guestsCount === 1 ? 'Single Room' : `${guestsCount} Travelers`}
          />

          {/* 4. Duration Dropdown Box */}
          <CustomSelectDropdown
            id="select-duration-days"
            label="Duration"
            icon={Clock}
            options={durationOptions}
            value={durationDays}
            onChange={(d: number) => setDurationDays(d)}
            helperText="Private AC Chauffeur"
          />

          {/* 5. Instant Reserve CTA Box - Fixed Height & Aligned */}
          <div>
            <div className="h-5 flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-1.5 truncate">
                <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span>Confirmation</span>
              </span>
              <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex-shrink-0">
                Instant
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full h-[60px] rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 px-3"
            >
              <span>Instant Reserve</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Trust Badges Strip inside form */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verified Island Chauffeurs</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Boutique Heritage Stays & All Entry Tickets</span>
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>24/7 Island Concierge Assistance</span>
            </span>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            Booking Engine v2.4 • Connected to MySQL
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          MODAL: LUXURY BOOKING CHECKOUT & CONFIRMATION
      ----------------------------------------------------------------------- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setConfirmedBooking(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* If Booking Confirmed */}
            {confirmedBooking ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Reservation Confirmed
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 font-serif">
                    Ayubowan, {confirmedBooking.customer_name}!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                    Your bespoke Sri Lankan expedition has been registered in the database. A confirmation dispatch has been sent to{' '}
                    <strong className="text-amber-400">{confirmedBooking.customer_email}</strong>.
                  </p>
                </div>

                {/* Printable Boarding Voucher */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Booking Reference</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {confirmedBooking.booking_ref}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Package:</span>
                      <span className="text-slate-200 font-bold truncate block">
                        {confirmedBooking.tour_title}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Departure:</span>
                      <span className="text-slate-200 font-bold">{confirmedBooking.travel_date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Guests & Tier:</span>
                      <span className="text-slate-200">
                        {confirmedBooking.guests_count} Guests ({confirmedBooking.package_tier})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Investment:</span>
                      <span className="text-emerald-400 font-bold">
                        ${confirmedBooking.total_amount_usd} USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center pt-2">
                  {onNavigateToAdmin && (
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        onNavigateToAdmin();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>View in Admin Console</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setConfirmedBooking(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Completion Form */
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Step 2: Traveler Information
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif mt-0.5">
                    Complete Your Tour Reservation
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeTour.title} • {durationDays} Days • {guestsCount} Guests ({packageTier})
                  </p>
                </div>

                {/* Price Breakdown Banner */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Confirmed Quote</span>
                    <span className="text-amber-400 font-bold text-base font-mono">
                      ${estimatedTotal} USD
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <span>Departure: </span>
                    <span className="text-slate-200 font-mono font-semibold">{travelDate}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Lead Passenger Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="vance@example.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Phone / WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 019-2834"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Dietary Preferences or Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Vegetarian diet, honeymoon surprise, English-speaking wildlife naturalist guide..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Processing Reservation...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm Reservation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
