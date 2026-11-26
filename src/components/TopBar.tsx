import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Code2,
  Columns2,
  Download,
  FileText,
  Globe,
  Layers,
  LayoutGrid,
  Maximize2,
  Monitor,
  Sigma,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { LanguageMode, ViewportSize, WorkspaceViewMode } from '../types/slide';

interface TopBarProps {
  viewMode: WorkspaceViewMode;
  onViewModeChange: (mode: WorkspaceViewMode) => void;
  viewport: ViewportSize;
  onViewportChange: (vp: ViewportSize) => void;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  onExportReport: () => void;
  onOpenFormulaGuide: () => void;
}

const SPRING_BOUNCE = { type: 'spring' as const, stiffness: 480, damping: 17 };

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onViewModeChange,
  viewport,
  onViewportChange,
  language,
  onLanguageChange,
  onExportReport,
  onOpenFormulaGuide,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="border-b border-slate-800/90 bg-[#080e1a] px-4 py-3 sm:px-6">
      {/* Row 1: Studio Brand + View Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: -4 }}
            transition={SPRING_BOUNCE}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/40 bg-sky-500/10 text-sky-400"
          >
            <Layers className="h-5 w-5" />
          </motion.div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap">
                CNN Interactive Blueprints
              </h1>
              <span className="text-xs font-medium text-amber-400 whitespace-nowrap">
                Dr. Valy Dona
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate font-khmer">
              {language === 'en'
                ? 'Lecture 03: Convolutional Neural Networks · 33 Interactive Slides'
                : '០៣. បណ្តាញសរសៃប្រសាទ Convolutional (CNN) · ៣៣ ស្លាយអន្តរកម្ម'}
            </p>
          </div>
        </div>

        {/* Workspace Mode Segmented Bar */}
        <nav
          aria-label="Workspace View Modes"
          className="flex items-center gap-1 rounded-xl border border-slate-800 bg-[#0b1322] p-1"
        >
          {(
            [
              { id: 'canvas', label: 'Canvas', icon: LayoutGrid },
              { id: 'split', label: 'Split View', icon: Columns2 },
              { id: 'specs', label: 'Specs', icon: Code2 },
              { id: 'pdf', label: 'PDF', icon: FileText },
            ] as const
          ).map(({ id, label, icon: Icon }) => {
            const active = viewMode === id;
            return (
              <motion.button
                key={id}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={SPRING_BOUNCE}
                onClick={() => onViewModeChange(id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Row 2: Viewport Size, Language Switcher, Export */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {/* Viewport Size Switcher */}
        <div
          role="group"
          aria-label="Canvas Viewport Size"
          className="flex items-center gap-1 rounded-xl border border-slate-800 bg-[#0b1322] p-1"
        >
          {(
            [
              { id: 'full', label: 'ទំហំពេញ (Full)', icon: Maximize2 },
              { id: 'desktop', label: 'Desktop', icon: Monitor },
              { id: 'tablet', label: 'Tablet', icon: Tablet },
              { id: 'mobile', label: 'Mobile', icon: Smartphone },
            ] as const
          ).map(({ id, label, icon: Icon }) => {
            const active = viewport === id;
            return (
              <motion.button
                key={id}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={SPRING_BOUNCE}
                onClick={() => onViewportChange(id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer font-khmer ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Language Toggle */}
        <div
          role="group"
          aria-label="Language Mode"
          className="flex items-center gap-1 rounded-xl border border-slate-800 bg-[#0b1322] p-1"
        >
          <span className="px-2 text-slate-400" aria-hidden="true">
            <Globe className="h-3.5 w-3.5" />
          </span>
          {(
            [
              { id: 'dual', label: 'Dual' },
              { id: 'en', label: 'EN' },
              { id: 'km', label: 'ខ្មែរ' },
            ] as const
          ).map(({ id, label }) => {
            const active = language === id;
            return (
              <motion.button
                key={id}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={SPRING_BOUNCE}
                onClick={() => onLanguageChange(id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer font-khmer ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Formulas Guide */}
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          transition={SPRING_BOUNCE}
          onClick={onOpenFormulaGuide}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 px-3.5 py-2 text-xs font-semibold text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-khmer"
        >
          <Sigma className="h-3.5 w-3.5" />
          <span>{language === 'en' ? 'Formulas Guide' : 'ពន្យល់រូបមន្ត (Formulas)'}</span>
        </motion.button>

        {/* Export Study Report */}
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          transition={SPRING_BOUNCE}
          onClick={onExportReport}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Report</span>
        </motion.button>
      </div>
    </header>
  );
};
