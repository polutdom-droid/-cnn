import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight, PanelLeftClose, PanelLeftOpen, Search, X } from 'lucide-react';
import { CATEGORIES } from '../data/slidesData';
import { CnnSlide, LanguageMode, SlideCategory } from '../types/slide';

interface SlideSidebarProps {
  slides: CnnSlide[];
  totalCount: number;
  activeSlideId: number;
  onSelectSlide: (id: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: SlideCategory;
  onCategoryChange: (cat: SlideCategory) => void;
  language: LanguageMode;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SPRING_BOUNCE = { type: 'spring' as const, stiffness: 460, damping: 18 };

export const SlideSidebar: React.FC<SlideSidebarProps> = ({
  slides,
  totalCount,
  activeSlideId,
  onSelectSlide,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  language,
  collapsed,
  onToggleCollapse,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (collapsed) {
    return (
      <aside className="flex flex-col items-center border-r border-slate-800/90 bg-[#080e1a] py-4 px-2 w-14 shrink-0">
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
          transition={SPRING_BOUNCE}
          onClick={onToggleCollapse}
          title="Expand Slides Sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/70 text-slate-300 hover:text-white hover:border-sky-500 transition-colors cursor-pointer"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </motion.button>
        <div className="mt-4 flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-180px)] w-full items-center">
          {slides.map((s) => {
            const active = s.id === activeSlideId;
            return (
              <motion.button
                key={s.id}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.1, y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                transition={SPRING_BOUNCE}
                onClick={() => onSelectSlide(s.id)}
                title={`${s.id}. ${s.title.en}`}
                className={`h-8 w-8 rounded-lg text-xs font-semibold tabular-nums transition-colors shrink-0 cursor-pointer ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {s.id}
              </motion.button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col border-r border-slate-800/90 bg-[#080e1a] w-full lg:w-[330px] xl:w-[350px] shrink-0 lg:h-[calc(100vh-110px)] lg:sticky lg:top-0">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold tracking-wide text-slate-200 truncate font-khmer">
            {language === 'en' ? 'ALL 33 SLIDES' : 'បញ្ជីស្លាយទាំង ៣៣ (SLIDES)'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono tabular-nums text-sky-400">
            {slides.length} / {totalCount}
          </span>
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            transition={SPRING_BOUNCE}
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Search + Category Filters */}
      <div className="p-3.5 space-y-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search slides, formulas, topics...'
                : 'ស្វែងរកស្លាយ, រូបមន្ត, ប្រធានបទ...'
            }
            className="w-full rounded-xl border border-slate-800 bg-[#0c1424] pl-9 pr-8 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none font-khmer"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={SPRING_BOUNCE}
                onClick={() => onCategoryChange(cat.id)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer font-khmer ${
                  active
                    ? 'border-sky-500 bg-sky-600 text-white'
                    : 'border-slate-800 bg-[#0d1628] text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {language === 'km' ? cat.label.km : cat.label.en}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Slide List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[380px] lg:max-h-none">
        {slides.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0c1424] p-5 text-center">
            <p className="text-xs text-slate-400 font-khmer">
              {language === 'en'
                ? 'No slides match your search.'
                : 'មិនមានស្លាយដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។'}
            </p>
          </div>
        ) : (
          slides.map((slide) => {
            const active = slide.id === activeSlideId;
            return (
              <motion.button
                key={slide.id}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={SPRING_BOUNCE}
                onClick={() => onSelectSlide(slide.id)}
                className={`w-full text-left rounded-xl border p-3 transition-colors cursor-pointer ${
                  active
                    ? 'border-sky-500 bg-[#0f1f38] shadow-sm'
                    : 'border-slate-800/80 bg-[#0b1322] hover:border-slate-700 hover:bg-[#0f192d]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums ${
                      active
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {slide.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 truncate">
                        {slide.kicker.en}
                      </span>
                      {active && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-sky-400 shrink-0">
                          ACTIVE <ChevronRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>

                    {(language === 'dual' || language === 'en') && (
                      <p className="mt-1 text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                        {slide.title.en}
                      </p>
                    )}
                    {(language === 'dual' || language === 'km') && (
                      <p className="mt-1 text-[11px] font-medium text-amber-400/95 line-clamp-2 leading-relaxed font-khmer">
                        {slide.title.km}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </aside>
  );
};
