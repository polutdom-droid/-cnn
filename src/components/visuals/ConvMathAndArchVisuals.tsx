import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, ExternalLink, Pause, Play, RotateCcw } from 'lucide-react';
import { LanguageMode } from '../../types/slide';
import { MathFormula } from '../MathFormula';

/* ============================================================================
   SLIDES 16–19: 3D Volume, 75-D Dot Product, Stacked Maps & Conv+ReLU Sequence
   ============================================================================ */
export const Conv3DVolumeVisual: React.FC<{
  mode: 'volume' | 'dot-product' | 'stacked' | 'sequence';
  replaySignal?: number;
}> = ({ mode, replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [numFilters, setNumFilters] = useState<number>(6);
  const [filterSize, setFilterSize] = useState<number>(5);
  const [scanStep, setScanStep] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(!shouldReduceMotion);

  useEffect(() => {
    setScanStep(0);
    setPlaying(!shouldReduceMotion);
  }, [mode, replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setScanStep((s) => (s + 1) % 9);
    }, 650);
    return () => clearInterval(t);
  }, [playing]);

  const outSpatial = 32 - filterSize + 1;
  const dotDim = filterSize * filterSize * 3;
  const totalParams = numFilters * (dotDim + 1);

  const patchRow = Math.floor(scanStep / 3);
  const patchCol = scanStep % 3;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
          <span>Filter Size (F):</span>
          {[3, 5, 7].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterSize(f)}
              className={`pop-interactive rounded-md px-2.5 py-1 font-mono text-xs cursor-pointer transition-colors ${
                filterSize === f
                  ? 'bg-[#c2553a] text-white'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {f}×{f}×3
            </button>
          ))}
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={15}
            aria-label="Custom Filter Size F"
            value={filterSize}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (!Number.isNaN(parsed)) {
                setFilterSize(Math.min(15, Math.max(1, parsed)));
              }
            }}
            className="w-14 rounded-md border border-slate-300 bg-white px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:border-[#c2553a] focus:outline-none focus:ring-2 focus:ring-[#c2553a]/25"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(mode === 'stacked' || mode === 'sequence') && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-700 mr-2">
              <span>Filters (K):</span>
              {[1, 6, 10, 16].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setNumFilters(k)}
                  className={`pop-interactive rounded-md px-2 py-1 font-mono text-xs cursor-pointer transition-colors ${
                    numFilters === k
                      ? 'bg-sky-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {k}
                </button>
              ))}
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={128}
                aria-label="Custom Filters Count K"
                value={numFilters}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  if (!Number.isNaN(parsed)) {
                    setNumFilters(Math.min(128, Math.max(1, parsed)));
                  }
                }}
                className="w-14 rounded-md border border-slate-300 bg-white px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/25"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {playing ? 'Pause' : 'Animate Scan'}
          </button>
        </div>
      </div>

      {/* Isometric 3D Volume Visual */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Input 32x32x3 with animated sliding receptive field */}
          <div className="text-center">
            <div className="relative mx-auto w-24 h-36 border-2 border-slate-600 bg-gradient-to-br from-sky-50 via-emerald-50 to-rose-50 shadow-sm overflow-visible">
              <motion.div
                animate={{
                  x: 10 + patchCol * 22,
                  y: 14 + patchRow * 32,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 h-8 border-2 border-[#c2553a] bg-[#c2553a]/25 shadow-sm"
              />
              <span className="absolute -right-3 top-2 bottom-2 w-3 border-y-2 border-r-2 border-slate-500 bg-slate-200/70 skew-y-[-25deg]" />
            </div>
            <p className="mt-2 font-mono text-xs font-bold text-slate-800">32 × 32 × 3</p>
            <p className="text-[11px] text-slate-500">H:32 · W:32 · Depth:3</p>
          </div>

          <div className="text-center space-y-1">
            <motion.div
              animate={shouldReduceMotion ? undefined : { x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            >
              <ArrowRight className="h-6 w-6 text-[#c2553a] mx-auto" />
            </motion.div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[11px] text-slate-700">
              {mode === 'sequence'
                ? `CONV+ReLU (${numFilters}×${filterSize}×${filterSize}×3)`
                : `${filterSize}×${filterSize}×3 filter`}
            </div>
          </div>

          {/* Output Activation Map(s) with pulsing active output pixel */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {Array.from({
                length: mode === 'volume' || mode === 'dot-product' ? 1 : Math.min(numFilters, 6),
              }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.22 }}
                  className="relative w-16 h-32 border-2 border-slate-600 bg-gradient-to-b from-slate-50 to-slate-100 shadow-sm -ml-3 first:ml-0"
                >
                  {idx === 0 && (
                    <motion.div
                      animate={{
                        x: 8 + patchCol * 16,
                        y: 14 + patchRow * 28,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="h-3.5 w-3.5 rounded-[2px] bg-[#c2553a]"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <p className="mt-2 font-mono text-xs font-bold text-[#c2553a] tabular-nums">
              {outSpatial} × {outSpatial} × {mode === 'volume' || mode === 'dot-product' ? 1 : numFilters}
            </p>
            <p className="text-[11px] text-slate-500">
              {mode === 'dot-product'
                ? `${filterSize}×${filterSize}×3 = ${dotDim}-D dot product + bias`
                : `Total Params: ${totalParams.toLocaleString()}`}
            </p>
          </div>

          {mode === 'sequence' && (
            <>
              <div className="text-center space-y-1">
                <motion.div
                  animate={shouldReduceMotion ? undefined : { x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: 0.35, ease: 'easeInOut' }}
                >
                  <ArrowRight className="h-6 w-6 text-indigo-600 mx-auto" />
                </motion.div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[11px] text-slate-700">
                  CONV+ReLU (10×5×5×{numFilters})
                </div>
              </div>
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="w-20 h-28 mx-auto border-2 border-indigo-600 bg-indigo-50 flex items-center justify-center font-mono text-xs font-bold text-indigo-800">
                  {outSpatial - 4}×{outSpatial - 4}×10
                </div>
                <p className="mt-2 font-mono text-xs font-bold text-indigo-700">
                  Layer 2 Volume
                </p>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDES 20–21: Hierarchical Learning & Face Recognition Layers
   ============================================================================ */
export const HierarchicalLearnVisual: React.FC<{
  mode: 'pyramid' | 'face';
  language: LanguageMode;
  replaySignal?: number;
}> = ({ mode, language, replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedLayer, setSelectedLayer] = useState<1 | 2 | 3>(1);
  const [autoStep, setAutoStep] = useState<boolean>(!shouldReduceMotion);

  useEffect(() => {
    setSelectedLayer(1);
    setAutoStep(!shouldReduceMotion);
  }, [mode, replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (mode !== 'face' || !autoStep) return;
    const t = setInterval(() => {
      setSelectedLayer((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)));
    }, 1500);
    return () => clearInterval(t);
  }, [mode, autoStep]);

  if (mode === 'pyramid') {
    const filters = [
      { name: 'Filter 1', color: '#475569', role: 'Vertical Edges' },
      { name: 'Filter 2', color: '#1e3a8a', role: 'Horizontal Edges' },
      { name: 'Filter 3', color: '#ea580c', role: 'Diagonal Curves' },
      { name: 'Filter 4', color: '#15803d', role: 'Color Contrast' },
    ];
    return (
      <div className="rounded-xl border border-slate-200 bg-sky-700/95 p-5 text-white space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-sky-100">
          <span>Parallel Filter Cones Scanning Spatial Patches</span>
          <span className="font-mono">DeepLearning.TV (2015)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filters.map((f, idx) => (
            <motion.div
              key={f.name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 420, damping: 16, delay: idx * 0.06 }}
              className="rounded-xl bg-white/10 border border-white/20 p-3 text-center cursor-pointer"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: idx * 0.25,
                  ease: 'easeInOut',
                }}
                className="mx-auto w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[36px] border-t-white/80 mb-2"
              />
              <span
                className="inline-block rounded-md px-2.5 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: f.color }}
              >
                {f.name}
              </span>
              <p className="mt-1.5 text-[11px] text-sky-100">{f.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const layers = [
    {
      id: 1 as const,
      title: 'Layer 1',
      desc: { en: 'Edges & Corners', km: 'គែម និងជ្រុងនានា' },
      tiles: ['│', '─', '╱', '╲', '┌', '┐', '└', '┘', '┼'],
    },
    {
      id: 2 as const,
      title: 'Layer 2',
      desc: { en: 'Parts of Face: Eye, Nose, Ear', km: 'ផ្នែកផ្ទៃមុខ៖ ភ្នែក ច្រមុះ ត្រចៀក' },
      tiles: ['👁', '👃', '👂', '👄', '◠', '◡', '◉', '◔', '⌒'],
    },
    {
      id: 3 as const,
      title: 'Layer 3',
      desc: { en: 'Whole Face Representation', km: 'ទម្រង់ផ្ទៃមុខពេញលេញ' },
      tiles: ['🙂', '😐', '👨', '👩', '🧑', '🧔', '👵', '👴', '🧒'],
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
        <span className="font-semibold text-slate-700 font-khmer">
          {language === 'km'
            ? 'លំដាប់ការរៀនតាមស្រទាប់៖ Layer 1 → Layer 2 → Layer 3'
            : 'Hierarchical Feature Progression: Layer 1 → Layer 2 → Layer 3'}
        </span>
        <button
          type="button"
          onClick={() => setAutoStep((a) => !a)}
          className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
        >
          {autoStep ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {autoStep ? 'Pause' : 'Play Layers'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {layers.map((layer) => {
          const active = selectedLayer === layer.id;
          return (
            <motion.button
              key={layer.id}
              type="button"
              animate={active && !shouldReduceMotion ? { scale: 1.02 } : { scale: 1 }}
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 17 }}
              onClick={() => {
                setAutoStep(false);
                setSelectedLayer(layer.id);
              }}
              className={`rounded-xl border p-4 text-left transition-colors cursor-pointer hover:shadow-md ${
                active
                  ? 'border-[#c2553a] bg-orange-50/60 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{layer.title}</span>
                <span className="font-mono text-[11px] text-[#c2553a] font-semibold">
                  {active ? 'Active' : 'Inspect'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-900 p-2">
                {layer.tiles.map((t, i) => (
                  <motion.div
                    key={i}
                    animate={
                      active && !shouldReduceMotion
                        ? { opacity: [0.65, 1], scale: [0.92, 1] }
                        : { opacity: 0.9, scale: 1 }
                    }
                    transition={{ delay: active ? i * 0.03 : 0, duration: 0.2 }}
                    className="h-9 flex items-center justify-center rounded bg-slate-700/80 text-white text-sm font-mono"
                  >
                    {t}
                  </motion.div>
                ))}
              </div>
              <p className="mt-2.5 text-xs font-semibold text-slate-800">{layer.desc.en}</p>
              {(language === 'dual' || language === 'km') && (
                <p className="mt-0.5 text-[11px] text-slate-600 font-khmer">{layer.desc.km}</p>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDES 22–23: Spatial Dimensions (Stride) & Zero Padding Simulator
   ============================================================================ */
interface ParamNumberControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  presets: number[];
  activeBtnClass: string;
  focusRingClass: string;
  onChange: (next: number) => void;
}

const ParamNumberControl: React.FC<ParamNumberControlProps> = ({
  label,
  value,
  min,
  max,
  presets,
  activeBtnClass,
  focusRingClass,
  onChange,
}) => {
  const [draft, setDraft] = useState<string>(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    setDraft(String(clamped));
    onChange(clamped);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 flex flex-col justify-between gap-1.5">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-semibold text-slate-700">{label}</span>
        <span className="font-mono text-[10px] text-slate-400">
          {min}–{max}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="pop-interactive h-7 w-6 shrink-0 rounded border border-slate-200 bg-slate-50 font-mono text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          aria-label={label}
          value={draft}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            if (raw.trim() === '') return;
            const parsed = parseInt(raw, 10);
            if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) {
              onChange(parsed);
            }
          }}
          onBlur={() => commitDraft(draft)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitDraft(draft);
              (e.currentTarget as HTMLInputElement).blur();
            }
          }}
          className={`min-w-0 flex-1 h-7 rounded border border-slate-300 bg-slate-50/70 px-1 text-center font-mono text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${focusRingClass}`}
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="pop-interactive h-7 w-6 shrink-0 rounded border border-slate-200 bg-slate-50 font-mono text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <div className="flex gap-1">
        {presets.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`pop-interactive flex-1 rounded py-0.5 font-mono text-[11px] font-semibold cursor-pointer transition-colors ${
              value === v
                ? activeBtnClass
                : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SpatialAndPaddingVisual: React.FC<{
  mode: 'stride' | 'padding';
  replaySignal?: number;
}> = ({ mode, replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [N, setN] = useState(7);
  const [F, setF] = useState(3);
  const [stride, setStride] = useState(mode === 'stride' ? 3 : 1);
  const [padding, setPadding] = useState(mode === 'padding' ? 1 : 0);
  const [stepIdx, setStepIdx] = useState(0);
  const [autoSlide, setAutoSlide] = useState(!shouldReduceMotion);

  const totalN = N + 2 * padding;
  const rawOut = (N + 2 * padding - F) / stride + 1;
  const isFit = F <= totalN;
  const isValid = isFit && Number.isInteger(rawOut) && rawOut > 0;
  const outDim = isValid ? rawOut : Math.max(1, Math.floor(rawOut));
  const useExactGrid = totalN <= 14;
  const useExactOutGrid = isValid && outDim <= 14;
  const sampleAxis = 6;
  const totalSteps = isFit
    ? outDim <= 14
      ? outDim * outDim
      : sampleAxis * sampleAxis
    : 1;
  const samePad = (F - 1) / 2;

  useEffect(() => {
    setStepIdx(0);
    setAutoSlide(!shouldReduceMotion);
  }, [N, F, stride, padding, mode, replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!autoSlide || totalSteps <= 1) return;
    const timer = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % totalSteps);
    }, 520);
    return () => clearInterval(timer);
  }, [autoSlide, totalSteps]);

  const safeStep = stepIdx % totalSteps;
  const outR =
    outDim <= 14
      ? Math.floor(safeStep / outDim)
      : Math.round((Math.floor(safeStep / sampleAxis) / (sampleAxis - 1)) * Math.max(0, outDim - 1));
  const outC =
    outDim <= 14
      ? safeStep % outDim
      : Math.round(((safeStep % sampleAxis) / (sampleAxis - 1)) * Math.max(0, outDim - 1));
  const winR = isFit ? Math.max(0, Math.min(totalN - F, outR * stride)) : 0;
  const winC = isFit ? Math.max(0, Math.min(totalN - F, outC * stride)) : 0;

  const cellSizeClass =
    totalN <= 9
      ? 'w-5 h-5 sm:w-6 sm:h-6 text-[10px]'
      : totalN <= 12
      ? 'w-4 h-4 sm:w-5 sm:h-5 text-[9px]'
      : 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-[8px]';

  const outCellSizeClass =
    outDim <= 9
      ? 'w-5 h-5 sm:w-6 sm:h-6 text-[9px]'
      : outDim <= 12
      ? 'w-4 h-4 sm:w-5 sm:h-5 text-[8px]'
      : 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-[8px]';

  const formattedRawOut = Number.isInteger(rawOut) ? String(rawOut) : rawOut.toFixed(2);
  const padVisualPct = padding > 0 ? Math.min(28, Math.max(8, (padding / totalN) * 100)) : 0;

  return (
    <div className="space-y-4">
      {/* Interactive Editable Controls */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 items-stretch">
        <ParamNumberControl
          label="Input (N)"
          value={N}
          min={1}
          max={512}
          presets={[5, 7, 32]}
          activeBtnClass="bg-slate-800 text-white"
          focusRingClass="focus:border-slate-700 focus:ring-slate-400/30"
          onChange={setN}
        />

        <ParamNumberControl
          label="Filter (F)"
          value={F}
          min={1}
          max={64}
          presets={[3, 5, 7]}
          activeBtnClass="bg-[#c2553a] text-white"
          focusRingClass="focus:border-[#c2553a] focus:ring-[#c2553a]/25"
          onChange={(v) => {
            setF(v);
            if (mode === 'padding' && v % 2 === 1) {
              setPadding((v - 1) / 2);
            }
          }}
        />

        <ParamNumberControl
          label="Stride (S)"
          value={stride}
          min={1}
          max={32}
          presets={[1, 2, 3]}
          activeBtnClass="bg-sky-600 text-white"
          focusRingClass="focus:border-sky-600 focus:ring-sky-600/25"
          onChange={setStride}
        />

        <ParamNumberControl
          label="Zero Pad (P)"
          value={padding}
          min={0}
          max={64}
          presets={[0, 1, 2, 3]}
          activeBtnClass="bg-emerald-600 text-white"
          focusRingClass="focus:border-emerald-600 focus:ring-emerald-600/25"
          onChange={setPadding}
        />

        <div className="col-span-2 lg:col-span-1 flex lg:flex-col justify-between gap-1.5">
          <button
            type="button"
            onClick={() => setAutoSlide((a) => !a)}
            className="pop-interactive flex-1 flex items-center justify-center gap-1 rounded-lg bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            {autoSlide ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {autoSlide ? 'Pause' : 'Slide'}
          </button>
          <div className="flex gap-1.5">
            {Number.isInteger(samePad) && samePad >= 0 && (
              <button
                type="button"
                onClick={() => {
                  setStride(1);
                  setPadding(samePad);
                }}
                title="Apply Same-Size Padding (S=1, P=(F-1)/2)"
                className="pop-interactive flex-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 font-mono text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 cursor-pointer"
              >
                Same P={samePad}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setN(7);
                setF(3);
                setStride(mode === 'stride' ? 3 : 1);
                setPadding(mode === 'padding' ? 1 : 0);
                setStepIdx(0);
                setAutoSlide(!shouldReduceMotion);
              }}
              aria-label="Reset parameters"
              title="Reset to default values"
              className="pop-interactive rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Grid + Output Math */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center rounded-xl border border-slate-200 bg-white p-4">
        <div className="md:col-span-6 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {useExactGrid ? (
              <div
                className="relative inline-grid border-2 border-slate-700"
                style={{ gridTemplateColumns: `repeat(${totalN}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: totalN }).map((_, r) =>
                  Array.from({ length: totalN }).map((__, c) => {
                    const isPad =
                      r < padding ||
                      r >= padding + N ||
                      c < padding ||
                      c >= padding + N;
                    const inFilter =
                      isFit && r >= winR && r < winR + F && c >= winC && c < winC + F;
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`${cellSizeClass} flex items-center justify-center border border-slate-300 font-mono font-bold transition-colors duration-150 ${
                          inFilter
                            ? 'bg-rose-100 text-rose-800'
                            : isPad
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-white text-slate-400'
                        }`}
                      >
                        {isPad ? '0' : ''}
                      </div>
                    );
                  })
                )}
                {/* Smooth animated sliding filter box */}
                {isFit && (
                  <motion.div
                    animate={{
                      x: `${(winC / F) * 100}%`,
                      y: `${(winR / F) * 100}%`,
                    }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: `${(F / totalN) * 100}%`,
                      height: `${(F / totalN) * 100}%`,
                    }}
                    className="pointer-events-none absolute top-0 left-0 border-[2.5px] border-[#c2553a]"
                  />
                )}
              </div>
            ) : (
              /* Scaled proportional blueprint diagram when N+2P > 14 */
              <div className="relative w-44 h-44 border-2 border-slate-700 bg-slate-200 overflow-hidden shadow-inner">
                <div
                  className="absolute bg-white border border-dashed border-slate-400 flex items-center justify-center"
                  style={{
                    inset: `${padVisualPct}%`,
                  }}
                >
                  <span className="font-mono text-xs font-bold text-slate-500 select-none">
                    {N}×{N}
                  </span>
                </div>
                {padding > 0 && (
                  <span className="absolute top-1 left-1.5 font-mono text-[10px] font-bold text-slate-600">
                    P={padding} (0-pad)
                  </span>
                )}
                {isFit && (
                  <motion.div
                    animate={{
                      left: `${(winC / totalN) * 100}%`,
                      top: `${(winR / totalN) * 100}%`,
                    }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: `${Math.max(8, (F / totalN) * 100)}%`,
                      height: `${Math.max(8, (F / totalN) * 100)}%`,
                    }}
                    className="pointer-events-none absolute border-2 border-[#c2553a] bg-[#c2553a]/20 flex items-center justify-center"
                  >
                    <span className="font-mono text-[9px] font-bold text-[#9a3d27]">
                      {F}×{F}
                    </span>
                  </motion.div>
                )}
              </div>
            )}

            {isValid && (
              <>
                <ArrowRight className="h-4 w-4 text-slate-400" />
                {useExactOutGrid ? (
                  <div
                    className="inline-grid border-2 border-emerald-700 bg-white"
                    style={{ gridTemplateColumns: `repeat(${outDim}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: outDim * outDim }).map((_, idx) => {
                      const current = idx === safeStep;
                      const visited = idx < safeStep;
                      return (
                        <motion.button
                          key={idx}
                          type="button"
                          animate={current && !shouldReduceMotion ? { scale: 1.12 } : { scale: 1 }}
                          onClick={() => {
                            setAutoSlide(false);
                            setStepIdx(idx);
                          }}
                          className={`${outCellSizeClass} border border-slate-300 font-mono font-bold cursor-pointer ${
                            current
                              ? 'bg-[#c2553a] text-white z-10'
                              : visited
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          {current || visited ? '•' : ''}
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative w-28 h-28 border-2 border-emerald-700 bg-emerald-50 flex flex-col items-center justify-center p-2">
                    <span className="font-mono text-sm font-extrabold text-emerald-800">
                      {outDim} × {outDim}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-700">Output Map</span>
                    <motion.div
                      animate={{
                        left: `${8 + (outC / Math.max(1, outDim - 1)) * 78}%`,
                        top: `${8 + (outR / Math.max(1, outDim - 1)) * 78}%`,
                      }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c2553a]"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <p className="font-mono text-xs text-slate-600 tabular-nums text-center">
            {isFit
              ? `Step (${outR}, ${outC}) · Window [${winR}..${winR + F - 1}, ${winC}..${winC + F - 1}] · Grid ${totalN}×${totalN}`
              : `Filter (${F}×${F}) is larger than padded grid (${totalN}×${totalN})`}
          </p>
        </div>

        <div className="md:col-span-6 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-2">
            <div className="font-bold text-slate-700">Output Size Formula:</div>
            <div className="text-slate-900">
              <MathFormula
                latex={String.raw`\begin{aligned} O &= \frac{N + 2P - F}{S} + 1 \\ &= \frac{${N} + 2(${padding}) - ${F}}{${stride}} + 1 = ${formattedRawOut} \end{aligned}`}
                displayMode
                className="text-xs sm:text-sm"
              />
            </div>
            <div className={isValid ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
              {isValid
                ? `Valid Integer Fit (${rawOut} × ${rawOut} output)`
                : !isFit
                ? `Invalid: Filter (${F}) > Padded Size (${totalN})`
                : 'Invalid: Non-integer output (Does not fit!)'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 space-y-1.5">
            <p className="font-semibold">Same-Size Padding Rule (Stride 1):</p>
            <MathFormula
              latex={String.raw`P = \frac{F - 1}{2} \implies \text{For } F = ${F},\;\; P = ${samePad}`}
              className="text-xs sm:text-sm text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDE 24: 1x1 CONV
   ============================================================================ */
export const Conv1x1Visual: React.FC<{ replaySignal?: number }> = ({ replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [outChannels, setOutChannels] = useState<32 | 64 | 128 | 256>(128);
  const [beamY, setBeamY] = useState(0);

  useEffect(() => {
    setBeamY(0);
  }, [replaySignal]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const t = setInterval(() => {
      setBeamY((y) => (y + 1) % 4);
    }, 600);
    return () => clearInterval(t);
  }, [shouldReduceMotion]);

  const widthPx = outChannels === 32 ? 64 : outChannels === 64 ? 92 : outChannels === 128 ? 124 : 156;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
        <span className="text-xs font-bold text-slate-700">1×1 Filters (Output Depth):</span>
        <div className="flex gap-1.5">
          {([32, 64, 128, 256] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setOutChannels(k)}
              className={`pop-interactive rounded-md px-3 py-1 font-mono text-xs font-bold cursor-pointer transition-colors ${
                outChannels === k
                  ? 'bg-[#c2553a] text-white'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {k} filters
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-wrap items-center justify-center gap-6">
        <div className="text-center">
          <div className="relative w-24 h-28 border-2 border-slate-700 bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-slate-800 overflow-hidden">
            <span>32×32×64</span>
            <motion.div
              animate={{ y: -34 + beamY * 22 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-x-0 h-3.5 bg-[#c2553a]/25 border-y border-[#c2553a]"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Input Volume</p>
        </div>

        <div className="text-center space-y-1">
          <motion.div
            animate={shouldReduceMotion ? undefined : { x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            <ArrowRight className="h-6 w-6 text-[#c2553a] mx-auto" />
          </motion.div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <p className="font-bold text-slate-800">1×1 CONV ({outChannels} filters)</p>
            <p className="text-[11px] text-slate-600 font-mono">
              Each filter: 1×1×64 (64-D dot product)
            </p>
          </div>
        </div>

        <div className="text-center">
          <motion.div
            animate={{ width: widthPx }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-28 border-2 border-[#c2553a] bg-orange-50 flex items-center justify-center font-mono text-xs font-bold text-[#c2553a] overflow-hidden"
          >
            <span>32×32×{outChannels}</span>
            <motion.div
              animate={{ y: -34 + beamY * 22 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-x-0 h-3.5 bg-emerald-500/20 border-y border-emerald-600"
            />
          </motion.div>
          <p className="mt-1.5 text-xs text-slate-500">
            {outChannels < 64 ? 'Bottleneck Compression' : 'Channel Expansion'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDE 25: Max Pooling
   ============================================================================ */
export const MaxPoolingVisual: React.FC<{ replaySignal?: number }> = ({ replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [poolType, setPoolType] = useState<'max' | 'avg'>('max');
  const [selectedTile, setSelectedTile] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(!shouldReduceMotion);

  useEffect(() => {
    setSelectedTile(0);
    setAutoPlay(!shouldReduceMotion);
  }, [replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => {
      setSelectedTile((prev) => (prev + 1) % 4);
    }, 900);
    return () => clearInterval(t);
  }, [autoPlay]);

  const matrix = [
    [1, 2, 4, 6],
    [5, 6, 7, 8],
    [3, 2, 1, 0],
    [1, 2, 3, 4],
  ];

  const tileColors = [
    'bg-lime-200/80 text-slate-900',
    'bg-rose-200/80 text-slate-900',
    'bg-indigo-200/80 text-slate-900',
    'bg-emerald-200/80 text-slate-900',
  ];

  const getTileIndex = (r: number, c: number) => Math.floor(r / 2) * 2 + Math.floor(c / 2);

  const pooled = [0, 1].map((pr) =>
    [0, 1].map((pc) => {
      const vals = [
        matrix[pr * 2][pc * 2],
        matrix[pr * 2][pc * 2 + 1],
        matrix[pr * 2 + 1][pc * 2],
        matrix[pr * 2 + 1][pc * 2 + 1],
      ];
      return poolType === 'max'
        ? Math.max(...vals)
        : Number((vals.reduce((a, b) => a + b, 0) / 4).toFixed(2));
    })
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
        <span className="text-xs font-bold text-slate-700">Pooling Mode (2×2, Stride 2):</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPoolType('max')}
            className={`pop-interactive rounded-md px-3 py-1 text-xs font-semibold cursor-pointer ${
              poolType === 'max' ? 'bg-[#c2553a] text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Max Pooling
          </button>
          <button
            type="button"
            onClick={() => setPoolType('avg')}
            className={`pop-interactive rounded-md px-3 py-1 text-xs font-semibold cursor-pointer ${
              poolType === 'avg' ? 'bg-[#c2553a] text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Average Pooling
          </button>
          <button
            type="button"
            onClick={() => setAutoPlay((a) => !a)}
            className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
          >
            {autoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {autoPlay ? 'Pause' : 'Animate'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-center gap-6">
        <div className="inline-grid grid-cols-4 border-2 border-slate-800">
          {matrix.map((row, r) =>
            row.map((val, c) => {
              const tIdx = getTileIndex(r, c);
              const tPr = Math.floor(tIdx / 2);
              const tPc = tIdx % 2;
              const isWinner =
                poolType === 'max' && selectedTile === tIdx && val === pooled[tPr][tPc];
              return (
                <motion.button
                  key={`${r}-${c}`}
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.14, y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 480, damping: 16 }}
                  onClick={() => {
                    setAutoPlay(false);
                    setSelectedTile(tIdx);
                  }}
                  className={`w-12 h-12 flex items-center justify-center border border-slate-400 font-mono text-sm font-bold cursor-pointer hover:z-10 ${
                    tileColors[tIdx]
                  } ${selectedTile === tIdx ? 'ring-2 ring-inset ring-slate-900' : ''} ${
                    isWinner ? 'scale-105 underline decoration-2' : ''
                  }`}
                >
                  {val}
                </motion.button>
              );
            })
          )}
        </div>

        <div className="text-center">
          <motion.div
            animate={shouldReduceMotion ? undefined : { x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            <ArrowRight className="h-6 w-6 text-[#c2553a] mx-auto" />
          </motion.div>
          <p className="text-[11px] text-slate-500 mt-1">2×2, stride 2</p>
        </div>

        <div className="inline-grid grid-cols-2 border-2 border-slate-800">
          {pooled.map((row, pr) =>
            row.map((val, pc) => {
              const tIdx = pr * 2 + pc;
              const active = selectedTile === tIdx;
              return (
                <motion.button
                  key={`${pr}-${pc}`}
                  type="button"
                  animate={active && !shouldReduceMotion ? { scale: 1.08 } : { scale: 1 }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.15, y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 480, damping: 16 }}
                  onClick={() => {
                    setAutoPlay(false);
                    setSelectedTile(tIdx);
                  }}
                  className={`w-14 h-14 flex items-center justify-center border border-slate-400 font-mono text-base font-extrabold cursor-pointer hover:z-20 ${
                    tileColors[tIdx]
                  } ${active ? 'ring-2 ring-inset ring-slate-900 z-10' : ''}`}
                >
                  {val}
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDE 26: Fully Connected Pipeline
   ============================================================================ */
export const FullyConnectedVisual: React.FC<{ replaySignal?: number }> = ({ replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const stages = [
    { name: 'Input', shape: '32×32×3', detail: '3,072 pixels', h: 'h-32', w: 'w-7' },
    { name: 'CONV+ReLU', shape: '32×32×8', detail: '8 filters 3×3 (pad 1)', h: 'h-32', w: 'w-9' },
    { name: 'Max Pool', shape: '16×16×8', detail: '2×2 stride 2', h: 'h-24', w: 'w-9' },
    { name: 'CONV+ReLU', shape: '16×16×24', detail: '24 filters 3×3 (pad 1)', h: 'h-24', w: 'w-12' },
    { name: 'Max Pool', shape: '8×8×24', detail: '2×2 stride 2', h: 'h-16', w: 'w-12' },
    { name: 'Flatten', shape: '1,536', detail: '8 × 8 × 24 = 1,536', h: 'h-28', w: 'w-4' },
    { name: 'FC 1', shape: '256', detail: '1536×256 + 256 params', h: 'h-20', w: 'w-4' },
    { name: 'Output', shape: '10', detail: '10 class scores', h: 'h-14', w: 'w-4' },
  ];
  const [selected, setSelected] = useState(0);
  const [autoPass, setAutoPass] = useState(!shouldReduceMotion);

  useEffect(() => {
    setSelected(0);
    setAutoPass(!shouldReduceMotion);
  }, [replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!autoPass) return;
    const t = setInterval(() => {
      setSelected((s) => (s + 1) % stages.length);
    }, 850);
    return () => clearInterval(t);
  }, [autoPass, stages.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
        <span className="font-semibold text-slate-700">Forward Pass Tensor Flow (Stage {selected + 1}/{stages.length})</span>
        <button
          type="button"
          onClick={() => setAutoPass((a) => !a)}
          className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
        >
          {autoPass ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {autoPass ? 'Pause' : 'Play Flow'}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 overflow-x-auto">
        <div className="flex items-end justify-center gap-3 min-w-[600px]">
          {stages.map((st, idx) => {
            const active = selected === idx;
            return (
              <motion.button
                key={st.name + idx}
                type="button"
                animate={active && !shouldReduceMotion ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
                whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.08 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 440, damping: 16 }}
                onClick={() => {
                  setAutoPass(false);
                  setSelected(idx);
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <span className="text-[10px] font-semibold text-slate-600 mb-1">{st.name}</span>
                <span className="font-mono text-[10px] font-bold text-[#c2553a] mb-1.5">
                  {st.shape}
                </span>
                <div
                  className={`${st.h} ${st.w} border-2 transition-colors ${
                    active
                      ? 'border-[#c2553a] bg-orange-100 shadow-sm'
                      : 'border-slate-600 bg-slate-100 group-hover:bg-slate-200'
                  }`}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={selected}
        initial={shouldReduceMotion ? false : { opacity: 0.7, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between text-xs"
      >
        <div>
          <span className="font-bold text-slate-900">{stages[selected].name}</span>
          <span className="mx-2 text-slate-400">·</span>
          <span className="font-mono text-[#c2553a] font-bold">{stages[selected].shape}</span>
        </div>
        <span className="font-mono text-slate-600">{stages[selected].detail}</span>
      </motion.div>
    </div>
  );
};

/* ============================================================================
   SLIDE 27: Why Convolutions
   ============================================================================ */
export const WhyConvolutionsVisual: React.FC<{ language: LanguageMode }> = ({ language }) => {
  const shouldReduceMotion = useReducedMotion();
  const [sharedPos, setSharedPos] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const t = setInterval(() => {
      setSharedPos((p) => (p + 1) % 4);
    }, 800);
    return () => clearInterval(t);
  }, [shouldReduceMotion]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-[#c2553a]">1. Parameter Sharing</div>
          <span className="font-mono text-[10px] text-slate-500">Patch #{sharedPos + 1}</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          A feature detector (such as a vertical edge detector) useful in one part of the image is probably useful in another part of the image.
        </p>
        {language !== 'en' && (
          <p className="text-xs text-slate-600 font-khmer leading-relaxed">
            Filter តែមួយ (ដូចជាឧបករណ៍ចាប់គែមបញ្ឈរ) អាចប្រើរួមគ្នាបាននៅគ្រប់ទីតាំងនៃរូបភាព។
          </p>
        )}
        <div className="flex items-center gap-2 py-1">
          {[0, 1, 2, 3].map((idx) => (
            <motion.div
              key={idx}
              animate={sharedPos === idx && !shouldReduceMotion ? { scale: 1.06 } : { scale: 1 }}
              className={`flex-1 rounded-md border py-1.5 text-center font-mono text-[11px] font-bold transition-colors ${
                sharedPos === idx
                  ? 'border-[#c2553a] bg-orange-100 text-[#c2553a]'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              W (3×3)
            </motion.div>
          ))}
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 font-mono text-xs text-emerald-700">
          Same 3×3 weights reused across all (H×W) locations!
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2.5">
        <div className="text-sm font-bold text-sky-700">2. Sparsity of Connections</div>
        <p className="text-xs text-slate-700 leading-relaxed">
          In each layer, each output value depends only on a small number of local inputs rather than every pixel in the entire image.
        </p>
        {language !== 'en' && (
          <p className="text-xs text-slate-600 font-khmer leading-relaxed">
            តម្លៃលទ្ធផលនីមួយៗពឹងផ្អែកតែលើភីកសែលជិតខាងមួយចំនួនតូចប៉ុណ្ណោះ (ឧ. 3×3 = 9 ភីកសែល)។
          </p>
        )}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="grid grid-cols-3 gap-0.5 p-1 rounded border border-sky-300 bg-sky-50">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 bg-sky-600 rounded-[1px]" />
            ))}
          </div>
          <motion.div
            animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.3 }}
          >
            <ArrowRight className="h-4 w-4 text-sky-600" />
          </motion.div>
          <div className="px-2.5 py-1 rounded border border-sky-400 bg-sky-100 font-mono text-[11px] font-bold text-sky-900">
            1 Output Pixel
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 font-mono text-xs text-sky-700">
          14.4M Dense weights → 456 Conv weights (31,600× smaller)
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDE 28: LeNet-5
   ============================================================================ */
export const CaseStudyLeNetVisual: React.FC<{ replaySignal?: number }> = ({ replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const layers = [
    { id: 'Input', dim: '32×32×1', desc: 'Handwritten character input' },
    { id: 'C1', dim: '6@28×28', desc: '6 filters 5×5, stride 1' },
    { id: 'S2', dim: '6@14×14', desc: 'Subsampling 2×2, stride 2' },
    { id: 'C3', dim: '16@10×10', desc: '16 filters 5×5, stride 1' },
    { id: 'S4', dim: '16@5×5', desc: 'Subsampling 2×2, stride 2' },
    { id: 'C5', dim: '120', desc: 'Full connection / 5×5 conv' },
    { id: 'F6', dim: '84', desc: 'Fully connected layer' },
    { id: 'OUT', dim: '10', desc: 'Gaussian / Softmax 10 classes' },
  ];
  const [active, setActive] = useState(0);
  const [autoWalk, setAutoWalk] = useState(!shouldReduceMotion);

  useEffect(() => {
    setActive(0);
    setAutoWalk(!shouldReduceMotion);
  }, [replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!autoWalk) return;
    const t = setInterval(() => {
      setActive((a) => (a + 1) % layers.length);
    }, 900);
    return () => clearInterval(t);
  }, [autoWalk, layers.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
        <span className="font-semibold text-slate-700">LeNet-5 Forward Pass</span>
        <button
          type="button"
          onClick={() => setAutoWalk((w) => !w)}
          className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
        >
          {autoWalk ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {autoWalk ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-[580px]">
          {layers.map((l, idx) => (
            <motion.button
              key={l.id}
              type="button"
              animate={active === idx && !shouldReduceMotion ? { y: -3, scale: 1.04 } : { y: 0, scale: 1 }}
              whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.07 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 16 }}
              onClick={() => {
                setAutoWalk(false);
                setActive(idx);
              }}
              className={`flex-1 rounded-xl border p-2.5 text-center transition-colors cursor-pointer ${
                active === idx
                  ? 'border-[#c2553a] bg-orange-50'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span className="block text-xs font-bold text-slate-900">{l.id}</span>
              <span className="mt-1 block font-mono text-[10px] font-semibold text-[#c2553a]">
                {l.dim}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs flex items-center justify-between">
        <span className="font-bold text-slate-900">
          {layers[active].id} ({layers[active].dim})
        </span>
        <span className="text-slate-600">{layers[active].desc}</span>
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDE 29: AlexNet
   ============================================================================ */
export const CaseStudyAlexNetVisual: React.FC<{ replaySignal?: number }> = ({ replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const blocks = [
    { name: 'Input', shape: '227×227×3', spec: 'RGB ImageNet crop' },
    { name: 'Conv1', shape: '55×55×96', spec: '96 11×11 s=4 pad=0 + MaxPool 3×3 s=2 + Norm' },
    { name: 'Conv2', shape: '27×27×256', spec: '256 5×5 s=1 pad=2 + MaxPool 3×3 s=2 + Norm' },
    { name: 'Conv3', shape: '13×13×384', spec: '384 3×3 s=1 pad=1' },
    { name: 'Conv4', shape: '13×13×384', spec: '384 3×3 s=1 pad=1' },
    { name: 'Conv5', shape: '13×13×256', spec: '256 3×3 s=1 pad=1 + MaxPool 3×3 s=2' },
    { name: 'FC6–8', shape: '4096 → 4096 → 1000', spec: 'Dropout + 1000-way Softmax' },
  ];
  const [active, setActive] = useState(0);
  const [autoWalk, setAutoWalk] = useState(!shouldReduceMotion);

  useEffect(() => {
    setActive(0);
    setAutoWalk(!shouldReduceMotion);
  }, [replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!autoWalk) return;
    const t = setInterval(() => {
      setActive((a) => (a + 1) % blocks.length);
    }, 950);
    return () => clearInterval(t);
  }, [autoWalk, blocks.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
        <span className="font-semibold text-slate-700">AlexNet (2012) Deep Pipeline</span>
        <button
          type="button"
          onClick={() => setAutoWalk((w) => !w)}
          className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
        >
          {autoWalk ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {autoWalk ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {blocks.map((b, idx) => (
          <motion.button
            key={b.name}
            type="button"
            animate={active === idx && !shouldReduceMotion ? { y: -3, scale: 1.04 } : { y: 0, scale: 1 }}
            whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.06 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 450, damping: 16 }}
            onClick={() => {
              setAutoWalk(false);
              setActive(idx);
            }}
            className={`rounded-xl border p-2.5 text-center transition-colors cursor-pointer ${
              active === idx
                ? 'border-sky-600 bg-sky-50 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <span className="block text-xs font-bold text-slate-900">{b.name}</span>
            <span className="mt-1 block font-mono text-[10px] font-semibold text-sky-700">
              {b.shape}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-slate-900">
          {blocks[active].name}: {blocks[active].shape}
        </span>
        <span className="font-mono text-blue-700">{blocks[active].spec}</span>
      </div>
    </div>
  );
};

/* ============================================================================
   SLIDE 30: Other Case Studies (VGGNet, GoogLeNet, ResNet)
   ============================================================================ */
export const OtherCaseStudiesVisual: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<'vgg' | 'googlenet' | 'resnet'>('resnet');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: 'vgg' as const,
            title: 'VGGNet (2014)',
            author: 'Simonyan & Zisserman',
            highlight: 'Deep 3×3 uniform convolutions (16–19 layers)',
          },
          {
            id: 'googlenet' as const,
            title: 'GoogLeNet (2014)',
            author: 'Szegedy et al.',
            highlight: 'Inception Module (1×1, 3×3, 5×5 parallel)',
          },
          {
            id: 'resnet' as const,
            title: 'ResNet (2015)',
            author: 'He et al.',
            highlight: 'Skipped Connections: H(x) = F(x) + x',
          },
        ].map((item) => (
          <motion.button
            key={item.id}
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 440, damping: 16 }}
            onClick={() => setSelected(item.id)}
            className={`rounded-xl border p-4 text-left transition-colors cursor-pointer hover:shadow-md ${
              selected === item.id
                ? 'border-[#c2553a] bg-orange-50/50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-sm font-bold text-slate-900">{item.title}</div>
            <div className="text-[11px] text-slate-500">{item.author}</div>
            <p className="mt-2 text-xs font-medium text-slate-700">{item.highlight}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 space-y-3"
        >
          {selected === 'vgg' && (
            <>
              <p>
                VGGNet proved that stacking two 3×3 convs achieves the same 5×5 receptive field with fewer parameters and extra ReLU non-linearity.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 font-mono text-[11px]">
                {['3×3 Conv', '3×3 Conv', '3×3 Conv', 'MaxPool'].map((b, i) => (
                  <React.Fragment key={b + i}>
                    <span className="rounded border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-800">
                      {b}
                    </span>
                    {i < 3 && <ArrowRight className="h-3.5 w-3.5 text-[#c2553a]" />}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
          {selected === 'googlenet' && (
            <>
              <p>
                GoogLeNet introduced the Inception Module: multi-scale parallel branches (1×1, 3×3, 5×5, MaxPool) concatenated along depth, cutting parameters to 6.8M.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1 font-mono text-[11px]">
                <span className="rounded border border-slate-300 bg-white px-2 py-1 font-semibold">Input</span>
                <ArrowRight className="h-3.5 w-3.5 text-sky-600" />
                <div className="grid grid-cols-2 gap-1.5">
                  <span className="rounded bg-sky-100 px-2 py-0.5 text-sky-900">1×1</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-900">3×3</span>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-900">5×5</span>
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-900">Pool</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-sky-600" />
                <span className="rounded border border-sky-600 bg-sky-50 px-2 py-1 font-bold text-sky-900">Concat</span>
              </div>
            </>
          )}
          {selected === 'resnet' && (
            <>
              <p>
                ResNet solved degradation in ultra-deep networks via Identity Skip Connections: output = F(x) + x, enabling 152+ layers.
              </p>
              <svg viewBox="0 0 360 74" className="w-full max-w-md mx-auto h-20">
                <line x1="20" y1="48" x2="290" y2="48" stroke="#475569" strokeWidth="2" className="animate-flow-dash" />
                <path
                  d="M 55 48 C 55 10, 265 10, 265 36"
                  fill="none"
                  stroke="#c2553a"
                  strokeWidth="2.5"
                  className="animate-flow-dash"
                />
                <text x="160" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c2553a">
                  Identity Skip (+ x)
                </text>
                <rect x="85" y="34" width="60" height="26" rx="4" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
                <text x="115" y="51" textAnchor="middle" fontSize="10" fontWeight="bold">Weight</text>
                <rect x="170" y="34" width="60" height="26" rx="4" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
                <text x="200" y="51" textAnchor="middle" fontSize="10" fontWeight="bold">Weight</text>
                <circle cx="265" cy="48" r="11" fill="#fff" stroke="#059669" strokeWidth="2" />
                <text x="265" y="52" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#059669">+</text>
                <text x="316" y="52" fontSize="11" fontWeight="bold" fill="#0f172a">F(x)+x</text>
              </svg>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ============================================================================
   SLIDE 31: Image Datasets
   ============================================================================ */
export const DatasetsVisual: React.FC<{ replaySignal?: number }> = ({ replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const datasets = [
    { name: 'MNIST', size: '28×28 Grayscale', count: '60K train + 10K test', pct: 12 },
    { name: 'CIFAR-10', size: '32×32 Color (RGB)', count: '60K images · 10 classes', pct: 18 },
    { name: 'MS-COCO', size: 'Detection & Segmentation', count: '328K images', pct: 45 },
    { name: 'ImageNet', size: '20K+ Categories', count: '14M+ images', pct: 100 },
  ];

  return (
    <div key={replaySignal} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {datasets.map((d, idx) => (
        <motion.div
          key={d.name}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 420, damping: 17, delay: idx * 0.05 }}
          className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">{d.name}</span>
            <span className="font-mono text-xs font-semibold text-[#c2553a]">{d.count}</span>
          </div>
          <p className="text-xs text-slate-600">{d.size}</p>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.12 + idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-sky-600 rounded-full origin-left"
              style={{ width: `${d.pct}%` }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/* ============================================================================
   SLIDE 32: Exercise Configurator
   ============================================================================ */
export const ExerciseVisual: React.FC<{ language: LanguageMode }> = ({ language }) => {
  const shouldReduceMotion = useReducedMotion();
  const [arch, setArch] = useState<'lenet5' | 'alexnet' | 'resnet18'>('lenet5');
  const [dataset, setDataset] = useState<'mnist' | 'cifar10'>('cifar10');

  const inChannels = dataset === 'mnist' ? 1 : 3;
  const imgSize = dataset === 'mnist' ? '28×28' : '32×32';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <span className="block text-xs font-bold text-slate-700 mb-2">
            1. Select Case Study Architecture
          </span>
          <div className="flex gap-1.5">
            {(['lenet5', 'alexnet', 'resnet18'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setArch(a)}
                className={`pop-interactive flex-1 rounded-lg py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  arch === a ? 'bg-[#c2553a] text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                {a === 'lenet5' ? 'LeNet-5' : a === 'alexnet' ? 'AlexNet' : 'ResNet-18'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-700 mb-2">
            2. Select Dataset
          </span>
          <div className="flex gap-1.5">
            {(['mnist', 'cifar10'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDataset(d)}
                className={`pop-interactive flex-1 rounded-lg py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  dataset === d ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                {d === 'mnist' ? 'MNIST (28×28)' : 'CIFAR-10 (32×32)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        key={`${arch}-${dataset}`}
        initial={shouldReduceMotion ? false : { opacity: 0.7, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs"
      >
        <div className="flex items-center gap-2 font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            Ready Blueprint: {arch.toUpperCase()} on {dataset.toUpperCase()}
          </span>
        </div>
        <p className="font-mono text-slate-700">
          Input: [{inChannels}, {imgSize}] → Output: 10 classes · Loss: CrossEntropyLoss · Epochs: 15
        </p>
        {language !== 'en' && (
          <p className="font-khmer text-slate-600">
            កែសម្រួល Conv1 in_channels={inChannels} សម្រាប់ {dataset.toUpperCase()} រួចហ្វឹកហាត់ និងវាស់ស្ទង់ Test Accuracy។
          </p>
        )}
      </motion.div>
    </div>
  );
};

/* ============================================================================
   SLIDE 33: References
   ============================================================================ */
export const ReferencesVisual: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const refs = [
    {
      author: 'Ng, A.',
      title: 'Coursera Machine Learning Course',
      url: 'https://www.coursera.org/learn/machine-learning',
      displayUrl: 'coursera.org/learn/machine-learning',
    },
    {
      author: 'Ng, A. (2018)',
      title: 'Stanford CS229: Machine Learning',
      url: 'https://cs229.stanford.edu/',
      displayUrl: 'cs229.stanford.edu',
    },
    {
      author: 'Karpathy, A. (2016)',
      title: 'Stanford Winter Class CS231n: Convolutional Neural Networks for Visual Recognition',
      url: 'https://cs231n.github.io/',
      displayUrl: 'cs231n.github.io',
    },
  ];

  return (
    <div className="space-y-3">
      {refs.map((r, i) => (
        <motion.div
          key={i}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 420, damping: 17, delay: i * 0.05 }}
          className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-3 hover:shadow-md"
        >
          <div>
            <p className="text-sm font-bold text-slate-900">{r.author}</p>
            <p className="text-xs text-slate-700 mt-0.5">{r.title}</p>
          </div>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pop-interactive flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-50"
          >
            <span>{r.displayUrl}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
      ))}
    </div>
  );
};
