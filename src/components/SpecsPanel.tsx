import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Copy, Cpu, Sigma } from 'lucide-react';
import { CnnSlide, LanguageMode } from '../types/slide';
import { SLIDE_FORMULA_GUIDES } from '../data/formulaExplanations';
import { MathFormula } from './MathFormula';

interface SpecsPanelProps {
  slide: CnnSlide;
  language: LanguageMode;
}

const SPRING_BOUNCE = { type: 'spring' as const, stiffness: 440, damping: 18 };

export const SpecsPanel: React.FC<SpecsPanelProps> = ({ slide, language }) => {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const formulaGuide = SLIDE_FORMULA_GUIDES[slide.id];

  const handleCopy = () => {
    navigator.clipboard.writeText(slide.specs.pytorchSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Tensor & Operation Summary */}
      <div className="rounded-2xl border border-slate-800 bg-[#0b1322] p-5">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Slide {slide.id} · Architecture & Tensor Specifications
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {slide.specs.operation}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
            transition={SPRING_BOUNCE}
            className="rounded-xl border border-slate-800 bg-[#070d18] p-3.5 hover:border-sky-500/40"
          >
            <span className="text-[11px] font-medium text-slate-400">Input Tensor</span>
            <p className="mt-1 font-mono text-sm font-semibold text-sky-300 tabular-nums">
              {slide.specs.inputTensor}
            </p>
          </motion.div>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
            transition={SPRING_BOUNCE}
            className="rounded-xl border border-slate-800 bg-[#070d18] p-3.5 hover:border-emerald-500/40"
          >
            <span className="text-[11px] font-medium text-slate-400">Output Tensor</span>
            <p className="mt-1 font-mono text-sm font-semibold text-emerald-300 tabular-nums">
              {slide.specs.outputTensor}
            </p>
          </motion.div>
        </div>

        {slide.specs.metrics.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slide.specs.metrics.map((m, idx) => (
              <motion.div
                key={idx}
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.03 }}
                transition={SPRING_BOUNCE}
                className="rounded-xl border border-slate-800/80 bg-[#080f1d] p-3 hover:border-slate-600"
              >
                <span className="text-[11px] text-slate-400 font-khmer block truncate">
                  {language === 'km' ? m.label.km : m.label.en}
                </span>
                <span className="mt-1 block font-mono text-base font-bold text-slate-100 tabular-nums">
                  {m.value}
                </span>
                {m.detail && (
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    {m.detail}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Formula Box */}
      {slide.formula && (
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
          transition={SPRING_BOUNCE}
          className="rounded-2xl border border-slate-800 bg-[#0b1322] p-5 hover:border-amber-500/40"
        >
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-amber-400 mb-2.5">
            <div className="flex items-center gap-2">
              <Sigma className="h-4 w-4" />
              <span>Mathematical Formulation</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">Eq. ({slide.id})</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#070d18] px-4 py-3 text-sky-200 overflow-x-auto space-y-2">
            <MathFormula latex={slide.formula.latex} displayMode className="text-sm sm:text-base" />
            {slide.formula.derivationLatex && (
              <div className="border-t border-slate-800/80 pt-2 text-emerald-300">
                <MathFormula
                  latex={slide.formula.derivationLatex}
                  displayMode
                  className="text-xs sm:text-sm"
                />
              </div>
            )}
          </div>
          {(language === 'dual' || language === 'en') && (
            <p className="mt-2.5 text-xs text-slate-300">{slide.formula.caption.en}</p>
          )}
          {(language === 'dual' || language === 'km') && (
            <p className="mt-1 text-xs text-amber-300/90 font-khmer">
              {slide.formula.caption.km}
            </p>
          )}
          {formulaGuide && (
            <div className="mt-3 rounded-xl border border-slate-800 bg-[#070d18] p-3 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {formulaGuide.variables.map((v) => (
                  <div
                    key={v.symbol}
                    className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-[#0b1322] px-2.5 py-1.5"
                  >
                    <code className="shrink-0 font-mono font-bold text-amber-300">
                      {v.symbol}
                    </code>
                    <span className="text-slate-300 font-khmer leading-snug">
                      {language === 'km' ? v.meaning.km : v.meaning.en}
                      {language === 'dual' && (
                        <span className="block text-[11px] text-sky-300/90 mt-0.5">
                          {v.meaning.km}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed font-khmer pt-1">
                {language === 'km'
                  ? formulaGuide.explanation.km
                  : formulaGuide.explanation.en}
                {language === 'dual' && (
                  <span className="block text-sky-200/90 mt-1">
                    {formulaGuide.explanation.km}
                  </span>
                )}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Bilingual Notes & Detailed Explanations */}
      <div className="rounded-2xl border border-slate-800 bg-[#0b1322] p-5 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-khmer">
          {language === 'km'
            ? 'ចំណុចសំខាន់ៗ និងការពន្យល់លម្អិតតាមចំណុច'
            : 'Key Takeaways & Detailed Explanations (EN / ខ្មែរ)'}
        </h4>
        <ul className="space-y-3">
          {slide.keyPoints.map((pt, i) => (
            <motion.li
              key={i}
              whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
              transition={SPRING_BOUNCE}
              className="rounded-xl border border-slate-800/90 bg-[#070d18] p-3.5 text-xs space-y-2 hover:border-slate-700"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-6 shrink-0 items-center justify-center rounded-md bg-sky-950 border border-sky-800/80 text-[10px] font-mono font-bold text-sky-300 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="space-y-1 min-w-0">
                  {(language === 'dual' || language === 'en') && (
                    <p className="text-slate-100 font-semibold leading-relaxed">{pt.en}</p>
                  )}
                  {(language === 'dual' || language === 'km') && (
                    <p className="text-amber-300 font-medium leading-relaxed font-khmer">
                      {pt.km}
                    </p>
                  )}
                </div>
              </div>
              {pt.detail && (
                <div className="rounded-lg border border-slate-800/80 bg-[#0b1322]/90 px-3 py-2 space-y-1">
                  {(language === 'dual' || language === 'en') && (
                    <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                      {pt.detail.en}
                    </p>
                  )}
                  {(language === 'dual' || language === 'km') && (
                    <p className="text-[11px] sm:text-xs text-sky-200/90 leading-relaxed font-khmer">
                      {pt.detail.km}
                    </p>
                  )}
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* PyTorch Reference Code */}
      <div className="rounded-2xl border border-slate-800 bg-[#0b1322] overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
          <span className="text-xs font-mono text-slate-300">
            PyTorch Reference Snippet
          </span>
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            transition={SPRING_BOUNCE}
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy
              </>
            )}
          </motion.button>
        </div>
        <pre className="p-4 text-xs font-mono text-emerald-300/95 overflow-x-auto leading-relaxed bg-[#060b14]">
          <code>{slide.specs.pytorchSnippet}</code>
        </pre>
      </div>
    </div>
  );
};
