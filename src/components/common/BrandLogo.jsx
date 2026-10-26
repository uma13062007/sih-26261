import React from 'react';

export default function BrandLogo({ size = 'md', showSubtitle = true }) {
  const symbolSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-bold',
    lg: 'text-lg font-extrabold',
  };

  return (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Precision Node Symbol */}
      <div className={`${symbolSizes[size] || symbolSizes.md} rounded-lg bg-surface-elevated border border-border flex items-center justify-center relative overflow-hidden transition-colors group-hover:border-accent shrink-0`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" stroke="currentColor">
          <path
            d="M6 8L12 4.5L18 8L12 11.5L6 8Z"
            stroke="var(--accent)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 11.5V19.5"
            stroke="var(--accent-secondary)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 16L12 12.5L18 16L12 19.5L6 16Z"
            stroke="var(--accent-secondary)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12.5" r="1.5" fill="var(--accent)" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col text-left leading-none">
        <span className={`${textSizes[size] || textSizes.md} tracking-wider text-text-primary font-sans font-semibold group-hover:text-accent transition-colors`}>
          NIYANTRAN
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase mt-0.5">
            Evidence-backed verification
          </span>
        )}
      </div>
    </div>
  );
}
