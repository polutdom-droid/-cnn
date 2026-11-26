import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  latex,
  displayMode = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    try {
      katex.render(latex, el, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      el.textContent = latex;
    }
  }, [latex, displayMode]);

  return (
    <span
      ref={containerRef}
      className={`${displayMode ? 'block overflow-x-auto py-1' : 'inline-block align-middle'} ${className}`}
    />
  );
};
