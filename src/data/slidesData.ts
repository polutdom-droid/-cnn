import { CategoryMeta, CnnSlide } from '../types/slide';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'all',
    label: { en: 'All Slides (1–33)', km: 'ស្លាយទាំងអស់ (១–៣៣)' },
    rangeLabel: '1–33',
  },
  {
    id: 'vision-edge',
    label: { en: 'Vision & Edge Detection', km: 'ចក្ខុវិស័យ និងគែមរូបភាព' },
    rangeLabel: '1–7',
  },
  {
    id: 'cnn-intuition',
    label: { en: 'CNN Intuition', km: 'គោលគំនិតគ្រឹះ CNN' },
    rangeLabel: '8–15',
  },
  {
    id: 'conv-math',
    label: { en: 'Conv Layers & Math', km: 'ស្រទាប់ Conv និងគណិតវិទ្យា' },
    rangeLabel: '16–24',
  },
  {
    id: 'pooling-fc',
    label: { en: 'Pooling & FC', km: 'Pooling និង FC' },
    rangeLabel: '25–27',
  },
  {
    id: 'architectures',
    label: { en: 'Case Studies & Data', km: 'ករណីសិក្សា និងទិន្នន័យ' },
    rangeLabel: '28–33',
  },
];

export const SLIDES_DATA: CnnSlide[] = [
  {
    id: 1,
    category: 'vision-edge',
    kicker: { en: 'Cover & Course Identity', km: 'គម្របមេរៀន និងអត្តសញ្ញាណវគ្គសិក្សា' },
    title: {
      en: '3. Convolutional Neural Networks (CNN)',
      km: '៣. បណ្តាញសរសៃប្រសាទ Convolutional (CNN)',
    },
    subtitle: {
      en: 'Neural Networks and Deep Learning — Prepared by Dr. Valy Dona',
      km: 'បណ្តាញសរសៃប្រសាទ និងការរៀនស៊ីជម្រៅ — រៀបចំដោយ បណ្ឌិត Valy Dona',
    },
    keyPoints: [
      {
        en: 'Foundational deep learning architecture engineered specifically for grid-structured visual data.',
        km: 'ស្ថាបត្យកម្ម Deep Learning មូលដ្ឋានដែលរចនាឡើងជាពិសេសសម្រាប់ទិន្នន័យរូបភាពជាក្រឡាចត្រង្គ។',
        detail: {
          en: 'Images are 2D or 3D grids of pixels where nearby pixels are strongly correlated. CNNs exploit this spatial structure using local sliding kernels rather than flattening pixels into an unstructured vector.',
          km: 'រូបភាពគឺជាក្រឡាចត្រង្គ 2D ឬ 3D ដែលភីកសែលនៅជិតគ្នាមានទំនាក់ទំនងគ្នាខ្លាំង។ CNN ប្រើ Filter តូចៗរអិលលើរូបភាពដើម្បីរក្សារចនាសម្ព័ន្ធទីតាំងទាំងនោះ ជំនួសឱ្យការពន្លាភីកសែលជាបន្ទាត់ត្រង់។',
        },
      },
      {
        en: 'Covers Edge Detection, 2D/3D Convolution, Stride & Padding, Pooling, FC Layers, and Classic Architectures.',
        km: 'គ្របដណ្តប់លើការស្វែងរកគែម (Edge Detection), Convolution 2D/3D, Stride & Padding, Pooling, FC និងស្ថាបត្យកម្មល្បីៗ។',
        detail: {
          en: 'This 33-slide lecture builds step by step: starting from simple hand-crafted edge filters, developing intuition via 2×2 and 3×3 pattern detectors, deriving spatial dimension formulas, and studying LeNet-5, AlexNet, VGG, GoogLeNet, and ResNet.',
          km: 'មេរៀន ៣៣ ស្លាយនេះពន្យល់ជាជំហានៗ៖ ចាប់ពី Filter ស្វែងរកគែម មូលដ្ឋានគំនិត 2×2 និង 3×3 រូបមន្តគណនាទំហំលំហ រហូតដល់ស្ថាបត្យកម្មល្បីៗដូចជា LeNet-5, AlexNet, VGG, GoogLeNet និង ResNet។',
        },
      },
    ],
    formula: {
      expression: 'y[i, j] = (I * K)[i, j] + b',
      latex: String.raw`(I * K)[i, j] = \sum_{u=0}^{F-1}\sum_{v=0}^{F-1} I[i+u,\, j+v]\, K[u, v] + b`,
      derivationLatex: String.raw`\mathbf{a}^{[l]} = \sigma\!\left(\mathbf{W}^{[l]} * \mathbf{a}^{[l-1]} + \mathbf{b}^{[l]}\right)`,
      caption: {
        en: 'Core discrete 2D spatial convolution operation with learnable kernel K and bias b',
        km: 'ប្រតិបត្តិការ Convolution 2D មូលដ្ឋានជាមួយ Kernel K និង Bias b ដែលអាចរៀនបាន',
      },
    },
    specs: {
      inputTensor: 'H × W × C (Image Volume)',
      outputTensor: 'K-Class Logits / Feature Maps',
      operation: 'Conv → Activation → Pool → FC',
      metrics: [
        { label: { en: 'Total Slides', km: 'ចំនួនស្លាយសរុប' }, value: '33', detail: 'Lecture 03' },
        { label: { en: 'Core Themes', km: 'ផ្នែកសំខាន់ៗ' }, value: '5 Modules', detail: 'Edge → ResNet' },
        { label: { en: 'Instructor', km: 'សាស្ត្រាចារ្យ' }, value: 'Dr. Valy Dona', detail: 'NN & DL' },
      ],
      pytorchSnippet: `import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 8, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
        )
        self.classifier = nn.Linear(8 * 16 * 16, num_classes)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Lecture Overview', km: 'ទិដ្ឋភាពទូទៅនៃមេរៀន' },
        narration: {
          en: 'Welcome to Lecture 03 on Convolutional Neural Networks. We will move from raw pixels to edge detectors, full 3D convolution volumes, and real-world vision architectures.',
          km: 'សូមស្វាគមន៍មកកាន់មេរៀនទី ០៣ ស្តីពី Convolutional Neural Networks។ យើងនឹងសិក្សាចាប់ពីភីកសែល ការស្វែងរកគែម រហូតដល់ស្ថាបត្យកម្ម CNN ពិតប្រាកដ។',
        },
        durationSec: 5,
      },
      {
        title: { en: 'Why Spatial Structure Matters', km: 'ហេតុអ្វីរចនាសម្ព័ន្ធលំហសំខាន់' },
        narration: {
          en: 'Unlike standard MLPs that flatten images into 1D vectors, CNNs preserve 2D spatial neighborhoods using sliding filters.',
          km: 'ខុសពី MLP ធម្មតាដែលពន្លារូបភាពជាវ៉ិចទ័រ 1D, CNN រក្សាទំនាក់ទំនងភីកសែលជិតគ្នាដោយប្រើ Filter រអិល។',
        },
        highlightFormula: String.raw`\mathbf{I} \in \mathbb{R}^{H\times W\times C} \xrightarrow{\text{Conv + ReLU + Pool}} \hat{\mathbf{y}}`,
        durationSec: 5,
      },
    ],
    visualType: 'cover',
  },
  {
    id: 2,
    category: 'vision-edge',
    kicker: { en: 'Applications & Tasks', km: 'ការអនុវត្ត និងភារកិច្ចកុំព្យូទ័រចក្ខុវិស័យ' },
    title: {
      en: 'Computer Vision Problems',
      km: 'បញ្ហានានាក្នុងវិស័យ Computer Vision',
    },
    subtitle: {
      en: 'Object Detection, Classification, Localization, Segmentation & Style Transfer',
      km: 'ការចាត់ថ្នាក់ ការកំណត់ទីតាំង ការរកវត្ថុ ការបែងចែក និងការផ្ទេររចនាបថរូបភាព',
    },
    keyPoints: [
      {
        en: 'Object Detection & Classification: Classification, Classification + Localization, Multi-Object Detection, and Instance Segmentation.',
        km: 'ការស្វែងរក និងចាត់ថ្នាក់វត្ថុ៖ Classification, Localization, Object Detection និង Instance Segmentation (ឆ្មា ឆ្កែ ទា)។',
        detail: {
          en: 'Classification assigns one label to the whole image. Localization adds a bounding box (x, y, w, h). Object Detection locates multiple objects simultaneously, while Instance Segmentation predicts a pixel-exact mask for each object.',
          km: 'Classification ផ្តល់ឈ្មោះតែមួយសម្រាប់រូបទាំងមូល។ Localization បន្ថែមប្រអប់កំណត់ទីតាំង (x, y, w, h)។ Object Detection រកវត្ថុច្រើនក្នុងពេលតែមួយ ហើយ Instance Segmentation គូសព្រំដែនជាក់លាក់តាមភីកសែលនីមួយៗ។',
        },
      },
      {
        en: 'Image Synthesis (Neural Style Transfer): Combining content structure from one image with artistic texture style from another.',
        km: 'ការសំយោគរូបភាព (Style Transfer)៖ រួមបញ្ចូលខ្លឹមសាររូបភាពដើម ជាមួយរចនាបថសិល្បៈពីរូបភាពមួយទៀត។',
        detail: {
          en: 'Using intermediate CNN layers, high-level layers preserve the geometric content of a photo while Gram matrices of earlier layers capture brushstrokes and color textures from a style painting.',
          km: 'ស្រទាប់ជ្រៅនៃ CNN រក្សាទម្រង់ខ្លឹមសាររូបភាពដើម (Content) ខណៈស្រទាប់ដំបូងទាញយកទំនាក់ទំនងពណ៌ និងជក់គំនូរ (Style) ដើម្បីបង្កើតរូបភាពសិល្បៈថ្មី។',
        },
      },
    ],
    formula: {
      expression: 'L_total = α · L_content(C, G) + β · L_style(S, G)',
      latex: String.raw`\mathcal{L}_{\text{total}}(G) = \alpha\,\mathcal{L}_{\text{content}}(C, G) + \beta\,\mathcal{L}_{\text{style}}(S, G)`,
      derivationLatex: String.raw`\hat{y}_{\text{cls}} = \arg\max_c P(c \mid \mathbf{I}), \quad \mathbf{b} = (b_x, b_y, b_w, b_h), \quad M \in \{0,1\}^{H\times W}`,
      caption: {
        en: 'Style Transfer optimizes generated image G while vision tasks output classes, boxes, or pixel masks',
        km: 'Style Transfer បង្កើនគុណភាពរូប G ដោយថ្លឹង Content Loss និង Style Loss រីឯភារកិច្ចផ្សេងទៀតផ្តល់ស្លាក ប្រអប់ ឬ Mask',
      },
    },
    specs: {
      inputTensor: 'H × W × 3 (RGB Image)',
      outputTensor: 'Class Labels / BBoxes / Pixel Masks',
      operation: 'Semantic & Spatial Perception',
      metrics: [
        { label: { en: 'Classification', km: 'ចាត់ថ្នាក់' }, value: '1 Label', detail: 'e.g. CAT' },
        { label: { en: 'Detection', km: 'ស្វែងរកវត្ថុ' }, value: '(x,y,w,h,c)', detail: 'Multi-box' },
        { label: { en: 'Segmentation', km: 'បែងចែកភីកសែល' }, value: 'H × W Mask', detail: 'Pixel-level' },
      ],
      pytorchSnippet: `# Typical Vision Outputs
logits = classifier(features)        # Classification: [B, C]
boxes, scores = detector(image)      # Object Detection: [N, 4]
masks = segmenter(image)             # Instance Mask: [N, H, W]`,
    },
    miniVideoSteps: [
      {
        title: { en: 'From Single Label to Pixel Masks', km: 'ពីស្លាកតែមួយ ដល់ Mask កម្រិតភីកសែល' },
        narration: {
          en: 'Classification predicts "CAT". Adding Localization draws a bounding box. Object Detection finds multiple objects (CAT, DOG, DUCK), and Instance Segmentation traces exact pixel outlines.',
          km: 'Classification ទាយថា "CAT"។ Localization គូសប្រអប់។ Object Detection រកវត្ថុច្រើន (CAT, DOG, DUCK) ហើយ Instance Segmentation គូសព្រំដែនតាមភីកសែលពិត។',
        },
        durationSec: 6,
      },
      {
        title: { en: 'Neural Style Transfer', km: 'ការផ្ទេររចនាបថរូបភាព' },
        narration: {
          en: 'CNNs can also synthesize art: extracting deep content features from a portrait and texture correlations from an abstract painting.',
          km: 'CNN ក៏អាចសំយោគសិល្បៈបានដែរ ដោយទាញយកខ្លឹមសារពីរូបភាពដើម និងពណ៌/ជក់គំនូរពីរូបគំនូរសិល្បៈ។',
        },
        highlightFormula: String.raw`\mathcal{L}_{\text{total}} = \alpha\mathcal{L}_{\text{content}}(C,G) + \beta\mathcal{L}_{\text{style}}(S,G)`,
        durationSec: 5,
      },
    ],
    visualType: 'cv-problems',
  },
  {
    id: 3,
    category: 'vision-edge',
    kicker: { en: 'The Scaling Bottleneck', km: 'បញ្ហាទំហំទិន្នន័យ និងប៉ារ៉ាម៉ែត្រ' },
    title: {
      en: 'Deep Learning on Large Images',
      km: 'ការរៀនស៊ីជម្រៅលើរូបភាពទំហំធំ',
    },
    subtitle: {
      en: 'Why fully connected networks fail on 1000 × 1000 pixel images (n = 1,000,000+)',
      km: 'មូលហេតុដែលបណ្តាញ Fully Connected មានបញ្ហាលើរូបភាព ១០០០ × ១០០០ (n = ១,០០០,០០០)',
    },
    keyPoints: [
      {
        en: 'A single 1000 × 1000 grayscale image already has n = 1,000,000 input features (3,000,000 for RGB).',
        km: 'រូបភាព 1000 × 1000 មានភីកសែល n = 1,000,000 (ឬ 3,000,000 សម្រាប់រូបភាពពណ៌ RGB)។',
        detail: {
          en: 'In a traditional neural network (MLP), every single pixel becomes a separate input node xᵢ. A modest 1-megapixel photo therefore produces 1 to 3 million input dimensions before even reaching the first hidden layer.',
          km: 'ក្នុងបណ្តាញប្រពៃណី (MLP) ភីកសែលនីមួយៗត្រូវក្លាយជាធាតុចូល xᵢ ដាច់ដោយឡែក។ រូបភាព 1 Megapixel តែមួយសន្លឹកមានវិមាត្រចូលដល់ ១ ទៅ ៣ លានទៅហើយ។',
        },
      },
      {
        en: 'Connecting 1,000,000 inputs to just 1,000 hidden neurons requires 1 Billion weights in the very first layer!',
        km: 'ការភ្ជាប់ធាតុចូល 1,000,000 ទៅកាន់ 1,000 hidden neurons ត្រូវការទម្ងន់ (weights) រហូតដល់ 1 ពាន់លាននៅស្រទាប់ដំបូង!',
        detail: {
          en: 'Storing 1 billion floating-point weights consumes ~4 GB of RAM (12 GB for RGB) for a single layer, requires massive labeled datasets to avoid overfitting, and makes training computationally infeasible.',
          km: 'ការរក្សាទម្ងន់ 1 ពាន់លានប្រើអង្គចងចាំ ~4 GB (ឬ 12 GB សម្រាប់ RGB) ត្រឹមស្រទាប់ទី ១ ប៉ុណ្ណោះ ដែលធ្វើឱ្យម៉ូដែលយឺត និងងាយទន្ទេញចាំទិន្នន័យ (Overfitting)។',
        },
      },
    ],
    formula: {
      expression: 'Params = (H × W × C) × N_hidden = 10⁶ × 10³ = 10⁹ weights',
      latex: String.raw`n = H \times W = 1000 \times 1000 = 10^6 \implies |\mathbf{W}^{[1]}| = n \cdot N_{h_1} = 10^6 \times 10^3 = 10^9`,
      derivationLatex: String.raw`\text{RGB Memory (FP32):}\quad 3\times 10^9 \times 4\text{ bytes} = 12\text{ GB (Layer 1 alone)}`,
      caption: {
        en: 'Parameter explosion in dense MLPs leads to severe overfitting and memory exhaustion',
        km: 'ការផ្ទុះឡើងនៃចំនួន Weights ក្នុង MLP ធ្វើឱ្យងាយ Overfitting និងខ្វះអង្គចងចាំ',
      },
    },
    specs: {
      inputTensor: '1000 × 1000 × 1 (n = 1,000,000)',
      outputTensor: '1 (Binary: Dog?)',
      operation: 'Dense Matrix Multiplication W·x',
      metrics: [
        { label: { en: 'Input Pixels (n)', km: 'ចំនួនភីកសែល (n)' }, value: '1,000,000', detail: 'Grayscale' },
        { label: { en: 'RGB Features', km: 'ភីកសែល RGB' }, value: '3,000,000', detail: '1000×1000×3' },
        { label: { en: 'FC Layer-1 Weights', km: 'Weights ស្រទាប់ទី១' }, value: '1.0B+', detail: 'If H₁=1000' },
      ],
      pytorchSnippet: `# Why Dense MLP fails on 1000x1000x3 images:
# 3,000,000 * 1,000 = 3,000,000,000 parameters! (~12 GB FP32)
fc_explode = nn.Linear(1000 * 1000 * 3, 1000)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Flattening a 1000×1000 Dog Image', km: 'ការពន្លារូបភាពឆ្កែ ១០០០×១០០០' },
        narration: {
          en: 'Suppose we want to classify whether a 1000×1000 image contains a dog. Flattening it creates one million input nodes x₁ through xₙ.',
          km: 'ឧបមាថាយើងចង់បែងចែករូបភាពទំហំ 1000×1000 ថាជាឆ្កែឬអត់។ ការពន្លាវាបង្កើតធាតុចូល x₁ ដល់ xₙ ចំនួនមួយលាន។',
        },
        highlightFormula: String.raw`n = 1000 \times 1000 = 1{,}000{,}000`,
        durationSec: 5,
      },
      {
        title: { en: 'Billion-Weight Bottleneck', km: 'បញ្ហាទម្ងន់រាប់ពាន់លាន' },
        narration: {
          en: 'A dense hidden layer needs billions of parameters, making training slow and prone to memorizing noise. We need local, shared filters instead.',
          km: 'ស្រទាប់ Dense ត្រូវការទម្ងន់រាប់ពាន់លាន ដែលយឺត និងងាយ Overfit។ ដូច្នេះយើងត្រូវការ Filter តូចៗដែលចែករំលែកទម្ងន់គ្នា។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'large-images',
  },
  {
    id: 4,
    category: 'vision-edge',
    kicker: { en: 'Visual Invariance Challenge', km: 'បញ្ហាប្រឈមនៃការស្គាល់រូបភាព' },
    title: {
      en: 'Image Recognition in General',
      km: 'ការស្គាល់រូបភាពជាទូទៅ (Image Recognition)',
    },
    subtitle: {
      en: 'Teaching machines using basic shapes & features amidst large object variations',
      km: 'ការបង្រៀនម៉ាស៊ីនតាមរយៈរាងមូលដ្ឋាន ខណៈវត្ថុមានបម្រែបម្រួលច្រើន',
    },
    keyPoints: [
      {
        en: 'Teach/train a machine how to see objects and recognize them via basic shapes and features (head, ears, body, legs, tail).',
        km: 'បង្រៀនម៉ាស៊ីនឱ្យស្គាល់វត្ថុដោយផ្អែកលើរាង និងលក្ខណៈមូលដ្ឋាន (ក្បាល ត្រចៀក ដងខ្លួន ជើង កន្ទុយ)។',
        detail: {
          en: 'Instead of memorizing raw pixel intensities, a robust recognizer detects recurring structural parts—circles, curves, ears, eyes, and limbs—and verifies how they relate spatially.',
          km: 'ជំនួសឱ្យការចងចាំតម្លៃភីកសែលទាំងស្រុង ម៉ូដែលល្អត្រូវចេះស្គាល់ផ្នែកមូលដ្ឋានដូចជា រង្វង់ កោង ត្រចៀក ភ្នែក ជើង និងទំនាក់ទំនងរវាងផ្នែកទាំងនោះ។',
        },
      },
      {
        en: 'Difficulty: recognizing a large variation of objects — viewpoint, pose, lighting, scale, breed, and occlusion.',
        km: 'ការលំបាក៖ វត្ថុតែមួយមានទម្រង់ខុសគ្នាច្រើន ដូចជា មុំថត ឥរិយាបថ ពន្លឺ ទំហំ និងពូជខុសៗគ្នា។',
        detail: {
          en: 'The same dog photographed from behind, lying down, or partially occluded behind a fence produces completely different pixel grids. Convolutional feature hierarchies solve this by building invariant part detectors.',
          km: 'សត្វឆ្កែតែមួយ ពេលថតពីក្រោយ ពេលដេក ឬពេលមានរបាំងបាំងខ្លះ ផ្តល់តម្លៃភីកសែលខុសគ្នាទាំងស្រុង។ ឋានានុក្រមនៃស្រទាប់ CNN ជួយដោះស្រាយបម្រែបម្រួលទាំងនេះបាន។',
        },
      },
    ],
    formula: {
      expression: 'f(Transform(x)) ≈ f(x)  [Viewpoint & Pose Invariance]',
      latex: String.raw`f\big(T_{\Delta x, \Delta y, \theta, s}(\mathbf{x})\big) \approx f(\mathbf{x}) \quad \text{via hierarchical feature composition } \phi_L \circ \dots \circ \phi_1(\mathbf{x})`,
      caption: {
        en: 'Hierarchical local features enable invariance to translation, scale, lighting, and pose',
        km: 'លក្ខណៈតាមលំដាប់ថ្នាក់ជួយឱ្យម៉ាស៊ីនស្គាល់វត្ថុទោះប្តូរទីតាំង មាត្រដ្ឋាន ពន្លឺ ឬមុំថត',
      },
    },
    specs: {
      inputTensor: 'Diverse Poses / Lighting / Breeds',
      outputTensor: 'Invariant Class "DOG"',
      operation: 'Hierarchical Shape Composition',
      metrics: [
        { label: { en: 'Challenge', km: 'បញ្ហាប្រឈម' }, value: 'Intra-class Var.', detail: 'Pose & Angle' },
        { label: { en: 'Primitives', km: 'ធាតុមូលដ្ឋាន' }, value: 'Edges → Shapes', detail: 'Composable' },
      ],
      pytorchSnippet: `# Data Augmentation helps handle pose/lighting variations
transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomResizedCrop(224),
    transforms.ColorJitter(0.2, 0.2, 0.2),
])`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Decomposing Objects into Basic Shapes', km: 'ការបំបែកវត្ថុជារាងមូលដ្ឋាន' },
        narration: {
          en: 'A simple recognition model abstracts a dog into geometric primitives: circles, ovals, ears, legs, and a tail.',
          km: 'ម៉ូដែលសាមញ្ញបំបែករូបឆ្កែទៅជារាងធរណីមាត្រមូលដ្ឋាន ដូចជារង្វង់ រាងពងក្រពើ ត្រចៀក ជើង និងកន្ទុយ។',
        },
        durationSec: 5,
      },
      {
        title: { en: 'Large Variation in the Wild', km: 'បម្រែបម្រួលដ៏ធំនៅក្នុងភាពជាក់ស្តែង' },
        narration: {
          en: 'Real dogs sit, turn away, lie down, or peek over fences in different lighting. CNNs learn reusable low-level edge and part detectors to cope with these variations.',
          km: 'ឆ្កែពិតអាចបែរខ្នង អង្គុយ ដេក ឬស្ថិតក្នុងពន្លឺខុសៗគ្នា។ CNN រៀនស្គាល់គែម និងផ្នែកតូចៗដើម្បីដោះស្រាយបញ្ហានេះ។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'image-recognition',
  },
  {
    id: 5,
    category: 'vision-edge',
    kicker: { en: '2D Convolution Mechanics', km: 'យន្តការនៃ 2D Convolution' },
    title: {
      en: 'Edge Detection (Vertical Filter)',
      km: 'ការស្វែងរកគែមបញ្ឈរ (Vertical Edge Detection)',
    },
    subtitle: {
      en: 'Convolving a 6 × 6 pixel matrix with a 3 × 3 vertical edge filter to produce a 4 × 4 map',
      km: 'ប្រតិបត្តិការ Convolution រវាងម៉ាទ្រីស ៦×៦ និង Filter ៣×៣ បង្កើតបានលទ្ធផល ៤×៤',
    },
    keyPoints: [
      {
        en: 'Slide the 3 × 3 filter [1, 0, -1; 1, 0, -1; 1, 0, -1] across every valid 3 × 3 window of the 6 × 6 input.',
        km: 'រំកិល Filter 3×3 [1, 0, -1; 1, 0, -1; 1, 0, -1] លើគ្រប់ទីតាំងនៃម៉ាទ្រីស 6×6។',
        detail: {
          en: 'The left column (+1) adds pixel values on the left, the center column (0) ignores the middle, and the right column (-1) subtracts pixel values on the right. Thus, it measures the horizontal intensity difference across a vertical boundary.',
          km: 'ជួរឈរឆ្វេង (+1) បូកតម្លៃភីកសែលខាងឆ្វេង ជួរកណ្តាល (0) មិនគិត និងជួរឈរស្តាំ (-1) ដកតម្លៃភីកសែលខាងស្តាំ។ ដូច្នេះវាវាស់ភាពខុសគ្នានៃពន្លឺឆ្លងកាត់គែមបញ្ឈរ។',
        },
      },
      {
        en: 'At each position, multiply overlapping elements and sum all 9 products to compute one output cell in the 4 × 4 matrix.',
        km: 'នៅគ្រប់ទីតាំង គុណធាតុត្រូវគ្នាទាំង ៩ រួចបូកបញ្ចូលគ្នាដើម្បីបានតម្លៃ ១ ក្នុងម៉ាទ្រីសលទ្ធផល 4×4។',
        detail: {
          en: 'With a 6×6 input and 3×3 filter at stride 1, the filter fits 6 − 3 + 1 = 4 steps horizontally and 4 steps vertically, yielding 4 × 4 = 16 output activations.',
          km: 'លើម៉ាទ្រីស 6×6 ជាមួយ Filter 3×3 (stride 1) វាអាចរំកិលបាន 6 − 3 + 1 = 4 ជំហានទទឹង និង 4 ជំហានបណ្តោយ បង្កើតបានលទ្ធផល 4×4 = 16 ក្រឡា។',
        },
      },
    ],
    formula: {
      expression: 'Out[i, j] = Sum(u=0..2, v=0..2) Input[i+u, j+v] * Filter[u, v]',
      latex: String.raw`\text{Out}[i, j] = \sum_{u=0}^{2}\sum_{v=0}^{2} I[i+u,\, j+v] \cdot K_v[u, v], \quad K_v = \begin{bmatrix} 1 & 0 & -1 \\ 1 & 0 & -1 \\ 1 & 0 & -1 \end{bmatrix}`,
      derivationLatex: String.raw`\text{Out}[0,0] = (3\cdot 1 + 0\cdot 0 + 2\cdot(-1)) + (1\cdot 1 + 5\cdot 0 + 8\cdot(-1)) + (2\cdot 1 + 3\cdot 0 + 9\cdot(-1)) = -13`,
      caption: {
        en: 'Output size (6 − 3)/1 + 1 = 4 → yields a 4 × 4 vertical edge activation map',
        km: 'ទំហំលទ្ធផល (6 − 3)/1 + 1 = 4 → បង្កើតបានម៉ាទ្រីស 4 × 4',
      },
    },
    specs: {
      inputTensor: '6 × 6 (Grayscale Patch)',
      outputTensor: '4 × 4 (Feature Map)',
      operation: '3 × 3 Convolution (Stride 1, Pad 0)',
      metrics: [
        { label: { en: 'Input Size', km: 'ទំហំធាតុចូល' }, value: '6 × 6', detail: '36 pixels' },
        { label: { en: 'Filter Size', km: 'ទំហំ Filter' }, value: '3 × 3', detail: 'Vertical' },
        { label: { en: 'Output Size', km: 'ទំហំលទ្ធផល' }, value: '4 × 4', detail: '(6-3)/1+1' },
      ],
      pytorchSnippet: `import torch, torch.nn.functional as F
img = torch.tensor([[3,0,2,5,6,8],[1,5,8,7,0,5],[2,3,9,1,0,7],
                    [9,1,1,0,5,7],[1,0,1,3,8,9],[2,3,8,9,2,1]], dtype=torch.float32)
flt = torch.tensor([[1,0,-1],[1,0,-1],[1,0,-1]], dtype=torch.float32)
out = F.conv2d(img.view(1,1,6,6), flt.view(1,1,3,3)) # shape: [1, 1, 4, 4]`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Place Filter at Top-Left', km: 'ដាក់ Filter នៅជ្រុងលើឆ្វេង' },
        narration: {
          en: 'The 3×3 filter aligns with the top-left 3×3 sub-grid. Left column weights (+1) subtract the right column (-1), ignoring the middle (0).',
          km: 'Filter 3×3 ចាប់ផ្តើមពីជ្រុងលើឆ្វេង។ ជួរឈរឆ្វេង (+1) ដកជួរឈរស្តាំ (-1) ដោយមិនគិតជួរកណ្តាល (0)។',
        },
        highlightFormula: String.raw`\text{Out}[0,0] = (3+1+2) - (2+8+9) = -13`,
        durationSec: 6,
      },
      {
        title: { en: 'Slide Across All 16 Positions', km: 'រំកិលគ្រប់ ១៦ ទីតាំង' },
        narration: {
          en: 'Sliding 4 steps across and 4 steps down produces the 4×4 activation map capturing vertical intensity changes.',
          km: 'ការរំកិល ៤ ជំហានទទឹង និង ៤ ជំហានបណ្តោយ បង្កើតបានតារាងលទ្ធផល 4×4 ដែលចាប់យកគែមបញ្ឈរ។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'edge-detection-texture',
  },
  {
    id: 6,
    category: 'vision-edge',
    kicker: { en: 'Step-Edge Intuition', km: 'ការយល់ដឹងពីការផ្លាស់ប្តូរពន្លឺ' },
    title: {
      en: 'Edge Detection (Bright-to-Dark Boundary)',
      km: 'ការស្វែងរកគែម (ព្រំដែនភ្លឺទៅងងឹត)',
    },
    subtitle: {
      en: 'Why [10, 10, 10, 0, 0, 0] produces a strong 30 vertical edge response in the center',
      km: 'មូលហេតុដែល [10, 10, 10, 0, 0, 0] បង្កើតតម្លៃគែម ៣០ យ៉ាងច្បាស់នៅកណ្តាល',
    },
    keyPoints: [
      {
        en: 'Left half pixels have intensity 10 (bright), right half pixels have intensity 0 (dark), creating a sharp vertical step.',
        km: 'ពាក់កណ្តាលខាងឆ្វេងមានតម្លៃ 10 (ភ្លឺ) និងខាងស្តាំមានតម្លៃ 0 (ងងឹត) បង្កើតជាគែមបញ្ឈរច្បាស់នៅកណ្តាល។',
        detail: {
          en: 'Columns 0–2 represent a bright white surface (value 10) and columns 3–5 represent a dark black surface (value 0). The exact vertical edge sits between column 2 and column 3.',
          km: 'ជួរឈរ 0–2 តំណាងឱ្យផ្ទៃភ្លឺ (តម្លៃ 10) និងជួរឈរ 3–5 តំណាងឱ្យផ្ទៃងងឹត (តម្លៃ 0)។ គែមបញ្ឈរពិតស្ថិតនៅចន្លោះជួរទី ២ និងទី ៣។',
        },
      },
      {
        en: 'Uniform regions yield 0 (10−10 = 0 or 0−0 = 0), while the boundary columns yield +30 (3×10 − 0 = 30).',
        km: 'តំបន់ពណ៌ដូចគ្នាផ្តល់តម្លៃ 0 (10−10=0) ចំណែកនៅព្រំដែនកណ្តាលផ្តល់តម្លៃ +30 (3×10 − 0 = 30)។',
        detail: {
          en: 'Why are there two columns of 30 in the 4×4 result? Because both window column 1 (covering [10,10,0]) and window column 2 (covering [10,0,0]) have 10 on the left (+1) and 0 on the right (-1), lighting up the center edge.',
          km: 'ហេតុអ្វីបានជាលទ្ធផល 4×4 មានលេខ 30 ពីរជួរកណ្តាល? ព្រោះទាំងបង្អួច [10,10,0] និង [10,0,0] សុទ្ធតែមាន 10 នៅខាងឆ្វេង (+1) និង 0 នៅខាងស្តាំ (-1)។',
        },
      },
    ],
    formula: {
      expression: 'I_step * K_v = [[0,30,30,0], ...]',
      latex: String.raw`\begin{bmatrix} 10 & 10 & 10 & 0 & 0 & 0 \\ \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \\ 10 & 10 & 10 & 0 & 0 & 0 \end{bmatrix}_{6\times 6} * \begin{bmatrix} 1 & 0 & -1 \\ 1 & 0 & -1 \\ 1 & 0 & -1 \end{bmatrix}_{3\times 3} = \begin{bmatrix} 0 & 30 & 30 & 0 \\ 0 & 30 & 30 & 0 \\ 0 & 30 & 30 & 0 \\ 0 & 30 & 30 & 0 \end{bmatrix}_{4\times 4}`,
      derivationLatex: String.raw`\text{Uniform: } 3(10) - 3(10) = 0, \qquad \text{Boundary: } 3(10) - 3(0) = +30`,
      caption: {
        en: 'Resulting 4 × 4 map is [0, 30, 30, 0] in every row — pinpointing the vertical edge!',
        km: 'លទ្ធផល 4×4 គឺ [0, 30, 30, 0] គ្រប់ជួរ ដែលបង្ហាញទីតាំងគែមបញ្ឈរយ៉ាងច្បាស់!',
      },
    },
    specs: {
      inputTensor: '6 × 6 Step Image (10 | 0)',
      outputTensor: '4 × 4 ([0, 30, 30, 0])',
      operation: 'Vertical Edge Filter',
      metrics: [
        { label: { en: 'Flat Region', km: 'តំបន់ស្មើ' }, value: '0', detail: 'No edge' },
        { label: { en: 'Edge Peak', km: 'កំពូលគែម' }, value: '30', detail: 'Strong edge' },
      ],
      pytorchSnippet: `step_img = torch.cat([torch.full((6,3), 10.), torch.zeros(6,3)], dim=1)
out = F.conv2d(step_img.view(1,1,6,6), flt.view(1,1,3,3))
# Every row of out is [0., 30., 30., 0.]`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Inside Uniform Regions → Output 0', km: 'ក្នុងតំបន់ពណ៌ដូចគ្នា → លទ្ធផល 0' },
        narration: {
          en: 'When the 3×3 filter sits entirely on 10s (left) or entirely on 0s (right), positive and negative weights cancel out to 0.',
          km: 'ពេល Filter ស្ថិតលើតំបន់ 10 ទាំងអស់ ឬ 0 ទាំងអស់ តម្លៃបូក និងដកទូទាត់គ្នាស្មើ 0។',
        },
        highlightFormula: String.raw`(10+10+10) - (10+10+10) = 0`,
        durationSec: 5,
      },
      {
        title: { en: 'Straddling the Boundary → Output 30', km: 'ឆ្លងកាត់ព្រំដែន → លទ្ធផល 30' },
        narration: {
          en: 'When the filter straddles the 10-to-0 border, it computes 30 - 0 = 30, lighting up the middle two columns of the 4×4 map.',
          km: 'ពេល Filter ឆ្លងកាត់ព្រំដែន 10 ទៅ 0 វាគណនា 30 - 0 = 30 ដែលបង្ហាញគែមច្បាស់នៅជួរឈរកណ្តាល។',
        },
        highlightFormula: String.raw`[0,\; 30,\; 30,\; 0]`,
        durationSec: 5,
      },
    ],
    visualType: 'edge-detection-step',
  },
  {
    id: 7,
    category: 'vision-edge',
    kicker: { en: 'Hand-Crafted vs Learned Kernels', km: 'Filter កំណត់ដោយដៃ ទល់នឹងការរៀនដោយស្វ័យប្រវត្តិ' },
    title: {
      en: 'Edge Detection — Different Filters',
      km: 'ការស្វែងរកគែម — ប្រភេទ Filter ផ្សេងៗគ្នា',
    },
    subtitle: {
      en: 'Sobel, Scharr, and Learnable Weights (w₁ … w₉) discovered via backpropagation',
      km: 'Sobel Filter, Scharr Filter និងទម្ងន់ (w₁ … w₉) ដែលម៉ូដែលរៀនដោយស្វ័យប្រវត្តិ',
    },
    keyPoints: [
      {
        en: 'Sobel Filter [1,0,-1; 2,0,-2; 1,0,-1] gives extra weight to the central row for smoother noise resilience.',
        km: 'Sobel Filter ផ្តល់ទម្ងន់បន្ថែម (2, -2) ដល់ជួរកណ្តាលដើម្បីកាត់បន្ថយ Noise។',
        detail: {
          en: 'By weighting the middle pixel row twice as heavily (±2 vs ±1), Sobel combines edge differentiation with mild Gaussian smoothing, making it more robust to pixel noise.',
          km: 'ដោយផ្តល់ទម្ងន់ជួរកណ្តាលទ្វេដង (±2 ធៀបនឹង ±1), Sobel Filter ជួយចាប់គែមផង និងកាត់បន្ថយភាពរំខាន (Noise) នៅជុំវិញផង។',
        },
      },
      {
        en: 'Scharr Filter [3,0,-3; 10,0,-10; 3,0,-3] emphasizes rotational symmetry; in CNNs, all 9 parameters w₁…w₉ are learned automatically!',
        km: 'Scharr Filter ប្រើតម្លៃ (3, 10, 3) ចំណែកក្នុង CNN តម្លៃទម្ងន់ w₁…w₉ ទាំង ៩ ត្រូវបានរៀនដោយស្វ័យប្រវត្តិតាម Backpropagation!',
        detail: {
          en: 'Instead of engineers guessing weights (1,2,1 vs 3,10,3), CNNs treat all 9 numbers w₁…w₉ as trainable parameters optimized by gradient descent—discovering edges at any angle (e.g. 30°, 45°, 70°) automatically.',
          km: 'ជំនួសឱ្យមនុស្សទាយលេខ Filter ដោយដៃ CNN ចាត់ទុកលេខទាំង ៩ (w₁…w₉) ជាប៉ារ៉ាម៉ែត្រដែលរៀនតាម Gradient Descent ដូច្នេះវាអាចរកឃើញគែមគ្រប់មុំដោយស្វ័យប្រវត្តិ។',
        },
      },
    ],
    formula: {
      expression: 'W = [w1..w9] <- W - eta * dL/dW',
      latex: String.raw`K_{\text{Sobel}} = \begin{bmatrix} 1 & 0 & -1 \\ 2 & 0 & -2 \\ 1 & 0 & -1 \end{bmatrix},\quad K_{\text{Scharr}} = \begin{bmatrix} 3 & 0 & -3 \\ 10 & 0 & -10 \\ 3 & 0 & -3 \end{bmatrix},\quad W_{\text{CNN}} = \begin{bmatrix} w_1 & w_2 & w_3 \\ w_4 & w_5 & w_6 \\ w_7 & w_8 & w_9 \end{bmatrix}`,
      derivationLatex: String.raw`w_k^{(t+1)} = w_k^{(t)} - \eta\,\frac{\partial \mathcal{L}}{\partial w_k} \qquad (k = 1, 2, \dots, 9)`,
      caption: {
        en: 'Instead of hand-designing Sobel or Scharr, CNNs treat filter weights w₁…w₉ as learnable parameters',
        km: 'ជំនួសឱ្យការសរសេរ Sobel/Scharr ដោយដៃ CNN រៀនតម្លៃ w₁…w₉ តាមរយៈ Gradient Descent',
      },
    },
    specs: {
      inputTensor: '6 × 6 Input Matrix',
      outputTensor: '4 × 4 Filtered Map',
      operation: 'Sobel / Scharr / Learnable 3×3 Kernel',
      metrics: [
        { label: { en: 'Sobel Center', km: 'កណ្តាល Sobel' }, value: '±2', detail: '[1, 2, 1]' },
        { label: { en: 'Scharr Center', km: 'កណ្តាល Scharr' }, value: '±10', detail: '[3, 10, 3]' },
        { label: { en: 'CNN Params', km: 'ប៉ារ៉ាម៉ែត្រ CNN' }, value: '9 + bias', detail: 'Learnable' },
      ],
      pytorchSnippet: `# Hand-crafted Sobel vs Learnable nn.Conv2d
sobel_x = torch.tensor([[1,0,-1],[2,0,-2],[1,0,-1]], dtype=torch.float32)
scharr_x = torch.tensor([[3,0,-3],[10,0,-10],[3,0,-3]], dtype=torch.float32)
# In CNNs, weights w1..w9 are learned automatically:
learned_conv = nn.Conv2d(in_channels=1, out_channels=1, kernel_size=3)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Classical Sobel & Scharr Filters', km: 'Filter បុរាណ Sobel និង Scharr' },
        narration: {
          en: 'Computer vision engineers historically debated which weights detect edges best—Prewitt (1,1,1), Sobel (1,2,1), or Scharr (3,10,3).',
          km: 'វិស្វករពីមុនបានបង្កើត Filter ដោយដៃដូចជា Sobel (1,2,1) និង Scharr (3,10,3) ដើម្បីចាប់គែម។',
        },
        durationSec: 5,
      },
      {
        title: { en: 'The Deep Learning Breakthrough', km: 'របកគំហើញរបស់ Deep Learning' },
        narration: {
          en: 'CNNs replace manual weights with learnable variables w₁ through w₉, discovering vertical, diagonal, color, and texture filters straight from data.',
          km: 'CNN ជំនួសទម្ងន់ទាំងនោះដោយអថេរ w₁ ដល់ w₉ ដែលអាចរៀនបានដោយស្វ័យប្រវត្តិពីទិន្នន័យពិត។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'different-filters',
  },
  {
    id: 8,
    category: 'cnn-intuition',
    kicker: { en: 'Toy Recognition Problem', km: 'ឧទាហរណ៍សាមញ្ញនៃការស្គាល់តួអក្សរ' },
    title: {
      en: 'CNN Intuition: Recognizing "/" and "\\"',
      km: 'គោលគំនិត CNN៖ ការស្គាល់តួអក្សរ "/" និង "\\"',
    },
    subtitle: {
      en: 'Simple 2 × 2 pixel image classification system (Luis Serrano, 2017)',
      km: 'ប្រព័ន្ធស្គាល់រូបភាព ២×២ ភីកសែលសម្រាប់ "/" និង "\\" (Luis Serrano, 2017)',
    },
    keyPoints: [
      {
        en: 'Consider the simplest visual task: distinguishing a forward slash "/" from a backslash "\\" in a 2 × 2 grid.',
        km: 'ពិចារណាបញ្ហាសាមញ្ញបំផុត៖ បែងចែករវាងសញ្ញា "/" និង "\\" លើក្រឡា 2×2 ភីកសែល។',
        detail: {
          en: 'Each image contains only 4 pixels: top-right and bottom-left colored red form "/", while top-left and bottom-right colored red form "\\".',
          km: 'រូបភាពនីមួយៗមានតែ ៤ ភីកសែលប៉ុណ្ណោះ៖ ក្រឡាលើស្តាំ និងក្រោមឆ្វេងពណ៌ក្រហមបង្កើតជា "/" ចំណែកលើឆ្វេង និងក្រោមស្តាំពណ៌ក្រហមបង្កើតជា "\\"។',
        },
      },
      {
        en: 'We want to design a mathematical SYSTEM that maps the 2 × 2 pixel grid reliably to the symbol "/" or "\\".',
        km: 'យើងចង់បង្កើតប្រព័ន្ធគណិតវិទ្យាមួយដែលអាចបម្លែងក្រឡា 2×2 ទៅជាចម្លើយ "/" ឬ "\\" បានត្រឹមត្រូវ។',
        detail: {
          en: 'Before jumping to deep networks, understanding how a tiny 4-pixel system separates two diagonal strokes reveals the exact mathematical heart of convolutional filters.',
          km: 'ការយល់ពីរបៀបដែលប្រព័ន្ធ ៤ ភីកសែលតូចមួយបំបែកគំនូសទ្រេតទាំងពីរនេះ នឹងជួយឱ្យយើងយល់ច្បាស់ពីស្នូលគណិតវិទ្យានៃ CNN Filters។',
        },
      },
    ],
    formula: {
      expression: 'f: {-1, +1}^(2x2) -> {"/", "\\"}',
      latex: String.raw`f : \{-1, +1\}^{2 \times 2} \longrightarrow \left\{\,\text{"/"}\;,\;\text{"\textbackslash"}\,\right\}, \qquad \mathbf{X}_{/} = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix},\;\; \mathbf{X}_{\backslash} = \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}`,
      caption: {
        en: 'Formalizing the 2 × 2 pixel grid as a binary matrix in {-1, +1}^{2×2}',
        km: 'ការតំណាងរូបភាព 2×2 ជាម៉ាទ្រីសតម្លៃ {-1, +1}',
      },
    },
    specs: {
      inputTensor: '2 × 2 Pixel Grid',
      outputTensor: 'Symbol ∈ { "/", "\\" }',
      operation: 'Binary Linear Classifier',
      metrics: [
        { label: { en: 'Grid Size', km: 'ទំហំក្រឡា' }, value: '2 × 2', detail: '4 pixels' },
        { label: { en: 'Classes', km: 'ថ្នាក់ចម្លើយ' }, value: '2', detail: '/ vs \\' },
      ],
      pytorchSnippet: `slash_fwd = torch.tensor([[-1, 1], [1, -1]], dtype=torch.float32)
slash_bwd = torch.tensor([[1, -1], [-1, 1]], dtype=torch.float32)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Defining the 2×2 World', km: 'ការកំណត់ពិភព ២×២ ភីកសែល' },
        narration: {
          en: 'An anti-diagonal red pattern represents "/". A main-diagonal red pattern represents "\\". How should our SYSTEM tell them apart?',
          km: 'ក្រឡាអង្កត់ទ្រូងរងតំណាងឱ្យ "/" ចំណែកអង្កត់ទ្រូងមេតំណាងឱ្យ "\\". តើប្រព័ន្ធគួរគណនាដូចម្តេច?',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-system',
    citation: 'From the video of Luis Serrano, 2017 (youtube.com/watch?v=2-Ol7ZB0MmU)',
  },
  {
    id: 9,
    category: 'cnn-intuition',
    kicker: { en: 'Why Unweighted Sums Fail', km: 'មូលហេតុដែលការបូកធម្មតាបរាជ័យ' },
    title: {
      en: 'CNN Intuition: Equal-Weight Summation Fails',
      km: 'គោលគំនិត CNN៖ ការបូកសរុបធម្មតាផ្តល់លទ្ធផល 0 ដូចគ្នា',
    },
    subtitle: {
      en: 'Encoding red = +1 and white = -1 and adding all cells gives 0 for both patterns',
      km: 'ការដាក់តម្លៃ ក្រហម = +1 និង ស = -1 រួចបូកបញ្ចូលគ្នា ផ្តល់លទ្ធផល 0 ទាំងពីរ',
    },
    keyPoints: [
      {
        en: 'For "/": (-1) + (+1) + (+1) + (-1) = 0.',
        km: 'សម្រាប់ "/": (-1) + (+1) + (+1) + (-1) = 0។',
        detail: {
          en: 'Unrolling the 2×2 grid row by row gives [-1, 1, 1, -1]. Adding all four pixels with equal (+1) signs cancels out the two +1s and two -1s, producing 0.',
          km: 'ពេលតម្រៀបភីកសែលតាមជួរ [-1, 1, 1, -1] ហើយបូកបញ្ចូលគ្នាដោយសញ្ញា (+) ទាំងអស់ តម្លៃ +1 ពីរ និង -1 ពីរទូទាត់គ្នាស្មើ 0។',
        },
      },
      {
        en: 'For "\\": (+1) + (-1) + (-1) + (+1) = 0 — identical sum, so simple addition cannot separate them!',
        km: 'សម្រាប់ "\\": (+1) + (-1) + (-1) + (+1) = 0 — លទ្ធផលដូចគ្នាបេះបិទ មិនអាចបែងចែកបានទេ!',
        detail: {
          en: 'Because addition is commutative (order-blind), any permutation of two +1s and two -1s sums to zero. To recognize geometry, the weights MUST encode spatial position.',
          km: 'ដោយសារការបូកមិនគិតពីលំដាប់ទីតាំង លទ្ធផលទាំងពីរស្មើ 0 ដូចគ្នា។ ដើម្បីស្គាល់រាង ទម្ងន់ត្រូវតែមានសញ្ញាខុសគ្នាតាមទីតាំង។',
        },
      },
    ],
    formula: {
      expression: '(-1) + (1) + (1) + (-1) = 0 === (1) + (-1) + (-1) + (1) = 0',
      latex: String.raw`\mathbf{1}^\top \mathbf{x}_{/} = (-1) + 1 + 1 + (-1) = 0 \quad \equiv \quad \mathbf{1}^\top \mathbf{x}_{\backslash} = 1 + (-1) + (-1) + 1 = 0`,
      caption: {
        en: 'Without spatial signs/weights, pixel order is lost and both images collapse to 0',
        km: 'បើគ្មានទម្ងន់សញ្ញា (+ / -) តាមទីតាំងទេ លទ្ធផលទាំងពីរស្មើ 0 ដូចគ្នា',
      },
    },
    specs: {
      inputTensor: 'Flattened 4-vector [x₁, x₂, x₃, x₄]',
      outputTensor: '0 (Ambiguous)',
      operation: 'Sum with [+1, +1, +1, +1]',
      metrics: [
        { label: { en: 'Sum("/")', km: 'ផលបូក("/")' }, value: '0', detail: 'Indistinguishable' },
        { label: { en: 'Sum("\\")', km: 'ផលបូក("\\")' }, value: '0', detail: 'Indistinguishable' },
      ],
      pytorchSnippet: `w_naive = torch.tensor([1., 1., 1., 1.])
# Both slash_fwd and slash_bwd dot w_naive == 0.0`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Both Patterns Contain Two +1s and Two -1s', km: 'រូបទាំងពីរមាន +1 ពីរ និង -1 ពីរដូចគ្នា' },
        narration: {
          en: 'Because both "/" and "\\" have two red squares (+1) and two white squares (-1), simply summing all four numbers always returns 0.',
          km: 'ដោយសារ "/" និង "\\" មានក្រឡាក្រហមពីរ (+1) និងសពីរ (-1) ដូចគ្នា ការបូកបញ្ចូលគ្នាធម្មតាតែងតែស្មើ 0។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-sum-fail',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 10,
    category: 'cnn-intuition',
    kicker: { en: 'Signed Spatial Weights', km: 'ការប្រើសញ្ញាទម្ងន់តាមទីតាំង' },
    title: {
      en: 'CNN Intuition: Weighted Combination (− + + −)',
      km: 'គោលគំនិត CNN៖ ការប្រើទម្ងន់សញ្ញា (− + + −)',
    },
    subtitle: {
      en: 'Multiplying by [-1, +1, +1, -1] cleanly separates "/" (+4) from "\\" (-4)',
      km: 'ការគុណនឹង [-1, +1, +1, -1] បំបែក "/" (+4) ចេញពី "\\" (-4) យ៉ាងដាច់ស្រឡះ',
    },
    keyPoints: [
      {
        en: 'For "/": -(-1) + (1) + (1) - (-1) = 1 + 1 + 1 + 1 = +4.',
        km: 'សម្រាប់ "/": -(-1) + (1) + (1) - (-1) = +4។',
        detail: {
          en: 'Every weight matches the polarity of the "/" pattern: subtracting the white cells (-1) turns them into +1, and adding the red cells (+1) keeps them +1, summing constructively to +4.',
          km: 'សញ្ញាទម្ងន់ [- + + -] ស៊ីគ្នានឹងរូប "/"៖ ការដកក្រឡាស (-1) ក្លាយជា +1 ហើយបូកក្រឡាក្រហម (+1) នៅតែ +1 ដូច្នេះផលបូកសរុបគឺ +4។',
        },
      },
      {
        en: 'For "\\": -(1) + (-1) + (-1) - (1) = -1 - 1 - 1 - 1 = -4.',
        km: 'សម្រាប់ "\\": -(1) + (-1) + (-1) - (1) = -4។',
        detail: {
          en: 'For the opposite pattern "\\", every single product flips sign to -1, producing the maximum negative response (-4) and creating an 8-point margin between classes.',
          km: 'សម្រាប់រូប "\\" វិញ គ្រប់តួគុណទាំង ៤ ក្លាយជា -1 ផ្តល់លទ្ធផលអវិជ្ជមានខ្លាំងបំផុត (-4) ដែលបំបែកថ្នាក់ទាំងពីរដាច់ពីគ្នា។',
        },
      },
    ],
    formula: {
      expression: 'w = [-1, +1, +1, -1] => w·x("/") = +4, w·x("\\") = -4',
      latex: String.raw`\mathbf{w} = [-1,\; +1,\; +1,\; -1]^\top \implies \begin{cases} \mathbf{w}^\top \mathbf{x}_{/} = -(-1) + 1 + 1 - (-1) = +4 \\ \mathbf{w}^\top \mathbf{x}_{\backslash} = -(1) + (-1) + (-1) - 1 = -4 \end{cases}`,
      caption: {
        en: 'Matching pixel polarity with spatial weights turns a dot product into a pattern detector',
        km: 'ការផ្គូផ្គងទម្ងន់ទៅតាមទម្រង់ភីកសែល បង្កើតជាឧបករណ៍ចាប់សញ្ញារូបភាព',
      },
    },
    specs: {
      inputTensor: '[-1, 1, 1, -1] or [1, -1, -1, 1]',
      outputTensor: '+4 or -4',
      operation: 'Signed Dot Product',
      metrics: [
        { label: { en: 'Score("/")', km: 'ពិន្ទុ("/")' }, value: '+4', detail: 'Positive' },
        { label: { en: 'Score("\\")', km: 'ពិន្ទុ("\\")' }, value: '-4', detail: 'Negative' },
      ],
      pytorchSnippet: `w = torch.tensor([-1., 1., 1., -1.])
score_fwd = (slash_fwd.flatten() @ w).item()  # +4.0
score_bwd = (slash_bwd.flatten() @ w).item()  # -4.0`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Flipping the Diagonal Signs', km: 'ការដាក់សញ្ញាដកនៅអង្កត់ទ្រូងមេ' },
        narration: {
          en: 'By negating positions 1 and 4 (- + + -), every term for "/" becomes +1 (sum = +4), while every term for "\\" becomes -1 (sum = -4).',
          km: 'ដោយដាក់សញ្ញាដកលើក្រឡាទី១ និងទី៤ (- + + -) ផលបូកសម្រាប់ "/" ក្លាយជា +4 និងសម្រាប់ "\\" ក្លាយជា -4។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-weighted',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 11,
    category: 'cnn-intuition',
    kicker: { en: '2×2 Filter Grid', km: 'តម្រង ២×២ (Image Classifier)' },
    title: {
      en: 'CNN Intuition: The 2 × 2 Image Classifier',
      km: 'គោលគំនិត CNN៖ តម្រងចាត់ថ្នាក់រូបភាព ២×២',
    },
    subtitle: {
      en: 'Arranging weights [-, +; +, -] into a 2 × 2 grid: Positive ⇒ "/", Negative ⇒ "\\"',
      km: 'ការតម្រៀបទម្ងន់ [-, +; +, -] ជាក្រឡា ២×២៖ វិជ្ជមាន ⇒ "/", អវិជ្ជមាន ⇒ "\\"',
    },
    keyPoints: [
      {
        en: 'Keeping the 2 × 2 spatial layout [[-, +], [+, -]] lets us overlay the classifier directly on top of the image.',
        km: 'ការរក្សាទម្ងន់ក្នុងទម្រង់ 2×2 [[-, +], [+, -]] ជួយឱ្យយើងផ្ទៀងផ្ទាត់ផ្ទាល់លើរូបភាពបាន។',
        detail: {
          en: 'Rather than flattening weights into a 1D vector, keeping them as a 2×2 matrix visually mirrors the target shape ("/" has + along its anti-diagonal and − elsewhere).',
          km: 'ការរក្សាទម្ងន់ជាតារាង 2×2 ធ្វើឱ្យយើងមើលឃើញរាង Filter ផ្ទាល់ភ្នែក (សញ្ញា + តម្រៀបតាមអង្កត់ទ្រូង "/" និង − នៅក្រឡាផ្សេង)។',
        },
      },
      {
        en: 'Decision rule: If dot product > 0 ⇒ "/"; if dot product < 0 ⇒ "\\".',
        km: 'វិធានសម្រេចចិត្ត៖ បើផលគុណវិជ្ជមាន ⇒ "/", បើអវិជ្ជមាន ⇒ "\\".',
        detail: {
          en: 'A single threshold at zero splits the output score space cleanly: positive scores indicate a match with "/", while negative scores indicate the inverse pattern "\\".',
          km: 'លេខ 0 គឺជាព្រំដែនសម្រេចចិត្ត៖ តម្លៃធំជាង 0 ត្រូវនឹង "/" ចំណែកតម្លៃតូចជាង 0 ត្រូវនឹង "\\"។',
        },
      },
    ],
    formula: {
      expression: 'z = sum(W * X) > 0 => "/" else "\\"',
      latex: String.raw`W = \begin{bmatrix} -1 & +1 \\ +1 & -1 \end{bmatrix}, \quad z = \sum_{u=1}^{2}\sum_{v=1}^{2} W_{u,v} X_{u,v} \implies \hat{y} = \begin{cases} \text{"/"} & \text{if } z > 0 \\ \text{"\textbackslash"} & \text{if } z < 0 \end{cases}`,
      caption: {
        en: 'A 2 × 2 spatial filter computes the Frobenius inner product ⟨W, X⟩_F',
        km: 'Filter 2×2 គណនាផលគុណធាតុត្រូវគ្នារវាងម៉ាទ្រីសទម្ងន់ W និងរូបភាព X',
      },
    },
    specs: {
      inputTensor: '2 × 2 Image',
      outputTensor: 'Scalar Score → Class',
      operation: '2 × 2 Pattern Filter',
      metrics: [
        { label: { en: 'If > 0', km: 'បើវិជ្ជមាន' }, value: '"/"', detail: 'Score +4' },
        { label: { en: 'If < 0', km: 'បើអវិជ្ជមាន' }, value: '"\\"', detail: 'Score -4' },
      ],
      pytorchSnippet: `def classify_2x2(patch):
    score = (patch * torch.tensor([[-1., 1.], [1., -1.]])).sum()
    return "/" if score > 0 else "\\\\"`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Visualizing Weights as a 2×2 Filter', km: 'ការមើលទម្ងន់ជា Filter ២×២' },
        narration: {
          en: 'A 2×2 filter acts as a visual template: high response when the image matches the template, negative response when inverted.',
          km: 'Filter 2×2 ដើរតួជាគំរូស្វែងរកទម្រង់៖ ផ្តល់តម្លៃវិជ្ជមានពេលរូបភាពត្រូវនឹងគំរូ និងអវិជ្ជមានពេលផ្ទុយគ្នា។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-single-classifier',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 12,
    category: 'cnn-intuition',
    kicker: { en: 'One Filter Per Feature', km: 'Filter មួយសម្រាប់លក្ខណៈមួយ' },
    title: {
      en: 'CNN Intuition: Dual Classifiers',
      km: 'គោលគំនិត CNN៖ តម្រងចាត់ថ្នាក់ពីរផ្សេងគ្នា',
    },
    subtitle: {
      en: 'Classifier 1 detects "/" (or Not "/"); Classifier 2 detects "\\" (or Not "\\")',
      km: 'តម្រងទី១ រក "/" (ឬ មិនមែន "/") • តម្រងទី២ រក "\\" (ឬ មិនមែន "\\")',
    },
    keyPoints: [
      {
        en: 'Classifier 1 [[-, +], [+, -]]: Positive ⇒ "/", Negative ⇒ Not "/".',
        km: 'Classifier 1 [[-, +], [+, -]]: វិជ្ជមាន ⇒ "/", អវិជ្ជមាន ⇒ មិនមែន "/"។',
        detail: {
          en: 'In real images, a patch that is Not "/" is not necessarily "\\" — it could be blank, horizontal, or noise! Separating detectors into "is X" vs "not X" handles multi-class inputs safely.',
          km: 'ក្នុងភាពជាក់ស្តែង រូបដែលមិនមែន "/" មិនប្រាកដថាជា "\\" ទេ (អាចជាផ្ទៃទទេ ឬគំនូសផ្សេង)។ ដូច្នេះការមាន Filter ផ្ទាល់ខ្លួនសម្រាប់លក្ខណៈនីមួយៗមានភាពត្រឹមត្រូវជាង។',
        },
      },
      {
        en: 'Classifier 2 [[+, -], [-, +]]: Positive ⇒ "\\", Negative ⇒ Not "\\". Dedicated filters generalize to multi-class recognition!',
        km: 'Classifier 2 [[+, -], [-, +]]: វិជ្ជមាន ⇒ "\\", អវិជ្ជមាន ⇒ មិនមែន "\\"។ Filter ដាច់ដោយឡែកអាចពង្រីកសម្រាប់ថ្នាក់ច្រើន!',
        detail: {
          en: 'By pairing dedicated filters with ReLU (which discards negative "Not X" responses), a convolutional layer turns into a bank of independent pattern detectors.',
          km: 'ការប្រើ Filter ដាច់ដោយឡែកបែបនេះរួមជាមួយ ReLU (លុបតម្លៃអវិជ្ជមានចោល) អនុញ្ញាតឱ្យ CNN ស្គាល់លក្ខណៈច្រើនប្រភេទព្រមគ្នា។',
        },
      },
    ],
    formula: {
      expression: 'W_1 = [[-1, 1], [1, -1]], W_2 = [[1, -1], [-1, 1]]',
      latex: String.raw`W_1 = \begin{bmatrix} -1 & +1 \\ +1 & -1 \end{bmatrix}\;(\text{Detect } \text{"/"}), \qquad W_2 = \begin{bmatrix} +1 & -1 \\ -1 & +1 \end{bmatrix}\;(\text{Detect } \text{"\textbackslash"})`,
      derivationLatex: String.raw`z_k = \langle W_k, X \rangle_F, \qquad \text{Active if } z_k > 0`,
      caption: {
        en: 'Each filter specializes in a single visual motif, enabling multi-feature extraction',
        km: 'Filter នីមួយៗឯកទេសក្នុងការស្វែងរកលំនាំតែមួយ ដើម្បីអាចបូកបញ្ចូលសម្រាប់ថ្នាក់ច្រើន',
      },
    },
    specs: {
      inputTensor: '2 × 2 Image',
      outputTensor: '2 Scores: [Score(/), Score(\\)]',
      operation: '2 Parallel 2×2 Filters',
      metrics: [
        { label: { en: 'Filter 1', km: 'Filter ទី១' }, value: '[- +; + -]', detail: 'Detects /' },
        { label: { en: 'Filter 2', km: 'Filter ទី២' }, value: '[+ -; - +]', detail: 'Detects \\' },
      ],
      pytorchSnippet: `filters = torch.tensor([
    [[-1., 1.], [1., -1.]],  # Filter 1: "/"
    [[1., -1.], [-1., 1.]],  # Filter 2: "\\"
])`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Dedicated Feature Detectors', km: 'ឧបករណ៍ចាប់លក្ខណៈនីមួយៗ' },
        narration: {
          en: 'Instead of one filter doing double duty, CNNs use separate filters for each basic pattern: one for "/", another for "\\".',
          km: 'ជំនួសឱ្យ Filter តែមួយ CNN ប្រើ Filter ដាច់ដោយឡែកសម្រាប់លក្ខណៈនីមួយៗ៖ មួយសម្រាប់ "/" និងមួយទៀតសម្រាប់ "\\".',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-dual-classifiers',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 13,
    category: 'cnn-intuition',
    kicker: { en: '3×3 Pattern Composition', km: 'ការផ្គុំទម្រង់លើក្រឡា ៣×៣' },
    title: {
      en: 'CNN Intuition: Recognizing "/", "\\", "X", "O"',
      km: 'គោលគំនិត CNN៖ ការស្គាល់តួអក្សរ ៤ ("/", "\\", "X", "O")',
    },
    subtitle: {
      en: '3 × 3 pixel characters built out of 2 × 2 basic diagonal patterns',
      km: 'រូបភាព ៣×៣ ភីកសែលនៃតួអក្សរ "/", "\\", "X", "O" ដែលផ្គុំពីលំនាំមូលដ្ឋាន ២×២',
    },
    keyPoints: [
      {
        en: 'Now we have 4 classes in a 3 × 3 grid: "/", "\\", "X" (both diagonals), and "O" (diamond perimeter).',
        km: 'ឥឡូវយើងមាន ៤ ថ្នាក់លើក្រឡា 3×3 គឺ "/", "\\", "X" (អង្កត់ទ្រូងទាំងពីរ) និង "O" (រាងពេជ្រជុំវិញ)។',
        detail: {
          en: 'Moving from 2×2 to 3×3 introduces richer shapes where multiple strokes intersect ("X") or enclose a hollow center ("O").',
          km: 'ការពង្រីកពី 2×2 ទៅ 3×3 អាចបង្កើតជារូបរាងស្មុគស្មាញជាងមុន ដូចជាគំនូសកាត់គ្នា ("X") ឬរង្វង់ប្រហោងកណ្តាល ("O")។',
        },
      },
      {
        en: 'Notice every 3 × 3 character is composed of overlapping 2 × 2 basic patterns ("/" and "\\")!',
        km: 'សង្កេតឃើញថាតួអក្សរ 3×3 ទាំងអស់ត្រូវបានផ្គុំឡើងពីលំនាំមូលដ្ឋាន 2×2 ("/" និង "\\")!',
        detail: {
          en: 'Specifically, "X" contains "\\" in its top-left & bottom-right corners and "/" in its top-right & bottom-left corners. "O" flips those exact four 2×2 quadrants!',
          km: 'ជាក់ស្តែង អក្សរ "X" មាន "\\" នៅជ្រុងលើឆ្វេង-ក្រោមស្តាំ និង "/" នៅជ្រុងលើស្តាំ-ក្រោមឆ្វេង។ ចំណែក "O" មានទីតាំងបញ្ច្រាសពី "X" ទាំងស្រុង!',
        },
      },
    ],
    formula: {
      expression: 'X in {-1, +1}^(3x3) decomposed into 2x2 sub-patterns',
      latex: String.raw`\mathbf{X}_{\text{"X"}} = \begin{bmatrix} 1 & -1 & 1 \\ -1 & 1 & -1 \\ 1 & -1 & 1 \end{bmatrix}, \qquad \mathbf{X}_{\text{"O"}} = \begin{bmatrix} -1 & 1 & -1 \\ 1 & -1 & 1 \\ -1 & 1 & -1 \end{bmatrix}`,
      caption: {
        en: 'Every 3 × 3 symbol contains four overlapping 2 × 2 sub-windows',
        km: 'រូបភាព 3×3 នីមួយៗផ្ទុកផ្ទាំងរង 2×2 ចំនួន ៤ ដែលត្រួតលើគ្នា',
      },
    },
    specs: {
      inputTensor: '3 × 3 Pixel Grid',
      outputTensor: '4 Classes: /, \\, X, O',
      operation: '2 × 2 Sub-pattern Decomposition',
      metrics: [
        { label: { en: 'Input Grid', km: 'ក្រឡាធាតុចូល' }, value: '3 × 3', detail: '9 pixels' },
        { label: { en: 'Basic Patterns', km: 'លំនាំមូលដ្ឋាន' }, value: '2 × 2', detail: '/ and \\' },
      ],
      pytorchSnippet: `X_img = torch.tensor([[1,-1,1], [-1,1,-1], [1,-1,1]], dtype=torch.float32)
O_img = torch.tensor([[-1,1,-1], [1,-1,1], [-1,1,-1]], dtype=torch.float32)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Complex Shapes Made of Simple Parts', km: 'រាងស្មុគស្មាញផ្គុំពីផ្នែកសាមញ្ញ' },
        narration: {
          en: 'Look closely at X and O in 3×3 grids: X has "/" in top-right & bottom-left and "\\" in top-left & bottom-right. O reverses those corners!',
          km: 'សង្កេតមើល X និង O លើក្រឡា 3×3៖ X មានទម្រង់ "/" និង "\\" នៅតាមជ្រុង ចំណែក O មានជ្រុងផ្ទុយគ្នា។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-3x3-patterns',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 14,
    category: 'cnn-intuition',
    kicker: { en: 'Sliding Filters = Conv Layer', km: 'ការរំកិល Filter = ស្រទាប់ Convolutional' },
    title: {
      en: 'CNN Intuition: Convolutional Layer Scanning',
      km: 'គោលគំនិត CNN៖ ស្រទាប់ Convolutional ស្កេនរូបភាព ៣×៣',
    },
    subtitle: {
      en: 'Sliding 2 × 2 filters ("/" and "\\") over a 3 × 3 image creates two 2 × 2 feature maps',
      km: 'ការរំកិល Filter ២×២ ("/" និង "\\") លើរូប ៣×៣ បង្កើតបាន Feature Maps ២×២ ចំនួនពីរ',
    },
    keyPoints: [
      {
        en: 'Filter "/" scans the 4 overlapping 2 × 2 windows of the 3 × 3 image to produce a 2 × 2 activation map.',
        km: 'Filter "/" ស្កេនទីតាំង 2×2 ទាំង ៤ នៃរូប 3×3 បង្កើតជាតារាងលទ្ធផល 2×2។',
        detail: {
          en: 'Each cell (r, c) in the output 2×2 map records how strongly the 2×2 sub-region at position (r, c) matches the "/" stroke.',
          km: 'ក្រឡានីមួយៗ (r, c) ក្នុងតារាងលទ្ធផល 2×2 កត់ត្រាថាតើតំបន់តូចនៅទីតាំង (r, c) នោះត្រូវនឹងគំនូស "/" កម្រិតណា។',
        },
      },
      {
        en: 'Filter "\\" simultaneously scans the same 4 windows, producing a second 2 × 2 activation map — this IS a Convolutional Layer!',
        km: 'Filter "\\" ស្កេនដូចគ្នា បង្កើតជាតារាងលទ្ធផល 2×2 ទីពីរ — នេះហើយជាស្រទាប់ Convolutional Layer!',
        detail: {
          en: 'Running 2 small filters across all spatial locations converts a single 3×3×1 input image into a 2×2×2 tensor of spatial feature maps.',
          km: 'ការស្កេន Filter ២ ស្របគ្នានេះ បម្លែងរូបភាពដើម 3×3×1 ទៅជា Volume ទំហំ 2×2×2 ដែលផ្ទុកផែនទីលក្ខណៈទាំងពីរ។',
        },
      },
    ],
    formula: {
      expression: '(3 x 3 Input) * (2 filters of 2 x 2) => 2 x 2 x 2 Feature Volume',
      latex: String.raw`O = \frac{N - F}{S} + 1 = \frac{3 - 2}{1} + 1 = 2 \implies \mathbf{I}_{3\times 3} * \{W_1, W_2\}_{2\times 2} \longrightarrow \mathbf{A} \in \mathbb{R}^{2\times 2\times 2}`,
      caption: {
        en: 'Each 2 × 2 quadrant checks how strongly "/" or "\\" appears at that location',
        km: 'ក្រឡានីមួយៗក្នុងតារាង 2×2 បង្ហាញកម្រិតវត្តមាននៃ "/" ឬ "\\" នៅទីតាំងនោះ',
      },
    },
    specs: {
      inputTensor: '3 × 3 × 1',
      outputTensor: '2 × 2 × 2 (2 Feature Maps)',
      operation: 'Conv2d(1, 2, kernel_size=2)',
      metrics: [
        { label: { en: 'Windows', km: 'ចំនួនបង្អួចស្កេន' }, value: '4', detail: '2 × 2 grid' },
        { label: { en: 'Output Depth', km: 'ជម្រៅលទ្ធផល' }, value: '2 Maps', detail: 'Find / & \\' },
      ],
      pytorchSnippet: `conv = nn.Conv2d(1, 2, kernel_size=2, bias=False)
# Output shape for 3x3 input: [1, 2, 2, 2]`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Scanning All 4 Quadrants', km: 'ការស្កេនគ្រប់ជ្រុងទាំង ៤' },
        narration: {
          en: 'Slide the 2×2 "/" detector across top-left, top-right, bottom-left, and bottom-right. Positive scores highlight where "/" matches.',
          km: 'រំកិល Filter "/" 2×2 លើជ្រុងទាំង ៤។ តម្លៃវិជ្ជមានបង្ហាញទីតាំងដែលមានទម្រង់ "/"។',
        },
        durationSec: 5,
      },
      {
        title: { en: 'Building Stacked Feature Maps', km: 'ការបង្កើត Feature Maps ត្រួតគ្នា' },
        narration: {
          en: 'Doing this for both "/" and "\\" produces two 2×2 maps stacked together—summarizing where each stroke exists.',
          km: 'ការធ្វើបែបនេះសម្រាប់ទាំង "/" និង "\\" បង្កើតបាន Feature Map 2×2 ចំនួន ២ សន្លឹក។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-conv-scan',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 15,
    category: 'cnn-intuition',
    kicker: { en: 'Feature Map Combination', km: 'ការផ្សំ Feature Maps ដើម្បីទទួលស្គាល់វត្ថុ' },
    title: {
      en: 'CNN Intuition: Combining Maps to Recognize "X"',
      km: 'គោលគំនិត CNN៖ ការផ្សំផែនទីលក្ខណៈដើម្បីស្គាល់អក្សរ "X"',
    },
    subtitle: {
      en: 'Higher layers combine detected "/" and "\\" feature maps into the complete "X" classification',
      km: 'ស្រទាប់បន្ទាប់ផ្សំផែនទី "/" និង "\\" ដើម្បីសន្និដ្ឋានថាជារូប "X"',
    },
    keyPoints: [
      {
        en: 'For input "X": the "/" map lights up on top-right & bottom-left, while the "\\" map lights up on top-left & bottom-right.',
        km: 'សម្រាប់រូប "X"៖ ផែនទី "/" ភ្លឺនៅលើស្តាំ និងក្រោមឆ្វេង ចំណែកផែនទី "\\" ភ្លឺនៅលើឆ្វេង និងក្រោមស្តាំ។',
        detail: {
          en: 'Notice how the two 2×2 feature maps act like a spatial summary: instead of raw pixel colors, they directly report "where the / strokes are" and "where the \\ strokes are".',
          km: 'ផែនទី 2×2 ទាំងពីរដើរតួជាសេចក្តីសង្ខេបលក្ខណៈ៖ ជំនួសឱ្យការមើលភីកសែលឆៅ វាប្រាប់ដោយផ្ទាល់ថា "ទីតាំងណាមាន /" និង "ទីតាំងណាមាន \\"។',
        },
      },
      {
        en: 'Combining both maps (after ReLU) gives an unmistakable signature for "X" versus "O", "/", or "\\".',
        km: 'ការបូកបញ្ចូលផែនទីទាំងពីរផ្តល់សញ្ញាសម្គាល់យ៉ាងច្បាស់សម្រាប់ "X" ខុសពី "O", "/" និង "\\"។',
        detail: {
          en: 'Applying ReLU suppresses negative non-matches to 0. A subsequent layer then simply checks the corner activations to distinguish X, O, /, and \\ with 100% certainty.',
          km: 'ReLU បម្លែងតម្លៃអវិជ្ជមានទៅជា 0។ ស្រទាប់បន្ទាប់គ្រាន់តែពិនិត្យតម្លៃតាមជ្រុងទាំងនោះដើម្បីបែងចែក X, O, /, និង \\ បានយ៉ាងច្បាស់លាស់។',
        },
      },
    ],
    formula: {
      expression: 'A^(k) = max(0, X * W_k) -> Classifier predicts "X"',
      latex: String.raw`A^{(k)}_{i,j} = \max\!\big(0,\; (X * W_k)_{i,j}\big), \qquad A^{(/)}_{\text{"X"}} = \begin{bmatrix} 0 & 2 \\ 2 & 0 \end{bmatrix},\;\; A^{(\backslash)}_{\text{"X"}} = \begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}`,
      derivationLatex: String.raw`\hat{y} = \arg\max_{c \in \{/, \backslash, X, O\}} \big(\mathbf{W}_{\text{fc}} \operatorname{vec}(A) + \mathbf{b}\big)_c = \text{"X"}`,
      caption: {
        en: 'ReLU keeps positive pattern detections; the final linear layer combines them to classify "X"',
        km: 'ReLU រក្សាទុកតែតម្លៃវិជ្ជមានដែលត្រូវគ្នា រួចស្រទាប់ចុងក្រោយផ្សំដើម្បីទាយ "X"',
      },
    },
    specs: {
      inputTensor: '2 × 2 × 2 Feature Maps',
      outputTensor: 'Predicted Character ("X")',
      operation: 'ReLU + Feature Aggregation → Classification',
      metrics: [
        { label: { en: 'Map "/" Hits', km: 'ទីតាំងត្រូវ "/"' }, value: 'TR, BL', detail: 'Anti-diagonal' },
        { label: { en: 'Map "\\" Hits', km: 'ទីតាំងត្រូវ "\\"' }, value: 'TL, BR', detail: 'Main-diagonal' },
      ],
      pytorchSnippet: `# ReLU keeps positive matches, next layer combines them
maps = torch.relu(conv(X_img.view(1,1,3,3)))
# Combined diagonal evidence -> Predicts "X"`,
    },
    miniVideoSteps: [
      {
        title: { en: 'From Local Strokes to Global Identity', km: 'ពីគំនូសតូចៗ ទៅជាតួអក្សរពេញលេញ' },
        narration: {
          en: 'Once Layer 1 finds "/" in two corners and "\\" in the other two corners, the classifier combines them and confidently outputs "X".',
          km: 'ពេលស្រទាប់ទី១ រកឃើញ "/" នៅជ្រុងពីរ និង "\\" នៅជ្រុងពីរទៀត ស្រទាប់បន្ទាប់ផ្សំគ្នាហើយទាយថា "X"។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'intuition-composition',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 16,
    category: 'conv-math',
    kicker: { en: '3D Input & Filter Volumes', km: 'រូបភាព 3D និងជម្រៅ Filter' },
    title: {
      en: 'Convolutional Layer: 3D Depth Matching',
      km: 'ស្រទាប់ Convolutional៖ ទំហំ 3D និងជម្រៅរបស់ Filter',
    },
    subtitle: {
      en: '32 × 32 × 3 RGB image & 5 × 5 × 3 filter — Filters always extend the full depth of the input volume',
      km: 'រូបភាព ៣២×៣២×៣ និង Filter ៥×៥×៣ — Filter តែងតែលាតសន្ធឹងពេញជម្រៅនៃ Input Volume',
    },
    keyPoints: [
      {
        en: 'Color images have 3 dimensions: Height (32), Width (32), and Depth / Channels (3 for R, G, B).',
        km: 'រូបភាពពណ៌មាន ៣ វិមាត្រ៖ កម្ពស់ (32), ទទឹង (32) និងជម្រៅ/ឆានែល (3 សម្រាប់ RGB)។',
        detail: {
          en: 'Unlike a grayscale matrix (H×W×1), a CIFAR-10 color image is a 3D tensor of 32×32×3 = 3,072 numbers stacked across Red, Green, and Blue channels.',
          km: 'ខុសពីរូបភាពស-ខ្មៅ (H×W×1) រូបភាពពណ៌ RGB មានទម្រង់ 3D ទំហំ 32×32×3 = 3,072 តម្លៃត្រួតគ្នាលើស្រទាប់ពណ៌ ក្រហម បៃតង និងខៀវ។',
        },
      },
      {
        en: 'Filters are small spatially (5 × 5) but ALWAYS extend through the full depth (3) of the input volume.',
        km: 'Filter មានទំហំតូចតាមលំហ (5×5) ប៉ុន្តែតែងតែមានជម្រៅស្មើជម្រៅ Input ជានិច្ច (3)។',
        detail: {
          en: 'Because the filter spans all 3 channels simultaneously, it slides only along Height and Width (2D spatial convolution), never along Depth.',
          km: 'ដោយសារ Filter គ្របដណ្តប់គ្រប់ ៣ ឆានែលព្រមគ្នា វាត្រូវរំកិលតែតាមទិសទទឹង និងកម្ពស់ប៉ុណ្ណោះ (មិនរំកិលតាមជម្រៅទេ)។',
        },
      },
    ],
    formula: {
      expression: 'Input: H x W x C_in | Filter: F x F x C_in',
      latex: String.raw`\mathbf{I} \in \mathbb{R}^{H \times W \times C_{\text{in}}} \;(32\times 32\times 3), \qquad \mathbf{K} \in \mathbb{R}^{F \times F \times C_{\text{in}}} \;(5\times 5\times 3)`,
      derivationLatex: String.raw`\text{Condition: } \operatorname{depth}(\mathbf{K}) \equiv \operatorname{depth}(\mathbf{I}) = C_{\text{in}}`,
      caption: {
        en: 'Channel depth C_in must match between the input tensor and every convolutional filter',
        km: 'ជម្រៅឆានែល C_in របស់ Filter ត្រូវតែស្មើនឹងជម្រៅ Input ជានិច្ច',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 3',
      outputTensor: '1 Spatial Slide',
      operation: '5 × 5 × 3 Volumetric Filter',
      metrics: [
        { label: { en: 'Image Volume', km: 'ទំហំរូបភាព' }, value: '32×32×3', detail: '3,072 values' },
        { label: { en: 'Filter Volume', km: 'ទំហំ Filter' }, value: '5×5×3', detail: '75 weights' },
      ],
      pytorchSnippet: `# Input: [Batch, 3, 32, 32], Filter: [1, 3, 5, 5]
layer = nn.Conv2d(in_channels=3, out_channels=1, kernel_size=5)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Matching Input Depth', km: 'ការផ្គូផ្គងជម្រៅ Input' },
        narration: {
          en: 'A 32×32 RGB image has depth 3. Therefore, a 5×5 filter is actually a 5×5×3 block spanning Red, Green, and Blue simultaneously.',
          km: 'រូបភាព 32×32 RGB មានជម្រៅ 3។ ដូច្នេះ Filter 5×5 ត្រូវតែមានទំហំ 5×5×3 គ្របដណ្តប់ទាំង R, G, និង B ក្នុងពេលតែមួយ។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'conv-3d-volume',
  },
  {
    id: 17,
    category: 'conv-math',
    kicker: { en: '75-Dimensional Dot Product', km: 'ផលគុណស្កាលែ ៧៥ វិមាត្រ' },
    title: {
      en: 'Convolutional Layer: Activation Map Computation',
      km: 'ស្រទាប់ Convolutional៖ ការគណនា Activation Map',
    },
    subtitle: {
      en: 'Convolving 5 × 5 × 3 over 32 × 32 × 3 yields a 28 × 28 × 1 activation map',
      km: 'ការរំកិល Filter ៥×៥×៣ លើរូប ៣២×៣២×៣ បង្កើតបាន Activation Map ទំហំ ២៨×២៨×១',
    },
    keyPoints: [
      {
        en: '1 number = result of taking a dot product between the 5 × 5 × 3 filter and a 5 × 5 × 3 chunk of the image: 5 × 5 × 3 = 75-dimensional dot product + bias.',
        km: 'លេខ ១ ក្នុងលទ្ធផល បានមកពី Dot Product រវាង Filter (5×5×3) និងបំណែករូបភាព (5×5×3) គឺ 75 ធាតុ + bias។',
        detail: {
          en: 'Even though the image chunk is 3D (5×5×3 = 75 numbers), the dot product sums across all 3 channels at once to produce a single scalar output number (depth becomes 1).',
          km: 'ទោះបីបំណែករូបភាពជា 3D (5×5×3 = 75 លេខ) ក៏ដោយ ផលបូកគុណ Dot Product បញ្ចូលទាំង ៣ ឆានែលទៅជាលេខតែ ១ គត់ (ដូច្នេះជម្រៅលទ្ធផលគឺ 1)។',
        },
      },
      {
        en: 'Sliding over all spatial locations (32 − 5 + 1 = 28) yields one 28 × 28 × 1 activation map.',
        km: 'ការរំកិលគ្រប់ទីតាំង (32 − 5 + 1 = 28) បង្កើតបាន Activation Map ទំហំ 28×28×1។',
        detail: {
          en: 'Each of the 28×28 = 784 positions in the output map represents the exact same 75-weight filter applied at a different spatial (i, j) offset.',
          km: 'ក្រឡាទាំង 28×28 = 784 ក្នុងផែនទីលទ្ធផល គឺជាលទ្ធផលនៃការប្រើ Filter 75 ទម្ងន់ដដែលនៅទីតាំង (i, j) ខុសៗគ្នាលើរូបភាព។',
        },
      },
    ],
    formula: {
      expression: 'z = w^T x + b (75-dim dot product + 1 bias) => 28 x 28 x 1 Map',
      latex: String.raw`z_{i,j} = \mathbf{w}^\top \mathbf{x}_{i,j} + b = \sum_{c=1}^{3}\sum_{u=0}^{4}\sum_{v=0}^{4} I_{i+u,\, j+v,\, c}\, K_{u,v,c} + b`,
      derivationLatex: String.raw`\dim(\mathbf{w}) = 5 \times 5 \times 3 = 75, \qquad O = \frac{32 - 5}{1} + 1 = 28 \implies 28\times 28\times 1`,
      caption: {
        en: 'Spatial size shrinks from 32 to 28 when stride = 1 and padding = 0',
        km: 'ទំហំលំហថយពី 32 មក 28 នៅពេល stride = 1 និង padding = 0',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 3',
      outputTensor: '28 × 28 × 1',
      operation: '75-D Dot Product + Bias',
      metrics: [
        { label: { en: 'Dot Product Dim', km: 'វិមាត្រ Dot Product' }, value: '75 + 1', detail: '5×5×3 + b' },
        { label: { en: 'Activation Map', km: 'ទំហំ Activation Map' }, value: '28×28×1', detail: '784 neurons' },
      ],
      pytorchSnippet: `x = torch.randn(1, 3, 32, 32)
conv1 = nn.Conv2d(3, 1, kernel_size=5) # 75 weights + 1 bias = 76 params
y = conv1(x)                           # shape: [1, 1, 28, 28]`,
    },
    miniVideoSteps: [
      {
        title: { en: '75 Multiplications Per Output Pixel', km: 'ការគុណ ៧៥ ដងសម្រាប់ភីកសែលលទ្ធផល ១' },
        narration: {
          en: 'Each single pixel in the 28×28 activation map collapses a 5×5×3 = 75-element chunk into one scalar value plus a bias.',
          km: 'ភីកសែល ១ ក្នុង Activation Map 28×28 គណនាពីផលគុណបូកសរុប 5×5×3 = 75 ធាតុ បូកនឹង bias។',
        },
        highlightFormula: String.raw`5 \times 5 \times 3 + 1 = 76\text{ params} \to 28\times 28\times 1`,
        durationSec: 5,
      },
    ],
    visualType: 'conv-dot-product',
  },
  {
    id: 18,
    category: 'conv-math',
    kicker: { en: 'Multi-Filter Output Volume', km: 'Filter ច្រើនបង្កើត Output Volume' },
    title: {
      en: 'Convolutional Layer: Stacking Multiple Filters',
      km: 'ស្រទាប់ Convolutional៖ ការប្រើ Filter ច្រើនត្រួតគ្នា',
    },
    subtitle: {
      en: 'Using 6 filters of size 5 × 5 × 3 produces 6 separate 28 × 28 × 1 maps (28 × 28 × 6)',
      km: 'ការប្រើ Filter ៥×៥×៣ ចំនួន ៦ បង្កើតបាន Activation Maps ចំនួន ៦ សន្លឹក (២៨×២៨×៦)',
    },
    keyPoints: [
      {
        en: 'Each filter specializes in detecting a distinct visual feature (horizontal edges, red-green contrast, diagonal curves, etc.).',
        km: 'Filter នីមួយៗរៀនចាប់លក្ខណៈខុសៗគ្នា ដូចជា គែមដេក គែមបញ្ឈរ ឬពណ៌ផ្សេងៗ។',
        detail: {
          en: 'One filter alone can only detect one type of pattern. By training K separate filters in parallel (e.g. K = 6), the layer extracts 6 complementary visual representations simultaneously.',
          km: 'Filter តែមួយអាចចាប់បានតែលំនាំ ១ ប្រភេទប៉ុណ្ណោះ។ ការប្រើ Filter K ចំនួន ៦ ផ្សេងគ្នាជួយឱ្យស្រទាប់នេះទាញយកលក្ខណៈ ៦ យ៉ាងខុសគ្នាក្នុងពេលតែមួយ។',
        },
      },
      {
        en: '6 filters produce 6 separate 28 × 28 × 1 activation maps, stacked along depth into a 28 × 28 × 6 volume.',
        km: 'Filter 6 បង្កើតបានផែនទី 28×28×1 ចំនួន 6 សន្លឹក ដែលតម្រៀបត្រួតគ្នាជា Volume ទំហំ 28×28×6។',
        detail: {
          en: 'Total parameters equal 6 × (75 weights + 1 bias) = 456. Notice how the number of filters K directly sets the output channel depth C_out = 6.',
          km: 'ប៉ារ៉ាម៉ែត្រសរុបគឺ 6 × (75 ទម្ងន់ + 1 bias) = 456។ ចំនួន Filter K ជាអ្នកកំណត់ជម្រៅឆានែលលទ្ធផល C_out = 6។',
        },
      },
    ],
    formula: {
      expression: '6 * (5 * 5 * 3 + 1) = 456 parameters => 28 x 28 x 6 Output',
      latex: String.raw`\text{Output} \in \mathbb{R}^{O \times O \times K} = \mathbb{R}^{28\times 28\times 6}, \qquad \text{Params} = K \cdot (F \cdot F \cdot C_{\text{in}} + 1) = 6 \times (5\times 5\times 3 + 1) = 456`,
      caption: {
        en: 'Number of filters K directly determines the output volume depth',
        km: 'ចំនួន Filter (K) កំណត់ជម្រៅនៃ Output Volume ដោយផ្ទាល់',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 3',
      outputTensor: '28 × 28 × 6',
      operation: '6 Filters (5 × 5 × 3)',
      metrics: [
        { label: { en: 'Num Filters (K)', km: 'ចំនួន Filter (K)' }, value: '6', detail: 'Output depth' },
        { label: { en: 'Total Params', km: 'ប៉ារ៉ាម៉ែត្រសរុប' }, value: '456', detail: '6 × (75 + 1)' },
      ],
      pytorchSnippet: `conv6 = nn.Conv2d(in_channels=3, out_channels=6, kernel_size=5)
y = conv6(torch.randn(1, 3, 32, 32)) # [1, 6, 28, 28]`,
    },
    miniVideoSteps: [
      {
        title: { en: 'One Activation Map Per Filter', km: 'Activation Map ១ សម្រាប់ Filter ១' },
        narration: {
          en: 'With 6 independent 5×5×3 filters scanning the same 32×32×3 image, we stack their 6 outputs into a 28×28×6 tensor.',
          km: 'Filter ចំនួន 6 ស្កេនរូប 32×32×3 ដូចគ្នា ហើយតម្រៀបលទ្ធផលជា Volume 28×28×6។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'conv-stacked-maps',
  },
  {
    id: 19,
    category: 'conv-math',
    kicker: { en: 'Deep Layer Pipeline', km: 'លំដាប់ស្រទាប់ជ្រៅនៃ CNN' },
    title: {
      en: 'Convolutional Layer: Sequence of Conv + ReLU',
      km: 'ស្រទាប់ Convolutional៖ លំដាប់ Conv និងអនុគមន៍ ReLU',
    },
    subtitle: {
      en: 'CNN is a sequence of convolutional layers interspersed with non-linear activation functions',
      km: 'CNN គឺជាលំដាប់នៃស្រទាប់ Convolutional ឆ្លាស់គ្នាជាមួយអនុគមន៍ ReLU',
    },
    keyPoints: [
      {
        en: 'Layer 1: 32 × 32 × 3 → (6 filters 5 × 5 × 3 + ReLU) → 28 × 28 × 6.',
        km: 'ស្រទាប់ទី១៖ 32×32×3 → (Filter 5×5×3 ចំនួន 6 + ReLU) → 28×28×6។',
        detail: {
          en: 'After computing the 6 activation maps, ReLU(z) = max(0, z) introduces non-linearity element-wise—preventing multiple convolutional layers from collapsing into a single linear transform.',
          km: 'បន្ទាប់ពីគណនាផែនទីទាំង 6 អនុគមន៍ ReLU(z) = max(0, z) បង្កើតភាពមិនលីនេអ៊ែរ ដើម្បីការពារកុំឱ្យស្រទាប់ច្រើនរួមបញ្ចូលគ្នាដូចស្រទាប់លីនេអ៊ែរតែមួយ។',
        },
      },
      {
        en: 'Layer 2: 28 × 28 × 6 → (10 filters 5 × 5 × 6 + ReLU) → 24 × 24 × 10 — depth grows while spatial size shrinks!',
        km: 'ស្រទាប់ទី២៖ 28×28×6 → (Filter 5×5×6 ចំនួន 10 + ReLU) → 24×24×10 — ជម្រៅកើនឡើង ខណៈទំហំទទឹង/បណ្តោយថយចុះ!',
        detail: {
          en: 'Notice Layer 2 filters automatically adopt depth 6 to match Layer 1’s 6 channels. With 10 filters, Layer 2 has 10 × (5×5×6 + 1) = 1,510 parameters and outputs 24×24×10.',
          km: 'Filter នៅស្រទាប់ទី២ ត្រូវមានជម្រៅ 6 ដើម្បីត្រូវនឹង 6 ឆានែលរបស់ស្រទាប់ទី១។ ជាមួយ 10 Filters វាមាន 10 × (5×5×6 + 1) = 1,510 ប៉ារ៉ាម៉ែត្រ និងផ្តល់ទំហំ 24×24×10។',
        },
      },
    ],
    formula: {
      expression: 'ReLU(z) = max(0, z) | 32x32x3 -> 28x28x6 -> 24x24x10',
      latex: String.raw`\operatorname{ReLU}(z) = \max(0, z), \qquad 32\times 32\times 3 \xrightarrow{\text{6 @ } 5\times 5\times 3} 28\times 28\times 6 \xrightarrow{\text{10 @ } 5\times 5\times 6} 24\times 24\times 10`,
      derivationLatex: String.raw`\text{Params}_1 = 6(75+1) = 456, \qquad \text{Params}_2 = 10(5\cdot 5\cdot 6 + 1) = 1{,}510`,
      caption: {
        en: 'Without ReLU non-linearity, stacked linear convolutions collapse to a single linear layer',
        km: 'បើគ្មាន ReLU ទេ ស្រទាប់ Convolution ច្រើនជាន់នឹងរួមបញ្ចូលគ្នាជាលីនេអ៊ែរតែមួយ',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 3',
      outputTensor: '24 × 24 × 10',
      operation: 'Conv(6)→ReLU→Conv(10)→ReLU',
      metrics: [
        { label: { en: 'Layer 1 Params', km: 'ប៉ារ៉ាម៉ែត្រ L1' }, value: '456', detail: '6×(5×5×3+1)' },
        { label: { en: 'Layer 2 Params', km: 'ប៉ារ៉ាម៉ែត្រ L2' }, value: '1,510', detail: '10×(5×5×6+1)' },
      ],
      pytorchSnippet: `net = nn.Sequential(
    nn.Conv2d(3, 6, 5), nn.ReLU(),   # -> 28x28x6
    nn.Conv2d(6, 10, 5), nn.ReLU(),  # -> 24x24x10
)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Chaining Convolutional Layers', km: 'ការតភ្ជាប់ស្រទាប់ Convolutional បន្តបន្ទាប់' },
        narration: {
          en: 'Notice how Layer 2 filters have depth 6 to match Layer 1 output! ReLU zeros out negative values after every convolution.',
          km: 'Filter នៅស្រទាប់ទី២ មានជម្រៅ 6 ដើម្បីត្រូវនឹងលទ្ធផលស្រទាប់ទី១។ ReLU លុបតម្លៃអវិជ្ជមានចោលក្រោយ Convolution នីមួយៗ។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'conv-sequence',
  },
  {
    id: 20,
    category: 'conv-math',
    kicker: { en: 'Receptive Field Hierarchy', km: 'ឋានានុក្រមនៃ Receptive Field' },
    title: {
      en: 'How CNNs Learn to Recognize Images',
      km: 'របៀបដែល CNN រៀនស្គាល់រូបភាព',
    },
    subtitle: {
      en: 'Multiple filters extract parallel low-level cues and merge them deeper in the network',
      km: 'Filter ច្រើនទាញយកលក្ខណៈស្របគ្នា ហើយបញ្ចូលគ្នានៅស្រទាប់ជ្រៅជាងមុន (DeepLearning.TV, 2015)',
    },
    keyPoints: [
      {
        en: 'Filter 1, Filter 2, Filter 3, and Filter 4 each examine overlapping local receptive fields across the image.',
        km: 'Filter ១, ២, ៣, និង ៤ ពិនិត្យតំបន់ Receptive Field តូចៗស្របគ្នាលើរូបភាព។',
        detail: {
          en: 'Each neuron in Layer 1 only receives input from a small local patch (its Receptive Field). Running Filters 1–4 in parallel lets the network see edges, gradients, and colors simultaneously at every spot.',
          km: 'ណឺរ៉ូននីមួយៗក្នុងស្រទាប់ទី១ មើលឃើញតែតំបន់តូចមួយ (Receptive Field)។ ការរត់ Filter ១–៤ ស្របគ្នាជួយឱ្យបណ្តាញចាប់គែម និងពណ៌ច្រើនប្រភេទព្រមគ្នា។',
        },
      },
      {
        en: 'Successive layers combine responses from multiple filters to see larger, more semantic patterns.',
        km: 'ស្រទាប់បន្ទាប់បូកបញ្ចូលលទ្ធផលពី Filter ច្រើនដើម្បីមើលឃើញរូបរាងធំ និងមានន័យជាងមុន។',
        detail: {
          en: 'Because a Layer 2 filter looks at a patch of Layer 1 outputs, its effective receptive field on the original image grows wider—allowing small 3×3 filters stacked deeply to see entire objects.',
          km: 'ដោយសារស្រទាប់ទី២ ពិនិត្យលើលទ្ធផលរបស់ស្រទាប់ទី១ ដែនទទួលរូបភាពរបស់វាកាន់តែរីកធំឡើង រហូតអាចមើលឃើញវត្ថុទាំងមូលនៅស្រទាប់ជ្រៅ។',
        },
      },
    ],
    formula: {
      expression: 'r_l = r_(l-1) + (F_l - 1) * prod(S_i)',
      latex: String.raw`r_l = r_{l-1} + (F_l - 1)\prod_{i=1}^{l-1} S_i, \qquad (F=3, S=1 \implies r_1=3,\; r_2=5,\; r_3=7)`,
      caption: {
        en: 'Effective Receptive Field r_l expands linearly with stacked convolutional layers',
        km: 'ដែនទទួលរូបភាព (Receptive Field r_l) ពង្រីកកាន់តែធំទៅតាមជម្រៅស្រទាប់',
      },
    },
    specs: {
      inputTensor: 'Local Pixel Patches',
      outputTensor: 'Hierarchical Abstractions',
      operation: 'Multi-Filter Pyramid',
      metrics: [
        { label: { en: 'Receptive Field', km: 'ដែនទទួលរូបភាព' }, value: 'Expands', detail: 'Layer by layer' },
        { label: { en: 'Abstraction', km: 'កម្រិតអរូបី' }, value: 'Low → High', detail: 'Edges → Objects' },
      ],
      pytorchSnippet: `# Receptive field grows with depth:
# Layer 1 (3x3) -> sees 3x3 pixels
# Layer 2 (3x3) -> sees 5x5 pixels
# Layer 3 (3x3) -> sees 7x7 pixels`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Parallel Filter Cones', km: 'កោណនៃ Filter ស្របគ្នា' },
        narration: {
          en: 'Each layer applies a bank of filters across the spatial grid; deeper layers aggregate wider regions of the original image.',
          km: 'ស្រទាប់នីមួយៗប្រើក្រុម Filter ច្រើនស្របគ្នា ហើយស្រទាប់កាន់តែជ្រៅអាចមើលឃើញតំបន់រូបភាពកាន់តែធំ។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'conv-learn-pyramid',
    citation: 'From the video of DeepLearning.TV, 2015 (youtube.com/watch?v=JiN9p5vWHDY)',
  },
  {
    id: 21,
    category: 'conv-math',
    kicker: { en: 'Hierarchical Feature Visualization', km: 'រូបភាពលក្ខណៈតាមលំដាប់ស្រទាប់' },
    title: {
      en: 'How CNNs Learn: Face Recognition Hierarchy',
      km: 'ការរៀនតាមលំដាប់ថ្នាក់៖ ការស្គាល់ផ្ទៃមុខ (Face Recognition)',
    },
    subtitle: {
      en: 'Layer 1 (Edges & Corners) → Layer 2 (Eyes, Nose, Ears) → Layer 3 (Whole Face)',
      km: 'ស្រទាប់ ១ (គែម/ជ្រុង) → ស្រទាប់ ២ (ភ្នែក ច្រមុះ ត្រចៀក) → ស្រទាប់ ៣ (ផ្ទៃមុខទាំងមូល)',
    },
    keyPoints: [
      {
        en: 'Layer 1 learns generic oriented edges, color blobs, and corners.',
        km: 'ស្រទាប់ទី ១ រៀនស្គាល់គែមបញ្ឈរ គែមដេក គែមទ្រេត និងជ្រុងនានា។',
        detail: {
          en: 'These low-level detectors resemble classical Gabor filters and are universal across almost all natural images—whether faces, cars, or animals.',
          km: 'ឧបករណ៍ចាប់គែមនៅស្រទាប់ដំបូងនេះមានលក្ខណៈជាសកល អាចប្រើរួមគ្នាសម្រាប់ស្គាល់គ្រប់ប្រភេទរូបភាព មិនថាផ្ទៃមុខ រថយន្ត ឬសត្វឡើយ។',
        },
      },
      {
        en: 'Layer 2 assembles edges into object parts (eyes, noses, ears, mouths).',
        km: 'ស្រទាប់ទី ២ ផ្គុំគែមទាំងនោះជាផ្នែកនៃផ្ទៃមុខ ដូចជា ភ្នែក ច្រមុះ ត្រចៀក មាត់។',
        detail: {
          en: 'By combining specific arrangements of curved and straight edges from Layer 1, mid-level neurons fire selectively for recognizable anatomical components.',
          km: 'ដោយផ្សំគែមត្រង់ និងគែមកោងពីស្រទាប់ទី១ ណឺរ៉ូនកម្រិតកណ្តាលអាចស្គាល់ផ្នែកជាក់លាក់ដូចជា ភ្នែក ច្រមុះ និងត្រចៀក។',
        },
      },
      {
        en: 'Layer 3 combines facial parts into complete high-level face representations.',
        km: 'ស្រទាប់ទី ៣ ផ្សំផ្នែកទាំងអស់ទៅជាទម្រង់ផ្ទៃមុខពេញលេញ។',
        detail: {
          en: 'Deeper layers encode entire facial structures and identities, enabling accurate classification even across varied lighting or expressions.',
          km: 'ស្រទាប់កាន់តែជ្រៅផ្គុំភ្នែក ច្រមុះ មាត់ ទៅជាផ្ទៃមុខពេញលេញ ដែលជួយឱ្យការស្គាល់មុខមានភាពត្រឹមត្រូវខ្ពស់។',
        },
      },
    ],
    formula: {
      expression: 'h^(1) (Edges) -> h^(2) (Parts) -> h^(3) (Whole Face)',
      latex: String.raw`\mathbf{x} \xrightarrow{\phi_1} \mathbf{h}^{(1)}_{\text{edges}} \xrightarrow{\phi_2} \mathbf{h}^{(2)}_{\text{parts}} \xrightarrow{\phi_3} \mathbf{h}^{(3)}_{\text{whole face}}`,
      caption: {
        en: 'Deep representations form a compositional hierarchy of visual concepts',
        km: 'លក្ខណៈសម្គាល់បង្កើតជាឋានានុក្រមតាមលំដាប់ថ្នាក់ពីគែមទៅជាផ្ទៃមុខពេញលេញ',
      },
    },
    specs: {
      inputTensor: 'Face Image',
      outputTensor: 'Identity / Face Embedding',
      operation: '3-Stage Feature Hierarchy',
      metrics: [
        { label: { en: 'Layer 1', km: 'ស្រទាប់ទី ១' }, value: 'Edges', detail: 'Low-level' },
        { label: { en: 'Layer 2', km: 'ស្រទាប់ទី ២' }, value: 'Parts', detail: 'Eye, nose, ear' },
        { label: { en: 'Layer 3', km: 'ស្រទាប់ទី ៣' }, value: 'Whole Face', detail: 'High-level' },
      ],
      pytorchSnippet: `# Progressive abstraction in CNN feature extractors:
# early_layers -> Gabor-like edge filters
# mid_layers   -> textures & facial parts
# deep_layers  -> whole face / semantic classes`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Three Levels of Visual Abstraction', km: 'កម្រិតអរូបី ៣ ថ្នាក់ក្នុងការមើលឃើញ' },
        narration: {
          en: 'Inspecting trained CNN weights reveals a natural visual hierarchy: Gabor-like edges in Layer 1, facial parts in Layer 2, and full faces in Layer 3.',
          km: 'ការមើលទម្ងន់ CNN ដែលហ្វឹកហាត់រួចបង្ហាញ៖ ស្រទាប់ ១ ចាប់គែម ស្រទាប់ ២ ចាប់ភ្នែក/ច្រមុះ និងស្រទាប់ ៣ ចាប់ផ្ទៃមុខទាំងមូល។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'conv-face-hierarchy',
    citation: 'From the video of Luis Serrano, 2017',
  },
  {
    id: 22,
    category: 'conv-math',
    kicker: { en: 'Output Size Formula & Stride', km: 'រូបមន្តគណនាទំហំលទ្ធផល និង Stride' },
    title: {
      en: 'A Closer Look at Spatial Dimensions',
      km: 'ការពិនិត្យលម្អិតលើវិមាត្រលំហ (Spatial Dimensions & Stride)',
    },
    subtitle: {
      en: 'Output Size = (N − F) / stride + 1 — Why stride 3 fails on a 7 × 7 input with a 3 × 3 filter',
      km: 'ទំហំលទ្ធផល = (N − F) / stride + 1 — មូលហេតុដែល Stride 3 មិនសមនឹង 7×7 (បាន 2.33)',
    },
    keyPoints: [
      {
        en: 'For N = 7, F = 3: Stride 1 ⇒ (7−3)/1 + 1 = 5; Stride 2 ⇒ (7−3)/2 + 1 = 3.',
        km: 'សម្រាប់ N=7, F=3៖ Stride 1 ⇒ (7−3)/1 + 1 = 5; Stride 2 ⇒ (7−3)/2 + 1 = 3។',
        detail: {
          en: 'Stride S controls how many pixels the filter jumps each step. Increasing Stride from 1 to 2 downsamples the feature map from 5×5 down to 3×3 cleanly.',
          km: 'Stride S កំណត់ចំនួនភីកសែលដែល Filter លោតក្នុង ១ ជំហាន។ ការប្តូរពី Stride 1 ទៅ 2 បង្រួមទំហំលទ្ធផលពី 5×5 មកត្រឹម 3×3 យ៉ាងស្អាត។',
        },
      },
      {
        en: 'Stride 3 ⇒ (7−3)/3 + 1 = 2.33 (does NOT fit evenly — invalid without padding or cropping!).',
        km: 'Stride 3 ⇒ (7−3)/3 + 1 = 2.33 (មិនចែកដាច់ — មិនអាចប្រើបានទេបើគ្មាន Padding)!',
        detail: {
          en: 'After starting at column 0 and jumping 3 pixels to column 3, the next jump lands on column 6—leaving only 1 pixel instead of 3! Whenever (N−F)/S+1 is not an integer, the filter cannot fit symmetrically.',
          km: 'ពេលចាប់ផ្តើមនៅជួរ 0 រួចលោត 3 ជំហានទៅជួរ 3 ជំហានបន្ទាប់ធ្លាក់នៅជួរ 6 ដែលសល់តែ 1 ភីកសែលមិនគ្រប់ 3×3 ទេ។ ដូច្នេះលទ្ធផល 2.33 មិនអាចប្រើបានឡើយ។',
        },
      },
    ],
    formula: {
      expression: 'O = (N - F) / S + 1',
      latex: String.raw`O = \frac{N - F}{\text{stride}} + 1 \qquad (N=7,\; F=3)`,
      derivationLatex: String.raw`\text{Stride } 1 \Rightarrow \frac{7-3}{1}+1 = 5,\quad \text{Stride } 2 \Rightarrow \frac{7-3}{2}+1 = 3,\quad \text{Stride } 3 \Rightarrow \frac{7-3}{3}+1 = 2.33 \notin \mathbb{Z}\; (\text{not fit})`,
      caption: {
        en: 'Must evaluate to a whole integer for symmetric coverage across the input grid',
        km: 'លទ្ធផល O ត្រូវតែជាចំនួនគត់ ទើប Filter អាចរំកិលគ្រប់ក្រឡាបានស្មើគ្នា',
      },
    },
    specs: {
      inputTensor: 'N × N (e.g. 7 × 7)',
      outputTensor: 'O × O (5×5, 3×3, or Invalid)',
      operation: 'Strided Convolution',
      metrics: [
        { label: { en: 'Stride 1', km: 'Stride 1' }, value: '5 × 5', detail: 'Valid integer' },
        { label: { en: 'Stride 2', km: 'Stride 2' }, value: '3 × 3', detail: 'Valid integer' },
        { label: { en: 'Stride 3', km: 'Stride 3' }, value: '2.33', detail: 'Does not fit' },
      ],
      pytorchSnippet: `def output_size(N, F, stride, pad=0):
    val = (N + 2 * pad - F) / stride + 1
    return val  # 7, 3, stride=3 -> 2.333 (not fit!)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Testing Strides 1, 2, and 3 on 7×7', km: 'សាកល្បង Stride 1, 2, និង 3 លើ 7×7' },
        narration: {
          en: 'With N=7 and F=3, Stride 1 lands cleanly 5 times. Stride 2 lands cleanly 3 times. Stride 3 overshoots the edge (2.33)!',
          km: 'ជាមួយ N=7 និង F=3៖ Stride 1 ដើរបាន 5 ជំហាន Stride 2 ដើរបាន 3 ជំហាន ចំណែក Stride 3 លៀនចេញក្រៅស៊ុម (2.33)។',
        },
        highlightFormula: String.raw`\frac{7 - 3}{3} + 1 = 2.33\text{ (Not Fit)}`,
        durationSec: 5,
      },
    ],
    visualType: 'spatial-stride',
  },
  {
    id: 23,
    category: 'conv-math',
    kicker: { en: 'Preserving Spatial Resolution', km: 'ការរក្សាទំហំរូបភាពដោយ Zero Padding' },
    title: {
      en: 'Zero Padding',
      km: 'ការបន្ថែមសូន្យជុំវិញគែម (Zero Padding)',
    },
    subtitle: {
      en: 'Zero-padding with P = (F − 1) / 2 preserves input size (e.g. 7 × 7 → 7 × 7) and keeps border info',
      km: 'ការថែម 0 ចំនួន P = (F − 1) / 2 ជួយរក្សាទំហំលទ្ធផលឱ្យស្មើដើម (7×7 → 7×7)',
    },
    keyPoints: [
      {
        en: 'Without padding, every conv layer shrinks the feature map and under-uses border pixels.',
        km: 'បើគ្មាន Padding ទេ ទំហំរូបភាពរួមតូចរៀងរាល់ស្រទាប់ ហើយភីកសែលគែមមិនសូវត្រូវបានគណនា។',
        detail: {
          en: 'Interior pixels are visited multiple times by the sliding filter, whereas corner pixels are only touched once. Moreover, shrinking spatial resolution after every layer prevents building very deep networks.',
          km: 'ភីកសែលនៅកណ្តាលត្រូវ Filter ឆ្លងកាត់ច្រើនដង ខណៈភីកសែលនៅគែមត្រូវបានប្រើតិចតួច ហើយទំហំរូបភាពរួមតូចលឿនពេកមិនអាចសាងសង់បណ្តាញជ្រៅបានទេ។',
        },
      },
      {
        en: 'With stride 1 and F × F filter, zero-padding P = (F−1)/2 keeps output size identical: F=3⇒P=1, F=5⇒P=2, F=7⇒P=3.',
        km: 'ជាមួយ stride 1 ការថែម P = (F−1)/2 រក្សាទំហំដូចដើម៖ F=3⇒P=1, F=5⇒P=2, F=7⇒P=3។',
        detail: {
          en: 'Adding P pixels of 0 around all 4 sides expands the effective grid to N + 2P. Setting 2P = F − 1 makes (N + 2P − F) + 1 = N, preserving the exact height and width ("Same Padding").',
          km: 'ការបន្ថែមលេខ 0 ចំនួន P ជុំវិញស៊ុម ពង្រីកទំហំទៅជា N + 2P។ ការជ្រើស 2P = F − 1 ធ្វើឱ្យលទ្ធផលស្មើ N ដូចដើមបេះបិទ។',
        },
      },
    ],
    formula: {
      expression: 'O = (N + 2P - F) / S + 1 | P = (F - 1) / 2',
      latex: String.raw`O = \frac{N + 2P - F}{S} + 1, \qquad \text{Same-Padding } (S=1):\; P = \frac{F - 1}{2}`,
      derivationLatex: String.raw`\frac{N + 2P - F}{1} + 1 = N \iff 2P = F - 1 \implies \begin{cases} F=3 \Rightarrow P=1 \\ F=5 \Rightarrow P=2 \\ F=7 \Rightarrow P=3 \end{cases}`,
      caption: {
        en: 'For N=7, F=3, P=1, S=1: (7 + 2(1) − 3) / 1 + 1 = 7 (Same size as input)',
        km: 'សម្រាប់ N=7, F=3, P=1, S=1៖ (7 + 2 − 3) / 1 + 1 = 7 (រក្សាទំហំស្មើដើម)',
      },
    },
    specs: {
      inputTensor: '7 × 7 (+1 zero border = 9 × 9)',
      outputTensor: '7 × 7 (Same Size!)',
      operation: 'Zero-Padded Convolution',
      metrics: [
        { label: { en: 'F = 3', km: 'F = 3' }, value: 'P = 1', detail: '1px border' },
        { label: { en: 'F = 5', km: 'F = 5' }, value: 'P = 2', detail: '2px border' },
        { label: { en: 'F = 7', km: 'F = 7' }, value: 'P = 3', detail: '3px border' },
      ],
      pytorchSnippet: `# "Same" spatial dimensions with stride=1:
conv_3x3 = nn.Conv2d(64, 64, kernel_size=3, padding=1)  # (3-1)/2 = 1
conv_5x5 = nn.Conv2d(64, 64, kernel_size=5, padding=2)  # (5-1)/2 = 2`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Wrapping a 1-Pixel Zero Border', km: 'ការបន្ថែមស៊ុមលេខ 0 ទំហំ ១ ភីកសែល' },
        narration: {
          en: 'Adding a 1-pixel border of zeros turns a 7×7 grid into 9×9. Now a 3×3 filter outputs (9−3)+1 = 7×7 — preserving exact spatial size!',
          km: 'ការថែមស៊ុម 0 ជុំវិញធ្វើឱ្យ 7×7 ក្លាយជា 9×9។ Filter 3×3 ផ្តល់លទ្ធផល (9−3)+1 = 7×7 ស្មើទំហំដើមវិញ!',
        },
        highlightFormula: String.raw`P = \frac{F - 1}{2}`,
        durationSec: 5,
      },
    ],
    visualType: 'padding',
  },
  {
    id: 24,
    category: 'conv-math',
    kicker: { en: 'Channel-Wise Projection', km: 'ការបញ្ចូលគ្នាតាមឆានែល (1×1 CONV)' },
    title: {
      en: '1 × 1 Convolution',
      km: 'ប្រតិបត្តិការ 1 × 1 Convolution',
    },
    subtitle: {
      en: 'Does it make sense? Yes — each 1 × 1 × 64 filter performs a 64-dimensional dot product across channels',
      km: 'តើ 1×1 CONV មានន័យអ្វី? វាគណនា Dot Product ៦៤ វិមាត្រឆ្លងកាត់ឆានែលនៅគ្រប់ភីកសែល',
    },
    keyPoints: [
      {
        en: 'For a 32 × 32 × 64 volume, a 1 × 1 filter actually has size 1 × 1 × 64 (full depth)!',
        km: 'លើ Volume 32×32×64, Filter 1×1 មានទំហំពិតប្រាកដ 1×1×64 (គ្របពេញជម្រៅ 64)!',
        detail: {
          en: 'While a 1×1 filter on a 2D grayscale image would just multiply by a scalar, on a 64-channel volume it acts like a shared fully-connected neuron looking at all 64 channels at each spatial coordinate (i, j).',
          km: 'លើរូបភាព 2D ធម្មតា 1×1 គ្រាន់តែគុណលេខ ១ ខ្ទង់ ប៉ុន្តែលើ Volume មាន 64 ឆានែល វាដំណើរការដូចណឺរ៉ូនគុណឆ្លងកាត់គ្រប់ 64 ឆានែលត្រង់ចំណុច (i, j) នីមួយៗ។',
        },
      },
      {
        en: 'Applying 128 filters transforms 32 × 32 × 64 → 32 × 32 × 128 (expanding or compressing channel depth + adding ReLU).',
        km: 'ការប្រើ Filter ចំនួន 128 បម្លែង 32×32×64 → 32×32×128 (ពង្រីក ឬបង្រួមជម្រៅឆានែលយ៉ាងមានប្រសិទ្ធភាព)។',
        detail: {
          en: '1×1 convolutions let architects cheaply increase channels (64→128) or shrink channels as a bottleneck (256→64) before expensive 3×3 or 5×5 layers, saving massive FLOPs.',
          km: '1×1 CONV អនុញ្ញាតឱ្យវិស្វករពង្រីក ឬបង្រួមចំនួនឆានែលយ៉ាងរហ័សមុនស្រទាប់ 3×3 ឬ 5×5 ដែលជួយសន្សំកម្លាំងគណនាបានយ៉ាងច្រើន។',
        },
      },
    ],
    formula: {
      expression: '(32 x 32 x 64) * (128 x [1 x 1 x 64]) => 32 x 32 x 128',
      latex: String.raw`y_{i,j,k} = \sum_{c=1}^{64} x_{i,j,c}\, w_{k,c} + b_k, \qquad \mathbb{R}^{32\times 32\times 64} \xrightarrow{128\times (1\times 1\times 64)} \mathbb{R}^{32\times 32\times 128}`,
      derivationLatex: String.raw`\text{Params} = 128 \times (1 \cdot 1 \cdot 64 + 1) = 8{,}320`,
      caption: {
        en: 'Used heavily in GoogLeNet (Inception) and ResNet bottlenecks to control channel dimensionality',
        km: 'ប្រើប្រាស់យ៉ាងទូលំទូលាយក្នុង GoogLeNet និង ResNet ដើម្បីគ្រប់គ្រងចំនួនឆានែល',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 64',
      outputTensor: '32 × 32 × 128',
      operation: '1 × 1 × 64 Channel Dot Product',
      metrics: [
        { label: { en: 'Spatial Size', km: 'ទំហំលំហ' }, value: '32 × 32', detail: 'Unchanged' },
        { label: { en: 'Depth Change', km: 'ជម្រៅឆានែល' }, value: '64 → 128', detail: '128 filters' },
        { label: { en: 'Params', km: 'ប៉ារ៉ាម៉ែត្រ' }, value: '8,320', detail: '128×(64+1)' },
      ],
      pytorchSnippet: `conv_1x1 = nn.Conv2d(in_channels=64, out_channels=128, kernel_size=1)
y = conv_1x1(torch.randn(1, 64, 32, 32)) # [1, 128, 32, 32]`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Pointwise Channel Mixing', km: 'ការលាយឆានែលត្រង់ភីកសែលនីមួយៗ' },
        narration: {
          en: 'On a 2D image, 1×1 just scales pixels. On a 64-channel volume, 1×1×64 is a mini neural network operating across all 64 channels at every (x, y) location!',
          km: 'លើ Volume មាន 64 ឆានែល Filter 1×1×64 ធ្វើ Dot Product ឆ្លងកាត់ទាំង 64 ឆានែលនៅគ្រប់ចំណុច (x, y) ដើម្បីបង្កើតឆានែលថ្មី។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'conv-1x1',
  },
  {
    id: 25,
    category: 'pooling-fc',
    kicker: { en: 'Spatial Downsampling', km: 'ការបង្រួមទំហំដោយ Pooling' },
    title: {
      en: 'Down Sampling with Max Pooling',
      km: 'ការបង្រួមទិន្នន័យដោយ Max Pooling',
    },
    subtitle: {
      en: 'Makes representations smaller & more manageable while preserving channel depth',
      km: 'ធ្វើឱ្យទំហំទិន្នន័យតូច និងងាយគ្រប់គ្រង ដោយរក្សាជម្រៅ (Depth) ដដែល',
    },
    keyPoints: [
      {
        en: 'Operates independently over each activation map — depth dimension is preserved!',
        km: 'ដំណើរការដាច់ដោយឡែកលើ Activation Map នីមួយៗ (ជម្រៅនៅរក្សាដដែល)។',
        detail: {
          en: 'Unlike Convolution, Pooling never mixes channels together and introduces zero learnable weights. If 24 maps enter a pooling layer, 24 downsampled maps exit.',
          km: 'ខុសពី Convolution, Pooling មិនលាយឆានែលចូលគ្នា និងគ្មានទម្ងន់ត្រូវរៀនទេ។ បើមាន 24 ផែនទីចូល នឹងមាន 24 ផែនទីតូចជាងមុនចេញមកវិញ។',
        },
      },
      {
        en: 'Max pool with 2 × 2 filter and stride 2 takes the maximum of each 2 × 2 block: [1,2,5,6]→6, [4,6,7,8]→8, [3,2,1,2]→3, [1,0,3,4]→4.',
        km: 'Max Pool 2×2, Stride 2 ជ្រើសរើសតម្លៃធំបំផុតក្នុងប្លុកនីមួយៗ៖ [1,2,5,6]→6, [4,6,7,8]→8, [3,2,1,2]→3, [1,0,3,4]→4។',
        detail: {
          en: 'Keeping the maximum activation means: "Did this feature appear anywhere inside this 2×2 region?" This gives local shift invariance while cutting spatial memory and computation by 75%.',
          km: 'ការយកតម្លៃធំបំផុតមានន័យថា "តើលក្ខណៈនោះលេចឡើងក្នុងប្លុក 2×2 នេះឬទេ?" ដែលជួយឱ្យធន់នឹងការរំកិលតិចតួច និងកាត់បន្ថយការគណនាដល់ 75%។',
        },
      },
    ],
    formula: {
      expression: 'MaxPool_2x2([1,2; 5,6]) = 6 | Depth C_out = C_in',
      latex: String.raw`P_{i,j,c} = \max_{0 \le u,v < F_p} A_{S\cdot i + u,\; S\cdot j + v,\; c}, \qquad \begin{bmatrix} 1 & 2 & 4 & 6 \\ 5 & 6 & 7 & 8 \\ 3 & 2 & 1 & 0 \\ 1 & 2 & 3 & 4 \end{bmatrix} \xrightarrow{2\times 2,\, S=2} \begin{bmatrix} 6 & 8 \\ 3 & 4 \end{bmatrix}`,
      derivationLatex: String.raw`O = \frac{4 - 2}{2} + 1 = 2, \qquad C_{\text{out}} = C_{\text{in}}, \qquad \text{Learnable Params} = 0`,
      caption: {
        en: 'Reduces spatial resolution by 2× (75% fewer activations) with zero learnable weights',
        km: 'កាត់បន្ថយទំហំលំហ ២ ដង (៧៥% នៃភីកសែល) ដោយមិនមានទម្ងន់ត្រូវរៀនបន្ថែម',
      },
    },
    specs: {
      inputTensor: '4 × 4 × C',
      outputTensor: '2 × 2 × C',
      operation: '2 × 2 Max Pooling, Stride 2',
      metrics: [
        { label: { en: 'Learnable Params', km: 'ប៉ារ៉ាម៉ែត្រត្រូវរៀន' }, value: '0', detail: 'Fixed op' },
        { label: { en: 'Size Reduction', km: 'ការបង្រួមទំហំ' }, value: '75%', detail: '4×4 → 2×2' },
      ],
      pytorchSnippet: `pool = nn.MaxPool2d(kernel_size=2, stride=2)
x = torch.tensor([[[[1.,2.,4.,6.],[5.,6.,7.,8.],[3.,2.,1.,0.],[1.,2.,3.,4.]]]])
out = pool(x)  # [[[[6., 8.], [3., 4.]]]]`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Taking the Strongest Signal in Each 2×2 Patch', km: 'យកតម្លៃខ្លាំងបំផុតក្នុងប្លុក ២×២ នីមួយៗ' },
        narration: {
          en: 'Max Pooling divides each map into non-overlapping 2×2 tiles and keeps only the maximum activation, adding slight shift invariance and shrinking computation.',
          km: 'Max Pooling ចែកតារាងជាប្លុក 2×2 ហើយយកតែតម្លៃខ្ពស់បំផុតក្នុងប្លុកនីមួយៗ ដើម្បីកាត់បន្ថយទំហំគណនា។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'max-pooling',
  },
  {
    id: 26,
    category: 'pooling-fc',
    kicker: { en: 'End-to-End Classification Head', km: 'ស្រទាប់ Fully Connected (FC) ចុងក្រោយ' },
    title: {
      en: 'Fully Connected (FC) Layer',
      km: 'ស្រទាប់ Fully Connected (FC) ក្នុង CNN',
    },
    subtitle: {
      en: 'Flattening the final 8 × 8 × 24 volume into 1,536 features → 256 → 10 class outputs',
      km: 'ពន្លា Volume ចុងក្រោយ ៨×៨×២៤ ទៅជា ១,៥៣៦ → ២៥៦ → ១០ ថ្នាក់ទស្សន៍ទាយ',
    },
    keyPoints: [
      {
        en: 'Feature Extractor: 32×32×3 → CONV+ReLU (8 3×3) → 32×32×8 → MaxPool → 16×16×8 → CONV+ReLU (24 3×3) → 16×16×24 → MaxPool → 8×8×24.',
        km: 'ផ្នែកទាញលក្ខណៈ៖ 32×32×3 → CONV+ReLU (8) → MaxPool (16×16×8) → CONV+ReLU (24) → MaxPool (8×8×24)។',
        detail: {
          en: 'Notice the classic CNN pyramid pattern: spatial dimensions steadily halve (32→16→8) via pooling while channel depth grows (3→8→24) to encode richer high-level concepts.',
          km: 'សង្កេតមើលលំនាំ CNN ស្តង់ដារ៖ ទំហំលំហថយចុះពាក់កណ្តាលម្តងៗ (32→16→8) ដោយសារ Pooling ខណៈជម្រៅឆានែលកើនឡើង (3→8→24) ដើម្បីផ្ទុកលក្ខណៈកាន់តែសម្បូរបែប។',
        },
      },
      {
        en: 'Classifier Head: Flatten 8 × 8 × 24 = 1,536 units → FC (256) → FC (10 class scores).',
        km: 'ផ្នែកចាត់ថ្នាក់៖ ពន្លា 8×8×24 = 1,536 → FC (256) → FC (10 ថ្នាក់ចុងក្រោយ)។',
        detail: {
          en: 'Once spatial resolution is compact (8×8×24 = 1,536 numbers), flattening into a 1D vector becomes affordable. The FC layers then reason globally across all 1,536 extracted features to score each of the 10 classes.',
          km: 'ពេលទំហំរួមតូចមកត្រឹម 8×8×24 = 1,536 លេខ ទើបយើងពន្លាវាជាវ៉ិចទ័រ 1D បានដោយងាយ ហើយស្រទាប់ FC ផ្សំលក្ខណៈទាំងអស់ដើម្បីគណនាពិន្ទុថ្នាក់ទាំង ១០។',
        },
      },
    ],
    formula: {
      expression: '8 * 8 * 24 = 1,536 -> FC(1536 -> 256) -> FC(256 -> 10)',
      latex: String.raw`8 \times 8 \times 24 = 1{,}536 \;\xrightarrow{\mathbf{W}_1 \in \mathbb{R}^{256\times 1536}}\; 256 \;\xrightarrow{\mathbf{W}_2 \in \mathbb{R}^{10\times 256}}\; 10`,
      derivationLatex: String.raw`\text{FC Params} = (1536\times 256 + 256) + (256\times 10 + 10) = 393{,}472 + 2{,}570 = 396{,}042`,
      caption: {
        en: 'Notice that FC layers typically hold the majority of parameters in classic CNNs',
        km: 'ស្រទាប់ FC ជាទូទៅផ្ទុកចំនួនប៉ារ៉ាម៉ែត្រច្រើនជាងគេក្នុង CNN បុរាណ',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 3',
      outputTensor: '10 Class Logits',
      operation: 'Conv/Pool Backbone + FC Classifier',
      metrics: [
        { label: { en: 'Flatten Dim', km: 'វិមាត្រពន្លា' }, value: '1,536', detail: '8×8×24' },
        { label: { en: 'FC1 Params', km: 'ប៉ារ៉ាម៉ែត្រ FC1' }, value: '393,472', detail: '1536×256+256' },
        { label: { en: 'FC2 Params', km: 'ប៉ារ៉ាម៉ែត្រ FC2' }, value: '2,570', detail: '256×10+10' },
      ],
      pytorchSnippet: `model = nn.Sequential(
    nn.Conv2d(3, 8, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 16x16x8
    nn.Conv2d(8, 24, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # 8x8x24
    nn.Flatten(),                                                # 1,536
    nn.Linear(8 * 8 * 24, 256), nn.ReLU(),
    nn.Linear(256, 10)
)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Two Halves of a Complete CNN', km: 'ផ្នែកសំខាន់ទាំងពីរនៃ CNN ពេញលេញ' },
        narration: {
          en: 'First, alternating Conv+ReLU and MaxPool compress spatial size from 32×32 down to 8×8 while growing depth to 24. Then Flatten + FC layers map those 1,536 features to 10 classes.',
          km: 'ដំបូង Conv+ReLU និង MaxPool បង្រួមទំហំពី 32×32 មក 8×8 និងបង្កើនជម្រៅដល់ 24។ បន្ទាប់មក Flatten + FC បំប្លែង 1,536 លក្ខណៈទៅជា 10 ចម្លើយ។',
        },
        durationSec: 6,
      },
    ],
    visualType: 'fully-connected',
  },
  {
    id: 27,
    category: 'pooling-fc',
    kicker: { en: 'Core Inductive Biases', km: 'គុណសម្បត្តិគន្លឹះនៃ Convolution' },
    title: {
      en: 'Why Convolutions?',
      km: 'ហេតុអ្វីយើងប្រើ Convolutions?',
    },
    subtitle: {
      en: 'Two fundamental advantages over dense layers: Parameter Sharing & Sparsity of Connections',
      km: 'គុណសម្បត្តិពីរយ៉ាងធៀបនឹង MLP៖ ការចែករំលែកប៉ារ៉ាម៉ែត្រ (Parameter Sharing) និងតំណភ្ជាប់ស្តើង (Sparsity)',
    },
    keyPoints: [
      {
        en: 'Parameter Sharing: A feature detector (such as a vertical edge detector) useful in one part of the image is probably useful in another part of the image.',
        km: 'Parameter Sharing៖ ឧបករណ៍ចាប់លក្ខណៈ (ដូចជាគែមបញ្ឈរ) ដែលមានប្រយោជន៍នៅផ្នែកមួយនៃរូបភាព ក៏មានប្រយោជន៍នៅផ្នែកផ្សេងទៀតដែរ។',
        detail: {
          en: 'Instead of learning separate weights for the top-left corner and bottom-right corner, all 784 output locations share the exact same 75 kernel weights—granting translation equivariance and cutting parameters dramatically.',
          km: 'ជំនួសឱ្យការរៀនទម្ងន់ផ្សេងគ្នាសម្រាប់ជ្រុងលើឆ្វេង និងជ្រុងក្រោមស្តាំ ទីតាំងលទ្ធផលទាំង 784 ប្រើទម្ងន់ Filter 75 ដូចគ្នាទាំងស្រុង ដែលកាត់បន្ថយប៉ារ៉ាម៉ែត្រយ៉ាងមហិមា។',
        },
      },
      {
        en: 'Sparsity of Connections: In each layer, each output value depends only on a small number of local inputs (e.g., 3 × 3 = 9), not all 1,000,000 pixels.',
        km: 'Sparsity of Connections៖ តម្លៃលទ្ធផលនីមួយៗពឹងផ្អែកតែលើភីកសែលជិតខាងមួយចំនួនតូចប៉ុណ្ណោះ (ដូចជា 3×3)។',
        detail: {
          en: 'Because most weights are effectively zero outside the local F×F patch, computation scales linearly with image pixels and prevents the network from memorizing spurious correlations between distant background pixels.',
          km: 'ដោយសារណឺរ៉ូនភ្ជាប់តែជាមួយតំបន់តូច F×F ជិតខ្លួន ការគណនាលឿន និងការពារកុំឱ្យម៉ូដែលចាប់ទំនាក់ទំនងមិនពិតពីភីកសែលឆ្ងាយៗ។',
        },
      },
    ],
    formula: {
      expression: 'FC: 14,450,688 params vs CONV: 456 params (~31,690x fewer)',
      latex: String.raw`\frac{\text{Params}_{\text{FC}}}{\text{Params}_{\text{Conv}}} = \frac{(32\cdot 32\cdot 3) \times (28\cdot 28\cdot 6)}{6 \times (5\cdot 5\cdot 3 + 1)} = \frac{14{,}450{,}688}{456} \approx 31{,}690\times\text{ reduction}`,
      caption: {
        en: 'Massive parameter efficiency prevents overfitting and enables deep vision models',
        km: 'ការកាត់បន្ថយប៉ារ៉ាម៉ែត្ររាប់ម៉ឺនដង ជួយការពារ Overfitting និងបង្កើនល្បឿនរៀន',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 3 → 28 × 28 × 6',
      outputTensor: '31,690× Parameter Reduction',
      operation: 'Weight Sharing + Local Receptive Fields',
      metrics: [
        { label: { en: 'Dense Equivalent', km: 'ទម្រង់ Dense' }, value: '14,450,688', detail: '3072 × 4704' },
        { label: { en: 'Conv (6×5×5×3)', km: 'ទម្រង់ Conv' }, value: '456', detail: 'Shared filter' },
      ],
      pytorchSnippet: `# Equivalent Dense layer: 3072 * 4704 = 14,450,688 weights
# Conv2d(3, 6, 5): 6 * 5 * 5 * 3 + 6 = 456 weights!`,
    },
    miniVideoSteps: [
      {
        title: { en: '1. Parameter Sharing', km: '១. ការចែករំលែកប៉ារ៉ាម៉ែត្រ' },
        narration: {
          en: 'Instead of learning separate edge detectors for every pixel location, one 5×5 filter slides everywhere — reducing weights by over 30,000×.',
          km: 'ជំនួសឱ្យការរៀន Filter ថ្មីគ្រប់ទីតាំង Filter តែមួយរំកិលប្រើរួមគ្នាពេញរូបភាព ជួយសន្សំទម្ងន់រាប់ម៉ឺនដង។',
        },
        durationSec: 5,
      },
      {
        title: { en: '2. Sparsity of Connections', km: '២. តំណភ្ជាប់តាមតំបន់តូច (Sparsity)' },
        narration: {
          en: 'Each neuron only looks at a small local patch (like 3×3 or 5×5), making optimization stable and translation-equivariant.',
          km: 'ណឺរ៉ូននីមួយៗភ្ជាប់តែជាមួយតំបន់តូចជិតខាង (3×3 ឬ 5×5) ប៉ុណ្ណោះ ធ្វើឱ្យការរៀនមានស្ថិរភាពខ្ពស់។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'why-convolutions',
  },
  {
    id: 28,
    category: 'architectures',
    kicker: { en: 'Pioneer CNN (1998)', km: 'ស្ថាបត្យកម្មត្រួសត្រាយ LeNet-5 (១៩៩៨)' },
    title: {
      en: 'Case Study: LeNet-5',
      km: 'ករណីសិក្សា៖ LeNet-5 [LeCun et al., 1998]',
    },
    subtitle: {
      en: 'Classic [CONV–POOL–CONV–POOL–CONV–FC] architecture for handwritten digit recognition',
      km: 'ស្ថាបត្យកម្មបុរាណ [CONV–POOL–CONV–POOL–CONV–FC] សម្រាប់ស្គាល់លេខសរសេរដៃ',
    },
    keyPoints: [
      {
        en: 'CONV filters 5 × 5 applied at stride 1; Pooling layers 2 × 2 applied at stride 2.',
        km: 'ប្រើ CONV Filter 5×5 (stride 1) និង Pooling 2×2 (stride 2)។',
        detail: {
          en: 'LeCun et al. (1998) designed LeNet-5 for reading handwritten zip codes and bank checks—establishing the alternating Conv + Pool template still used today.',
          km: 'LeCun និងសហការី (1998) បានបង្កើត LeNet-5 សម្រាប់អានលេខកូដប្រៃសណីយ៍ និងសែកធនាគារ ដែលបានក្លាយជាគំរូគ្រឹះ Conv + Pool រហូតដល់បច្ចុប្បន្ន។',
        },
      },
      {
        en: 'Flow: Input 32×32 → C1 (6@28×28) → S2 (6@14×14) → C3 (16@10×10) → S4 (16@5×5) → C5 (120) → F6 (84) → Output (10).',
        km: 'លំហូរ៖ Input 32×32 → C1 (6@28×28) → S2 (6@14×14) → C3 (16@10×10) → S4 (16@5×5) → C5 (120) → F6 (84) → 10 ថ្នាក់។',
        detail: {
          en: 'Notice every spatial transition follows (N−F)/S+1: 32→28 via 5×5 (stride 1), 28→14 via 2×2 (stride 2), 14→10 via 5×5, and 10→5 via 2×2, then C5 reduces 5×5×16 to 120 scalars.',
          km: 'រាល់ការផ្លាស់ប្តូរទំហំគោរពតាមរូបមន្ត (N−F)/S+1៖ 32→28 (5×5), 28→14 (2×2 pool), 14→10 (5×5), 10→5 (2×2 pool) រួច C5 បង្រួមជា 120 ណឺរ៉ូន។',
        },
      },
    ],
    formula: {
      expression: '32x32x1 -> 28x28x6 -> 14x14x6 -> 10x10x16 -> 5x5x16 -> 120 -> 84 -> 10',
      latex: String.raw`32\times 32\times 1 \xrightarrow{C_1:\, 6@5\times 5} 28\times 28\times 6 \xrightarrow{S_2:\, 2\times 2,\, s=2} 14\times 14\times 6 \xrightarrow{C_3:\, 16@5\times 5} 10\times 10\times 16 \xrightarrow{S_4:\, 2\times 2,\, s=2} 5\times 5\times 16 \xrightarrow{C_5} 120 \to 84 \to 10`,
      caption: {
        en: 'Approximately ~60,000 parameters — established the modern CNN blueprint',
        km: 'មានប៉ារ៉ាម៉ែត្រប្រហែល ៦០,០០០ — ជាគំរូគ្រឹះសម្រាប់ CNN សម័យទំនើប',
      },
    },
    specs: {
      inputTensor: '32 × 32 × 1',
      outputTensor: '10 Classes',
      operation: '[CONV-POOL-CONV-POOL-CONV-FC]',
      metrics: [
        { label: { en: 'Year', km: 'ឆ្នាំបង្កើត' }, value: '1998', detail: 'LeCun et al.' },
        { label: { en: 'Parameters', km: 'ប៉ារ៉ាម៉ែត្រ' }, value: '~60K', detail: 'Lightweight' },
        { label: { en: 'Use Case', km: 'ការប្រើប្រាស់' }, value: 'Digits / Checks', detail: 'MNIST' },
      ],
      pytorchSnippet: `class LeNet5(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 6, 5), nn.Tanh(), nn.AvgPool2d(2, 2),
            nn.Conv2d(6, 16, 5), nn.Tanh(), nn.AvgPool2d(2, 2),
            nn.Conv2d(16, 120, 5), nn.Tanh(), nn.Flatten(),
            nn.Linear(120, 84), nn.Tanh(), nn.Linear(84, 10)
        )`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Tracing LeNet-5 Dimensions', km: 'ការតាមដានវិមាត្រក្នុង LeNet-5' },
        narration: {
          en: 'A 32×32 grayscale character passes through 5×5 Conv (28×28×6), 2×2 Pool (14×14×6), another 5×5 Conv (10×10×16), Pool (5×5×16), and three FC layers (120→84→10).',
          km: 'រូប 32×32 ឆ្លងកាត់ Conv 5×5 (28×28×6), Pool (14×14×6), Conv 5×5 (10×10×16), Pool (5×5×16) និង FC (120→84→10)។',
        },
        durationSec: 6,
      },
    ],
    visualType: 'case-lenet5',
  },
  {
    id: 29,
    category: 'architectures',
    kicker: { en: 'Deep Learning Breakthrough (2012)', km: 'របកគំហើញ ImageNet — AlexNet (២០១២)' },
    title: {
      en: 'Case Study: AlexNet',
      km: 'ករណីសិក្សា៖ AlexNet [Krizhevsky et al., 2012]',
    },
    subtitle: {
      en: '8-layer deep CNN (5 Conv + 3 FC) trained on ImageNet (227 × 227 × 3 → 1,000 classes)',
      km: 'CNN ៨ ស្រទាប់ (៥ Conv + ៣ FC) សម្រាប់ ImageNet (២២៧×២២៧×៣ → ១,០០០ ថ្នាក់)',
    },
    keyPoints: [
      {
        en: 'Conv1: 96 filters 11×11 s=4 p=0 → 55×55×96, followed by 3×3 s=2 MaxPool & Normalization.',
        km: 'Conv1: 96 Filter (11×11, s=4, p=0) → 55×55×96 បន្ទាប់មក MaxPool 3×3 s=2 និង Normalization។',
        detail: {
          en: 'Large 11×11 filters with stride 4 aggressively downsample the 227×227 RGB input down to 55×55 right in the first layer, and overlapping 3×3 stride-2 pooling shrinks it to 27×27×96.',
          km: 'Filter ធំ 11×11 ជាមួយ Stride 4 បង្រួមទំហំពី 227×227 មកត្រឹម 55×55 ភ្លាមៗនៅស្រទាប់ទី១ ហើយ MaxPool 3×3 s=2 បង្រួមបន្តមក 27×27×96។',
        },
      },
      {
        en: 'Conv2 (256 5×5 p=2) → 27×27×256 → Pool; Conv3/4/5 (384, 384, 256 3×3 p=1) → 13×13×256 → Pool → FC6 (4096) → FC7 (4096) → FC8 (1000).',
        km: 'Conv2 (256 5×5) → 27×27×256; Conv3-5 (384, 384, 256 3×3) → 13×13×256 → Pool → FC6 (4096) → FC7 (4096) → FC8 (1000)។',
        detail: {
          en: 'AlexNet won ILSVRC 2012 by a massive margin by introducing ReLU (faster convergence than tanh), Dropout (reducing overfitting in FC layers), and multi-GPU training.',
          km: 'AlexNet បានឈ្នះការប្រកួត ImageNet ឆ្នាំ ២០១២ ដោយសារការប្រើ ReLU (រៀនលឿនជាង tanh), Dropout (ការពារ Overfitting ក្នុង FC) និងការហ្វឹកហាត់លើ GPU។',
        },
      },
    ],
    formula: {
      expression: '227x227x3 -> 55x55x96 -> 27x27x256 -> 13x13x384 -> 13x13x256 -> 4096 -> 4096 -> 1000',
      latex: String.raw`\text{Conv}_1:\; O_1 = \frac{227 + 2(0) - 11}{4} + 1 = 55 \implies 55\times 55\times 96, \qquad \text{Pool}_1:\; O_p = \frac{55 - 3}{2} + 1 = 27 \implies 27\times 27\times 96`,
      derivationLatex: String.raw`\text{Conv}_2:\; \frac{27 + 2(2) - 5}{1} + 1 = 27 \implies 27\times 27\times 256 \xrightarrow{\text{Pool}_2} 13\times 13\times 256 \xrightarrow{\text{Conv}_{3..5}} 13\times 13\times 256 \xrightarrow{\text{Pool}_5} 6\times 6\times 256 = 9{,}216 \to 4096 \to 4096 \to 1000`,
      caption: {
        en: '~60 Million parameters; popularized ReLU, Dropout, GPU training, and overlapping MaxPool',
        km: 'ប្រហែល ៦០ លានប៉ារ៉ាម៉ែត្រ — នាំមុខក្នុងការប្រើ ReLU, Dropout និងការហ្វឹកហាត់លើ GPU',
      },
    },
    specs: {
      inputTensor: '227 × 227 × 3',
      outputTensor: '1,000 ImageNet Classes',
      operation: '5 Conv + 3 MaxPool + 3 FC',
      metrics: [
        { label: { en: 'Year', km: 'ឆ្នាំបង្កើត' }, value: '2012', detail: 'ILSVRC Winner' },
        { label: { en: 'Parameters', km: 'ប៉ារ៉ាម៉ែត្រ' }, value: '~60M', detail: 'ReLU + Dropout' },
        { label: { en: 'Conv1 Stride', km: 'Stride ដំបូង' }, value: '11×11, s=4', detail: '227 → 55' },
      ],
      pytorchSnippet: `# AlexNet Conv1 & Conv2 signature
conv1 = nn.Conv2d(3, 96, kernel_size=11, stride=4, padding=0)   # -> 55x55x96
pool1 = nn.MaxPool2d(kernel_size=3, stride=2)                   # -> 27x27x96
conv2 = nn.Conv2d(96, 256, kernel_size=5, stride=1, padding=2)  # -> 27x27x256`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Scaling Up for ImageNet', km: 'ការពង្រីកស្ថាបត្យកម្មសម្រាប់ ImageNet' },
        narration: {
          en: 'AlexNet scaled LeNet’s blueprint to 227×227 RGB images using 96 large 11×11 filters at stride 4, ReLU activations, and 4096-unit FC layers for 1000 classes.',
          km: 'AlexNet បានពង្រីកគំរូ LeNet ទៅលើរូបភាព 227×227×3 ដោយប្រើ ReLU និងស្រទាប់ FC 4096 សម្រាប់បែងចែក 1000 ថ្នាក់។',
        },
        durationSec: 6,
      },
    ],
    visualType: 'case-alexnet',
  },
  {
    id: 30,
    category: 'architectures',
    kicker: { en: 'Modern CNN Evolution', km: 'ការវិវត្តនៃស្ថាបត្យកម្ម CNN ទំនើប' },
    title: {
      en: 'Other Case Studies: VGGNet, GoogLeNet, ResNet',
      km: 'ករណីសិក្សាផ្សេងទៀត៖ VGGNet, GoogLeNet និង ResNet',
    },
    subtitle: {
      en: 'Simonyan & Zisserman (2014), Szegedy et al. (2014 Inception), He et al. (2015 Skip Connections)',
      km: 'VGGNet (២០១៤), GoogLeNet Inception Module (២០១៤) និង ResNet Skip Connections (២០១៥)',
    },
    keyPoints: [
      {
        en: 'VGGNet [2014]: Uniform deep stacks of small 3 × 3 convolutions (16–19 layers) proving depth matters.',
        km: 'VGGNet [២០១៤]៖ ប្រើតែ Filter 3×3 តម្រៀបជាន់គ្នាច្រើន (១៦–១៩ ស្រទាប់) ដើម្បីបង្កើនជម្រៅ។',
        detail: {
          en: 'Two stacked 3×3 convolutions see the same 5×5 receptive field as one 5×5 filter, while using fewer parameters (18C² vs 25C²) and adding an extra ReLU non-linearity in between.',
          km: 'ការដាក់ 3×3 ពីរជាន់មើលឃើញដែន 5×5 ដូច 5×5 តែមួយដែរ ប៉ុន្តែប្រើប៉ារ៉ាម៉ែត្រតិចជាង (18C² ធៀបនឹង 25C²) និងមាន ReLU បន្ថែមនៅចន្លោះ។',
        },
      },
      {
        en: 'GoogLeNet [2014]: Inception Module runs 1×1, 3×3, 5×5 & pooling branches in parallel with 1×1 bottlenecks.',
        km: 'GoogLeNet [២០១៤]៖ Inception Module ដំណើរការ 1×1, 3×3, 5×5 និង Pool ស្របគ្នា។',
        detail: {
          en: 'Instead of choosing a single kernel size per layer, the Inception module applies all sizes in parallel and concatenates their outputs—using 1×1 convs beforehand to slash computation to just 6.8M parameters.',
          km: 'ជំនួសឱ្យការរើស Filter តែមួយទំហំ, Inception ដំណើរការ 1×1, 3×3, 5×5 និង Pool ស្របគ្នារួចតភ្ជាប់លទ្ធផលបញ្ចូលគ្នា ដោយប្រើ 1×1 ជួយសន្សំប៉ារ៉ាម៉ែត្រមកត្រឹម 6.8M។',
        },
      },
      {
        en: 'ResNet [2015]: Skipped (Residual) Connections H(x) = F(x) + x enable training 152+ layers without vanishing gradients.',
        km: 'ResNet [២០១៥]៖ Skipped Connections H(x) = F(x) + x អនុញ្ញាតឱ្យហ្វឹកហាត់ដល់ ១៥២+ ស្រទាប់ដោយមិនបាត់ Gradient។',
        detail: {
          en: 'Adding the input x directly to the block output F(x) creates an unimpeded gradient highway during backpropagation (derivative term contains +1), solving optimization degradation in ultra-deep networks.',
          km: 'ការបូកបន្ថែមធាតុចូល x ផ្ទាល់ទៅនឹងលទ្ធផល F(x) បង្កើតជាផ្លូវកាត់ឱ្យ Gradient ហូរត្រឡប់ក្រោយដោយមិនបាត់បង់ ដែលអាចហ្វឹកហាត់បណ្តាញ 152+ ស្រទាប់បានជោគជ័យ។',
        },
      },
    ],
    formula: {
      expression: 'ResNet Block: y = F(x, {W_i}) + x',
      latex: String.raw`\text{ResNet:}\;\; \mathbf{y} = \mathcal{F}(\mathbf{x}, \{W_i\}) + \mathbf{x} \implies \frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}}\!\left(\mathbf{I} + \frac{\partial \mathcal{F}}{\partial \mathbf{x}}\right)`,
      derivationLatex: String.raw`\text{VGG: } 2\times (3\times 3) \equiv 5\times 5 \;\;(18 C^2 < 25 C^2), \qquad \text{Inception: } \operatorname{Concat}\!\big([1\times 1,\; 3\times 3,\; 5\times 5,\; \text{Pool}]\big)`,
      caption: {
        en: 'Identity shortcut lets gradients flow unimpeded through ultra-deep networks',
        km: 'ផ្លូវកាត់ (Skip Connection) ជួយឱ្យ Gradient ហូរដោយរលូនក្នុងបណ្តាញដ៏ជ្រៅ',
      },
    },
    specs: {
      inputTensor: '224 × 224 × 3',
      outputTensor: '1,000 Classes (Top-5 Error < 4%)',
      operation: '3×3 Stacks / Inception / Residual Skip',
      metrics: [
        { label: { en: 'VGG-16', km: 'VGG-16' }, value: '138M', detail: '3×3 uniform' },
        { label: { en: 'GoogLeNet', km: 'GoogLeNet' }, value: '6.8M', detail: 'Inception' },
        { label: { en: 'ResNet-152', km: 'ResNet-152' }, value: '60M', detail: 'Skip F(x)+x' },
      ],
      pytorchSnippet: `class ResidualBlock(nn.Module):
    def forward(self, x):
        return torch.relu(self.conv_block(x) + x)  # Skip connection!`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Three Architectural Milestones (2014–2015)', km: 'ព្រឹត្តិការណ៍ស្ថាបត្យកម្មទាំង ៣ (២០១៤–២០១៥)' },
        narration: {
          en: 'VGG simplified filters to 3×3; GoogLeNet combined multi-scale Inception branches efficiently; ResNet added skip connections to unlock 152+ layer networks.',
          km: 'VGG បង្រួម Filter មកត្រឹម 3×3; GoogLeNet ប្រើ Inception ច្រើនទំហំស្របគ្នា; ResNet បន្ថែម Skip Connection ដើម្បីហ្វឹកហាត់ជាង 150 ស្រទាប់។',
        },
        durationSec: 6,
      },
    ],
    visualType: 'case-other-nets',
  },
  {
    id: 31,
    category: 'architectures',
    kicker: { en: 'Standard Benchmarks', km: 'សំណុំទិន្នន័យស្តង់ដារសម្រាប់រូបភាព' },
    title: {
      en: 'Image Datasets',
      km: 'សំណុំទិន្នន័យរូបភាព (Image Datasets)',
    },
    subtitle: {
      en: 'MNIST (60K+10K), CIFAR-10 (60K), MS-COCO (328K), and ImageNet (14M+ images)',
      km: 'MNIST, CIFAR-10, MS-COCO និង ImageNet',
    },
    keyPoints: [
      {
        en: 'MNIST (handwritten digits): 28 × 28 grayscale images, 60K training + 10K testing images.',
        km: 'MNIST (លេខសរសេរដៃ)៖ រូបភាពស-ខ្មៅ 28×28, 60K សម្រាប់ហ្វឹកហាត់ និង 10K សម្រាប់តេស្ត។',
        detail: {
          en: 'The "Hello World" benchmark of computer vision—ideal for verifying LeNet-style architectures quickly on a CPU or single GPU in seconds.',
          km: 'ជាសំណុំទិន្នន័យមូលដ្ឋានដំបូងសម្រាប់សាកល្បងកូដ CNN (ដូចជា LeNet-5) ព្រោះទំហំតូច និងរត់លឿនក្នុងរយៈពេលប៉ុន្មានវិនាទី។',
        },
      },
      {
        en: 'CIFAR-10: 32 × 32 color images, 60K images across 10 classes.',
        km: 'CIFAR-10៖ រូបភាពពណ៌ 32×32, 60K រូបភាព ចែកជា 10 ថ្នាក់។',
        detail: {
          en: 'Contains 50K training and 10K test RGB photos across 10 everyday classes (airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck)—requiring real 3-channel color convolutions.',
          km: 'មានរូបភាពពណ៌ 50K សម្រាប់ហ្វឹកហាត់ និង 10K សម្រាប់តេស្ត លើ ១០ ប្រភេទវត្ថុពិត (យន្តហោះ រថយន្ត បក្សី ឆ្មា ឆ្កែ ទូក...) ដែលត្រូវការ Filter ៣ ឆានែល RGB។',
        },
      },
      {
        en: 'MS-COCO: 328K images for object detection & segmentation. ImageNet: 14M+ images across 20K+ categories.',
        km: 'MS-COCO៖ 328K រូបភាព (Detection/Segmentation)។ ImageNet៖ 14M+ រូបភាព ជាង 20K+ ប្រភេទ។',
        detail: {
          en: 'MS-COCO provides dense multi-object bounding boxes and polygon masks in natural scenes, while ImageNet (1.2M ILSVRC subset across 1,000 classes) catalyzed modern deep learning breakthroughs.',
          km: 'MS-COCO ផ្តល់ប្រអប់ទីតាំង និង Mask ច្រើនវត្ថុក្នុងឈុតឆាកជាក់ស្តែង ចំណែក ImageNet ជាសំណុំទិន្នន័យយក្សដែលជំរុញការរីកចម្រើននៃ AlexNet, VGG និង ResNet។',
        },
      },
    ],
    formula: {
      expression: 'MNIST: 70K x (28x28x1) | CIFAR-10: 60K x (32x32x3) | ImageNet: 14M+',
      latex: String.raw`\mathcal{D}_{\text{MNIST}} \subset \mathbb{R}^{28\times 28\times 1}\;(70\text{K}), \quad \mathcal{D}_{\text{CIFAR-10}} \subset \mathbb{R}^{32\times 32\times 3}\;(60\text{K}), \quad |\mathcal{D}_{\text{ImageNet}}| > 1.4\times 10^7`,
      caption: {
        en: 'Dataset tensor dimensions determine the input channels and spatial scale of the CNN',
        km: 'ទំហំ Tensor នៃសំណុំទិន្នន័យកំណត់ចំនួនឆានែលចូល និងមាត្រដ្ឋានលំហរបស់ CNN',
      },
    },
    specs: {
      inputTensor: '28×28×1 up to High-Res RGB',
      outputTensor: '10 to 20,000+ Categories',
      operation: 'Training & Evaluation Benchmarks',
      metrics: [
        { label: { en: 'MNIST', km: 'MNIST' }, value: '70K', detail: '28×28 Gray' },
        { label: { en: 'CIFAR-10', km: 'CIFAR-10' }, value: '60K', detail: '32×32 Color' },
        { label: { en: 'MS-COCO', km: 'MS-COCO' }, value: '328K', detail: 'Detection/Seg' },
        { label: { en: 'ImageNet', km: 'ImageNet' }, value: '14M+', detail: '20K+ classes' },
      ],
      pytorchSnippet: `from torchvision import datasets, transforms
mnist = datasets.MNIST('./data', train=True, download=True)
cifar = datasets.CIFAR10('./data', train=True, download=True)`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Choosing the Right Benchmark', km: 'ការជ្រើសរើសសំណុំទិន្នន័យសមស្រប' },
        narration: {
          en: 'Start prototyping quickly on MNIST (28×28) or CIFAR-10 (32×32 RGB), then scale to MS-COCO for detection/segmentation and ImageNet for large-scale recognition.',
          km: 'សាកល្បងដំបូងលើ MNIST ឬ CIFAR-10 រួចពង្រីកទៅ MS-COCO និង ImageNet សម្រាប់ភារកិច្ចកម្រិតធំ។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'image-datasets',
  },
  {
    id: 32,
    category: 'architectures',
    kicker: { en: 'Hands-On Assignment', km: 'លំហាត់អនុវត្តជាក់ស្តែង' },
    title: {
      en: 'Exercise: Implement & Train a CNN',
      km: 'លំហាត់៖ អនុវត្ត និងហ្វឹកហាត់ស្ថាបត្យកម្ម CNN',
    },
    subtitle: {
      en: 'Select one of the architectures from the Case Study and train it on MNIST or CIFAR-10',
      km: 'ជ្រើសរើសស្ថាបត្យកម្មមួយពីករណីសិក្សា រួចហ្វឹកហាត់លើ MNIST ឬ CIFAR-10',
    },
    keyPoints: [
      {
        en: 'Pick an architecture: LeNet-5, AlexNet (adapted), VGG-style, or ResNet.',
        km: 'ជ្រើសរើសស្ថាបត្យកម្មណាមួយ៖ LeNet-5, AlexNet, VGGNet ឬ ResNet។',
        detail: {
          en: 'If choosing AlexNet or ResNet for 28×28 / 32×32 images, reduce the initial 11×11 stride-4 stem to 3×3 stride-1 so spatial maps do not shrink below 1×1 before pooling.',
          km: 'បើជ្រើស AlexNet ឬ ResNet សម្រាប់រូប 28×28 ឬ 32×32 សូមកែ Filter ដំបូងពី 11×11 stride 4 មក 3×3 stride 1 ដើម្បីកុំឱ្យរូបភាពរួមតូចបាត់អស់មុនដល់ស្រទាប់ចុងក្រោយ។',
        },
      },
      {
        en: 'Adapt the input channels (1 for MNIST vs 3 for CIFAR-10) and train with CrossEntropyLoss + Adam/SGD.',
        km: 'កែសម្រួលឆានែលចូល (1 សម្រាប់ MNIST ឬ 3 សម្រាប់ CIFAR-10) ហើយហ្វឹកហាត់ដោយ CrossEntropyLoss និង Adam/SGD។',
        detail: {
          en: 'Track both training loss and validation/test accuracy across epochs; add Dropout or BatchNorm if training accuracy climbs much higher than test accuracy.',
          km: 'តាមដានទាំង Training Loss និង Test Accuracy រៀងរាល់ Epoch; អាចបន្ថែម Dropout ឬ BatchNorm ប្រសិនបើម៉ូដែលមានសញ្ញា Overfitting។',
        },
      },
    ],
    formula: {
      expression: 'L_CE = -sum y_c log(softmax(z)_c), theta <- theta - eta * grad(L)',
      latex: String.raw`\mathcal{L}_{\text{CE}}(\mathbf{y}, \mathbf{z}) = -\sum_{c=1}^{10} y_c \log\!\left(\frac{e^{z_c}}{\sum_{j=1}^{10} e^{z_j}}\right), \qquad \theta \leftarrow \theta - \eta \nabla_\theta \mathcal{L}_{\text{CE}}`,
      caption: {
        en: 'Multi-class Cross-Entropy objective optimized via stochastic gradient descent',
        km: 'អនុគមន៍បាត់បង់ Cross-Entropy សម្រាប់បែងចែក ១០ ថ្នាក់តាមរយៈ Gradient Descent',
      },
    },
    specs: {
      inputTensor: 'MNIST (1×28×28) or CIFAR-10 (3×32×32)',
      outputTensor: '10 Classes + Test Accuracy',
      operation: 'Training Loop (Forward → Loss → Backward → Step)',
      metrics: [
        { label: { en: 'Loss Fn', km: 'អនុគមន៍ Loss' }, value: 'CrossEntropy', detail: '10 classes' },
        { label: { en: 'Optimizer', km: 'Optimizer' }, value: 'Adam / SGD', detail: 'lr = 1e-3' },
      ],
      pytorchSnippet: `criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
for images, labels in train_loader:
    optimizer.zero_grad()
    loss = criterion(model(images), labels)
    loss.backward()
    optimizer.step()`,
    },
    miniVideoSteps: [
      {
        title: { en: 'From Blueprint to Working Model', km: 'ពីទ្រឹស្តី ទៅជាការសរសេរកូដហ្វឹកហាត់' },
        narration: {
          en: 'Use the interactive configurator on this slide to choose your Case Study model and Dataset, and verify tensor shapes before training.',
          km: 'ជ្រើសរើសម៉ូដែល និងទិន្នន័យលើស្លាយនេះ ដើម្បីផ្ទៀងផ្ទាត់ទំហំ Tensor និងកូដ PyTorch សម្រាប់លំហាត់។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'exercise',
  },
  {
    id: 33,
    category: 'architectures',
    kicker: { en: 'Academic Citations', km: 'ឯកសារយោង និងប្រភពសិក្សាបន្ថែម' },
    title: {
      en: 'References',
      km: 'ឯកសារយោង (References)',
    },
    subtitle: {
      en: 'Foundational Machine Learning & Deep Learning Vision Courses',
      km: 'វគ្គសិក្សាមូលដ្ឋានផ្នែក Machine Learning និង Convolutional Neural Networks',
    },
    keyPoints: [
      {
        en: 'Ng, A. Coursera Machine Learning Course: coursera.org/learn/machine-learning',
        km: 'Ng, A. វគ្គសិក្សា Coursera Machine Learning: coursera.org/learn/machine-learning',
        detail: {
          en: 'Provides intuition on supervised learning, gradient descent, regularization, and foundational neural networks.',
          km: 'ផ្តល់មូលដ្ឋានគ្រឹះច្បាស់លាស់លើ Supervised Learning, Gradient Descent, Regularization និង Neural Networks។',
        },
      },
      {
        en: 'Ng, A. (2018). Stanford CS229: Machine Learning.',
        km: 'Ng, A. (2018). Stanford CS229: Machine Learning.',
        detail: {
          en: 'Rigorous mathematical derivations of optimization, backpropagation, generalization bounds, and deep learning theory.',
          km: 'ពន្យល់ស៊ីជម្រៅផ្នែកគណិតវិទ្យានៃ Optimization, Backpropagation និងទ្រឹស្តី Machine Learning។',
        },
      },
      {
        en: 'Karpathy, A. (2016). Stanford Winter Class CS231n: Convolutional Neural Networks for Visual Recognition.',
        km: 'Karpathy, A. (2016). Stanford CS231n: Convolutional Neural Networks for Visual Recognition.',
        detail: {
          en: 'The gold-standard reference for CNN layer dimensions, spatial math, backpropagation through conv/pool layers, and modern vision architectures.',
          km: 'ឯកសារគោលដ៏ល្បីល្បាញសម្រាប់គណិតវិទ្យា CNN, ការគណនាវិមាត្រលំហ, Backprop តាម Conv/Pool និងស្ថាបត្យកម្មចក្ខុវិស័យទំនើប។',
        },
      },
    ],
    formula: {
      expression: 'dL/dK = I * dL/dO | dL/dI = dL/dO * rot180(K)',
      latex: String.raw`\frac{\partial \mathcal{L}}{\partial K} = I * \frac{\partial \mathcal{L}}{\partial O}, \qquad \frac{\partial \mathcal{L}}{\partial I} = \frac{\partial \mathcal{L}}{\partial O} *_{\text{full}} \operatorname{rot}_{180^\circ}(K)`,
      caption: {
        en: 'Backpropagation through convolutional layers (covered further in Stanford CS231n)',
        km: 'គោលការណ៍ Backpropagation ឆ្លងកាត់ស្រទាប់ Convolution (សិក្សាលម្អិតក្នុង CS231n)',
      },
    },
    specs: {
      inputTensor: '3 Primary References',
      outputTensor: 'Lecture 03 Complete',
      operation: 'Further Study & Deep Dive',
      metrics: [
        { label: { en: 'Stanford CS231n', km: 'Stanford CS231n' }, value: '2016', detail: 'Andrej Karpathy' },
        { label: { en: 'Stanford CS229', km: 'Stanford CS229' }, value: '2018', detail: 'Andrew Ng' },
      ],
      pytorchSnippet: `# End of Lecture 03 — Convolutional Neural Networks
# Prepared by Dr. Valy Dona
# Interactive Studio Blueprint: 33 / 33 slides complete`,
    },
    miniVideoSteps: [
      {
        title: { en: 'Continuing Your Deep Learning Journey', km: 'ការសិក្សាស្រាវជ្រាវបន្ត' },
        narration: {
          en: 'Explore Stanford CS231n notes and Andrew Ng’s courses for deeper mathematical derivations, backpropagation through conv layers, and modern architectures.',
          km: 'សូមស្វែងយល់បន្ថែមពី CS231n និងវគ្គសិក្សារបស់ Andrew Ng ដើម្បីពង្រឹងចំណេះដឹងគណិតវិទ្យា និងការអនុវត្ត។',
        },
        durationSec: 5,
      },
    ],
    visualType: 'references',
  },
];
