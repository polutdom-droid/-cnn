import { BilingualText } from '../types/slide';

export interface FormulaVariable {
  symbol: string;
  meaning: BilingualText;
}

export interface SlideFormulaGuide {
  variables: FormulaVariable[];
  explanation: BilingualText;
  example?: BilingualText;
}

export interface CoreFormulaCard {
  id: string;
  slideId: number;
  title: BilingualText;
  latex: string;
  variables: FormulaVariable[];
  explanation: BilingualText;
  example: BilingualText;
}

export const CORE_FORMULA_CARDS: CoreFormulaCard[] = [
  {
    id: 'output-size',
    slideId: 23,
    title: {
      en: '1. Output Spatial Dimension (With Padding & Stride)',
      km: '១. រូបមន្តគណនាទំហំរូបភាពចេញ (Output Size)',
    },
    latex: String.raw`O = \frac{N + 2P - F}{S} + 1`,
    variables: [
      { symbol: 'N', meaning: { en: 'Input width/height', km: 'ទំហំទទឹង/បណ្តោយរូបភាពចូល' } },
      { symbol: 'P', meaning: { en: 'Zero padding on each border (×2 for both sides)', km: 'ចំនួនជួរលេខ 0 បន្ថែមជុំវិញគែម (×2 ព្រោះបូកទាំងសងខាង)' } },
      { symbol: 'F', meaning: { en: 'Filter (kernel) size', km: 'ទំហំតម្រងស្កេន (ឧ. 3 ឬ 5)' } },
      { symbol: 'S', meaning: { en: 'Stride step size', km: 'ជំហានរំកិលតម្រងម្តងៗ' } },
      { symbol: 'O', meaning: { en: 'Output map size (must be integer > 0)', km: 'ទំហំលទ្ធផលចេញ (ត្រូវជាចំនួនគត់វិជ្ជមាន)' } },
    ],
    explanation: {
      en: 'Counts how many valid positions an F×F window can land on inside the padded (N+2P) grid when stepping by S pixels.',
      km: 'រាប់ចំនួនទីតាំងដែលតម្រង F×F អាចរំកិលសមល្មមលើផ្ទៃបន្ថែមគែម (N+2P) ដោយបោះជំហាន S ភីកសែលម្តងៗ។',
    },
    example: {
      en: 'N=7, F=3, P=1, S=1 ⇒ O = (7 + 2(1) − 3) / 1 + 1 = 7 (7×7 output)',
      km: 'ឧទាហរណ៍៖ N=7, F=3, P=1, S=1 ⇒ O = (7 + 2(1) − 3) / 1 + 1 = 7 (ទំហំ 7×7)',
    },
  },
  {
    id: 'same-padding',
    slideId: 23,
    title: {
      en: '2. Same-Size Padding Rule (Stride S = 1)',
      km: '២. រូបមន្តរក្សាទំហំដើម (Same-Size Padding)',
    },
    latex: String.raw`P = \frac{F - 1}{2} \quad (\text{when } S = 1)`,
    variables: [
      { symbol: 'P', meaning: { en: 'Required zero-padding layers', km: 'ចំនួនជួរ Padding ដែលត្រូវបន្ថែម' } },
      { symbol: 'F', meaning: { en: 'Odd filter size (3, 5, 7, ...)', km: 'ទំហំតម្រងជាលេខសេស (3, 5, 7...)' } },
    ],
    explanation: {
      en: 'Setting O = N with S = 1 gives 2P = F − 1, preventing spatial shrinking across deep layers and preserving border pixels.',
      km: 'ពេលចង់ឲ្យទំហំចេញស្មើទំហំចូល (O = N) នៅពេល S = 1 នោះ 2P ត្រូវស្មើ F − 1 ដើម្បីកុំឲ្យរូបភាពរួមតូច និងរក្សាព័ត៌មានគែម។',
    },
    example: {
      en: 'F=3 ⇒ P=1 | F=5 ⇒ P=2 | F=7 ⇒ P=3',
      km: 'ឧទាហរណ៍៖ F=3 ⇒ P=1 · F=5 ⇒ P=2 · F=7 ⇒ P=3',
    },
  },
  {
    id: 'conv-relu',
    slideId: 17,
    title: {
      en: '3. 3D Convolution Dot Product & ReLU Activation',
      km: '៣. ប្រតិបត្តិការ Convolution & អនុគមន៍ ReLU',
    },
    latex: String.raw`z_{i,j} = \mathbf{w}^\top \mathbf{x}_{i,j} + b, \qquad \operatorname{ReLU}(z) = \max(0, z)`,
    variables: [
      { symbol: 'x_{i,j}', meaning: { en: 'Flattened F×F×C_in image patch', km: 'បណ្តុំភីកសែលក្នុងប្រអប់ស្កេន F×F×C_in' } },
      { symbol: 'w', meaning: { en: 'Learnable filter weights vector', km: 'វ៉ិចទ័រទម្ងន់របស់តម្រង (Filter Weights)' } },
      { symbol: 'b', meaning: { en: 'Scalar bias term', km: 'តម្លៃលំអៀង (Bias) ចំនួន ១' } },
      { symbol: 'ReLU(z)', meaning: { en: 'Clamps negatives to 0, keeps positives', km: 'កាត់តម្លៃអវិជ្ជមានទៅ 0 រក្សាទុកតែតម្លៃវិជ្ជមាន' } },
    ],
    explanation: {
      en: 'Every spatial step computes one weighted sum across all input channels plus bias, then ReLU keeps only positive feature activations.',
      km: 'នៅគ្រប់ជំហាន ប្រតិបត្តិការនេះគុណភីកសែលទាំងអស់គ្រប់ស្រទាប់ពណ៌នឹងទម្ងន់ w បូកជាមួយ b រួចប្រើ ReLU ដើម្បីទុកតែលក្ខណៈពិសេសវិជ្ជមាន។',
    },
    example: {
      en: '5×5×3 RGB patch = 75 weights + 1 bias ⇒ 1 scalar output pixel per location.',
      km: 'ឧទាហរណ៍៖ តម្រង 5×5×3 មាន 75 ទម្ងន់ + 1 bias ⇒ បង្កើតបាន ១ ចំណុចក្នុង Output Map។',
    },
  },
  {
    id: 'params-count',
    slideId: 18,
    title: {
      en: '4. Total Learnable Parameters in a Conv Layer',
      km: '៤. រូបមន្តរាប់ចំនួនប៉ារ៉ាម៉ែត្រសរុប (Parameters)',
    },
    latex: String.raw`\text{Params} = K \times \big(F \cdot F \cdot C_{\text{in}} + 1\big)`,
    variables: [
      { symbol: 'K', meaning: { en: 'Number of filters (= output depth)', km: 'ចំនួន Filter សរុប (ស្មើជម្រៅ Output)' } },
      { symbol: 'F × F', meaning: { en: 'Filter spatial area', km: 'ផ្ទៃក្រឡារបស់ Filter នីមួយៗ' } },
      { symbol: 'C_in', meaning: { en: 'Input depth / channels (e.g. 3 for RGB)', km: 'ជម្រៅស្រទាប់ចូល (ឧ. 3 សម្រាប់រូបពណ៌ RGB)' } },
      { symbol: '+ 1', meaning: { en: 'One bias per filter', km: 'បូក Bias ១ សម្រាប់ Filter នីមួយៗ' } },
    ],
    explanation: {
      en: 'Because weights are shared across every position on the image, parameter count depends only on filter size and count—not image width/height!',
      km: 'ដោយសារ Filter ចែករំលែកទម្ងន់ដូចគ្នាទូទាំងរូបភាព ចំនួនប៉ារ៉ាម៉ែត្រអាស្រ័យតែលើទំហំ និងចំនួន Filter ប៉ុណ្ណោះ (មិនអាស្រ័យលើទំហំរូបភាពធំឬតូចទេ)។',
    },
    example: {
      en: '6 filters of 5×5×3 ⇒ 6 × (75 + 1) = 456 params (vs 14.4M in Fully Connected!).',
      km: 'ឧទាហរណ៍៖ 6 Filters ទំហំ 5×5×3 ⇒ 6 × (75 + 1) = 456 ប៉ារ៉ាម៉ែត្រ (តិចជាង Fully Connected ដល់ទៅ ៣១,៦៩០ ដង!)។',
    },
  },
  {
    id: 'pooling-rf',
    slideId: 25,
    title: {
      en: '5. Max Pooling & Receptive Field Growth',
      km: '៥. Max Pooling និងការរីកធំនៃ Receptive Field',
    },
    latex: String.raw`P_{i,j,c} = \max_{0 \le u,v < F_p} A_{S i+u,\; S j+v,\; c}, \qquad r_l = r_{l-1} + (F_l - 1)\prod_{i=1}^{l-1} S_i`,
    variables: [
      { symbol: 'F_p, S', meaning: { en: 'Pool window & stride (typically 2×2, S=2)', km: 'ទំហំប្រអប់ Pooling និងជំហាន (ទូទៅ 2×2, S=2)' } },
      { symbol: 'C_out', meaning: { en: 'Depth stays unchanged (C_out = C_in)', km: 'ជម្រៅស្រទាប់នៅដដែល (C_out = C_in)' } },
      { symbol: 'r_l', meaning: { en: 'Effective input area seen by neuron at layer l', km: 'ផ្ទៃរូបភាពដើមដែលណឺរ៉ូនស្រទាប់ទី l មើលឃើញ' } },
    ],
    explanation: {
      en: 'Pooling halves spatial resolution using 0 learnable parameters, while stacking conv layers expands the receptive field from tiny edges to whole objects.',
      km: 'Pooling បង្រួមទំហំរូបភាពពាក់កណ្តាលដោយគ្មានប៉ារ៉ាម៉ែត្រ (0 params) ចំណែកការតម្រៀបស្រទាប់ Conv បន្តគ្នាជួយពង្រីកមុំមើលពីគែមតូចៗទៅជារូបរាងពេញលេញ។',
    },
    example: {
      en: '4×4 input with 2×2 MaxPool (S=2) ⇒ 2×2 output; two 3×3 Convs see a 5×5 patch.',
      km: 'ឧទាហរណ៍៖ 4×4 ឆ្លង 2×2 MaxPool (S=2) ⇒ នៅសល់ 2×2; ស្រទាប់ 3×3 ពីរជាន់មើលឃើញផ្ទៃ 5×5។',
    },
  },
  {
    id: 'resnet-loss',
    slideId: 30,
    title: {
      en: '6. ResNet Skip Connection & Cross-Entropy Loss',
      km: '៦. ResNet Skip Connection និង Cross-Entropy Loss',
    },
    latex: String.raw`\mathbf{y} = \mathcal{F}(\mathbf{x}, \{W_i\}) + \mathbf{x}, \qquad \mathcal{L}_{\text{CE}} = -\sum_c y_c \log\big(\operatorname{softmax}(z)_c\big)`,
    variables: [
      { symbol: 'x', meaning: { en: 'Identity shortcut input passed directly forward', km: 'ទិន្នន័យដើមបញ្ជូនផ្ទាល់ឆ្លងកាត់ (Skip Connection)' } },
      { symbol: 'F(x)', meaning: { en: 'Residual correction learned by weight layers', km: 'កម្រិតកែតម្រូវបន្ថែមដែលរៀនដោយស្រទាប់ទម្ងន់' } },
      { symbol: 'L_CE', meaning: { en: 'Classification penalty minimized via gradient descent', km: 'កម្រិតល្អៀង (Loss) ដែលត្រូវកាត់បន្ថយពេលហ្វឹកហាត់' } },
    ],
    explanation: {
      en: 'Adding x directly lets gradients flow cleanly back through 100+ layers without vanishing; Softmax + Cross-Entropy trains class probabilities.',
      km: 'ការបូក x ផ្ទាល់ជួយឲ្យ Gradient ហូរត្រឡប់ក្រោយមិនងាយបាត់បង់ក្នុងបណ្តាញជ្រៅៗ រីឯ Softmax + Cross-Entropy ប្រើសម្រាប់វាស់កំហុសចំណាត់ថ្នាក់។',
    },
    example: {
      en: 'ResNet-152 reaches 3.57% ImageNet top-5 error using y = F(x) + x blocks.',
      km: 'ឧទាហរណ៍៖ ResNet-152 ប្រើប្លុក y = F(x) + x ដើម្បីឈ្នះកំហុស ImageNet ត្រឹម 3.57%។',
    },
  },
];

export const SLIDE_FORMULA_GUIDES: Record<number, SlideFormulaGuide> = {
  1: {
    variables: [
      { symbol: 'I', meaning: { en: '2D Input image matrix', km: 'ម៉ាទ្រីសរូបភាពចូល' } },
      { symbol: 'K', meaning: { en: 'Learnable convolution kernel/filter', km: 'តម្រង (Kernel) ស្វែងរកលក្ខណៈពិសេស' } },
      { symbol: 'b', meaning: { en: 'Scalar bias offset', km: 'តម្លៃលំអៀង (Bias)' } },
      { symbol: 'y[i,j]', meaning: { en: 'Output feature activation at row i, col j', km: 'តម្លៃលទ្ធផលនៅទីតាំង (i, j)' } },
    ],
    explanation: {
      en: 'The fundamental building block of CNNs: slide kernel K across image I, compute dot products, and add bias b to form a feature map.',
      km: 'នេះជាសមីការគ្រឹះរបស់ CNN៖ រំកិលតម្រង K លើរូបភាព I គណនាផលបូកគុណ (dot product) និងបូក Bias b ដើម្បីបង្កើតផែនទីលក្ខណៈពិសេស។',
    },
  },
  2: {
    variables: [
      { symbol: 'L_content', meaning: { en: 'High-level object structure difference', km: 'ភាពខុសគ្នានៃខ្លឹមសាររូបភាពដើម (C) និងលទ្ធផល (G)' } },
      { symbol: 'L_style', meaning: { en: 'Texture & brushstroke Gram-matrix difference', km: 'ភាពខុសគ្នានៃរចនាបថពណ៌/សាច់រូបភាព (S) និង (G)' } },
      { symbol: 'α, β', meaning: { en: 'Weight balance between content and style', km: 'មេគុណថ្លឹងថ្លែងរវាងខ្លឹមសារ និងរចនាបថ' } },
    ],
    explanation: {
      en: 'Neural Style Transfer separates "what is in the photo" (content) from "how it is painted" (style) using two CNN feature losses.',
      km: 'រូបមន្តនេះផ្គុំរូបភាពថ្មី G ដោយរក្សាខ្លឹមសារពីរូប C និងផ្ទេរសិល្បៈពីរូប S តាមរយៈទម្ងន់ α និង β។',
    },
  },
  3: {
    variables: [
      { symbol: 'H × W × C', meaning: { en: 'Image height × width × 3 RGB channels', km: 'កម្ពស់ × ទទឹង × ៣ ស្រទាប់ពណ៌ (RGB)' } },
      { symbol: 'N_hidden', meaning: { en: 'Number of neurons in 1st hidden layer', km: 'ចំនួនណឺរ៉ូនក្នុងស្រទាប់លាក់ទី ១' } },
    ],
    explanation: {
      en: 'Shows why standard Fully Connected networks explode on high-res images: connecting 1,000×1,000×3 pixels to 1,000 neurons needs ~3 billion weights!',
      km: 'បង្ហាញមូលហេតុដែលបណ្តាញ Fully Connected ធម្មតាមិនអាចទទួលរូបធំបាន៖ ភីកសែល ១០⁶ ភ្ជាប់ទៅណឺរ៉ូន ១០³ ត្រូវការទម្ងន់ដល់ទៅ ១០⁹ ឯណោះ!',
    },
    example: {
      en: '1000 × 1000 × 3 = 3,000,000 inputs × 1,000 hidden units = 3 × 10⁹ weights.',
      km: 'ឧទាហរណ៍៖ 1000×1000 (10⁶ ភីកសែល) × 1,000 ណឺរ៉ូន = ១,០០០,០០០,០០០+ ទម្ងន់។',
    },
  },
  4: {
    variables: [
      { symbol: 'Transform(x)', meaning: { en: 'Lighting, shift, rotation, or occlusion change', km: 'ការប្រែប្រួលពន្លឺ មុំបង្វិល ទំហំ ឬការបាំង' } },
      { symbol: 'f(x)', meaning: { en: 'Predicted class label (e.g. "Cat")', km: 'លទ្ធផលទស្សន៍ទាយប្រភេទវត្ថុ (ឧ. "ឆ្មា")' } },
    ],
    explanation: {
      en: 'An ideal vision classifier stays invariant—meaning f(Transform(x)) still predicts the exact same label despite camera or pose changes.',
      km: 'ម៉ូដែលល្អត្រូវតែស្គាល់វត្ថុដដែល ទោះបីរូបភាពត្រូវបានបង្វិល ផ្លាស់ប្តូរពន្លឺ ឬប្តូរទីតាំងក៏ដោយ។',
    },
  },
  5: {
    variables: [
      { symbol: 'Input[i+u, j+v]', meaning: { en: 'Image pixel inside the 3×3 sliding patch', km: 'តម្លៃភីកសែលក្នុងតំបន់ 3×3 ដែលកំពុងស្កេន' } },
      { symbol: 'Filter[u, v]', meaning: { en: 'Edge detector weight at offset (u, v)', km: 'ទម្ងន់របស់ Filter នៅទីតាំង (u, v)' } },
    ],
    explanation: {
      en: 'For each output pixel (i, j), multiply all 9 neighboring pixels by the 3×3 filter weights and sum them together.',
      km: 'គណនាតម្លៃ ១ ចំណុចក្នុង Output ដោយយកភីកសែល ៩ គ្រាប់ជុំវិញគុណនឹងទម្ងន់ Filter 3×3 រួចបូកចូលគ្នា។',
    },
  },
  6: {
    variables: [
      { symbol: 'I_step', meaning: { en: 'Input patch transitioning from bright (10) to dark (0)', km: 'រូបភាពដែលមានផ្នែកភ្លឺ (10) នៅខាងឆ្វេង និងងងឹត (0) នៅខាងស្តាំ' } },
      { symbol: 'K_v', meaning: { en: 'Vertical edge filter [+1,0,-1]', km: 'តម្រងរកគែមបញ្ឈរ [+1, 0, -1]' } },
    ],
    explanation: {
      en: 'Where brightness is uniform (10 vs 10 or 0 vs 0), positive and negative filter weights cancel to 0. Only at the boundary do they sum to 30!',
      km: 'កន្លែងពណ៌ស្មើគ្នា លទ្ធផលបូកស៊ីសងស្មើ 0 ប៉ុន្តែត្រង់ព្រំប្រទល់ពន្លឺផ្លាស់ប្តូរពី 10 ទៅ 0 លទ្ធផលឡើងខ្ពស់ 30 (រកឃើញគែមបញ្ឈរ)។',
    },
  },
  7: {
    variables: [
      { symbol: 'W = [w1..w9]', meaning: { en: '9 learnable parameters inside one 3×3 filter', km: 'ទម្ងន់ទាំង ៩ ក្នុង Filter 3×3 ដែលរៀនដោយស្វ័យប្រវត្តិ' } },
      { symbol: 'η (eta)', meaning: { en: 'Learning rate controlling update step size', km: 'អត្រារៀន (Learning Rate)' } },
      { symbol: '∂L / ∂W', meaning: { en: 'Gradient showing how to reduce loss L', km: 'ដេរីវេ Gradient ប្រាប់ទិសដៅកែទម្ងន់' } },
    ],
    explanation: {
      en: 'Instead of hand-coding Sobel or Prewitt edge filters, Backpropagation automatically updates w1..w9 from training images.',
      km: 'ជំនួសឲ្យការកំណត់លេខ Filter ដោយដៃ CNN ប្រើ Gradient Descent ដើម្បីកែសម្រួល w1..w9 ដោយស្វ័យប្រវត្តិ។',
    },
  },
  8: {
    variables: [
      { symbol: '{-1, +1}^(2×2)', meaning: { en: '2×2 grid where -1 = white, +1 = dark', km: 'ក្រឡា 2×2 ដែល -1 = ពណ៌ស និង +1 = ពណ៌ខ្មៅ' } },
      { symbol: '{"/", "\\"}', meaning: { en: 'Binary target class: forward vs backslash diagonal', km: 'ថ្នាក់គោលដៅទាំងពីរ៖ បន្ទាត់ទ្រេត "/" ឬ "\\"' } },
    ],
    explanation: {
      en: 'Formalizes our toy 2×2 vision problem: map 4 pixel values directly to one of two diagonal orientations.',
      km: 'បំលែងបញ្ហាសាមញ្ញ 2×2៖ ទទួលភីកសែល ៤ គ្រាប់ រួចចាត់ថ្នាក់ថាជា "/" ឬ "\\"' ,
    },
  },
  9: {
    variables: [
      { symbol: 'Sum(pixels)', meaning: { en: 'Simple unweighted addition of all 4 pixels', km: 'ផលបូកភីកសែលទាំង ៤ ដោយមិនគុណទម្ងន់' } },
    ],
    explanation: {
      en: 'Both "/" and "\\" have two +1 pixels and two −1 pixels, so their raw sum is 0—making them impossible to separate without weights!',
      km: 'ទាំង "/" និង "\\" សុទ្ធតែមាន +1 ពីរ និង −1 ពីរ ដូច្នេះបើបូកធម្មតាស្មើ 0 ដូចគ្នា មិនអាចបែងចែកដាច់ទេ។',
    },
  },
  10: {
    variables: [
      { symbol: 'w = [-1,+1,+1,-1]', meaning: { en: 'Weights tuned to match "/" (+1 on anti-diagonal)', km: 'ទម្ងន់រៀបចំសម្រាប់រក "/" (+1 តាមអង្កត់ទ្រូងបញ្ច្រាស)' } },
      { symbol: 'w · x', meaning: { en: 'Dot product similarity score', km: 'ពិន្ទុភាពដូចគ្នា (Dot Product)' } },
    ],
    explanation: {
      en: 'Matching signs (+1×+1 and −1×−1) always yield +1, so "/" scores +4 while the opposite pattern "\\" scores −4!',
      km: 'ពេលសញ្ញាដូចគ្នាគុណគ្នាចេញ +1 ដូច្នេះ "/" បានពិន្ទុ +4 ឯ "\\" ចេញពិន្ទុផ្ទុយ −4 ធ្វើឲ្យបែងចែកដាច់ស្រឡះ។',
    },
  },
  11: {
    variables: [
      { symbol: 'z = ∑(W * X)', meaning: { en: 'Weighted sum score for single classifier', km: 'ផលបូកគុណសរុបរបស់ Classifier ១' } },
    ],
    explanation: {
      en: 'One linear classifier outputs a single score: positive (> 0) predicts "/", while negative (< 0) predicts "\\".',
      km: 'Classifier ១ អាចបែងចែករវាងថ្នាក់ ២ បានដោយមើលសញ្ញា៖ បើ z > 0 ជា "/" បើ z < 0 ជា "\\"' ,
    },
  },
  12: {
    variables: [
      { symbol: 'W_1, W_2', meaning: { en: 'Two dedicated filters: one for "/", one for "\\"', km: 'តម្រងពីរដាច់ដោយឡែក៖ W₁ រក "/" និង W₂ រក "\\"' } },
    ],
    explanation: {
      en: 'Having one filter per pattern lets each neuron output a positive activation only when its own specific pattern is present.',
      km: 'ការមាន Filter មួយសម្រាប់ទម្រង់នីមួយៗ ធ្វើឲ្យណឺរ៉ូនបញ្ចេញតម្លៃវិជ្ជមានតែពេលឃើញទម្រង់របស់ខ្លួនប៉ុណ្ណោះ។',
    },
  },
  13: {
    variables: [
      { symbol: 'X_(3×3)', meaning: { en: '3×3 letter image ("X" or "O")', km: 'រូបភាពអក្សរ 3×3 ("X" ឬ "O")' } },
    ],
    explanation: {
      en: 'A 3×3 "X" or "O" contains four overlapping 2×2 corners—each corner is actually a "/" or "\\" pattern we already know how to detect!',
      km: 'រូប "X" ឬ "O" ទំហំ 3×3 ផ្សំឡើងពីបំណែកជ្រុង 2×2 ចំនួន ៤ ដែលសុទ្ធតែជា "/" ឬ "\\" ។',
    },
  },
  14: {
    variables: [
      { symbol: 'N=3, F=2, S=1', meaning: { en: '3×3 image scanned by 2×2 filters with step 1', km: 'រូប 3×3 ស្កេនដោយ Filter 2×2 ជំហាន 1' } },
      { symbol: 'A ∈ R^(2×2×2)', meaning: { en: 'Two 2×2 feature maps stacked together', km: 'ផែនទីលទ្ធផល 2×2 ចំនួន ២ ត្រួតគ្នា' } },
    ],
    explanation: {
      en: 'Sliding two 2×2 filters across the 3×3 input produces O = (3−2)/1 + 1 = 2×2 positions per filter, giving a 2×2×2 volume.',
      km: 'ការស្កេន Filter 2×2 ចំនួន ២ លើរូប 3×3 បង្កើតបានទីតាំង 2×2 សម្រាប់ Filter នីមួយៗ សរុបជាទម្រង់ 2×2×2។',
    },
  },
  15: {
    variables: [
      { symbol: 'A^(k)', meaning: { en: 'ReLU-activated feature map for filter k', km: 'ផែនទីលទ្ធផលក្រោយឆ្លង ReLU សម្រាប់ Filter ទី k' } },
      { symbol: 'argmax', meaning: { en: 'Picks the class with highest final score', km: 'ជ្រើសយកថ្នាក់ដែលមានពិន្ទុខ្ពស់ជាងគេ' } },
    ],
    explanation: {
      en: 'ReLU turns negative mismatches (−4) into 0, keeping strong matches (+4) at specific corners so the final layer recognizes "X" vs "O".',
      km: 'ReLU លុបតម្លៃអវិជ្ជមាន (−4) ទៅ 0 ទុកតែទីតាំងត្រូវគ្នា (+4) ដើម្បីឲ្យស្រទាប់ចុងក្រោយស្គាល់អក្សរ "X" ឬ "O" យ៉ាងច្បាស់។',
    },
  },
  16: {
    variables: [
      { symbol: 'H × W × C_in', meaning: { en: '3D input volume (e.g. 32×32×3 RGB)', km: 'ទំហំរូបភាព 3D (កម្ពស់ × ទទឹង × ជម្រៅពណ៌)' } },
      { symbol: 'F × F × C_in', meaning: { en: '3D filter whose depth MUST equal C_in', km: 'តម្រង 3D ដែលជម្រៅត្រូវតែស្មើ C_in ជានិច្ច' } },
    ],
    explanation: {
      en: 'For color images (RGB, depth 3), the filter is a 3D cube extending through all 3 color channels simultaneously.',
      km: 'សម្រាប់រូបភាពពណ៌ RGB Filter ក៏ជាដុំ 3D ដែលមានជម្រៅ 3 ស្មើនឹងស្រទាប់ពណ៌របស់រូបភាពដែរ។',
    },
  },
  17: {
    variables: [
      { symbol: 'w, x_ij', meaning: { en: '75 weights & 75 pixel values (5×5×3)', km: 'ទម្ងន់ ៧៥ និងភីកសែល ៧៥ (5×5×3)' } },
      { symbol: 'b', meaning: { en: '1 scalar bias', km: 'តម្លៃ Bias ចំនួន ១' } },
    ],
    explanation: {
      en: 'Every output pixel is one 75-dimensional dot product across Red, Green, and Blue channels plus bias: (32 − 5)/1 + 1 = 28.',
      km: 'ភីកសែលចេញនីមួយៗកើតពីផលបូកគុណ ៧៥ វិមាត្រ (Red+Green+Blue) បូកនឹង Bias ១ ហើយបានទំហំ (32−5)/1 + 1 = 28។',
    },
  },
  18: {
    variables: [
      { symbol: 'K', meaning: { en: 'Number of filters (e.g. 6 filters)', km: 'ចំនួន Filter សរុប (ឧ. 6)' } },
      { symbol: 'F·F·C_in + 1', meaning: { en: 'Weights + 1 bias inside a single filter', km: 'ទម្ងន់ក្នុង Filter ១ បូក Bias ១' } },
    ],
    explanation: {
      en: 'Each filter produces 1 activation map (28×28×1). Stacking K = 6 filters builds a 28×28×6 output volume with 6 × 76 = 456 parameters.',
      km: 'Filter នីមួយៗបង្កើតបានផែនទី ១ សន្លឹក។ ប្រើ 6 Filters បានលទ្ធផល 28×28×6 និងមានប៉ារ៉ាម៉ែត្រ 6 × (75+1) = 456។',
    },
  },
  19: {
    variables: [
      { symbol: 'ReLU(z)', meaning: { en: 'Element-wise max(0, z) activation', km: 'អនុគមន៍ max(0, z) អនុវត្តលើគ្រប់ធាតុ' } },
    ],
    explanation: {
      en: 'Layer 1 (6 filters of 5×5×3) outputs 28×28×6; Layer 2 (10 filters of 5×5×6) must match depth 6 and outputs 24×24×10.',
      km: 'ស្រទាប់ទី ១ ចេញ 28×28×6 (ជម្រៅ 6) ដូច្នេះស្រទាប់ទី ២ ត្រូវប្រើ Filter 5×5×6 ចំនួន ១០ ដើម្បីចេញ 24×24×10។',
    },
  },
  20: {
    variables: [
      { symbol: 'r_l', meaning: { en: 'Receptive field size at layer l', km: 'ទំហំផ្ទៃមើលឃើញ (Receptive Field) នៅស្រទាប់ទី l' } },
      { symbol: 'F_l, S_i', meaning: { en: 'Filter size at layer l & earlier strides', km: 'ទំហំ Filter ស្រទាប់ទី l និង Stride មុនៗ' } },
    ],
    explanation: {
      en: 'Each extra 3×3 conv layer widens what a single neuron sees in the original image: 3×3 → 5×5 → 7×7.',
      km: 'ពេលតម្រៀបស្រទាប់ Conv បន្តគ្នា ណឺរ៉ូនកាន់តែជ្រៅអាចមើលឃើញផ្ទៃរូបដើមកាន់តែធំ៖ 3×3 → 5×5 → 7×7។',
    },
  },
  21: {
    variables: [
      { symbol: 'h^(1), h^(2), h^(3)', meaning: { en: 'Low, mid, and high-level representations', km: 'លក្ខណៈកម្រិតទាប (គែម) → មធ្យម (ផ្នែកមុខ) → ខ្ពស់ (មុខពេញ)' } },
    ],
    explanation: {
      en: 'Deep CNN layers compose simple edge features into facial parts (eyes, nose) and eventually full face identities.',
      km: 'ស្រទាប់ដំបូងរៀនគែម-ជ្រុង ស្រទាប់កណ្តាលរៀនផ្នែកមុខ (ភ្នែក ច្រមុះ) និងស្រទាប់ជ្រៅស្គាល់ទម្រង់មុខទាំងមូល។',
    },
  },
  22: {
    variables: [
      { symbol: 'N', meaning: { en: 'Input spatial width/height', km: 'ទំហំរូបភាពចូល (N×N)' } },
      { symbol: 'F', meaning: { en: 'Filter size (F×F)', km: 'ទំហំតម្រង (F×F)' } },
      { symbol: 'S (stride)', meaning: { en: 'Pixels shifted per step', km: 'ចំនួនជំហានរំកិលម្តងៗ' } },
      { symbol: 'O', meaning: { en: 'Output spatial size', km: 'ទំហំលទ្ធផលចេញ (O×O)' } },
    ],
    explanation: {
      en: 'Without padding, output shrinks on every layer. Stride must divide (N − F) evenly so the result O is a whole integer.',
      km: 'បើគ្មាន Padding រូបភាពរួមតូចជានិច្ច។ ម្យ៉ាងទៀត (N − F) ត្រូវតែចែកដាច់នឹង S ដើម្បីឲ្យ O ចេញជាចំនួនគត់។',
    },
    example: {
      en: 'N=7, F=3: S=1 ⇒ 5 | S=2 ⇒ 3 | S=3 ⇒ 2.33 (Invalid!)',
      km: 'ឧទាហរណ៍៖ N=7, F=3: S=1 ⇒ 5 | S=2 ⇒ 3 | S=3 ⇒ 2.33 (មិនចែកដាច់ មិនអាចប្រើបាន!)',
    },
  },
  23: {
    variables: [
      { symbol: 'N', meaning: { en: 'Original input size', km: 'ទំហំរូបភាពដើម' } },
      { symbol: '2P', meaning: { en: 'Zero padding added to both left+right (and top+bottom)', km: 'Padding បន្ថែមទាំងសងខាង (ឆ្វេង+ស្តាំ ឬ លើ+ក្រោម)' } },
      { symbol: 'F', meaning: { en: 'Filter size', km: 'ទំហំតម្រង' } },
      { symbol: 'S', meaning: { en: 'Stride step', km: 'ជំហានរំកិល' } },
    ],
    explanation: {
      en: 'Adding P borders of zeros expands the effective input to N + 2P. With S = 1 and P = (F − 1)/2, output size equals N exactly.',
      km: 'ការបន្ថែមជួរលេខ 0 ចំនួន P ជុំវិញ ពង្រីកផ្ទៃទៅជា N + 2P។ បើ S = 1 និង P = (F − 1)/2 ទំហំចេញស្មើដើម N ដដែល។',
    },
    example: {
      en: 'N=7, F=3, P=1, S=1 ⇒ (7 + 2(1) − 3)/1 + 1 = 7 (Same Size).',
      km: 'ឧទាហរណ៍៖ N=7, F=3, P=1, S=1 ⇒ (7 + 2(1) − 3)/1 + 1 = 7 (រក្សាទំហំដើម)។',
    },
  },
  24: {
    variables: [
      { symbol: '1×1×64', meaning: { en: 'Filter spanning all 64 channels at a single pixel', km: 'តម្រង 1×1 កាត់តាមជម្រៅទាំង ៦៤ ត្រង់ ១ ភីកសែល' } },
      { symbol: '128', meaning: { en: 'Number of 1×1 filters (new output depth)', km: 'ចំនួន Filter 1×1 (ក្លាយជាជម្រៅថ្មី)' } },
    ],
    explanation: {
      en: 'A 1×1 convolution mixes information across channels at each pixel—shrinking or expanding depth without altering H×W spatial size.',
      km: '1×1 Conv បូកបញ្ចូលទិន្នន័យតាមជម្រៅ Channels ត្រង់ទីតាំងនីមួយៗ ដើម្បីបង្កើន ឬបង្រួមជម្រៅដោយរក្សា H×W ដដែល។',
    },
  },
  25: {
    variables: [
      { symbol: 'F_p, S', meaning: { en: 'Pooling window size & stride (e.g. 2×2, S=2)', km: 'ទំហំប្រអប់ Pooling និងជំហាន (ឧ. 2×2, S=2)' } },
      { symbol: 'max', meaning: { en: 'Takes maximum value inside each block', km: 'ជ្រើសយកតម្លៃធំបំផុតក្នុងប្រអប់នីមួយៗ' } },
    ],
    explanation: {
      en: 'Downsamples height and width independently per channel with zero learnable weights, reducing memory and adding translation invariance.',
      km: 'កាត់បន្ថយទទឹងនិងកម្ពស់ពាក់កណ្តាលដោយគ្មានទម្ងន់រៀនបន្ថែម (0 params) និងរក្សាជម្រៅ Channel ដដែល។',
    },
    example: {
      en: '4×4 matrix with 2×2 MaxPool (S=2) ⇒ O = (4−2)/2 + 1 = 2 (2×2 matrix).',
      km: 'ឧទាហរណ៍៖ តារាង 4×4 ឆ្លង MaxPool 2×2 (S=2) ⇒ នៅសល់ 2×2។',
    },
  },
  26: {
    variables: [
      { symbol: '8×8×24', meaning: { en: 'Final pooled feature volume', km: 'ទំហំ Feature Map ចុងក្រោយមុន Flatten' } },
      { symbol: '1,536', meaning: { en: 'Flattened 1D vector length (8×8×24)', km: 'វ៉ិចទ័រ ១ វិមាត្រក្រោយ Flatten (8×8×24 = 1,536)' } },
    ],
    explanation: {
      en: 'After feature extraction, Flatten converts the 3D cube into a 1D vector so Fully Connected layers can output final class scores.',
      km: 'បន្ទាប់ពីទាញយកលក្ខណៈពិសេសរួច Flatten បំលែងទម្រង់ 3D ទៅជាជួរ 1D ដើម្បីឲ្យ Fully Connected គណនាពិន្ទុចំណាត់ថ្នាក់។',
    },
  },
  27: {
    variables: [
      { symbol: 'Params_FC', meaning: { en: 'Weights if connecting all inputs to all outputs', km: 'ចំនួនទម្ងន់បើភ្ជាប់គ្រប់ភីកសែលទាំងអស់ (FC)' } },
      { symbol: 'Params_Conv', meaning: { en: 'Weights using shared 5×5×3 filters', km: 'ចំនួនទម្ងន់ពេលប្រើ Filter 5×5×3 ចែករំលែក' } },
    ],
    explanation: {
      en: 'Local connectivity + parameter sharing cut parameters from 14.45 million down to 456—a ~31,690× reduction preventing overfitting.',
      km: 'ការភ្ជាប់ក្នុងតំបន់តូច និងការប្រើទម្ងន់រួម កាត់បន្ថយប៉ារ៉ាម៉ែត្រពី ១៤.៤៥ លាន មកត្រឹម ៤៥៦ (តិចជាង ៣១,៦៩០ ដង)។',
    },
  },
  28: {
    variables: [
      { symbol: 'C₁, C₃, C₅', meaning: { en: 'Convolutional layers with 5×5 filters', km: 'ស្រទាប់ Convolution ប្រើ Filter 5×5' } },
      { symbol: 'S₂, S₄', meaning: { en: 'Subsampling (2×2 Pooling, stride 2)', km: 'ស្រទាប់បង្រួមទំហំ 2×2 (Stride 2)' } },
    ],
    explanation: {
      en: 'LeNet-5 (1998) established the classic CNN pattern: Conv → Pool → Conv → Pool → FC → Output (~60K parameters total).',
      km: 'LeNet-5 (១៩៩៨) បង្កើតគំរូស្ថាបត្យកម្មដំបូង៖ Conv → Pool → Conv → Pool → FC → លទ្ធផល ១០ ខ្ទង់លេខ។',
    },
  },
  29: {
    variables: [
      { symbol: 'O₁ = 55', meaning: { en: 'Conv1: (227 − 11)/4 + 1 = 55', km: 'Conv1: (227 − 11)/4 + 1 = 55' } },
      { symbol: 'O_p = 27', meaning: { en: 'Pool1: (55 − 3)/2 + 1 = 27', km: 'Pool1: (55 − 3)/2 + 1 = 27' } },
    ],
    explanation: {
      en: 'Tracing AlexNet layer-by-layer with the spatial formula shows exact tensor shrinkage from 227×227×3 down to 6×6×256 = 9,216 before FC.',
      km: 'ប្រើរូបមន្ត O = (N+2P−F)/S + 1 តាមដានទំហំ AlexNet ពី 227×227×3 រហូតដល់ 6×6×256 = 9,216 មុនចូលស្រទាប់ FC។',
    },
  },
  30: {
    variables: [
      { symbol: 'F(x)', meaning: { en: 'Residual mapping learned by conv layers', km: 'លទ្ធផលរៀនដោយស្រទាប់ Conv' } },
      { symbol: '+ x', meaning: { en: 'Identity skip connection shortcut', km: 'ផ្លូវកាត់បូកទិន្នន័យដើម x ផ្ទាល់' } },
    ],
    explanation: {
      en: 'The "+ I" term in the gradient ∂L/∂x keeps gradient signal alive even across 152+ layers, solving deep network degradation.',
      km: 'តួ + I ក្នុងដេរីវេជួយឲ្យ Gradient ឆ្លងកាត់ស្រទាប់ ១៥២+ ជាន់បានដោយមិនសាបសូន្យ។',
    },
  },
  31: {
    variables: [
      { symbol: 'D_MNIST', meaning: { en: '70K 28×28 grayscale handwritten digits', km: 'រូបលេខសរសេរដៃ ៧ ម៉ឺនសន្លឹក (28×28×1)' } },
      { symbol: 'D_CIFAR-10', meaning: { en: '60K 32×32 RGB natural objects', km: 'រូបពណ៌ ៦ ម៉ឺនសន្លឹក (32×32×3, ១០ ថ្នាក់)' } },
      { symbol: 'ImageNet', meaning: { en: '14M+ images across 20K+ categories', km: 'រូបភាព ១៤ លាន+ ជាង ២ ម៉ឺនប្រភេទ' } },
    ],
    explanation: {
      en: 'Standard benchmarks scale up in image resolution, color channels, and class diversity from MNIST to CIFAR-10 and ImageNet.',
      km: 'សំណុំទិន្នន័យសាកល្បងកើនទំហំ និងភាពស្មុគស្មាញពី MNIST (28×28) ទៅ CIFAR-10 (32×32 RGB) និង ImageNet (14M+)។',
    },
  },
  32: {
    variables: [
      { symbol: 'y_c', meaning: { en: 'True one-hot label (1 for correct class, 0 otherwise)', km: 'ស្លាកចម្លើយពិត (1 ចំពោះថ្នាក់ត្រឹមត្រូវ)' } },
      { symbol: 'softmax(z)_c', meaning: { en: 'Predicted probability for class c', km: 'ប្រូបាប៊ីលីតេដែលម៉ូដែលទស្សន៍ទាយសម្រាប់ថ្នាក់ c' } },
      { symbol: 'θ, η', meaning: { en: 'Model weights and learning rate', km: 'ប៉ារ៉ាម៉ែត្រម៉ូដែល និងអត្រារៀន' } },
    ],
    explanation: {
      en: 'During training, Cross-Entropy measures prediction error and updates weights θ opposite the gradient to improve accuracy.',
      km: 'ពេលហ្វឹកហាត់ Cross-Entropy វាស់កំហុសទស្សន៍ទាយ រួចកែប្រែទម្ងន់ θ ជាបន្តបន្ទាប់ដើម្បីបង្កើនភាពត្រឹមត្រូវ។',
    },
  },
  33: {
    variables: [
      { symbol: '∂L / ∂O', meaning: { en: 'Upstream error gradient from next layer', km: 'Gradient កំហុសដែលហូរត្រឡប់ពីស្រទាប់បន្ទាប់' } },
      { symbol: '∂L / ∂K', meaning: { en: 'Weight gradient used to update kernel K', km: 'Gradient សម្រាប់កែសម្រួលទម្ងន់ Filter K' } },
      { symbol: 'rot₁₈₀(K)', meaning: { en: '180-degree rotated kernel for backward pass', km: 'តម្រង K បង្វិល ១៨០ ដឺក្រេសម្រាប់គណនាត្រឡប់ក្រោយ' } },
    ],
    explanation: {
      en: 'Backpropagation through a Conv layer is itself a convolution: filter gradients correlate Input with ∂L/∂O, and input gradients convolve ∂L/∂O with rotated K.',
      km: 'ការធ្វើ Backpropagation ក្នុងស្រទាប់ Conv ក៏ជាប្រតិបត្តិការ Convolution ដែរ ដើម្បីរក Gradient ទាំងសម្រាប់ទម្ងន់ K និងសម្រាប់ស្រទាប់មុន I។',
    },
  },
};
