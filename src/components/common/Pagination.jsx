import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-surface border-t border-border text-xs text-text-secondary', className)}>
      <div>
        Showing <span className="font-semibold text-text-primary">{startItem}</span> to{' '}
        <span className="font-semibold text-text-primary">{endItem}</span> of{' '}
        <span className="font-semibold text-text-primary">{totalItems}</span> applications
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface-elevated text-text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed shadow-subtle transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1 px-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'w-7 h-7 rounded-lg text-xs font-medium transition-colors font-mono',
                  isCurrent
                    ? 'bg-accent text-accent-foreground shadow-subtle font-bold'
                    : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface-elevated text-text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed shadow-subtle transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
