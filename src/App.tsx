import { useEffect, useMemo, useState } from 'react';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideSidebar } from './components/SlideSidebar';
import { TopBar } from './components/TopBar';
import { SpecsPanel } from './components/SpecsPanel';
import { PdfViewerPanel } from './components/PdfViewerPanel';
import { MiniVideoModal } from './components/MiniVideoModal';
import { ExportModal } from './components/ExportModal';
import { FormulaGuideModal } from './components/FormulaGuideModal';
import { YouTubeEmbedModal } from './components/YouTubeEmbedModal';
import { SLIDES_DATA } from './data/slidesData';
import {
  LanguageMode,
  SlideCategory,
  ViewportSize,
  WorkspaceViewMode,
} from './types/slide';

export default function App() {
  const [activeSlideId, setActiveSlideId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>('canvas');
  const [viewport, setViewport] = useState<ViewportSize>('full');
  const [language, setLanguage] = useState<LanguageMode>('dual');
  const [selectedCategory, setSelectedCategory] = useState<SlideCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [replaySignal, setReplaySignal] = useState<number>(0);
  const [isMiniVideoOpen, setIsMiniVideoOpen] = useState<boolean>(false);
  const [miniVideoKeyPointIndex, setMiniVideoKeyPointIndex] = useState<number | null>(null);
  const [activeYouTube, setActiveYouTube] = useState<{
    videoId: string;
    title: string;
    url: string;
    pointIndex: number;
  } | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isFormulaGuideOpen, setIsFormulaGuideOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  const filteredSlides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SLIDES_DATA.filter((slide) => {
      if (selectedCategory !== 'all' && slide.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        slide.id.toString() === q ||
        slide.title.en.toLowerCase().includes(q) ||
        slide.title.km.toLowerCase().includes(q) ||
        slide.subtitle.en.toLowerCase().includes(q) ||
        slide.subtitle.km.toLowerCase().includes(q) ||
        slide.kicker.en.toLowerCase().includes(q) ||
        (slide.formula?.expression.toLowerCase().includes(q) ?? false) ||
        slide.keyPoints.some(
          (kp) =>
            kp.en.toLowerCase().includes(q) || kp.km.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedCategory, searchQuery]);

  const activeSlide =
    SLIDES_DATA.find((s) => s.id === activeSlideId) ?? SLIDES_DATA[0];

  // Keyboard Left/Right Slide Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (isMiniVideoOpen || isExportModalOpen || isFormulaGuideOpen || activeYouTube !== null) return;

      if (e.key === 'ArrowRight') {
        setActiveSlideId((prev) => Math.min(SLIDES_DATA.length, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveSlideId((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'Escape' && isPresentationMode) {
        setIsPresentationMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMiniVideoOpen, isExportModalOpen, isFormulaGuideOpen, activeYouTube, isPresentationMode]);

  const handleSelectSlide = (id: number) => {
    setActiveSlideId(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060b14] text-slate-100">
      {!isPresentationMode && (
        <TopBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          viewport={viewport}
          onViewportChange={setViewport}
          language={language}
          onLanguageChange={setLanguage}
          onExportReport={() => setIsExportModalOpen(true)}
          onOpenFormulaGuide={() => setIsFormulaGuideOpen(true)}
        />
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        {!isPresentationMode && (
          <SlideSidebar
            slides={filteredSlides}
            totalCount={SLIDES_DATA.length}
            activeSlideId={activeSlide.id}
            onSelectSlide={handleSelectSlide}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            language={language}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          />
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto">
          {viewMode === 'canvas' && (
            <SlideCanvas
              slide={activeSlide}
              totalSlides={SLIDES_DATA.length}
              language={language}
              viewport={viewport}
              replaySignal={replaySignal}
              isPresentationMode={isPresentationMode}
              onTogglePresentation={() => setIsPresentationMode((p) => !p)}
              onReplayAnimation={() => setReplaySignal((r) => r + 1)}
              onOpenMiniVideo={() => {
                setMiniVideoKeyPointIndex(null);
                setIsMiniVideoOpen(true);
              }}
              onOpenKeyPointVideo={(pointIdx) => {
                setMiniVideoKeyPointIndex(pointIdx);
                setIsMiniVideoOpen(true);
              }}
              onWatchYouTube={(videoId, title, url, pointIndex) =>
                setActiveYouTube({ videoId, title, url, pointIndex })
              }
              onOpenFormulaGuide={() => setIsFormulaGuideOpen(true)}
              onSelectSlide={handleSelectSlide}
            />
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              <div className="xl:col-span-7">
                <SlideCanvas
                  slide={activeSlide}
                  totalSlides={SLIDES_DATA.length}
                  language={language}
                  viewport="full"
                  replaySignal={replaySignal}
                  isPresentationMode={isPresentationMode}
                  onTogglePresentation={() => setIsPresentationMode((p) => !p)}
                  onReplayAnimation={() => setReplaySignal((r) => r + 1)}
                  onOpenMiniVideo={() => {
                    setMiniVideoKeyPointIndex(null);
                    setIsMiniVideoOpen(true);
                  }}
                  onOpenKeyPointVideo={(pointIdx) => {
                    setMiniVideoKeyPointIndex(pointIdx);
                    setIsMiniVideoOpen(true);
                  }}
                  onWatchYouTube={(videoId, title, url, pointIndex) =>
                    setActiveYouTube({ videoId, title, url, pointIndex })
                  }
                  onOpenFormulaGuide={() => setIsFormulaGuideOpen(true)}
                  onSelectSlide={handleSelectSlide}
                />
              </div>
              <div className="xl:col-span-5 space-y-5">
                <SpecsPanel slide={activeSlide} language={language} />
                <PdfViewerPanel slideId={activeSlide.id} />
              </div>
            </div>
          )}

          {viewMode === 'specs' && (
            <div className="mx-auto max-w-4xl space-y-5">
              <SpecsPanel slide={activeSlide} language={language} />
            </div>
          )}

          {viewMode === 'pdf' && (
            <div className="mx-auto max-w-5xl">
              <PdfViewerPanel slideId={activeSlide.id} />
            </div>
          )}
        </main>
      </div>

      <MiniVideoModal
        slide={activeSlide}
        language={language}
        isOpen={isMiniVideoOpen}
        keyPointIndex={miniVideoKeyPointIndex}
        onClose={() => setIsMiniVideoOpen(false)}
      />

      <YouTubeEmbedModal
        videoId={activeYouTube?.videoId ?? null}
        title={activeYouTube?.title ?? ''}
        originalUrl={activeYouTube?.url ?? ''}
        onSwitchToInAppVideo={
          activeYouTube
            ? () => {
                setMiniVideoKeyPointIndex(activeYouTube.pointIndex);
                setIsMiniVideoOpen(true);
              }
            : undefined
        }
        onClose={() => setActiveYouTube(null)}
      />

      <ExportModal
        slides={SLIDES_DATA}
        language={language}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <FormulaGuideModal
        language={language}
        isOpen={isFormulaGuideOpen}
        onClose={() => setIsFormulaGuideOpen(false)}
        onJumpToSlide={handleSelectSlide}
      />
    </div>
  );
}
