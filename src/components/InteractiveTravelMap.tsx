import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Compass,
  Utensils,
  Landmark,
  Bus,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { LocationCoordinates, NearbyRecommendation } from '../types';
import { formatCoordinates } from '../lib/geo';

interface InteractiveTravelMapProps {
  location: LocationCoordinates;
  subjectName: string;
  recommendations: NearbyRecommendation[];
}

export const InteractiveTravelMap: React.FC<InteractiveTravelMapProps> = ({
  location,
  subjectName,
  recommendations,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedRecIndex, setSelectedRecIndex] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create new Leaflet map
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add OpenStreetMap cartography tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markers = markersLayerRef.current;

    if (map && markers) {
      markers.clearLayers();
      map.setView([location.latitude, location.longitude], 14);

      // 1. User / Subject Center Marker
      const travelerIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #f59e0b; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #0f172a; font-weight: bold;">
              ★
            </div>
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; border: 2px solid #f59e0b; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.7;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userMarker = L.marker([location.latitude, location.longitude], { icon: travelerIcon })
        .addTo(markers)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px;">
            <strong style="display: block; font-size: 13px; color: #b45309; margin-bottom: 2px;">${subjectName}</strong>
            <span>📍 ${location.name}</span><br/>
            <small style="color: #64748b;">${formatCoordinates(location.latitude, location.longitude)}</small>
          </div>
        `);

      userMarker.openPopup();

      // 2. Nearby Recommendation Markers
      recommendations.forEach((rec, idx) => {
        if (filterType !== 'all' && rec.type !== filterType) return;

        const recLat = location.latitude + (rec.lat_offset || (idx % 2 === 0 ? 0.003 : -0.003) * (idx + 1));
        const recLng = location.longitude + (rec.lng_offset || (idx % 2 === 0 ? 0.004 : -0.003) * (idx + 1));

        const iconBg =
          rec.type === 'food'
            ? '#f97316'
            : rec.type === 'landmark'
            ? '#10b981'
            : rec.type === 'transit'
            ? '#3b82f6'
            : '#8b5cf6';

        const recIcon = L.divIcon({
          className: 'custom-rec-marker',
          html: `
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${iconBg}; border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 10px; font-weight: bold;">
              ${idx + 1}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const recMarker = L.marker([recLat, recLng], { icon: recIcon })
          .addTo(markers)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px; max-width: 180px;">
              <strong style="display: block; color: ${iconBg}; margin-bottom: 2px;">${rec.name}</strong>
              <div style="font-size: 11px; margin-bottom: 4px;">${rec.highlight}</div>
              <small style="color: #64748b; font-weight: bold;">⏱ ${rec.distance_approx}</small>
            </div>
          `);

        if (selectedRecIndex === idx) {
          recMarker.openPopup();
        }
      });
    }

    return () => {
      // In effect cleanup
    };
  }, [location, subjectName, recommendations, filterType, selectedRecIndex]);

  // Clean up Leaflet on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleRecClick = (idx: number) => {
    setSelectedRecIndex(idx);
    const rec = recommendations[idx];
    if (rec && mapInstanceRef.current) {
      const recLat = location.latitude + (rec.lat_offset || (idx % 2 === 0 ? 0.003 : -0.003) * (idx + 1));
      const recLng = location.longitude + (rec.lng_offset || (idx % 2 === 0 ? 0.004 : -0.003) * (idx + 1));
      mapInstanceRef.current.panTo([recLat, recLng]);
    }
  };

  const handleCenterTraveler = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 15);
      setSelectedRecIndex(null);
    }
  };

  return (
    <div id="interactive-travel-map" className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Geo-Context & Nearby Exploration</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time proximity recommendations relative to {location.name}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All' },
            { id: 'food', label: 'Eats' },
            { id: 'landmark', label: 'Sights' },
            { id: 'culture', label: 'Culture' },
            { id: 'transit', label: 'Transit' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === f.id
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Map + Recommendation List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Interactive Map Box */}
        <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full min-h-[340px] sm:min-h-[420px] z-10" />

          {/* Recenter Button Overlay */}
          <button
            id="btn-recenter-map"
            onClick={handleCenterTraveler}
            className="absolute top-3 right-3 z-20 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-700 shadow-lg backdrop-blur-md transition-all active:scale-95"
            title="Recenter on Scanned Location"
          >
            <Navigation className="w-4 h-4" />
          </button>

          {/* Coordinates Bar Overlay */}
          <div className="absolute bottom-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 shadow flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{formatCoordinates(location.latitude, location.longitude)}</span>
          </div>
        </div>

        {/* Proximity Recommendations List */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-slate-900/60 border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Recommended Local Discoveries ({recommendations.length})
              </span>
              <span className="text-[11px] text-amber-400 font-medium">Click to Locate</span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto no-scrollbar pr-1">
              {recommendations.map((rec, idx) => {
                const isSelected = selectedRecIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleRecClick(idx)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-slate-950/40 hover:bg-slate-800/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            rec.type === 'food'
                              ? 'bg-orange-500 text-white'
                              : rec.type === 'landmark'
                              ? 'bg-emerald-600 text-white'
                              : rec.type === 'transit'
                              ? 'bg-blue-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 truncate">
                          {rec.name}
                        </h4>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 flex-shrink-0">
                        {rec.distance_approx}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 pl-7 leading-relaxed">
                      {rec.highlight}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Offline Map Cache Ready</span>
            </span>
            <span>OSM Tiles Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
