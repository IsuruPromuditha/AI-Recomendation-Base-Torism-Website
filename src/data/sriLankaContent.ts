export interface TourPackage {
  id: number;
  title: string;
  slug: string;
  duration_days: number;
  price_usd: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  highlights: string[];
  included: string[];
  image_url: string;
  is_featured: boolean;
  overview: string;
  itinerary: { day: number; title: string; desc: string; stay: string }[];
}

export interface BookingRecord {
  id: number;
  booking_ref: string;
  tour_id: number;
  tour_title?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date: string;
  guests_count: number;
  package_tier: 'Standard' | 'Comfort' | 'Luxury VIP';
  total_amount_usd: number;
  special_requests?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface SriLankanDestination {
  id: string;
  name: string;
  native_name: string;
  region: 'Cultural Triangle' | 'Hill Country' | 'Southern Coast' | 'Wildlife & Parks' | 'North & East' | 'West & Colombo';
  province: string;
  image: string;
  best_time: string;
  highlight: string;
  description: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
}

export interface SriLankanDish {
  id: string;
  name: string;
  sinhala_name: string;
  tamil_name: string;
  image: string;
  spice_level: number; // 1 to 5
  type: 'Street Food' | 'Main Dish' | 'Breakfast Staple' | 'Dessert' | 'Condiment';
  key_ingredients: string[];
  allergens: string[];
  cultural_story: string;
  how_to_eat: string;
}

export interface TopActivity {
  id: string;
  title: string;
  location: string;
  category: 'Adventure' | 'Nature & Safari' | 'Heritage & Culture' | 'Wellness';
  duration: string;
  image: string;
  description: string;
  insider_tip: string;
}

export interface CulturalFestival {
  id: string;
  name: string;
  month: string;
  religion_culture: string;
  location: string;
  image: string;
  description: string;
  traditions: string[];
}

export interface ReligiousHeritage {
  name: string;
  percentage: string;
  sinhala_title: string;
  overview: string;
  sacred_sites: string[];
  traditions: string;
  harmony_note: string;
}

// -----------------------------------------------------------------------------
// TOURS & PACKAGES
// -----------------------------------------------------------------------------
export const SRI_LANKA_TOURS: TourPackage[] = [
  {
    id: 1,
    title: '7-Day Golden Triangle & Misty Hill Country',
    slug: 'golden-triangle-hill-country',
    duration_days: 7,
    price_usd: 890,
    difficulty: 'Moderate',
    highlights: [
      'Sigiriya 5th-Century Lion Rock Fortress climb',
      'Golden Dambulla Cave Monasteries & Frescoes',
      'Sacred Tooth Relic Temple (Sri Dalada Maligawa) in Kandy',
      'Iconic Scenic Ella Mountain Train Ride through tea valleys',
      'Nine Arch Demodara Bridge & Little Adam Peak sunset',
    ],
    included: [
      'Air-conditioned private luxury vehicle with English-speaking chauffeur',
      '6 nights in 4-Star boutique heritage hotels',
      'Daily authentic breakfast & gourmet dinners',
      'All government monument entry tickets & permits',
      'Reserved first-class scenic train carriage ticket',
    ],
    image_url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    overview: 'The quintessential Sri Lankan expedition combining ancient royal civilizations, UNESCO World Heritage monoliths, and the emerald tea plantation peaks of the central highlands.',
    itinerary: [
      { day: 1, title: 'Arrival & Cultural Heartland', desc: 'Arrive at Bandaranaike Airport. Scenic drive to Sigiriya citadel through coconut palms.', stay: 'Sigiriya Eco Haven' },
      { day: 2, title: 'Sigiriya Rock & Minneriya Safari', desc: 'Morning ascent of King Kashyapa’s sky citadel. Afternoon open-top jeep safari to spot the world-famous Minneriya Elephant Gathering.', stay: 'Sigiriya Eco Haven' },
      { day: 3, title: 'Dambulla Caves to Royal Kandy', desc: 'Explore 2,000-year-old painted cave grottos in Dambulla. Continue to Kandy; attend evening Kandyan drummers & dancers.', stay: 'Earl’s Regency Kandy' },
      { day: 4, title: 'Sacred Tooth Temple & Royal Botanical Gardens', desc: 'Participate in morning pooja at the Temple of the Sacred Tooth. Stroll the towering Royal Palm avenues at Peradeniya.', stay: 'Earl’s Regency Kandy' },
      { day: 5, title: 'World’s Most Scenic Train Ride to Ella', desc: 'Board the iconic blue mountain train winding past roaring waterfalls, mist-draped valleys, and lush tea estates.', stay: '98 Acres Luxury Resort Ella' },
      { day: 6, title: 'Demodara Nine Arch Bridge & Ravana Falls', desc: 'Hike to the colonial railway engineering marvel at sunrise. Cool off near the thunderous Ravana waterfall.', stay: '98 Acres Luxury Resort Ella' },
      { day: 7, title: 'Descent to Coast & Departure', desc: 'Scenic journey down to Colombo / airport with stops at artisan gem cutting workshops.', stay: 'Departure' },
    ],
  },
  {
    id: 2,
    title: '10-Day Complete Pearl Island Explorer',
    slug: 'complete-pearl-island-explorer',
    duration_days: 10,
    price_usd: 1350,
    difficulty: 'Moderate',
    highlights: [
      'Anuradhapura 2,500-year sacred Bodhi tree & white stupas',
      'Sigiriya & Polonnaruwa medieval royal capital',
      'Nuwara Eliya Little England tea factories & strawberry farms',
      'Yala National Park highest density Leopard safari',
      'UNESCO 17th-century Galle Dutch Fort sunset walk',
    ],
    included: [
      'Dedicated government-licensed national tour guide',
      'Private 4x4 safari jeeps with veteran naturalist trackers',
      '9 nights in hand-selected boutique heritage villas',
      'Cooking masterclass with local village families',
      'All airport transfers, taxes, and highway tolls',
    ],
    image_url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    overview: 'The grand expedition across all dimensions of Sri Lanka: from the oldest continuously recorded history on earth to wild elephant corridors and the cobble-stoned Portuguese/Dutch maritime citadel.',
    itinerary: [
      { day: 1, title: 'Colombo Colonial Walk & Street Food', desc: 'Explore Pettah Bazaar, Red Mosque (Jami Ul-Alfar), and Galle Face Green street food sunset.', stay: 'Galle Face Hotel Colombo' },
      { day: 2, title: 'Ancient Kingdom of Anuradhapura', desc: 'Visit the world’s oldest documented human-planted tree (Jaya Sri Maha Bodhi) and Ruwanwelisaya stupa.', stay: 'Heritage Hotel Anuradhapura' },
      { day: 3, title: 'Polonnaruwa Quadrangle & Sigiriya', desc: 'Bicycle through the medieval stone palace of King Parakramabahu and the colossal Gal Vihara Buddha statues.', stay: 'Aliya Resort & Spa' },
      { day: 4, title: 'Sigiriya Sunrise & Spice Sanctuaries', desc: 'Ascend the Lion Rock at golden dawn. Savor fragrant wild cinnamon, cardamom, and clove groves.', stay: 'Aliya Resort & Spa' },
      { day: 5, title: 'Kandy Cultural Heart', desc: 'Witness ancient Buddhist relic rituals and stroll around the tranquil Kandy Lake.', stay: 'Cinnamon Citadel Kandy' },
      { day: 6, title: 'Nuwara Eliya "Little England"', desc: 'Drive through misty tea estates. Hand-pluck Ceylon tea leaves with tea masters and taste Single Estate Orange Pekoe.', stay: 'Grand Hotel Nuwara Eliya' },
      { day: 7, title: 'Ella Mountain Trails', desc: 'Hike Little Adam’s Peak and savor hot hoppers overlooking the grand Ella Gap.', stay: 'Ella Heritage Resort' },
      { day: 8, title: 'Yala National Park Leopard Tracking', desc: 'Embark on morning and evening game drives in search of the elusive Sri Lankan Leopard (Panthera pardus kotiya).', stay: 'Cinnamon Wild Yala' },
      { day: 9, title: 'Galle Dutch Maritime Fort', desc: 'Walk along ramparts built in 1663, visit artisan jewelry shops, and watch stilt fishermen at Koggala.', stay: 'Fort Bazaar Galle' },
      { day: 10, title: 'Bentota Golden Sands & Departure', desc: 'Relax by coconut-fringed beaches before private transfer to the international airport.', stay: 'Departure' },
    ],
  },
  {
    id: 3,
    title: '5-Day Wildlife Safari & Southern Riviera',
    slug: 'wildlife-safari-southern-coast',
    duration_days: 5,
    price_usd: 620,
    difficulty: 'Easy',
    highlights: [
      'Udawalawe Elephant Sanctuary & Baby Elephant Transit Home',
      'Mirissa Blue Whale watching on catamaran cruise',
      'Galle Dutch Fort UNESCO sunset ramparts',
      'Madu River mangrove boat safari with cinnamon peeling',
    ],
    included: [
      'Private 4x4 open safari jeeps with experienced trackers',
      'Whale cruise VIP deck tickets',
      '4 nights beachfront luxury resort accommodation',
      'Full board meals including fresh southern seafood curries',
    ],
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    overview: 'An action-packed tropical safari escaping into elephant wilderness and southern golden sand shores with majestic ocean giants.',
    itinerary: [
      { day: 1, title: 'Colombo to Udawalawe Wilds', desc: 'Transfer to Udawalawe. Experience the feeding of orphaned calves at the Elephant Transit Home.', stay: 'Grand Udawalawe Safari Resort' },
      { day: 2, title: 'Udawalawe Big Game Safari', desc: 'Morning game drive spotting herds of wild elephants, water buffaloes, spotted deer, and crested serpent eagles.', stay: 'Grand Udawalawe Safari Resort' },
      { day: 3, title: 'Mirissa Blue Whale Expedition', desc: 'Early morning sea cruise into deep continental shelf waters to spot Blue Whales and playful spinner dolphins.', stay: 'Triple O Six Mirissa' },
      { day: 4, title: 'Galle Fort & Koggala Stilt Fishermen', desc: 'Explore historic Dutch ramparts, lighthouse, and photograph traditional stilt fishermen balancing over waves.', stay: 'Le Grand Galle' },
      { day: 5, title: 'Madu River Mangroves & Airport Transfer', desc: 'Glide through 64 mangrove islets, visit Cinnamon Island, and transfer to airport.', stay: 'Departure' },
    ],
  },
  {
    id: 4,
    title: '4-Day Northern Mystique & Jaffna Heritage',
    slug: 'northern-jaffna-heritage',
    duration_days: 4,
    price_usd: 520,
    difficulty: 'Easy',
    highlights: [
      'Nallur Kandaswamy Kovil majestic Dravidian towers',
      'Nainativu Island sacred Nagapooshani Amman Temple & Buddhist Vihara',
      'Jaffna Dutch Fort & iconic Public Library',
      'Point Pedro Sri Lanka northernmost geographic point',
      'Authentic Jaffna fiery red crab curry feast',
    ],
    included: [
      'AC Intercity train from Colombo to Jaffna',
      'Chauffeur driven car for all northern peninsula excursions',
      '3 nights in premium Jaffna boutique hotels',
      'Dedicated local Tamil culinary & cultural storyteller',
    ],
    image_url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80',
    is_featured: false,
    overview: 'Uncover the vibrant Hindu traditions, palmyrah palms, island ferries, and distinctive culinary flavors of the peaceful northern peninsula.',
    itinerary: [
      { day: 1, title: 'Express Train to Jaffna', desc: 'Scenic journey through the Elephant Pass isthmus into Jaffna. Evening visit to Nallur Kovil during evening bells.', stay: 'Jetwing Jaffna' },
      { day: 2, title: 'Nainativu & Delft Island Expedition', desc: 'Take traditional passenger ferries to sacred offshore islands with wild ponies and ancient coral-stone walls.', stay: 'Jetwing Jaffna' },
      { day: 3, title: 'Point Pedro & Keerimalai Sacred Springs', desc: 'Stand at the northernmost point of Sri Lanka and bathe in the natural sea-adjacent healing spring.', stay: 'Jetwing Jaffna' },
      { day: 4, title: 'Jaffna Market & Return Journey', desc: 'Sample Jaffna muscat, palmyrah jaggery, and sun-dried chilies before boarding return express train.', stay: 'Departure' },
    ],
  },
];

// -----------------------------------------------------------------------------
// BEST SRI LANKAN LOCATIONS
// -----------------------------------------------------------------------------
export const SRI_LANKAN_DESTINATIONS: SriLankanDestination[] = [
  {
    id: 'sigiriya',
    name: 'Sigiriya Rock Fortress',
    native_name: 'සීගිරිය / சிகிரியா',
    region: 'Cultural Triangle',
    province: 'Central Province (Matale)',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80',
    best_time: 'January to April, July to September',
    highlight: '5th-century Palace in the Sky with giant lion paws, mirror wall, and heavenly maiden frescoes.',
    description: 'Constructed by King Kashyapa (477–495 CE) atop a sheer 200-meter granite monolith. Regarded as the "Eighth Wonder of the World", it boasts sophisticated hydraulic gravity-fed fountains that still spray water today.',
    coordinates: { lat: 7.957, lng: 80.7603 },
    tags: ['UNESCO', 'History', 'Hiking', 'Ancient Engineering'],
  },
  {
    id: 'kandy',
    name: 'Kandy (Sri Dalada Maligawa)',
    native_name: 'මහනුවර / கண்டி',
    region: 'Hill Country',
    province: 'Central Province',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80',
    best_time: 'December to April',
    highlight: 'Sacred Temple of the Tooth Relic, serene Kandy Lake, and last royal capital of Ceylon.',
    description: 'Nestled amidst lush mist-clad mountains, Kandy resisted colonial conquest for over 300 years. The golden-roofed temple houses the sacred canine tooth of Gautama Buddha, the symbol of island sovereignty.',
    coordinates: { lat: 7.2906, lng: 80.6337 },
    tags: ['UNESCO', 'Sacred', 'Culture', 'Temples'],
  },
  {
    id: 'galle-fort',
    name: 'Galle Dutch Fort',
    native_name: 'ගාල්ල කොටුව / காலி கோட்டை',
    region: 'Southern Coast',
    province: 'Southern Province',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80',
    best_time: 'November to April',
    highlight: '17th-century fortified maritime citadel with cobblestone streets, colonial ramparts, and lighthouse.',
    description: 'First fortified by the Portuguese in 1588 and extensively enlarged by the Dutch East India Company (VOC) in 1663. Today it is a vibrant living heritage town filled with boutique bistros, art galleries, and gem ateliers.',
    coordinates: { lat: 6.0329, lng: 80.2168 },
    tags: ['UNESCO', 'Colonial', 'Ocean Views', 'Architecture'],
  },
  {
    id: 'ella',
    name: 'Ella & Nine Arch Bridge',
    native_name: 'ඇල්ල / எல்லை',
    region: 'Hill Country',
    province: 'Uva Province (Badulla)',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    best_time: 'Year-round (Best: January to May)',
    highlight: 'Demodara Nine Arch Bridge ("Bridge in the Sky"), Ella Rock trek, and tea plantations.',
    description: 'A backpacker haven nestled in a mountain gap 1,041 meters above sea level. Built in 1921 entirely of brick, rock, and cement without a single piece of steel, the bridge remains an engineering triumph.',
    coordinates: { lat: 6.8722, lng: 81.0464 },
    tags: ['Trekking', 'Railways', 'Waterfalls', 'Backpacker'],
  },
  {
    id: 'yala',
    name: 'Yala National Park',
    native_name: 'යාල ජාතික වනෝද්‍යානය',
    region: 'Wildlife & Parks',
    province: 'Southern / Uva Province',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&auto=format&fit=crop&q=80',
    best_time: 'February to July',
    highlight: 'Highest recorded density of wild leopards in the world, sloth bears, and herds of Asian elephants.',
    description: 'Covering 979 square kilometers bordering the Indian Ocean, Yala features diverse ecosystems from moist monsoon forests to freshwater wetlands and coastal sand dunes.',
    coordinates: { lat: 6.3712, lng: 81.517 },
    tags: ['Wildlife', 'Leopards', 'Safari', 'Photography'],
  },
  {
    id: 'jaffna',
    name: 'Jaffna & Nallur Kovil',
    native_name: 'යාපනය / யாழ்ப்பாணம்',
    region: 'North & East',
    province: 'Northern Province',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80',
    best_time: 'May to September, December to March',
    highlight: 'Golden Nallur Kovil gopurams, palmyrah landscapes, coral islands, and vibrant Tamil culture.',
    description: 'The cultural capital of Sri Lankan Tamils. Rich with Dravidian architecture, historic Dutch forts, unique palmyrah craftwork, and fiery cuisine that has delighted travelers for centuries.',
    coordinates: { lat: 9.6615, lng: 80.0255 },
    tags: ['Hindu Heritage', 'Islands', 'Tamil Culture', 'Seafood'],
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura Ancient Capital',
    native_name: 'අනුරාධපුරය / அனுராதபுரம்',
    region: 'Cultural Triangle',
    province: 'North Central Province',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80',
    best_time: 'May to September',
    highlight: 'Ruwanwelisaya colossal white stupa and Jaya Sri Maha Bodhi (planted 288 BCE).',
    description: 'The first capital of ancient Sri Lanka, thriving for over 1,300 years as one of the most stable and durable centers of political power and urban life in South Asia.',
    coordinates: { lat: 8.3114, lng: 80.4037 },
    tags: ['UNESCO', 'Sacred', 'Ancient Kingdoms', 'Buddhism'],
  },
  {
    id: 'mirissa',
    name: 'Mirissa Coastal Bay',
    native_name: 'මිරිස්ස / மிரிஸா',
    region: 'Southern Coast',
    province: 'Southern Province (Matara)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    best_time: 'November to April',
    highlight: 'World-class Blue Whale watching, Coconut Tree Hill lookout, and crescent surfing bay.',
    description: 'A picture-perfect palm-lined bay where the continental shelf drops rapidly into the deep ocean, making it the best place on Earth to observe the largest animal that ever lived.',
    coordinates: { lat: 5.9483, lng: 80.4578 },
    tags: ['Beaches', 'Whales', 'Surfing', 'Nightlife'],
  },
];

// -----------------------------------------------------------------------------
// FAMOUS SRI LANKAN DISHES
// -----------------------------------------------------------------------------
export const SRI_LANKAN_DISHES: SriLankanDish[] = [
  {
    id: 'kottu-roti',
    name: 'Kottu Roti (Chicken / Cheese / Veg)',
    sinhala_name: 'කොත්තු රොටි',
    tamil_name: 'கொத்து ரொட்டி',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    spice_level: 4,
    type: 'Street Food',
    key_ingredients: ['Shredded Godamba Roti flatbread', 'Curry Chicken or Beef', 'Eggs', 'Leeks & Carrots', 'Green chilies', 'Roasted curry gravy'],
    allergens: ['Gluten / Wheat', 'Eggs', 'Dairy (if cheese kottu)'],
    cultural_story: 'The unmistakable rhythmic drumming of steel blades chopping against hot iron griddles echoing through the night air is Sri Lanka’s ultimate culinary anthem.',
    how_to_eat: 'Eaten hot straight from the paper packet or ceramic plate using a fork or by hand. Pair with a bottle of cold ginger beer (EGB) or Milo!',
  },
  {
    id: 'hoppers',
    name: 'Hoppers (Appa) & Egg Hoppers',
    sinhala_name: 'ආප්ප සහ බිත්තර ආප්ප',
    tamil_name: 'அப்பம்',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    spice_level: 2,
    type: 'Breakfast Staple',
    key_ingredients: ['Fermented rice flour', 'Coconut milk', 'Toddy or yeast fermentation', 'Fresh farm egg', 'Katta Sambol'],
    allergens: ['Eggs (for egg hoppers)', 'Coconut'],
    cultural_story: 'Cooked in small hemispherical wok-like pans called appachatti. The edges turn wafer-thin and crisp like golden lace, while the spongy center remains soft and cloud-like.',
    how_to_eat: 'Tear off the crispy golden rim, dip it into the soft runny egg center, and scoop a spicy dollop of fiery Lunu Miris or creamy Kiri Hodi.',
  },
  {
    id: 'ceylon-crab-curry',
    name: 'Jaffna & Colombo Ceylon Black Crab Curry',
    sinhala_name: 'කකුළුවෝ කරිය',
    tamil_name: 'நண்டு கறி',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    spice_level: 5,
    type: 'Main Dish',
    key_ingredients: ['Fresh mud or lagoon crabs', 'Roasted black curry powder', 'Toasted murunga (drumstick) leaves', 'Coconut cream', 'Fenugreek & Garcinia cambogia (Goraka)'],
    allergens: ['Shellfish / Crustaceans'],
    cultural_story: 'Sri Lankan mud crabs from the Negombo and Jaffna lagoons are celebrated in the World’s 50 Best Restaurants. The curry is intensely aromatic and dark, simmered with clay pot heat.',
    how_to_eat: 'A hands-on feast! Crack the claws with brass crackers and soak thick slices of wood-fired roast paan (bread) in the rich crab gravy.',
  },
  {
    id: 'pol-sambol',
    name: 'Pol Sambol & Roast Bread (Pol Roti)',
    sinhala_name: 'පොල් සම්බෝල සහ රෝස් පාන්',
    tamil_name: 'தேங்காய் சம்பல்',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    spice_level: 4,
    type: 'Condiment',
    key_ingredients: ['Freshly scraped coconut', 'Dried red chili flakes', 'Red shallots', 'Maldive fish flakes (Umbalakada)', 'Fresh lime juice', 'Sea salt'],
    allergens: ['Fish (Maldive fish flakes; can request veg)'],
    cultural_story: 'Pounded by hand on a traditional granite grindstone (Miris Gala). The friction releases coconut oils that emulsify with spicy crimson chilies and tangy lime.',
    how_to_eat: 'Sandwiched inside warm triangular roast bread slathered with salted butter, or served alongside hot coconut roti.',
  },
  {
    id: 'ambul-thiyal',
    name: 'Southern Fish Ambul Thiyal (Sour Fish)',
    sinhala_name: 'මාළු ඇඹුල් තියල්',
    tamil_name: 'மீன் அம்புல் தியல்',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    spice_level: 3,
    type: 'Main Dish',
    key_ingredients: ['Yellowfin tuna or sailfish steaks', 'Dried Goraka (Garcinia cambogia) paste', 'Black pepper', 'Cinnamon', 'Curry leaves'],
    allergens: ['Fish'],
    cultural_story: 'Invented by southern coastal fishermen as an indigenous preservation technique centuries before refrigeration. Simmered dry in clay pots until every drop of liquid coats the tuna in black tart coating.',
    how_to_eat: 'Eaten with white Samba rice, coconut dhal curry, and bitter gourd (Karavila) sambol.',
  },
  {
    id: 'lamprais',
    name: 'Dutch Burgher Lamprais',
    sinhala_name: 'ලම්ප්‍රයිස්',
    tamil_name: 'லாம்ப்ரைஸ்',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    spice_level: 2,
    type: 'Main Dish',
    key_ingredients: ['Ghee-cooked Samba rice', 'Mixed meat curry (beef, mutton, chicken)', 'Frikkadels (Dutch meatballs)', 'Blachan (shrimp paste)', 'Seeni Sambol', 'Ash plantain'],
    allergens: ['Meat', 'Gluten', 'Shellfish (shrimp paste)'],
    cultural_story: 'A legacy of the Dutch Burgher community of Ceylon. The entire feast is wrapped inside a gently fire-wilted banana leaf and slow-baked so the leaf aroma infuses every grain of rice.',
    how_to_eat: 'Unwrap the banana leaf bundle at your table. Mix the fragrant rice with the sweet seeni sambol, tart ash plantain, and savory frikkadels.',
  },
  {
    id: 'watalappam',
    name: 'Watalappam (Spiced Jaggery Pudding)',
    sinhala_name: 'වටලප්පන්',
    tamil_name: 'வட்டலப்பம்',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80',
    spice_level: 0,
    type: 'Dessert',
    key_ingredients: ['Kithul palm jaggery', 'Thick coconut milk', 'Free-range eggs', 'Ground cardamom & nutmeg', 'Cloves', 'Toasted cashew nuts'],
    allergens: ['Eggs', 'Tree Nuts (cashews)'],
    cultural_story: 'Introduced by Malay and Moor maritime traders in the 18th century. Steamed until air bubbles form a velvety honeycomb texture crowned with roasted whole cashews.',
    how_to_eat: 'Served chilled or room temperature as the celebratory highlight of Eid festivals and Sri Lankan weddings.',
  },
];

// -----------------------------------------------------------------------------
// TOP ACTIVITIES & ADVENTURES
// -----------------------------------------------------------------------------
export const SRI_LANKAN_ACTIVITIES: TopActivity[] = [
  {
    id: 'ella-train',
    title: 'Scenic Blue Mountain Train from Kandy to Ella',
    location: 'Central Highlands (Kandy - Nanu Oya - Ella)',
    category: 'Adventure',
    duration: '6 to 7 hours',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    description: 'Voted consistently as one of the top 3 most picturesque train journeys in the world. The colonial blue locomotive chugs past emerald tea terraces, pine forests, and tumbling waterfalls.',
    insider_tip: 'Book 1st Class Observation Car or 2nd Class reserved seats on the right-hand side from Kandy to Nanu Oya for the best panoramic valley views.',
  },
  {
    id: 'whale-watching',
    title: 'Blue Whale & Dolphin Safari in Mirissa',
    location: 'Mirissa Southern Ocean',
    category: 'Nature & Safari',
    duration: '3 to 4 hours (Morning departure 6:30 AM)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    description: 'Witness the largest animal ever known to have lived on Earth swimming in natural oceanic feeding grounds alongside pods of playful spinner dolphins.',
    insider_tip: 'Choose responsible, certified eco-operators who maintain a strict 100-meter non-intrusive distance to ensure animal welfare.',
  },
  {
    id: 'surfing-arugam',
    title: 'World-Class Point Break Surfing in Arugam Bay',
    location: 'Eastern Province (Arugam Bay & Pottuvil)',
    category: 'Adventure',
    duration: 'Half day / Multi-day surf camps',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80',
    description: 'Renowned right-hand point breaks with reliable ocean swells attracting surfers from Australia, Europe, and America from May through October.',
    insider_tip: 'Head to "Whiskey Point" or "Peanut Farm" for gentle learner waves and sunset chill vibes.',
  },
  {
    id: 'tea-factory-trail',
    title: 'Ceylon Tea Plucking & Factory Heritage Trail',
    location: 'Nuwara Eliya & Hatton',
    category: 'Heritage & Culture',
    duration: '2 to 3 hours',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80',
    description: 'Walk through misty high-grown tea bushes, learn the "two leaves and a bud" plucking method, and watch vintage 19th-century British roller machines convert green leaves into aromatic black tea.',
    insider_tip: 'Savor a freshly brewed cup of Silver Tips (the rarest white tea) paired with hot strawberry scones at the factory tea salon.',
  },
  {
    id: 'rafting-kitulgala',
    title: 'White Water Rafting on the Kelani River',
    location: 'Kitulgala Rainforest',
    category: 'Adventure',
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
    description: 'Navigate grade 2 and grade 3 rapids surrounded by dense rainforest where the Oscar-winning movie "The Bridge on the River Kwai" was filmed in 1957.',
    insider_tip: 'Combine with waterfall abseiling and cliff jumping into natural jungle rock pools.',
  },
  {
    id: 'hot-air-balloon',
    title: 'Sunrise Hot Air Ballooning over Sigiriya Plains',
    location: 'Dambulla / Kandalama',
    category: 'Adventure',
    duration: '1 hour flight (Dawn)',
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800&auto=format&fit=crop&q=80',
    description: 'Float quietly over emerald jungle canopies, ancient irrigation reservoirs, wild elephant herds, and get a magical bird’s-eye view of Sigiriya Rock Fortress in morning mist.',
    insider_tip: 'Operating season is November through April when weather conditions are calm and dry.',
  },
];

// -----------------------------------------------------------------------------
// CULTURAL FESTIVALS
// -----------------------------------------------------------------------------
export const SRI_LANKAN_FESTIVALS: CulturalFestival[] = [
  {
    id: 'esala-perahera',
    name: 'Kandy Esala Perahera (The Festival of the Tooth)',
    month: 'July / August (10 nights leading to Nikini Poya)',
    religion_culture: 'Theravada Buddhism & Kandyan Royalty',
    location: 'Kandy City center',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80',
    description: 'One of the oldest and grandest Buddhist pageants in Asia, celebrated for over 1,700 years. Over 100 caparisoned elephants, thousands of drummers, whip-crackers, fireball acrobats, and Ves dancers parade in honor of the Sacred Tooth Relic.',
    traditions: [
      'The ceremonial planting of the "Kap" tree',
      'The Maligawa Tusker carrying the golden relic casket (Karanduwa)',
      'Water-cutting ceremony (Diya Kepeema) at the Mahaweli River at dawn',
    ],
  },
  {
    id: 'aluth-avurudda',
    name: 'Sinhala & Tamil New Year (Aluth Avurudda / Puthandu)',
    month: 'April 13 & 14 (Solar transition)',
    religion_culture: 'National Cross-Cultural Heritage',
    location: 'Islandwide in every home & village',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    description: 'Marks the movement of the sun from the zodiac house of Pisces to Aries. Both Sinhala Buddhists and Tamil Hindus celebrate the new harvest season with exact astrological timings (Nakath) observed simultaneously across the entire nation.',
    traditions: [
      'Boiling of the milk pot until it overflows, symbolizing prosperity',
      'Lighting the auspicious cooking fire and preparing Kiribath (Milk Rice)',
      'Traditional village games: climbing the greased pole and pillow fighting on logs',
    ],
  },
  {
    id: 'vesak-poya',
    name: 'Vesak Festival of Lights & Dansals',
    month: 'May Full Moon (Vesak Poya)',
    religion_culture: 'Theravada Buddhism',
    location: 'Colombo, Kandy, Kelaniya & Islandwide',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
    description: 'Commemorates the Birth, Supreme Enlightenment, and Parinirvana of Gautama Buddha. Streets and homes are transformed by vibrant paper lanterns (Vesak Kudu), colossal illuminated murals (Pandols), and free community food stalls (Dansals).',
    traditions: [
      'Crafting intricate octagonal paper lanterns and lighting clay oil lamps',
      'Dansals: Free street feasts serving fried rice, noodles, ice cream, and tea to all passersby regardless of background',
      'Sil observation: Devotees dressed in pristine white meditating at temples',
    ],
  },
  {
    id: 'nallur-festival',
    name: 'Nallur Kandaswamy Kovil Chariot Festival',
    month: 'August / September (25 consecutive days)',
    religion_culture: 'Hinduism (Lord Murugan)',
    location: 'Nallur, Jaffna Peninsula',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80',
    description: 'The premier Hindu festival in Sri Lanka. Devotees gather in their hundreds of thousands to pull colossal carved teak chariots (Ther) bearing Lord Murugan through sacred streets accompanied by thavil drums and nadaswaram pipes.',
    traditions: [
      'Devotees carrying Kavadi shrines and performing devotional vows',
      'Male pilgrims entering the sacred temple precincts bare-chested as a sign of humility',
      'Chanting "Vetri Vel Muruganukku Haro Hara" in divine ecstasy',
    ],
  },
  {
    id: 'kataragama-festival',
    name: 'Kataragama Esala Fire-Walking Festival',
    month: 'July',
    religion_culture: 'Multifaith (Buddhist, Hindu, Vedda indigenous, Muslim)',
    location: 'Kataragama Shrine, Southern Wilderness',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&auto=format&fit=crop&q=80',
    description: 'A magical sacred nexus where Buddhists worship God Kataragama (Skanda), Hindus revere Lord Murugan, Muslims visit the sacred mosque of al-Khidr, and the indigenous Vedda people hold ritual dances.',
    traditions: [
      'Pada Yatra: Pilgrims walking hundreds of kilometers barefoot through wild forests from Jaffna to Kataragama',
      'The sacred midnight fire-walking across glowing red-hot charcoal pits unscathed',
    ],
  },
];

// -----------------------------------------------------------------------------
// RELIGIONS & SPIRITUAL HARMONY
// -----------------------------------------------------------------------------
export const SRI_LANKAN_RELIGIONS: ReligiousHeritage[] = [
  {
    name: 'Theravada Buddhism',
    percentage: '70.2%',
    sinhala_title: 'ථේරවාද බුදු දහම',
    overview: 'Introduced in 236 BCE by Arahat Mahinda (son of Emperor Ashoka of India) at Mihintale. Sri Lanka possesses the longest continuous history of Buddhism of any predominantly Buddhist nation, having preserved the Pali Canon (Tipitaka) in written form since the 1st century BCE at Aluvihara.',
    sacred_sites: ['Temple of the Sacred Tooth Relic (Kandy)', 'Jaya Sri Maha Bodhi & Ruwanwelisaya (Anuradhapura)', 'Kelaniya Raja Maha Vihara', 'Dambulla Cave Monastery'],
    traditions: 'Observance of monthly Full Moon Poya holidays, morning Buddha Pooja, white attire for meditation, and respecting the yellow-robed monastic Sangha.',
    harmony_note: 'Buddhist temples routinely feature devales (shrines) dedicated to Hindu deities such as Vishnu, Kataragama, and Saman, reflecting deep ecumenical bonds.',
  },
  {
    name: 'Hinduism (Shaivism)',
    percentage: '12.6%',
    sinhala_title: 'හින්දු ආගම',
    overview: 'Predominantly practiced by the Tamil community with deep antiquity on the island. Sri Lanka is home to the venerable "Pancha Ishwarams" — five coastal shrines dedicated to Lord Shiva built to protect the perimeter of the island since prehistoric times.',
    sacred_sites: ['Koneswaram Temple (Trincomalee cliffs)', 'Nallur Kandaswamy Kovil (Jaffna)', 'Munneswaram Temple (Chilaw)', 'Thiruketheeswaram (Mannar)', 'Sri Ponnambalavaneswaram (Colombo granite temple)'],
    traditions: 'Daily Puja offerings with camphor flame, flower garlands, ringing of temple bells, vegetarian vows during holy months, and applying holy ash (Vibhuti) on forehead.',
    harmony_note: 'Thousands of Buddhists join Hindu pilgrims in venerating Lord Murugan at Kataragama and Lord Shiva at Munneswaram.',
  },
  {
    name: 'Islam',
    percentage: '9.7%',
    sinhala_title: 'ඉස්ලාම් ධර්මය',
    overview: 'Arrived through Arab seafarers and traders who traveled the Indian Ocean spice and gem routes as early as the 8th century CE. Sri Lankan Moors and Malays have contributed immensely to the island’s maritime trade, gemology, politics, and cuisine.',
    sacred_sites: ['Jami Ul-Alfar Mosque (The iconic Red Mosque in Pettah, Colombo)', 'Ketchimalai Mosque in Beruwala (oldest recorded Muslim settlement)', 'Dawatagaha Mosque (Cinnamon Gardens)'],
    traditions: 'Daily five prayers (Salah), Friday Jummah congregations, Ramadan fasting, Eid celebrations, and community charity (Zakat).',
    harmony_note: 'Muslim traders and Sinhala kings forged historic military and trading alliances, granting Muslims hereditary lands around the Kandyan kingdom.',
  },
  {
    name: 'Christianity & Roman Catholicism',
    percentage: '7.4%',
    sinhala_title: 'ක්‍රිස්තියානි හා රෝමානු කතෝලික ධර්මය',
    overview: 'Introduced by Portuguese missionaries in 1505, followed by the Dutch Reformed Church and British Anglican congregations. Embraced by both Sinhala and Tamil coastal communities, particularly along the western coastal fishing belt ("Little Rome").',
    sacred_sites: ['Shrine of Our Lady of Madhu (Mannar jungle sanctuary)', 'St. Anthony’s Shrine (Kochchikade, Colombo)', 'St. Mary’s Church (Negombo)', 'Dutch Reformed Groote Kerk (Galle Fort)'],
    traditions: 'Sunday mass, Christmas and Easter celebrations, annual parish feast days with statue processions, and carols in Sinhala, Tamil, and English.',
    harmony_note: 'The Shrine of Our Lady of Madhu is revered as a national miracle sanctuary visited by Christians, Buddhists, and Hindus alike during times of peace and crisis.',
  },
];

// -----------------------------------------------------------------------------
// CULTURE, ARTS & LIVING HERITAGE
// -----------------------------------------------------------------------------
export const SRI_LANKAN_CULTURE = {
  traditional_dance: [
    {
      title: 'Kandyan Dance (Uda Rata Natum)',
      desc: 'The national dance style of Sri Lanka originating from royal court rituals. Dancers wear the sacred 64 ornaments of the "Ves" costume, silver headpieces, and chest plates, executing dynamic acrobatic leaps to the rhythm of the Geta Bera drum.',
    },
    {
      title: 'Low Country Mask Dance (Paha Rata Natum & Kolam)',
      desc: 'Originating from the southern coastal regions of Bentota and Ambalangoda. Famous for intricate painted wooden masks depicting 18 sickness demons (Daha Ata Sanniya) and comedic folklore characters.',
    },
  ],
  traditional_crafts: [
    {
      title: 'Handloom & Dumbara Weaving',
      desc: 'UNESCO-inscribed intangible cultural heritage. Intricate geometric tapestries, shawls, and saris woven on traditional wooden pit looms.',
    },
    {
      title: 'Ceylon Lacquerware & Brasswork',
      desc: 'Artisans in Kandy use the natural resin of the lac insect to create vivid red, yellow, and black ornamented walking sticks, jewelry boxes, and oil lamps.',
    },
    {
      title: 'Ambalangoda Wooden Mask Carving',
      desc: 'Handcrafted from light balsa-like "Kaduru" wood, dried over smoke racks, and painted with natural botanical and mineral dyes.',
    },
  ],
  indigenous_ayurveda: {
    title: 'Hela Wedakama & Traditional Ayurveda',
    desc: 'Sri Lanka’s 3,000-year-old indigenous healing system (Hela Wedakama) blends seamlessly with Ayurvedic medicine. Ancient royal hospital ruins at Mihintale (9th century) show rock-hewn medicine immersion troughs and surgical instruments.',
  },
  architecture: {
    title: 'Ancient Hydraulics & Tropical Modernism',
    desc: 'Ancient kings built colossal man-made inland seas (Wewas) and invented the "Bisokotuwa" (valve tower) to regulate hydraulic water pressure 2,000 years ago. In modern times, master architect Geoffrey Bawa pioneered "Tropical Modernism", erasing boundaries between indoor living spaces and the surrounding jungle landscape.',
  },
  island_etiquette: [
    'Ayubowan ("May you live long") is the universally warm greeting with hands pressed together at chest level.',
    'Always use your right hand when giving, receiving, or eating food.',
    'Dress modestly when entering religious sites: cover your shoulders and knees, remove hats and footwear, and never pose with your back turned to a Buddha statue.',
    'Sharing a fresh King Coconut (Thambili) is the ultimate symbol of tropical hospitality.',
  ],
};

// -----------------------------------------------------------------------------
// ECONOMY, TRADE & INDUSTRY DETAILS
// -----------------------------------------------------------------------------
export const SRI_LANKAN_ECONOMY = {
  currency: {
    name: 'Sri Lankan Rupee',
    code: 'LKR',
    symbol: 'Rs. / රු. / ரூ.',
  },
  strategic_location: 'Located at the exact intersection of the world’s busiest maritime trade corridors between the Suez Canal, Middle East, Singapore, and East Asia.',
  key_pillars: [
    {
      name: 'Ceylon Tea (The World’s Finest Brew)',
      share_importance: 'Top global orthodox black tea exporter',
      highlight: 'Known worldwide by the government "Lion Logo" guarantee of 100% pure Ceylon tea packed at source. Employs over 1.5 million people across misty mountain valleys.',
      regions: 'Nuwara Eliya, Dimbula, Uva, Kandy, Ruhuna',
    },
    {
      name: 'Ceylon Blue Sapphires & Gemstones',
      share_importance: 'The "Island of Gems" (Ratna Dweepa)',
      highlight: 'Sri Lanka has produced the world’s most celebrated gems for over 2,500 years, including the 400-carat Blue Belle of Asia and the British Royal Engagement Ring worn by Princess Diana and Princess Catherine.',
      regions: 'Ratnapura, Elahera, Pelmadulla',
    },
    {
      name: 'Ethical Apparel & High-Tech Garments',
      share_importance: 'Largest merchandise export sector (~$5 Billion/yr)',
      highlight: 'Pioneer of "Garments Without Guilt" — ethical, child-labor-free, sustainable manufacturing producing high-end apparel for Victoria’s Secret, Nike, Lululemon, and Marks & Spencer.',
      regions: 'Biyagama, Katunayake, Seethawaka export zones',
    },
    {
      name: 'True Ceylon Cinnamon (Cinnamomum Verum)',
      share_importance: 'Produces over 85% of the world’s true cinnamon',
      highlight: 'Ceylon Cinnamon is scientifically distinct from cheap Cassia bark. It possesses paper-thin golden layers, low coumarin content (safe for liver), and delicate sweet floral aromas.',
      regions: 'Galle, Matara, Kalutara coastal belt',
    },
    {
      name: 'Maritime Port Logistics & Transshipment',
      share_importance: 'Port of Colombo: Top 25 world container port',
      highlight: 'The Port of Colombo is the premier transshipment hub for the Indian subcontinent, handling mega-container vessels on major East-West shipping lanes.',
      regions: 'Colombo Deep Water Harbor, Hambantota International Port',
    },
    {
      name: 'Tourism & Sustainable Hospitality',
      share_importance: 'Vital foreign exchange generator',
      highlight: 'Named "Top Destination in the World" by Lonely Planet. Rapidly expanding from traditional sun-and-sand into wellness Ayurveda retreats, wildlife glamping, and high-altitude hiking.',
      regions: 'Islandwide (Cultural Triangle, Coastlines, Tea Highlands)',
    },
  ],
};
