import React, { useState } from 'react';
import {
  MapPin,
  Utensils,
  Compass,
  Sparkles,
  Flame,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Heart,
  Globe2,
  TrendingUp,
  ShieldAlert,
  Feather,
  BookOpen,
  Award,
  DollarSign,
  Coffee,
  Gem,
  Shirt,
  Anchor,
  TreePine,
  Activity,
  CheckCircle,
} from 'lucide-react';
import {
  SRI_LANKAN_DESTINATIONS,
  SRI_LANKAN_DISHES,
  SRI_LANKAN_ACTIVITIES,
  SRI_LANKAN_FESTIVALS,
  SRI_LANKAN_RELIGIONS,
  SRI_LANKAN_CULTURE,
  SRI_LANKAN_ECONOMY,
  SriLankanDestination,
} from '../data/sriLankaContent';

interface DiscoverSriLankaProps {
  onSelectLocationForScanner?: (lat: number, lng: number, name: string) => void;
}

export const DiscoverSriLanka: React.FC<DiscoverSriLankaProps> = ({
  onSelectLocationForScanner,
}) => {
  const [activeSection, setActiveSection] = useState<
    'locations' | 'dishes' | 'activities' | 'festivals' | 'religions' | 'culture' | 'economy'
  >('locations');

  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [selectedDestination, setSelectedDestination] = useState<SriLankanDestination | null>(null);

  const sections = [
    { id: 'locations', label: 'Top Locations & Itineraries', icon: MapPin },
    { id: 'dishes', label: 'Famous Dishes & Cuisine', icon: Utensils },
    { id: 'activities', label: 'Top Activities & Adventures', icon: Compass },
    { id: 'festivals', label: 'Cultural Festivals', icon: Calendar },
    { id: 'religions', label: 'Religions & Spiritual Harmony', icon: Heart },
    { id: 'culture', label: 'Culture, Arts & Heritage', icon: Feather },
    { id: 'economy', label: 'Economy, Trade & Industries', icon: TrendingUp },
  ];

  const filteredLocations = SRI_LANKAN_DESTINATIONS.filter((loc) => {
    if (locationFilter === 'All') return true;
    return loc.region === locationFilter;
  });

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------------
          1. LOCATIONS & ITINERARIES SECTION
      ----------------------------------------------------------------------- */}
      {activeSection === 'locations' && (
        <div className="space-y-6">
          {/* Region Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Sri Lanka’s Top Heritage & Coastal Locations</span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore UNESCO ancient capitals, misty highland tea gaps, and southern ocean sanctuaries.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900 p-1 rounded-2xl border border-slate-800">
              {['All', 'Cultural Triangle', 'Hill Country', 'Southern Coast', 'Wildlife & Parks', 'North & East'].map(
                (reg) => (
                  <button
                    key={reg}
                    onClick={() => setLocationFilter(reg)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                      locationFilter === reg
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {reg}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLocations.map((dest) => (
              <div
                key={dest.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-amber-300 backdrop-blur-md border border-slate-700">
                      {dest.region}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] text-amber-400 font-mono">{dest.native_name}</div>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {dest.name}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {dest.highlight}
                    </p>

                    <div className="pt-1 text-[11px] text-slate-400">
                      <span className="text-slate-500">Best Season: </span>
                      <span className="text-slate-300 font-medium">{dest.best_time}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {dest.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-400 border border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {onSelectLocationForScanner && (
                    <button
                      onClick={() =>
                        onSelectLocationForScanner(
                          dest.coordinates.lat,
                          dest.coordinates.lng,
                          dest.name
                        )
                      }
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
                      <span>Set Scanner Location</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2. FAMOUS SRI LANKAN DISHES
      ----------------------------------------------------------------------- */}
      {activeSection === 'dishes' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-400" />
              <span>Sri Lankan Famous Dishes & Spice Heritage</span>
            </h3>
            <p className="text-xs text-slate-400">
              Centuries of spice trading, coconut curries, clay pot slow-cooking, and street food traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SRI_LANKAN_DISHES.map((dish) => (
              <div
                key={dish.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-amber-300 backdrop-blur-md border border-slate-700">
                      {dish.type}
                    </span>

                    {/* Spice Meter */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 mr-1 font-mono">Heat:</span>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Flame
                          key={idx}
                          className={`w-3 h-3 ${
                            idx < dish.spice_level ? 'text-red-500 fill-red-500' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-xs text-amber-300 font-mono block">
                        {dish.sinhala_name} • {dish.tamil_name}
                      </span>
                      <h4 className="text-base font-bold text-white drop-shadow-md">{dish.name}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{dish.cultural_story}"
                    </p>

                    {/* Ingredients */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Key Ingredients
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {dish.key_ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-300 border border-slate-800"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* How to eat */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="text-amber-400 font-semibold block mb-0.5">How to Eat:</span>
                      {dish.how_to_eat}
                    </div>
                  </div>
                </div>

                {/* Allergen Warning Banner */}
                {dish.allergens.length > 0 && (
                  <div className="px-4 py-2.5 bg-amber-500/10 border-t border-amber-500/20 text-[10px] text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Allergens: {dish.allergens.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          3. TOP ACTIVITIES & ADVENTURES
      ----------------------------------------------------------------------- */}
      {activeSection === 'activities' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Sri Lanka’s Top Bucket-List Adventures</span>
            </h3>
            <p className="text-xs text-slate-400">
              From colonial blue steam train journeys to blue whale oceanic encounters and world-class surf breaks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SRI_LANKAN_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                      {act.category}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900/90 text-slate-300 border border-slate-700">
                      {act.duration}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{act.location}</span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> Insider Local Tip
                    </div>
                    <p>{act.insider_tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          4. CULTURAL FESTIVALS
      ----------------------------------------------------------------------- */}
      {activeSection === 'festivals' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Spectacular Cultural & Religious Pageants</span>
            </h3>
            <p className="text-xs text-slate-400">
              Vibrant festivals celebrated with ancient temple processions, torch-lit fire dancers, and nationwide hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SRI_LANKAN_FESTIVALS.map((fest) => (
              <div
                key={fest.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                    <img
                      src={fest.image}
                      alt={fest.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold block">
                        {fest.religion_culture}
                      </span>
                      <h4 className="text-lg font-bold text-white leading-snug">{fest.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                        <span>🗓️ {fest.month}</span>
                        <span>📍 {fest.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {fest.description}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Core Rituals & Traditions
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {fest.traditions.map((tr, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{tr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          5. RELIGIONS & SPIRITUAL HARMONY
      ----------------------------------------------------------------------- */}
      {activeSection === 'religions' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-400" />
              <span>Sri Lanka's 4 Major World Religions & Spiritual Coexistence</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              For over two millennia, Buddhists, Hindus, Muslims, and Christians have lived alongside each other, often worshiping together at shared sacred shrines like Sri Pada (Adam's Peak) and Kataragama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SRI_LANKAN_RELIGIONS.map((rel) => (
              <div
                key={rel.name}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] text-amber-400 font-mono block">
                      {rel.sinhala_title}
                    </span>
                    <h4 className="text-lg font-bold text-white">{rel.name}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {rel.percentage}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rel.overview}</p>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Sacred Island Sites
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rel.sacred_sites.map((site, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 text-xs text-slate-300 border border-slate-800 font-medium"
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider">
                    🤝 Harmony & Shared Heritage
                  </span>
                  <p>{rel.harmony_note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          6. LIVING CULTURE, ARTS & HERITAGE
      ----------------------------------------------------------------------- */}
      {activeSection === 'culture' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Feather className="w-5 h-5 text-amber-400" />
              <span>Living Culture, Traditional Arts & Tropical Modernism</span>
            </h3>
            <p className="text-xs text-slate-400">
              Preserving ancient Kandyan drums, mask carving, hydraulic architecture, and indigenous healing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Dance */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>🥁 Traditional Dance Styles</span>
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                {SRI_LANKAN_CULTURE.traditional_dance.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-100 block mb-1">{item.title}</span>
                    <p className="leading-relaxed text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditional Crafts */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>🎨 Ancient Handicrafts</span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                {SRI_LANKAN_CULTURE.traditional_crafts.map((craft, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-100 block mb-0.5">{craft.title}</span>
                    <p className="leading-relaxed text-slate-300">{craft.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ayurveda */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>🌿 {SRI_LANKAN_CULTURE.indigenous_ayurveda.title}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {SRI_LANKAN_CULTURE.indigenous_ayurveda.desc}
              </p>
            </div>

            {/* Architecture */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
              <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>🏛️ {SRI_LANKAN_CULTURE.architecture.title}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {SRI_LANKAN_CULTURE.architecture.desc}
              </p>
            </div>
          </div>

          {/* Etiquette Tips Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Essential Sri Lankan Social Customs & Traveler Etiquette</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              {SRI_LANKAN_CULTURE.island_etiquette.map((tip, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold text-sm">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          7. ECONOMY, TRADE & CEYLON INDUSTRIES
      ----------------------------------------------------------------------- */}
      {activeSection === 'economy' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-transparent border border-blue-500/20 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Economic Profile
                </span>
                <h3 className="text-lg font-bold text-white">
                  Sri Lanka Economy, Global Exports & Strategic Position
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mt-1">
                  {SRI_LANKAN_ECONOMY.strategic_location}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 block">Currency</span>
                <span className="text-base font-black text-amber-400">
                  {SRI_LANKAN_ECONOMY.currency.code} ({SRI_LANKAN_ECONOMY.currency.symbol})
                </span>
                <span className="text-[10px] text-slate-500 block">Sri Lankan Rupee</span>
              </div>
            </div>
          </div>

          {/* Key Export Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SRI_LANKAN_ECONOMY.key_pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h4 className="text-sm font-bold text-white">{pillar.name}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-400 block mt-2">
                    {pillar.share_importance}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">{pillar.highlight}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-500">Key Production Centers: </span>
                  <span className="text-slate-300 font-medium">{pillar.regions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
