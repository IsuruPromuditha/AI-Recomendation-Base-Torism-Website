import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  MessageSquare,
  MapPin,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Compass,
  Info,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { TravelAnalysisResult } from '../types';
import { playPronunciation, stopPronunciation } from '../lib/speech';
import { formatCoordinates } from '../lib/geo';

interface AnalysisResultCardProps {
  result: TravelAnalysisResult;
  onToggleBookmark: (id: string) => void;
  onOpenAssistant: (initialQuestion?: string) => void;
  onScrollToMap: () => void;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  result,
  onToggleBookmark,
  onOpenAssistant,
  onScrollToMap,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleAudioPlay = async () => {
    if (isPlayingAudio) {
      stopPronunciation();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const phrase = result.audio_phrase || result.phonetic_pronunciation || result.identification;
    await playPronunciation(phrase, result.detected_script);
    setIsPlayingAudio(false);
  };

  const handleCopyTranslation = () => {
    if (result.translation) {
      navigator.clipboard.writeText(result.translation);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const isFood = result.category === 'Food';
  const isLandmark = result.category === 'Landmark';
  const isSign = result.category === 'Sign/Text';

  return (
    <article
      id={`analysis-card-${result.id}`}
      className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Top Meta Bar */}
      <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
              isFood
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : isLandmark
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}
          >
            {result.category}
          </span>

          <span className="text-xs text-slate-400 font-medium">
            {result.sub_category}
          </span>

          {result.detected_script && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-amber-300/90 border border-slate-700">
              Script: {result.detected_script}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {result.confidence_score && (
            <span className="hidden sm:inline-flex text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {Math.round(result.confidence_score * 100)}% Match
            </span>
          )}

          <button
            id="btn-card-bookmark"
            onClick={() => onToggleBookmark(result.id)}
            className={`p-2 rounded-xl border transition-all ${
              result.isBookmarked
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={result.isBookmarked ? 'Saved to Offline Log' : 'Save to Offline Log'}
          >
            {result.isBookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Image & Quick Details */}
        <div className="lg:col-span-5 relative bg-slate-950 overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[260px] w-full">
            <img
              src={result.image}
              alt={result.identification}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* GPS Pin Badge on Image */}
            <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 text-[11px] text-slate-200 flex items-center gap-1.5 shadow">
              <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="truncate max-w-[170px]">{result.location.name}</span>
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-3 left-3 right-3">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                {result.identification}
              </h2>
              {result.native_name && (
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-sm sm:text-base font-semibold text-amber-300 drop-shadow">
                    {result.native_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Comprehensive Knowledge Cards */}
        <div className="lg:col-span-7 p-5 sm:p-6 space-y-5">
          {/* Pronunciation & Audio Guide */}
          {result.phonetic_pronunciation && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 block mb-0.5">
                  Phonetic Pronunciation
                </span>
                <p className="text-sm font-semibold text-slate-100 tracking-wide font-mono">
                  "{result.phonetic_pronunciation}"
                </p>
                {result.audio_phrase && (
                  <p className="text-xs text-amber-200/80 mt-1 italic truncate">
                    Useful phrase: "{result.audio_phrase}"
                  </p>
                )}
              </div>

              <button
                id="btn-listen-pronunciation"
                onClick={handleAudioPlay}
                className={`p-3 rounded-xl font-medium text-xs flex items-center gap-2 transition-all flex-shrink-0 ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-slate-950 animate-pulse font-bold'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-md'
                }`}
                title="Speak audio pronunciation"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Speaking</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Pronounce</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* OCR & Translation Panel */}
          {result.translation && result.translation !== 'N/A' && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {isSign ? 'OCR Sign Translation' : 'Meaning & Translation'}
                </span>
                <button
                  onClick={handleCopyTranslation}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  title="Copy translation"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {result.original_text && result.original_text !== 'N/A' && (
                <p className="text-xs font-mono text-amber-300/80 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  {result.original_text}
                </p>
              )}

              <p className="text-sm font-medium text-slate-100 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                {result.translation}
              </p>
            </div>
          )}

          {/* Dietary & Allergen Warning Section (Food Specific) */}
          {result.dietary_warnings && result.dietary_warnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Dietary, Allergen & Health Warnings
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.dietary_warnings.map((warning, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-500/30"
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />
                    {warning}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients / Materials Section */}
          {result.ingredients && result.ingredients.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 mb-1.5 block">
                {isFood ? 'Key Ingredients' : 'Architectural Materials & Elements'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.ingredients.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Context & Historical Background */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              Historical & Cultural Significance
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
              {result.cultural_context}
            </p>
          </div>

          {/* Practical Traveler Etiquette */}
          {result.etiquette_tips && result.etiquette_tips.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Local Etiquette & Traveler Guidance
              </span>
              <ul className="text-xs text-slate-300 space-y-1 pl-1">
                {result.etiquette_tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Action Triggers */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-800">
            <button
              id="btn-ask-ai-guide"
              onClick={() => onOpenAssistant(`Tell me more about ${result.identification} and what I should be careful about here.`)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI Guide Follow-up</span>
            </button>

            <button
              id="btn-view-map"
              onClick={onScrollToMap}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Explore Nearby on Map</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
