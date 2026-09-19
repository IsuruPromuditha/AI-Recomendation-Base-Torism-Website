import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Trash2,
  X,
  Search,
  Download,
  Calendar,
  MapPin,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { TravelAnalysisResult } from '../types';

interface SavedScansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scans: TravelAnalysisResult[];
  onSelectScan: (scan: TravelAnalysisResult) => void;
  onToggleBookmark: (id: string) => void;
  onDeleteScan: (id: string) => void;
}

export const SavedScansDrawer: React.FC<SavedScansDrawerProps> = ({
  isOpen,
  onClose,
  scans,
  onSelectScan,
  onToggleBookmark,
  onDeleteScan,
}) => {
  const [filter, setFilter] = useState<'all' | 'favorites' | 'Food' | 'Landmark' | 'Sign/Text'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredScans = scans.filter((scan) => {
    if (filter === 'favorites' && !scan.isBookmarked) return false;
    if (filter !== 'all' && filter !== 'favorites' && scan.category !== filter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = scan.identification.toLowerCase().includes(q);
      const matchLoc = scan.location.name.toLowerCase().includes(q);
      const matchNative = scan.native_name?.toLowerCase().includes(q);
      const matchTrans = scan.translation?.toLowerCase().includes(q);
      return matchName || matchLoc || matchNative || matchTrans;
    }
    return true;
  });

  const handleExportJournal = () => {
    const journalText = scans
      .map(
        (s, idx) => `
=========================================
#${idx + 1}: ${s.identification} (${s.category})
Native Name: ${s.native_name || 'N/A'}
Pronunciation: ${s.phonetic_pronunciation || 'N/A'}
Location: ${s.location.name} (${s.location.latitude}, ${s.location.longitude})
Date: ${new Date(s.timestamp).toLocaleString()}
Translation: ${s.translation}

[Cultural & Historical Context]
${s.cultural_context}

[Dietary Warnings / Notes]
${(s.dietary_warnings || []).join('\n')}

[Local Etiquette]
${(s.etiquette_tips || []).join('\n')}
=========================================
`
      )
      .join('\n');

    const blob = new Blob([journalText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WayFarer-Travel-Journal-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="saved-scans-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Offline Travel Log & Bookmarks</h3>
            <p className="text-[11px] text-slate-400">
              {scans.length} total entries saved locally & on server
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {scans.length > 0 && (
            <button
              id="btn-export-journal"
              onClick={handleExportJournal}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Download formatted travel diary"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-log"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved scans, scripts, dishes, sites..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'favorites', label: 'Starred' },
            { id: 'Food', label: 'Culinary' },
            { id: 'Landmark', label: 'Landmarks' },
            { id: 'Sign/Text', label: 'Signs & OCR' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === item.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 no-scrollbar">
        {filteredScans.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center mb-3">
              <Bookmark className="w-6 h-6 text-slate-600" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300 mb-1">No Scans Found</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search query or filter criteria.'
                : 'Capture photos with the camera or click instant samples to build your travel log!'}
            </p>
          </div>
        ) : (
          filteredScans.map((scan) => (
            <div
              key={scan.id}
              className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all flex gap-3 group"
            >
              {/* Thumbnail */}
              <div
                onClick={() => {
                  onSelectScan(scan);
                  onClose();
                }}
                className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 cursor-pointer relative"
              >
                <img
                  src={scan.image}
                  alt={scan.identification}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${
                    scan.category === 'Food'
                      ? 'bg-orange-500'
                      : scan.category === 'Landmark'
                      ? 'bg-emerald-600'
                      : 'bg-blue-600'
                  }`}
                >
                  {scan.category}
                </span>
              </div>

              {/* Summary Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div
                  onClick={() => {
                    onSelectScan(scan);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                    {scan.identification}
                  </h4>
                  {scan.native_name && (
                    <p className="text-[11px] text-amber-300/90 font-mono truncate">
                      {scan.native_name}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {scan.translation || scan.cultural_context}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    {scan.location.name}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleBookmark(scan.id)}
                      className="p-1 text-slate-400 hover:text-amber-400"
                      title={scan.isBookmarked ? 'Unbookmark' : 'Bookmark'}
                    >
                      {scan.isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Delete from log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
