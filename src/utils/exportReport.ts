import katex from 'katex';
import PptxGenJS from 'pptxgenjs';
import { CnnSlide, LanguageMode } from '../types/slide';

export const ORIGINAL_CNN_PDF_URL =
  '/assets/aistudio/03_Convolutional_Neural_Networks_91f7f254.pdf';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeCsv(raw: string): string {
  const safe = raw.replace(/\r?\n/g, ' ').trim();
  if (safe.includes(',') || safe.includes('"')) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

function renderKatexHtml(latex: string): string {
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      strict: false,
    });
  } catch {
    return `<code>${escapeHtml(latex)}</code>`;
  }
}

export function triggerFileDownload(
  content: BlobPart,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadOriginalPdf() {
  const a = document.createElement('a');
  a.href = ORIGINAL_CNN_PDF_URL;
  a.download = '03_Convolutional_Neural_Networks.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ============================================================================
   1. MARKDOWN BLUEPRINT (.md)
   ============================================================================ */
export function generateMarkdownBlueprint(slides: CnnSlide[]): string {
  const header = [
    '# 03. Convolutional Neural Networks (CNN) — Interactive Blueprint',
    '## Course: 03_Convolutional_Neural_Networks (33 Interactive Slides)',
    '## Instructor: Dr. Valy Dona | Languages: English & Khmer (ភាសាខ្មែរ)',
    '',
  ].join('\n');

  const body = slides
    .map((s) => {
      const lines: string[] = [
        `---`,
        `[SLIDE ${s.id} OF ${slides.length}] — ${s.kicker.en} (${s.category.toUpperCase()})`,
        '',
        `### ${s.title.en}`,
        `#### ${s.title.km}`,
        `> ${s.subtitle.en}`,
        `> ${s.subtitle.km}`,
        '',
        `**Key Points & Detailed Explanations:**`,
      ];

      s.keyPoints.forEach((pt, idx) => {
        lines.push(`${idx + 1}. **EN:** ${pt.en}`);
        lines.push(`   **KH:** ${pt.km}`);
        if (pt.detail) {
          lines.push(`   - *Detail (EN):* ${pt.detail.en}`);
          lines.push(`   - *ពន្យល់បន្ថែម (KH):* ${pt.detail.km}`);
        }
      });

      if (s.formula) {
        lines.push('');
        lines.push(`**Mathematical Formulation:**`);
        lines.push(`- Expression: \`${s.formula.expression}\``);
        lines.push(`- LaTeX: \`$$${s.formula.latex}$$\``);
        if (s.formula.derivationLatex) {
          lines.push(`- Derivation: \`$$${s.formula.derivationLatex}$$\``);
        }
        lines.push(`- Note: ${s.formula.caption.en} / ${s.formula.caption.km}`);
      }

      lines.push('');
      lines.push(`**Architecture & Tensor Specs:**`);
      lines.push(`- Input Tensor: \`${s.specs.inputTensor}\``);
      lines.push(`- Output Tensor: \`${s.specs.outputTensor}\``);
      lines.push(`- Operation: ${s.specs.operation}`);
      if (s.specs.metrics.length > 0) {
        lines.push(
          `- Metrics: ${s.specs.metrics
            .map((m) => `${m.label}: ${m.value}`)
            .join(' · ')}`
        );
      }
      if (s.specs.pytorchSnippet) {
        lines.push(`- PyTorch: \`${s.specs.pytorchSnippet.replace(/\n/g, ' ')}\``);
      }
      lines.push('');
      return lines.join('\n');
    })
    .join('\n');

  return `${header}\n${body}`;
}

/* ============================================================================
   2. ARCHITECTURE & SLIDE DATASET (.csv)
   ============================================================================ */
export function generateSlidesCsv(slides: CnnSlide[]): string {
  const columns = [
    'Slide_ID',
    'Category',
    'Kicker_EN',
    'Title_EN',
    'Title_KM',
    'Input_Tensor',
    'Output_Tensor',
    'Operation',
    'Metrics',
    'PyTorch_Snippet',
    'Formula_Expression',
    'LaTeX',
  ];

  const rows = slides.map((s) =>
    [
      String(s.id),
      s.category,
      s.kicker.en,
      s.title.en,
      s.title.km,
      s.specs.inputTensor,
      s.specs.outputTensor,
      s.specs.operation,
      s.specs.metrics.map((m) => `${m.label}: ${m.value}`).join(' | '),
      s.specs.pytorchSnippet,
      s.formula?.expression ?? '',
      s.formula?.latex ?? '',
    ]
      .map(escapeCsv)
      .join(',')
  );

  // UTF-8 BOM ensures Excel/Sheets render Khmer script properly on open
  return `\uFEFF${columns.join(',')}\n${rows.join('\n')}`;
}

/* ============================================================================
   3. MATHEMATICAL FORMULAS & PYTORCH SPECS (.tex)
   ============================================================================ */
export function generateFormulasLatex(slides: CnnSlide[]): string {
  const header = [
    '% 03. Convolutional Neural Networks (CNN) — Mathematical Formulas & Layer Specs',
    '% Prepared by Dr. Valy Dona · Bilingual Reference (33 Slides)',
    '',
    '\\section*{Core Convolutional Neural Network Equations}',
    '',
  ].join('\n');

  const formulaBlocks = slides
    .filter((s) => Boolean(s.formula))
    .map((s) => {
      const f = s.formula!;
      return [
        `% Slide ${s.id}: ${s.title.en}`,
        `\\subsection*{Slide ${s.id}: ${s.title.en}}`,
        `% Input: ${s.specs.inputTensor} -> Output: ${s.specs.outputTensor} (${s.specs.operation})`,
        `\\[`,
        `  ${f.latex}`,
        `\\]`,
        f.derivationLatex
          ? `\\[\\text{Derivation: } ${f.derivationLatex}\\]`
          : '',
        `% Note: ${f.caption.en} | ${f.caption.km}`,
        '',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return `${header}\n${formulaBlocks}`;
}

/* ============================================================================
   4. EDITABLE + EXACT FONT WEB SLIDES (.html)
   ============================================================================ */
export function exportEditableWebSlidesHtml(
  slides: CnnSlide[],
  language: LanguageMode
) {
  const slideCards = slides
    .map(
      (s) => `
      <article class="slide-card">
        <div class="slide-top">
          <span class="slide-meta">SLIDE ${s.id} OF ${slides.length} · ${escapeHtml(s.kicker.en.toUpperCase())}</span>
          <span class="slide-meta">${escapeHtml(s.specs.inputTensor)} → ${escapeHtml(s.specs.outputTensor)}</span>
        </div>

        ${
          language !== 'km'
            ? `<h2 contenteditable="true" class="slide-title-en">${escapeHtml(s.title.en)}</h2>`
            : ''
        }
        ${
          language !== 'en'
            ? `<h3 contenteditable="true" class="slide-title-km">${escapeHtml(s.title.km)}</h3>`
            : ''
        }
        <p contenteditable="true" class="slide-subtitle">
          ${language !== 'km' ? escapeHtml(s.subtitle.en) : ''}
          ${language === 'dual' ? '<br/>' : ''}
          ${language !== 'en' ? escapeHtml(s.subtitle.km) : ''}
        </p>

        <ol class="points-list">
          ${s.keyPoints
            .map(
              (pt) => `
              <li>
                ${
                  language !== 'km'
                    ? `<div contenteditable="true" class="pt-en">${escapeHtml(pt.en)}</div>`
                    : ''
                }
                ${
                  language !== 'en'
                    ? `<div contenteditable="true" class="pt-km">${escapeHtml(pt.km)}</div>`
                    : ''
                }
                ${
                  pt.detail
                    ? `<div contenteditable="true" class="pt-detail">
                        ${language !== 'km' ? `<div>${escapeHtml(pt.detail.en)}</div>` : ''}
                        ${language !== 'en' ? `<div class="pt-detail-km">${escapeHtml(pt.detail.km)}</div>` : ''}
                      </div>`
                    : ''
                }
              </li>`
            )
            .join('')}
        </ol>

        ${
          s.formula
            ? `<div class="formula-box">
                <div class="formula-label">Eq. (${s.id}) · Mathematical Formulation</div>
                ${renderKatexHtml(s.formula.latex)}
                ${s.formula.derivationLatex ? renderKatexHtml(s.formula.derivationLatex) : ''}
                <div contenteditable="true" class="formula-caption">
                  ${escapeHtml(s.formula.caption.en)} · ${escapeHtml(s.formula.caption.km)}
                </div>
              </div>`
            : ''
        }

        <div class="slide-footer">
          <span>Dr. Valy Dona · 03 Convolutional Neural Networks</span>
          <span class="mono">${escapeHtml(s.specs.operation)}</span>
        </div>
      </article>`
    )
    .join('\n');

  const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>03 Convolutional Neural Networks — Editable Web Slides (${language.toUpperCase()})</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Noto+Sans+Khmer:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Khmer', sans-serif;
      background: #0b1322;
      color: #0f172a;
      margin: 0;
      padding: 84px 20px 48px;
    }
    .toolbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 40;
      background: rgba(6, 11, 20, 0.94);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #1e293b;
      color: #f8fafc;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .toolbar-title { font-size: 14px; font-weight: 700; }
    .toolbar-sub { font-size: 12px; color: #94a3b8; }
    .toolbar-btn {
      background: #0284c7;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .toolbar-btn:hover { background: #0ea5e9; }
    .deck { max-width: 1020px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
    .slide-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 32px 36px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      page-break-after: always;
    }
    .slide-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .slide-title-en { margin: 0; font-size: 24px; color: #c2553a; }
    .slide-title-km { margin: 6px 0 0; font-size: 19px; color: #0f172a; font-family: 'Noto Sans Khmer', sans-serif; }
    .slide-subtitle { margin: 10px 0 18px; font-size: 13.5px; color: #475569; line-height: 1.6; }
    .points-list { margin: 0 0 18px; padding-left: 20px; font-size: 13.5px; line-height: 1.65; }
    .points-list li { margin-bottom: 12px; }
    .pt-en { font-weight: 600; color: #0f172a; }
    .pt-km { color: #9a3412; font-family: 'Noto Sans Khmer', sans-serif; margin-top: 2px; }
    .pt-detail {
      margin-top: 5px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12.5px;
      color: #334155;
    }
    .pt-detail-km { margin-top: 4px; font-family: 'Noto Sans Khmer', sans-serif; color: #475569; }
    .formula-box {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 16px;
      overflow-x: auto;
    }
    .formula-label { font-size: 11px; font-weight: 700; color: #0369a1; margin-bottom: 6px; }
    .formula-caption { font-size: 12px; color: #0c4a6e; margin-top: 8px; }
    .slide-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 11px;
      color: #64748b;
    }
    .mono { font-family: 'IBM Plex Mono', monospace; }
    [contenteditable="true"]:focus {
      outline: 2px solid #0ea5e9;
      border-radius: 4px;
      background: rgba(14, 165, 233, 0.06);
    }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none; }
      .slide-card { box-shadow: none; border: 1px solid #cbd5e1; margin-bottom: 18px; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <div class="toolbar-title">03. Convolutional Neural Networks — Editable + Exact-Font Web Slides (33 Slides)</div>
      <div class="toolbar-sub">ចុចលើអក្សរណាមួយដើម្បីកែសម្រួលផ្ទាល់ · Click any text to edit before printing or saving as PDF</div>
    </div>
    <button class="toolbar-btn" onclick="window.print()">Print / Save PDF</button>
  </div>
  <main class="deck">
    ${slideCards}
  </main>
</body>
</html>`;

  triggerFileDownload(
    fullHtml,
    '03_CNN_Editable_Web_Slides.html',
    'text/html;charset=utf-8'
  );
}

/* ============================================================================
   5. EDITABLE POWERPOINT (.pptx) WITH KHMER FONT XML
   ============================================================================ */
export async function exportEditablePptx(
  slides: CnnSlide[],
  language: LanguageMode
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Dr. Valy Dona';
  pptx.title = '03 Convolutional Neural Networks — Editable Lecture Deck';
  pptx.subject = 'Convolutional Neural Networks (33 Interactive Slides)';
  pptx.theme = {
    headFontFace: 'Kantumruy Pro',
    bodyFontFace: 'Kantumruy Pro',
  };

  slides.forEach((s) => {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Top accent rule
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.08,
      fill: { color: 'C2553A' },
      line: { color: 'C2553A', width: 0 },
    });

    // Header metadata line
    slide.addText(
      `SLIDE ${s.id} OF ${slides.length}  ·  ${s.kicker.en.toUpperCase()}`,
      {
        x: 0.55,
        y: 0.22,
        w: 6.5,
        h: 0.25,
        fontSize: 9.5,
        bold: true,
        fontFace: 'IBM Plex Mono',
        color: '64748B',
      }
    );

    slide.addText(`${s.specs.inputTensor}  →  ${s.specs.outputTensor}`, {
      x: 6.7,
      y: 0.22,
      w: 2.75,
      h: 0.25,
      fontSize: 9,
      bold: true,
      align: 'right',
      fontFace: 'IBM Plex Mono',
      color: '0369A1',
    });

    // Editable English + Khmer titles
    const titleLines: PptxGenJS.TextProps[] = [];
    if (language !== 'km') {
      titleLines.push({
        text: s.title.en,
        options: {
          fontSize: 20,
          bold: true,
          color: 'C2553A',
          fontFace: 'Plus Jakarta Sans',
          breakLine: true,
        },
      });
    }
    if (language !== 'en') {
      titleLines.push({
        text: s.title.km,
        options: {
          fontSize: 15.5,
          bold: true,
          color: '0F172A',
          fontFace: 'Kantumruy Pro',
          breakLine: false,
        },
      });
    }

    slide.addText(titleLines, {
      x: 0.55,
      y: 0.52,
      w: 8.9,
      h: language === 'dual' ? 0.92 : 0.58,
      valign: 'top',
    });

    const bodyStartY = language === 'dual' ? 1.52 : 1.22;

    // Key points editable box
    const bulletItems: PptxGenJS.TextProps[] = [];
    s.keyPoints.slice(0, 4).forEach((pt, idx) => {
      if (language !== 'km') {
        bulletItems.push({
          text: `${idx + 1}. ${pt.en}`,
          options: {
            fontSize: 11.5,
            bold: true,
            color: '1E293B',
            fontFace: 'Plus Jakarta Sans',
            breakLine: true,
          },
        });
      }
      if (language !== 'en') {
        bulletItems.push({
          text: `${language === 'km' ? `${idx + 1}. ` : '    '}${pt.km}`,
          options: {
            fontSize: 10.5,
            color: '9A3412',
            fontFace: 'Kantumruy Pro',
            breakLine: true,
          },
        });
      }
      if (pt.detail) {
        const detailText =
          language === 'km' ? pt.detail.km : pt.detail.en;
        bulletItems.push({
          text: `    ${detailText}`,
          options: {
            fontSize: 9.5,
            color: '475569',
            fontFace: language === 'km' ? 'Kantumruy Pro' : 'Plus Jakarta Sans',
            breakLine: true,
          },
        });
      }
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.55,
      y: bodyStartY,
      w: 8.9,
      h: s.formula ? 2.65 : 3.45,
      fill: { color: 'F8FAFC' },
      line: { color: 'E2E8F0', width: 1 },
      rectRadius: 0.08,
    });

    slide.addText(bulletItems, {
      x: 0.72,
      y: bodyStartY + 0.12,
      w: 8.56,
      h: s.formula ? 2.42 : 3.2,
      valign: 'top',
      paraSpaceAfter: 4,
    });

    // Formula box if present
    if (s.formula) {
      const fY = bodyStartY + 2.78;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.55,
        y: fY,
        w: 8.9,
        h: 0.78,
        fill: { color: 'F0F9FF' },
        line: { color: 'BAE6FD', width: 1 },
        rectRadius: 0.08,
      });

      slide.addText(
        [
          {
            text: `Eq. (${s.id}): ${s.formula.expression}`,
            options: {
              fontSize: 11.5,
              bold: true,
              color: '0369A1',
              fontFace: 'IBM Plex Mono',
              breakLine: true,
            },
          },
          {
            text:
              language === 'km'
                ? s.formula.caption.km
                : s.formula.caption.en,
            options: {
              fontSize: 9.5,
              color: '0C4A6E',
              fontFace:
                language === 'km' ? 'Kantumruy Pro' : 'Plus Jakarta Sans',
            },
          },
        ],
        {
          x: 0.72,
          y: fY + 0.08,
          w: 8.56,
          h: 0.64,
          valign: 'middle',
        }
      );
    }

    // Footer bar
    slide.addText(
      `Dr. Valy Dona · 03 Convolutional Neural Networks   |   ${s.specs.operation}`,
      {
        x: 0.55,
        y: 5.24,
        w: 8.9,
        h: 0.25,
        fontSize: 8.5,
        color: '64748B',
        fontFace: 'Plus Jakarta Sans',
      }
    );
  });

  await pptx.writeFile({ fileName: '03_CNN_Editable_Slides.pptx' });
}

/* ============================================================================
   6. 100% EXACT-FONT LOCKED SLIDES (.pptx via crisp Canvas 2D slide rasterizer)
   ============================================================================ */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      // Fallback character-split for long Khmer strings without spaces
      if (ctx.measureText(word).width > maxWidth) {
        let chunk = '';
        for (const ch of word) {
          if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        current = chunk;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function renderSlideToCanvasDataUrl(
  s: CnnSlide,
  total: number,
  language: LanguageMode
): string {
  const W = 1280;
  const H = 720;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // White academic slide background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Top terracotta accent bar
  ctx.fillStyle = '#C2553A';
  ctx.fillRect(0, 0, W, 10);

  // Header metadata
  ctx.fillStyle = '#64748B';
  ctx.font = '600 14px "IBM Plex Mono", monospace';
  ctx.fillText(`SLIDE ${s.id} OF ${total}  ·  ${s.kicker.en.toUpperCase()}`, 56, 46);

  ctx.fillStyle = '#0369A1';
  ctx.textAlign = 'right';
  ctx.fillText(`${s.specs.inputTensor} → ${s.specs.outputTensor}`, W - 56, 46);
  ctx.textAlign = 'left';

  // Hairline divider
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(56, 62);
  ctx.lineTo(W - 56, 62);
  ctx.stroke();

  let cursorY = 104;

  // English Title
  if (language !== 'km') {
    ctx.fillStyle = '#C2553A';
    ctx.font = '700 28px "Plus Jakarta Sans", "Noto Sans Khmer", sans-serif';
    const enTitleLines = wrapCanvasText(ctx, s.title.en, W - 112).slice(0, 2);
    enTitleLines.forEach((line) => {
      ctx.fillText(line, 56, cursorY);
      cursorY += 34;
    });
  }

  // Khmer Title
  if (language !== 'en') {
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 22px "Noto Sans Khmer", "Plus Jakarta Sans", sans-serif';
    const kmTitleLines = wrapCanvasText(ctx, s.title.km, W - 112).slice(0, 2);
    kmTitleLines.forEach((line) => {
      ctx.fillText(line, 56, cursorY);
      cursorY += 32;
    });
  }

  cursorY += 6;

  // Content box height
  const formulaBoxH = s.formula ? 104 : 0;
  const footerY = H - 46;
  const contentBoxTop = cursorY;
  const contentBoxH = footerY - 24 - formulaBoxH - (s.formula ? 16 : 0) - contentBoxTop;

  drawRoundedRect(ctx, 56, contentBoxTop, W - 112, contentBoxH, 14);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Render Key Points + Details inside content box
  let ptY = contentBoxTop + 34;
  const maxContentY = contentBoxTop + contentBoxH - 16;

  s.keyPoints.forEach((pt, idx) => {
    if (ptY > maxContentY) return;

    if (language !== 'km') {
      ctx.fillStyle = '#0F172A';
      ctx.font = '600 16px "Plus Jakarta Sans", "Noto Sans Khmer", sans-serif';
      const enLines = wrapCanvasText(ctx, `${idx + 1}. ${pt.en}`, W - 164).slice(0, 2);
      enLines.forEach((line) => {
        if (ptY <= maxContentY) {
          ctx.fillText(line, 80, ptY);
          ptY += 22;
        }
      });
    }

    if (language !== 'en' && ptY <= maxContentY) {
      ctx.fillStyle = '#9A3412';
      ctx.font = '600 15px "Noto Sans Khmer", "Plus Jakarta Sans", sans-serif';
      const prefix = language === 'km' ? `${idx + 1}. ` : '    ';
      const kmLines = wrapCanvasText(ctx, `${prefix}${pt.km}`, W - 164).slice(0, 2);
      kmLines.forEach((line) => {
        if (ptY <= maxContentY) {
          ctx.fillText(line, 80, ptY);
          ptY += 22;
        }
      });
    }

    if (pt.detail && ptY <= maxContentY - 12) {
      const detailTxt = language === 'km' ? pt.detail.km : pt.detail.en;
      ctx.fillStyle = '#475569';
      ctx.font =
        language === 'km'
          ? '400 13.5px "Noto Sans Khmer", "Plus Jakarta Sans", sans-serif'
          : '400 13.5px "Plus Jakarta Sans", "Noto Sans Khmer", sans-serif';
      const dLines = wrapCanvasText(ctx, `    ${detailTxt}`, W - 172).slice(0, 2);
      dLines.forEach((line) => {
        if (ptY <= maxContentY) {
          ctx.fillText(line, 80, ptY);
          ptY += 19;
        }
      });
    }

    ptY += 10;
  });

  // Formula block
  if (s.formula) {
    const fTop = footerY - 24 - formulaBoxH;
    drawRoundedRect(ctx, 56, fTop, W - 112, formulaBoxH, 12);
    ctx.fillStyle = '#F0F9FF';
    ctx.fill();
    ctx.strokeStyle = '#BAE6FD';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0369A1';
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Eq. (${s.id}) · Mathematical Formulation`, 78, fTop + 26);

    ctx.fillStyle = '#0F172A';
    ctx.font = '600 18px "IBM Plex Mono", monospace';
    ctx.fillText(s.formula.expression, 78, fTop + 56);

    ctx.fillStyle = '#0C4A6E';
    ctx.font = '400 13.5px "Noto Sans Khmer", "Plus Jakarta Sans", sans-serif';
    const cap = language === 'km' ? s.formula.caption.km : s.formula.caption.en;
    ctx.fillText(cap, 78, fTop + 84);
  }

  // Footer
  ctx.strokeStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.moveTo(56, footerY - 18);
  ctx.lineTo(W - 56, footerY - 18);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Dr. Valy Dona · 03 Convolutional Neural Networks', 56, footerY + 6);

  ctx.textAlign = 'right';
  ctx.font = '500 12.5px "IBM Plex Mono", monospace';
  ctx.fillText(s.specs.operation, W - 56, footerY + 6);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

export async function exportExactFontPptx(
  slides: CnnSlide[],
  language: LanguageMode,
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Dr. Valy Dona';
  pptx.title = '03 Convolutional Neural Networks — Exact Font Locked Slides';

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const dataUrl = renderSlideToCanvasDataUrl(s, slides.length, language);
    const slide = pptx.addSlide();
    slide.addImage({
      data: dataUrl,
      x: 0,
      y: 0,
      w: 10,
      h: 5.625,
    });
    if (onProgress) {
      onProgress(i + 1, slides.length);
    }
    // Yield briefly so progress text updates cleanly in UI
    if (i % 4 === 3) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  await pptx.writeFile({ fileName: '03_CNN_Exact_Font_Locked_Slides.pptx' });
}
