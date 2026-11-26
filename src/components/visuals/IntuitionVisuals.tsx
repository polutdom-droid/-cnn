import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { LanguageMode } from '../../types/slide';

type Grid2x2 = [number, number, number, number]; // TL, TR, BL, BR

export const Intuition2x2Visual: React.FC<{
  mode: 'system' | 'sum-fail' | 'weighted' | 'single-classifier' | 'dual-classifiers';
  language: LanguageMode;
  replaySignal?: number;
}> = ({ mode, language, replaySignal = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [grid, setGrid] = useState<Grid2x2>([-1, 1, 1, -1]);
  const [autoCycle, setAutoCycle] = useState(!shouldReduceMotion);

  useEffect(() => {
    setGrid([-1, 1, 1, -1]);
    setAutoCycle(!shouldReduceMotion);
  }, [mode, replaySignal, shouldReduceMotion]);

  useEffect(() => {
    if (!autoCycle) return;
    const t = setInterval(() => {
      setGrid((prev) =>
        prev[0] === -1 && prev[1] === 1 ? [1, -1, -1, 1] : [-1, 1, 1, -1]
      );
    }, 1800);
    return () => clearInterval(t);
  }, [autoCycle]);

  const toggleCell = (idx: number) => {
    setAutoCycle(false);
    const next: Grid2x2 = [...grid] as Grid2x2;
    next[idx] = next[idx] === 1 ? -1 : 1;
    setGrid(next);
  };

  const naiveSum = grid[0] + grid[1] + grid[2] + grid[3];
  const scoreFwd = -grid[0] + grid[1] + grid[2] - grid[3]; // [- +; + -]
  const scoreBwd = grid[0] - grid[1] - grid[2] + grid[3]; // [+ -; - +]

  return (
    <div className="space-y-4">
      {/* Preset & Interactive Grid Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">2×2 Pattern:</span>
          <button
            type="button"
            onClick={() => {
              setAutoCycle(false);
              setGrid([-1, 1, 1, -1]);
            }}
            className={`pop-interactive rounded-md px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-colors ${
              grid[0] === -1 && grid[1] === 1 && grid[2] === 1 && grid[3] === -1
                ? 'bg-[#c2553a] text-white'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Pattern "/"
          </button>
          <button
            type="button"
            onClick={() => {
              setAutoCycle(false);
              setGrid([1, -1, -1, 1]);
            }}
            className={`pop-interactive rounded-md px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-colors ${
              grid[0] === 1 && grid[1] === -1 && grid[2] === -1 && grid[3] === 1
                ? 'bg-[#c2553a] text-white'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Pattern "\"
          </button>
          <button
            type="button"
            onClick={() => setAutoCycle((a) => !a)}
            className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
          >
            {autoCycle ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {autoCycle ? 'Pause' : 'Auto-Test'}
          </button>
        </div>
        <span className="text-[11px] text-slate-500 font-khmer">
          {language === 'km'
            ? 'ចុចលើក្រឡាណាមួយដើម្បីប្តូរពណ៌ ស (-1) / ក្រហម (+1)'
            : 'Click any cell to toggle (-1 white / +1 red)'}
        </span>
      </div>

      {/* Main Interactive Diagram */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Interactive 2x2 Pixel Image */}
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-600 mb-2">2×2 pixel image</p>
            <div className="inline-grid grid-cols-2 border-2 border-slate-800">
              {grid.map((val, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.12, y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 460, damping: 16 }}
                  onClick={() => toggleCell(idx)}
                  className={`w-14 h-14 border border-slate-400 font-mono text-base font-bold transition-colors duration-200 cursor-pointer hover:z-10 ${
                    val === 1
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {mode === 'system' ? '' : val}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowRight className="h-6 w-6 text-[#c2553a]" />
          </motion.div>

          {/* Mode-specific right side */}
          {mode === 'system' && (
            <>
              <motion.div
                key={`sys-${scoreFwd}`}
                initial={shouldReduceMotion ? false : { scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border-2 border-slate-500 bg-[#8d9a94] px-8 py-7 text-2xl font-bold tracking-wider text-white shadow-sm"
              >
                SYSTEM
              </motion.div>
              <motion.div
                animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.35, ease: 'easeInOut' }}
              >
                <ArrowRight className="h-6 w-6 text-[#c2553a]" />
              </motion.div>
              <motion.div
                key={`res-${scoreFwd}`}
                initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.22 }}
                className="text-5xl font-black text-slate-900 w-16 text-center"
              >
                {scoreFwd > 0 ? '/' : scoreFwd < 0 ? '\\' : '?'}
              </motion.div>
            </>
          )}

          {(mode === 'sum-fail' || mode === 'weighted') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {(mode === 'sum-fail' ? ['+', '+', '+', '+'] : ['−', '+', '+', '−']).map(
                  (sign, i) => (
                    <div key={i} className="w-12 text-center font-mono text-lg font-bold text-sky-600">
                      {sign}
                    </div>
                  )
                )}
              </div>
              <div className="flex items-center border-2 border-slate-800">
                {grid.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 flex items-center justify-center border-r last:border-r-0 border-slate-400 font-mono text-sm font-bold transition-colors duration-200 ${
                      val === 1 ? 'bg-red-600 text-white' : 'bg-white text-slate-900'
                    }`}
                  >
                    {val}
                  </div>
                ))}
                <motion.span
                  key={`${mode}-${naiveSum}-${scoreFwd}`}
                  initial={shouldReduceMotion ? false : { scale: 0.85, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 font-mono text-xl font-bold text-sky-600 tabular-nums"
                >
                  = {mode === 'sum-fail' ? naiveSum : scoreFwd}
                </motion.span>
              </div>
              <p className="text-xs text-slate-600">
                {mode === 'sum-fail'
                  ? `Both "/" and "\\" sum to 0 — indistinguishable!`
                  : `With [- + + -], "/" gives +4 and "\\" gives -4!`}
              </p>
            </div>
          )}

          {mode === 'single-classifier' && (
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-600 mb-1">Image Classifier</p>
                <div className="inline-grid grid-cols-2 border-2 border-slate-800 bg-slate-50">
                  {['−', '+', '+', '−'].map((s, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 flex items-center justify-center border border-slate-300 text-xl font-bold text-slate-800"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 text-sm font-semibold">
                <motion.div
                  animate={shouldReduceMotion ? undefined : { scale: scoreFwd > 0 ? 1.03 : 1 }}
                  transition={{ duration: 0.18 }}
                  className={`rounded-lg px-3 py-1.5 border transition-colors ${
                    scoreFwd > 0
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  If positive ⇒ "/" (Score: {scoreFwd})
                </motion.div>
                <motion.div
                  animate={shouldReduceMotion ? undefined : { scale: scoreFwd < 0 ? 1.03 : 1 }}
                  transition={{ duration: 0.18 }}
                  className={`rounded-lg px-3 py-1.5 border transition-colors ${
                    scoreFwd < 0
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  If negative ⇒ "\"
                </motion.div>
              </div>
            </div>
          )}

          {mode === 'dual-classifiers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                animate={shouldReduceMotion ? undefined : { scale: scoreFwd > 0 ? 1.02 : 1 }}
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 420, damping: 17 }}
                className={`rounded-xl border p-3 transition-colors ${
                  scoreFwd > 0
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-800 mb-2">
                  Classifier 1: Detect "/"
                </p>
                <div className="flex items-center gap-3">
                  <div className="inline-grid grid-cols-2 border border-slate-700 bg-white">
                    {['−', '+', '+', '−'].map((s, i) => (
                      <div key={i} className="w-8 h-8 flex items-center justify-center border border-slate-300 font-bold text-sm">
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-mono">
                    <div className="font-bold text-slate-900">Score: {scoreFwd}</div>
                    <div className={scoreFwd > 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                      {scoreFwd > 0 ? '⇒ "/"' : '⇒ Not "/"'}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={shouldReduceMotion ? undefined : { scale: scoreBwd > 0 ? 1.02 : 1 }}
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 420, damping: 17 }}
                className={`rounded-xl border p-3 transition-colors ${
                  scoreBwd > 0
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-800 mb-2">
                  Classifier 2: Detect "\"
                </p>
                <div className="flex items-center gap-3">
                  <div className="inline-grid grid-cols-2 border border-slate-700 bg-white">
                    {['+', '−', '−', '+'].map((s, i) => (
                      <div key={i} className="w-8 h-8 flex items-center justify-center border border-slate-300 font-bold text-sm">
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-mono">
                    <div className="font-bold text-slate-900">Score: {scoreBwd}</div>
                    <div className={scoreBwd > 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                      {scoreBwd > 0 ? '⇒ "\\"' : '⇒ Not "\\"'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PRESETS_3X3: Record<'/' | '\\' | 'X' | 'O', number[][]> = {
  '/': [
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ],
  '\\': [
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
  ],
  X: [
    [1, -1, 1],
    [-1, 1, -1],
    [1, -1, 1],
  ],
  O: [
    [-1, 1, -1],
    [1, -1, 1],
    [-1, 1, -1],
  ],
};

const FILTER_FWD = [
  [-1, 1],
  [1, -1],
];
const FILTER_BWD = [
  [1, -1],
  [-1, 1],
];

export const Intuition3x3Visual: React.FC<{
  mode: 'patterns' | 'conv-scan' | 'composition';
  replaySignal: number;
}> = ({ mode, replaySignal }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeChar, setActiveChar] = useState<'/' | '\\' | 'X' | 'O'>('X');
  const [grid, setGrid] = useState<number[][]>(PRESETS_3X3.X.map((r) => [...r]));
  const [quadrant, setQuadrant] = useState<number>(0); // 0..3
  const [autoPlay, setAutoPlay] = useState(!shouldReduceMotion);

  useEffect(() => {
    setQuadrant(0);
    setAutoPlay(!shouldReduceMotion);
  }, [replaySignal, mode, shouldReduceMotion]);

  useEffect(() => {
    if (!autoPlay || mode === 'patterns') return;
    const t = setInterval(() => {
      setQuadrant((q) => (q + 1) % 4);
    }, 650);
    return () => clearInterval(t);
  }, [autoPlay, mode]);

  const selectPreset = (ch: '/' | '\\' | 'X' | 'O') => {
    setActiveChar(ch);
    setGrid(PRESETS_3X3[ch].map((r) => [...r]));
  };

  const togglePixel = (r: number, c: number) => {
    const next = grid.map((row) => [...row]);
    next[r][c] = next[r][c] === 1 ? -1 : 1;
    setGrid(next);
  };

  const computeMap = (flt: number[][]) =>
    [0, 1].map((r) =>
      [0, 1].map((c) => {
        let sum = 0;
        for (let u = 0; u < 2; u++) {
          for (let v = 0; v < 2; v++) {
            sum += grid[r + u][c + v] * flt[u][v];
          }
        }
        return sum;
      })
    );

  const mapFwd = computeMap(FILTER_FWD);
  const mapBwd = computeMap(FILTER_BWD);

  const qR = Math.floor(quadrant / 2);
  const qC = quadrant % 2;

  // Determine predicted class from ReLU'd maps
  const fwdMain = Math.max(0, mapFwd[0][1]) + Math.max(0, mapFwd[1][0]);
  const bwdMain = Math.max(0, mapBwd[0][0]) + Math.max(0, mapBwd[1][1]);
  const fwdOpp = Math.max(0, mapFwd[0][0]) + Math.max(0, mapFwd[1][1]);
  const bwdOpp = Math.max(0, mapBwd[0][1]) + Math.max(0, mapBwd[1][0]);

  let predicted = activeChar;
  if (fwdMain >= 4 && bwdMain >= 4) predicted = 'X';
  else if (fwdOpp >= 4 && bwdOpp >= 4) predicted = 'O';
  else if (fwdMain > bwdMain) predicted = '/';
  else if (bwdMain > fwdMain) predicted = '\\';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 mr-1">3×3 Input:</span>
          {(['/', '\\', 'X', 'O'] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => selectPreset(ch)}
              className={`pop-interactive rounded-md px-3 py-1 font-mono text-xs font-bold cursor-pointer transition-colors ${
                activeChar === ch
                  ? 'bg-[#c2553a] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {(mode === 'conv-scan' || mode === 'composition') && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoPlay((a) => !a)}
              className="pop-interactive flex items-center gap-1 rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white cursor-pointer"
            >
              {autoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {autoPlay ? 'Pause' : 'Scan Quadrants'}
            </button>
            <button
              type="button"
              onClick={() => {
                setQuadrant(0);
                setAutoPlay(true);
              }}
              aria-label="Reset quadrant"
              className="pop-interactive rounded-md border border-slate-200 bg-white p-1 text-slate-600 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {mode === 'patterns' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['/', '\\', 'X', 'O'] as const).map((ch, idx) => (
            <motion.button
              key={ch}
              type="button"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 440, damping: 16, delay: idx * 0.04 }}
              whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={() => selectPreset(ch)}
              className={`rounded-xl border p-3 text-center transition-colors cursor-pointer hover:shadow-md ${
                activeChar === ch
                  ? 'border-[#c2553a] bg-orange-50/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-lg font-black text-slate-900 mb-2">{ch}</div>
              <div className="inline-grid grid-cols-3 border border-slate-700">
                {PRESETS_3X3[ch].map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`w-7 h-7 flex items-center justify-center border border-slate-300 font-mono text-[10px] font-bold ${
                        val === 1 ? 'bg-red-600 text-white' : 'bg-white text-slate-800'
                      }`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-center gap-5">
            {/* 3x3 Clickable Input with smooth sliding 2x2 scanner */}
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-600 mb-1.5">3×3 Input (Click pixels)</p>
              <div className="relative inline-grid grid-cols-3 border-2 border-slate-800">
                {grid.map((row, r) =>
                  row.map((val, c) => (
                    <motion.button
                      key={`${r}-${c}`}
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.14, y: -2 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 480, damping: 16 }}
                      onClick={() => togglePixel(r, c)}
                      className={`w-11 h-11 flex items-center justify-center border border-slate-400 font-mono text-xs font-bold cursor-pointer transition-colors hover:z-10 ${
                        val === 1 ? 'bg-red-600 text-white' : 'bg-white text-slate-900'
                      }`}
                    >
                      {val}
                    </motion.button>
                  ))
                )}
                {/* Sliding 2x2 frame over 3x3 grid */}
                <motion.div
                  animate={{
                    x: `${qC * 50}%`,
                    y: `${qR * 50}%`,
                  }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '66.6667%', height: '66.6667%' }}
                  className="pointer-events-none absolute top-0 left-0 border-[3px] border-sky-400 shadow-sm"
                />
              </div>
            </div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight className="h-5 w-5 text-sky-500" />
            </motion.div>

            {/* Two 2x2 Feature Maps */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 w-20">Find "/":</span>
                <div className="inline-grid grid-cols-2 border-2 border-slate-700">
                  {mapFwd.map((row, r) =>
                    row.map((v, c) => {
                      const active = r === qR && c === qC;
                      return (
                        <motion.button
                          key={`f-${r}-${c}`}
                          type="button"
                          animate={active && !shouldReduceMotion ? { scale: 1.08 } : { scale: 1 }}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.15, y: -2 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 480, damping: 16 }}
                          onClick={() => {
                            setAutoPlay(false);
                            setQuadrant(r * 2 + c);
                          }}
                          className={`w-10 h-10 flex items-center justify-center border border-slate-300 font-mono text-xs font-bold cursor-pointer hover:z-20 ${
                            v > 0
                              ? 'bg-emerald-100 text-emerald-900'
                              : v < 0
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-white text-slate-700'
                          } ${active ? 'ring-2 ring-sky-500 z-10' : ''}`}
                        >
                          {v}
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 w-20">Find "\":</span>
                <div className="inline-grid grid-cols-2 border-2 border-slate-700">
                  {mapBwd.map((row, r) =>
                    row.map((v, c) => {
                      const active = r === qR && c === qC;
                      return (
                        <motion.button
                          key={`b-${r}-${c}`}
                          type="button"
                          animate={active && !shouldReduceMotion ? { scale: 1.08 } : { scale: 1 }}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.15, y: -2 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 480, damping: 16 }}
                          onClick={() => {
                            setAutoPlay(false);
                            setQuadrant(r * 2 + c);
                          }}
                          className={`w-10 h-10 flex items-center justify-center border border-slate-300 font-mono text-xs font-bold cursor-pointer hover:z-20 ${
                            v > 0
                              ? 'bg-emerald-100 text-emerald-900'
                              : v < 0
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-white text-slate-700'
                          } ${active ? 'ring-2 ring-sky-500 z-10' : ''}`}
                        >
                          {v}
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {mode === 'composition' && (
              <>
                <motion.div
                  animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
                >
                  <ArrowRight className="h-5 w-5 text-[#c2553a]" />
                </motion.div>
                <motion.div
                  key={predicted}
                  initial={shouldReduceMotion ? false : { scale: 0.88, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-xl border-2 border-[#c2553a] bg-orange-50 px-6 py-4 text-center"
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#c2553a]">
                    Prediction
                  </span>
                  <span className="mt-1 block text-4xl font-black text-slate-900 font-mono">
                    {predicted}
                  </span>
                </motion.div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
