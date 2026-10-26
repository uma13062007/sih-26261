import React from 'react';
import { Layers } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No records found',
  message = 'There are no items matching your criteria or currently available in this view.',
  icon: Icon = Layers,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-text-muted mb-3">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-xs text-text-secondary max-w-sm mt-1 leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
