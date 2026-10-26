import React from 'react';
import { cn } from '../../utils/cn';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  const variants = {
    neutral: 'bg-surface-elevated text-text-secondary border-border',
    success: 'bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/25 font-medium',
    pending: 'bg-[var(--status-pending)]/10 text-[var(--status-pending)] border-[var(--status-pending)]/30 font-medium',
    warning: 'bg-[var(--status-warning)]/10 text-[var(--status-warning)] border-[var(--status-warning)]/30 font-medium',
    error: 'bg-[var(--status-error)]/10 text-[var(--status-error)] border-[var(--status-error)]/25 font-medium',
    danger: 'bg-[var(--status-error)]/10 text-[var(--status-error)] border-[var(--status-error)]/25 font-medium',
    info: 'bg-accent/10 text-accent border-accent/25 font-medium',
    outline: 'bg-transparent text-text-secondary border-border',
  };

  const dotColors = {
    neutral: 'bg-text-muted',
    success: 'bg-[var(--status-success)]',
    pending: 'bg-[var(--status-pending)]',
    warning: 'bg-[var(--status-warning)]',
    error: 'bg-[var(--status-error)]',
    danger: 'bg-[var(--status-error)]',
    info: 'bg-accent',
    outline: 'bg-text-muted',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-normal',
    md: 'text-xs px-2.5 py-0.5 font-medium tracking-normal',
    lg: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-sans',
        variants[variant] || variants.neutral,
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant] || dotColors.neutral)}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
