import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  Captions,
  Film,
  Gauge,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  buildKeyPointVideoScenes,
  VideoScene,
  VideoVisualKind,
} from '../data/keyPointMedia';
import { CnnSlide, LanguageMode } from '../types/slide';
import { MiniVideo3DStage } from './MiniVideo3DStage';

interface MiniVideoModalProps {
  slide: CnnSlide;
  language: LanguageMode;
  isOpen: boolean;
  /** When set, plays the 60-second video tailored to that specific Key Point; otherwise plays the slide walkthrough. */
  keyPointIndex?: number | null;
  onClose: () => void;
}

type VoiceLang = 'km' | 'en';
type TtsStatus = 'idle' | 'loading' | 'ready' | 'error';

const SPRING_BOUNCE = { type: 'spring' as const, stiffness: 460, damping: 18 };
const SPEED_OPTIONS: ReadonlyArray<0.9 | 1 | 1.25> = [0.9, 1, 1.25];

function formatSec(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

function getWavDurationFromBuffer(buf: ArrayBuffer): number | null {
  if (buf.byteLength <= 44) return null;
  const view = new DataView(buf);
  const byteRate = view.getUint32(28, true);
  if (!byteRate || !Number.isFinite(byteRate)) return null;
  const sec = (buf.byteLength - 44) / byteRate;
  return Number.isFinite(sec) && sec > 0.5 ? sec : null;
}

export const MiniVideoModal: React.FC<MiniVideoModalProps> = ({
  slide,
  language,
  isOpen,
  keyPointIndex = null,
  onClose,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const scenes: VideoScene[] = useMemo(() => {
    if (keyPointIndex !== null && keyPointIndex >= 0 && keyPointIndex < slide.keyPoints.length) {
      return buildKeyPointVideoScenes(slide, keyPointIndex);
    }
    const rawSteps = slide.miniVideoSteps;
    if (rawSteps.length <= 3) {
      return rawSteps.map((st, idx) => ({
        id: `slide-${slide.id}-step-${idx}`,
        title: st.title,
        subtitle: st.narration,
        voiceScript: st.narration,
        highlightFormula: st.highlightFormula,
        visualKind:
          st.highlightFormula
            ? 'formula'
            : idx === 0
            ? 'overview'
            : idx === rawSteps.length - 1
            ? 'architecture'
            : slide.visualType === 'max-pooling'
            ? 'pooling'
            : slide.visualType === 'spatial-stride' || slide.visualType === 'padding'
            ? 'padding-stride'
            : 'convolution',
        durationSec: Math.max(18, st.durationSec * 3),
      }));
    }

    // Consolidate >3 steps into 3 rich 20s scenes to stay comfortably within 3 RPM TTS limits
    const first = rawSteps[0];
    const mid = rawSteps.slice(1, rawSteps.length - 1);
    const last = rawSteps[rawSteps.length - 1];
    const formulaStep = rawSteps.find((s) => s.highlightFormula);
    const coreVisual: VideoVisualKind =
      slide.visualType === 'max-pooling'
        ? 'pooling'
        : slide.visualType === 'spatial-stride' || slide.visualType === 'padding'
        ? 'padding-stride'
        : 'convolution';

    return [
      {
        id: `slide-${slide.id}-grouped-1`,
        title: first.title,
        subtitle: first.narration,
        voiceScript: first.narration,
        visualKind: 'overview',
        durationSec: 20,
      },
      {
        id: `slide-${slide.id}-grouped-2`,
        title: mid[0].title,
        subtitle: {
          en: mid.map((m) => m.narration.en).join(' '),
          km: mid.map((m) => m.narration.km).join(' '),
        },
        voiceScript: {
          en: mid.map((m) => m.narration.en).join(' '),
          km: mid.map((m) => m.narration.km).join(' '),
        },
        visualKind: coreVisual,
        durationSec: 21,
      },
      {
        id: `slide-${slide.id}-grouped-3`,
        title: last.title,
        subtitle: last.narration,
        voiceScript: last.narration,
        highlightFormula: formulaStep?.highlightFormula ?? slide.formula?.latex,
        visualKind: formulaStep?.highlightFormula || slide.formula?.latex ? 'formula' : 'architecture',
        durationSec: 19,
      },
    ];
  }, [slide, keyPointIndex]);

  const defaultVoiceLang: VoiceLang = language === 'en' ? 'en' : 'km';

  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceLang, setVoiceLang] = useState<VoiceLang>(defaultVoiceLang);
  const [showCaptions, setShowCaptions] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<0.9 | 1 | 1.25>(1);
  const [ttsStatus, setTtsStatus] = useState<TtsStatus>('idle');
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [rateLimitWaitSec, setRateLimitWaitSec] = useState<number>(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [sceneAudioDurations, setSceneAudioDurations] = useState<Record<string, number>>({});

  const effectiveDurations = useMemo(
    () =>
      scenes.map((sc) => {
        if (!voiceEnabled) return sc.durationSec;
        const measured = sceneAudioDurations[`${sc.id}::${voiceLang}`];
        return measured && measured > 1 ? measured : sc.durationSec;
      }),
    [scenes, sceneAudioDurations, voiceEnabled, voiceLang]
  );

  const sceneStartOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    for (const dur of effectiveDurations) {
      offsets.push(acc);
      acc += dur;
    }
    return offsets;
  }, [effectiveDurations]);

  const totalDuration = useMemo(
    () => effectiveDurations.reduce((sum, d) => sum + d, 0),
    [effectiveDurations]
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlCacheRef = useRef<Map<string, string>>(new Map());
  const inFlightCacheRef = useRef<Map<string, Promise<string>>>(new Map());
  const activeAudioKeyRef = useRef<string | null>(null);
  const activeRequestTokenRef = useRef(0);
  const isAudioWaitingOrPlayingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const playbackRateRef = useRef(playbackRate);
  const ttsStatusRef = useRef<TtsStatus>(ttsStatus);
  const sceneElapsedRef = useRef(sceneElapsed);
  const rateLimitWaitSecRef = useRef(rateLimitWaitSec);

  playbackRateRef.current = playbackRate;
  ttsStatusRef.current = ttsStatus;
  sceneElapsedRef.current = sceneElapsed;
  rateLimitWaitSecRef.current = rateLimitWaitSec;

  // Clean up all cached Blob URLs when modal component unmounts
  useEffect(() => {
    const cache = blobUrlCacheRef.current;
    return () => {
      for (const url of cache.values()) {
        URL.revokeObjectURL(url);
      }
      cache.clear();
    };
  }, []);

  const fetchSceneAudioUrl = useCallback(
    async (scene: VideoScene, lang: VoiceLang): Promise<string> => {
      const text = (lang === 'km' ? scene.voiceScript.km : scene.voiceScript.en).trim();
      const cacheKey = `${scene.id}::${lang}::${text}`;

      const cachedUrl = blobUrlCacheRef.current.get(cacheKey);
      if (cachedUrl) return cachedUrl;

      const existingPromise = inFlightCacheRef.current.get(cacheKey);
      if (existingPromise) return existingPromise;

      const promise = (async () => {
        const durKey = `${scene.id}::${lang}`;
        // Check persistent browser CacheStorage first to avoid duplicate API requests across reloads
        const storageKey = `https://cnn-studio.local/tts/${encodeURIComponent(lang)}/${encodeURIComponent(scene.id)}?len=${text.length}`;
        if (typeof caches !== 'undefined') {
          try {
            const cache = await caches.open('cnn-tts-audio-v1');
            const hit = await cache.match(storageKey);
            if (hit) {
              const buf = await hit.arrayBuffer();
              if (buf.byteLength > 44) {
                const dur = getWavDurationFromBuffer(buf);
                if (dur) {
                  setSceneAudioDurations((prev) =>
                    prev[durKey] === dur ? prev : { ...prev, [durKey]: dur }
                  );
                }
                const cachedBlob = new Blob([buf], { type: 'audio/wav' });
                const cachedBlobUrl = URL.createObjectURL(cachedBlob);
                blobUrlCacheRef.current.set(cacheKey, cachedBlobUrl);
                return cachedBlobUrl;
              }
            }
          } catch {
            // CacheStorage unavailable; fall through to network fetch
          }
        }

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceLang: lang }),
        });
        if (!res.ok) {
          let message = `HTTP ${res.status}`;
          let retryAfterSec = 0;
          try {
            const payload = (await res.json()) as {
              error?: string;
              rateLimited?: boolean;
              retryAfterSec?: number;
            };
            if (payload?.error) message = payload.error;
            if (payload?.retryAfterSec) retryAfterSec = payload.retryAfterSec;
          } catch {
            // fallback to HTTP status
          }
          const err = new Error(message) as Error & { retryAfterSec?: number };
          if (res.status === 429) {
            err.retryAfterSec = retryAfterSec || 16;
          }
          throw err;
        }
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.toLowerCase().includes('audio/')) {
          throw new Error(`Invalid audio content type: ${contentType || 'none'}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        if (arrayBuffer.byteLength <= 44) {
          throw new Error('Returned audio clip was empty.');
        }

        const dur = getWavDurationFromBuffer(arrayBuffer);
        if (dur) {
          setSceneAudioDurations((prev) =>
            prev[durKey] === dur ? prev : { ...prev, [durKey]: dur }
          );
        }

        // Persist in CacheStorage for instant offline replay
        if (typeof caches !== 'undefined') {
          try {
            const cache = await caches.open('cnn-tts-audio-v1');
            await cache.put(
              storageKey,
              new Response(arrayBuffer.slice(0), {
                headers: { 'Content-Type': 'audio/wav' },
              })
            );
          } catch {
            // Non-fatal CacheStorage write failure
          }
        }

        const wavBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(wavBlob);
        blobUrlCacheRef.current.set(cacheKey, url);
        return url;
      })();

      inFlightCacheRef.current.set(cacheKey, promise);
      try {
        return await promise;
      } finally {
        inFlightCacheRef.current.delete(cacheKey);
      }
    },
    []
  );

  const stopAudio = useCallback((clearSource = false) => {
    activeRequestTokenRef.current += 1;
    isAudioWaitingOrPlayingRef.current = false;
    setAutoplayBlocked(false);
    const el = audioRef.current;
    if (el) {
      el.pause();
      if (clearSource) {
        el.removeAttribute('src');
        activeAudioKeyRef.current = null;
      }
    }
  }, []);

  const playSceneAudio = useCallback(
    async (sceneIdx: number, lang: VoiceLang) => {
      const scene = scenes[sceneIdx];
      if (!scene || !voiceEnabled || !isPlaying) return;

      const requestKey = `${scene.id}::${lang}`;
      const el = audioRef.current;
      if (!el) return;

      // Resume paused audio on the exact same scene+language instead of restarting
      if (activeAudioKeyRef.current === requestKey && el.src && !el.ended) {
        el.playbackRate = playbackRateRef.current;
        setTtsStatus('ready');
        setTtsError(null);
        isAudioWaitingOrPlayingRef.current = true;
        try {
          await el.play();
          setAutoplayBlocked(false);
        } catch (err) {
          if (err instanceof DOMException && err.name === 'NotAllowedError') {
            setAutoplayBlocked(true);
            isAudioWaitingOrPlayingRef.current = false;
          }
        }
        return;
      }

      const token = ++activeRequestTokenRef.current;
      isAudioWaitingOrPlayingRef.current = true;
      setTtsError(null);
      setRateLimitWaitSec(0);
      setAutoplayBlocked(false);

      const text = (lang === 'km' ? scene.voiceScript.km : scene.voiceScript.en).trim();
      const cacheKey = `${scene.id}::${lang}::${text}`;
      const isAlreadyCached = blobUrlCacheRef.current.has(cacheKey);
      if (!isAlreadyCached) {
        setTtsStatus('loading');
      }

      try {
        const audioUrl = await fetchSceneAudioUrl(scene, lang);
        if (activeRequestTokenRef.current !== token) return;

        activeAudioKeyRef.current = requestKey;
        el.src = audioUrl;
        el.playbackRate = playbackRateRef.current;
        if (pendingSeekRef.current !== null) {
          el.currentTime = Math.max(0, pendingSeekRef.current);
          pendingSeekRef.current = null;
        }
        setTtsStatus('ready');

        try {
          await el.play();
          if (activeRequestTokenRef.current === token) {
            isAudioWaitingOrPlayingRef.current = true;
            setAutoplayBlocked(false);
          }
        } catch (playErr) {
          if (activeRequestTokenRef.current !== token) return;
          if (playErr instanceof DOMException && playErr.name === 'NotAllowedError') {
            setAutoplayBlocked(true);
            isAudioWaitingOrPlayingRef.current = false;
          } else {
            throw playErr;
          }
        }
      } catch (err) {
        if (activeRequestTokenRef.current !== token) return;
        isAudioWaitingOrPlayingRef.current = false;
        setTtsStatus('error');
        const waitSec = (err as { retryAfterSec?: number })?.retryAfterSec ?? 0;
        if (waitSec > 0) {
          setRateLimitWaitSec(waitSec);
          setTtsError(null);
        } else {
          setTtsError(
            err instanceof Error ? err.message : 'Unable to load bilingual voice audio.'
          );
        }
      }
    },
    [fetchSceneAudioUrl, isPlaying, scenes, voiceEnabled]
  );

  // Automatic 429 countdown & retry once rate-limit window clears
  useEffect(() => {
    if (!isOpen || !voiceEnabled || !isPlaying || rateLimitWaitSec <= 0) return;
    const timer = window.setTimeout(() => {
      if (rateLimitWaitSec <= 1) {
        setRateLimitWaitSec(0);
        activeAudioKeyRef.current = null;
        void playSceneAudio(sceneIndex, voiceLang);
      } else {
        setRateLimitWaitSec((prev) => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [isOpen, isPlaying, playSceneAudio, rateLimitWaitSec, sceneIndex, voiceEnabled, voiceLang]);

  // Sync audio playbackRate dynamically without restarting current clip
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Reset player state when modal opens or slide/keyPoint changes
  useEffect(() => {
    if (!isOpen) {
      stopAudio(true);
      setTtsStatus('idle');
      setTtsError(null);
      setRateLimitWaitSec(0);
      return;
    }
    setVoiceLang(language === 'en' ? 'en' : 'km');
    setVoiceEnabled(true);
    setSceneIndex(0);
    setSceneElapsed(0);
    pendingSeekRef.current = null;
    setTtsError(null);
    activeAudioKeyRef.current = null;
    setIsPlaying(true);

    return () => {
      stopAudio(true);
    };
  }, [isOpen, slide.id, keyPointIndex, language, stopAudio]);

  // Trigger audio load/playback when active scene, language, play state, or voice toggle changes
  useEffect(() => {
    if (!isOpen || !isPlaying || !voiceEnabled) {
      if (isOpen) {
        stopAudio(!voiceEnabled);
        if (!voiceEnabled) setTtsStatus('idle');
      }
      return;
    }
    void playSceneAudio(sceneIndex, voiceLang);
  }, [isOpen, isPlaying, voiceEnabled, sceneIndex, voiceLang, playSceneAudio, stopAudio]);

  // Audio-Master Clock: locks sceneElapsed & scene advancement 1:1 to audio.currentTime / onEnded
  useEffect(() => {
    if (!isOpen || !isPlaying || scenes.length === 0) return;
    const currentScene = scenes[sceneIndex];
    if (!currentScene) return;
    const sceneDuration = effectiveDurations[sceneIndex] ?? currentScene.durationSec;

    const tickMs = 50;
    const interval = setInterval(() => {
      const el = audioRef.current;
      const expectedKey = `${currentScene.id}::${voiceLang}`;

      // If voice narration is enabled & actively playing this clip, audio.currentTime IS the master clock
      if (
        voiceEnabled &&
        ttsStatusRef.current === 'ready' &&
        !autoplayBlocked &&
        rateLimitWaitSecRef.current === 0 &&
        el &&
        el.src &&
        activeAudioKeyRef.current === expectedKey
      ) {
        if (el.ended) {
          setSceneElapsed(sceneDuration);
          if (sceneIndex < scenes.length - 1) {
            activeAudioKeyRef.current = null;
            pendingSeekRef.current = null;
            setSceneIndex((idx) => idx + 1);
            setSceneElapsed(0);
          } else {
            setIsPlaying(false);
            stopAudio(true);
          }
          return;
        }
        if (!el.paused) {
          setSceneElapsed(Math.min(sceneDuration, el.currentTime));
          return;
        }
      }

      // Hold visual timeline cleanly while waiting for initial audio or 429 countdown
      if (
        voiceEnabled &&
        (ttsStatusRef.current === 'loading' || rateLimitWaitSecRef.current > 0 || autoplayBlocked)
      ) {
        return;
      }

      // Software fallback clock when Muted or TTS error
      setSceneElapsed((prev) => {
        const next = prev + (tickMs / 1000) * playbackRate;
        if (next < sceneDuration) {
          return next;
        }
        if (sceneIndex < scenes.length - 1) {
          activeAudioKeyRef.current = null;
          pendingSeekRef.current = null;
          setSceneIndex((idx) => idx + 1);
          return 0;
        } else {
          setIsPlaying(false);
          stopAudio(true);
          return sceneDuration;
        }
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [
    autoplayBlocked,
    effectiveDurations,
    isOpen,
    isPlaying,
    playbackRate,
    sceneIndex,
    scenes,
    stopAudio,
    voiceEnabled,
    voiceLang,
  ]);

  // Keyboard Escape handler
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopAudio(true);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, stopAudio]);

  const currentScene = scenes[sceneIndex] ?? scenes[0];
  const currentSceneDuration = effectiveDurations[sceneIndex] ?? currentScene?.durationSec ?? 20;
  const currentTotalTime = (sceneStartOffsets[sceneIndex] ?? 0) + sceneElapsed;

  const seekToTime = (targetSec: number) => {
    const clamped = Math.max(0, Math.min(totalDuration - 0.05, targetSec));
    let targetIdx = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (clamped >= sceneStartOffsets[i]) {
        targetIdx = i;
      }
    }
    const localElapsed = Math.max(0, clamped - sceneStartOffsets[targetIdx]);
    if (targetIdx !== sceneIndex) {
      pendingSeekRef.current = localElapsed;
      stopAudio(true);
      setSceneIndex(targetIdx);
    } else if (audioRef.current && audioRef.current.src) {
      const dur = audioRef.current.duration;
      const maxSeek = Number.isFinite(dur) && dur > 0.2 ? dur - 0.1 : localElapsed;
      audioRef.current.currentTime = Math.min(maxSeek, localElapsed);
    }
    setSceneElapsed(localElapsed);
  };

  const jumpToScene = (idx: number) => {
    const clampedIdx = Math.max(0, Math.min(scenes.length - 1, idx));
    pendingSeekRef.current = null;
    stopAudio(true);
    setSceneIndex(clampedIdx);
    setSceneElapsed(0);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudio(false);
      return;
    }
    if (sceneIndex === scenes.length - 1 && sceneElapsed >= (currentScene?.durationSec ?? 0) - 0.15) {
      stopAudio(true);
      setSceneIndex(0);
      setSceneElapsed(0);
    }
    setIsPlaying(true);
  };

  const handleCycleSpeed = () => {
    const idx = SPEED_OPTIONS.indexOf(playbackRate);
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    setPlaybackRate(next);
  };

  const handleSwitchVoiceLang = (nextLang: VoiceLang) => {
    if (nextLang === voiceLang && voiceEnabled) return;
    stopAudio(true);
    setVoiceLang(nextLang);
    if (!voiceEnabled) {
      setVoiceEnabled(true);
    }
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const headerTitle =
    keyPointIndex !== null && keyPointIndex >= 0
      ? `Slide ${slide.id} · Point ${keyPointIndex + 1} Mini-Video`
      : `Slide ${slide.id}: ${language === 'km' ? slide.title.km : slide.title.en}`;

  return (
    <AnimatePresence>
      {isOpen && scenes.length > 0 && currentScene && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              stopAudio(true);
              onClose();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Interactive Bilingual Concept Mini-Video Player"
        >
          {/* Persistent hidden HTMLAudioElement for reliable playback & scrubbing */}
          <audio
            ref={audioRef}
            className="hidden"
            onLoadedMetadata={() => {
              const el = audioRef.current;
              const sc = scenes[sceneIndex];
              if (el && sc && Number.isFinite(el.duration) && el.duration > 0.5) {
                const durKey = `${sc.id}::${voiceLang}`;
                setSceneAudioDurations((prev) =>
                  prev[durKey] === el.duration ? prev : { ...prev, [durKey]: el.duration }
                );
              }
            }}
            onEnded={() => {
              isAudioWaitingOrPlayingRef.current = false;
            }}
            onPause={() => {
              if (!isPlaying || !voiceEnabled) {
                isAudioWaitingOrPlayingRef.current = false;
              }
            }}
            onError={() => {
              isAudioWaitingOrPlayingRef.current = false;
            }}
          />

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-[#0b1322] shadow-2xl overflow-hidden"
          >
            {/* Header with Speed, CC, Bilingual Voice Switcher [ខ្មែរ | EN], and Voice Status */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800 px-4 sm:px-5 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Film className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100 truncate font-khmer">
                    {headerTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                    Scene {sceneIndex + 1} / {scenes.length} · {formatSec(currentTotalTime)} / {formatSec(totalDuration)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Speed cycle button */}
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                  transition={SPRING_BOUNCE}
                  onClick={handleCycleSpeed}
                  title="Playback speed (0.9x / 1x / 1.25x)"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700/90 bg-slate-800/80 px-2.5 py-1.5 font-mono text-xs font-semibold text-sky-400 hover:bg-slate-800 cursor-pointer"
                >
                  <Gauge className="h-3.5 w-3.5" />
                  <span>{playbackRate}x</span>
                </motion.button>

                {/* CC Subtitle toggle */}
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                  transition={SPRING_BOUNCE}
                  onClick={() => setShowCaptions((prev) => !prev)}
                  title={showCaptions ? 'Hide subtitles (CC)' : 'Show subtitles (CC)'}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                    showCaptions
                      ? 'border-sky-500/50 bg-sky-500/15 text-sky-300'
                      : 'border-slate-700 bg-slate-800/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Captions className="h-3.5 w-3.5" />
                  <span>CC</span>
                </motion.button>

                {/* Bilingual Audio Switcher: [ ខ្មែរ | EN ] */}
                <div
                  className="flex items-center rounded-lg border border-slate-700/90 bg-[#080f1c] p-0.5"
                  role="group"
                  aria-label="Narration language"
                >
                  <button
                    type="button"
                    onClick={() => handleSwitchVoiceLang('km')}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold font-khmer cursor-pointer transition-colors ${
                      voiceLang === 'km'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    ខ្មែរ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchVoiceLang('en')}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold font-mono cursor-pointer transition-colors ${
                      voiceLang === 'en'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Audio status / Mute button */}
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                  transition={SPRING_BOUNCE}
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (!next) {
                      stopAudio(true);
                      setTtsStatus('idle');
                    }
                  }}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold font-khmer cursor-pointer transition-colors ${
                    !voiceEnabled
                      ? 'border-slate-700 bg-slate-800 text-slate-400'
                      : ttsStatus === 'loading'
                      ? 'border-emerald-500/70 bg-emerald-500/15 text-emerald-300'
                      : ttsStatus === 'error'
                      ? 'border-rose-500/60 bg-rose-500/15 text-rose-300'
                      : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                  }`}
                >
                  {!voiceEnabled ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      <span>បិទសំឡេង</span>
                    </>
                  ) : ttsStatus === 'loading' ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>
                        {voiceLang === 'km' ? 'កំពុងផ្ទុកសំឡេង...' : 'Loading voice...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{voiceLang === 'km' ? 'សំឡេង ខ្មែរ' : 'Voice EN'}</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: 90 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                  transition={SPRING_BOUNCE}
                  onClick={() => {
                    stopAudio(true);
                    onClose();
                  }}
                  aria-label="Close Mini-Video"
                  className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Video Stage */}
            <div className="p-4 sm:p-6 bg-gradient-to-br from-[#0d1729] to-[#080e1a] space-y-4">
              {/* Autoplay recovery banner or API error alert */}
              {autoplayBlocked && voiceEnabled && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
                  <span className="font-khmer">
                    កម្មវិធីរុករកទាមទារការចុចម្តងទៀតដើម្បីចាប់ផ្តើមសំឡេងពន្យល់ · Click to start audio narration
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoplayBlocked(false);
                      void playSceneAudio(sceneIndex, voiceLang);
                    }}
                    className="shrink-0 rounded-md bg-amber-500 px-2.5 py-1 font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
                  >
                    Start Voice
                  </button>
                </div>
              )}

              {rateLimitWaitSec > 0 && voiceEnabled && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-400" />
                    <span className="truncate font-khmer">
                      សំឡេង AI រង់ចាំ {rateLimitWaitSec}s (កម្រិត 3 ដង/នាទី) — នឹងចាក់បន្តដោយស្វ័យប្រវត្តិ
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRateLimitWaitSec(0);
                      activeAudioKeyRef.current = null;
                      void playSceneAudio(sceneIndex, voiceLang);
                    }}
                    className="shrink-0 rounded-md border border-amber-400/50 px-2.5 py-1 font-semibold text-amber-100 hover:bg-amber-500/20 cursor-pointer"
                  >
                    Retry Now
                  </button>
                </div>
              )}

              {ttsError && rateLimitWaitSec === 0 && voiceEnabled && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs text-rose-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span className="truncate font-khmer">
                      មិនអាចផ្ទុកសំឡេងពន្យល់បានទេ ({ttsError})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      activeAudioKeyRef.current = null;
                      void playSceneAudio(sceneIndex, voiceLang);
                    }}
                    className="shrink-0 rounded-md border border-rose-400/50 px-2.5 py-1 font-semibold text-rose-100 hover:bg-rose-500/20 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div className="rounded-xl border border-slate-800 bg-[#070c16] overflow-hidden">
                {/* Scene Title Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 px-4 py-2.5 bg-[#09101d]">
                  <span className="text-xs font-semibold text-sky-300 font-khmer">
                    {language === 'km' ? currentScene.title.km : currentScene.title.en}
                  </span>
                  {language === 'dual' && (
                    <span className="text-[11px] text-amber-300/90 font-khmer">
                      {currentScene.title.km}
                    </span>
                  )}
                </div>

                {/* Real-Time Interactive 3D WebGL Canvas */}
                <div className="h-64 sm:h-72 flex items-center justify-center">
                  <MiniVideo3DStage
                    kind={currentScene.visualKind}
                    slide={slide}
                    scene={currentScene}
                    sceneElapsed={sceneElapsed}
                    sceneDuration={currentSceneDuration}
                    isPlaying={isPlaying}
                    isWaitingForAudio={
                      voiceEnabled &&
                      (ttsStatus === 'loading' || rateLimitWaitSec > 0 || autoplayBlocked)
                    }
                  />
                </div>

                {/* Calm Stationary Bilingual Subtitle Bar (toggleable with CC) */}
                {showCaptions && (
                  <div className="border-t border-slate-800 bg-[#050912] px-4 py-3 min-h-[82px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${currentScene.id}-sub`}
                        initial={shouldReduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-1 text-center"
                      >
                        {(language === 'dual' || language === 'en' || voiceLang === 'en') && (
                          <p
                            className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                              voiceEnabled && voiceLang === 'en'
                                ? 'text-white font-medium'
                                : 'text-slate-300'
                            }`}
                          >
                            {currentScene.subtitle.en}
                          </p>
                        )}
                        {(language === 'dual' || language === 'km' || voiceLang === 'km') && (
                          <p
                            className={`text-xs sm:text-sm font-khmer leading-relaxed transition-colors ${
                              voiceEnabled && voiceLang === 'km'
                                ? 'text-amber-300 font-medium'
                                : 'text-amber-300/80'
                            }`}
                          >
                            {currentScene.subtitle.km}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Interactive Timeline Scrubber + Scene Segments */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-300 tabular-nums w-9">
                    {formatSec(currentTotalTime)}
                  </span>
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="range"
                      min={0}
                      max={totalDuration}
                      step={0.1}
                      value={currentTotalTime}
                      aria-label="Video timeline scrubber"
                      onChange={(e) => seekToTime(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                    />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums w-9 text-right">
                    {formatSec(totalDuration)}
                  </span>
                </div>

                {/* Scene Quick Jump Bars */}
                <div className="flex gap-1.5">
                  {scenes.map((sc, idx) => {
                    const segDur = effectiveDurations[idx] ?? sc.durationSec;
                    const scenePct =
                      idx < sceneIndex
                        ? 100
                        : idx === sceneIndex
                        ? Math.min(100, (sceneElapsed / Math.max(0.5, segDur)) * 100)
                        : 0;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => jumpToScene(idx)}
                        title={language === 'km' ? sc.title.km : sc.title.en}
                        className="group flex-1 text-left cursor-pointer"
                      >
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-100"
                            style={{ width: `${scenePct}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Transport Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                      transition={SPRING_BOUNCE}
                      onClick={() => jumpToScene(sceneIndex - 1)}
                      disabled={sceneIndex === 0}
                      className="rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                      aria-label="Previous scene"
                    >
                      <SkipBack className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                      transition={SPRING_BOUNCE}
                      onClick={handleTogglePlay}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" /> Play
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                      transition={SPRING_BOUNCE}
                      onClick={() => jumpToScene(sceneIndex + 1)}
                      disabled={sceneIndex === scenes.length - 1}
                      className="rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-slate-200 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                      aria-label="Next scene"
                    >
                      <SkipForward className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Speed selector */}
                    <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-0.5">
                      {SPEED_OPTIONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setPlaybackRate(r)}
                          className={`rounded-md px-2 py-1 font-mono text-[11px] font-semibold cursor-pointer transition-colors ${
                            playbackRate === r
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {r}×
                        </button>
                      ))}
                    </div>

                    <motion.button
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                      transition={SPRING_BOUNCE}
                      onClick={() => {
                        pendingSeekRef.current = null;
                        stopAudio(true);
                        setSceneIndex(0);
                        setSceneElapsed(0);
                        setIsPlaying(true);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Replay
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
