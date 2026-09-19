export type ScanCategory = 'Food' | 'Landmark' | 'Sign/Text';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  name: string;
  region?: string;
}

export interface NearbyRecommendation {
  name: string;
  type: 'landmark' | 'food' | 'culture' | 'transit' | 'tip';
  distance_approx: string;
  highlight: string;
  lat_offset?: number;
  lng_offset?: number;
}

export interface TravelAnalysisResult {
  id: string;
  timestamp: number;
  image: string; // Base64 data URI or image URL
  category: ScanCategory;
  sub_category: string;
  identification: string;
  native_name?: string;
  phonetic_pronunciation?: string;
  detected_script?: string;
  translation: string;
  original_text?: string;
  cultural_context: string;
  dietary_warnings: string[];
  ingredients?: string[];
  etiquette_tips: string[];
  confidence_score?: number;
  audio_phrase?: string;
  location: LocationCoordinates;
  nearby_recommendations: NearbyRecommendation[];
  isBookmarked?: boolean;
  notes?: string;
}

export interface LocationOption {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  suggestedQuestions?: string[];
}
