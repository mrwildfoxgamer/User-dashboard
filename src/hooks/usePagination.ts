import { useState, useCallback, useMemo, useEffect } from 'react';

export const PAGE_SIZE = 5;

export interface PaginationResult<T> {
  page: number;
  totalPages: number;
  pageItems: T[];
  goTo: (page: number) => void;
  prev: () => void;
  next: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>(items: T[], pageSize = PAGE_SIZE): PaginationResult<T> {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the source list changes (filter/sort change)
  useEffect(() => {
    setPage(1);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  const goTo = useCallback(
    (p: number) => setPage(Math.min(Math.max(1, p), totalPages)),
    [totalPages]
  );
  const prev = useCallback(() => goTo(page - 1), [goTo, page]);
  const next = useCallback(() => goTo(page + 1), [goTo, page]);

  const startIndex = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, items.length);

  return {
    page,
    totalPages,
    pageItems,
    goTo,
    prev,
    next,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    startIndex,
    endIndex,
  };
}
