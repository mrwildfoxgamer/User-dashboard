import { memo } from 'react';
import type { PaginationResult } from '../hooks/usePagination';

type Props = Pick<
  PaginationResult<unknown>,
  'page' | 'totalPages' | 'prev' | 'next' | 'hasPrev' | 'hasNext' | 'startIndex' | 'endIndex'
> & { totalItems: number };

const btnBase =
  'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition';

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
      <p className="text-sm text-slate-400 dark:text-slate-500">
        Showing{' '}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {startIndex}–{endIndex}
        </span>{' '}
        of{' '}
        <span className="font-medium text-slate-600 dark:text-slate-300">{totalItems}</span> users
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={prev}
          disabled={!hasPrev}
          className={`${btnBase} border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700`}
          aria-label="Previous page"
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-slate-400 text-sm select-none dark:text-slate-500"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              disabled={p === page}
              className={`${btnBase} ${
                p === page
                  ? 'bg-slate-800 text-white cursor-default dark:bg-slate-100 dark:text-slate-900'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={next}
          disabled={!hasNext}
          className={`${btnBase} border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700`}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
});

export default Pagination;
