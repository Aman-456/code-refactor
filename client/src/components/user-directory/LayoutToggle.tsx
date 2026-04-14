'use client';

import type { DirectoryLayout } from '@/types/directory-layout';

type Props = {
  layout: DirectoryLayout;
  onLayoutChange: (layout: DirectoryLayout) => void;
  disabled?: boolean;
};

export function LayoutToggle({ layout, onLayoutChange, disabled }: Props) {
  return (
    <div
      className="inline-flex rounded-lg border border-[#e9ecef] bg-[#f8f9fa] p-1 shadow-sm"
      role="group"
      aria-label="Card layout"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onLayoutChange('list')}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          layout === 'list'
            ? 'bg-white text-[#212529] shadow-sm'
            : 'text-[#6c757d] hover:text-[#343a40]'
        }`}
        aria-pressed={layout === 'list'}
      >
        Full width
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onLayoutChange('grid')}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          layout === 'grid'
            ? 'bg-white text-[#212529] shadow-sm'
            : 'text-[#6c757d] hover:text-[#343a40]'
        }`}
        aria-pressed={layout === 'grid'}
      >
        Grid
      </button>
    </div>
  );
}
