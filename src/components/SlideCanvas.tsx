import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Eye,
  Film,
  Globe,
  Layers,
  Link2,
  Minimize2,
  Play,
  Plus,
  RotateCw,
  Sigma,
  Trash2,
  Volume2,
  Youtube,
} from 'lucide-react';
import { CnnSlide, LanguageMode, ViewportSize } from '../types/slide';
import { SLIDE_FORMULA_GUIDES } from '../data/formulaExplanations';
import {
  CustomLinksMap,
  extractYouTubeId,
  getDefaultKeyPointLinks,
  isValidHttpUrl,
  KeyPointLink,
  loadCustomKeyPointLinks,
  saveCustomKeyPointLinks,
} from '../data/keyPointMedia';
import { MathFormula } from './MathFormula';
import {
  ConvolutionSandboxVisual,
  CoverVisual,
  CvProblemsVisual,
  ImageRecognitionVisual,
  LargeImagesVisual,
} from './visuals/EdgeAndVisionVisuals';
import { Intuition2x2Visual, Intuition3x3Visual } from './visuals/IntuitionVisuals';
import {
  CaseStudyAlexNetVisual,
  CaseStudyLeNetVisual,
  Conv1x1Visual,
  Conv3DVolumeVisual,
  DatasetsVisual,
  ExerciseVisual,
  FullyConnectedVisual,
  HierarchicalLearnVisual,
  MaxPoolingVisual,
  OtherCaseStudiesVisual,
  ReferencesVisual,
  SpatialAndPaddingVisual,
  WhyConvolutionsVisual,
} from './visuals/ConvMathAndArchVisuals';

interface SlideCanvasProps {
  slide: CnnSlide;
  totalSlides: number;
  language: LanguageMode;
  viewport: ViewportSize;
  replaySignal: number;
  isPresentationMode: boolean;
  onTogglePresentation: () => void;
  onReplayAnimation: () => void;
  onOpenMiniVideo: () => void;
  onOpenKeyPointVideo?: (pointIndex: number) => void;
  onWatchYouTube?: (videoId: string, title: string, url: string, pointIndex: number) => void;
  onOpenFormulaGuide?: () => void;
  onSelectSlide: (id: number) => void;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  totalSlides,
  language,
  viewport,
  replaySignal,
  isPresentationMode,
  onTogglePresentation,
  onReplayAnimation,
  onOpenMiniVideo,
  onOpenKeyPointVideo,
  onWatchYouTube,
  onOpenFormulaGuide,
  onSelectSlide,
}) => {
  const [showDetailedNotes, setShowDetailedNotes] = useState(true);
  const [showFormulaGuide, setShowFormulaGuide] = useState(true);
  const [customLinksMap, setCustomLinksMap] = useState<CustomLinksMap>(() =>
    loadCustomKeyPointLinks()
  );
  const [addingLinkIdx, setAddingLinkIdx] = useState<number | null>(null);
  const [linkTitleDraft, setLinkTitleDraft] = useState('');
  const [linkUrlDraft, setLinkUrlDraft] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const formulaGuide = SLIDE_FORMULA_GUIDES[slide.id];

  const handleSaveCustomLink = (pointIdx: number) => {
    const trimmedUrl = linkUrlDraft.trim();
    if (!isValidHttpUrl(trimmedUrl)) {
      setLinkError(
        language === 'en'
          ? 'Please enter a valid https:// website or YouTube URL.'
          : 'សូមបញ្ចូល Link ត្រឹមត្រូវ (ចាប់ផ្តើមដោយ https:// ឬ http://)'
      );
      return;
    }
    const ytId = extractYouTubeId(trimmedUrl);
    const title =
      linkTitleDraft.trim() ||
      (ytId ? 'YouTube Reference Video' : 'Web Reference Article');
    const key = `${slide.id}-${pointIdx}`;
    const newLink: KeyPointLink = {
      id: `custom-${Date.now()}`,
      title,
      url: trimmedUrl,
      kind: ytId ? 'youtube' : 'website',
      isCustom: true,
    };
    const nextMap: CustomLinksMap = {
      ...customLinksMap,
      [key]: [...(customLinksMap[key] ?? []), newLink],
    };
    setCustomLinksMap(nextMap);
    saveCustomKeyPointLinks(nextMap);
    setAddingLinkIdx(null);
    setLinkTitleDraft('');
    setLinkUrlDraft('');
    setLinkError(null);
  };

  const handleDeleteCustomLink = (pointIdx: number, linkId: string) => {
    const key = `${slide.id}-${pointIdx}`;
    const nextMap: CustomLinksMap = {
      ...customLinksMap,
      [key]: (customLinksMap[key] ?? []).filter((l) => l.id !== linkId),
    };
    setCustomLinksMap(nextMap);
    saveCustomKeyPointLinks(nextMap);
  };

  const viewportMaxWidth =
    viewport === 'mobile'
      ? 'max-w-[430px]'
      : viewport === 'tablet'
      ? 'max-w-[780px]'
      : viewport === 'desktop'
      ? 'max-w-[1060px]'
      : 'max-w-full';

  const renderInteractiveVisual = () => {
    switch (slide.visualType) {
      case 'cover':
        return <CoverVisual language={language} onJumpSlide={onSelectSlide} />;
      case 'cv-problems':
        return <CvProblemsVisual language={language} replaySignal={replaySignal} />;
      case 'large-images':
        return <LargeImagesVisual language={language} />;
      case 'image-recognition':
        return <ImageRecognitionVisual language={language} />;
      case 'edge-detection-texture':
        return <ConvolutionSandboxVisual mode="texture" replaySignal={replaySignal} />;
      case 'edge-detection-step':
        return <ConvolutionSandboxVisual mode="step" replaySignal={replaySignal} />;
      case 'different-filters':
        return <ConvolutionSandboxVisual mode="filters" replaySignal={replaySignal} />;
      case 'intuition-system':
        return <Intuition2x2Visual mode="system" language={language} replaySignal={replaySignal} />;
      case 'intuition-sum-fail':
        return <Intuition2x2Visual mode="sum-fail" language={language} replaySignal={replaySignal} />;
      case 'intuition-weighted':
        return <Intuition2x2Visual mode="weighted" language={language} replaySignal={replaySignal} />;
      case 'intuition-single-classifier':
        return <Intuition2x2Visual mode="single-classifier" language={language} replaySignal={replaySignal} />;
      case 'intuition-dual-classifiers':
        return <Intuition2x2Visual mode="dual-classifiers" language={language} replaySignal={replaySignal} />;
      case 'intuition-3x3-patterns':
        return <Intuition3x3Visual mode="patterns" replaySignal={replaySignal} />;
      case 'intuition-conv-scan':
        return <Intuition3x3Visual mode="conv-scan" replaySignal={replaySignal} />;
      case 'intuition-composition':
        return <Intuition3x3Visual mode="composition" replaySignal={replaySignal} />;
      case 'conv-3d-volume':
        return <Conv3DVolumeVisual mode="volume" replaySignal={replaySignal} />;
      case 'conv-dot-product':
        return <Conv3DVolumeVisual mode="dot-product" replaySignal={replaySignal} />;
      case 'conv-stacked-maps':
        return <Conv3DVolumeVisual mode="stacked" replaySignal={replaySignal} />;
      case 'conv-sequence':
        return <Conv3DVolumeVisual mode="sequence" replaySignal={replaySignal} />;
      case 'conv-learn-pyramid':
        return <HierarchicalLearnVisual mode="pyramid" language={language} replaySignal={replaySignal} />;
      case 'conv-face-hierarchy':
        return <HierarchicalLearnVisual mode="face" language={language} replaySignal={replaySignal} />;
      case 'spatial-stride':
        return <SpatialAndPaddingVisual mode="stride" replaySignal={replaySignal} />;
      case 'padding':
        return <SpatialAndPaddingVisual mode="padding" replaySignal={replaySignal} />;
      case 'conv-1x1':
        return <Conv1x1Visual replaySignal={replaySignal} />;
      case 'max-pooling':
        return <MaxPoolingVisual replaySignal={replaySignal} />;
      case 'fully-connected':
        return <FullyConnectedVisual replaySignal={replaySignal} />;
      case 'why-convolutions':
        return <WhyConvolutionsVisual language={language} />;
      case 'case-lenet5':
        return <CaseStudyLeNetVisual replaySignal={replaySignal} />;
      case 'case-alexnet':
        return <CaseStudyAlexNetVisual replaySignal={replaySignal} />;
      case 'case-other-nets':
        return <OtherCaseStudiesVisual />;
      case 'image-datasets':
        return <DatasetsVisual replaySignal={replaySignal} />;
      case 'exercise':
        return <ExerciseVisual language={language} />;
      case 'references':
        return <ReferencesVisual />;
      default:
        return null;
    }
  };

  return (
    <div className={`mx-auto w-full transition-all duration-200 ${viewportMaxWidth} space-y-4`}>
      {/* Slide Pagination Header Strip */}
      <div className="rounded-2xl border border-slate-800 bg-[#0b1322] p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-slate-400">Lecture 03</span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-white tabular-nums">
              Slide {slide.id} of {totalSlides}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-sky-400 font-medium">{slide.kicker.en}</span>
          </div>
          <span className="font-mono text-xs text-slate-400 tabular-nums">
            PDF Page #{slide.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 460, damping: 17 }}
            onClick={() => onSelectSlide(Math.max(1, slide.id - 1))}
            disabled={slide.id === 1}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev Slide
          </motion.button>

          <div className="flex flex-1 items-center gap-1 overflow-x-auto py-0.5">
            {Array.from({ length: totalSlides }, (_, i) => i + 1).map((num) => {
              const active = num === slide.id;
              return (
                <motion.button
                  key={num}
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.12 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                  onClick={() => onSelectSlide(num)}
                  className={`h-7 min-w-[28px] px-1.5 rounded-lg text-xs font-semibold tabular-nums transition-colors shrink-0 cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white'
                      : 'bg-[#080e1a] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 460, damping: 17 }}
            onClick={() => onSelectSlide(Math.min(totalSlides, slide.id + 1))}
            disabled={slide.id === totalSlides}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Next Slide <ChevronRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Studio Blueprint Frame */}
      <div className="rounded-2xl border border-slate-800 bg-[#0b1322] p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Studio Module Identity & Action Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Layers className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs sm:text-sm font-semibold text-slate-100 truncate">
                  03_Convolutional_Neural_Networks_CNN.blueprint
                </p>
                <p className="text-[11px] text-slate-400 font-khmer truncate">
                  {language === 'en'
                    ? 'Interactive Deep Learning Blueprint · Convolutional Neural Networks (33 Slides)'
                    : 'មេរៀនទី ០៣ • បណ្តាញសរសៃប្រសាទ Convolutional (៣៣ ទំព័រដាច់ដោយឡែក)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-slate-700/80 bg-[#080e1a] px-2 py-1">
              <button
                type="button"
                onClick={() => onSelectSlide(Math.max(1, slide.id - 1))}
                disabled={slide.id === 1}
                aria-label="Previous slide"
                className="p-1 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="px-2 font-mono text-xs font-semibold text-sky-400 tabular-nums whitespace-nowrap">
                Page {slide.id} of {totalSlides}: Slide {slide.id}
              </span>
              <button
                type="button"
                onClick={() => onSelectSlide(Math.min(totalSlides, slide.id + 1))}
                disabled={slide.id === totalSlides}
                aria-label="Next slide"
                className="p-1 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 460, damping: 17 }}
              onClick={onOpenMiniVideo}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-700/70 bg-emerald-950/60 hover:bg-emerald-900/70 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors cursor-pointer font-khmer whitespace-nowrap"
            >
              <Film className="h-3.5 w-3.5" />
              <span>
                {language === 'en'
                  ? 'Concept Walkthrough (Mini-Video)'
                  : 'វីដេអូខ្លីពន្យល់មេរៀន (Mini-Video)'}
              </span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 460, damping: 17 }}
              onClick={onReplayAnimation}
              className="flex items-center gap-1.5 rounded-xl border border-sky-700/70 bg-sky-950/60 hover:bg-sky-900/70 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors cursor-pointer font-khmer whitespace-nowrap"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>
                {language === 'en'
                  ? 'Replay Animation'
                  : 'ចលនាក្រាហ្វ (Replay Animation)'}
              </span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 460, damping: 17 }}
              onClick={onTogglePresentation}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors cursor-pointer font-khmer whitespace-nowrap"
            >
              {isPresentationMode ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Exit View Mode</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Mode (មើល)</span>
                </>
              )}
            </motion.button>

            <span className="ml-auto text-[11px] font-mono text-slate-400 whitespace-nowrap">
              Live Interactive Canvas (16:9)
            </span>
          </div>
        </div>

        {/* Light Academic Institutional 16:9 Slide Canvas with Smooth Slide Transition */}
        <AnimatePresence mode="wait">
          <motion.article
            key={`${slide.id}-${replaySignal}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-slate-300 bg-white text-slate-900 shadow-lg overflow-hidden"
          >
            {/* Academic Lecture Top Header Bar matching PDF style */}
            <div className="flex items-center justify-between bg-[#8d9a94] px-4 py-2 text-white">
              <span className="text-xs sm:text-sm font-semibold tracking-tight">
                Neural Networks and Deep Learning
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold tabular-nums">
                {slide.id}
              </span>
            </div>

            <div className="p-5 sm:p-7 space-y-5">
              {/* Slide Title & Bilingual Subtitle (Skip redundant header on Slide 1 cover) */}
              {slide.id !== 1 && (
                <header className="space-y-1.5 border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-slate-500">
                    <span>{slide.kicker.en}</span>
                    {(language === 'dual' || language === 'km') && (
                      <span className="font-khmer text-slate-500">{slide.kicker.km}</span>
                    )}
                  </div>

                  {(language === 'dual' || language === 'en') && (
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#c2553a] tracking-tight leading-snug">
                      {slide.title.en}
                    </h2>
                  )}
                  {(language === 'dual' || language === 'km') && (
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 font-khmer leading-relaxed">
                      {slide.title.km}
                    </h3>
                  )}

                  {(language === 'dual' || language === 'en') && (
                    <p className="text-xs sm:text-sm text-slate-600">{slide.subtitle.en}</p>
                  )}
                  {(language === 'dual' || language === 'km') && (
                    <p className="text-xs sm:text-sm text-amber-800/90 font-khmer">
                      {slide.subtitle.km}
                    </p>
                  )}
                </header>
              )}

              {/* Interactive Simulation / Diagram Stage */}
              <div>{renderInteractiveVisual()}</div>

              {/* Key Points & Point-by-Point Explanations */}
              {slide.keyPoints.length > 0 && (
                <section className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#c2553a]" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 font-khmer">
                        {language === 'en'
                          ? 'Key Points & Detailed Explanations'
                          : language === 'km'
                          ? 'ចំណុចសំខាន់ៗ និងការពន្យល់លម្អិតតាមចំណុចនីមួយៗ'
                          : 'Key Points & Detailed Explanations · ការពន្យល់លម្អិតតាមចំណុចនីមួយៗ'}
                      </h4>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 460, damping: 17 }}
                      onClick={() => setShowDetailedNotes((prev) => !prev)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer font-khmer"
                    >
                      {showDetailedNotes ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" />
                          <span>
                            {language === 'en' ? 'Hide Details' : 'លាក់ការពន្យល់លម្អិត'}
                          </span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" />
                          <span>
                            {language === 'en' ? 'Show Details' : 'បង្ហាញការពន្យល់លម្អិត'}
                          </span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {slide.keyPoints.map((pt, idx) => {
                      const linkKey = `${slide.id}-${idx}`;
                      const allLinks = [
                        ...getDefaultKeyPointLinks(slide, idx),
                        ...(customLinksMap[linkKey] ?? []),
                      ];
                      const isAdding = addingLinkIdx === idx;

                      return (
                        <motion.div
                          key={idx}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.01 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 18, delay: idx * 0.03 }}
                          className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4 space-y-2.5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5 flex h-5 w-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-mono font-bold text-white tabular-nums">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <div className="space-y-1 min-w-0">
                                {(language === 'dual' || language === 'en') && (
                                  <p className="text-xs sm:text-[13px] text-slate-900 leading-snug font-semibold">
                                    {pt.en}
                                  </p>
                                )}
                                {(language === 'dual' || language === 'km') && (
                                  <p className="text-xs sm:text-[13px] text-[#9f3f28] leading-relaxed font-semibold font-khmer">
                                    {pt.km}
                                  </p>
                                )}
                              </div>
                            </div>

                            <AnimatePresence initial={false}>
                              {showDetailedNotes && pt.detail && (
                                <motion.div
                                  initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                                  transition={{ duration: 0.16 }}
                                  className="rounded-lg border border-slate-200/90 bg-white px-3 py-2.5 space-y-1.5"
                                >
                                  {(language === 'dual' || language === 'en') && (
                                    <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                                      {pt.detail.en}
                                    </p>
                                  )}
                                  {(language === 'dual' || language === 'km') && (
                                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-khmer">
                                      {pt.detail.km}
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Per-Point Mini-Video (~60s) + Reference Links (Website / YouTube) */}
                          <div className="pt-2 border-t border-slate-200/80 space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {onOpenKeyPointVideo && (
                                <motion.button
                                  type="button"
                                  whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.04 }}
                                  whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                                  transition={{ type: 'spring', stiffness: 460, damping: 17 }}
                                  onClick={() => onOpenKeyPointVideo(idx)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 cursor-pointer font-khmer"
                                >
                                  <Film className="h-3 w-3" />
                                  <Volume2 className="h-3 w-3" />
                                  <span>
                                    {language === 'en'
                                      ? 'Mini-Video (~60s)'
                                      : 'វីដេអូខ្លី (~៦០វិនាទី)'}
                                  </span>
                                </motion.button>
                              )}

                              <motion.button
                                type="button"
                                whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.04 }}
                                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                                transition={{ type: 'spring', stiffness: 460, damping: 17 }}
                                onClick={() => {
                                  setAddingLinkIdx(isAdding ? null : idx);
                                  setLinkTitleDraft('');
                                  setLinkUrlDraft('');
                                  setLinkError(null);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 cursor-pointer font-khmer"
                              >
                                <Plus className="h-3 w-3" />
                                <Link2 className="h-3 w-3" />
                                <span>
                                  {language === 'en' ? 'Add Link' : 'បន្ថែម Link'}
                                </span>
                              </motion.button>
                            </div>

                            {/* Inline Add Link Form */}
                            {isAdding && (
                              <div className="rounded-lg border border-sky-200 bg-white p-2.5 space-y-2 text-xs">
                                <input
                                  type="text"
                                  value={linkTitleDraft}
                                  onChange={(e) => setLinkTitleDraft(e.target.value)}
                                  placeholder={
                                    language === 'en'
                                      ? 'Link title (e.g. CNN Video / Article)'
                                      : 'ចំណងជើង Link (ឧ. វីដេអូ YouTube ឬ គេហទំព័រ)'
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none font-khmer"
                                />
                                <input
                                  type="url"
                                  value={linkUrlDraft}
                                  onChange={(e) => {
                                    setLinkUrlDraft(e.target.value);
                                    if (linkError) setLinkError(null);
                                  }}
                                  placeholder="https://youtube.com/... or https://..."
                                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                                />
                                {linkError && (
                                  <p className="text-[11px] font-semibold text-red-600 font-khmer">
                                    {linkError}
                                  </p>
                                )}
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAddingLinkIdx(null);
                                      setLinkError(null);
                                    }}
                                    className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveCustomLink(idx)}
                                    className="rounded-md bg-sky-600 hover:bg-sky-500 px-2.5 py-1 text-[11px] font-semibold text-white cursor-pointer"
                                  >
                                    Save Link
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Links List */}
                            {allLinks.length > 0 && (
                              <div className="space-y-1">
                                {allLinks.map((lk) => {
                                  const ytId = extractYouTubeId(lk.url);
                                  return (
                                    <div
                                      key={lk.id}
                                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px]"
                                    >
                                      <a
                                        href={lk.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 min-w-0 font-medium text-slate-700 hover:text-sky-700"
                                      >
                                        {ytId || lk.kind === 'youtube' ? (
                                          <Youtube className="h-3.5 w-3.5 shrink-0 text-red-600" />
                                        ) : (
                                          <Globe className="h-3.5 w-3.5 shrink-0 text-sky-600" />
                                        )}
                                        <span className="truncate font-khmer">{lk.title}</span>
                                        <ExternalLink className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                                      </a>

                                      <div className="flex items-center gap-1 shrink-0">
                                        {ytId && onWatchYouTube && (
                                          <button
                                            type="button"
                                            onClick={() => onWatchYouTube(ytId, lk.title, lk.url, idx)}
                                            className="inline-flex items-center gap-1 rounded bg-red-50 hover:bg-red-100 border border-red-200 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 cursor-pointer"
                                          >
                                            <Play className="h-2.5 w-2.5" />
                                            <span>Watch</span>
                                          </button>
                                        )}
                                        {lk.isCustom && (
                                          <button
                                            type="button"
                                            aria-label="Delete link"
                                            onClick={() => handleDeleteCustomLink(idx, lk.id)}
                                            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Formula Callout + Built-in Variable & Meaning Breakdown */}
              {slide.formula && (
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.006 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50/90 to-slate-50 px-5 py-4 space-y-3 hover:border-sky-300 hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-sky-800">
                    <span className="uppercase tracking-wider">
                      {language === 'km'
                        ? 'ទម្រង់គណិតវិទ្យា (Mathematical Formulation)'
                        : 'Mathematical Formulation'}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {formulaGuide && (
                        <motion.button
                          type="button"
                          whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.04 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                          transition={{ type: 'spring', stiffness: 460, damping: 17 }}
                          onClick={() => setShowFormulaGuide((v) => !v)}
                          className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white hover:bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800 cursor-pointer font-khmer"
                        >
                          {showFormulaGuide ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              <span>{language === 'en' ? 'Hide Breakdown' : 'លាក់ការពន្យល់រូបមន្ត'}</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              <span>{language === 'en' ? 'Explain Formula' : 'ពន្យល់រូបមន្ត & អថេរ'}</span>
                            </>
                          )}
                        </motion.button>
                      )}
                      {onOpenFormulaGuide && (
                        <motion.button
                          type="button"
                          whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.04 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                          transition={{ type: 'spring', stiffness: 460, damping: 17 }}
                          onClick={onOpenFormulaGuide}
                          className="inline-flex items-center gap-1 rounded-lg bg-sky-700 hover:bg-sky-600 px-2.5 py-1 text-[11px] font-semibold text-white cursor-pointer font-khmer"
                        >
                          <Sigma className="h-3 w-3" />
                          <span>{language === 'en' ? 'All Core Formulas' : 'មើលរូបមន្តស្នូលទាំង ៦'}</span>
                        </motion.button>
                      )}
                      <span className="font-mono text-sky-700">Eq. ({slide.id})</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-sky-200/80 bg-white px-4 py-2.5 text-slate-900 overflow-x-auto">
                    <MathFormula
                      latex={slide.formula.latex}
                      displayMode
                      className="text-sm sm:text-base"
                    />
                    {slide.formula.derivationLatex && (
                      <div className="mt-2 pt-2 border-t border-slate-100 text-slate-700">
                        <MathFormula
                          latex={slide.formula.derivationLatex}
                          displayMode
                          className="text-xs sm:text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 text-xs text-slate-700">
                    {(language === 'dual' || language === 'en') && (
                      <p className="font-medium">{slide.formula.caption.en}</p>
                    )}
                    {(language === 'dual' || language === 'km') && (
                      <p className="font-khmer text-sky-900 font-medium">{slide.formula.caption.km}</p>
                    )}
                  </div>

                  {/* Variable-by-variable & plain-language formula breakdown */}
                  <AnimatePresence initial={false}>
                    {showFormulaGuide && formulaGuide && (
                      <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.16 }}
                        className="rounded-lg border border-sky-200 bg-white/95 p-3.5 space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {formulaGuide.variables.map((v) => (
                            <div
                              key={v.symbol}
                              className="flex items-start gap-2 rounded-md border border-slate-200/80 bg-slate-50/70 px-2.5 py-1.5 text-xs"
                            >
                              <code className="shrink-0 font-mono font-bold text-[#c2553a] min-w-[48px]">
                                {v.symbol}
                              </code>
                              <div className="space-y-0.5 min-w-0">
                                {(language === 'dual' || language === 'en') && (
                                  <p className="text-slate-800 font-medium leading-snug">
                                    {v.meaning.en}
                                  </p>
                                )}
                                {(language === 'dual' || language === 'km') && (
                                  <p className="text-slate-600 font-khmer leading-snug">
                                    {v.meaning.km}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1 text-xs border-t border-slate-100 pt-2">
                          {(language === 'dual' || language === 'en') && (
                            <p className="text-slate-700 leading-relaxed">
                              {formulaGuide.explanation.en}
                            </p>
                          )}
                          {(language === 'dual' || language === 'km') && (
                            <p className="text-slate-700 font-khmer leading-relaxed">
                              {formulaGuide.explanation.km}
                            </p>
                          )}
                          {formulaGuide.example && (
                            <div className="mt-1.5 rounded-md border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium text-emerald-900 font-khmer">
                              {language === 'km'
                                ? formulaGuide.example.km
                                : formulaGuide.example.en}
                              {language === 'dual' && (
                                <span className="block text-emerald-800 mt-0.5">
                                  {formulaGuide.example.km}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Citation Footer if present */}
              {slide.citation && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  {slide.citation}
                </p>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
};
