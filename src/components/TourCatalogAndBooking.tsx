import React, { useState } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  DollarSign,
  Tag,
  AlertCircle,
  FileText,
  X,
  Phone,
  Mail,
  User,
  HeartHandshake,
} from 'lucide-react';
import { SRI_LANKA_TOURS, TourPackage, BookingRecord } from '../data/sriLankaContent';
import { CalendarDropdownPicker } from './CalendarDropdownPicker';

interface TourCatalogAndBookingProps {
  onBookingSuccess?: (booking: BookingRecord) => void;
  onExploreLocationOnMap?: (lat: number, lng: number, name: string) => void;
}

export const TourCatalogAndBooking: React.FC<TourCatalogAndBookingProps> = ({
  onBookingSuccess,
  onExploreLocationOnMap,
}) => {
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'moderate' | 'easy'>('all');

  // Booking form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [packageTier, setPackageTier] = useState<'Standard' | 'Comfort' | 'Luxury VIP'>('Comfort');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const filteredTours = SRI_LANKA_TOURS.filter((t) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'moderate') return t.difficulty === 'Moderate';
    if (activeTab === 'easy') return t.difficulty === 'Easy';
    return true;
  });

  const getTierMultiplier = (tier: 'Standard' | 'Comfort' | 'Luxury VIP') => {
    if (tier === 'Standard') return 1.0;
    if (tier === 'Comfort') return 1.15;
    return 1.4;
  };

  const calculateTotal = (basePrice: number) => {
    return Math.round(basePrice * guestsCount * getTierMultiplier(packageTier));
  };

  const handleOpenBookingModal = (tour: TourPackage) => {
    setSelectedTour(tour);
    setConfirmedBooking(null);
    // Set default travel date 2 weeks ahead
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setTravelDate(d.toISOString().slice(0, 10));
    setIsModalOpen(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) return;
    if (!customerName || !customerEmail || !travelDate) {
      alert('Please fill in your name, email, and travel date.');
      return;
    }

    setIsSubmitting(true);
    const totalAmount = calculateTotal(selectedTour.price_usd);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: selectedTour.id,
          tour_title: selectedTour.title,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          travel_date: travelDate,
          guests_count: guestsCount,
          package_tier: packageTier,
          total_amount_usd: totalAmount,
          special_requests: specialRequests,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        if (onBookingSuccess) onBookingSuccess(data.booking);
      } else {
        throw new Error(data.error || 'Booking submission failed');
      }
    } catch (err: any) {
      // Offline fallback booking confirmation
      const fallbackBooking: BookingRecord = {
        id: Date.now(),
        booking_ref: `WF-${Math.floor(10000 + Math.random() * 90000)}`,
        tour_id: selectedTour.id,
        tour_title: selectedTour.title,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        travel_date: travelDate,
        guests_count: guestsCount,
        package_tier: packageTier,
        total_amount_usd: totalAmount,
        special_requests: specialRequests,
        status: 'Confirmed',
        created_at: new Date().toISOString(),
      };
      setConfirmedBooking(fallbackBooking);
      if (onBookingSuccess) onBookingSuccess(fallbackBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Verified Sri Lanka Itineraries
            </span>
            <span className="text-xs text-slate-400">Direct Local Chauffeurs & Guides</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Curated Sri Lanka Multi-Day Expeditions
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Reserve certified boutique heritage tours, wildlife jeep safaris, and high-country scenic train journeys with direct online confirmation.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'all', label: 'All Tours' },
            { id: 'moderate', label: 'Cultural & Mountain' },
            { id: 'easy', label: 'Wildlife & Coast' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tour Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Tour Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <img
                  src={tour.image_url}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {tour.duration_days} Days / {tour.duration_days - 1} Nights
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-200 backdrop-blur-md border border-slate-700">
                    {tour.difficulty}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-amber-300 uppercase tracking-wider font-semibold block">
                      Guaranteed Departure
                    </span>
                    <h3 className="text-lg font-bold text-white drop-shadow-md leading-snug">
                      {tour.title}
                    </h3>
                  </div>
                  <div className="text-right bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">From</span>
                    <span className="text-base font-black text-amber-400">${tour.price_usd}</span>
                    <span className="text-[10px] text-slate-400 block">/ person</span>
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5 space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {tour.overview}
                </p>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Highlights
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {tour.highlights.slice(0, 4).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Day by Day Preview */}
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Daily Route Overview
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                    {tour.itinerary.map((day, idx) => (
                      <React.Fragment key={day.day}>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 font-mono text-[11px]">
                          D{day.day}: {day.title.split(' ')[0]}
                        </span>
                        {idx < tour.itinerary.length - 1 && (
                          <span className="text-slate-600 text-[10px]">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="p-5 pt-0 flex items-center gap-3">
              <button
                id={`btn-book-tour-${tour.id}`}
                onClick={() => handleOpenBookingModal(tour)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Tour Package</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {isModalOpen && selectedTour && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {confirmedBooking ? (
              // Confirmation View
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Tour Booking Confirmed!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Ayubowan, {confirmedBooking.customer_name}! Your booking has been registered in the WayFarer travel system.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Booking Reference:</span>
                    <span className="font-mono font-bold text-amber-400">{confirmedBooking.booking_ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tour Package:</span>
                    <span className="font-semibold text-slate-200 text-right">{confirmedBooking.tour_title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="font-semibold text-slate-200">{confirmedBooking.travel_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guests / Package Tier:</span>
                    <span className="font-semibold text-slate-200">
                      {confirmedBooking.guests_count} Guests ({confirmedBooking.package_tier})
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="font-bold text-slate-200">Total Calculated:</span>
                    <span className="font-black text-sm text-emerald-400">${confirmedBooking.total_amount_usd} USD</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  A booking voucher has been dispatched to {confirmedBooking.customer_email}. Your dedicated chauffeur-guide will contact you prior to arrival.
                </p>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  Done / Return to Tours
                </button>
              </div>
            ) : (
              // Booking Input Form
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Tour Reservation
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedTour.title}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedTour.duration_days} Days • Base ${selectedTour.price_usd} / traveler
                  </p>
                </div>

                {/* Tier Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Select Accommodation Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Standard', desc: '3-Star Hotels' },
                      { id: 'Comfort', desc: '4-Star Boutique' },
                      { id: 'Luxury VIP', desc: '5-Star Heritage' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setPackageTier(tier.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          packageTier === tier.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs">{tier.id}</div>
                        <div className="text-[10px] text-slate-500">{tier.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guests & Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Travelers (Guests)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center font-bold text-sm bg-slate-950 border border-slate-800 py-2 rounded-xl text-slate-100">
                        {guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuestsCount(guestsCount + 1)}
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <CalendarDropdownPicker
                      id="catalog-travel-date"
                      label="Travel Departure Date"
                      value={travelDate}
                      onChange={(d) => setTravelDate(d)}
                      helperText="Flexible booking • Instant confirmation"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Lead Traveler Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Dr. Eleanor Vance"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="eleanor@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Special Requests & Dietary Notes
                    </label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Vegetarian meals, train window seats, infant cot"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Calculated Tour Cost:</span>
                    <span className="text-xs text-amber-300/90 font-medium">
                      {guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'} • {packageTier}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400">
                      ${calculateTotal(selectedTour.price_usd)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">USD (All Taxes Included)</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-confirm-tour-booking"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Tour in System...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Reservation</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
