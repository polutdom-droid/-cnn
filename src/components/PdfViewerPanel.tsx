import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface PdfViewerPanelProps {
  slideId: number;
}

const PDF_URL = '/assets/aistudio/03_Convolutional_Neural_Networks_91f7f254.pdf';

export const PdfViewerPanel: React.FC<PdfViewerPanelProps> = ({ slideId }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b1322] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-100">
            Original Lecture PDF · Page {slideId} of 33
          </span>
        </div>
        <a
          href={`${PDF_URL}#page=${slideId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <span>Open PDF Page {slideId}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="bg-slate-900 h-[620px] w-full">
        <iframe
          key={slideId}
          src={`${PDF_URL}#page=${slideId}&view=FitH`}
          title={`CNN Lecture PDF Page ${slideId}`}
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
};
