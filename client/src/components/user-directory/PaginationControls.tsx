'use client';

import { type FormEvent, useEffect, useState } from 'react';

const LIMIT_OPTIONS = [10, 20, 50, 100] as const;

type Props = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  disabled?: boolean;
};

export function PaginationControls({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  disabled,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const [pageDraft, setPageDraft] = useState(String(page));

  useEffect(() => {
    setPageDraft(String(page));
  }, [page]);

  function commitPageInput() {
    const n = parseInt(pageDraft, 10);
    if (!Number.isFinite(n)) {
      setPageDraft(String(page));
      return;
    }
    const clamped = Math.min(totalPages, Math.max(1, Math.floor(n)));
    setPageDraft(String(clamped));
    onPageChange(clamped);
  }

  function handlePageFormSubmit(e: FormEvent) {
    e.preventDefault();
    commitPageInput();
  }

  return (
    <div className="mt-8 flex flex-col gap-6 border-t border-[#e9ecef] pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <label className="flex flex-col gap-1 text-sm text-[#6c757d]">
          <span className="font-medium text-[#343a40]">Page size</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={disabled}
            className="min-h-11 rounded-lg border border-[#e9ecef] bg-white px-3 py-2 text-sm text-[#343a40] shadow-sm outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!(LIMIT_OPTIONS as readonly number[]).includes(limit) ? (
              <option value={limit}>{limit} per page (URL)</option>
            ) : null}
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} per page
              </option>
            ))}
          </select>
        </label>

        <form
          onSubmit={handlePageFormSubmit}
          className="flex flex-col gap-1 sm:items-end"
        >
          <span className="text-sm font-medium text-[#343a40]">Go to page</span>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageDraft}
              onChange={(e) => setPageDraft(e.target.value)}
              onBlur={commitPageInput}
              disabled={disabled}
              className="min-h-11 w-24 rounded-lg border border-[#e9ecef] bg-white px-3 py-2 text-sm text-[#343a40] shadow-sm outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
              aria-label="Page number"
            />
            <button
              type="submit"
              disabled={disabled}
              className="min-h-11 rounded-lg border border-[#e9ecef] bg-white px-4 py-2 text-sm font-medium text-[#343a40] transition-colors hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Go
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-[#6c757d]">
          Page <span className="font-medium text-[#343a40]">{page}</span> of{' '}
          <span className="font-medium text-[#343a40]">{totalPages}</span>
          <span className="mx-2 text-[#adb5bd]">·</span>
          <span className="font-medium text-[#343a40]">{total}</span> users
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={disabled || !canPrev}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-[#e9ecef] bg-white px-4 py-2 text-sm font-medium text-[#343a40] transition-colors hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={disabled || !canNext}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-[#e9ecef] bg-white px-4 py-2 text-sm font-medium text-[#343a40] transition-colors hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
