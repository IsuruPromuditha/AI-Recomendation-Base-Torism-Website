import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  Calendar,
  Sparkles,
  Compass,
  ArrowUpRight,
  Shield,
  Star,
  Camera,
  Layers,
  Thermometer,
  Mountain,
} from 'lucide-react';

export interface HeroSlide {
  id: string;
  title: string;
  headline: string;
  subtitle: string;
  region: string;
  location: string;
  badge: string;
  rating: string;
  elevation: string;
  temp: string;
  description: string;
  image: string;
  tourId: number;
  highlightTag: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'sigiriya',
    title: 'Sigiriya Lion Rock Citadel',
    headline: 'Ascend The Eighth Wonder Suspended in the Clouds',
    subtitle: '5th-Century UNESCO Royal Sky Palace & Ancient Water Gardens',
    region: 'Cultural Triangle',
    location: 'Matale District, Central Province',
    badge: 'UNESCO World Heritage',
    rating: '4.98 (8.4k reviews)',
    elevation: '370m Pinnacle',
    temp: '28°C Tropical Warmth',
    description:
      'Climb King Kashyapa’s 1,200 steps past ancient golden frescoes and gigantic carved lion paws to the summit palace overlooking endless virgin green jungle canopy.',
    image:
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1600&auto=format&fit=crop&q=85',
    tourId: 1,
    highlightTag: 'Ancient Monarchy',
  },
  {
    id: 'ella-train',
    title: 'Ella Scenic Mountain Railway',
    headline: 'The World’s Most Enchanting High-Altitude Train Odyssey',
    subtitle: 'Demodara Nine Arch Bridge & Emerald Ceylon Tea Terraces',
    region: 'Hill Country',
    location: 'Ella Gap, Uva Province',
    badge: 'Conde Nast Top 10 Train Journeys',
    rating: '4.99 (12.1k reviews)',
    elevation: '1,041m Misty Gap',
    temp: '20°C Crisp Highland Air',
    description:
      'Board the legendary colonial blue mountain train through cloud forests, roaring waterfall gorges, and century-old stone viaducts carved into emerald tea mountains.',
    image:
      'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1600&auto=format&fit=crop&q=85',
    tourId: 3,
    highlightTag: 'Iconic Ceylon Rail',
  },
  {
    id: 'mirissa-ocean',
    title: 'Mirissa & Southern Golden Coast',
    headline: 'Turquoise Indian Ocean Horizons & Blue Whale Encounters',
    subtitle: 'Stilt Fishermen, Coconut Tree Hill & Coastal Colonial Forts',
    region: 'Southern Coast',
    location: 'Mirissa & Galle, Southern Province',
    badge: 'Premier Marine Sanctuary',
    rating: '4.95 (9.2k reviews)',
    elevation: 'Sea Level Coast',
    temp: '29°C Ocean Sunset',
    description:
      'Cruise into deep waters where gentle blue giants breach at dawn, then watch the golden twilight cast silhouetted palms over historic 17th-century cobblestone Galle Fort bastions.',
    image:
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&auto=format&fit=crop&q=85',
    tourId: 2,
    highlightTag: 'Ocean Safari & Surf',
  },
  {
    id: 'kandy-temple',
    title: 'Sacred Temple of the Tooth',
    headline: 'The Spiritual Heart & Royal Heritage of the Island',
    subtitle: 'Golden Roof Reliquary & Centuries of Kandyan Drum Rhythms',
    region: 'Cultural Triangle',
    location: 'Kandy Lake, Central Province',
    badge: 'Living Buddhist World Sanctuary',
    rating: '4.97 (10.5k reviews)',
    elevation: '500m Valley',
    temp: '24°C Evening Breeze',
    description:
      'Experience the sacred evening pooja ceremonies adorned with white jasmine blooms, brass oil lamps, and hereditary Kandyan dancers beside the misty waters of royal Kandy Lake.',
    image:
      'https://images.unsplash.com/photo-1588598198321-9735fd52455d?w=1600&auto=format&fit=crop&q=85',
    tourId: 1,
    highlightTag: 'Sacred Relic',
  },
  {
    id: 'yala-wildlife',
    title: 'Yala Untamed Leopard Sanctuary',
    headline: 'Track Ceylon Leopards Across Wild Coastal Jungles',
    subtitle: 'Earth’s Highest Density of Wild Leopards & Elephants',
    region: 'Wildlife & Parks',
    location: 'Yala National Park, Southern Province',
    badge: 'Top Wildlife Biosphere',
    rating: '4.94 (7.6k reviews)',
    elevation: '30m Coastline',
    temp: '31°C Savannah Sun',
    description:
      'Set out on early morning 4x4 open-top safari expeditions across coastal scrublands, waterhole lagoons, and granite boulders to track wild leopards, sloth bears, and elephant herds.',
    image:
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1600&auto=format&fit=crop&q=85',
    tourId: 5,
    highlightTag: 'Wild Leopard Safari',
  },
];

interface HeroSlideshowProps {
  onBookExperience: (tourId?: number, region?: string) => void;
  onOpenScanner: () => void;
  onScrollToBookingForm: () => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  onBookExperience,
  onOpenScanner,
  onScrollToBookingForm,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);

  const SLIDE_DURATION = 6000; // 6 seconds per slide
  const currentSlide = HERO_SLIDES[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);
    const intervalTime = 100;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  };

  const handleSelectSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 group">
      {/* Background Slides with smooth crossfade */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] min-h-[460px] sm:min-h-[520px] w-full overflow-hidden bg-slate-950">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] transition-transform duration-7000 ease-linear scale-105"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          </div>
        ))}

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950/80 to-transparent z-20 pointer-events-none" />

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-8 md:p-10 text-white">
          {/* Top Metadata Bar inside Hero */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentSlide.badge}</span>
              </span>

              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-amber-300 border border-slate-700/80 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{currentSlide.region}</span>
              </span>

              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/60 backdrop-blur-md text-slate-300 border border-slate-800">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{currentSlide.rating}</span>
              </span>
            </div>

            {/* Weather / Elevation telemetry */}
            <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3 text-amber-400" />
                <span>{currentSlide.elevation}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Thermometer className="w-3 h-3" />
                <span>{currentSlide.temp}</span>
              </span>
            </div>
          </div>

          {/* Central Main Headline & Story */}
          <div className="max-w-2xl space-y-3 sm:space-y-4 my-auto">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 font-mono tracking-wide">
              <span>{currentSlide.location}</span>
              <span>—</span>
              <span className="text-amber-400 font-bold uppercase">{currentSlide.highlightTag}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-lg font-serif">
              {currentSlide.headline}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-xl font-normal drop-shadow">
              {currentSlide.description}
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onBookExperience(currentSlide.tourId, currentSlide.region)}
                className="px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Book This Expedition</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToBookingForm}
                className="px-4 sm:px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-slate-100 hover:text-white border border-amber-500/40 text-xs sm:text-sm font-bold backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Trip Planner & Rates</span>
              </button>

              <button
                onClick={onOpenScanner}
                className="hidden md:flex px-4 py-3 rounded-2xl bg-slate-950/60 hover:bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold backdrop-blur-md transition-all items-center gap-2 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Scan Landmark with AI</span>
              </button>
            </div>
          </div>

          {/* Bottom Bar: Slide Selectors, Progress Line & Navigation Controls */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            {/* Slide Progress Line */}
            <div className="w-full bg-slate-800/80 h-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Thumbnail slide selectors */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => handleSelectSlide(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-slate-900/95 border border-amber-500/80 text-white shadow-md'
                          : 'bg-slate-950/50 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                      }`}
                    >
                      <span
                        className={`text-xs font-mono font-bold ${
                          isActive ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold hidden sm:inline">
                        {slide.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next & Pause Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
                  aria-label={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
                  title="Previous slide"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
                  title="Next slide"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
