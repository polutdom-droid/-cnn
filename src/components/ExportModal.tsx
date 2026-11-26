import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileDown,
  FileSpreadsheet,
  FileText,
  Globe,
  Layers,
  Loader2,
  Presentation,
  X,
} from 'lucide-react';
import { CnnSlide, LanguageMode } from '../types/slide';
import {
  downloadOriginalPdf,
  exportEditablePptx,
  exportEditableWebSlidesHtml,
  exportExactFontPptx,
  generateFormulasLatex,
  generateMarkdownBlueprint,
  generateSlidesCsv,
  triggerFileDownload,
} from '../utils/exportReport';

interface ExportModalProps {
  slides: CnnSlide[];
  language: LanguageMode;
  isOpen: boolean;
  onClose: () => void;
}

type PreviewTab = 'markdown' | 'csv' | 'latex';
type BusyFormat = 'editable-pptx' | 'exact-pptx' | null;

const SPRING_BOUNCE = { type: 'spring' as const, stiffness: 460, damping: 18 };

export const ExportModal: React.FC<ExportModalProps> = ({
  slides,
  language,
  isOpen,
  onClose,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<PreviewTab>('markdown');
  const [busyFormat, setBusyFormat] = useState<BusyFormat>(null);
  const [progressText, setProgressText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const markdownContent = useMemo(
    () => generateMarkdownBlueprint(slides),
    [slides]
  );
  const csvContent = useMemo(() => generateSlidesCsv(slides), [slides]);
  const latexContent = useMemo(() => generateFormulasLatex(slides), [slides]);

  const activeContent =
    activeTab === 'markdown'
      ? markdownContent
      : activeTab === 'csv'
      ? csvContent
      : latexContent;

  const activeFileMeta =
    activeTab === 'markdown'
      ? { filename: '03_CNN_33_Slides_Blueprint.md', mime: 'text/markdown;charset=utf-8' }
      : activeTab === 'csv'
      ? { filename: '03_CNN_Architecture_Dataset.csv', mime: 'text/csv;charset=utf-8' }
      : { filename: '03_CNN_Mathematical_Formulas.tex', mime: 'text/plain;charset=utf-8' };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setErrorMsg('Unable to copy to clipboard in this browser.');
    }
  };

  const handleEditablePptx = async () => {
    if (busyFormat) return;
    setErrorMsg(null);
    setBusyFormat('editable-pptx');
    setProgressText('Building editable .pptx...');
    try {
      await exportEditablePptx(slides, language);
    } catch {
      setErrorMsg('Failed to generate editable PowerPoint file.');
    } finally {
      setBusyFormat(null);
      setProgressText('');
    }
  };

  const handleExactPptx = async () => {
    if (busyFormat) return;
    setErrorMsg(null);
    setBusyFormat('exact-pptx');
    setProgressText(`Rendering 0/${slides.length}...`);
    try {
      await exportExactFontPptx(slides, language, (done, total) => {
        setProgressText(`Rendering ${done}/${total}...`);
      });
    } catch {
      setErrorMsg('Failed to render exact-font locked PowerPoint file.');
    } finally {
      setBusyFormat(null);
      setProgressText('');
    }
  };

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
          aria-label="Export CNN Blueprint and Presentation Deck"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-[#0b1322] shadow-2xl overflow-hidden my-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/15 text-emerald-400">
                  <Download className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate">
                    Export CNN Blueprint &amp; Presentation Deck
                  </h2>
                  <p className="text-xs text-slate-400 font-khmer truncate">
                    ទាញយកឯកសារបទបង្ហាញ ស្លាយ និងរូបមន្តទាំង {slides.length} ទំព័រ (English &amp; ភាសាខ្មែរ)
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: 90 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                transition={SPRING_BOUNCE}
                onClick={onClose}
                aria-label="Close Export Modal"
                className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              {/* Section 1: Slide Deck Formats */}
              <div className="rounded-xl border border-slate-800 bg-[#070d18] p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 font-khmer">
                  <Presentation className="h-4 w-4 shrink-0" />
                  <span>
                    Choose Your Slide Format (ជ្រើសរើសទម្រង់ស្លាយ៖ អាចកែអក្សរបាន ឬ ចាក់សោ Font ១០០%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Card 1: Editable PowerPoint */}
                  <motion.button
                    type="button"
                    disabled={busyFormat !== null}
                    whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={SPRING_BOUNCE}
                    onClick={handleEditablePptx}
                    className="flex flex-col justify-between rounded-xl border border-amber-500/35 bg-amber-950/20 hover:bg-amber-950/35 p-4 text-left transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-bold tracking-wide text-amber-400">
                        <span>EDITABLE .PPTX</span>
                        <Presentation className="h-4 w-4 shrink-0" />
                      </div>
                      <h3 className="mt-2.5 text-sm font-bold text-slate-100 leading-snug">
                        1. Editable PowerPoint + Khmer Font XML (.pptx)
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-amber-100/80 font-khmer">
                        អាចចុចកែអក្សរខ្មែរ/អង់គ្លេសបានគ្រប់ប្រអប់ក្នុង PowerPoint + កំណត់ Font ដើម (Kantumruy Pro &amp; Plus Jakarta) ក្នុងកូដ XML
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                      {busyFormat === 'editable-pptx' ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{progressText}</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Editable .pptx</span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Card 2: Exact-Font Locked PowerPoint */}
                  <motion.button
                    type="button"
                    disabled={busyFormat !== null}
                    whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={SPRING_BOUNCE}
                    onClick={handleExactPptx}
                    className="flex flex-col justify-between rounded-xl border border-violet-500/35 bg-violet-950/25 hover:bg-violet-950/40 p-4 text-left transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-bold tracking-wide text-violet-300">
                        <span>EXACT FONT .PPTX</span>
                        <Layers className="h-4 w-4 shrink-0" />
                      </div>
                      <h3 className="mt-2.5 text-sm font-bold text-slate-100 leading-snug">
                        2. 100% Exact-Font Locked Slides (.pptx)
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-violet-100/80 font-khmer">
                        រក្សា Font ដើម (Noto Sans Khmer &amp; Plus Jakarta) ១០០% ដូចក្នុងកម្មវិធីនេះបិទ ទោះកុំព្យូទ័រមិនទាន់ដំឡើង Font ក៏ដោយ
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-violet-500/20 flex items-center gap-1.5 text-xs font-semibold text-violet-300">
                      {busyFormat === 'exact-pptx' ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{progressText}</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Exact-Font .pptx</span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Card 3: Editable + Exact Font Web Slides (.html) */}
                  <motion.button
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={SPRING_BOUNCE}
                    onClick={() => exportEditableWebSlidesHtml(slides, language)}
                    className="flex flex-col justify-between rounded-xl border border-sky-500/35 bg-sky-950/25 hover:bg-sky-950/40 p-4 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-bold tracking-wide text-sky-300">
                        <span>EDITABLE + EXACT FONT</span>
                        <Globe className="h-4 w-4 shrink-0" />
                      </div>
                      <h3 className="mt-2.5 text-sm font-bold text-slate-100 leading-snug">
                        3. Editable + Exact Font Web Slides (.html)
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-sky-100/80 font-khmer">
                        ទាំងអាចចុចកែអក្សរបានផ្ទាល់ + ទាំងរក្សា Font ដើម និងរូបមន្ត KaTeX ១០០% ដោយមិនបាច់ដំឡើង Font!
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-sky-500/20 flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Editable .html</span>
                    </div>
                  </motion.button>

                  {/* Card 4: Original Lecture PDF */}
                  <motion.button
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={SPRING_BOUNCE}
                    onClick={downloadOriginalPdf}
                    className="flex flex-col justify-between rounded-xl border border-emerald-500/35 bg-emerald-950/25 hover:bg-emerald-950/40 p-4 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-bold tracking-wide text-emerald-300">
                        <span>ORIGINAL .PDF</span>
                        <FileDown className="h-4 w-4 shrink-0" />
                      </div>
                      <h3 className="mt-2.5 text-sm font-bold text-slate-100 leading-snug">
                        4. Original Lecture Slides (.pdf)
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-emerald-100/80 font-khmer">
                        ទាញយកឯកសារស្លាយដើម PDF ១០០% ទាំង {slides.length} ទំព័រ (03_Convolutional_Neural_Networks.pdf)
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Original .pdf</span>
                    </div>
                  </motion.button>
                </div>

                {errorMsg && (
                  <p className="text-xs font-semibold text-red-400">{errorMsg}</p>
                )}
              </div>

              {/* Section 2: Blueprint / Dataset / Formula Preview Tabs */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div
                    role="tablist"
                    aria-label="Blueprint Export Previews"
                    className="flex flex-wrap items-center gap-2"
                  >
                    {(
                      [
                        {
                          id: 'markdown' as const,
                          label: `1. Full ${slides.length}-Slide Blueprint (.md)`,
                          icon: FileText,
                        },
                        {
                          id: 'csv' as const,
                          label: '2. CNN Architecture Dataset (.csv)',
                          icon: FileSpreadsheet,
                        },
                        {
                          id: 'latex' as const,
                          label: '3. Mathematical Formulas (.tex)',
                          icon: Code2,
                        },
                      ]
                    ).map(({ id, label, icon: Icon }) => {
                      const active = activeTab === id;
                      return (
                        <motion.button
                          key={id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                          transition={SPRING_BOUNCE}
                          onClick={() => setActiveTab(id)}
                          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{label}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      transition={SPRING_BOUNCE}
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      transition={SPRING_BOUNCE}
                      onClick={() =>
                        triggerFileDownload(
                          activeContent,
                          activeFileMeta.filename,
                          activeFileMeta.mime
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-3.5 py-2 text-xs font-semibold text-white cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download {activeFileMeta.filename.split('.').pop()?.toUpperCase()}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Preview Pane */}
                <div className="rounded-xl border border-slate-800 bg-[#050912] p-4 max-h-64 overflow-auto">
                  <pre className="font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap break-words font-khmer">
                    {activeContent}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
