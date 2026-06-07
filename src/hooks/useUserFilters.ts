import { useState, useMemo, useCallback } from 'react';
import { filterAndSort, getUnique, DEFAULT_FILTERS } from '../utils/filterUsers';
import type { FilterState } from '../utils/filterUsers';
import type { User } from '../types';

interface UseUserFiltersReturn {
  filters: FilterState;
  showFavoritesOnly: boolean;
  filtered: User[];
  cities: string[];
  companies: string[];
  patchFilters: (patch: Partial<FilterState>) => void;
  reset: () => void;
  toggleFavoritesOnly: () => void;
}

/**
 * Encapsulates all filter/sort/favorites-only state and derived values.
 * Accepts the raw user list and a Set of favorited ids.
 */
export function useUserFilters(
  users: User[] | null,
  favorites: ReadonlySet<number>
): UseUserFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const list = users ?? [];

  const cities = useMemo(() => getUnique(list, 'city'), [list]);
  const companies = useMemo(() => getUnique(list, 'company'), [list]);

  const filtered = useMemo(() => {
    let result = filterAndSort(list, filters);
    if (showFavoritesOnly) result = result.filter((u) => favorites.has(u.id));
    return result;
  }, [list, filters, showFavoritesOnly, favorites]);

  const patchFilters = useCallback(
    (patch: Partial<FilterState>) => setFilters((f) => ({ ...f, ...patch })),
    []
  );

  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setShowFavoritesOnly(false);
  }, []);

  const toggleFavoritesOnly = useCallback(() => {
    setShowFavoritesOnly((v) => !v);
  }, []);

  return { filters, showFavoritesOnly, filtered, cities, companies, patchFilters, reset, toggleFavoritesOnly };
}
