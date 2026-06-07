import { memo } from 'react';
import type { PaginationResult } from '../hooks/usePagination';

type Props = Pick<
  PaginationResult<unknown>,
  'page' | 'totalPages' | 'prev' | 'next' | 'hasPrev' | 'hasNext' | 'startIndex' | 'endIndex'
> & { totalItems: number };

const Pagination = memo(function Pagination({
  page,
  totalPages,
  prev,
  next,
  hasPrev,
  hasNext,
  startIndex,
  endIndex,
  totalItems,
}: Props) {
  if (totalPages <= 1) return null;

  // Build page number buttons: always show first, last, current ±1
  const pages: (number | '…')[] = [];
  const addPage = (p: number) => {
    if (!pages.includes(p) && p >= 1 && p <= totalPages) pages.push(p);
  };

  addPage(1);
  if (page - 2 > 2) pages.push('…');
  addPage(page - 1);
  addPage(page);
  addPage(page + 1);
  if (page + 2 < totalPages - 1) pages.push('…');
  addPage(totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
      {/* Range label */}
      <p className="text-sm text-slate-400">
        Showing <span className="font-medium text-slate-600">{startIndex}–{endIndex}</span> of{' '}
        <span className="font-medium text-slate-600">{totalItems}</span> users
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={prev}
          disabled={!hasPrev}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white
                     text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed
                     disabled:opacity-40"
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-slate-400 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              disabled={p === page}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition
                ${p === page
                  ? 'bg-slate-800 text-white cursor-default'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={next}
          disabled={!hasNext}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white
                     text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed
                     disabled:opacity-40"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
});

export default Pagination;
