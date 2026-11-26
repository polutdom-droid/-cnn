import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Pause, Play, RotateCcw, Sliders, Sparkles } from 'lucide-react';
import { LanguageMode } from '../../types/slide';
import { MathFormula } from '../MathFormula';

const BEAGLE_IMG = '/src/assets/images/beagle_vision_sample_1795658876169.jpg';
const ANIMALS_IMG = '/src/assets/images/multi_animal_detection_scene_1795658876499.jpg';
const STYLE_IMG = '/src/assets/images/style_transfer_art_study_1795658876629.jpg';

export const CoverVisual: React.FC<{
  language: LanguageMode;
  onJumpSlide: (id: number) => void;
}> = ({ language, onJumpSlide }) => {
  const shouldReduceMotion = useReducedMotion();
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const t = setInterval(() => {
      setScanStep((prev) => (prev + 1) % 9);
    }, 550);
    return () => clearInterval(t);
  }, [shouldReduceMotion]);

  const winR = Math.floor(scanStep / 3);
  const winC = scanStep % 3;

  const modules = [
    { id: 2, label: 'Vision & Edge Detection', kh: 'គែមរូបភាព', range: 'Slides 2–7' },
    { id: 8, label: 'CNN Intuition', kh: 'គោលគំនិតគ្រឹះ', range: 'Slides 8–15' },
    { id: 16, label: 'Conv Layers & Math', kh: 'ស្រទាប់ Conv', range: 'Slides 16–24' },
    { id: 25, label: 'Pooling & FC', kh: 'Pooling & FC', range: 'Slides 25–27' },
    { id: 28, label: 'Case Studies & Lab', kh: 'ករណីសិក្សា', range: 'Slides 28–33' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Neural Networks and Deep Learning · Lecture 03
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#c2553a] leading-tight">
              3. CONVOLUTIONAL NEURAL NETWORKS (CNN)
            </h2>
            {(language === 'dual' || language === 'km') && (
              <p className="mt-2 text-lg font-semibold text-slate-700 font-khmer">
                ៣. បណ្តាញសរសៃប្រសាទ Convolutional (CNN)
              </p>
            )}
          </div>

          {/* Live animated 3x3 sliding kernel mini-preview */}
          <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex items-center gap-3 self-start">
            <div className="relative grid grid-cols-5 gap-0.5 border border-slate-300 p-0.5 bg-slate-100">
              {Array.from({ length: 25 }).map((_, idx) => {
                const r = Math.floor(idx / 5);
                const c = idx % 5;
                const active = r >= winR && r < winR + 3 && c >= winC && c < winC + 3;
                return (
                  <div
                    key={idx}
                    className={`h-4 w-4 rounded-[2px] transition-colors duration-200 ${
                      active ? 'bg-[#c2553a]' : 'bg-slate-300/70'
                    }`}
                  />
                );
              })}
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <div className="grid grid-cols-3 gap-0.5 border border-slate-300 p-0.5 bg-slate-100">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-4 w-4 rounded-[2px] transition-all duration-200 ${
                    idx === scanStep
                      ? 'bg-emerald-600 scale-110'
                      : idx < scanStep
                      ? 'bg-emerald-200'
                      : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 h-[2px] w-full bg-[#c2553a]/80" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <span className="font-medium">Prepared by Dr. Valy Dona</span>
          <span className="font-mono text-xs text-slate-500">33 Interactive Slides · EN / ខ្មែរ</span>
        </div>
      </motion.div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
          {language === 'km' ? 'ចូលទៅកាន់ផ្នែកសំខាន់ៗដោយផ្ទាល់' : 'Jump to Lecture Module'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {modules.map((m, idx) => (
            <motion.button
              key={m.id}
              type="button"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 440, damping: 16, delay: idx * 0.04 }}
              whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={() => onJumpSlide(m.id)}
              className="group rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-[#c2553a] hover:bg-orange-50/40 hover:shadow-md transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-mono text-slate-400 group-hover:text-[#c2553a]">
                {m.range}
              </span>
              <p className="mt-1 text-xs font-bold text-slate-800">{m.label}</p>
              {(language === 'dual' || language === 'km') && (
                <p className="mt-0.5 text-[11px] text-slate-500 font-khmer">{m.kh}</p>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CvProblemsVisual: React.FC<{
  language: LanguageMode;
  replaySignal?: number;
}> = ({ language, replaySignal = 0 }) => {
  const [task, setTask] = useState<'classification' | 'localization' | 'detection' | 'segmentation'>('detection');
  const [styleMix, setStyleMix] = useState(60);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setTask('detection');
  }, [replaySignal]);

  return (
    <div className="space-y-5">
      {/* Task Selector */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-700">
            1. Object Detection & Classification Spectrum
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'classification', label: 'Classification' },
                { id: 'localization', label: '+ Localization' },
                { id: 'detection', label: 'Object Detection' },
                { id: 'segmentation', label: 'Instance Segmentation' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTask(t.id)}
                className={`pop-interactive rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  task === t.id
                    ? 'bg-[#c2553a] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 relative overflow-hidden rounded-xl border border-slate-300 bg-white aspect-[4/3]">
            <img
              src={task === 'classification' || task === 'localization' ? BEAGLE_IMG : ANIMALS_IMG}
              alt="Computer Vision Task Sample"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            {/* Animated Scanner Beam */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-sky-400/25 via-sky-400/10 to-transparent animate-scan-sweep" />

            <AnimatePresence mode="wait">
              {task === 'localization' && (
                <motion.div
                  key="loc"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-[16%] inset-x-[30%] border-[3px] border-red-600 rounded-sm pointer-events-none"
                >
                  <span className="absolute -top-6 left-0 bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    DOG (0.98)
                  </span>
                </motion.div>
              )}
              {task === 'detection' && (
                <motion.div
                  key="det"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.04, duration: 0.24 }}
                    className="absolute top-[25%] left-[5%] w-[33%] h-[50%] border-[3px] border-red-600"
                  >
                    <span className="absolute -top-5 left-0 bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      CAT
                    </span>
                  </motion.div>
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.14, duration: 0.24 }}
                    className="absolute top-[48%] left-[41%] w-[20%] h-[39%] border-[3px] border-emerald-600"
                  >
                    <span className="absolute -top-5 left-0 bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      DUCK
                    </span>
                  </motion.div>
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.24, duration: 0.24 }}
                    className="absolute top-[15%] left-[64%] w-[31%] h-[61%] border-[3px] border-sky-600"
                  >
                    <span className="absolute -top-5 left-0 bg-sky-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      DOG
                    </span>
                  </motion.div>
                </motion.div>
              )}
              {task === 'segmentation' && (
                <motion.svg
                  key="seg"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  viewBox="0 0 400 300"
                  className="absolute inset-0 h-full w-full pointer-events-none"
                >
                  <motion.polygon
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05, duration: 0.25 }}
                    points="32,215 45,140 90,90 120,82 145,115 135,218 70,225"
                    fill="rgba(220,38,38,0.32)"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />
                  <motion.polygon
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.14, duration: 0.25 }}
                    points="170,248 175,180 205,152 232,165 230,248"
                    fill="rgba(16,185,129,0.35)"
                    stroke="#059669"
                    strokeWidth="3"
                  />
                  <motion.polygon
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.23, duration: 0.25 }}
                    points="262,215 268,95 305,52 348,68 375,190 355,222 280,225"
                    fill="rgba(14,165,233,0.32)"
                    stroke="#0284c7"
                    strokeWidth="3"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-5 space-y-2.5 text-xs text-slate-700">
            <motion.div
              key={task}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <p className="font-bold text-slate-900">
                {task === 'classification' && 'Output: Single Class Label ("DOG")'}
                {task === 'localization' && 'Output: Class Label + Bounding Box (x, y, w, h)'}
                {task === 'detection' && 'Output: Multiple Labels + Boxes (CAT, DUCK, DOG)'}
                {task === 'segmentation' && 'Output: Exact Pixel-Level Instance Masks'}
              </p>
              <p className="mt-1.5 text-slate-600 font-khmer">
                {language === 'en'
                  ? 'Click the 4 vision task buttons above to inspect how CNN outputs evolve from single labels to pixel masks.'
                  : 'ចុចលើប៊ូតុងទាំង ៤ ខាងលើដើម្បីមើលភាពខុសគ្នាពី Classification រហូតដល់ Instance Segmentation។'}
              </p>
            </motion.div>
            <div className="rounded-lg border border-slate-200 bg-white p-3 font-mono text-[11px] text-slate-600">
              {task === 'classification' && 'Pred: { "DOG": 0.99 }'}
              {task === 'localization' && 'Pred: { label: "DOG", bbox: [30, 16, 40, 68] }'}
              {task === 'detection' && 'Pred: [ CAT(0.95), DUCK(0.92), DOG(0.97) ]'}
              {task === 'segmentation' && 'Pred: 3 Polygon Pixel Masks (H × W)'}
            </div>
          </div>
        </div>
      </div>

      {/* Style Transfer Blend */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-[#c2553a]" />
            2. Image Synthesis (Neural Style Transfer)
          </span>
          <label className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span>Style Weight β: {styleMix}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={styleMix}
              onChange={(e) => setStyleMix(Number(e.target.value))}
              className="w-28 accent-[#c2553a]"
            />
          </label>
        </div>
        <div className="grid grid-cols-5 gap-2 items-center text-center">
          <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
            <img src={BEAGLE_IMG} alt="Content" referrerPolicy="no-referrer" className="h-20 w-full object-cover" />
            <span className="block py-1 text-[10px] font-semibold text-slate-600">Content (C)</span>
          </div>
          <span className="text-lg font-bold text-sky-600">+</span>
          <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
            <img src={STYLE_IMG} alt="Style" referrerPolicy="no-referrer" className="h-20 w-full object-cover" />
            <span className="block py-1 text-[10px] font-semibold text-slate-600">Style (S)</span>
          </div>
          <span className="text-lg font-bold text-sky-600">=</span>
          <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-white">
            <img src={BEAGLE_IMG} alt="Synthesized Base" referrerPolicy="no-referrer" className="h-20 w-full object-cover" />
            <img
              src={STYLE_IMG}
              alt="Synthesized Style Overlay"
              referrerPolicy="no-referrer"
              style={{ opacity: styleMix / 100 }}
              className="absolute inset-0 h-20 w-full object-cover mix-blend-hard-light transition-opacity"
            />
            <span className="relative block bg-white/95 py-1 text-[10px] font-semibold text-[#c2553a]">
              Result ({styleMix}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LargeImagesVisual: React.FC<{ language: LanguageMode }> = ({ language }) => {
  const [size, setSize] = useState<28 | 100 | 1000>(1000);
  const [hidden, setHidden] = useState<128 | 1000>(1000);
  const shouldReduceMotion = useReducedMotion();

  const inputs = size * size;
  const weights = inputs * hidden;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sliders className="h-3.5 w-3.5 text-[#c2553a]" />
          <span>Resolution:</span>
          {([28, 100, 1000] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`pop-interactive rounded-md px-2.5 py-1 text-xs font-mono cursor-pointer transition-colors ${
                size === s ? 'bg-[#c2553a] text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span>Hidden Nodes:</span>
          {([128, 1000] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHidden(h)}
              className={`pop-interactive rounded-md px-2.5 py-1 text-xs font-mono cursor-pointer transition-colors ${
                hidden === h ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-4 flex flex-col items-center">
          <motion.div
            key={size}
            initial={shouldReduceMotion ? false : { scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22 }}
            className="w-48 h-48 rounded-lg border-2 border-slate-700 overflow-hidden bg-white shadow-sm"
          >
            <img src={BEAGLE_IMG} alt="1000x1000 Dog Input" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          </motion.div>
          <p className="mt-2 font-mono text-sm font-bold text-slate-800 tabular-nums">
            {size} × {size}
          </p>
          <p className="font-mono text-xs text-slate-600 tabular-nums">
            n = {inputs.toLocaleString()}
          </p>
        </div>

        <div className="md:col-span-8 space-y-3">
          <svg viewBox="0 0 420 190" className="w-full h-44 rounded-xl border border-slate-200 bg-white p-2">
            {/* Dense Connections with animated signal flow */}
            {[40, 95, 155].map((y1) =>
              [40, 95, 155].map((y2) => (
                <line
                  key={`${y1}-${y2}`}
                  x1="68"
                  y1={y1}
                  x2="152"
                  y2={y2}
                  stroke="#0284c7"
                  strokeOpacity="0.65"
                  strokeWidth="1.4"
                  className="animate-flow-dash"
                />
              ))
            )}
            {[40, 95, 155].map((y1) =>
              [60, 135].map((y2) => (
                <line
                  key={`h-${y1}-${y2}`}
                  x1="188"
                  y1={y1}
                  x2="252"
                  y2={y2}
                  stroke="#64748b"
                  strokeOpacity="0.7"
                  strokeWidth="1.4"
                  className="animate-flow-dash"
                />
              ))
            )}

            {/* Input nodes */}
            <circle cx="50" cy="40" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />
            <text x="50" y="44" textAnchor="middle" fontSize="12" fontStyle="italic">x₁</text>
            <circle cx="50" cy="95" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />
            <text x="50" y="99" textAnchor="middle" fontSize="12" fontStyle="italic">x₂</text>
            <text x="50" y="130" textAnchor="middle" fontSize="16" fontWeight="bold">⋮</text>
            <circle cx="50" cy="155" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />
            <text x="50" y="159" textAnchor="middle" fontSize="12" fontStyle="italic">xₙ</text>

            {/* Hidden Layer 1 */}
            <circle cx="170" cy="40" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="170" cy="95" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />
            <text x="170" y="130" textAnchor="middle" fontSize="16" fontWeight="bold">⋮</text>
            <circle cx="170" cy="155" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />

            {/* Hidden Layer 2 */}
            <circle cx="270" cy="60" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />
            <text x="270" y="102" textAnchor="middle" fontSize="16" fontWeight="bold">⋮</text>
            <circle cx="270" cy="135" r="18" fill="#fff" stroke="#1e293b" strokeWidth="2" />

            {/* Output Dog? */}
            <line x1="288" y1="60" x2="332" y2="95" stroke="#dc2626" strokeWidth="1.8" className="animate-flow-dash" />
            <line x1="288" y1="135" x2="332" y2="95" stroke="#dc2626" strokeWidth="1.8" className="animate-flow-dash" />
            <circle cx="350" cy="95" r="18" fill="#fff" stroke="#dc2626" strokeWidth="2.5" />
            <text x="380" y="99" fontSize="14" fontWeight="bold" fill="#0f172a">Dog?</text>
          </svg>

          <motion.div
            key={weights}
            initial={shouldReduceMotion ? false : { scale: 0.97, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2"
          >
            <div>
              <span className="text-xs font-bold text-red-800">
                {language === 'km' ? 'ចំនួន Weights ស្រទាប់ទី១៖' : 'Layer 1 Weight Count:'}
              </span>
              <p className="text-[11px] text-red-700 font-mono">
                {inputs.toLocaleString()} inputs × {hidden.toLocaleString()} neurons
              </p>
            </div>
            <span className="font-mono text-lg font-bold text-red-700 tabular-nums">
              {weights.toLocaleString()} weights
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const ImageRecognitionVisual: React.FC<{ language: LanguageMode }> = ({ language }) => {
  const [pose, setPose] = useState<'standard' | 'flipped' | 'zoomed' | 'dark'>('standard');
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-5">
      {/* Top: Simple Geometric Model */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold text-slate-700 mb-3">
          Simple Model: Basic Shapes & Features of the Object
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <img
            src={BEAGLE_IMG}
            alt="Beagle Input"
            referrerPolicy="no-referrer"
            className="h-24 w-24 rounded-lg border border-slate-300 object-cover bg-white"
          />
          <motion.div
            animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ArrowRight className="h-5 w-5 text-[#c2553a]" />
          </motion.div>
          <svg viewBox="0 0 140 90" className="h-24 w-36 rounded-lg border border-slate-400 bg-white">
            {/* Simple dog geometric diagram with animated draw-in */}
            <motion.ellipse
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
              cx="75" cy="52" rx="34" ry="18" fill="none" stroke="#475569" strokeWidth="2.2"
            />
            <motion.circle
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              cx="38" cy="32" r="14" fill="#fff" stroke="#475569" strokeWidth="2.2"
            />
            <ellipse cx="26" cy="36" rx="5" ry="11" fill="#fff" stroke="#475569" strokeWidth="2" />
            <ellipse cx="48" cy="35" rx="5" ry="11" fill="#fff" stroke="#475569" strokeWidth="2" />
            <rect x="46" y="64" width="8" height="18" fill="#fff" stroke="#475569" strokeWidth="2" />
            <rect x="58" y="64" width="8" height="16" fill="#fff" stroke="#475569" strokeWidth="2" />
            <rect x="88" y="64" width="8" height="16" fill="#fff" stroke="#475569" strokeWidth="2" />
            <rect x="99" y="64" width="8" height="18" fill="#fff" stroke="#475569" strokeWidth="2" />
            <path d="M 105 42 Q 118 22 122 18 Q 112 36 108 46" fill="#fff" stroke="#475569" strokeWidth="2" />
          </svg>
          <motion.div
            animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: 0.4, ease: 'easeInOut' }}
          >
            <ArrowRight className="h-5 w-5 text-[#c2553a]" />
          </motion.div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">DOG</span>
        </div>
      </div>

      {/* Bottom: Interactive Variation Difficulty */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-800 font-khmer">
            {language === 'km'
              ? 'ការលំបាក៖ ការស្គាល់វត្ថុដែលមានបម្រែបម្រួលច្រើន'
              : 'Difficulty: Large Variation of Objects (Test Transformations)'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'standard', label: 'Front View' },
                { id: 'flipped', label: 'Mirrored Pose' },
                { id: 'zoomed', label: 'Close-Up Crop' },
                { id: 'dark', label: 'Low Lighting' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPose(p.id)}
                className={`pop-interactive rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  pose === p.id
                    ? 'bg-[#c2553a] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="h-40 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
            <img
              src={BEAGLE_IMG}
              alt="Dog variation"
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover transition-all duration-300 ${
                pose === 'flipped'
                  ? '-scale-x-100 rotate-6'
                  : pose === 'zoomed'
                  ? 'scale-150 translate-y-4'
                  : pose === 'dark'
                  ? 'brightness-50 contrast-125'
                  : ''
              }`}
            />
          </div>
          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">
              Raw pixel values change drastically under {pose} transform!
            </p>
            <p className="font-khmer">
              {language === 'en'
                ? 'A rigid pixel template breaks immediately when an animal turns, scales, or moves into shadow. CNNs overcome this using translation-equivariant local filters.'
                : 'តម្លៃភីកសែលប្រែប្រួលខ្លាំងពេលប្តូរទិសដៅ ឬពន្លឺ។ CNN ដោះស្រាយបញ្ហានេះដោយប្រើ Filter ចាប់គែម និងរាងតូចៗនៅគ្រប់ទីតាំង។'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TEXTURE_INPUT = [
  [3, 0, 2, 5, 6, 8],
  [1, 5, 8, 7, 0, 5],
  [2, 3, 9, 1, 0, 7],
  [9, 1, 1, 0, 5, 7],
  [1, 0, 1, 3, 8, 9],
  [2, 3, 8, 9, 2, 1],
];

const STEP_INPUT = [
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
];

const KERNEL_PRESETS = {
  vertical: {
    name: 'Vertical Edge',
    matrix: [
      [1, 0, -1],
      [1, 0, -1],
      [1, 0, -1],
    ],
  },
  sobel: {
    name: 'Sobel Filter',
    matrix: [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1],
    ],
  },
  scharr: {
    name: 'Scharr Filter',
    matrix: [
      [3, 0, -3],
      [10, 0, -10],
      [3, 0, -3],
    ],
  },
  horizontal: {
    name: 'Horizontal Edge',
    matrix: [
      [1, 1, 1],
      [0, 0, 0],
      [-1, -1, -1],
    ],
  },
};

export const ConvolutionSandboxVisual: React.FC<{
  mode: 'texture' | 'step' | 'filters';
  replaySignal: number;
}> = ({ mode, replaySignal }) => {
  const shouldReduceMotion = useReducedMotion();
  const [inputGrid, setInputGrid] = useState<number[][]>(
    mode === 'step' ? STEP_INPUT : TEXTURE_INPUT
  );
  const [kernel, setKernel] = useState<number[][]>(
    mode === 'filters' ? KERNEL_PRESETS.sobel.matrix : KERNEL_PRESETS.vertical.matrix
  );
  const [presetKey, setPresetKey] = useState<keyof typeof KERNEL_PRESETS>(
    mode === 'filters' ? 'sobel' : 'vertical'
  );
  const [activePos, setActivePos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [scanning, setScanning] = useState(!shouldReduceMotion);

  useEffect(() => {
    setInputGrid(mode === 'step' ? STEP_INPUT : TEXTURE_INPUT);
    const defaultKey = mode === 'filters' ? 'sobel' : 'vertical';
    setPresetKey(defaultKey);
    setKernel(KERNEL_PRESETS[defaultKey].matrix.map((r) => [...r]));
    setActivePos({ r: 0, c: 0 });
    setScanning(!shouldReduceMotion);
  }, [mode, replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!scanning) return;
    const timer = setInterval(() => {
      setActivePos((prev) => {
        const nextIdx = (prev.r * 4 + prev.c + 1) % 16;
        return { r: Math.floor(nextIdx / 4), c: nextIdx % 4 };
      });
    }, 450);
    return () => clearInterval(timer);
  }, [scanning]);

  const computeCell = (r: number, c: number) => {
    let sum = 0;
    for (let u = 0; u < 3; u++) {
      for (let v = 0; v < 3; v++) {
        sum += inputGrid[r + u][c + v] * kernel[u][v];
      }
    }
    return sum;
  };

  const outputGrid = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => computeCell(r, c))
  );

  const terms: string[] = [];
  for (let u = 0; u < 3; u++) {
    for (let v = 0; v < 3; v++) {
      terms.push(`${inputGrid[activePos.r + u][activePos.c + v]}×(${kernel[u][v]})`);
    }
  }
  const activeSum = computeCell(activePos.r, activePos.c);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 mr-1">Filter:</span>
          {(Object.keys(KERNEL_PRESETS) as (keyof typeof KERNEL_PRESETS)[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setPresetKey(k);
                setKernel(KERNEL_PRESETS[k].matrix.map((row) => [...row]));
              }}
              className={`pop-interactive rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                presetKey === k
                  ? 'bg-[#c2553a] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {KERNEL_PRESETS[k].name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputGrid(inputGrid === STEP_INPUT ? TEXTURE_INPUT : STEP_INPUT)}
            className="pop-interactive rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {inputGrid === STEP_INPUT ? 'Use Texture 6×6' : 'Use Step 10|0'}
          </button>
          <button
            type="button"
            onClick={() => setScanning((s) => !s)}
            className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
          >
            {scanning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {scanning ? 'Pause' : 'Auto-Scan'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActivePos({ r: 0, c: 0 });
              setScanning(true);
            }}
            aria-label="Reset scan"
            className="pop-interactive rounded-md border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grids: 6x6 * 3x3 = 4x4 */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
        {/* 6x6 Input with animated sliding border */}
        <div className="text-center">
          <div className="relative inline-grid grid-cols-6 border-2 border-slate-700 bg-white">
            {inputGrid.map((row, r) =>
              row.map((val, c) => {
                const inWindow =
                  r >= activePos.r &&
                  r < activePos.r + 3 &&
                  c >= activePos.c &&
                  c < activePos.c + 3;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`pop-interactive w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-slate-300 font-mono text-xs font-semibold tabular-nums transition-colors duration-200 ${
                      inWindow
                        ? 'bg-orange-100 text-[#c2553a]'
                        : val === 10
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-700'
                    }`}
                  >
                    {val}
                  </div>
                );
              })
            )}
            {/* Smooth animated sliding 3x3 window frame */}
            <motion.div
              animate={{
                x: `${(activePos.c / 3) * 100}%`,
                y: `${(activePos.r / 3) * 100}%`,
              }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '50%', height: '50%' }}
              className="pointer-events-none absolute top-0 left-0 border-[2.5px] border-[#c2553a] ring-1 ring-[#c2553a]/30"
            />
          </div>
          <p className="mt-1.5 text-xs font-semibold text-slate-600">6 × 6 Input</p>
        </div>

        <span className="text-2xl font-bold text-slate-700">∗</span>

        {/* 3x3 Editable Filter */}
        <div className="text-center">
          <div className="inline-grid grid-cols-3 border-2 border-slate-700 bg-white">
            {kernel.map((row, u) =>
              row.map((w, v) => (
                <input
                  key={`${u}-${v}`}
                  type="number"
                  value={w}
                  onChange={(e) => {
                    const next = kernel.map((kr) => [...kr]);
                    next[u][v] = Number(e.target.value) || 0;
                    setKernel(next);
                  }}
                  aria-label={`Kernel weight row ${u + 1} col ${v + 1}`}
                  className="w-9 h-9 text-center border border-slate-300 font-mono text-xs font-bold text-slate-800 focus:bg-sky-50 focus:outline-none tabular-nums"
                />
              ))
            )}
          </div>
          <p className="mt-1.5 text-xs font-semibold text-slate-600">
            {mode === 'filters' ? '3 × 3 (Editable w₁..w₉)' : '3 × 3 Filter'}
          </p>
        </div>

        <span className="text-2xl font-bold text-slate-700">=</span>

        {/* 4x4 Output */}
        <div className="text-center">
          <div className="inline-grid grid-cols-4 border-2 border-slate-700 bg-white">
            {outputGrid.map((row, r) =>
              row.map((val, c) => {
                const isSelected = activePos.r === r && activePos.c === c;
                return (
                  <motion.button
                    key={`${r}-${c}`}
                    type="button"
                    animate={
                      isSelected && !shouldReduceMotion
                        ? { scale: 1.08 }
                        : { scale: 1 }
                    }
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.16, y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 480, damping: 16 }}
                    onClick={() => {
                      setScanning(false);
                      setActivePos({ r, c });
                    }}
                    className={`w-9 h-9 flex items-center justify-center border border-slate-300 font-mono text-xs font-bold tabular-nums cursor-pointer transition-colors hover:z-20 ${
                      isSelected
                        ? 'bg-[#c2553a] text-white z-10 shadow-sm'
                        : Math.abs(val) >= 20
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {val}
                  </motion.button>
                );
              })
            )}
          </div>
          <p className="mt-1.5 text-xs font-semibold text-slate-600">
            4 × 4 Output (Click any cell)
          </p>
        </div>
      </div>

      {/* Live Dot Product Breakdown */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 overflow-x-auto">
        <MathFormula
          latex={String.raw`\text{Out}[${activePos.r}, ${activePos.c}] = ${terms
            .map((t) => t.replace('×', String.raw`\cdot `))
            .join(' + ')} = \mathbf{${activeSum}}`}
          displayMode
          className="text-xs sm:text-sm"
        />
      </div>
    </div>
  );
};
