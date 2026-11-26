import { BilingualText, CnnSlide } from '../types/slide';

export type VideoVisualKind =
  | 'overview'
  | 'convolution'
  | 'padding-stride'
  | 'pooling'
  | 'formula'
  | 'architecture';

export interface VideoScene {
  id: string;
  title: BilingualText;
  subtitle: BilingualText;
  voiceScript: BilingualText;
  highlightFormula?: string;
  visualKind: VideoVisualKind;
  durationSec: number;
}

export interface KeyPointLink {
  id: string;
  title: string;
  url: string;
  kind: 'youtube' | 'website';
  isCustom?: boolean;
}

export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id || null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.startsWith('/embed/') || parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2] || null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function isValidHttpUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function pickVisualForSlide(slide: CnnSlide): VideoVisualKind {
  if (slide.category === 'vision-edge' || slide.category === 'cnn-intuition') {
    return 'convolution';
  }
  if (slide.visualType === 'spatial-stride' || slide.visualType === 'padding') {
    return 'padding-stride';
  }
  if (slide.visualType === 'max-pooling') {
    return 'pooling';
  }
  if (slide.category === 'conv-math') {
    return 'convolution';
  }
  return 'architecture';
}

/**
 * Generates a 3-scene (~60 second) structured 3D mini-video tailored to a specific Key Point.
 * Each scene spans ~20s so continuous narration stays comfortably within the 3 RPM TTS tier.
 */
export function buildKeyPointVideoScenes(
  slide: CnnSlide,
  pointIndex: number
): VideoScene[] {
  const pt = slide.keyPoints[pointIndex] ?? slide.keyPoints[0];
  const coreVisual = pickVisualForSlide(slide);
  const detailEn = pt.detail?.en ?? slide.subtitle.en;
  const detailKm = pt.detail?.km ?? slide.subtitle.km;
  const formulaCaptionEn = slide.formula?.caption.en ?? slide.specs.operation;
  const formulaCaptionKm = slide.formula?.caption.km ?? slide.specs.operation;

  return [
    {
      id: `s${slide.id}-p${pointIndex}-1`,
      title: {
        en: `1. Core Concept · Slide ${slide.id}, Point ${pointIndex + 1}`,
        km: `១. គោលគំនិតស្នូល · ស្លាយទី ${slide.id} ចំណុចទី ${pointIndex + 1}`,
      },
      subtitle: {
        en: `${pt.en} — ${detailEn}`,
        km: `${pt.km} — ${detailKm}`,
      },
      voiceScript: {
        en: `In Slide ${slide.id}, ${slide.title.en}. Key point ${pointIndex + 1}: ${pt.en}. ${detailEn}`,
        km: `នៅក្នុងស្លាយទី ${slide.id} ចំណុចទី ${pointIndex + 1}៖ ${pt.km}។ ${detailKm}`,
      },
      visualKind: 'overview',
      durationSec: 20,
    },
    {
      id: `s${slide.id}-p${pointIndex}-2`,
      title: {
        en: '2. 3D Visual Mechanics',
        km: '២. ដំណើរការមើលឃើញ 3D ជាក់ស្តែង',
      },
      subtitle: {
        en: `Watch how ${slide.specs.operation} transforms the ${slide.specs.inputTensor} input into ${slide.specs.outputTensor}.`,
        km: `សង្កេតមើលរបៀបដែល ${slide.specs.operation} បម្លែងទិន្នន័យចូល ${slide.specs.inputTensor} ទៅជា ${slide.specs.outputTensor}។`,
      },
      voiceScript: {
        en: `Visually in 3D, this layer applies ${slide.specs.operation}, transforming an input volume of ${slide.specs.inputTensor} into ${slide.specs.outputTensor}.`,
        km: `តាមរូបភាព 3D ជំហាននេះអនុវត្ត ${slide.specs.operation} ដើម្បីបម្លែងទិន្នន័យពី ${slide.specs.inputTensor} ទៅជា ${slide.specs.outputTensor}។`,
      },
      visualKind: coreVisual,
      durationSec: 21,
    },
    {
      id: `s${slide.id}-p${pointIndex}-3`,
      title: {
        en: '3. Formula & Takeaway',
        km: '៣. រូបមន្តគណិតវិទ្យា និងសង្ខេបការអនុវត្ត',
      },
      subtitle: {
        en: `${formulaCaptionEn} — Summary: ${pt.en}.`,
        km: `${formulaCaptionKm} — សង្ខេប៖ ${pt.km}។`,
      },
      voiceScript: {
        en: `Mathematically, remember: ${formulaCaptionEn}. In short, ${pt.en}.`,
        km: `ផ្នែកគណិតវិទ្យា សូមចងចាំថា៖ ${formulaCaptionKm}។ សរុបមក ${pt.km}។`,
      },
      highlightFormula: slide.formula?.latex,
      visualKind: slide.formula?.latex ? 'formula' : 'architecture',
      durationSec: 19,
    },
  ];
}

/**
 * Provides curated educational Website & YouTube links matched to each slide category / topic.
 */
export function getDefaultKeyPointLinks(
  slide: CnnSlide,
  pointIndex: number
): KeyPointLink[] {
  const curatedByTopic: Record<number, KeyPointLink[]> = {
    1: [
      {
        id: 'cur-cs231n-home',
        title: 'Stanford CS231n: CNNs for Visual Recognition',
        url: 'https://cs231n.github.io/convolutional-networks/',
        kind: 'website',
      },
      {
        id: 'cur-3b1b-conv',
        title: '3Blue1Brown: But what is a convolution?',
        url: 'https://www.youtube.com/watch?v=KuXjwB4LzSA',
        kind: 'youtube',
      },
    ],
    2: [
      {
        id: 'cur-cv-tasks',
        title: 'PyTorch Vision Tasks & Models',
        url: 'https://pytorch.org/vision/stable/models.html',
        kind: 'website',
      },
    ],
    5: [
      {
        id: 'cur-edge-sobel',
        title: 'Image Kernels Explained Visually (Setosa.io)',
        url: 'https://setosa.io/ev/image-kernels/',
        kind: 'website',
      },
      {
        id: 'cur-edge-yt',
        title: 'Computerphile: Edge Detection & Filters',
        url: 'https://www.youtube.com/watch?v=uihBwtPIBXQ',
        kind: 'youtube',
      },
    ],
    16: [
      {
        id: 'cur-conv2d-docs',
        title: 'PyTorch nn.Conv2d Official Documentation',
        url: 'https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html',
        kind: 'website',
      },
    ],
    22: [
      {
        id: 'cur-conv-arith',
        title: 'Convolution Arithmetic Guide (Stride & Padding)',
        url: 'https://github.com/vdumoulin/conv_arithmetic',
        kind: 'website',
      },
      {
        id: 'cur-andrew-stride',
        title: 'DeepLearning.AI: Strided Convolutions',
        url: 'https://www.youtube.com/watch?v=tQYJZDeCK50',
        kind: 'youtube',
      },
    ],
    23: [
      {
        id: 'cur-andrew-pad',
        title: 'DeepLearning.AI: Padding Explained',
        url: 'https://www.youtube.com/watch?v=smHa2HaWU1M',
        kind: 'youtube',
      },
      {
        id: 'cur-pad-docs',
        title: 'PyTorch Conv2d Padding Parameters',
        url: 'https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html',
        kind: 'website',
      },
    ],
    25: [
      {
        id: 'cur-maxpool-docs',
        title: 'PyTorch nn.MaxPool2d Documentation',
        url: 'https://pytorch.org/docs/stable/generated/torch.nn.MaxPool2d.html',
        kind: 'website',
      },
      {
        id: 'cur-pool-yt',
        title: 'DeepLearning.AI: Pooling Layers',
        url: 'https://www.youtube.com/watch?v=8oOgPUO-TBY',
        kind: 'youtube',
      },
    ],
    28: [
      {
        id: 'cur-lenet-paper',
        title: 'LeNet-5 Paper (LeCun et al., 1998)',
        url: 'http://yann.lecun.com/exdb/lenet/',
        kind: 'website',
      },
    ],
    29: [
      {
        id: 'cur-alexnet-paper',
        title: 'AlexNet Paper (ImageNet 2012)',
        url: 'https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html',
        kind: 'website',
      },
    ],
    30: [
      {
        id: 'cur-resnet-paper',
        title: 'Deep Residual Learning (ResNet Paper)',
        url: 'https://arxiv.org/abs/1512.03385',
        kind: 'website',
      },
      {
        id: 'cur-resnet-yt',
        title: 'DeepLearning.AI: Why ResNets Work',
        url: 'https://www.youtube.com/watch?v=RYth6qwunqM',
        kind: 'youtube',
      },
    ],
    31: [
      {
        id: 'cur-cifar10',
        title: 'CIFAR-10 & CIFAR-100 Datasets',
        url: 'https://www.cs.toronto.edu/~kriz/cifar.html',
        kind: 'website',
      },
    ],
  };

  if (pointIndex === 0 && curatedByTopic[slide.id]) {
    return curatedByTopic[slide.id];
  }

  // Helpful category-level fallback links on point 0 of other slides
  if (pointIndex === 0) {
    if (slide.category === 'vision-edge') {
      return [
        {
          id: `cat-ve-${slide.id}`,
          title: 'Image Kernels Visual Playground',
          url: 'https://setosa.io/ev/image-kernels/',
          kind: 'website',
        },
      ];
    }
    if (slide.category === 'cnn-intuition' || slide.category === 'conv-math') {
      return [
        {
          id: `cat-cm-${slide.id}`,
          title: 'CS231n Convolutional Layers Guide',
          url: 'https://cs231n.github.io/convolutional-networks/',
          kind: 'website',
        },
      ];
    }
    if (slide.category === 'pooling-fc') {
      return [
        {
          id: `cat-pf-${slide.id}`,
          title: 'CS231n Pooling & Fully-Connected Layers',
          url: 'https://cs231n.github.io/convolutional-networks/#pool',
          kind: 'website',
        },
      ];
    }
    return [
      {
        id: `cat-arch-${slide.id}`,
        title: 'PyTorch Classic CNN Architectures',
        url: 'https://pytorch.org/vision/stable/models.html',
        kind: 'website',
      },
    ];
  }

  return [];
}

const STORAGE_KEY = 'cnn_custom_kp_links_v1';

export type CustomLinksMap = Record<string, KeyPointLink[]>;

export function loadCustomKeyPointLinks(): CustomLinksMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CustomLinksMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCustomKeyPointLinks(map: CustomLinksMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage quota issues
  }
}
