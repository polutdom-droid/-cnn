export type LanguageMode = 'dual' | 'en' | 'km';

export type WorkspaceViewMode = 'canvas' | 'split' | 'specs' | 'pdf';

export type ViewportSize = 'full' | 'desktop' | 'tablet' | 'mobile';

export type SlideCategory =
  | 'all'
  | 'vision-edge'
  | 'cnn-intuition'
  | 'conv-math'
  | 'pooling-fc'
  | 'architectures';

export interface BilingualText {
  en: string;
  km: string;
}

export interface SlideKeyPoint extends BilingualText {
  detail?: BilingualText;
}

export interface MiniVideoStep {
  title: BilingualText;
  narration: BilingualText;
  highlightFormula?: string;
  durationSec: number;
}

export interface SlideSpecMetric {
  label: BilingualText;
  value: string;
  detail?: string;
}

export interface CnnSlide {
  id: number;
  category: Exclude<SlideCategory, 'all'>;
  kicker: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  keyPoints: SlideKeyPoint[];
  formula?: {
    expression: string;
    latex: string;
    derivationLatex?: string;
    caption: BilingualText;
  };
  specs: {
    inputTensor: string;
    outputTensor: string;
    operation: string;
    metrics: SlideSpecMetric[];
    pytorchSnippet: string;
  };
  miniVideoSteps: MiniVideoStep[];
  visualType:
    | 'cover'
    | 'cv-problems'
    | 'large-images'
    | 'image-recognition'
    | 'edge-detection-texture'
    | 'edge-detection-step'
    | 'different-filters'
    | 'intuition-system'
    | 'intuition-sum-fail'
    | 'intuition-weighted'
    | 'intuition-single-classifier'
    | 'intuition-dual-classifiers'
    | 'intuition-3x3-patterns'
    | 'intuition-conv-scan'
    | 'intuition-composition'
    | 'conv-3d-volume'
    | 'conv-dot-product'
    | 'conv-stacked-maps'
    | 'conv-sequence'
    | 'conv-learn-pyramid'
    | 'conv-face-hierarchy'
    | 'spatial-stride'
    | 'padding'
    | 'conv-1x1'
    | 'max-pooling'
    | 'fully-connected'
    | 'why-convolutions'
    | 'case-lenet5'
    | 'case-alexnet'
    | 'case-other-nets'
    | 'image-datasets'
    | 'exercise'
    | 'references';
  citation?: string;
}

export interface CategoryMeta {
  id: SlideCategory;
  label: BilingualText;
  rangeLabel: string;
}
