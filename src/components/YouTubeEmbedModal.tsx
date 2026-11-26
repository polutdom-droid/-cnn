import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ExternalLink,
  Film,
  Loader2,
  Upload,
  Volume2,
  X,
  Youtube,
} from 'lucide-react';

interface YouTubeEmbedModalProps {
  videoId: string | null;
  title: string;
  originalUrl: string;
  onSwitchToInAppVideo?: () => void;
  onClose: () => void;
}

type EmbedSourceMode = 'standard' | 'nocookie' | 'local';

export const YouTubeEmbedModal: React.FC<YouTubeEmbedModalProps> = ({
  videoId,
  title,
  originalUrl,
  onSwitchToInAppVideo,
  onClose,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [embedMode, setEmbedMode] = useState<EmbedSourceMode>('standard');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [localVideoName, setLocalVideoName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIframeLoaded(false);
    setEmbedMode('standard');
  }, [videoId]);

  useEffect(() => {
    return () => {
      if (localVideoUrl) {
        URL.revokeObjectURL(localVideoUrl);
      }
    };
  }, [localVideoUrl]);

  useEffect(() => {
    if (!videoId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [videoId, onClose]);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localVideoUrl) {
      URL.revokeObjectURL(localVideoUrl);
    }
    const objUrl = URL.createObjectURL(file);
    setLocalVideoUrl(objUrl);
    setLocalVideoName(file.name);
    setEmbedMode('local');
  };

  const embedUrl =
    videoId && embedMode === 'nocookie'
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&playsinline=1`
      : videoId
      ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&playsinline=1`
      : '';

  return (
    <AnimatePresence>
      {videoId && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="In-App Video Player"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-[#0b1322] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <Youtube className="h-5 w-5 text-red-500 shrink-0" />
                <h3 className="text-sm font-semibold text-slate-100 truncate font-khmer">
                  {embedMode === 'local' && localVideoName ? localVideoName : title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop-interactive inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 font-khmer"
                >
                  <span>YouTube</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Video Player"
                  className="pop-interactive rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Source Switcher inside the app */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#080e1a] px-4 py-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIframeLoaded(false);
                    setEmbedMode('standard');
                  }}
                  className={`pop-interactive rounded-lg px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                    embedMode === 'standard'
                      ? 'bg-red-600 text-white'
                      : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  YouTube Embed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIframeLoaded(false);
                    setEmbedMode('nocookie');
                  }}
                  className={`pop-interactive rounded-lg px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                    embedMode === 'nocookie'
                      ? 'bg-red-600 text-white'
                      : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  YouTube No-Cookie
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`pop-interactive inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold cursor-pointer font-khmer ${
                    embedMode === 'local'
                      ? 'bg-sky-600 text-white'
                      : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Upload className="h-3 w-3" />
                  <span>បើកឯកសារវីដេអូ (.mp4)</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/*"
                  onChange={handleLocalFileChange}
                  className="hidden"
                />
              </div>

              {onSwitchToInAppVideo && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToInAppVideo();
                  }}
                  className="pop-interactive inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white cursor-pointer font-khmer"
                >
                  <Film className="h-3.5 w-3.5" />
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>ចាក់វីដេអូពន្យល់ក្នុងកម្មវិធី (~60s)</span>
                </button>
              )}
            </div>

            {/* Video Stage */}
            <div className="relative aspect-video w-full bg-[#070d18]">
              {embedMode === 'local' && localVideoUrl ? (
                <video
                  src={localVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full bg-black"
                />
              ) : (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 px-6 text-center pointer-events-none">
                      <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
                      <p className="text-xs font-khmer text-slate-300">
                        កំពុងផ្ទុកវីដេអូ YouTube...
                      </p>
                    </div>
                  )}
                  <iframe
                    key={embedMode + videoId}
                    src={embedUrl}
                    title={title}
                    referrerPolicy="strict-origin-when-cross-origin"
                    onLoad={() => setIframeLoaded(true)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="relative z-10 w-full h-full border-0"
                  />
                </>
              )}
            </div>

            {/* Sandbox Info + Quick Fallback */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-[#080e1a] px-5 py-3 text-xs">
              <div className="flex items-start gap-2 text-slate-300 font-khmer min-w-0 flex-1">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  ចំណាំ៖ ប្រអប់ Preview របស់ AI Studio អាចរាំងខ្ទប់ការផ្ទុកផ្ទាំង YouTube (ធ្វើឲ្យឃើញពណ៌ខ្មៅ)។ បើបើកតាមតំណ App URL ផ្ទាល់ ឬប្រើ «វីដេអូពន្យល់ក្នុងកម្មវិធី (~60s)» / «បើកឯកសារ .mp4» វានឹងចាក់នៅក្នុងកម្មវិធីនេះបាន ១០០%។
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
