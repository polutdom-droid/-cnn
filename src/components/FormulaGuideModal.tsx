import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpen, Sigma, X } from 'lucide-react';
import { CORE_FORMULA_CARDS } from '../data/formulaExplanations';
import { LanguageMode } from '../types/slide';
import { MathFormula } from './MathFormula';

interface FormulaGuideModalProps {
  language: LanguageMode;
  isOpen: boolean;
  onClose: () => void;
  onJumpToSlide: (slideId: number) => void;
}

const SPRING_BOUNCE = { type: 'spring' as const, stiffness: 450, damping: 18 };

export const FormulaGuideModal: React.FC<FormulaGuideModalProps> = ({
  language,
  isOpen,
  onClose,
  onJumpToSlide,
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="CNN Formulas Guide"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-[#0b1322] shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/35 bg-sky-500/15 text-sky-400">
                  <Sigma className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate font-khmer">
                    {language === 'en'
                      ? 'Core CNN Mathematical Formulas & Variable Guide'
                      : 'មគ្គុទ្ទេសក៍ពន្យល់រូបមន្ត CNN សំខាន់ៗទាំង ៦'}
                  </h2>
                  <p className="text-xs text-slate-400 font-khmer truncate">
                    {language === 'en'
                      ? 'Clear variable meanings, intuition, and worked examples across the lecture'
                      : 'ការបកស្រាយអត្ថន័យអថេរនីមួយៗ របៀបគណនា និងឧទាហរណ៍ជាក់ស្តែង (EN / ខ្មែរ)'}
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: 90 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                transition={SPRING_BOUNCE}
                onClick={onClose}
                aria-label="Close Formula Guide"
                className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Cards Grid */}
            <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
              {CORE_FORMULA_CARDS.map((card) => (
                <motion.article
                  key={card.id}
                  whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.01 }}
                  transition={SPRING_BOUNCE}
                  className="rounded-xl border border-slate-800 bg-[#070d18] p-4 space-y-3 flex flex-col justify-between hover:border-sky-500/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {(language === 'dual' || language === 'en') && (
                          <h3 className="text-sm font-bold text-slate-100">{card.title.en}</h3>
                        )}
                        {(language === 'dual' || language === 'km') && (
                          <p className="text-xs font-semibold text-amber-400 font-khmer mt-0.5">
                            {card.title.km}
                          </p>
                        )}
                      </div>
                      <motion.button
                        type="button"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                        transition={SPRING_BOUNCE}
                        onClick={() => {
                          onJumpToSlide(card.slideId);
                          onClose();
                        }}
                        className="shrink-0 flex items-center gap-1 rounded-lg border border-sky-500/35 bg-sky-500/15 hover:bg-sky-500/25 px-2.5 py-1 text-[11px] font-semibold text-sky-300 cursor-pointer"
                      >
                        <span>Slide {card.slideId}</span>
                        <ArrowRight className="h-3 w-3" />
                      </motion.button>
                    </div>

                    {/* KaTeX Equation Box */}
                    <div className="rounded-lg border border-slate-800 bg-[#0b1322] px-3.5 py-2.5 text-sky-200 overflow-x-auto">
                      <MathFormula latex={card.latex} displayMode className="text-sm" />
                    </div>

                    {/* Variables Glossary */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 font-khmer">
                        <BookOpen className="h-3.5 w-3.5 text-sky-400" />
                        <span>
                          {language === 'en'
                            ? 'Variables Meaning'
                            : 'អត្ថន័យអថេរក្នុងរូបមន្ត'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {card.variables.map((v) => (
                          <div
                            key={v.symbol}
                            className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-[#0b1322]/70 px-2.5 py-1.5 text-xs"
                          >
                            <code className="shrink-0 font-mono font-bold text-amber-300 min-w-[54px]">
                              {v.symbol}
                            </code>
                            <div className="space-y-0.5 min-w-0">
                              {(language === 'dual' || language === 'en') && (
                                <p className="text-slate-200 leading-snug">{v.meaning.en}</p>
                              )}
                              {(language === 'dual' || language === 'km') && (
                                <p className="text-sky-200/90 font-khmer leading-snug">
                                  {v.meaning.km}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Explanation + Example */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/90 text-xs">
                    {(language === 'dual' || language === 'en') && (
                      <p className="text-slate-300 leading-relaxed">{card.explanation.en}</p>
                    )}
                    {(language === 'dual' || language === 'km') && (
                      <p className="text-slate-200 font-khmer leading-relaxed">
                        {card.explanation.km}
                      </p>
                    )}
                    <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/25 px-3 py-2 font-khmer text-emerald-300 text-[11px] sm:text-xs">
                      {language === 'km' ? card.example.km : card.example.en}
                      {language === 'dual' && (
                        <div className="mt-0.5 text-emerald-200/85">{card.example.km}</div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
