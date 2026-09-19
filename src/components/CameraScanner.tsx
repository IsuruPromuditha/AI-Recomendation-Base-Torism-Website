import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  Eye,
  Utensils,
  Landmark,
  Languages,
  Compass,
  AlertCircle,
  ScanLine,
  Image as ImageIcon,
} from 'lucide-react';
import { TravelAnalysisResult } from '../types';
import { PRESET_SAMPLE_SCANS } from '../data/sampleScans';

interface CameraScannerProps {
  onAnalyze: (image: string, scanTypeHint?: string) => Promise<void>;
  isLoading: boolean;
  onSelectPreset: (sample: TravelAnalysisResult) => void;
  currentLocationName: string;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onAnalyze,
  isLoading,
  onSelectPreset,
  currentLocationName,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'presets'>('presets');
  const [activeModeHint, setActiveModeHint] = useState<string>('all');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [dragOver, setDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Manage camera stream lifecycle
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn('Video play warning:', err));
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Camera permission denied or camera device unavailable.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onAnalyze(dataUrl, activeModeHint);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onAnalyze(event.target.result as string, activeModeHint);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Hidden Canvas for Camera Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Mode Hint Selector Bar */}
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ScanLine className="w-3.5 h-3.5 text-amber-400" /> Scanner Mode:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All-in-One Auto', icon: Sparkles },
            { id: 'signs', label: 'Signs & Menus (OCR)', icon: Languages },
            { id: 'food', label: 'Cuisine & Allergens', icon: Utensils },
            { id: 'landmarks', label: 'Heritage & Ruins', icon: Landmark },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeModeHint === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveModeHint(mode.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Capture Input Tabs */}
      <div className="p-4 sm:p-6">
        <div className="flex rounded-xl bg-slate-950/80 p-1 mb-5 border border-slate-800">
          <button
            id="tab-presets"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'presets'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Test Drive</span>
          </button>

          <button
            id="tab-camera"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'camera'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            id="tab-upload"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Tab 1: Instant Preset Test-Drive Carousel */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Select a Travel Subject for Multimodal Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Real photos of native Sinhala/Tamil scripts, UNESCO citadels, and iconic street dishes.
                </p>
              </div>
              <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                1-Click Inspection
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PRESET_SAMPLE_SCANS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => onSelectPreset(sample)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-amber-500/60 hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={sample.image}
                      alt={sample.identification}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm ${
                          sample.category === 'Food'
                            ? 'bg-orange-500/90 text-white'
                            : sample.category === 'Landmark'
                            ? 'bg-emerald-600/90 text-white'
                            : 'bg-blue-600/90 text-white'
                        }`}
                      >
                        {sample.category}
                      </span>
                      {sample.detected_script && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 border border-slate-700 backdrop-blur-md">
                          {sample.detected_script}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                        {sample.identification}
                      </p>
                      {sample.native_name && (
                        <p className="text-[11px] text-amber-300/90 font-mono truncate">
                          {sample.native_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                      {sample.cultural_context}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                      <span className="truncate flex items-center gap-1">
                        <Compass className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        {sample.location.name}
                      </span>
                      <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Inspect →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Live Camera Viewfinder */}
        {activeTab === 'camera' && (
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-[4/3] sm:aspect-video flex items-center justify-center">
            {cameraError ? (
              <div className="p-6 text-center max-w-sm">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Camera Unavailable</h4>
                <p className="text-xs text-slate-400 mb-4">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
                >
                  Retry Camera
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                  {/* Top Bar inside viewfinder */}
                  <div className="flex items-center justify-between text-xs text-white/90 drop-shadow">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE FEED • {currentLocationName}
                    </span>

                    <button
                      onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')}
                      className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md transition-colors"
                      title="Flip Camera"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Center Target Box for Text / Monument / Dish */}
                  <div className="relative mx-auto w-4/5 max-w-sm aspect-[4/3] border-2 border-dashed border-amber-400/80 rounded-2xl flex flex-col items-center justify-center p-4">
                    {/* Viewfinder Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 -mt-0.5 -ml-0.5" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 -mt-0.5 -mr-0.5" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 -mb-0.5 -ml-0.5" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 -mb-0.5 -mr-0.5" />

                    <p className="text-[11px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-center shadow">
                      Align native script sign, dish, or monument
                    </p>
                  </div>

                  {/* Shutter Button */}
                  <div className="flex justify-center items-center pb-2 pointer-events-auto">
                    <button
                      id="btn-capture-camera"
                      onClick={capturePhoto}
                      disabled={isLoading}
                      className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white transition-all active:scale-95 hover:bg-white/30"
                      title="Capture Photo for Multimodal Analysis"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-400 group-hover:bg-amber-300 transition-colors shadow-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-slate-950" />
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 3: Upload from Device */}
        {activeTab === 'upload' && (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                dragOver
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-slate-700 hover:border-amber-500/60 bg-slate-950/40 hover:bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
                <ImageIcon className="w-7 h-7 text-amber-400" />
              </div>

              <h4 className="text-sm font-semibold text-slate-100 mb-1">
                Upload Photo from Gallery or File
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Drag and drop your vacation photo of roadside signs, temple ruins, or street dishes.
              </p>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow transition-colors inline-flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Browse Device Storage
              </button>
            </div>
          </div>
        )}

        {/* Global Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 animate-spin">
                <div className="w-full h-full bg-slate-900 rounded-[14px]" />
              </div>
              <Compass className="w-8 h-8 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <span>Multimodal Vision in Progress</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            </h3>

            <p className="text-xs text-slate-300 max-w-md mb-3 leading-relaxed">
              Deciphering native Sinhala/Tamil scripts, consulting cultural heritage records, and cross-referencing GPS coordinates...
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300/90 bg-slate-900/90 px-3 py-1 rounded-full border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Target: {currentLocationName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
